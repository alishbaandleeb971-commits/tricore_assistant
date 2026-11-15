# Master Implementation Checklist (TODO.md)

**Project:** TriCore Digital Tech — Website AI Assistant, Phase 1  
**Architecture:** Cloudflare Workers, D1, Durable Objects, Hono, Preact, React (`SDD_CLOUDFLARE.md` v0.3)  
**Rule:** No task is marked **Done** unless its acceptance criteria are met and all required automated/manual tests pass. Provisional values from `DECISIONS_APPLIED.md` unblock development; items marked ⏳ are launch blockers (G6), not build blockers.

---

## Stage G1: Foundation and Data

**Gate G1 Deliverable:** `npm test` green; local `wrangler dev` starts; database schema matches SDD §7.

- [x] **TASK-001: Monorepo Layout & Workspace Configuration**
  - **Description:** Set up project directory structure: `apps/worker`, `apps/widget`, `apps/staff`, `packages/shared`, `migrations/`. Initialize root `package.json` with npm workspaces, strict `tsconfig.json`, ESLint, Prettier.
  - **Related SRS Requirement:** N/A (Project foundation)
  - **Related SDD Section:** SDD §1.2, §2.2, §17.3
  - **Acceptance Criteria:** Monorepo workspaces link correctly; TypeScript compiles with zero errors under strict mode; linting passes.
  - **Required Tests:** `npm run typecheck`, `npm run lint`
  - **Dependencies:** None
  - **Status:** Done
  - **Blocking TBDs:** None

- [x] **TASK-002: Cloudflare Wrangler Bindings & Environment Config**
  - **Description:** Create `apps/worker/wrangler.jsonc` defining all platform bindings (`DB` D1, `CONVERSATION` DO, `STAFF_HUB` DO, `NOTIFY` Queue, `BACKUPS` R2, `EMAIL` send_email, `ASSETS`, and cron schedules).
  - **Related SRS Requirement:** IR-008, CON-010
  - **Related SDD Section:** SDD §2.4, §17.3 (DEC-B01, DEC-B02)
  - **Acceptance Criteria:** `wrangler.jsonc` contains no secrets; binding names align with TypeScript definitions; types generate via `npx wrangler types`.
  - **Required Tests:** `npx wrangler types` succeeds without warnings.
  - **Dependencies:** TASK-001
  - **Status:** Done
  - **Blocking TBDs:** None

- [x] **TASK-003: Vitest Test Environment with Workers Pool**
  - **Description:** Configure Vitest with `@cloudflare/vitest-pool-workers` in `apps/worker/vitest.config.ts`, binding to local D1, DO, and Queue.
  - **Related SRS Requirement:** N/A (Testing infrastructure)
  - **Related SDD Section:** SDD §2.2, §16.1 (DEC-14)
  - **Acceptance Criteria:** Sample worker test executes in real local Workers runtime pool.
  - **Required Tests:** `npx vitest run` passes.
  - **Dependencies:** TASK-002
  - **Status:** Done
  - **Blocking TBDs:** None

- [x] **TASK-004: GitHub Actions CI Workflow**
  - **Description:** Create `.github/workflows/ci.yml` running lint, typecheck, Vitest, and migration validation.
  - **Related SRS Requirement:** N/A (CI/CD)
  - **Related SDD Section:** SDD §16.8, §17.4
  - **Acceptance Criteria:** Automated workflow executes cleanly on pull requests and commits.
  - **Required Tests:** Local action syntax validation / dry run.
  - **Dependencies:** TASK-003
  - **Status:** Done
  - **Blocking TBDs:** None

- [x] **TASK-005: Full D1 Database Schema & Drizzle Definitions**
  - **Description:** Implement complete Drizzle schema in `apps/worker/src/db/schema.ts` defining all 25 tables from SDD §7.1 and §7.2 (conversations, messages, leads, consent, handovers, callbacks, notifications, ai_usage, settings, etc.) with foreign keys, checks, and time stored in UTC milliseconds.
  - **Related SRS Requirement:** DR-001–DR-024
  - **Related SDD Section:** SDD §7.1, §7.2, §7.3 (DEC-B02)
  - **Acceptance Criteria:** Drizzle schema matches SDD §7.1 exactly; no IP address columns exist; secondary indexes match §12.4.
  - **Required Tests:** Schema unit tests validating column types, non-null constraints, and relations.
  - **Dependencies:** TASK-001
  - **Status:** Done
  - **Blocking TBDs:** None

