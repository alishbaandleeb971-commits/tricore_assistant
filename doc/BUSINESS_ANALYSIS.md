# Business Analysis: Website AI Assistant, Phase 1

| | |
|---|---|
| **Company** | TriCore Digital Tech |
| **Document status** | Draft for review, revision 4 (updated to the source document version 0.4; no code, no technical design) |
| **Source analysed** | `docs/01-source/PHASE_1_FEATURES_AND_COSTS.md`, Version 0.4 (Draft), 11 Nov 2026, prices checked 18 Oct 2026. Version 0.4 includes the client's written answers, the proposed defaults and management's decisions of 11 November 2026. |
| **Prepared by** | Business / AI systems analysis (for the project developer) |
| **Next step** | Review, then get answers to Section 11 from management |

---

## 0. How to read this document

### 0.1 Labels used

| Label | Meaning |
|---|---|
| **[STATED]** | Written in the source document as decided (source §8.1 or the feature sections). I did not add it. |
| **[DEFAULT]** | A proposed default in source §8.2. It applies "unless management asks for a change", so it is **not formally approved**. |
| **[INFERRED]** | Not written directly, but it follows closely from the source. It still needs confirmation. |
| **[SUGGESTION]** | My own idea or recommendation. **Not** a client requirement. |
| **[TBD]** | To be decided. Missing from the source or listed in source §8.3. |

### 0.2 About the source document

1. **One source only.** This analysis is based only on the Phase 1 document, version 0.3. Version 0.3 already folds in the client's answers ("AI Chatbot – Project Requirements & Answers"), so those answers are covered through it.
2. **It is a summary, not a technical specification.** It is written for management, sales and marketing. Exact screens, field rules and error handling are not specified (Risk R15).
3. **It is a draft and unsigned.** The sign-off table (Management, Sales lead, Marketing lead) is empty. **"[STATED]" means "written in the draft as decided", not "signed off".**
4. **10 items are still open** (source §8.3). Three need explicit management approval: the AI spending limit, the consent wording and the retention periods.
5. **Management (11 Nov 2026) confirmed** the readings of the client's wording: "appointment requests" are callbacks and "performance reporting" is the simple dashboard. **Management also changed the service list from the client's 6 to 8 services.** The mapping of the client's Hot-lead description to fields is still the author's and needs confirmation (A5).

### 0.3 Simple explanations of terms used in this document

| Term | Plain-language meaning |
|---|---|
| **AI model / LLM (large language model)** | The "brain" that reads a visitor's message and writes a reply. Paid per use. |
| **Knowledge base** (the source calls it "what the assistant knows") | The approved content about the 8 services, FAQs and company information, written by the TriCore team and approved by management. |
| **Retrieval** | Finding the right pieces of the knowledge base before the AI writes an answer, so it does not answer from general internet knowledge. |
| **Hallucination** | When an AI confidently says something false, such as an invented price or client. |
| **Guardrails** | Rules that keep the assistant safe, on topic and truthful. |
| **Agent** | A separately designed AI component with its own instructions and job. An agent is **not** the same as a feature; many features need only normal programming (Section 5). |
| **Ordinary backend logic** | Normal programming with fixed rules. Same result every time; no AI. |
| **Handover** | Passing the chat from the assistant to a real team member. |
| **Callback** | The visitor leaves details so the team can contact them later. |
| **Lead** | A visitor who has agreed to share contact details and shown interest in a service (source definition). |
| **Lead scoring (Hot / Warm / Cold)** | Sorting leads by readiness to buy, using fixed rules (Section 4.4). |
| **Consent** | The visitor's permission to collect and store their details. |
| **Data retention** | How long chats and leads are kept before deletion. |
| **Rate limiting** | Limiting how many messages one visitor can send, so spam cannot cause a large AI bill. |
| **Turnstile** | A free Cloudflare tool that tells humans from bots. |
| **Prompt injection ("trick test")** | A visitor tries to make the assistant ignore its rules. |
| **PII** | Personally identifiable information: name, email, phone. |
| **Admin / Staff** | The two access levels in the staff area [DEFAULT]. |
| **CRM** | Software where sales teams track leads. **Not** in Phase 1. |
| **CSV** | A simple spreadsheet file. |
| **QA** | Quality assurance: checking the assistant's answers are correct. |
| **PKT** | Pakistan Standard Time. |

---

## 1. The business problem the system is meant to solve

**[STATED] Goals (source §2):** handle website enquiries 24/7; explain the services; answer customer questions; capture and qualify leads; recommend suitable services; support sales and callback requests; reduce manual workload and response time.

**[INFERRED] Core problem:** TriCore's website enquiries depend on staff being available. Visitors outside working hours, or visitors unsure which service they need, have no instant way to get answers or reach sales, so potential leads may be lost. TriCore also lacks a clear view of what visitors ask.

**[STATED] Success measures:**

| Measure | Target |
|---|---|
| Share of chats that become leads | 5 percent or more |
| Pre-launch answer quality | At least 45 of 50 correct; management approves |
| Sales response to alerts | Within 15 minutes in working hours [DEFAULT] |
| Handover | A team member joins within 3 minutes, otherwise a callback form |

