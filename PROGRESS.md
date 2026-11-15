# Project Progress Tracker

**Project:** TriCore Digital Tech — Website AI Assistant (Phase 1)  
**Developer & Owner:** Alishba  
**Current Stage:** G4 — Chatbot Widget & Staff App Screens (Remediation & Live Wiring)  
**Status:** In Progress  
**Last Updated:** 2026-11-15  

---

## 1. Overall Stage Status

| Stage | Name | Target Tasks | Status | Gate Status |
|:---|:---|:---|:---|:---|
| **G0** | Documentation & Control Setup | Setup deliverables | **Completed** | Approved by Alishba |
| **G1** | Foundation and Data | TASK-001 to TASK-008 | **Completed** | Pending Alishba Gate Approval (Live verified) |
| **G2** | Assistant Core | TASK-010 to TASK-017 | **Completed** | Pending Alishba Gate Approval (Live HTTP & D1 verified) |
| **G3** | Worker API & State Machines | TASK-020 to TASK-029 | **In Progress** | NOT Approved (Queue/Cron/WebSocket exports pending) |
| **G4** | Chatbot Widget (Preact) & Staff App | TASK-030 to TASK-038 | **In Progress** | NOT Approved (Widget API wired; Staff React UI screens stubbed) |
| **G5** | Hardening and Staging | TASK-039 to TASK-054 | **In Progress** | NOT Approved (Playwright tests missing; Audit tests incomplete) |
| **G6** | Launch & Production Setup | TASK-060 to TASK-063 | **Not Started** | Locked (Awaiting content, credentials, and gates) |

---

## 2. Current Activity: Stage G4 UI Implementation & Playwright Setup

### What Is Verified and Working Locally:
1. **Worker Runtime:** Starts cleanly via `npm run dev` with Wrangler 4.162.0, correctly exposing all bindings (D1, Durable Objects, Queue, R2, SendEmail, Assets, Vars).
2. **Health Endpoints:** `GET /healthz` and `GET /readyz` return 200 JSON with database connected.
3. **Database Setup:** `npm run db:migrate:local` applies D1 schema and FTS5 tables; `npm run db:seed:local` loads services, settings, and dummy knowledge base.
4. **Backend Services:** PII masking, rate limiting, FTS5 BM25 retrieval, model gateway (fake provider), budget gate, answer guard, ConversationDO, StaffHubDO, lead scoring, queue dispatcher, cron sweep, PKT hours evaluator, retention cleanup, exception handler, and backup workflow.
5. **Static Assets:** Worker serves `/widget/` and `/staff/` with real HTML.

### What Is Incomplete / Stubbed / Missing:
1. **TASK-030 & 031:** Chat widget Preact application (`apps/widget/src/WidgetApp.tsx`) uses an in-memory `setTimeout` mock reply instead of calling `POST /api/v1/public/sessions/:id/messages`.
2. **TASK-033 through 038:** Staff portal (`apps/staff/src/StaffApp.tsx`) has a hardcoded user and renders plain `<div>` string placeholders for Dashboard, Leads + CSV export, Knowledge release management, and Weekly reviews.
3. **TASK-039:** 50-Question benchmark UI screen in Staff App is missing.
4. **TASK-053:** Playwright browser test suite does not exist (zero Playwright files or browser tests).
5. **Gates G1–G5:** Never received individual explicit review and approval from Alishba.