- [x] **TASK-006: D1 Migration 0001 & FTS5 Virtual Tables**
  - **Description:** Generate migration `migrations/0001_initial.sql` via Drizzle Kit. Add raw SQL triggers creating `knowledge_fts` (bm25 weights) and `knowledge_trgm` (trigram tokenizer) virtual tables.
  - **Related SRS Requirement:** DR-009, AIR-001
  - **Related SDD Section:** SDD §5.4, §7.2, §7.6 (DEC-B08)
  - **Acceptance Criteria:** Migration applies cleanly to local D1; FTS5 and trigram tables synchronize automatically on chunk insert.
  - **Required Tests:** `npx wrangler d1 migrations apply assistant-dev --local` executes with zero errors.
  - **Dependencies:** TASK-005
  - **Status:** Done
  - **Blocking TBDs:** None

- [x] **TASK-007: D1 Seed Script (from `doc/08-seed/`)**
  - **Description:** Build database seeder reading `doc/08-seed/config/settings_seed.json` and `doc/08-seed/content/knowledge_base_DUMMY.md` to populate 8 services, default combinations, budget ranges, timeline options, assistant texts, and dummy FAQs.
  - **Related SRS Requirement:** BR-001, BR-016, BR-017, FR-020
  - **Related SDD Section:** SDD §5.2, §7.6
  - **Acceptance Criteria:** Seeder inserts 8 services, settings, and dummy knowledge base into local D1 without duplicates.
  - **Required Tests:** Seed test verifying row counts across `service`, `setting`, and `knowledge_chunk`.
  - **Dependencies:** TASK-006
  - **Status:** Done
  - **Blocking TBDs:** None

- [x] **TASK-008: Health Routes (`/healthz` and `/readyz`)**
  - **Description:** Implement public `/healthz` and `/readyz` endpoints in Hono app. `/readyz` executes a `SELECT 1` query against D1 to confirm connectivity.
  - **Related SRS Requirement:** NFR-006, IR-008
  - **Related SDD Section:** SDD §8.2, §14.6
  - **Acceptance Criteria:** `GET /healthz` returns 200 OK; `GET /readyz` verifies D1 health in under 5 ms CPU.
  - **Required Tests:** Integration test for `/healthz` and `/readyz` in Workers test pool.
  - **Dependencies:** TASK-006
  - **Status:** Done
  - **Blocking TBDs:** None

---

## Stage G2: Assistant Core

**Gate G2 Deliverable:** A scripted chat in the terminal answers questions from dummy content and refuses to invent prices.

- [x] **TASK-010: PII Masking Engine (Card & Password Sanitization)**
  - **Description:** Implement `MOD-04` regex masking engine replacing credit card numbers (Luhn check) and password-like sequences with `[hidden]`.
  - **Related SRS Requirement:** FR-147, DR-022, AIR-015
  - **Related SDD Section:** SDD §13.3 (MOD-04)
  - **Acceptance Criteria:** Masking runs in-memory before storage or AI calls; passes positive and negative test fixture suite; zero false drops on normal text.
  - **Required Tests:** Unit tests covering card numbers, separators, passwords, and innocent phone/order numbers.
  - **Dependencies:** TASK-001
  - **Status:** Done
  - **Blocking TBDs:** None

- [x] **TASK-011: Public Sessions API & Turnstile Verification**
  - **Description:** Implement `POST /api/v1/public/sessions` checking Cloudflare Turnstile token, creating `visitor_session` with hashed token (zero IP storage), and returning greeting and quick buttons.
  - **Related SRS Requirement:** FR-003, FR-009, FR-148, DR-024
  - **Related SDD Section:** SDD §8.2, §9.1 (MOD-04)
  - **Acceptance Criteria:** Valid Turnstile token returns 201 with session token and quick buttons; invalid token returns 403; fallback rule handles Turnstile downtime (TBD-15).
  - **Required Tests:** Unit and integration tests with valid, invalid, and mocked timeout Turnstile tokens.
  - **Dependencies:** TASK-006, TASK-010
  - **Status:** Done
  - **Blocking TBDs:** None

- [x] **TASK-012: In-Memory / Edge Rate Limiter (Session & Daily Counters)**
  - **Description:** Implement rate limiting using `rate_counter` table in D1 and edge rule headers (10 msg/min, 40 msg/session, 1,000 chars/msg). Zero visitor IP storage.
  - **Related SRS Requirement:** FR-149, FR-164, EXC-026
  - **Related SDD Section:** SDD §7.2, §13.4, §15.4 (MOD-04, TBD-68)
  - **Acceptance Criteria:** Exceeding 10 msg/min returns 429 with `Retry-After`; messages >1,000 characters return 413.
  - **Required Tests:** Test flood of requests verifying 429 response; message length boundary tests.
  - **Dependencies:** TASK-011
  - **Status:** Done
  - **Blocking TBDs:** None

