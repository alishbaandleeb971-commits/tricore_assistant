# Project Brief: TriCore Digital Tech — Website AI Assistant, Phase 1

| Property | Value |
|---|---|
| **Product** | Website AI Assistant (Phase 1) |
| **Organization** | TriCore Digital Tech (Rawalpindi, Pakistan · Clients in Pakistan, UK, Australia, Canada) |
| **Website** | https://tricoredigitaltech.com/ |
| **Document Version** | 1.0 (Aligned with SRS v0.3, SDD_CLOUDFLARE.md v0.3, DECISIONS_APPLIED.md rev 2) |
| **Date** | 2026-11-15 |

---

## 1. What the Product Is

The **TriCore Website AI Assistant** is a lightweight edge-hosted chat widget embedded across the TriCore website. It answers visitor questions 24/7 strictly from approved company content, guides undecided visitors toward suitable service combinations, captures qualified sales leads with explicit consent, alerts the sales team instantly via email and Slack, and supports human live-chat takeover during working hours with an automated 3-minute fallback to callback collection. It includes a staff area behind Cloudflare Access for content management, live chat, lead review, and a simple 8-metric dashboard.

---

## 2. Expected Users & Stakeholders

1. **Website Visitors:** Anonymous visitors seeking service information, quote requests, human assistance, or callbacks.
2. **Sales Team (Staff):** Receives instant email/Slack alerts, joins live chats during working hours (9 AM – 7 PM PKT, Mon–Fri), reviews and follows up leads.
3. **Marketing Lead & Content Authors (Staff):** Updates service descriptions and FAQs; performs weekly reviews of 20 conversations using Good/Wrong buttons.
4. **Management & Business Owner (Admin):** Approves content releases, sets budget limits and retention policies, monitors dashboard metrics.
5. **Technical Lead / Developer:** Maintains system health, runs QA test harnesses, monitors zero-cost tier quotas.

---

## 3. Phase 1 Goals

1. **24/7 Grounded Service Answers:** Answer questions exclusively from approved content. If content is missing, admit uncertainty ("not sure") and offer a human. Proven before launch by scoring >= 45/50 (90%) on the 50-question test.
2. **Zero Price Guarantees:** Never state prices, discounts, or fixed promises. State clearly that custom quotes are prepared by the sales team.
3. **Lead Capture & Scoring:** Convert at least 5% of chats into leads through conversational intake with explicit consent, scoring leads as Hot, Warm, or Cold.
4. **Instant Sales Dispatch:** Send instant email and Slack alerts using an atomic database outbox pattern. Hot leads are flagged urgent (`🔥 HOT LEAD`).
5. **Seamless Human Escalation:** Enable live takeover in working hours. If unattended after 180 seconds, transition automatically to callback intake.
6. **Zero Infrastructure Cost:** Run entirely on Cloudflare's free-tier serverless services ($0 monthly infrastructure; AI API fees capped at $100/mo).

---

## 4. Scope Boundaries

### In Scope (Phase 1 — SRS Section 3.1)
- Chat widget on all pages (isolated iframe loader; desktop and mobile responsive).
- Grounded Q&A on 8 approved services: AI Services, Digital Marketing, Web Development, Graphic Designing, SEO, Video Editing, Mobile App Development, WordPress Development.
- Service guidance for undecided visitors (max 2 clarifying questions; approved service mixes).
- Lead collection with explicit consent: Name, Email, Service (Required); Phone, Budget Range (PKR/USD), Timeline, Description (Optional).
- Hot lead scoring based on fixed rules (phone + budget threshold + timeline <= 3 months).
- Instant multi-channel alerts (Cloudflare Email Service to verified team addresses + Slack webhook) via D1 Outbox + Queue.
- Live chat takeover via Durable Objects WebSockets during working hours; 3-minute timer with callback fallback.
- Staff administration app behind Cloudflare Access (Lead viewer, CSV browser export, Live chat console, Knowledge editor, Weekly review with Good/Wrong tagging, 50-question benchmark runner, 8-metric dashboard).
- Security and guardrails: Cloudflare Turnstile, edge rate-limiting rules, in-memory PII masking (cards, passwords), monthly AI spending cap ($100).