---

## 2. Current problems and inefficiencies

**[STATED]** Current website traffic, monthly enquiries and average response time **will be measured before launch** to set a baseline. The current enquiry process itself is not described.

| # | Likely problem | Evidence in the source | Label |
|---|---|---|---|
| P1 | Enquiries outside working hours (9 AM to 7 PM PKT, Monday to Friday) get no answer, while visitors are in the UK, Australia, Canada and other time zones | "Handle website enquiries 24/7"; international visitors | [INFERRED] |
| P2 | Interested visitors leave without becoming leads | "Capture and qualify leads"; "friendly chat, not a long form" | [INFERRED] |
| P3 | Sales learns about enquiries slowly; manual workload is high | "Reduce manual workload and response time" | [STATED] goal |
| P4 | Visitors are unsure which services they need | "Recommend suitable services"; combination examples | [STATED] goal |
| P5 | Little visibility of visitor questions and demand | Dashboard: "what content to add next", "where demand is" | [INFERRED] |
| P6 | Content updates depend on developers | "no developer needed"; TriCore team maintains content | [INFERRED] |
| P7 | Wrong or invented answers could harm the brand | "never invents prices, clients or promises"; QA | [STATED] |
| P8 | Uncontrolled AI cost | Spending limit, rate limits | [STATED] |

**[TBD] Baseline values:** to be measured before launch. Without them, the benefit of the assistant cannot be shown.

---

## 3. Expected users and stakeholders

### 3.1 People who use or are affected by the system

| Role | Who they are | What they do | Basis |
|---|---|---|---|
| **Website visitor** | Anyone on the site, phone or computer; anonymous at first; in Pakistan, UK, Australia, Canada and other markets | Asks questions, requests a quote, asks for a person, leaves details | [STATED] |
| **Management** | TriCore management | Set the 8-service list and other Phase 1 decisions (11 Nov 2026); approves content, consent wording, retention, AI budget and final quality; reviews chats weekly; signs off | [STATED] |
| **Sales team / Sales lead** | Receives alerts | Gets email and Slack alerts, follows up leads and callbacks, staffs live chats in working hours; signs off | [STATED] |
| **Marketing Lead** | Marketing owner | Reviews at least 20 chats weekly with management; signs off | [STATED] |
| **TriCore team (content authors)** | Staff who write content | Prepares service descriptions, FAQs, company information, the 50 test questions; maintains content after launch | [STATED] |
| **TriCore employees (testers)** | Wider team | Join training and testing; spot wrong or incomplete answers | [STATED] |
| **Admin / Staff users** | Staff-area access levels | Admin: settings and approvals. Staff: read leads and chats, join live chats, draft content | [DEFAULT] |
| **Authorised website developer** | Manages the TriCore website | Adds the chat script after approval | [STATED] |
| **Developer** | Builds and maintains the assistant | Builds, runs the trick test, fixes issues if the score is below 45, maintains (4 to 8 hours/month, estimate) | [STATED] |

**[TBD]** Which named people hold each role, and which business roles map to Admin and Staff (for example, is "management approval" done by Admin users?).

### 3.2 Outside services the system depends on

| Service | Used for | Status |
|---|---|---|
| AI model provider | Writing answers (budget or premium mode) | [STATED] needed; provider [TBD] |
| Cloud server (standard hosting) | Running the assistant 24/7 | [DEFAULT] standard hosting; provider [TBD] |
| Email sending service | Alerts to Info@tricoredigitaltech.com | [STATED]; provider [TBD] |
| Slack | Alerts to the sales and management team | [STATED]; channel [TBD] |
| Cloudflare Turnstile | Spam and bot protection | [STATED] |
| Error monitoring | Detecting faults (free tier) | [STATED] |
| Backup storage | Daily backups | [DEFAULT] daily |
| Code storage (GitHub free plan) | Development and automatic checks | [STATED] |

### 3.3 Sign-off roles [STATED]

Management, Sales lead, Marketing lead. Names, signatures and dates are blank.

---

## 4. Requested features and functionality

> Everything in 4.1 to 4.8 is **[STATED]** unless marked otherwise.

### 4.1 Services in scope