- [x] **TASK-013: SQLite FTS5 Knowledge Retrieval Service**
  - **Description:** Implement `MOD-07` knowledge retrieval querying `knowledge_fts` (bm25 weights: title 10, keywords 5, body 1) and `knowledge_trgm` fuzzy matches against live content release.
  - **Related SRS Requirement:** AIR-001, AIR-002, FR-020
  - **Related SDD Section:** SDD §5.4, §5.5 (MOD-07, DEC-B08)
  - **Acceptance Criteria:** Searches return top 4 chunks with IDs and scores; scores below threshold return empty results.
  - **Required Tests:** Retrieval tests with exact service terms, synonyms, and misspellings.
  - **Dependencies:** TASK-006, TASK-007
  - **Status:** Done
  - **Blocking TBDs:** None

- [x] **TASK-014: Provider-Independent Model Gateway with Fake Provider**
  - **Description:** Implement `MOD-06` gateway supporting structured JSON outputs (AI-1 result schema) and a deterministic Fake Model Provider for testing.
  - **Related SRS Requirement:** AIR-010, AIR-013
  - **Related SDD Section:** SDD §4.2, §4.3 (MOD-06)
  - **Acceptance Criteria:** Validates AI-1 response schema with Zod; retries once on malformed JSON; tracks token usage and latency.
  - **Required Tests:** Gateway unit tests with mock responses (valid, invalid JSON, timeout).
  - **Dependencies:** TASK-001
  - **Status:** Done
  - **Blocking TBDs:** None

- [x] **TASK-015: AI Monthly Budget Gate & Spend Tracking**
  - **Description:** Implement `MOD-12` budget gate using atomic updates on `spend_month`. Enforces $100 cap and queues 80% warning alert.
  - **Related SRS Requirement:** BR-025, FR-158, FR-159, FR-160
  - **Related SDD Section:** SDD §15.1, §15.3 (MOD-12)
  - **Acceptance Criteria:** Rejection of calls when monthly spend exceeds limit; switch to `DetailsOnly` mode; atomic reservation prevents overspend across concurrent chats.
  - **Required Tests:** Unit tests testing reservation, spend increment, 80% warning trigger, and 100% hard stop.
  - **Dependencies:** TASK-005, TASK-014
  - **Status:** Done
  - **Blocking TBDs:** None

- [x] **TASK-016: Deterministic Answer Guard (Zero Pricing & Grounding)**
  - **Description:** Implement `MOD-08` checking generated text against approved passage IDs, stripping unapproved price quotes, and verifying polite refusal of forbidden topics.
  - **Related SRS Requirement:** AIR-004, AIR-005, AIR-006, FR-023, FR-024, FR-025
  - **Related SDD Section:** SDD §4.6, §7.2 (MOD-08)
  - **Acceptance Criteria:** Blocks ungrounded passage IDs; replaces invented prices with fixed quote-redirect template (`content/assistant_texts.md`); blocks competitor comparisons.
  - **Required Tests:** Test cases with passage hallucination, dollar amounts, competitor mentions, and clean replies.
  - **Dependencies:** TASK-014
  - **Status:** Done
  - **Blocking TBDs:** None

- [x] **TASK-017: Durable Object `Conversation` State Machine**
  - **Description:** Implement `MOD-05` in `Conversation` DO class managing chat turns, routing events, executing AI-1 call, and persisting turns in one atomic D1 batch.
  - **Related SRS Requirement:** FR-004, FR-012–FR-019, AIR-013
  - **Related SDD Section:** SDD §3.3, §6.2, §6.3 (MOD-05, DEC-05, DEC-B03)
  - **Acceptance Criteria:** Serializes chat turns; loads state from D1; calls retrieval and gateway; writes message + usage + state in single D1 batch.
  - **Required Tests:** Multi-turn conversational script in terminal: questions answered from dummy content, price inquiries politely refused.
  - **Dependencies:** TASK-010, TASK-011, TASK-013, TASK-014, TASK-015, TASK-016
  - **Status:** Done
  - **Blocking TBDs:** None

---

## Stage G3: Leads, Handover, Alerts

**Gate G3 Deliverable:** Lead saved -> captured alert in Outbox; human handover times out at 3 minutes in automated test.

- [x] **TASK-020: Visitor Privacy Consent Flow**
  - **Description:** Implement consent step in `MOD-05` and `MOD-09` prior to lead collection. Stores consent record in D1 linked to conversation and wording version.
  - **Related SRS Requirement:** BR-010, BR-011, FR-037, FR-038, DR-003
  - **Related SDD Section:** SDD §10.1, §13.4 (MOD-09)
  - **Acceptance Criteria:** Declining consent saves zero lead fields; agreeing records timestamp, wording version, and transitions to intake.
  - **Required Tests:** Unit tests verifying consent decline vs accept pathways.
  - **Dependencies:** TASK-017
  - **Status:** Done
  - **Blocking TBDs:** None

