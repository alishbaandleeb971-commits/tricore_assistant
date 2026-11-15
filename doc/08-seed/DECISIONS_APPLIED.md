# Decisions Applied for Building (Provisional)

| | |
|---|---|
| **Date** | 12 November 2026 (rev 2: switched to Option B) |
| **Decided by** | Ahmed Waheed (Co-Founder and Managing Director, TriCore Digital Tech): "go ahead with your recommendations for every question" |
| **Status** | **Provisional, approved for building on the Cloudflare design (`SDD_CLOUDFLARE.md` v0.3, standalone).** Every value can be changed later in settings or by a change note. Items marked **DUMMY** are placeholders for development and testing only and must be replaced before launch. |
| **Source** | The recommended (⭐) option for every question in the open-decisions checklist of 12 Nov 2026 (checklist now retired; this file replaces it) |

Legend: ✅ provisional decision · 🧪 dummy value for building/testing · ⏳ still needs a real value before launch

---

## 1. Big decisions

| # | Topic (TBD) | Decision |
|---|---|---|
| 1 | Build option (TBD-74) | ✅ **Option B, zero-cost infrastructure** (`SDD_CLOUDFLARE.md`, renamed from `SDD_ZERO_COST.md`): TypeScript, Cloudflare Workers + Hono + Zod, D1 (SQLite) + Drizzle, Durable Objects, Queues, Cron Triggers, R2, Cloudflare Access, Cloudflare Email Service, Turnstile; Preact widget and React staff app as static assets. `SDD_CLOUDFLARE.md` is standalone; `SDD.md` v0.2 (Option A) is history only |
| 2 | Option B insurance (TBD-73) | ✅ Start on free plans; review after 3 months; move to Workers Paid ($5/month, no code change) if any daily cap passes 60% twice in a month (DEC-B10) |
| 3 | Launch, budget, support (TBD-56) | ⏳ Target: build in 8 weeks from 16 Nov 2026 → **launch week of 11 Jan 2027** (🧪 planning target). Build budget and support cost: to be set by management |
| 4 | Account ownership (TBD-69) | ✅ TriCore owns all accounts (hosting, AI provider, email, Slack, GitHub); developer gets limited access |
| 5 | Monthly AI limit (TBD-21) | ✅ **$100** (budget mode). Infrastructure: **$0** |
| 6 | AI mode (TBD-10) | ✅ Cheapest mode that scores 45/50 or more |
| 7 | Testing budget (TBD-70) | ✅ Local `wrangler dev`; staging on a **separate free Cloudflare account** (DEC-B09); **$20** AI test limit |

## 2. Leads and sales

| # | Topic (TBD) | Decision |
|---|---|---|
| 8 | Budget ranges (TBD-38) | 🧪 PKR: Under Rs 150,000 · Rs 150,000–500,000 · Rs 500,000–1,500,000 · Above Rs 1,500,000. USD: Under $500 · $500–2,000 · $2,000–5,000 · Above $5,000. ⏳ Replace with TriCore's real ranges |
| 9 | Timeline choices (TBD-38) | ✅ As soon as possible · Within 1 month · 1–3 months · 3–6 months · Just exploring |
| 10 | Hot minimum (TBD-18) | ✅ Production: **not set** (no Hot leads until management sets it; dashboard banner). 🧪 Dev/staging only: Rs 500,000 / $2,000 so Hot scoring can be tested |
| 11 | Hot test (TBD-39) | ✅ Service + description + budget at or above minimum + start within 3 months + phone |
| 12 | Repeated email (TBD-17) | ✅ Update the existing lead; new alert only if it becomes Hot |
| 13 | Alert timing (TBD-41) | ✅ One alert about 60 seconds after the lead is saved; extra alert if it becomes Hot |
| 14 | Abandoned partial lead (TBD-42) | ✅ Not saved as a lead |
| 15 | Hot alert mark (TBD-55) | ✅ Email subject starts with "🔥 HOT LEAD"; Slack message uses @here |
| 16 | Callback form (TBD-40) | ✅ Name (required), email or phone (one required), short note, preferred call time (optional), consent |
| 17 | Sales response time (TBD-52) | ✅ Alert time → staff clicks "Contacted" |
| 18 | Slack and emails (TBD-07, TBD-44) | 🧪 Slack channel `#website-leads`; alert email `Info@tricoredigitaltech.com`; live-chat duty: sales team. ⏳ Real webhook and extra emails needed |
| 19 | Late staff join (TBD-45) | ✅ Allowed if the visitor is still in the chat and hasn't sent the callback form |
| 20 | After live chat (TBD-45) | ✅ The assistant comes back in the same chat |
| 21 | Hours for foreign visitors (TBD-46) | ✅ PKT plus the visitor's local time |
| 22 | Holidays | ✅ Admin switch "callback only today" |

