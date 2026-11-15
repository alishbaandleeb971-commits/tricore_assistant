import { uuidv7 } from "uuidv7";
import { maskPII } from "@tricore/shared";
import { checkRateLimit } from "../services/rateLimiter.js";
import { retrieveKnowledgeChunks } from "../services/retrieval.js";
import { ModelGateway } from "../services/modelGateway.js";
import { applyAnswerGuard } from "../services/answerGuard.js";
import { checkAndRecordSpend } from "../services/budgetGate.js";
import { recordVisitorConsent } from "../services/consent.js";
import { createLeadAndOutboxBatch } from "../services/leadOutbox.js";

// ---------------------------------------------------------------------------
// SDD §6.2 conversation stages
// ---------------------------------------------------------------------------
export type ConvStage =
  | "Chatting"
  | "LeadConsent"
  | "LeadCollecting"
  | "LeadConfirm"
  | "HandoverPending"
  | "LiveChat"
  | "CallbackForm"
  | "DetailsOnly"
  | "Closed";

// ---------------------------------------------------------------------------
// Lead collection state kept in DO memory + storage
// ---------------------------------------------------------------------------
interface LeadState {
  consentId: string | null;
  name: string | null;
  email: string | null;
  serviceSlug: string | null;
  phone: string | null;
  currency: string | null;
  budgetRangeId: string | null;
  timelineOptionId: string | null;
  description: string | null;
  currentField: LeadField;
  retries: number;
}

type LeadField =
  | "consent"
  | "name"
  | "email"
  | "service"
  | "phone"
  | "currency"
  | "budgetRange"
  | "timeline"
  | "description"
  | "confirm"
  | "done";

// ---------------------------------------------------------------------------
// API types
// ---------------------------------------------------------------------------
export interface ConversationTurnRequest {
  clientMessageId?: string;
  content: string;
}

export interface Button {
  label: string;
  value: string;
}

export interface LeadConfirmCard {
  name: string;
  email: string;
  service: string;
  phone?: string;
  currency?: string;
  description?: string;
}

export interface ConversationTurnResponse {
  messageId: string;
  seq: number;
  reply: string;
  usedChunkIds: string[];
  stage: ConvStage;
  intent: string;
  buttons?: Button[];
  confirmCard?: LeadConfirmCard;
  leadId?: string;
}

export interface WorkerEnv {
  DB: D1Database;
  NOTIFY?: Queue;
  AI_API_KEY?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Consent wording (SDD §10.1 / BR-010 / BR-011)
// ---------------------------------------------------------------------------
const CONSENT_WORDING_VERSION = 1;
const CONSENT_TEXT =
  "TriCore Digital Tech would like to collect your name, email, and service preference so our team can prepare a custom proposal and follow up with you. Your details are used only for this purpose and will not be shared with third parties. Do you agree?";

// The 8 official services as buttons (design invariant)
const SERVICE_BUTTONS: Button[] = [
  { label: "AI Services", value: "ai-services" },
  { label: "Digital Marketing", value: "digital-marketing" },
  { label: "Web Development", value: "web-development" },
  { label: "Graphic Designing", value: "graphic-designing" },
  { label: "SEO", value: "seo" },
  { label: "Video Editing", value: "video-editing" },
  { label: "Mobile App Development", value: "mobile-app-development" },
  { label: "WordPress Development", value: "wordpress-development" },
];

const CURRENCY_BUTTONS: Button[] = [
  { label: "USD (US Dollar)", value: "USD" },
  { label: "PKR (Pakistani Rupee)", value: "PKR" },
];

// Email validation
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function isQuoteRequest(text: string, intent: string): boolean {
  const l = text.toLowerCase();
  if (intent === "pricing_inquiry") return true;
  return (
    l.includes("quote") ||
    l.includes("proposal") ||
    l.includes("hire") ||
    l.includes("start a project") ||
    l.includes("get started") ||
    l.includes("want to work") ||
    l.includes("interested in working") ||
    l.includes("want to hire")
  );
}

function looksLikeYes(text: string): boolean {
  const l = text.trim().toLowerCase();
  return (
    l === "yes" ||
    l === "y" ||
    l === "agree" ||
    l === "i agree" ||
    l === "ok" ||
    l === "sure" ||
    l.startsWith("yes,") ||
    l.startsWith("yes.")
  );
}

function looksLikeNo(text: string): boolean {
  const l = text.trim().toLowerCase();
  return (
    l === "no" ||
    l === "n" ||
    l === "nope" ||
    l === "decline" ||
    l === "disagree" ||
    l.startsWith("no,") ||
    l.startsWith("no.")
  );
}

function looksLikeSkip(text: string): boolean {
  const l = text.trim().toLowerCase();
  return l === "skip" || l === "s" || l === "next" || l === "pass" || l === "no thanks" || l === "no, thanks";
}

function looksLikeQuestion(text: string): boolean {
  const l = text.trim();
  return (
    l.endsWith("?") ||
    /^(what|how|why|when|where|who|do you|can you|does|is|are|will)/i.test(l)
  );
}

// ---------------------------------------------------------------------------
// Stored state shape
// ---------------------------------------------------------------------------
interface StoredConvState {
  stage: ConvStage;
  leadState: LeadState | null;
  seq: number;
  conversationId: string | null;
  sessionId: string | null;
  activeHandoverId: string | null;
  handoverDeadlineAt: number | null;
  pendingLeadField: LeadField | null;
}

// ===========================================================================
// ConversationDO
// ===========================================================================
export class ConversationDO {
  private state: DurableObjectState;
  private env: WorkerEnv;
  private loaded = false;

