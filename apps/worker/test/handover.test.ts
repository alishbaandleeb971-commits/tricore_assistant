import { describe, it, expect, vi } from "vitest";
import { ConversationDO } from "../src/durable/conversation";
import { env } from "cloudflare:test";

describe("Handover Durable Object Alarm & 3-Minute Timer (TASK-027)", () => {
  it("initiates handover, sets 180s alarm, and times out to callback when unaccepted", async () => {
    const setAlarm = vi.fn().mockResolvedValue(undefined);
    const deleteAlarm = vi.fn().mockResolvedValue(undefined);

    const doState = {
      storage: {
        setAlarm,
        deleteAlarm
      }
    } as unknown as DurableObjectState;

    // Seed session and conversation in D1
    const now = Date.now();
    await env.DB.prepare(
      "INSERT OR IGNORE INTO visitor_session (id, token_hash, created_at, last_seen_at) VALUES ('sess-ho', 'tok-ho', ?, ?)"
    ).bind(now, now).run();
    await env.DB.prepare(
      "INSERT OR IGNORE INTO conversation (id, session_id, stage, outcome, is_test, est_cost, created_at, updated_at) VALUES ('conv-ho', 'sess-ho', 'active', 'open', 0, 0, ?, ?)"
    ).bind(now, now).run();

    const convDO = new ConversationDO(doState, env);
    await convDO.init("conv-ho", "sess-ho");

    // 1. Request handover
    const ho = await convDO.requestHandover();
    expect(ho.status).toBe("pending");
    expect(ho.deadlineAt).toBeGreaterThanOrEqual(now + 179_000);
    expect(setAlarm).toHaveBeenCalledWith(ho.deadlineAt);

    // 2. Simulate alarm firing at 180 seconds
    await convDO.alarm();

    // Verify status in D1 is updated to timed_out
    const row = await env.DB.prepare("SELECT * FROM handover_request WHERE id = ?").bind(ho.handoverId).first();
    expect(row?.status).toBe("timed_out");
    expect(row?.outcome).toBe("unanswered_fallback");
  });

  it("cancels 180s alarm when staff operator accepts handover", async () => {
    const setAlarm = vi.fn().mockResolvedValue(undefined);
    const deleteAlarm = vi.fn().mockResolvedValue(undefined);

    const doState = {
      storage: {
        setAlarm,
        deleteAlarm
      }
    } as unknown as DurableObjectState;

    // Seed session, conversation, and staff user for FK constraint
    const now = Date.now();
    await env.DB.prepare(
      "INSERT OR IGNORE INTO visitor_session (id, token_hash, created_at, last_seen_at) VALUES ('sess-ho2', 'tok-ho2', ?, ?)"
    ).bind(now, now).run();
    await env.DB.prepare(
      "INSERT OR IGNORE INTO conversation (id, session_id, stage, outcome, is_test, est_cost, created_at, updated_at) VALUES ('conv-ho2', 'sess-ho2', 'active', 'open', 0, 0, ?, ?)"
    ).bind(now, now).run();
    await env.DB.prepare(
      "INSERT OR IGNORE INTO staff_user (id, email, role, status, created_at) VALUES ('staff-usr-1', 'staff1@tricoredigitaltech.com', 'staff', 'active', ?)"
    ).bind(now).run();

    const convDO = new ConversationDO(doState, env);
    await convDO.init("conv-ho2", "sess-ho2");

    const ho = await convDO.requestHandover();
    const accepted = await convDO.acceptHandover("staff-usr-1");
    expect(accepted).toBe(true);
    expect(deleteAlarm).toHaveBeenCalled();

    const row = await env.DB.prepare("SELECT status, accepted_by FROM handover_request WHERE id = ?").bind(ho.handoverId).first();
    expect(row?.status).toBe("accepted");
    expect(row?.accepted_by).toBe("staff-usr-1");
  });
});