## 3. Services and suggestions

| # | Topic (TBD) | Decision |
|---|---|---|
| — | Services [MGMT] | AI Services · Digital Marketing · Web Development · Graphic Designing · SEO · Video Editing · Mobile App Development · WordPress Development |
| 23 | New combinations (TBD-67) | ✅ Graphic Designing + Digital Marketing; Mobile App Development + Web Development |
| 24 | Other combinations (TBD-34) | ✅ Allowed if each service fits the need and is in approved content |
| 25 | Clarifying questions (TBD-11) | ✅ 2 |

## 4. Content and behaviour

| # | Topic (TBD) | Decision |
|---|---|---|
| 26 | Content owners (TBD-66, TBD-26) | 🧪 Ahmed Waheed (temporary owner of all content). ⏳ Real owners per service |
| 27 | Name and greeting (TBD-30) | ✅ **TriCore Assistant**; greeting in `content/assistant_texts.md` |
| 28 | Refused topics (TBD-61) | ✅ Legal advice · tax or financial advice · comparing with competitors · refunds and complaints (offer a person) · job applications (point to email) |
| 29 | Conflicting entries (TBD-64) | ✅ Say "not sure", offer a person, flag to staff |
| 30 | Content intake (TBD-31) | ✅ Google Doc template → Import screen (format in `content/knowledge_base_DUMMY.md`) |
| 31 | Summary length (TBD-12) | ✅ 2–3 sentences |
| 32 | Chat continuity (TBD-27) | ✅ Continues across pages; resumes within 24 hours in the same browser |
| 33 | Idle close (TBD-29) | ✅ 30 minutes |
| 34 | Repeat limits (TBD-28) | ✅ 2 unclear → buttons; 3 abuse/trick → offer a person; 2 tries per lead field |
| 35 | Visitor ratings (TBD-50) | ✅ No |

## 5. Quality

| # | Topic (TBD) | Decision |
|---|---|---|
| 36 | AI marking help (TBD-23) | ✅ AI suggests marks; staff confirm every answer |
| 37 | Re-test below 45 (TBD-32) | ✅ Don't publish until fixed |
| 38 | Weekly review sample (TBD-49) | ✅ All unanswered/wrong chats + random chats to make 20 |
| 39 | Extra test sets (TBD-63) | ✅ Developer drafts, TriCore approves (🧪 drafts in `content/test_questions_DUMMY.csv`) |
| 40 | Chat definition (TBD-43) | ✅ At least one visitor message |
| 41 | Top 10 grouping (TBD-62) | ✅ By topic label |

## 6. Privacy, legal and access

| # | Topic (TBD) | Decision |
|---|---|---|
| 42 | Consent wording (TBD-36) | 🧪 Draft in `content/assistant_texts.md`. ⏳ Management approval and privacy-policy link |
| 43 | Retention (BR-027) | ✅ Chats 90 days; leads 12 months |
| 44 | Legal review (TBD-53) | ⏳ Management approves with a standard privacy policy before launch (lawyer optional) |
| 45 | Backups and logs (TBD-71) | ✅ D1 Time Travel (7 days) + daily encrypted export to R2 by GitHub Actions: 14 daily + 3 monthly copies; app logs 14 days |
| 46 | IP for rate limits (TBD-68) | ✅ App never stores or uses IP; a Cloudflare rate-limiting rule on `/api/*` runs before the Worker |
| 47 | Data location (TBD-54) | ✅ Europe: D1 location hint `weur`; R2 bucket jurisdiction `eu` |
| 48 | Alert content (TBD-13) | ✅ Summary + link, no full chat |
| 49 | Developer data access (TBD-60) | ✅ Only when needed to fix a problem, logged |
| 50 | Roles (TBD-48) | ✅ Management = Admin; Sales and Marketing = Staff; Admin and Staff may export CSV (built in the browser). Sign-in through Cloudflare Access; role from `staff_user`. 🧪 Admin: Ahmed Waheed. ⏳ Real staff list (max 50 on free Access) |
| 51 | Spending warnings (TBD-47) | ✅ Management + developer |
| 52 | Fault alerts (TBD-25) | ✅ Developer + one backup person (⏳ name) |

## 7. Website and service level