  // All mutable fields — restored from DO storage on first use
  private stage: ConvStage = "Chatting";
  private leadState: LeadState | null = null;
  private seq = 0;
  private conversationId: string | null = null;
  private sessionId: string | null = null;
  private activeHandoverId: string | null = null;
  private handoverDeadlineAt: number | null = null;
  private pendingLeadField: LeadField | null = null;

  constructor(state: DurableObjectState, env: WorkerEnv) {
    this.state = state;
    this.env = env;
  }

  // -------------------------------------------------------------------------
  // Load persisted state from DO storage (called before every handler)
  // -------------------------------------------------------------------------
  private async ensureLoaded(): Promise<void> {
    if (this.loaded) return;
    this.loaded = true;
    if (this.state.storage?.get) {
      const stored = await this.state.storage.get<StoredConvState>("conv");
      if (stored) {
        this.stage = stored.stage;
        this.leadState = stored.leadState;
        this.seq = stored.seq;
        this.conversationId = stored.conversationId;
        this.sessionId = stored.sessionId;
        this.activeHandoverId = stored.activeHandoverId;
        this.handoverDeadlineAt = stored.handoverDeadlineAt;
        this.pendingLeadField = stored.pendingLeadField;
      }
    }
  }

  // Persist all mutable state after every event
  private async save(): Promise<void> {
    if (!this.state.storage?.put) return;
    const payload: StoredConvState = {
      stage: this.stage,
      leadState: this.leadState,
      seq: this.seq,
      conversationId: this.conversationId,
      sessionId: this.sessionId,
      activeHandoverId: this.activeHandoverId,
      handoverDeadlineAt: this.handoverDeadlineAt,
      pendingLeadField: this.pendingLeadField,
    };
    await this.state.storage.put("conv", payload);
  }

  // -------------------------------------------------------------------------
  // alarm() — 3-minute handover timeout
  // -------------------------------------------------------------------------
  async alarm(): Promise<void> {
    await this.ensureLoaded();
    if (this.state.storage?.deleteAlarm) {
      await this.state.storage.deleteAlarm().catch(() => {});
    }
    if (this.activeHandoverId) {
      await this.env.DB.prepare(
        "UPDATE handover_request SET status = 'timed_out', outcome = 'unanswered_fallback' WHERE id = ?"
      )
        .bind(this.activeHandoverId)
        .run();
      this.activeHandoverId = null;
      this.handoverDeadlineAt = null;
      this.stage = "CallbackForm";
      await this.save();
    }
  }

  // -------------------------------------------------------------------------
  // requestHandover()
  // -------------------------------------------------------------------------
  async requestHandover(): Promise<{ handoverId: string; status: string; deadlineAt: number }> {
    await this.ensureLoaded();
    const handoverId = uuidv7();
    const now = Date.now();
    const deadlineAt = now + 180_000;

    this.activeHandoverId = handoverId;
    this.handoverDeadlineAt = deadlineAt;
    this.stage = "HandoverPending";

    if (this.state.storage?.setAlarm) {
      await this.state.storage.setAlarm(deadlineAt);
    }

    const convId = this.conversationId || uuidv7();

    await this.env.DB.prepare(
      `INSERT INTO handover_request (id, conversation_id, status, requested_at, deadline_at)
       VALUES (?, ?, 'pending', ?, ?)`
    )
      .bind(handoverId, convId, now, deadlineAt)
      .run();

    await this.save();
    return { handoverId, status: "pending", deadlineAt };
  }

  // -------------------------------------------------------------------------
  // acceptHandover()
  // -------------------------------------------------------------------------
  async acceptHandover(staffUserId: string): Promise<boolean> {
    await this.ensureLoaded();
    if (!this.activeHandoverId) return false;

    if (this.state.storage?.deleteAlarm) {
      await this.state.storage.deleteAlarm();
    }

    await this.env.DB.prepare(
      "UPDATE handover_request SET status = 'accepted', accepted_by = ? WHERE id = ?"
    )
      .bind(staffUserId, this.activeHandoverId)
      .run();

    this.activeHandoverId = null;
    this.handoverDeadlineAt = null;
    this.stage = "LiveChat";
    await this.save();
    return true;
  }

