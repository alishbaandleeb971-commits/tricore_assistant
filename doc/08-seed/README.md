# TriCore Assistant — Seed Pack (rev 3, 14 Nov 2026) — Option B (Cloudflare, zero-cost)

Everything needed to start building now on the **Cloudflare design** (`SDD_CLOUDFLARE.md` v0.3, standalone), using the recommended answer to every open question.
**Put this folder in the project as `doc/08-seed/`.** Put `SDD_CLOUDFLARE.md` in `doc/05-design/`. `SDD.md` (Option A) is history only and not needed for the build.

| File | What it is | Status |
|---|---|---|
| `DECISIONS_APPLIED.md` | Every open question answered; Option B platform choices (D2–D18); dummy values 🧪; must-replace list ⏳ | Provisional, approved for building |
| `ANTIGRAVITY_SETUP_PROMPT.md` | **Final (v4).** Part A: paste once for setup. Part B: one line per build stage. Part C: Antigravity settings. Part D: your tasks | Ready |
| `content/knowledge_base_DUMMY.md` | 8 services, 7 combinations, 6 company entries, 20 FAQs in the import format | DUMMY |
| `content/test_questions_DUMMY.csv` | 50 main + 36 extra test questions with expected behaviour | DUMMY drafts |
| `content/assistant_texts.md` | Greeting, AI notice, consent, lead questions, handover, safe replies, alert template | Draft; consent needs approval |
| `config/settings_seed.json` | Settings incl. Cloudflare platform block (D1, DO, Queue, crons, R2, Access, email) | Provisional + dummy |
| `assets/tricore-logo.png`, `assets/brand.md` | Logo and colours | Colours sampled from logo |

**Before Session 1 (TriCore/you):** create a Cloudflare account in TriCore's name (free); plan the DNS move of `tricoredigitaltech.com` to Cloudflare; create a second free account for staging; verify alert email addresses in Email Routing (after DNS move); install Node.js LTS and Git on Windows.

**Rules:** no real visitor data in tests; secrets only in Worker secrets / `.dev.vars` (never committed); nothing marked DUMMY ships to production.