- [x] **TASK-021: Conversational Lead Intake & Validation**
  - **Description:** Implement scripted lead collection flow: Name, Email, Service (Required); Phone, Currency, Budget Range, Timeline, Description (Optional).
  - **Related SRS Requirement:** FR-040, FR-041, FR-042, FR-043, FR-044, FR-051
  - **Related SDD Section:** SDD §10.1, §10.2 (MOD-09)
  - **Acceptance Criteria:** Validates email and phone; accepts skips for optional fields; shows confirmation recap before saving.
  - **Required Tests:** Intake tests with complete data, skipped fields, invalid email retry, and recap confirmation.
  - **Dependencies:** TASK-020
  - **Status:** Done
  - **Blocking TBDs:** None

- [x] **TASK-022: Pure Function Lead Scoring (Hot / Warm / Cold)**
  - **Description:** Implement deterministic scoring function calculating priority: Hot (Phone + Budget >= threshold + Timeline <= 3 mos); Warm (Name + Email + Service); Cold (others).
  - **Related SRS Requirement:** BR-004, BR-005, BR-006, BR-007, FR-053, FR-054
  - **Related SDD Section:** SDD §10.3 (MOD-09)
  - **Acceptance Criteria:** Pure logic test passes full truth table; uses dev/staging dummy threshold ($2,000 / Rs 500,000) when production threshold is unset.
  - **Required Tests:** Comprehensive truth table unit test covering all scoring combinations.
  - **Dependencies:** TASK-021
  - **Status:** Done
  - **Blocking TBDs:** None

- [x] **TASK-023: Atomic D1 Outbox & Notification Job Enqueueing**
  - **Description:** Write lead, lead services, consent link, and notification rows (`notification` table) in a single atomic D1 batch. Send message to `notifications` Queue.
  - **Related SRS Requirement:** FR-046, FR-056, FR-058, NFR-007
  - **Related SDD Section:** SDD §10.5 (MOD-09, MOD-11, DEC-B06)
  - **Acceptance Criteria:** Atomicity guaranteed: rollback of lead cancels notification; notification dedupe key prevents duplicate entries.
  - **Required Tests:** Integration test verifying atomic write of lead and outbox rows.
  - **Dependencies:** TASK-022
  - **Status:** Done
  - **Blocking TBDs:** None

- [x] **TASK-024: Queue Consumer & Notification Dispatcher (Email & Slack)**
  - **Description:** Implement `queue()` handler in Worker processing outbox rows with retries and exponential backoff. Integrate Cloudflare Email Service and Slack webhook adapters.
  - **Related SRS Requirement:** FR-058, FR-059, FR-060, FR-061, FR-065, EXC-009, EXC-010
  - **Related SDD Section:** SDD §10.5 (MOD-11)
  - **Acceptance Criteria:** Formats email and Slack message from template; flags Hot leads with `🔥 HOT LEAD`; retries failed deliveries up to 5 times.
  - **Required Tests:** Worker queue tests with fake email and Slack adapters; verify status updates to `sent` or `undeliverable`.
  - **Dependencies:** TASK-023
  - **Status:** Done
  - **Blocking TBDs:** None

- [x] **TASK-025: Every-Minute Cron Trigger Sweep**
  - **Description:** Implement `scheduled()` handler in Worker running every minute (`* * * * *`) to re-queue stuck outbox rows older than 2 minutes, check handover timeouts, and write heartbeat.
  - **Related SRS Requirement:** NFR-008, EXC-011
  - **Related SDD Section:** SDD §10.5, §11.3, §16.2 (MOD-16)
  - **Acceptance Criteria:** Cron sweep recovers pending outbox rows; writes heartbeat to `job_run`.
  - **Required Tests:** Test scheduled event execution and recovery of simulated dropped outbox messages.
  - **Dependencies:** TASK-024
  - **Status:** Done
  - **Blocking TBDs:** None

- [x] **TASK-026: Working Hours Evaluator (PKT Timezone Math)**
  - **Description:** Implement timezone-aware evaluation checking whether current time is within 9:00 AM – 7:00 PM PKT, Monday to Friday.
  - **Related SRS Requirement:** CON-007, BR-012, FR-070, FR-071
  - **Related SDD Section:** SDD §11.3 (MOD-10)
  - **Acceptance Criteria:** Accurately evaluates PKT time; handles weekends and `callback_only_today` setting; routes to callback outside hours.
  - **Required Tests:** Unit tests with simulated timestamps (Sunday evening, Tuesday 11 AM PKT, holiday).
  - **Dependencies:** TASK-005
  - **Status:** Done
  - **Blocking TBDs:** None

