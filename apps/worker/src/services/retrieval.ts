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
  const STOP_WORDS = new Set([
    "a", "an", "the", "and", "or", "in", "on", "at", "to", "for", "of", "with",
    "by", "from", "up", "about", "into", "over", "after", "is", "are", "was",
    "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
    "can", "could", "will", "would", "shall", "should", "may", "might", "must",
    "i", "you", "he", "she", "it", "we", "they", "what", "which", "who", "when",
    "where", "why", "how", "all", "any", "both", "each", "few", "more", "most",
    "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so",
    "than", "too", "very", "s", "t", "just", "don", "shouldn", "now"
  ]);

  const words = query
    .replace(/[^\w\s]/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w.toLowerCase()));

  const sanitized = words.length > 0 ? words.join(" OR ") : "";

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
