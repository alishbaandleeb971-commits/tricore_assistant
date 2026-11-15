export interface RetrievedChunk {
  chunkId: string;
  title: string;
  keywords: string;
  body: string;
  score: number;
}

export async function retrieveKnowledgeChunks(
  db: D1Database,
  query: string,
  limit = 4
): Promise<RetrievedChunk[]> {
  const sanitized = query
    .replace(/[^\w\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .join(" OR ");

  if (!sanitized) {
    return [];
  }

  // Query knowledge_fts using bm25 ranking
  // SQLite FTS5 bm25 weights for knowledge_fts(title, keywords, body):
  // bm25(knowledge_fts, 10.0, 5.0, 1.0)
  const results = await db
    .prepare(
      `SELECT
         f.chunk_id as chunkId,
         f.title,
         f.keywords,
         f.body,
         bm25(knowledge_fts, 10.0, 5.0, 1.0) as score
       FROM knowledge_fts f
       WHERE knowledge_fts MATCH ?
       ORDER BY score ASC
       LIMIT ?`
    )
    .bind(sanitized, limit)
    .all<RetrievedChunk>();

  if (results.results && results.results.length > 0) {
    return results.results;
  }

  // Trigram fallback for misspellings / fuzzy title/keyword matches
  const trigramResults = await db
    .prepare(
      `SELECT
         t.chunk_id as chunkId,
         t.title,
         t.keywords,
         c.chunk_text as body,
         0.5 as score
       FROM knowledge_trgm t
       JOIN knowledge_chunk c ON c.id = t.chunk_id
       WHERE knowledge_trgm MATCH ?
       LIMIT ?`
    )
    .bind(sanitized, limit)
    .all<RetrievedChunk>()
    .catch(() => ({ results: [] }));

  return trigramResults.results || [];
}