- [ ] **TASK-027: Handover Durable Object Alarm & 3-Minute Timer**
  - **Description:** Implement `MOD-10` handover initiation in `Conversation` DO. Sets DO alarm for `now + 180 seconds`. If unaccepted when alarm fires, transitions to callback form.
  - **Related SRS Requirement:** FR-069, FR-072, FR-073, EXC-013
  - **Related SDD Section:** SDD §11.2, §11.3 (MOD-10, DEC-B04)
  - **Acceptance Criteria:** DO alarm triggers at 180s; cancels alarm if staff accepts; transitions to `TIMED_OUT` and renders callback form.
  - **Required Tests:** Alarm unit test in Workers test pool verifying timer fires callback transition at exactly 180s.
  - **Dependencies:** TASK-017, TASK-026
  - **Status:** Not started
  - **Blocking TBDs:** None

- [ ] **TASK-028: Durable Object `StaffHub` & WebSocket Live Relay**
  - **Description:** Implement singleton `StaffHub` DO broadcasting waiting handovers to staff sockets. Connects staff operator to visitor `Conversation` DO for two-way live chat with WebSocket Hibernation.
  - **Related SRS Requirement:** FR-075, FR-076, FR-105, FR-110, IR-002
  - **Related SDD Section:** SDD §11.4 (MOD-10, DEC-B03)
  - **Acceptance Criteria:** First staff member to accept claims chat; AI remains silent during live chat; messages relay bi-directionally; disconnect handled cleanly.
  - **Required Tests:** End-to-end WebSocket relay test between simulated visitor and staff connections.
  - **Dependencies:** TASK-027
  - **Status:** Not started
  - **Blocking TBDs:** None

- [ ] **TASK-029: Callback Request Form Intake**
  - **Description:** Implement `POST /api/v1/public/sessions/{id}/callback` storing callback details, creating a lead with `source = callback`, and enqueueing urgent sales alert.
  - **Related SRS Requirement:** FR-078, FR-079, FR-129, DR-006
  - **Related SDD Section:** SDD §10.6, §11.2 (MOD-10)
  - **Acceptance Criteria:** Saves callback row in D1; creates linked lead record; enqueues outbox alert.
  - **Required Tests:** API test submitting callback; verify DB records and outbox row creation.
  - **Dependencies:** TASK-023, TASK-027
  - **Status:** Not started
  - **Blocking TBDs:** None

---

## Stage G4: Screens

**Gate G4 Deliverable:** Click through chat widget and staff administration app locally.

- [ ] **TASK-030: Chat Widget Preact Application (`apps/widget`)**
  - **Description:** Build Preact + TypeScript widget application inside `apps/widget`: message bubbles, quick buttons, consent buttons, budget/timeline selection, handover banner, callback form, and offline card.
  - **Related SRS Requirement:** FR-001–FR-011, IR-001
  - **Related SDD Section:** SDD §3.1 (MOD-02, DEC-09)
  - **Acceptance Criteria:** Bundles under 30KB gzipped; handles WebSocket and polling fallback; respects brand colors (`#00A0F0`, `#0030A0`).
  - **Required Tests:** Component unit tests with Vitest; bundle size check.
  - **Dependencies:** TASK-011, TASK-027
  - **Status:** Not started
  - **Blocking TBDs:** None

- [ ] **TASK-031: Embed Loader Script (`widget.js`) & Iframe Host Isolation**
  - **Description:** Build vanilla JavaScript loader script injected onto host website creating floating launcher button and isolated `<iframe>` pointing to widget app.
  - **Related SRS Requirement:** FR-001, FR-002, IR-007
  - **Related SDD Section:** SDD §3.1 (MOD-01, DEC-09)
  - **Acceptance Criteria:** Single script tag embeds cleanly; communicates open/close state via `window.postMessage`; host page CSS does not bleed into widget.
  - **Required Tests:** Host page embedding test on sample HTML document.
  - **Dependencies:** TASK-030
  - **Status:** Not started
  - **Blocking TBDs:** None