### Out of Scope (Exclusions — SRS Section 3.2)
- Direct appointment/calendar booking inside chat (OUT-01; Phase 2).
- External CRM integrations (OUT-04; Phase 2).
- Automatic project brief generation (OUT-03; Phase 2).
- Portfolio matching and price estimates (OUT-05, OUT-06; Phase 3).
- Advanced analytics, trends over time, or emailed reports (OUT-09–OUT-12; Phase 3).
- Additional languages beyond English (OUT-15).
- Third-party chat channels (WhatsApp, Facebook; OUT-16, OUT-17).

---

## 5. Technology Stack & Edge Architecture

- **Runtime & API:** TypeScript (strict), Cloudflare Workers, Hono router, Zod validation.
- **Database & Storage:** Cloudflare D1 (SQLite) with Drizzle ORM, D1 migrations, Time Travel (7 days).
- **State & Concurrency:** Durable Objects `Conversation` (one per chat; serializes events, runs 3-minute alarm) and `StaffHub` (relays staff WebSockets with hibernation).
- **Background Tasks & Outbox:** Cloudflare Queues (`notifications`) + D1 Outbox rows + every-minute Cron Trigger sweep.
- **Knowledge Retrieval:** SQLite FTS5 (bm25 weights) + trigram table for spelling errors (Vectorize disabled by default).
- **Frontend Applications:** Preact + TypeScript widget (isolated `<iframe>`); React + Vite SPA staff app (static assets).
- **Authentication & Security:** Cloudflare Access (one-time PIN or Google OAuth; no password storage in Worker), Cloudflare Turnstile bot protection, edge rate rules.
- **Testing & Tooling:** Vitest with `@cloudflare/vitest-pool-workers`, Playwright E2E, Node.js LTS, Wrangler.

---

## 6. Hard Free-Tier Constraints (SDD §2.4–§2.6)

1. **CPU Limit (10 ms per invocation):** No password hashing (Access handles auth); AI replies streamed; CSV built in browser; retention deletes batched (500 rows); 50-question test runs 1 question per request.
2. **D1 Write Limit (100,000 writes/day):** Single atomic D1 batch for lead + outbox rows; indexes strictly restricted (SDD §12.4); AI call occurs *before* D1 transaction.
3. **Queue Limit (10,000 ops/day, 24h retention):** Outbox rows committed to D1; Queue delivers; 1-minute cron sweeps dropped messages.
4. **Zero IP Address Storage:** The application never stores or inspects IP addresses (SRS DR-024). Rate limiting is handled by session/day counters in D1 and Cloudflare edge rules.
5. **Durable Objects Limits:** WebSocket Hibernation API utilized so idle sockets consume 0 duration.

---

## 7. Authoritative Documentation Hierarchy

1. Explicit instructions from developer/owner (Ahmed Waheed / Alishba).
2. Management decisions (`[MGMT]`) and [`doc/08-seed/DECISIONS_APPLIED.md`](file:///d:/work/Tricore_AI_assistant/doc/08-seed/DECISIONS_APPLIED.md) (rev 2).
3. Software Requirements Specification: [`doc/SRS.md`](file:///d:/work/Tricore_AI_assistant/doc/SRS.md) (v0.3 — 316 requirements).
4. Software Design Document: [`doc/SDD_CLOUDFLARE.md`](file:///d:/work/Tricore_AI_assistant/doc/SDD_CLOUDFLARE.md) (v0.3 — standalone design).
5. Workflow Specification: [`doc/AI_AGENT_WORKFLOW.md`](file:///d:/work/Tricore_AI_assistant/doc/AI_AGENT_WORKFLOW.md) (rev 3).
6. Scope & Cost Document: [`doc/PHASE_1_FEATURES_AND_COSTS.md`](file:///d:/work/Tricore_AI_assistant/doc/PHASE_1_FEATURES_AND_COSTS.md) (v0.4).
7. Supporting Context: [`doc/BUSINESS_ANALYSIS.md`](file:///d:/work/Tricore_AI_assistant/doc/BUSINESS_ANALYSIS.md) (rev 4).