  // -------------------------------------------------------------------------
  // fetch() — HTTP entry from Worker route
  // -------------------------------------------------------------------------
  async fetch(request: Request): Promise<Response> {
    await this.ensureLoaded();
    const url = new URL(request.url);

    if (url.pathname.endsWith("/turn") && request.method === "POST") {
      const body = (await request.json()) as ConversationTurnRequest & {
        sessionId?: string;
        conversationId?: string;
      };
      if (body.sessionId) this.sessionId = body.sessionId;
      if (body.conversationId) this.conversationId = body.conversationId;
      if (!this.conversationId) this.conversationId = uuidv7();

      const res = await this.handleTurn(body);
      return new Response(JSON.stringify(res), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.pathname.endsWith("/handover") && request.method === "POST") {
      const body = (await request.json().catch(() => ({}))) as {
        sessionId?: string;
        conversationId?: string;
      };
      if (body.sessionId) this.sessionId = body.sessionId;
      if (body.conversationId) this.conversationId = body.conversationId;
      const ho = await this.requestHandover();
      return new Response(JSON.stringify(ho), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.pathname.endsWith("/alarm") && request.method === "POST") {
      await this.alarm();
      return new Response(JSON.stringify({ status: "alarm_fired" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not found", { status: 404 });
  }

  // -------------------------------------------------------------------------
  // init()
  // -------------------------------------------------------------------------
  async init(conversationId: string, sessionId: string) {
    await this.ensureLoaded();
    this.conversationId = conversationId;
    this.sessionId = sessionId;
    await this.save();
  }

  // ===========================================================================
  // handleTurn() — SDD §6.4 precedence router
  // ===========================================================================
  async handleTurn(req: ConversationTurnRequest): Promise<ConversationTurnResponse> {
    const rawContent = req.content || "";
    const maskedContent = maskPII(rawContent);

    // Rule 1: rate limit
    const rateCheck = await checkRateLimit(
      this.env.DB,
      this.sessionId || "default",
      maskedContent.length
    );
    if (!rateCheck.allowed) {
      await this.save();
      return this.rateResponse(rateCheck);
    }

    // Rule 2: budget gate
    const budget = await checkAndRecordSpend(this.env.DB, 1500);
    if (!budget.allowed) {
      await this.save();
      return this.budgetResponse();
    }

    // Rule 3: live chat active
    if (this.stage === "LiveChat") {
      await this.save();
      return this.simpleResponse("You are connected with our team. Please wait for a staff reply.");
    }

    // Rule 4: handover pending
    if (this.stage === "HandoverPending") {
      await this.save();
      return this.simpleResponse(
        "Our team has been notified. We'll be with you shortly. If you'd prefer a callback, type 'callback'."
      );
    }

    // Rule 6: scripted lead flow in progress (priority over AI)
    if (
      this.stage === "LeadConsent" ||
      this.stage === "LeadCollecting" ||
      this.stage === "LeadConfirm"
    ) {
      return this.handleLeadTurn(maskedContent, req.clientMessageId);
    }

    // Rule 7: Chatting — AI-powered reply
    return this.handleChattingTurn(maskedContent, req.clientMessageId);
  }

  // ===========================================================================
  // handleChattingTurn — normal AI reply + quote-trigger detection
  // ===========================================================================
  private async handleChattingTurn(
    maskedContent: string,
    clientMessageId?: string
  ): Promise<ConversationTurnResponse> {
    const retrieved = await retrieveKnowledgeChunks(this.env.DB, maskedContent, 4);
    const approvedChunkIds = retrieved.map((r) => r.chunkId);

    const gateway = new ModelGateway({ apiKey: this.env.AI_API_KEY });
    const aiRes = await gateway.generateResponse(maskedContent, retrieved);

    const guarded = applyAnswerGuard(aiRes.answer, aiRes.usedChunkIds, approvedChunkIds);

    const replyMsgId = uuidv7();
    const visitorMsgId = uuidv7();
    const now = Date.now();
    const convId = this.conversationId || uuidv7();
    const visitorSeq = ++this.seq;
    const assistantSeq = ++this.seq;

    await this.env.DB.batch([
      this.env.DB.prepare(
        `INSERT OR IGNORE INTO conversation (id, session_id, stage, outcome, is_test, est_cost, created_at, updated_at)
         VALUES (?, ?, ?, 'in_progress', 0, 1500, ?, ?)`
      ).bind(convId, this.sessionId || "default-session", this.stage, now, now),

      this.env.DB.prepare(
        `INSERT INTO message (id, conversation_id, seq, sender, content_masked, intent, client_message_id, created_at)
         VALUES (?, ?, ?, 'visitor', ?, ?, ?, ?)`
      ).bind(visitorMsgId, convId, visitorSeq, maskedContent, aiRes.intent, clientMessageId || null, now),

      this.env.DB.prepare(
        `INSERT INTO message (id, conversation_id, seq, sender, content_masked, intent, answerable, used_chunk_ids, created_at)
         VALUES (?, ?, ?, 'assistant', ?, ?, 1, ?, ?)`
      ).bind(
        replyMsgId,
        convId,
        assistantSeq,
        guarded.guardedAnswer,
        aiRes.intent,
        JSON.stringify(guarded.validChunkIds),
        now
      ),
    ]);

    // Detect quote request → start lead flow (SDD §6.2, §6.4)
    if (isQuoteRequest(maskedContent, aiRes.intent)) {
      this.stage = "LeadConsent";
      this.leadState = {
        consentId: null,
        name: null,
        email: null,
        serviceSlug: null,
        phone: null,
        currency: null,
        budgetRangeId: null,
        timelineOptionId: null,
        description: null,
        currentField: "consent",
        retries: 0,
      };
      await this.save();

      const consentPrompt =
        "\n\nTo prepare a proposal for you, I need to collect a few details. " + CONSENT_TEXT;

      return {
        messageId: replyMsgId,
        seq: assistantSeq,
        reply: guarded.guardedAnswer + consentPrompt,
        usedChunkIds: guarded.validChunkIds,
        stage: this.stage,
        intent: aiRes.intent,
        buttons: [
          { label: "✅ Yes, I agree", value: "yes" },
          { label: "❌ No thanks", value: "no" },
        ],
      };
    }

    await this.save();
    return {
      messageId: replyMsgId,
      seq: assistantSeq,
      reply: guarded.guardedAnswer,
      usedChunkIds: guarded.validChunkIds,
      stage: this.stage,
      intent: aiRes.intent,
    };
  }

  // ===========================================================================
  // handleLeadTurn — scripted state machine (SDD §6.4 priority 6, §10.1)
  // ===========================================================================
  private async handleLeadTurn(
    text: string,
    clientMessageId?: string
  ): Promise<ConversationTurnResponse> {
    // SDD §6.4: a question mid-flow is answered, then the pending field is re-asked
    if (this.stage === "LeadCollecting" && looksLikeQuestion(text)) {
      const pendingField = this.leadState?.currentField ?? "name";
      const faqRes = await this.answerFAQ(text, clientMessageId);
      const resumePrompt = "\n\n" + this.promptForField(pendingField);
      faqRes.reply = faqRes.reply + resumePrompt;
      faqRes.buttons = this.buttonsForField(pendingField);
      await this.save();
      return faqRes;
    }

    if (this.stage === "LeadConsent") return this.handleConsent(text, clientMessageId);
    if (this.stage === "LeadCollecting") return this.handleFieldCollection(text, clientMessageId);
    if (this.stage === "LeadConfirm") return this.handleConfirmation(text, clientMessageId);

    await this.save();
    return this.simpleResponse("Something went wrong. Please type your message again.");
  }

  // -------------------------------------------------------------------------
  // handleConsent
  // -------------------------------------------------------------------------
  private async handleConsent(
    text: string,
    clientMessageId?: string
  ): Promise<ConversationTurnResponse> {
    const msgId = uuidv7();
    const now = Date.now();
    const convId = this.conversationId!;
    const visitorSeq = ++this.seq;
    const assistantSeq = ++this.seq;

    if (looksLikeYes(text)) {
      const consentResult = await recordVisitorConsent(this.env.DB, {
        conversationId: convId,
        wordingVersion: CONSENT_WORDING_VERSION,
        purpose: "lead_contact",
        decision: true,
      });

      this.leadState!.consentId = consentResult.consentId;
      this.leadState!.currentField = "name";
      this.leadState!.retries = 0;
      this.stage = "LeadCollecting";

      const reply = "Thank you for agreeing! To get started, what is your full name?";
      await this.persistLeadMessage(convId, visitorSeq, assistantSeq, text, reply, clientMessageId, now);
      await this.save();

      return {
        messageId: msgId,
        seq: assistantSeq,
        reply,
        usedChunkIds: [],
        stage: this.stage,
        intent: "lead_consent_accepted",
      };
    }

    if (looksLikeNo(text)) {
      await recordVisitorConsent(this.env.DB, {
        conversationId: convId,
        wordingVersion: CONSENT_WORDING_VERSION,
        purpose: "lead_contact",
        decision: false,
      });

      this.stage = "Chatting";
      this.leadState = null;

      const reply =
        "No problem at all! You can continue asking questions about our services. Is there anything else I can help you with?";
      await this.persistLeadMessage(convId, visitorSeq, assistantSeq, text, reply, clientMessageId, now);
      await this.save();

      return {
        messageId: msgId,
        seq: assistantSeq,
        reply,
        usedChunkIds: [],
        stage: this.stage,
        intent: "lead_consent_declined",
      };
    }

    // Unclear — ask again (max 2 retries)
    this.leadState!.retries++;
    const reply =
      this.leadState!.retries >= 2
        ? "Just type 'yes' to proceed or 'no' to decline. I'm here to help either way."
        : "I didn't quite catch that. Please type 'yes' to agree or 'no' to decline.";

    await this.persistLeadMessage(convId, visitorSeq, assistantSeq, text, reply, clientMessageId, now);
    await this.save();

    return {
      messageId: msgId,
      seq: assistantSeq,
      reply,
      usedChunkIds: [],
      stage: this.stage,
      intent: "lead_consent_unclear",
      buttons: [
        { label: "✅ Yes, I agree", value: "yes" },
        { label: "❌ No thanks", value: "no" },
      ],
    };
  }

  // -------------------------------------------------------------------------
  // handleFieldCollection
  // -------------------------------------------------------------------------
  private async handleFieldCollection(
    text: string,
    clientMessageId?: string
  ): Promise<ConversationTurnResponse> {
    const msgId = uuidv7();
    const now = Date.now();
    const convId = this.conversationId!;
    const ls = this.leadState!;
    const visitorSeq = ++this.seq;
    const assistantSeq = ++this.seq;
    const field = ls.currentField;

    // NAME
    if (field === "name") {
      const val = text.trim();
      if (!val || val.length < 2) {
        ls.retries++;
        const retry =
          ls.retries >= 2
            ? "I need your full name to continue. Please type your name."
            : "Could you please share your full name?";
        await this.persistLeadMessage(convId, visitorSeq, assistantSeq, text, retry, clientMessageId, now);
        await this.save();
        return { messageId: msgId, seq: assistantSeq, reply: retry, usedChunkIds: [], stage: this.stage, intent: "lead_collecting" };
      }
      ls.name = val;
      ls.currentField = "email";
      ls.retries = 0;
      const reply = `Nice to meet you, ${ls.name}! What is the best email address to reach you?`;
      await this.persistLeadMessage(convId, visitorSeq, assistantSeq, text, reply, clientMessageId, now);
      await this.save();
      return { messageId: msgId, seq: assistantSeq, reply, usedChunkIds: [], stage: this.stage, intent: "lead_collecting" };
    }

    // EMAIL
    if (field === "email") {
      const val = text.trim().toLowerCase();
      if (!EMAIL_RE.test(val)) {
        ls.retries++;
        const retry =
          ls.retries >= 2
            ? "I need a valid email address (like name@example.com) to continue."
            : "That doesn't look like a valid email. Could you double-check and try again?";
        await this.persistLeadMessage(convId, visitorSeq, assistantSeq, text, retry, clientMessageId, now);
        await this.save();
        return { messageId: msgId, seq: assistantSeq, reply: retry, usedChunkIds: [], stage: this.stage, intent: "lead_collecting" };
      }
      ls.email = val;
      ls.currentField = "service";
      ls.retries = 0;
      const reply = "Great! Which service are you most interested in?";
      await this.persistLeadMessage(convId, visitorSeq, assistantSeq, text, reply, clientMessageId, now);
      await this.save();
      return {
        messageId: msgId, seq: assistantSeq, reply, usedChunkIds: [], stage: this.stage, intent: "lead_collecting",
        buttons: SERVICE_BUTTONS,
      };
    }

    // SERVICE
    if (field === "service") {
      const slugs = SERVICE_BUTTONS.map((b) => b.value);
      const raw = text.trim().toLowerCase().replace(/\s+/g, "-");
      const matched =
        slugs.find((s) => s === raw) ||
        slugs.find((s) => s.includes(raw) || raw.includes(s.replace(/-/g, " ")));

      if (!matched) {
        ls.retries++;
        const retry =
          ls.retries >= 2
            ? "Please choose one: AI Services, Digital Marketing, Web Development, Graphic Designing, SEO, Video Editing, Mobile App Development, or WordPress Development."
            : "Please select a service using the buttons or type the service name.";
        await this.persistLeadMessage(convId, visitorSeq, assistantSeq, text, retry, clientMessageId, now);
        await this.save();
        return {
          messageId: msgId, seq: assistantSeq, reply: retry, usedChunkIds: [], stage: this.stage, intent: "lead_collecting",
          buttons: SERVICE_BUTTONS,
        };
      }
      ls.serviceSlug = matched;
      ls.currentField = "phone";
      ls.retries = 0;
      const reply =
        "Excellent choice! May I have your phone number for a quicker follow-up? (Type 'skip' if you prefer email only.)";
      await this.persistLeadMessage(convId, visitorSeq, assistantSeq, text, reply, clientMessageId, now);
      await this.save();
      return {
        messageId: msgId, seq: assistantSeq, reply, usedChunkIds: [], stage: this.stage, intent: "lead_collecting",
        buttons: [{ label: "Skip phone", value: "skip" }],
      };
    }

    // PHONE (optional)
    if (field === "phone") {
      if (!looksLikeSkip(text)) ls.phone = text.trim();
      ls.currentField = "currency";
      ls.retries = 0;
      const reply = "Which currency would you prefer for your project budget?";
      await this.persistLeadMessage(convId, visitorSeq, assistantSeq, text, reply, clientMessageId, now);
      await this.save();
      return {
        messageId: msgId, seq: assistantSeq, reply, usedChunkIds: [], stage: this.stage, intent: "lead_collecting",
        buttons: CURRENCY_BUTTONS,
      };
    }

    // CURRENCY (optional)
    if (field === "currency") {
      const val = text.trim().toUpperCase();
      ls.currency = val === "PKR" ? "PKR" : "USD";
      ls.currentField = "description";
      ls.retries = 0;
      const reply =
        "Briefly, what would you like us to build or improve? (Type 'skip' to go straight to the summary.)";
      await this.persistLeadMessage(convId, visitorSeq, assistantSeq, text, reply, clientMessageId, now);
      await this.save();
      return {
        messageId: msgId, seq: assistantSeq, reply, usedChunkIds: [], stage: this.stage, intent: "lead_collecting",
        buttons: [{ label: "Skip description", value: "skip" }],
      };
    }

    // DESCRIPTION (optional)
    if (field === "description") {
      if (!looksLikeSkip(text)) ls.description = maskPII(text.trim());
      ls.currentField = "confirm";
      ls.retries = 0;

      const card = this.buildConfirmCard();
      const confirmText = this.buildRecapText(card);
      const reply =
        confirmText +
        "\n\nIs everything correct? Type 'confirm' to save or 'edit' to start over.";
      await this.persistLeadMessage(convId, visitorSeq, assistantSeq, text, reply, clientMessageId, now);
      this.stage = "LeadConfirm";
      await this.save();
      return {
        messageId: msgId, seq: assistantSeq, reply, usedChunkIds: [], stage: this.stage, intent: "lead_collecting",
        confirmCard: card,
        buttons: [
          { label: "✅ Confirm", value: "confirm" },
          { label: "🔄 Start over", value: "edit" },
        ],
      };
    }

    await this.save();
    return this.simpleResponse("Please answer the question above.");
  }

  // -------------------------------------------------------------------------
  // handleConfirmation
  // -------------------------------------------------------------------------
  private async handleConfirmation(
    text: string,
    clientMessageId?: string
  ): Promise<ConversationTurnResponse> {
    const msgId = uuidv7();
    const now = Date.now();
    const convId = this.conversationId!;
    const ls = this.leadState!;
    const visitorSeq = ++this.seq;
    const assistantSeq = ++this.seq;

    const l = text.trim().toLowerCase();

    if (l === "confirm" || looksLikeYes(text)) {
      const result = await createLeadAndOutboxBatch(this.env.DB, this.env.NOTIFY || null, {
        conversationId: convId,
        consentId: ls.consentId!,
        intakeData: {
          name: ls.name!,
          email: ls.email!,
          serviceSlug: ls.serviceSlug!,
          phone: ls.phone || undefined,
          currency: (ls.currency || "USD") as "USD" | "PKR",
          budgetRangeId: ls.budgetRangeId || undefined,
          timelineOptionId: ls.timelineOptionId || undefined,
          description: ls.description || undefined,
        },
        source: "widget",
      });

      await this.env.DB.prepare(
        "UPDATE conversation SET stage = 'Chatting', outcome = 'lead_captured', updated_at = ? WHERE id = ?"
      )
        .bind(now, convId)
        .run();

      this.stage = "Chatting";
      this.leadState = null;

      const reply =
        `Thank you, ${ls.name}! Your details have been saved. Our team will reach out to ${ls.email} within 1 business day. Is there anything else I can help you with?`;

      await this.persistLeadMessage(convId, visitorSeq, assistantSeq, text, reply, clientMessageId, now);
      await this.save();

      return {
        messageId: msgId, seq: assistantSeq, reply, usedChunkIds: [], stage: this.stage, intent: "lead_saved",
        leadId: result.leadId,
      };
    }

    if (l === "edit" || l === "restart" || l === "start over" || looksLikeNo(text)) {
      ls.name = null;
      ls.email = null;
      ls.serviceSlug = null;
      ls.phone = null;
      ls.currency = null;
      ls.budgetRangeId = null;
      ls.timelineOptionId = null;
      ls.description = null;
      ls.currentField = "name";
      ls.retries = 0;
      this.stage = "LeadCollecting";

      const reply = "No problem, let's start fresh. What is your full name?";
      await this.persistLeadMessage(convId, visitorSeq, assistantSeq, text, reply, clientMessageId, now);
      await this.save();
      return { messageId: msgId, seq: assistantSeq, reply, usedChunkIds: [], stage: this.stage, intent: "lead_edit" };
    }

    // Unclear — show recap again
    const card = this.buildConfirmCard();
    const confirmText = this.buildRecapText(card);
    const reply =
      "Please type 'confirm' to save your details or 'edit' to start over.\n\n" + confirmText;
    await this.persistLeadMessage(convId, visitorSeq, assistantSeq, text, reply, clientMessageId, now);
    await this.save();
    return {
      messageId: msgId, seq: assistantSeq, reply, usedChunkIds: [], stage: this.stage, intent: "lead_confirm",
      confirmCard: card,
      buttons: [
        { label: "✅ Confirm", value: "confirm" },
        { label: "🔄 Start over", value: "edit" },
      ],
    };
  }

  // -------------------------------------------------------------------------
  // answerFAQ — called when a question arrives mid-lead-flow
  // -------------------------------------------------------------------------
  private async answerFAQ(
    text: string,
    clientMessageId?: string
  ): Promise<ConversationTurnResponse> {
    const retrieved = await retrieveKnowledgeChunks(this.env.DB, text, 4);
    const approvedChunkIds = retrieved.map((r) => r.chunkId);
    const gateway = new ModelGateway({ apiKey: this.env.AI_API_KEY });
    const aiRes = await gateway.generateResponse(text, retrieved);
    const guarded = applyAnswerGuard(aiRes.answer, aiRes.usedChunkIds, approvedChunkIds);

    const msgId = uuidv7();
    const now = Date.now();
    const convId = this.conversationId!;
    const visitorSeq = ++this.seq;
    const assistantSeq = ++this.seq;

    await this.persistLeadMessage(
      convId, visitorSeq, assistantSeq, text, guarded.guardedAnswer, clientMessageId, now
    );

    return {
      messageId: msgId,
      seq: assistantSeq,
      reply: guarded.guardedAnswer,
      usedChunkIds: guarded.validChunkIds,
      stage: this.stage,
      intent: aiRes.intent,
    };
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------
  private buildConfirmCard(): LeadConfirmCard {
    const ls = this.leadState!;
    return {
      name: ls.name!,
      email: ls.email!,
      service: ls.serviceSlug!.replace(/-/g, " "),
      phone: ls.phone || undefined,
      currency: ls.currency || undefined,
      description: ls.description || undefined,
    };
  }

  private buildRecapText(card: LeadConfirmCard): string {
    const lines = [
      "Here's a summary of your details:",
      `📛 Name: ${card.name}`,
      `📧 Email: ${card.email}`,
      `🛠️ Service: ${card.service}`,
    ];
    if (card.phone) lines.push(`📞 Phone: ${card.phone}`);
    if (card.currency) lines.push(`💱 Currency: ${card.currency}`);
    if (card.description) lines.push(`📝 Notes: ${card.description}`);
    return lines.join("\n");
  }

  private promptForField(field: LeadField): string {
    const prompts: Record<LeadField, string> = {
      consent: `To collect your details I need your consent. ${CONSENT_TEXT}`,
      name: "What is your full name?",
      email: "What is the best email address to reach you?",
      service: "Which service are you most interested in?",
      phone: "May I have your phone number? (Type 'skip' to continue by email.)",
      currency: "Which currency would you prefer for your project budget?",
      budgetRange: "Do you have a budget range in mind? (Type 'skip' to continue.)",
      timeline: "When would you like to get started? (Type 'skip' to continue.)",
      description: "Briefly, what would you like us to build? (Type 'skip' to go to the summary.)",
      confirm: "Please type 'confirm' to save your details or 'edit' to start over.",
      done: "",
    };
    return prompts[field] || "";
  }

  private buttonsForField(field: LeadField): Button[] | undefined {
    if (field === "consent")
      return [
        { label: "✅ Yes, I agree", value: "yes" },
        { label: "❌ No thanks", value: "no" },
      ];
    if (field === "service") return SERVICE_BUTTONS;
    if (field === "currency") return CURRENCY_BUTTONS;
    if (field === "confirm")
      return [
        { label: "✅ Confirm", value: "confirm" },
        { label: "🔄 Start over", value: "edit" },
      ];
    if (field === "phone" || field === "description")
      return [{ label: "Skip", value: "skip" }];
    return undefined;
  }

  private async persistLeadMessage(
    convId: string,
    visitorSeq: number,
    assistantSeq: number,
    visitorText: string,
    assistantReply: string,
    clientMessageId: string | undefined,
    now: number
  ): Promise<void> {
    await this.env.DB.batch([
      this.env.DB.prepare(
        `INSERT OR IGNORE INTO conversation (id, session_id, stage, outcome, is_test, est_cost, created_at, updated_at)
         VALUES (?, ?, ?, 'in_progress', 0, 0, ?, ?)`
      ).bind(convId, this.sessionId || "default-session", this.stage, now, now),

      this.env.DB.prepare(
        `INSERT INTO message (id, conversation_id, seq, sender, content_masked, intent, client_message_id, created_at)
         VALUES (?, ?, ?, 'visitor', ?, 'lead_flow', ?, ?)`
      ).bind(uuidv7(), convId, visitorSeq, maskPII(visitorText), clientMessageId || null, now),

      this.env.DB.prepare(
        `INSERT INTO message (id, conversation_id, seq, sender, content_masked, intent, answerable, used_chunk_ids, created_at)
         VALUES (?, ?, ?, 'assistant', ?, 'lead_flow', 0, '[]', ?)`
      ).bind(uuidv7(), convId, assistantSeq, assistantReply, now),
    ]);
  }

  private rateResponse(rateCheck: {
    reason?: string;
    retryAfterSeconds?: number;
  }): ConversationTurnResponse {
    const reply =
      rateCheck.reason === "payload_too_large"
        ? "Your message is too long (over 1,000 characters). Please send a shorter summary."
        : `You are sending messages too quickly. Please wait ${rateCheck.retryAfterSeconds || 60} seconds.`;
    return {
      messageId: uuidv7(),
      seq: ++this.seq,
      reply,
      usedChunkIds: [],
      stage: this.stage,
      intent: "rate_limited",
    };
  }

  private budgetResponse(): ConversationTurnResponse {
    return {
      messageId: uuidv7(),
      seq: ++this.seq,
      reply:
        "Our automated assistant has reached its monthly capacity. Please leave your details and our team will get back to you directly.",
      usedChunkIds: [],
      stage: this.stage,
      intent: "budget_exceeded",
    };
  }

  private simpleResponse(reply: string): ConversationTurnResponse {
    return {
      messageId: uuidv7(),
      seq: ++this.seq,
      reply,
      usedChunkIds: [],
      stage: this.stage,
      intent: "other",
    };
  }
}

// ===========================================================================
// StaffHubDO — unchanged
// ===========================================================================
export class StaffHubDO {
  private state: DurableObjectState;
  private env: WorkerEnv;
  private staffSockets: Set<WebSocket> = new Set();
  private pendingHandovers: Map<
    string,
    { handoverId: string; conversationId: string; visitorName: string }
  > = new Map();

  constructor(state: DurableObjectState, env: WorkerEnv) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader === "websocket") {
      const webSocketPair = new WebSocketPair();
      const [client, server] = Object.values(webSocketPair);

      server.accept();
      this.staffSockets.add(server);

      server.addEventListener("close", () => {
        this.staffSockets.delete(server);
      });

      server.addEventListener("message", (event) => {
        try {
          const msg = JSON.parse(event.data as string);
          if (msg.type === "claim_handover") {
            this.pendingHandovers.delete(msg.handoverId);
            this.broadcast({
              type: "handover_claimed",
              handoverId: msg.handoverId,
              claimedBy: msg.staffId,
            });
          }
        } catch {
          // ignore malformed
        }
      });

      return new Response(null, { status: 101, webSocket: client });
    }

    const url = new URL(request.url);
    if (
      url.pathname.endsWith("/broadcast-handover") &&
      request.method === "POST"
    ) {
      const body = (await request.json()) as {
        handoverId: string;
        conversationId: string;
        visitorName: string;
      };
      this.pendingHandovers.set(body.handoverId, body);
      this.broadcast({ type: "new_handover", ...body });
      return new Response(
        JSON.stringify({ success: true, connectedStaff: this.staffSockets.size }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response("StaffHub OK", { status: 200 });
  }

  broadcast(message: unknown) {
    const serialized = JSON.stringify(message);
    for (const ws of this.staffSockets) {
      try {
        ws.send(serialized);
      } catch {
        this.staffSockets.delete(ws);
      }
    }
  }

  getPendingHandovers() {
    return Array.from(this.pendingHandovers.values());
  }
}
