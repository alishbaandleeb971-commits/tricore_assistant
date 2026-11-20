import { uuidv7 } from "uuidv7";
import { maskPII } from "@tricore/shared";
import { checkRateLimit } from "../services/rateLimiter.js";
import { retrieveKnowledgeChunks } from "../services/retrieval.js";
import { ModelGateway } from "../services/modelGateway.js";
import { applyAnswerGuard } from "../services/answerGuard.js";
import { checkAndRecordSpend } from "../services/budgetGate.js";

export interface ConversationTurnRequest {
  clientMessageId?: string;
  content: string;
}

export interface ConversationTurnResponse {
  messageId: string;
  seq: number;
  reply: string;
  usedChunkIds: string[];
  stage: string;
  intent: string;
}

export interface WorkerEnv {
  DB: D1Database;
  AI_API_KEY?: string;
  [key: string]: unknown;
}

export class ConversationDO {
  private state: DurableObjectState;
  private env: WorkerEnv;
  private initialized = false;
  private conversationId: string | null = null;
  private sessionId: string | null = null;
  private seq = 0;
  private activeHandoverId: string | null = null;
  private handoverDeadlineAt: number | null = null;

  constructor(state: DurableObjectState, env: WorkerEnv) {
    this.state = state;
    this.env = env;
  }

  async alarm(): Promise<void> {
    // 3-minute handover timeout alarm fired
    if (this.activeHandoverId) {
      await this.env.DB.prepare(
        "UPDATE handover_request SET status = 'timed_out', outcome = 'unanswered_fallback' WHERE id = ?"
      )
        .bind(this.activeHandoverId)
        .run();

      this.activeHandoverId = null;
      this.handoverDeadlineAt = null;
    }
  }

  async requestHandover(): Promise<{ handoverId: string; status: string; deadlineAt: number }> {
    const handoverId = uuidv7();
    const now = Date.now();
    const deadlineAt = now + 180_000; // 3 minutes = 180 seconds

    this.activeHandoverId = handoverId;
    this.handoverDeadlineAt = deadlineAt;

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

    return {
      handoverId,
      status: "pending",
      deadlineAt
    };
  }

  async acceptHandover(staffUserId: string): Promise<boolean> {
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
    return true;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.endsWith("/turn") && request.method === "POST") {
      const body = (await request.json()) as ConversationTurnRequest;
      const res = await this.handleTurn(body);
      return new Response(JSON.stringify(res), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Not found", { status: 404 });
  }

  async init(conversationId: string, sessionId: string) {
    this.conversationId = conversationId;
    this.sessionId = sessionId;
    this.initialized = true;
  }

  async handleTurn(req: ConversationTurnRequest): Promise<ConversationTurnResponse> {
    const rawContent = req.content || "";
    const maskedContent = maskPII(rawContent);

    // 1. Rate limiter check
    const rateCheck = await checkRateLimit(this.env.DB, this.sessionId || "default", maskedContent.length);
    if (!rateCheck.allowed) {
      if (rateCheck.reason === "payload_too_large") {
        return {
          messageId: uuidv7(),
          seq: ++this.seq,
          reply: "Your message is too long (over 1,000 characters). Please send a shorter summary.",
          usedChunkIds: [],
          stage: "active",
          intent: "rate_limited"
        };
      }
      return {
        messageId: uuidv7(),
        seq: ++this.seq,
        reply: `You are sending messages too quickly. Please wait ${rateCheck.retryAfterSeconds || 60} seconds.`,
        usedChunkIds: [],
        stage: "active",
        intent: "rate_limited"
      };
    }

    // 2. Budget gate check
    const budget = await checkAndRecordSpend(this.env.DB, 1500); // ~0.0015 USD
    if (!budget.allowed) {
      return {
        messageId: uuidv7(),
        seq: ++this.seq,
        reply: "Our automated assistant has reached its monthly capacity. Please leave your details and our team will get back to you directly.",
        usedChunkIds: [],
        stage: "active",
        intent: "budget_exceeded"
      };
    }

    // 3. Knowledge retrieval
    const retrieved = await retrieveKnowledgeChunks(this.env.DB, maskedContent, 4);
    const approvedChunkIds = retrieved.map((r) => r.chunkId);

    // 4. Model generation via Gateway
    const gateway = new ModelGateway({ apiKey: this.env.AI_API_KEY });
    const aiRes = await gateway.generateResponse(maskedContent, retrieved);

    // 5. Deterministic Answer Guard
    const guarded = applyAnswerGuard(aiRes.answer, aiRes.usedChunkIds, approvedChunkIds);

    const replyMsgId = uuidv7();
    const visitorMsgId = uuidv7();
    const now = Date.now();
    const convId = this.conversationId || uuidv7();

    // 6. Single atomic D1 batch to persist conversation turn
    const visitorSeq = ++this.seq;
    const assistantSeq = ++this.seq;

    await this.env.DB.batch([
      this.env.DB.prepare(
        `INSERT OR IGNORE INTO conversation (id, session_id, stage, outcome, is_test, est_cost, created_at, updated_at)
         VALUES (?, ?, 'active', 'in_progress', 0, 1500, ?, ?)`
      ).bind(convId, this.sessionId || "default-session", now, now),

      this.env.DB.prepare(
        `INSERT INTO message (id, conversation_id, seq, sender, content_masked, intent, client_message_id, created_at)
         VALUES (?, ?, ?, 'visitor', ?, ?, ?, ?)`
      ).bind(visitorMsgId, convId, visitorSeq, maskedContent, aiRes.intent, req.clientMessageId || null, now),

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
      )
    ]);

    return {
      messageId: replyMsgId,
      seq: assistantSeq,
      reply: guarded.guardedAnswer,
      usedChunkIds: guarded.validChunkIds,
      stage: "active",
      intent: aiRes.intent
    };
  }
}

export class StaffHubDO {
  private state: DurableObjectState;
  private env: WorkerEnv;
  private staffSockets: Set<WebSocket> = new Set();
  private pendingHandovers: Map<string, { handoverId: string; conversationId: string; visitorName: string }> = new Map();

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
            this.broadcast({ type: "handover_claimed", handoverId: msg.handoverId, claimedBy: msg.staffId });
          }
        } catch {
          // ignore malformed message
        }
      });

      return new Response(null, { status: 101, webSocket: client });
    }

    const url = new URL(request.url);
    if (url.pathname.endsWith("/broadcast-handover") && request.method === "POST") {
      const body = (await request.json()) as { handoverId: string; conversationId: string; visitorName: string };
      this.pendingHandovers.set(body.handoverId, body);
      this.broadcast({ type: "new_handover", ...body });
      return new Response(JSON.stringify({ success: true, connectedStaff: this.staffSockets.size }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
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
