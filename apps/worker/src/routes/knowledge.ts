import { Hono } from "hono";
import { uuidv7 } from "uuidv7";
import { accessAuthMiddleware } from "../middleware/accessAuth.js";

export type KnowledgeEnv = {
  Bindings: {
    DB: D1Database;
  };
};

export const knowledgeRouter = new Hono<KnowledgeEnv>();

// List entries
knowledgeRouter.get("/entries", accessAuthMiddleware(), async (c) => {
  const db = c.env.DB as D1Database;
  const entries = await db.prepare("SELECT * FROM knowledge_entry ORDER BY title ASC").all();
  return c.json({ entries: entries.results || [] });
});

// Create entry draft
knowledgeRouter.post("/entries", accessAuthMiddleware(), async (c) => {
  const db = c.env.DB as D1Database;
  const body = await c.req.json<{ title: string; entryType: string; body: string; keywords?: string }>();
  const user = c.get("staffUser");

  const entryId = uuidv7();
  const versionId = uuidv7();

  await db.batch([
    db.prepare(
      "INSERT INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES (?, ?, ?, ?, 'draft')"
    ).bind(entryId, body.entryType || "faq", body.title, body.keywords || null),

    db.prepare(
      `INSERT INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approved_at, is_live)
       VALUES (?, ?, 1, ?, 'draft', ?, null, 0)`
    ).bind(versionId, entryId, body.body, user.id)
  ]);

  return c.json({ entryId, versionId }, 201);
});

// Admin approval
knowledgeRouter.post("/entries/:id/approve", accessAuthMiddleware("admin"), async (c) => {
  const db = c.env.DB as D1Database;
  const entryId = c.req.param("id");
  const user = c.get("staffUser");
  const now = Date.now();

  await db.batch([
    db.prepare("UPDATE knowledge_entry SET status = 'approved' WHERE id = ?").bind(entryId),
    db.prepare(
      "UPDATE knowledge_entry_version SET status = 'approved', approver_id = ?, approved_at = ? WHERE entry_id = ?"
    ).bind(user.id, now, entryId)
  ]);

  return c.json({ success: true, approvedAt: now });
});

// Admin publish release
knowledgeRouter.post("/releases", accessAuthMiddleware("admin"), async (c) => {
  const db = c.env.DB as D1Database;
  const user = c.get("staffUser");
  const releaseId = uuidv7();
  const now = Date.now();

  const maxRel = await db.prepare("SELECT max(release_no) as max_no FROM knowledge_release").first<{ max_no: number }>();
  const nextNo = (maxRel?.max_no || 0) + 1;

  await db.prepare(
    "INSERT INTO knowledge_release (id, release_no, published_at, published_by, status) VALUES (?, ?, ?, ?, 'published')"
  )
    .bind(releaseId, nextNo, now, user.id)
    .run();

  return c.json({ releaseId, releaseNo: nextNo }, 201);
});