- [ ] **TASK-032: Cloudflare Access JWT Verification Middleware**
  - **Description:** Implement `MOD-13` middleware verifying `Cf-Access-Jwt-Assertion` header on all `/api/v1/staff/*` routes. Maps email to `staff_user` record and enforces RBAC (`Staff` vs `Admin`).
  - **Related SRS Requirement:** FR-085, FR-086, FR-087, NFR-010, NFR-011, §4.2 Permission Matrix
  - **Related SDD Section:** SDD §9.2, §9.3, §9.4 (MOD-13, DEC-B05)
  - **Acceptance Criteria:** Unauthenticated requests receive 401; unauthorized roles receive 403; local dev bypass allows testing with mock header.
  - **Required Tests:** Route permission test matrix covering all staff endpoints across Admin, Staff, and unauthenticated roles.
  - **Dependencies:** TASK-005
  - **Status:** Not started
  - **Blocking TBDs:** None

- [ ] **TASK-033: Staff App Shell & Navigation Layout (`apps/staff`)**
  - **Description:** Initialize React + Vite + Tailwind SPA in `apps/staff` with responsive sidebar navigation, Access identity header (`GET /staff/me`), and route guards.
  - **Related SRS Requirement:** FR-085, IR-002
  - **Related SDD Section:** SDD §3.2 (MOD-03, DEC-10)
  - **Acceptance Criteria:** Static export builds cleanly; navigation displays allowed screens based on user role; times format in PKT.
  - **Required Tests:** Component render and routing tests.
  - **Dependencies:** TASK-032
  - **Status:** Not started
  - **Blocking TBDs:** None

- [ ] **TASK-034: Staff Knowledge Management Screen & Release Flow**
  - **Description:** Build knowledge editor in staff app with entry drafting, Markdown preview, Admin approval, release building (indexes 1 entry per request), and rollback action.
  - **Related SRS Requirement:** FR-092–FR-102
  - **Related SDD Section:** SDD §3.2, §5.3 (MOD-03, MOD-07, MOD-13)
  - **Acceptance Criteria:** Staff can edit FAQs/services; Admin can approve and build release; FTS indexes update; earlier releases can be rolled back.
  - **Required Tests:** End-to-end knowledge release workflow integration test.
  - **Dependencies:** TASK-013, TASK-033
  - **Status:** Not started
  - **Blocking TBDs:** None

- [ ] **TASK-035: Staff Leads Table & Browser CSV Export**
  - **Description:** Build leads management screen displaying leads, priority badges (Hot/Warm/Cold), conversation links, date filter, and browser-side CSV generation with formula injection protection.
  - **Related SRS Requirement:** FR-103, FR-106, FR-107, FR-109
  - **Related SDD Section:** SDD §3.2, §12.5 (MOD-03, MOD-13)
  - **Acceptance Criteria:** Leads table renders paginated rows; CSV builds entirely in browser with sanitized formula prefixes (`=`, `+`, `-`, `@`); UTF-8 BOM included.
  - **Required Tests:** CSV export generator unit test with formula strings and special characters.
  - **Dependencies:** TASK-023, TASK-033
  - **Status:** Not started
  - **Blocking TBDs:** None

- [ ] **TASK-036: Staff Live Chat Console**
  - **Description:** Build live chat screen in staff app connecting to `StaffHub` WebSocket. Shows incoming handover requests, audio/visual notification, accept button, and two-way chat window.
  - **Related SRS Requirement:** FR-105, FR-110, FR-111, FR-112
  - **Related SDD Section:** SDD §3.2, §11.4 (MOD-03, MOD-10)
  - **Acceptance Criteria:** Rings on handover request; operator accepts and joins; messages exchange in real time; operator can end chat cleanly.
  - **Required Tests:** Live chat UI integration test.
  - **Dependencies:** TASK-028, TASK-033
  - **Status:** Not started
  - **Blocking TBDs:** None

- [ ] **TASK-037: 8-Metric Performance Dashboard Screen**
  - **Description:** Implement `MOD-14` queries and staff UI displaying the 8 confirmed metrics with PKT date filter (Last 7 Days, Last 30 Days, Custom Range).
  - **Related SRS Requirement:** FR-116–FR-129, IN-09
  - **Related SDD Section:** SDD §3.2, §12.1, §12.2 (MOD-03, MOD-14)
  - **Acceptance Criteria:** All 8 metrics calculate accurately against reference fixture dataset; results cache for 60 seconds.
  - **Required Tests:** Dashboard SQL query integration tests against reference data fixture.
  - **Dependencies:** TASK-005, TASK-033
  - **Status:** Not started
  - **Blocking TBDs:** None

- [ ] **TASK-038: Weekly 20-Chat Review Screen & To-Fix List**
  - **Description:** Build weekly review interface sampling 20 conversations (stratified: unanswered, wrong, random). Reviewers mark answers Good/Wrong; Wrong answers populate to-fix list.
  - **Related SRS Requirement:** FR-137–FR-140, BR-023, BR-024
  - **Related SDD Section:** SDD §3.2, §16.3 (MOD-03, MOD-15)
  - **Acceptance Criteria:** Samples 20 chats weekly; Good/Wrong buttons persist marks; approved to-fix corrections feed back into knowledge base.
  - **Required Tests:** Sampling algorithm test; review mark persistence test.
  - **Dependencies:** TASK-033
  - **Status:** Not started
  - **Blocking TBDs:** None

