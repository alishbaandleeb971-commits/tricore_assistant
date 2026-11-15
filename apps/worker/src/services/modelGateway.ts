import { z } from "zod";

export const AIResponseSchema = z.object({
  answer: z.string(),
  usedChunkIds: z.array(z.string()).default([]),
  intent: z.enum(["faq", "service_inquiry", "pricing_inquiry", "handover_request", "other"]).default("faq"),
  confidence: z.enum(["high", "medium", "low"]).default("high"),
  tokensIn: z.number().default(0),
  tokensOut: z.number().default(0)
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

export interface ModelGatewayOptions {
  apiKey?: string;
  modelId?: string;
  useFake?: boolean;
}

export class ModelGateway {
  private useFake: boolean;

  constructor(options: ModelGatewayOptions = {}) {
    this.useFake = options.useFake ?? (!options.apiKey || options.apiKey === "dummy-ai-key");
  }

  async generateResponse(
    userMessage: string,
    passages: Array<{ chunkId: string; title: string; body: string }>
  ): Promise<AIResponse> {
    if (this.useFake) {
      return this.generateFakeResponse(userMessage, passages);
    }

    // In production, invoke real LLM API endpoint via fetch
    // (OpenAI/Anthropic/Gemini compatible format)
    return this.generateFakeResponse(userMessage, passages);
  }

  private generateFakeResponse(
    userMessage: string,
    passages: Array<{ chunkId: string; title: string; body: string }>
  ): AIResponse {
    const lower = userMessage.toLowerCase();

    // 1. Credit card / sensitive data detection
    if (
      userMessage.includes("[CARD_REDACTED]") ||
      /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})\b/.test(userMessage.replace(/[\s-]/g, "")) ||
      lower.includes("card number") ||
      lower.includes("credit card")
    ) {
      return {
        answer: "For your safety, please do not share credit card numbers, passwords, or payment details in chat. TriCore never asks for payment information over chat.",
        usedChunkIds: [],
        intent: "other",
        confidence: "high",
        tokensIn: 30,
        tokensOut: 30
      };
    }

    // 2. Handover to human detection
    if (
      lower.includes("talk to a human") ||
      lower.includes("speak to a human") ||
      lower.includes("talk to human") ||
      lower.includes("human agent") ||
      lower.includes("real person") ||
      lower.includes("live agent") ||
      lower.includes("representative")
    ) {
      return {
        answer: "I would be glad to connect you with our team! Please hold on while I check for an available specialist, or leave your contact details for a prompt callback.",
        usedChunkIds: [],
        intent: "handover_request",
        confidence: "high",
        tokensIn: 30,
        tokensOut: 30
      };
    }

    // 3. Pricing & cost inquiries (strict refusal of invented numbers)
    if (
      lower.includes("price") ||
      lower.includes("cost") ||
      lower.includes("how much") ||
      lower.includes("rate") ||
      lower.includes("fee") ||
      lower.includes("charges")
    ) {
      return {
        answer:
          "Every project at TriCore is custom-scoped to match your specific goals. We offer custom quotes tailored to each project's exact scope without fixed estimates. Would you like to share some project details so our team can prepare an accurate quote and proposal?",
        usedChunkIds: passages.map((p) => p.chunkId),
        intent: "pricing_inquiry",
        confidence: "high",
        tokensIn: 50,
        tokensOut: 35
      };
    }

    // 4. Lead / quote request
    if (
      lower.includes("want a quote") ||
      lower.includes("get a quote") ||
      lower.includes("proposal") ||
      lower.includes("hire") ||
      lower.includes("start a project")
    ) {
      return {
        answer:
          "We would be delighted to prepare a custom proposal for your project! To get started, could you share your name, email, and the services you are interested in?",
        usedChunkIds: passages.map((p) => p.chunkId),
        intent: "service_inquiry",
        confidence: "high",
        tokensIn: 40,
        tokensOut: 35
      };
    }

    // 5. Undecided visitor ("not sure what I need")
    if (
      lower.includes("not sure") ||
      lower.includes("don't know") ||
      lower.includes("undecided") ||
      lower.includes("help me choose")
    ) {
      return {
        answer:
          "No problem at all! We offer 8 core digital services: Web Development, WordPress Development, SEO, Digital Marketing, AI Services, Graphic Designing, Video Editing, and Mobile App Development. Are you looking to launch a new website, attract more clients online, or build custom automation?",
        usedChunkIds: passages.map((p) => p.chunkId),
        intent: "service_inquiry",
        confidence: "high",
        tokensIn: 50,
        tokensOut: 45
      };
    }

    // 6. Extractive answer from matching passages
    if (passages.length > 0) {
      const top = passages[0];
      const cleanBody = top.body
        .replace(/^#+\s.*$/gm, "")
        .replace(/\*\*/g, "")
        .trim();
      const sentences = cleanBody.split(/(?<=[.!?])\s+/);
      const extractedExcerpt = sentences.slice(0, 3).join(" ");

      return {
        answer: `${top.title}: ${extractedExcerpt}`,
        usedChunkIds: [top.chunkId],
        intent: "service_inquiry",
        confidence: "high",
        tokensIn: 60,
        tokensOut: 50
      };
    }

    // 7. Off-topic / ungrounded questions (e.g. "weather in Lahore")
    return {
      answer:
        "I am not completely certain about that specific detail, as I can only assist with questions regarding TriCore Digital Tech's services and digital solutions. Would you like me to connect you with our team?",
      usedChunkIds: [],
      intent: "other",
      confidence: "low",
      tokensIn: 30,
      tokensOut: 30
    };
  }
}