AI Services (includes AI automation and AI chatbots), Digital Marketing, Web Development, Graphic Designing, Search Engine Optimization (SEO), Video Editing, Mobile App Development, WordPress Development (management, 11 Nov 2026; replaces the client's 6). For each, the assistant explains what it is, its benefits and how it solves the customer's problem, from approved content only.

### 4.2 Core features

| # | Feature | What the source says |
|---|---|---|
| 1 | **Chat box on every page** | Phone and computer; quick buttons "Explore services", "Get a quote", "Talk to a person". |
| 2 | **Answers about the 8 services** | Only from management-approved content. "Not sure" plus a person offer when unsure. Never invents prices, clients or promises. Sales confirms final pricing. |
| 3 | **Help for undecided visitors** | Points to a suitable mix of services (combination examples in 4.3). |
| 4 | **Collecting lead details** | Friendly chat; name, email, phone, service, budget range, timeline, short description; permission first; optional questions can be skipped. |
| 5 | **Instant alert to sales** | Email to Info@tricoredigitaltech.com and Slack to the sales and management team. Contents: name and contact details, project requirements, interested services, lead priority, conversation summary, link to the conversation. Not the full chat [DEFAULT]. Hot leads marked urgent. |
| 6 | **Handover to a real person** | 9:00 AM to 7:00 PM PKT, Monday to Friday: a sales team member joins the same chat. Outside hours, or nobody joins within 3 minutes: callback form. Assistant available 24/7. |
| 7 | **Staff area** | Secure sign-in; update knowledge without a developer; read leads and full chats; join live chats; change greeting, working hours, alert recipients, budget ranges. Admin and Staff levels [DEFAULT]. |
| 8 | **Safety, privacy and spending protection** | Stay on topic; consent; hide card-like and password-like numbers; scheduled deletion (chats 90 days, leads 12 months [DEFAULT, needs management approval]); block spam and bots; monthly spending limit; daily backups [DEFAULT]; callback form or company email if the service is unavailable [DEFAULT]. |

### 4.3 Service combinations [STATED as examples]

Web Development + SEO; WordPress Development + SEO; AI Services + Web Development (covers the client's AI Automation and AI Chatbot pairs); SEO + Digital Marketing; Video Editing + Digital Marketing. **Proposed, to be confirmed:** Graphic Designing + Digital Marketing; Mobile App Development + Web Development. Custom packages are shaped by the sales team based on requirements and budget. The assistant never quotes a price.

### 4.4 Lead classification rules

| Level | Rule |
|---|---|
| **Hot** | Budget at or above management's minimum **and** start within 3 months **and** a phone number |
| **Warm** | Name, email and a chosen service |
| **Cold** | Anything less (for example a callback with contact details but no service) |

The client's description of a Hot lead (genuine requirement, defined project, realistic budget, interest in starting soon, readiness to discuss) is mapped in the source to fields: service and description, budget range, timeline, phone number. **This mapping was written by the document's author and needs client confirmation** (Section 7.2, A5). The minimum budget is [TBD]; management decides later (source Decision 3). **Decided:** a lead is saved only with name, email and service (plus consent), and callback requests count as leads.

### 4.5 Dashboard (confirmed for Phase 1)

Date filter (last 7 days, last 30 days, custom). All 8 items [DEFAULT "all 8"; inclusion STATED]:

| Item | Purpose |
|---|---|
| Number of chats | Usage |
| Leads, Hot / Warm / Cold | Lead quality |
| Share of chats that became leads (target 5% or more) | Main success number |
| Times a person was asked for | How often the assistant could not help |
| Top 10 questions | What visitors care about |
| Questions the assistant could not answer | What content to add next |
| Services asked about most | Demand |
| AI spending against the limit, and cost per lead | Cost control |

Plus **CSV export** of the leads list [DEFAULT]. "Performance reporting" in the client's answers means this dashboard in Phase 1; charts, trends, comparisons and emailed reports are Phase 3.

### 4.6 Quality checks (confirmed for Phase 1)

1. **50-question test** written by the TriCore team; pass at least 45 of 50; below that, fix and re-test before launch; **management approves the final result**.
2. **Practice chats** by TriCore employees in five situations (quick question, undecided visitor, quote request, asking for a person, after hours).
3. **Trick test** by the developer.
4. **Weekly review** by the Marketing Lead and management, at least 20 chats, checking accuracy, lead quality, wrong answers and improvements; Good/Wrong buttons; to-fix list; corrections added after management approval.
5. **Re-test after every content change.**

Also tested before launch: alerts and handover, the 3-minute rule, many chats at once, backup recovery.

Good/Wrong buttons are for reviewers only. "Customer satisfaction" is judged by reviewers reading chats; there are no visitor rating buttons in Phase 1 (source Decision 9).

### 4.7 Spending protection

- Monthly AI spending limit, **amount to be approved by management** (suggested $100 for budget mode, about $200 if premium mode at 3,000 chats).
- Warning at 80 percent.
- At the limit: polite "please leave your details" mode; lead capture and handover still work.
- Per-visitor and daily limits.

### 4.8 Operating and cost figures (context, not features)

> From third-party summaries of vendor pages, checked 18 Oct 2026, Rs 280 per US dollar, before tax. **Not verified by me.** The source says to re-check before budget approval.

| Item | Stated figure |
|---|---|
| AI cost per chat | Budget 1 to 2 US cents; premium 4 to 6 US cents |
| Fixed costs (server plus extras) | $15 to $70 per month |
| Monthly total, 500 chats | Budget $20 to $80; premium $35 to $100 |
| Monthly total, 3,000 chats (planning figure) | Budget $45 to $130; premium $135 to $250 |
| Monthly total, 15,000 chats | Budget $165 to $370; premium $615 to $970 |
| Nearly free option, 500 chats | $5 to $10 (AI only); not recommended for real visitors on free AI tiers |
| Testing cash | $5 to $30; $20 test limit [DEFAULT] |
| TriCore staff time for testing | 10 to 15 hours |
| Ongoing people time | Developer 4 to 8 h/month; weekly review about 1 h; content 1 to 2 h/month |
| Traffic rule of thumb | About 1 in 20 visitors opens the chat (3,000 chats ≈ 60,000 visits) |
| **Not included** | Build fee, content writing, taxes, conversion fees |

The v0.3 totals now reconcile: AI usage (chats × cents per chat) plus fixed costs. I checked the arithmetic. **[INFERRED]** At 3,000 chats, premium mode AI usage ($120 to $180) is above a $100 limit, so the limit and the mode must be decided together.

### 4.9 Scope exclusions (preserved exactly)

**Phase 2:** booking calls or appointments in the chat (Phase 1 handles "appointment requests" as callbacks); separate question sets per service and the automatic project brief; CRM connection.

**Phase 3:** portfolio matching; price estimates; file upload; free website check; charts, trends, comparisons and emailed full reports.

**Not planned unless TriCore decides otherwise:** careers assistant; existing-client login; languages other than English; WhatsApp or Facebook chat.

### 4.10 Decisions in the source

| Status | Items |
|---|---|
| **Decided** (§8.1) | 8 services (AI Chatbot within AI Services); dashboard and QA in Phase 1; content by TriCore team, approved by management, within 2 to 3 weeks; 50 questions by TriCore; 45/50 pass mark and re-test process; no prices from the assistant; alert recipients and contents; working hours 9–7 PKT, Monday to Friday; weekly reviewers; content upkeep by TriCore; required lead fields (name, email, service); callbacks count as leads; PKR and USD budget ranges; appointments as callbacks and reporting as the dashboard; website and who installs the script |
| **Proposed defaults** (§8.2) | English only; sales responds within 15 minutes; callback after 3 minutes; 3,000 chats/month; standard hosting; all 8 dashboard items; CSV export; summary and link in alerts; retention 90 days / 12 months; Admin and Staff; fallback form or email; daily backups; $20 test limit on the developer's laptop |
| **Still needed** (§8.3) | (1) AI spending limit; (2) combinations for Graphic Designing and Mobile App Development; (3) Hot-lead minimum budget; (4) the budget range values and timeline choices; (5) consent wording and retention approval; (6) Slack channel; (7) launch date, build budget, ongoing costs; (8) budget or premium mode; (9) visitor rating; (10) website platform (probably WordPress); (11) assistant name and greeting |

---

## 5. Where AI is required and where ordinary backend logic is enough

**Rule used:** AI only where the task needs understanding or writing natural language, or judging meaning. Fixed rules everywhere else.

> **All of Section 5 is [SUGGESTION].**

| Feature / area | AI needed? | Reasoning |
|---|---|---|
| 1. Chat box, quick buttons | **No** | Interface only |
| 2. Answering from approved content | **Yes** | Free-text understanding and natural answers, restricted by retrieval and guardrails |
| 2b. "Not sure" and person offer | **Hybrid** | Judging coverage needs AI plus a relevance rule; routing is ordinary |
| 2c. Never quoting a price | **Hybrid** | AI instructed not to; a fixed output check blocks any amount |
| 3. Guiding undecided visitors | **Yes, with limits** | Understanding a vague goal is a language task; services and combinations come only from the approved list |
| 4. Lead collection | **Hybrid** | AI for friendly wording and picking values from free text; ordinary logic for consent, required fields, validation, skips, saving |
| 4b. Hot / Warm / Cold | **No** | Fixed rules on fields (Section 4.4) |
| 5. Alerts and urgent flag | **No** | Templates and delivery |
| 5b. Conversation summary in alerts | **Yes (optional), with template fallback** | Now needed because alerts carry a summary instead of the full chat [DEFAULT]. A template from the lead fields works if AI fails |
| 6. Working hours, 3-minute timer, callback form, live relay | **No** | Clock rules and message relay |
| 6b. Detecting "I want a person" in free text | **Hybrid** | Wording varies; keyword fallback |
| 7. Staff area, roles, knowledge approval | **No** | Standard application features |
| 8. Staying on topic, refusing tricks | **Hybrid** | AI judges meaning; fixed rules enforce responses |
| 8b. Consent, deletion, rate and spend limits, backups | **No** | Rules, timers, counters, schedules |
| 8c. Hiding card-like and password-like numbers | **No** | Pattern matching |
| Dashboard counts, conversion, cost, date filter, CSV | **No** | Counting from stored data |
| Dashboard "Top 10 questions", "Services asked about most" | **Hybrid** | Grouping needs topic and service tags; tags can be set by the AI that reads each message, then counted by ordinary logic |
| Dashboard "Questions not answered" | **No** | Collect turns flagged "not sure" |
| QA: 50-question test | **Hybrid** | Running is ordinary; judging is by human reviewers (an AI judge is optional) |
| QA: weekly review, Good/Wrong, to-fix list | **No** | Human review plus a simple interface |
| Budget vs premium mode | **Hybrid / TBD** | Decided by test (source Decision 8) |

**Summary [SUGGESTION]:** AI is needed for four jobs: (a) answering from approved content, (b) turning vague goals into approved service suggestions, (c) conversational lead collection and spotting a request for a person, and (d) the alert summary (optional, with a template fallback). Everything else is ordinary logic.

---

## 6. Possible AI agents or specialised components

> **All of Section 6 is [SUGGESTION].** The source does not mention agents.

### 6.1 Starting principle

AI features do **not** each need their own agent. One conversational assistant supported by ordinary services can handle answering, guiding and lead collection. More agents mean more cost, testing and failure points.

### 6.2 Candidate components

| Candidate | Type | Needed in Phase 1? | Why |
|---|---|---|---|
| **A. Main conversation assistant** (answers, guidance, lead conversation) | AI | **Yes** | Covers features 2, 3, 4 and the AI part of 6 |
| **B. Knowledge retrieval** | Search step (not an agent) | **Yes** | Enforces "approved content only" |
| **C. Safety / guardrail check** | Rules plus a small AI check | **Likely, inside A plus fixed rules** | Feature 8 and the trick test; split out only if testing shows A is not safe enough |
| **D. Model-mode router** | Rule or classifier | **TBD** | Only if budget mode is chosen for routine questions |
| **E. Conversation summarizer** | Small AI task | **Likely** | Alerts carry a summary [DEFAULT]; template fallback keeps alerts fast |
| **F. Lead scoring** | Ordinary logic | Yes | Fixed rules |
| **G. Handover manager** | Ordinary logic | Yes | Clock and timer rules |
| **H. Alert sender** | Ordinary logic | Yes | Templates and delivery |
| **I. Spend and rate limiter** | Ordinary logic | Yes | Counters |
| **J. Question grouping for the dashboard** | Tags from A, counted by ordinary logic | Yes | Needed for "Top 10" and "Services asked about most" |
| **K. AI answer judge for QA** | AI | **Optional** | Could speed up the 50-question test; humans stay the final check |

### 6.3 When is a separate agent justified? [SUGGESTION]

Only if the job needs conflicting instructions, different permissions or tools, must be tested or switched off on its own, or testing shows one assistant cannot do both jobs reliably.

**Not agents:** alerts, handover timers, lead scoring, consent, deletion, backups, spam protection, the spending limit, the staff area, dashboard counts.

---

## 7. Missing information, ambiguities, assumptions and risks

### 7.1 Missing information (all [TBD])

| ID | Missing item | Why it matters | Source ref |
|---|---|---|---|
| M1 | Monthly AI spending limit | Needed for the cap and warning; management approval required | §8.3-1 |
| M2 | Combinations for the 2 new services (Graphic Designing, Mobile App Development) | Guidance for undecided visitors | §8.3-2 |
| M3 | Minimum budget for a Hot lead | Hot rule cannot run without it | §8.3-3 |
| M4 | The PKR and USD budget range values; timeline choices | Lead collection and Hot rule | §8.3-4 |
| M5 | Consent wording and approved retention periods; legal review outcome | Visitors in several countries | §8.3-5 |
| M6 | Slack channel; individual alert recipients | Alerts | §8.3-6 |
| M7 | Launch date, build budget, who pays ongoing developer time and hosting | Planning | §8.3-7 |
| M8 | Website platform (probably WordPress, to be confirmed) | How the script is installed | §8.3-10 |
| M9 | Assistant name and greeting | Brand experience | §8.3-11 |
| M11 | Owner per service for the content, and how Google Docs content enters the staff area (delivery: within 2 to 3 weeks, by about 2 Dec 2026) | Content is on the critical path | — |
| M12 | Who exactly is "management" in the system (Admin users?) and who is on duty for live chats | Approvals and handover staffing | — |
| M13 | Recovery targets (maximum data loss, restore time). Daily backups imply up to one day of data loss | Backup recovery is tested but has no target | — |
| M14 | Reply speed, uptime and other service targets | No numbers given | — |
| M15 | Behaviour if the AI provider is down (beyond the callback form) | Partly covered by the fallback default | — |
| M16 | Accessibility and browser support | Not mentioned | — |
| M17 | AI provider, email provider, hosting provider; where data is stored | Privacy and cost | — |
| M18 | Baseline values (measured before launch) | Measuring success | — |

### 7.2 Ambiguities

| ID | Ambiguity | Note |
|---|---|---|
| A1 | **Service list changed from the client's 6 to 8** by management (Graphic Designing and Mobile App Development added; AI Automation renamed AI Services). | The client's written answers still say 6. Make sure the client side agrees, and that content is written for all 8. |
| A4 | **Customer satisfaction** is a weekly review criterion, but there is no visitor rating. | Reviewers judge it from chats unless visitor rating is added (§8.3-9). |
| A5 | **Hot-lead mapping.** The client described Hot leads in words; the source maps them to fields. | "Clearly defined project" and "genuine requirement" are judged only by the presence of a service and description. Confirm this is enough. |
| A6 | **Cold leads will be rare.** Name, email and service are now required to save a chat lead, so every chat lead is at least Warm. Cold leads come only from callbacks without a service. | Expected; the Hot/Warm/Cold split will be mostly Warm and Hot. |
| A7 | **5% target denominator.** Callbacks now count as leads. Is 5% measured over all chats, including chats with only a greeting? | Affects the main success number. |
| A8 | **"Top 10 questions" grouping** method not described. | See Section 5. |
| A9 | **Standard for "correct"** in the 50-question test and weekly review. | Reviewers decide, but against what rule? |
| A10 | **"Urgent" mark format** on Hot alerts. | Define with sales. |
| A11 | **Spending limit vs premium mode.** $100 does not cover premium mode at 3,000 chats. | Decide limit and mode together. |
| A12 | **Proposed defaults apply "unless management asks for a change".** | Silence counts as approval; better to have them signed (S-02). |
| A13 | **Summary in alerts still contains personal data** (name, contact details) sent to email and Slack. | Less than the full chat, but still PII in third-party tools. Confirm with the legal review. |
| A14 | **International visitors and working hours.** Hours are 9–7 PKT, Monday to Friday; how hours are shown to UK, Australian or Canadian visitors is not defined. | Handover messaging. |
| A15 | **Which visitors see PKR ranges.** Decided: PKR for Pakistan, USD for others. How the system tells them apart (visitor's choice, or location) is not defined. | Lead collection; the Hot threshold needs a value in both currencies. |
| A16 | **Cost figures** come from third-party summaries and an exchange rate that changes. | Re-check before approval. |

### 7.3 Assumptions I made [SUGGESTION: please confirm]

| ID | Assumption |
|---|---|
| AS1 | The visitor is anonymous until they agree to give details. |
| AS2 | Phase 1 covers one website (tricoredigitaltech.com). |
| AS3 | The chat is website-only (no WhatsApp, Facebook or app). |
| AS4 | The assistant quotes no prices at all. |
| AS5 | Staff-area users are TriCore employees only. |
| AS6 | Working hours and staff times use PKT. |
| AS7 | Proposed defaults (§8.2) apply unless management changes them. |
| AS8 | "Management" approvals are done by Admin users in the staff area. |

### 7.4 Risks

| ID | Risk | Likelihood / impact (my view) | Mitigation [SUGGESTION] |
|---|---|---|---|
| R1 | Wrong or invented answers harm the brand | Medium / High | Approved content only; "not sure"; output check for prices; 50-question test; trick test; weekly review |
| R2 | **Content is late or thin.** Target is 2 to 3 weeks for 8 services, two of them new (Graphic Designing, Mobile App Development) | High / High | Name an owner per service; start with the 8 service pages and top FAQs; build with placeholder content meanwhile |
| R3 | **Privacy across several countries** (Pakistan, UK, Australia, Canada, others); PII in Slack and email; retention not yet approved | Medium / High | Complete the legal review before launch; approve consent and retention early |
| R4 | Slow response to alerts wastes the system | Medium / High | Name an owner; 15-minute target; record alert-to-first-action time |
| R5 | AI cost spikes from spam or traffic | Medium / Medium | Spend limit, rate limits, Turnstile |
| R6 | Cost estimates outdated | Medium / Medium | Re-check prices and exchange rate before approval |
| R7 | AI provider or server outage | Low-Medium / High | Callback form or company email fallback [DEFAULT]; daily backups |
| R8 | 50 questions is a small sample | Medium / Medium | Add real questions from weekly reviews |
| R9 | Prompt injection or abuse | Medium / Medium-High | Trick test; guardrails; AI has no direct access to data or actions |
| R10 | Handover failures: nobody on duty, international visitors after hours | Medium / Medium | Name who is on duty; callback after 3 minutes; clear after-hours message |
| R11 | **Scope growth.** The service list grew from 6 to 8 after the client's answers | Medium / Medium | Record the 8-service decision in writing; no more services without a written change |
| R12 | Free AI tiers used with real visitors | Low / High | Not used for real data (source recommends against) |
| R13 | Staff-area security: all chats and leads visible; content editable | Low-Medium / High | Secure sign-in; Admin/Staff roles; approval before publishing |
| R14 | Human workload underestimated (content, reviews, alerts, maintenance) | Medium / Medium | Name owners and hours |
| R15 | Detail gap: no screens, field rules or error handling in the source | Medium / Medium | Settle Section 11 before design |
| R16 | **Spending limit set too low for the chosen mode** (A11) | Medium / Medium | Pick mode by test, then set the limit from the 3,000-chat figure |
| R17 | **Unclear build budget and launch date** | Medium / Medium | Agree after requirements and design review, as the client plans |

---

## 8. Confirmed requirements vs. my suggestions

### 8.1 Requirements stated in the source

*(Written in the draft. Not signed off.)*

| ID | Requirement | Label |
|---|---|---|
| REQ-01 | Chat box on every page, phone and computer, with the three quick buttons | [STATED] |
| REQ-02 | Answer about the 8 services only from management-approved content; "not sure" plus a person; never invent prices, clients or promises; sales confirms pricing | [STATED] |
| REQ-03 | Recommend suitable service combinations from the approved list; no prices | [STATED] |
| REQ-04 | Collect name, email, phone, service, budget range, timeline, description conversationally; permission first; optional questions skippable | [STATED] |
| REQ-05 | Email (Info@tricoredigitaltech.com) and Slack alert with the six listed contents; Hot leads urgent | [STATED] |
| REQ-06 | Alerts carry a summary and link, not the full chat | [DEFAULT] |
| REQ-07 | Handover 9:00 AM to 7:00 PM PKT, Monday to Friday; callback outside hours, at weekends or after 3 minutes; assistant 24/7 | [STATED] (3 minutes [DEFAULT]) |
| REQ-08 | Staff area: sign-in, knowledge editing, leads, chats, live chat, settings | [STATED] |
| REQ-09 | Admin and Staff access levels | [DEFAULT] |
| REQ-10 | Content prepared by the TriCore team and approved by management before use | [STATED] |
| REQ-11 | Safety and privacy: on topic, consent, masking, scheduled deletion, spam and bot blocking | [STATED] |
| REQ-12 | Retention: chats 90 days, leads 12 months | [DEFAULT], management approval required |
| REQ-13 | Monthly AI spending limit, 80% warning, details-only mode at the limit, per-visitor and daily limits | [STATED] (amount TBD, management approval required) |
| REQ-14 | Hot / Warm / Cold rules per Section 4.4 | [STATED] (threshold TBD) |
| REQ-15 | Dashboard with date filter and all 8 items | [STATED] (all 8 [DEFAULT]) |
| REQ-16 | CSV export of leads | [DEFAULT] |
| REQ-17 | 50-question test by the TriCore team, pass 45/50, fix and re-test, management approval | [STATED] |
| REQ-18 | Practice chats (five situations) with employees | [STATED] |
| REQ-19 | Trick test by the developer | [STATED] |
| REQ-20 | Weekly review of at least 20 chats by the Marketing Lead and management; Good/Wrong; to-fix list; corrections approved by management | [STATED] |
| REQ-21 | Re-test after every content change | [STATED] |
| REQ-22 | Pre-launch tests: alerts, handover, 3-minute rule, many chats at once, backup recovery | [STATED] |
| REQ-23 | Daily backups; callback form or company email if the service is unavailable | [DEFAULT] |
| REQ-24 | English only | [DEFAULT] |
| REQ-25 | Standard hosting; planning capacity 3,000 chats a month | [DEFAULT] |
| REQ-26 | Sales responds within 15 minutes in working hours | [DEFAULT] |
| REQ-27 | Target: at least 5% of chats become leads | [STATED] |
| REQ-28 | Baseline measured before launch | [STATED] |
| REQ-29 | Phase exclusions as listed in Section 4.9 | [STATED] |

### 8.2 Author's opinion in the source (not client requirements)

- "If time or money is tight" cut order (source §3.7): drop live takeover first, then Good/Wrong buttons, then half of the dashboard. Never cut approved-content answers, consent and privacy, the spending limit, spam protection, instant alerts and the 50-question test.
- The Hot-lead field mapping (Section 7.2, A5). (The appointment and reporting readings are now confirmed by management.)
- Suggested spending-limit figures ($100 budget mode; about $200 premium mode).

### 8.3 My own suggestions

| ID | Suggestion |
|---|---|
| S-01 | Keep the Phase 1 document v0.3 as the single source of truth; record every change in writing. |
| S-02 | Get the §8.2 defaults signed, not just "not objected to". |
| S-03 | Record the 8-service list and the confirmed readings (appointments, reporting) in the signed Phase 1 document. |
| S-04 | One main conversational AI component; summarizer optional with template fallback; everything else ordinary logic. |
| S-05 | Build scoring and the dashboard on the decided rules: required fields name, email, service; callbacks count as leads. |
| S-06 | Decide AI mode and spending limit together, using the 50-question test results and the 3,000-chat figure. |
| S-07 | Name an owner per service so content arrives within the 2 to 3 weeks (R2). |
| S-08 | Finish the legal review and approve consent wording and retention before development of the consent flow. |
| S-09 | Name owners for content, weekly review, alert response, live-chat duty and developer alerts. |
| S-10 | Grow the 50-question set with real questions from weekly reviews. |
| S-11 | Let the visitor pick the currency (PKR or USD) rather than guessing from location, and set the Hot threshold in both currencies. |

---

## 9. Phase 1 scope summary

| In Phase 1 | Phase 2 | Phase 3 | Not planned |
|---|---|---|---|
| Website chat box with quick buttons | Booking calls or appointments in chat | Portfolio matching | Careers assistant |
| Answers about the 8 services from approved content | Separate question sets per service; automatic project brief | Price estimates | Existing-client login |
| Help for undecided visitors (combinations) | CRM connection | File upload | Languages other than English |
| Lead collection with consent; Hot/Warm/Cold | | Free website check | WhatsApp / Facebook chat |
| Email and Slack alerts with summary and link | | Charts, trends, comparisons, emailed reports | |
| Handover 9–7 PKT; callback after hours or after 3 minutes | | | |
| Staff area with Admin and Staff | | | |
| Safety, privacy, spending limit, daily backups | | | |
| Dashboard (8 items) and CSV export | | | |
| Quality checks (50-question test, practice, trick test, weekly review, re-test) | | | |

---

## 10. What I did **not** do

- No code and no technical architecture.
- No invented business requirements; everything outside the source is labelled.
- Did not assume each AI function needs its own agent.
- Preserved the Phase 1 exclusions exactly.
- Did not re-check prices.

---

## 11. Questions still to ask before finalising the design

Most questions are answered by the client and by management (11 Nov 2026). These remain:

### A. Scope

1. Does the client side agree with the 8-service list (management's decision of 11 Nov 2026)?
2. Which combinations may the assistant suggest for Graphic Designing and Mobile App Development? (Proposed: Graphic Designing + Digital Marketing; Mobile App Development + Web Development.)
3. Will management sign the proposed defaults (§8.2), or should silence count as approval?

### B. Content and leads

4. Who owns the content for each of the 8 services?
5. How will Google Docs content be moved into the staff area (copy-paste or import)?
6. What are the PKR and USD budget ranges, and what minimum (in both) counts as a Hot-lead budget?
7. Should visitors pick PKR or USD themselves, or should the system choose by location?
8. What timeline choices should visitors see?
9. Is the field mapping of the client's Hot-lead description (service and description, budget, timeline, phone) acceptable?
10. Is the 5% target measured over all chats, including chats with only a greeting?

### C. Sales and handover

11. Who is on live-chat duty?
12. Which Slack channel, and which individual email addresses besides Info@tricoredigitaltech.com?
13. What should the "urgent" mark look like on Hot alerts?
14. How should working hours be shown to visitors in other countries?

### D. Quality

15. What counts as a "correct" answer in the 50-question test and weekly review?
16. Do you want visitors to rate answers, or will reviewers judge satisfaction from the chats?

### E. Privacy and operations

17. What consent wording, and are 90 days (chats) and 12 months (leads) approved? When will the legal review be done?
18. Is a summary with name and contact details acceptable in Slack and email?
19. What monthly AI spending limit, given the mode chosen after testing?
20. Who receives spending warnings and developer fault alerts?
21. What reply speed and uptime do you expect? How much data loss is acceptable after a failure?
22. Is the website on WordPress, and when can the authorised developer install the script?
23. Any accessibility or browser requirements?
24. What name and greeting should the assistant use?

---

## Appendix A. What changed

### From revision 3 to revision 4

- **Source:** Phase 1 document v0.3 → v0.4 (management's decisions of 11 November 2026).
- **Services:** 6 → **8** (AI Services, Digital Marketing, Web Development, Graphic Designing, SEO, Video Editing, Mobile App Development, WordPress Development). "AI Chatbot" is part of AI Services. A1 now records the change from the client's 6.
- **Combinations:** AI Services + Web Development replaces the AI Automation and AI Chatbot pairs; two proposed combinations for the new services.
- **Decided (moved to [STATED]):** required lead fields; callbacks count as leads; PKR and USD ranges; Monday to Friday; appointments as callbacks and reporting as the dashboard (A2 and A3 removed); content within 2 to 3 weeks.
- **Updated:** M2, M4, M6, M8, M11 (M10 removed); A6, A7, A14, A15; R2, R11; REQ-02, REQ-07; S-03, S-05, S-07, S-11.
- **Questions:** 25 → 24, rewritten to what is still open.

### From revision 2 to revision 3

**Source updated:** from Phase 1 document v0.2 to v0.3 (which includes the client's answers).

**Resolved and moved to [STATED]:** 6 services (was "8 services, names missing"); problem and goals; content owner and approver; 50-question authors; pass-mark process and approver; dashboard and QA in Phase 1 (was pending Decision 8); alert recipients and contents; working hours and time zone; weekly reviewers; content upkeep; visitor regions; website and script installer.

**New label [DEFAULT]** for the client's proposed defaults: English only, 15-minute response, 3-minute callback, 3,000 chats, standard hosting, all 8 dashboard items, CSV export, summary and link alerts, retention 90 days / 12 months, Admin and Staff, fallback form, daily backups.

**New ambiguities:** AI Chatbot service (A1); appointment and reporting interpretations (A2, A3); customer satisfaction without visitor rating (A4); Hot-lead mapping (A5); rare Cold leads (A6); spending limit vs premium mode (A11); silent approval of defaults (A12); PII in alert summaries (A13); budget currency (A15).

**Removed ambiguities:** dashboard status; QA meaning; QA approval; full chat vs summary (now a default); cost figures not reconciling (fixed in v0.3; arithmetic checked).

**New risks:** R16 (limit too low for mode), R17 (unclear budget and launch date). R2, R3 and R11 updated.

**AI components:** the conversation summarizer moved from "not needed if full chat is attached" to "likely", because alerts now carry a summary.

**Questions:** reduced from 40 to 25.

---

*End of document. Waiting for review before any design work starts.*