| # | Topic (TBD) | Decision |
|---|---|---|
| 53 | Platform (TBD-57) | ✅ Assume **WordPress**; chat on all pages; script added via a header/footer plugin. ⏳ Confirm platform and installer |
| 54 | DNS to Cloudflare (TBD-72) | ✅ **Yes**: move `tricoredigitaltech.com` DNS to Cloudflare (free). Website hosting stays where it is. Fallback if not possible: `*.workers.dev` address + Brevo free tier for alerts |
| 55 | Targets (TBD-51) | ✅ First words ≤ 3 s; full reply ≤ 8 s; 99.5% uptime target (no SLA on free plans) |
| 56 | Recovery (TBD-16) | ✅ Time Travel: minutes of data loss within 7 days, 1 day beyond; restore within 2 hours |
| 57 | Browsers (TBD-58) | ✅ Latest Chrome, Safari, Edge, Firefox; iPhone and Android |
| 58 | Accessibility (TBD-59) | ✅ Keyboard and screen-reader basics |
| 59 | Baseline (TBD-02) | ⏳ Management to measure before launch |

## 8. Developer decisions

| # | Topic | Decision |
|---|---|---|
| D1 | AI provider (TBD-04) | ✅ Build behind the provider-independent gateway; bake-off OpenAI / Anthropic / Gemini in week 7. 🧪 Develop with whichever key is available first |
| D2 | Hosting (TBD-08) | ✅ Cloudflare free plans: Workers, Durable Objects, D1, Queues, Cron Triggers, R2, static assets ($0). Custom domain `assistant.tricoredigitaltech.com` |
| D3 | Email (TBD-06) | ✅ Cloudflare Email Service `send_email` binding to **verified** team addresses (free); sender `assistant@tricoredigitaltech.com`. Fallback: Brevo free tier |
| D4 | Staff sign-in (TBD-22) | ✅ Cloudflare Access (one-time PIN by email, or Google sign-in); Worker verifies the Access JWT (DEC-B05) |
| D5 | Search (TBD-05) | ✅ D1 FTS5 with bm25 weights + trigram table; Vectorize off (DEC-B08) |
| D6 | Guidance as separate agent (TBD-03) | ✅ No, same AI call |
| D7 | Past messages to AI (TBD-09) | ✅ 6 |
| D8 | Rate limits (TBD-14) | ✅ 10 messages/minute, 40 per chat, 1,000 characters per message; daily AI cap = monthly limit ÷ days × 3; Cloudflare rate rule; hourly usage check alerts at 60% of any free daily cap |
| D9 | Bot check down (TBD-15) | ✅ Allow with stricter limits; log it |
| D10 | Alert retries (TBD-20) | ✅ D1 outbox + Queue retries (max 5, backoff) + every-minute cron sweep; then `undeliverable` banner (DEC-B06) |
| D11 | Night jobs (TBD-24) | ✅ GitHub Actions D1 export 02:00 PKT (21:00 UTC); retention cron 03:00 PKT (22:00 UTC); outbox/handover/idle sweep every minute |
| D12 | "Not sure" threshold (TBD-33) | ✅ Set from test results |
| D13 | Phone formats (TBD-37) | ✅ `libphonenumber-js` (min metadata), default country Pakistan |
| D14 | Pending SDD decisions | ✅ DEC-B01 to DEC-B11 approved (provisional) plus platform-independent DEC-05, DEC-06, DEC-09, DEC-10, DEC-13 to DEC-18, all in `SDD_CLOUDFLARE.md` §20.2 |
| D15 | Code storage | ✅ Private GitHub repository in TriCore's account |
| D16 | Tool | ✅ Antigravity with `ANTIGRAVITY_SETUP_PROMPT.md` (final, v4): agent works a full stage alone; 6 review gates; local commits on `build/*` branches pre-approved; `main`, push and production need Ahmed |
| D17 | Language and tools | ✅ TypeScript (strict), Node.js LTS, pnpm or npm, Wrangler, Vitest with the Workers test pool, Playwright, ESLint + Prettier |
| D18 | 10 ms CPU rules | ✅ Follow `SDD_CLOUDFLARE.md` §2.6: no password hashing, CSV built in the browser, batched deletes, one test question per request, CI fails if p99 CPU > 7 ms |

## 9. Must be replaced before launch (⏳ list)

1. Real knowledge base content for all 8 services, FAQs and company information (replace `content/knowledge_base_DUMMY.md`)
2. Real 50 test questions and approved answers (replace the dummy set)
3. Real budget ranges and the Hot minimum
4. Slack webhook, alert emails, staff list with roles, backup person for fault alerts
5. Consent wording approval and privacy-policy link
6. Website platform confirmation and who installs the script
7. Build budget, support cost and confirmed launch date
8. Baseline numbers
9. **Cloudflare account owned by TriCore** with developer access; `tricoredigitaltech.com` DNS moved to Cloudflare
10. Every alert email address **verified** in Cloudflare Email Routing (one click each)
11. A second free Cloudflare account for staging