- [ ] **TASK-039: 50-Question Benchmark Test Runner UI & CLI**
  - **Description:** Build automated test harness executing 50 questions against assistant (1 question per request to respect 10 ms CPU), scoring accuracy and pass/fail mark (>=45/50).
  - **Related SRS Requirement:** FR-130–FR-134, BR-021, BR-022, RAC-02
  - **Related SDD Section:** SDD §3.2, §16.3 (MOD-15)
  - **Acceptance Criteria:** Runs all 50 questions; records judgements, score, and pass/fail; generates audit record.
  - **Required Tests:** Test runner integration test against fake model provider.
  - **Dependencies:** TASK-017, TASK-033
  - **Status:** Not started
  - **Blocking TBDs:** None

- [ ] **TASK-040: Scheduled Data Retention Job (`03:00 PKT`)**
  - **Description:** Implement daily retention cleanup in Worker scheduled handler (`0 22 * * *` UTC / 03:00 PKT). Deletes expired chats (>90 days) and leads (>12 mos) in batches of 500 rows.
  - **Related SRS Requirement:** BR-027, FR-152, FR-153, DR-020
  - **Related SDD Section:** SDD §7.4, §16.2 (MOD-16)
  - **Acceptance Criteria:** Deletes records in 500-row batches; logs count in `deletion_log`; never deletes active or unexpired records.
  - **Required Tests:** Time-travel test verifying expired records deleted and active records preserved.
  - **Dependencies:** TASK-005, TASK-025
  - **Status:** Not started
  - **Blocking TBDs:** None

---

## Stage G5: Hardening and Staging

**Gate G5 Deliverable:** 5 practice chats pass on staging; 50-question benchmark run with real model passes (>=45/50); CPU budget confirmed.

- [ ] **TASK-050: Comprehensive Exception Handling (EXC-001–EXC-026)**
  - **Description:** Implement and verify all 26 exception scenarios from SRS Section 11 and SDD §14.3 (AI provider failure, circuit breaker, D1 downtime fallback, outbox failure).
  - **Related SRS Requirement:** EXC-001–EXC-026, AC-092
  - **Related SDD Section:** SDD §14.2, §14.3
  - **Acceptance Criteria:** Every exception scenario triggers polite visitor-safe fallback and appropriate developer alert.
  - **Required Tests:** Automated exception injection test suite covering all 26 scenarios.
  - **Dependencies:** Stages G1–G4
  - **Status:** Not started
  - **Blocking TBDs:** None

- [ ] **TASK-051: Pre-Launch Security & Authorization Audit**
  - **Description:** Execute security test suite verifying OWASP Top 10 defenses, Access JWT validation, SQL injection prevention, Turnstile enforcement, PII masking, and strict CORS.
  - **Related SRS Requirement:** NFR-010, NFR-011, NFR-013, NFR-014, AC-087
  - **Related SDD Section:** SDD §13.1, §13.6, §16.6
  - **Acceptance Criteria:** Zero security regressions; 100% of staff routes reject unauthenticated requests; zero PII in logs or DB.
  - **Required Tests:** Security penetration and authorization fuzzing test suite.
  - **Dependencies:** TASK-050
  - **Status:** Not started
  - **Blocking TBDs:** None

- [ ] **TASK-052: CPU Budget & Free-Tier Quota Monitor**
  - **Description:** Validate p99 CPU duration across all routes in staging. Implement hourly usage watch cron checking Cloudflare API and alerting at 60% of any daily cap.
  - **Related SRS Requirement:** NFR-004, NFR-017
  - **Related SDD Section:** SDD §2.4, §2.6, §14.3a, §14.6
  - **Acceptance Criteria:** p99 CPU remains under 7 ms across all endpoints; usage snapshot logs hourly metrics.
  - **Required Tests:** Performance benchmarking test with simulated concurrent load.
  - **Dependencies:** TASK-050
  - **Status:** Not started
  - **Blocking TBDs:** None

- [ ] **TASK-053: Playwright End-to-End Test Suite**
  - **Description:** Build Playwright test suite covering the 5 official practice situations (quick question, undecided visitor, quote request, handover, after-hours chat) across desktop and mobile viewports.
  - **Related SRS Requirement:** FR-135, RAC-03, AC-059
  - **Related SDD Section:** SDD §16.1, §16.7
  - **Acceptance Criteria:** All 5 practice flows execute end-to-end in headless Chromium, Firefox, and WebKit without errors.
  - **Required Tests:** `npx playwright test` passes 100%.
  - **Dependencies:** Stage G4
  - **Status:** Not started
  - **Blocking TBDs:** None

