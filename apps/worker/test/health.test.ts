import { describe, it, expect } from "vitest";
import app from "../src/index";

describe("Worker Health API", () => {
  it("GET /healthz returns 200 with status ok", async () => {
    const req = new Request("http://localhost/healthz");
    const res = await app.fetch(req, {
      ENVIRONMENT: "development",
      DB: {} as D1Database,
      CONVERSATION: {} as DurableObjectNamespace,
      STAFF_HUB: {} as DurableObjectNamespace,
      NOTIFY: {} as Queue,
      BACKUPS: {} as R2Bucket,
      EMAIL: {} as SendEmail,
      ASSETS: {} as Fetcher
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string; version: string };
    expect(body.status).toBe("ok");
    expect(body.version).toBe("0.1.0");
  });
});
