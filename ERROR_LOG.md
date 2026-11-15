# Error & Bug Prevention Log

**Project:** TriCore Digital Tech — Website AI Assistant (Phase 1)  
**Rule:** When a test fails twice, a bug is fixed, or a critical architectural mistake is prevented, record it here immediately following Section A7 format.

---

## Log Entries

### ERR-001: Cloudflare CPU Limit Risk on Benchmark & CSV Export
- **Discovered During:** Document review & SDD verification (Stage G0).
- **Issue:** Running all 50 test benchmark questions in a single Worker request or generating large CSV exports inside a Worker can exceed the 10 ms CPU execution limit of the Cloudflare Free tier.
- **Root Cause:** Free-tier Worker CPU accounting counts active JavaScript execution time.
- **Resolution / Prevention Rule:**
  1. The 50-question benchmark runner MUST be driven by the Staff Dashboard frontend, sending 1 question per HTTP request.
  2. CSV lead export MUST be assembled client-side in the browser using JavaScript Blob download, fetching paginated JSON records from the API.
- **Status:** Prevented / Documented in `DECISIONS.md` (DEC-14, DEC-15).

### ERR-002: Risk of Unbounded D1 Write Costs during Bot Floods
- **Discovered During:** Architecture review (Stage G0).
- **Issue:** A distributed bot flood could exceed D1's 100,000 writes/day free limit if every incoming message writes to D1 before verification.
- **Root Cause:** Unverified requests hitting transactional storage.
- **Resolution / Prevention Rule:**
  1. Cloudflare Turnstile verification MUST succeed before opening a conversation DO or writing session rows to D1.
  2. Rate limit counters are tracked in memory / Durable Object before flushing to D1.
  3. Lead capture and outbox dispatch are committed in a single atomic batch write.
- **Status:** Prevented / Enforced in `TODO.md` (TASK-302, TASK-304).

### ERR-003: Accidental Exposure of Real Visitor IP Addresses
- **Discovered During:** SRS & SDD compliance check (Stage G0).
- **Issue:** Conventional web frameworks automatically log client IP addresses (`cf-connecting-ip` or `x-forwarded-for`), violating strict privacy decision DEC-B04.
- **Root Cause:** Default server logger configurations.
- **Resolution / Prevention Rule:**
  1. No D1 database table shall contain an `ip_address` column.
  2. Custom Hono logger middleware MUST redact or omit `cf-connecting-ip`.
  3. Rate limiting is enforced via Turnstile tokens and session identifiers, never stored IP hashes.
- **Status:** Prevented / Enforced in `DECISIONS.md` and `PROJECT_BRIEF.md`.

### ERR-004: Wrangler 3.86.0 Ignored wrangler.jsonc Without Flags
- **Discovered During:** G1 Gate Audit check.
- **Issue:** Running `npx wrangler dev` failed with "Missing entry-point: The entry-point should be specified via the command line or the `main` config field." and `npx wrangler d1 migrations apply DB --local` printed nothing at all.
- **Root Cause:** Wrangler 3.86.0 only detected `wrangler.toml` by default; it ignored `wrangler.jsonc` unless explicitly passed via `-c wrangler.jsonc`. In addition, runtime compatibility date fell back to `2024-10-22`.
- **Resolution / Prevention Rule:**
  1. Upgrade to modern `wrangler@4` which supports `wrangler.jsonc` natively.
  2. Upgrade `@cloudflare/workers-types`, `@cloudflare/vitest-pool-workers`, and `vitest` to compatible pinned versions.
  3. Set compatibility date to current (`2024-11-12`).
  4. Ensure root scripts (`npm run dev`, `npm run db:migrate:local`, `npm run db:seed:local`) are present and tested.
- **Status:** Fixed.