- [ ] **TASK-054: Daily R2 Backup Workflow (GitHub Actions)**
  - **Description:** Create `.github/workflows/backup.yml` running daily at 02:00 PKT (21:00 UTC) executing D1 export, encrypting dump, and storing in R2 bucket with 14-day retention.
  - **Related SRS Requirement:** FR-165, FR-166, FR-167, DR-021
  - **Related SDD Section:** SDD §17.5 (DEC-B07)
  - **Acceptance Criteria:** Automated workflow exports D1, encrypts payload, and uploads to R2; test restore completes within 2 hours (RTO).
  - **Required Tests:** End-to-end backup export and trial restore test.
  - **Dependencies:** TASK-005
  - **Status:** Not started
  - **Blocking TBDs:** None

- [ ] **TASK-055: Staging Deployment & Real Model Benchmark**
  - **Description:** Deploy complete system to separate free staging Cloudflare account. Execute 50-question benchmark with real AI model using $20 test budget.
  - **Related SRS Requirement:** RAC-01, RAC-02, RAC-04, RAC-05
  - **Related SDD Section:** SDD §16.2, §16.3, §17.1 (DEC-B09)
  - **Acceptance Criteria:** Staging deployment healthy; 50-question test scores >= 45/50 (90%); 5 practice situations verified.
  - **Required Tests:** Real-model 50-question evaluation run output log.
  - **Dependencies:** TASK-051, TASK-052, TASK-053
  - **Status:** Not started
  - **Blocking TBDs:** None

---

## Stage G6: Launch

**Gate G6 Deliverable:** Management signs off on production release; real content and settings live; runbooks in place.

- [ ] **TASK-060: Real Content & Knowledge Base Import**
  - **Description:** Import official, management-approved service descriptions, FAQs, and company information replacing DUMMY content.
  - **Related SRS Requirement:** CON-008, ASM-001, BR-020
  - **Related SDD Section:** SDD §5.3, §7.6
  - **Acceptance Criteria:** Real content imported; FTS5 index rebuilt; zero DUMMY placeholders remaining.
  - **Required Tests:** Content verification audit and 50-question re-test.
  - **Dependencies:** Stage G5 sign-off
  - **Status:** Not started
  - **Blocking TBDs:** TBD-26, TBD-66 (⏳ Launch Blocker)

- [ ] **TASK-061: Production Settings & Real Credentials Alignment**
  - **Description:** Configure production settings: real budget ranges (PKR/USD), real Hot threshold, verified email recipients, Slack webhook, and approved consent text.
  - **Related SRS Requirement:** BR-007, BR-011, BR-025, FR-154
  - **Related SDD Section:** SDD §3.4, §10.2, §10.5
  - **Acceptance Criteria:** All ⏳ launch-blocking decisions from `DECISIONS_APPLIED.md` updated with real approved values.
  - **Required Tests:** Production configuration verification script.
  - **Dependencies:** TASK-060
  - **Status:** Not started
  - **Blocking TBDs:** TBD-07, TBD-18, TBD-36, TBD-38, TBD-48 (⏳ Launch Blockers)

- [ ] **TASK-062: Production Deployment & Smoke Verification**
  - **Description:** Deploy Worker, static assets, and D1 migrations to TriCore production Cloudflare account at `assistant.tricoredigitaltech.com`. Verify health endpoints and DNS.
  - **Related SRS Requirement:** RAC-01–RAC-11
  - **Related SDD Section:** SDD §17.2, §17.4
  - **Acceptance Criteria:** Production URL live with SSL; Turnstile active; test chat completes; alerts arrive.
  - **Required Tests:** Production smoke test suite.
  - **Dependencies:** TASK-061
  - **Status:** Not started
  - **Blocking TBDs:** TBD-56, TBD-69, TBD-72 (⏳ Launch Blockers)

- [ ] **TASK-063: Operational Runbooks & Go-Live Handoff**
  - **Description:** Document operational runbooks from SDD §14.8 (provider outage, D1 recovery, alert retry, key rotation, moving to Workers Paid if limits approached).
  - **Related SRS Requirement:** N/A (Operations)
  - **Related SDD Section:** SDD §14.8
  - **Acceptance Criteria:** Runbooks complete, verified, and delivered to management and technical team.
  - **Required Tests:** Documentation review.
  - **Dependencies:** TASK-062
  - **Status:** Not started
  - **Blocking TBDs:** None

