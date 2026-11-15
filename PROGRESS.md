# Project Progress Tracker

**Project:** TriCore Digital Tech — Website AI Assistant (Phase 1)  
**Developer & Owner:** Alishba  
**Current Stage:** G0 — Project Setup & Documentation Baseline  
**Status:** In Progress (completing setup deliverables)  
**Last Updated:** 2026-11-15  

---

## 1. Overall Stage Status

| Stage | Name | Target Tasks | Status | Gate Status |
|:---|:---|:---|:---|:---|
| **G0** | Documentation & Control Setup | Setup deliverables | **Completed** | Approved |
| **G1** | Foundation and Data | TASK-001 to TASK-008 | **Completed** | Verified Live with Wrangler 4.x |
| **G2** | Assistant Core | TASK-010 to TASK-017 | **Completed** | Verified with 32 Vitest suites |
| **G3** | Worker API & State Machines | TASK-020 to TASK-029 | **Completed** | Verified with 32 Vitest suites |
| **G4** | Chatbot Widget (Preact) & Staff App | TASK-030 to TASK-038 | **In Progress** | Access Middleware done; Widget API connection & Staff UI screens in progress |
| **G5** | Hardening and Staging | TASK-039 to TASK-054 | **In Progress** | Exception handling, security, retention, backup done; Playwright & Staging in progress |
| **G6** | Launch & Production Setup | TASK-060 to TASK-063 | **Not Started** | Runbooks done; Blocked on Launch Decisions & Production Credentials |

---

## 2. Current Activity: Stage G4 UI Implementation & Playwright Setup

### What Is Verified and Working:
1. **Worker Runtime:** Starts cleanly via `npm run dev` with Wrangler 4.162.0, correctly exposing all bindings (D1, Durable Objects, Queue, R2, SendEmail, Assets, Vars).
2. **Health Endpoints:** `GET /healthz` and `GET /readyz` return 200 JSON with database connected.
3. **Database Setup:** `npm run db:migrate:local` applies D1 schema and FTS5 tables; `npm run db:seed:local` loads services, settings, and dummy knowledge base.
4. **Backend Services:** PII masking, rate limiting, FTS5 BM25 retrieval, model gateway, budget gate, answer guard, ConversationDO, StaffHubDO, lead scoring, queue dispatcher, cron sweep, PKT hours evaluator, retention cleanup, exception handler, and backup workflow.
5. **Static Assets:** Worker serves `/widget/` and `/staff/` with real HTML.

### What Is In Progress and Needs Implementation:
1. **TASK-030 & 031:** Chat widget Preact application needs live API wiring to `/api/v1/public/sessions` instead of simulated `setTimeout`.
2. **TASK-033 through 038:** Staff portal needs complete React views for Dashboard, Leads table + CSV export, Knowledge release management, and Weekly reviews (replacing placeholder `<div>` tags).
3. **TASK-039:** 50-Question benchmark UI screen in Staff App.
4. **TASK-053:** Real Playwright browser test suite with `@playwright/test`.


