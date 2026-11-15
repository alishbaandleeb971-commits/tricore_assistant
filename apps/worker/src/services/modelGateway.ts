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

    // Check if user is asking for pricing
    if (lower.includes("price") || lower.includes("cost") || lower.includes("rate") || lower.includes("fee")) {
      return {
        answer:
          "We offer custom quotes tailored to each project's exact scope. Would you like to share some details so our team can provide an accurate proposal?",
        usedChunkIds: passages.map((p) => p.chunkId),
        intent: "pricing_inquiry",
        confidence: "high",
        tokensIn: 50,
        tokensOut: 30
      };
    }

    // If matching passages are provided
    if (passages.length > 0) {
      const top = passages[0];
      return {
        answer: `${top.body.slice(0, 300)}... Would you like more details on ${top.title}?`,
        usedChunkIds: [top.chunkId],
        intent: "service_inquiry",
        confidence: "high",
        tokensIn: 60,
        tokensOut: 45
      };
    }

    // Fallback response for ungrounded questions
    return {
      answer:
        "I'm not completely certain about that specific detail, but our team would be glad to help! Would you like me to connect you with a team member?",
      usedChunkIds: [],
      intent: "other",
      confidence: "low",
      tokensIn: 40,
      tokensOut: 25
    };
  }
}
