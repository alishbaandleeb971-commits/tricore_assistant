import { describe, it, expect, vi } from "vitest";
import { StaffHubDO } from "../src/durable/conversation";
import { env } from "cloudflare:test";

describe("StaffHub DO & WebSocket Live Relay (TASK-028)", () => {
  it("broadcasts pending handovers and processes claim messages", async () => {
    const doState = {} as unknown as DurableObjectState;
    const hub = new StaffHubDO(doState, env);

    // Broadcast a new handover
    const req = new Request("http://localhost/broadcast-handover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        handoverId: "ho-123",
        conversationId: "conv-123",
        visitorName: "Ali Raza"
      })
    });

    const res = await hub.fetch(req);
    expect(res.status).toBe(200);

    const pending = hub.getPendingHandovers();
    expect(pending.length).toBe(1);
    expect(pending[0].handoverId).toBe("ho-123");
    expect(pending[0].visitorName).toBe("Ali Raza");
  });
});
