# Architectural Decisions & Open Questions

**Project:** TriCore Digital Tech — Website AI Assistant (Phase 1)  
**Authority Order:** (1) Alishba confirmed instructions -> (2) Management `[MGMT]` decisions & `DECISIONS_APPLIED.md` -> (3) `SRS.md` v0.3 -> (4) `SDD_CLOUDFLARE.md` v0.3 -> (5) `AI_AGENT_WORKFLOW.md` rev 3 -> (6) Supporting context.

---

## Part 1 — Approved Architectural Decisions

| Decision ID | Status | Decision Summary & Rationale | Source Document |
|:---|:---|:---|:---|
| **DEC-B01** | Confirmed `[MGMT]` | Platform selection: **Cloudflare Serverless Zero-Cost Stack** (Workers, D1, DO SQLite, Queues, R2, Pages/Assets, Email Routing, Access, Turnstile) over Python/PostgreSQL ($0 vs ~$34-80/mo). | SDD_CLOUDFLARE §2.1 |
| **DEC-B02** | Confirmed `[MGMT]` | Confirmed **8 official service offerings**: AI Services (includes AI Chatbot), Digital Marketing, Web Development, Graphic Designing, SEO, Video Editing, Mobile App Development, WordPress Development. | DECISIONS_APPLIED #1 |
| **DEC-B03** | Confirmed `[MGMT]` | Lead capture is **fully optional**; visitor can decline or exit without blocking knowledge base or FAQ responses. | DECISIONS_APPLIED #2 |
| **DEC-B04** | Confirmed `[MGMT]` | Visitor rate limits: Cloudflare edge rules + **session-based limits** (max 30 msgs/session, 5 sessions/day). **Zero IP storage** in database or logs. | DECISIONS_APPLIED #3 |
| **DEC-B05** | Confirmed `[MGMT]` | Authentication for Staff App: **Cloudflare Access** (Zero Trust) with email OTP pins or Google Workspace. **Zero password hashing or session auth tables** in Worker. | DECISIONS_APPLIED #4 |
| **DEC-B06** | Confirmed `[MGMT]` | Database: **Cloudflare D1 (Serverless SQLite)** + **Drizzle ORM**. Durable Objects SQLite for active conversation state & WebSocket hibernation. | SDD_CLOUDFLARE §4.1 |
| **DEC-B07** | Confirmed `[MGMT]` | Lead notification delivery: **Cloudflare Email Routing** to verified staff inbox + **Slack Incoming Webhook**. | SDD_CLOUDFLARE §8.1 |
| **DEC-B08** | Confirmed `[MGMT]` | Background jobs: **Cloudflare Queues** for async lead dispatch; **Cron Triggers** for scheduled daily maintenance & retention cleanup. | SDD_CLOUDFLARE §8.2 |
| **DEC-B09** | Confirmed `[MGMT]` | Audio voice message processing: **Excluded from Phase 1 scope** (Phase 2 feature). Assistant responds that voice is currently unavailable and offers text chat. | SRS §6.2 (EXC-005) |
| **DEC-B10** | Confirmed `[MGMT]` | Multi-language translation: **Excluded from Phase 1 scope** (English-only baseline, Phase 2 feature). | SRS §6.2 (EXC-001) |
| **DEC-B11** | Confirmed `[MGMT]` | Calendar booking direct integration: **Excluded from Phase 1 scope** (Phase 2 feature; Phase 1 provides static booking link). | SRS §6.2 (EXC-006) |
| **DEC-05** | Confirmed | Model provider: Direct LLM API via Workers fetch (OpenAI / Anthropic / Gemini compatible). Streaming response via SSE. | SDD_CLOUDFLARE §6.1 |
| **DEC-06** | Confirmed | Knowledge base retrieval: In-memory scored keyword & semantic vector retrieval within Cloudflare Worker memory/KV limits without external vector DB cost. | SDD_CLOUDFLARE §7.2 |
| **DEC-09** | Confirmed | Bot protection: **Cloudflare Turnstile** invisible captcha widget verification on chat start / lead submission. | SDD_CLOUDFLARE §12.3 |
| **DEC-10** | Confirmed | Monorepo layout: `packages/worker`, `packages/widget` (Preact), `packages/staff` (React + Vite), `packages/shared` (Zod schemas, types). | SDD_CLOUDFLARE §3.1 |
| **DEC-13** | Confirmed | Data Retention: Anonymous conversations pruned after 30 days; captured leads retained per privacy policy. Cron cleanup in batches of 500 rows. | SDD_CLOUDFLARE §14.2 |
| **DEC-14** | Confirmed | Client-side CSV export: CSV generated directly in browser in staff app to save Worker CPU time. | SDD_CLOUDFLARE §10.3 |
| **DEC-15** | Confirmed | Benchmark execution: 50 test questions executed 1 per HTTP request from staff app test runner to avoid 10ms Worker CPU limits. | SDD_CLOUDFLARE §17.4 |
| **DEC-16** | Confirmed | Transactional lead + outbox write: Single atomic D1 transaction writes lead and queue outbox item; LLM call executed *before* transaction. | SDD_CLOUDFLARE §5.4 |
| **DEC-17** | Confirmed | Error monitoring: `@sentry/cloudflare` on free tier for uncaught Worker exceptions. | SDD_CLOUDFLARE §15.1 |
| **DEC-18** | Confirmed | Widget embedding: Isolated iframe embedding with `postMessage` protocol to protect host website styling and scripts. | SDD_CLOUDFLARE §9.1 |

---

## Part 2 — Open Questions & Launch Blockers (⏳ TBD from SDD §20.3)

These items require real account credentials or business configuration before staging deployment or production launch. None block local development (G1–G5).

| Item ID | Question / Configuration Required | Owner / Resolution Needed | Impact / Blocking Stage |
|:---|:---|:---|:---|
| **⏳ TBD-01** | Real LLM Provider API Key (`AI_API_KEY`) & target model selection (e.g. `gpt-4o-mini`, `claude-3-haiku`, or `gemini-1.5-flash`). | Alishba | Required before G6 Staging live tests. Local dev uses mock AI provider. |
| **⏳ TBD-02** | Real Slack Incoming Webhook URL (`SLACK_WEBHOOK_URL`) for staff lead alerts. | Alishba | Required for G6 live alert verification. Local dev logs to console / mock. |
| **⏳ TBD-03** | Cloudflare Account ID & verified sender/recipient email addresses for Cloudflare Email Routing. | Alishba | Required for staging deployment (G6). |
| **⏳ TBD-04** | Cloudflare Turnstile Site Key & Secret Key (`TURNSTILE_SECRET`). | Alishba | Required for staging deployment. Local dev bypasses with test keys. |
| **⏳ TBD-05** | Cloudflare Zero Trust Access Application AUD & Team Domain for Staff App. | Alishba | Required for staging deployment of staff dashboard. |
| **⏳ TBD-06** | Final production domain name for CORS, widget iframe hosting, and API bindings. | Alishba | Required at G6 pre-launch configuration. |
| **⏳ TBD-07** | Sentry DSN (`SENTRY_DSN`) for production exception monitoring. | Alishba | Optional / needed before production launch. |

