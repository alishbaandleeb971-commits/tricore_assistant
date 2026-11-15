import { describe, it, expect } from "vitest";
import app from "../src/index";
import { env } from "cloudflare:test";

describe("Health & Readiness Endpoints (TASK-008)", () => {
  it("GET /healthz returns 200 with status ok", async () => {
    const req = new Request("http://localhost/healthz");
    const res = await app.fetch(req, env);

    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string; version: string; timestamp: string };
    expect(body.status).toBe("ok");
    expect(body.version).toBe("0.1.0");
    expect(body.timestamp).toBeDefined();
  });

  it("GET /readyz queries D1 and returns 200 database connected", async () => {
    const req = new Request("http://localhost/readyz");
    const res = await app.fetch(req, env);

    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string; database: string };
    expect(body.status).toBe("ok");
    expect(body.database).toBe("connected");
  });

  it("GET /readyz returns 503 when D1 fails", async () => {
    const brokenEnv = {
      ...env,
      DB: {
        prepare: () => {
          throw new Error("D1 connection lost");
        }
      } as unknown as D1Database
    };

    const req = new Request("http://localhost/readyz");
    const res = await app.fetch(req, brokenEnv);

    expect(res.status).toBe(503);
    const body = (await res.json()) as { status: string; error: string };
    expect(body.status).toBe("error");
    expect(body.error).toContain("D1 connection lost");
  });
});
