# Software Requirements Specification (SRS)

## Website AI Assistant, Phase 1: TriCore Digital Tech

| | |
|---|---|
| **Document ID** | SRS-WAA-P1 |
| **Version** | 0.3 (Draft for review and approval) |
| **Date** | 11 November 2026 |
| **Format** | Structured SRS inspired by ISO/IEC/IEEE 29148 |
| **Prepared by** | Business Analysis and Requirements Engineering |
| **Status** | Draft. **No requirement in this document is final until the approvals in Section 0.2 are signed.** |

### 0.1 Revision history

| Version | Date | Description |
|---|---|---|
| 0.1 | 5 Nov 2026 | First draft prepared from the sources listed in Section 1.4 |
| 0.2 | 11 Nov 2026 | Updated to the Phase 1 document v0.3, Business Analysis revision 3 and Workflow revision 2. Service list resolved; alert content set to summary and link; Hot rule and mapping aligned; P1 section references renumbered; TBD-65 and TBD-66 added. Details in Appendix B. |
| 0.3 | 11 Nov 2026 | Updated to P1 v0.4 with management's decisions (source MG): 8 services; AI Chatbot within AI Services; required lead fields confirmed; callbacks count as leads; PKR and USD ranges; Monday to Friday; appointments and reporting readings confirmed; content within 2 to 3 weeks. Details in Appendix B. |

### 0.2 Approval (blank until reviewed)

| Role | Name | Signature | Date |
|---|---|---|---|
| Business owner | TBD | | |
| Sales lead | TBD | | |
| Marketing lead | TBD | | |
| Management representative | TBD | | |

---

## 1. Introduction

### 1.1 Purpose

This SRS states **what** the Phase 1 Website AI Assistant must do, the rules it must follow, the data it must hold, and how each requirement will be accepted. It is written for the business owner, management, sales, marketing, the developer and the testers.

It does **not** describe how the system is built. Architecture, technology choices, component design and database design belong to the Software Design Document (SDD). **This SRS names no technology stack and none should be inferred from it.**

### 1.2 Scope

**Product:** the *Website AI Assistant* (working name; the assistant's public name is TBD-30), a chat assistant on the TriCore Digital Tech website (https://tricoredigitaltech.com/).

**In one paragraph [P1 §2]:** a chat box on the website where visitors ask about TriCore's services and get quick, correct answers at any hour. If they want a quote, the assistant politely collects their details and sends them to the sales team straight away. If they want a person, the chat is handed over. A simple dashboard shows what visitors ask and how many become leads, and simple quality checks keep the answers correct.

**Objective [CA, Company Information]:** an intelligent AI chatbot that represents TriCore Digital Tech, provides accurate information, assists visitors 24/7, captures qualified leads, recommends relevant services and supports business growth.

The exact Phase 1 scope, and every exclusion, is in **Section 3**.

### 1.3 Definitions and abbreviations

| Term | Meaning |
|---|---|
| **Assistant** | The AI chat assistant that talks to visitors |
| **Visitor** | A person using the TriCore website who opens the chat |
| **Conversation** | One visit's exchange of messages between a visitor, the assistant and, if involved, a team member |
| **Approved content** | Service descriptions, FAQs, company information and customer responses written by the TriCore team and approved by management. Also called "what the assistant knows" |
| **Service list** | The services the assistant may discuss and recommend (the 8 services in P1 §3.1, set by management [MG]: AI Services, Digital Marketing, Web Development, Graphic Designing, SEO, Video Editing, Mobile App Development, WordPress Development; AI Chatbot is part of AI Services) |
| **Quick buttons** | The buttons "Explore services", "Get a quote" and "Talk to a person" |
| **Consent** | The visitor's permission for the assistant to collect and store their details |
| **Lead** | A visitor who has shared contact details and shown interest [P1 §9] |
| **Hot, Warm, Cold** | Lead priority levels defined in BR-004 to BR-006 |
| **Handover** | Passing the conversation from the assistant to a real team member |
| **Live chat** | A conversation in which a team member has joined |
| **Callback form** | A form where the visitor leaves details so the team can contact them later |
| **Working hours** | The period when human support is available: 9:00 AM to 7:00 PM PKT, Monday to Friday (BR-012) |
| **PKT** | Pakistan Standard Time |
| **Staff area** | The secure area where TriCore people manage the assistant |
| **Staff, Admin** | The two system roles (Section 4) |
| **Management** | TriCore Digital Tech management, who approve content, consent wording, retention periods, the AI budget and final quality |
| **Masking** | Hiding card-like and password-like numbers so they are not stored or passed on |
| **Budget mode / premium mode** | A smaller, cheaper AI for routine answers, or a bigger AI for everything [P1 §9] |
| **Spending limit** | A monthly cap on AI fees |
| **Details-only mode** | The "please leave your details" mode used when the assistant cannot use AI (BR-025) |
| **Dashboard** | The simple one-page set of key numbers in the staff area |
| **QA** | Quality assurance: checking that the assistant's answers are correct |
| **50-question test** | The pre-launch test of 50 questions with approved answers (BR-021) |
| **Weekly review** | Weekly human review of at least 20 conversations (BR-023) |
| **To-fix list** | The list of wrong answers with the correct answer typed by the reviewer |
| **Test mode** | Running tests so that no real lead, alert or customer contact is created |
| **CRM** | Customer Relationship Management software (not part of Phase 1) |
| **TBD-nn** | A decision or value still missing; listed in Appendix A |

### 1.4 References and source codes

| Code | Source |
|---|---|
| **P1** | `docs/01-source/PHASE_1_FEATURES_AND_COSTS.md`, Version 0.4 (includes the client's answers, proposed defaults and management's decisions of 11 Nov 2026). Section numbers are given as §n; §3.2-n means core feature n. |
| **CA** | The client's written answers, "AI Chatbot – Project Requirements & Answers" (answers Q1 to Q15, and the Company Information section) |
| **DD** | The "Decisions to Confirm – Proposed Defaults" list in CA (items 1 to 15) |
| **MA** | The "Management approval required" list in CA (AI usage and monthly spending budget; chat and lead retention periods; privacy and consent wording) |
| **MG** | TriCore management's decisions of 11 November 2026, recorded in P1 v0.4 §8.1 (8 services; AI Chatbot within AI Services; required lead fields; callbacks count as leads; PKR and USD ranges; Monday to Friday; appointments as callbacks and reporting as the dashboard; content within 2 to 3 weeks) |
| **RN** | The review notes that propose defaults for open questions |
| **BA** | `docs/02-analysis/BUSINESS_ANALYSIS.md`, revision 4 |
| **WF** | `docs/03-design/AI_AGENT_WORKFLOW.md`, revision 3 (design-level workflow; used here only for behaviour that is visible to users) |

### 1.5 Conventions

**Requirement identifiers**

| Prefix | Meaning |
|---|---|
| BG | Business goal |
| UR | User role |
| IN / OUT | Phase 1 scope item / exclusion |
| PRM | Permission |
| BR | Business rule |
| FR | Functional requirement |
| AIR | AI behaviour and knowledge-grounding requirement |
| DR | Data (information) requirement |
| IR | Interface requirement |
| NFR | Non-functional requirement |
| EXC | Error or exception scenario |
| CON / ASM / DEP | Constraint / assumption / dependency |
| AC | Acceptance criterion |
| TBD | Open decision or missing value |

**Status of each requirement** (shown in the *Status* column)

| Status | Meaning |
|---|---|
| **Confirmed** | Explicitly stated in P1 or in the client's answers (CA) as a requirement. "Confirmed" means *stated by the sources*; formal sign-off is still pending (Section 0.2). |
| **Proposed** | Suggested in DD (proposed defaults), RN or the analysis, but **not yet approved** by the client. It applies only if management approves it or does not object. Items that **need explicit management approval** are listed in Section 14. |
| **TBD** | The requirement is needed, but a value or decision is missing. The open item is named (TBD-nn). |

**Priority** (shown in the *Pri* column): **M** (Must) means required for Phase 1. **S** (Should) means in Phase 1 scope, but the first candidates to defer if time or money forces cuts, following the author's recommendation in P1 §3.7. **That recommendation is not a client decision.**

**Language:** "shall" marks a mandatory requirement. Every requirement is written to be testable. A parameter shown as "[TBD-nn]" must be resolved before the requirement is approved.

**Row-level traceability:** every requirement row shows its *Source* and its *AC* (acceptance criteria). Section 13 gives the consolidated traceability matrices.

### 1.6 Document overview

Section 2 describes the product and its context. Section 3 fixes the Phase 1 scope. Section 4 defines roles and permissions. Section 5 lists business rules. Sections 6 to 10 contain the functional, AI, data, interface and non-functional requirements. Section 11 covers error and exception scenarios. Section 12 states the release acceptance criteria. Section 13 holds the traceability matrices. Section 14 separates confirmed from proposed requirements. Appendix A lists every TBD.

---

## 2. Overall description

### 2.1 Product perspective

The Website AI Assistant is a new capability added to the existing TriCore website. It exchanges information with:

- **Visitors**, through a chat box on every page;
- **TriCore staff**, through a secure staff area;
- **the sales team**, through email and Slack alerts;
- **outside services** for AI answers, email, Slack, spam protection, hosting and error monitoring (Section 9).

In Phase 1, leads are kept in the assistant's own database and emailed. There is no CRM connection [P1 §3.6].

### 2.2 Product functions (summary)

| Function area | Section |
|---|---|
| Chat widget and visitor interface | 6.1 |
| Conversation handling | 6.2 |
| Answers from approved content | 6.3 |
| Service guidance for undecided visitors | 6.4 |
| Consent and lead collection | 6.5 |
| Lead qualification | 6.6 |
| Sales alerts (email and Slack) | 6.7 |
| Human handover, three-minute rule, callback | 6.8 |
| Staff sign-in and roles | 6.9 |
| Knowledge management | 6.10 |
| Leads, chats and live chat | 6.11 |
| Settings | 6.12 |
| Simple dashboard | 6.13 |
| Quality assurance | 6.14 |
| Safety, privacy and spending protection | 6.15 |
| Backup and recovery | 6.16 |

### 2.3 Business goals

| ID | Business goal | Source | Measure |
|---|---|---|---|
| BG-01 | Handle website enquiries 24/7 | CA Q1 | Assistant available 24 hours (NFR-006) |
| BG-02 | Explain company services and answer customer questions correctly | CA Q1 | 45 of 50 correct (BR-021) |
| BG-03 | Capture and qualify potential leads | CA Q1, P1 §2 | At least 5 percent of chats become leads (BR-028) |
| BG-04 | Recommend suitable services to undecided visitors | CA Q1 | Section 6.4 acceptance criteria |
| BG-05 | Reduce manual workload and response time | CA Q1 | Baseline TBD-02; alert response target (BR-029) |
| BG-06 | Give the business visibility of what visitors ask | P1 §3.4 | Dashboard (Section 6.13) |
| BG-07 | Keep answers correct and the brand safe | P1 §3.5 | QA (Section 6.14) |
| BG-08 | Keep AI cost under control and protect visitor data | P1 §6.4 | Spending limit; privacy rules (Section 6.15) |

### 2.4 Operating context

- Visitors use phones and computers [P1 §3.2].
- Visitors are in Pakistan, the UK, Australia, Canada and other international markets [CA Q13].
- The assistant is available 24/7; human support is provided by the sales team during working hours, 9:00 AM to 7:00 PM PKT, Monday to Friday [CA Q10, MG].
- Supported browsers and devices: TBD-58.

### 2.5 Constraints

| ID | Constraint | Status | Source |
|---|---|---|---|
| CON-001 | Phase 1 scope is limited to Section 3. Phase 2, Phase 3 and "not planned" items are excluded. | Confirmed | P1 §3.6 |
| CON-002 | Leads are stored in the assistant's own database and emailed; no CRM connection. | Confirmed | P1 §3.6 |
| CON-003 | The same basic details are collected for every service. | Confirmed | P1 §3.6 |
| CON-004 | Sales alerts are sent by email and Slack. | Confirmed | P1 §3.2-5 |
| CON-005 | Spam protection is named as Cloudflare Turnstile in P1 §6.1. Using a different tool requires confirmation in the SDD. | Confirmed | P1 §6.1 |
| CON-006 | The assistant works in English only. | Proposed | DD 1, P1 §3.6 |
| CON-007 | Human support hours are 9:00 AM to 7:00 PM PKT, Monday to Friday. | Confirmed | CA Q10, MG |
| CON-008 | Answers come only from content prepared by the TriCore team and approved by management. | Confirmed | CA Q5, P1 §3.2-2 |
| CON-009 | Launch date and development budget are not fixed. | TBD | CA Q2 (TBD-56) |
| CON-010 | Hosting uses the standard setup (not the nearly free setup). | Proposed | P1 §6.6, DD 7 (TBD-08) |
| CON-011 | Free AI services are not used with real visitor data. | Proposed | P1 §6.6 |
| CON-012 | Privacy requirements follow the applicable laws of visitor locations, subject to legal review. | Confirmed | CA Q13 (TBD-53) |

### 2.6 Assumptions and dependencies

| ID | Assumption or dependency | Source |
|---|---|---|
| ASM-001 | The TriCore team prepares the content and the 50 test questions before training and testing. Content is due within 2 to 3 weeks of 11 Nov 2026 [MG]; the owner per service is [TBD-66]. Development starts with placeholder content. | CA Q5, Q6, MG |
| ASM-002 | Management approves content, consent wording, retention periods and the AI budget before launch. | CA Q5, MA |
| ASM-003 | The sales team staffs human support during working hours. | CA Q10 |
| ASM-004 | Current website traffic, monthly enquiries and average response time are measured before launch to set a baseline. | CA Q1 (TBD-02) |
| ASM-005 | About 1 in 20 website visitors opens the chat. Planning capacity is 3,000 chats a month. | P1 §6.2, DD 5 |
| ASM-006 | Cost figures in P1 are estimates from third-party summaries and must be re-checked before a budget is approved. | P1 §6 |
| DEP-001 | The authorized website developer installs the chat script after approval. | CA Q14 (TBD-57) |
| DEP-002 | Outside services (AI provider, email, Slack, spam protection, hosting, error monitoring) are available. | P1 §6.1, Section 9 |
| DEP-003 | About 10 to 15 hours of TriCore staff time are available for testing. | P1 §7.2 |
| DEP-004 | Legal review is arranged where required. | CA Q13 |

### 2.7 Conflicts between the sources and how this SRS treats them

| # | Topic | What the sources say | Treatment in this SRS | TBD |
|---|---|---|---|---|
| 1 | Services | CA Q4 lists 6 services. **Management [MG] set 8**: AI Services (includes AI automation and chatbots), Digital Marketing, Web Development, Graphic Designing, SEO, Video Editing, Mobile App Development, WordPress Development. | All service requirements refer to "the service list" = the 8. | None |
| 2 | Appointments | CA Q1: "support sales and appointment requests". P1: booking calls in chat is Phase 2. | **Confirmed [MG]:** a callback request. Phase 1 provides lead capture and a callback form only (OUT-01). | None |
| 3 | Reporting | CA Q3: "performance reporting". P1: charts, trends, full reports are Phase 3. | **Confirmed [MG]:** the simple dashboard. Only that is specified (OUT-09 to OUT-12). | None |
| 4 | Service combination | CA Q7 lists "AI Chatbot + Website Development", but AI Chatbot was not in CA's service list. | **Resolved [MG]:** AI Chatbot is part of AI Services, so the combination is AI Services + Web Development. | None |
| 5 | Alert content | **Aligned.** P1 v0.3 §3.2-5, CA Q9 and DD 10 all say summary and link, not the full chat. | FR-060 and FR-061 (Proposed, as DD 10 is a default). | TBD-13 only if management changes it |
| 6 | AI monthly limit | P1 suggests $100 for budget mode, or about $200 for premium mode at 3,000 chats. DD 6: "determined according to actual requirements". MA: management approval required. | The limit feature is confirmed; the amount is open. | TBD-21 |
| 7 | Hot leads | P1 has a rule (serious budget, start within 3 months, phone number) and v0.3 §4 maps CA Q8's words to fields. | The P1 rule is used (BR-004); the mapping is Proposed (BR-009). | TBD-18, TBD-39 |
| 8 | Feedback buttons | CA Q3: "Good/Wrong feedback buttons". P1: buttons used by reviewers. CA Q11 lists "customer satisfaction". | Buttons are for reviewers only. No visitor rating feature exists in Phase 1. | TBD-50 |
| 9 | Slack | P1 requires Slack alerts. CA gives only an email address. | Slack recipients and channel are open. | TBD-07 |
| 10 | Time zones | Hours are in PKT. Visitors are in the UK, Australia, Canada and elsewhere. | Hours are evaluated in PKT; working days are Monday to Friday [MG]. Display to visitors is open. | TBD-46 |
| 11 | Dashboard and QA status | BA treated the dashboard as pending (P1 Decision 8). CA Q3 answers **Yes**: Phase 1 includes the dashboard, the 50-question test, weekly reviews and Good/Wrong buttons. | Dashboard and QA are in scope (IN-09, IN-10). | None |
| 12 | Required and optional lead fields | Neither P1 v0.3 nor CA said which fields are optional. | **Resolved [MG]:** FR-042 is Confirmed. | None |
| 13 | Retention, roles, backups, fallback | Only in DD, as proposed defaults. | Marked Proposed. Retention needs explicit management approval (MA). | TBD-16, TBD-48 |

---

## 3. Phase 1 scope and exclusions

This section preserves the scope of P1 §3. Nothing may be added to Phase 1 without a written change approved by the business owner.

### 3.1 In scope

| ID | Phase 1 scope item | Source | Section |
|---|---|---|---|
| IN-01 | Chat box on every page, on phone and computer, opening with quick buttons ("Explore services", "Get a quote", "Talk to a person") | P1 §3.2-1 | 6.1 |
| IN-02 | Answers about the services, only from approved content; "not sure" behaviour; never invents prices, clients or promises | P1 §3.2-2 | 6.3 |
| IN-03 | Help for undecided visitors, pointing to the right mix of services | P1 §3.2-3 | 6.4 |
| IN-04 | Lead collection in a friendly chat: name, email, phone, service, budget range, timeline, short description; permission first; optional questions can be skipped | P1 §3.2-4 | 6.5 |
| IN-05 | Instant alert to sales by email and Slack; Hot leads marked urgent | P1 §3.2-5 | 6.7 |
| IN-06 | Handover to a real person during working hours; callback details outside working hours or if nobody joins within 3 minutes | P1 §3.2-6 | 6.8 |
| IN-07 | Staff area: secure sign-in; update what the assistant knows; read leads and full chats; join live chats; change greeting, working hours, alert recipients, budget ranges | P1 §3.2-7 | 6.9 to 6.12 |
| IN-08 | Safety, privacy and spending protection: stay on topic; consent; hide card-like and password-like numbers; delete old chats on a schedule; block spam and bots; monthly spending limit | P1 §3.2-8 | 6.15 |
| IN-09 | Simple dashboard with a date filter and eight items; leads list downloadable as a spreadsheet | P1 §3.4, CA Q3 | 6.13 |
| IN-10 | Simple quality checks: 50-question test, practice chats, trick test, weekly review with Good/Wrong buttons and a to-fix list, re-test after every content change | P1 §3.5, CA Q3 | 6.14 |
| IN-11 | Pre-launch tests: alerts and handover, many chats at once, recovery from a backup | P1 §7.1 | 6.14 |
| IN-12 | Leads kept in the assistant's own database and emailed | P1 §3.6 | 6.5 |

### 3.2 Out of scope (exclusions)

| ID | Excluded item | Deferred to | Source |
|---|---|---|---|
| OUT-01 | Booking calls inside the chat | Phase 2 | P1 §3.6 |
| OUT-02 | Separate question sets for each service (Phase 1 collects the same basic details for every service) | Phase 2 | P1 §3.6 |
| OUT-03 | The automatic project brief | Phase 2 | P1 §3.6 |
| OUT-04 | Connection to a CRM | Phase 2 | P1 §3.6 |
| OUT-05 | Portfolio matching | Phase 3 | P1 §3.6 |
| OUT-06 | Price estimates | Phase 3 | P1 §3.6 |
| OUT-07 | File upload | Phase 3 | P1 §3.6 |
| OUT-08 | The free website check | Phase 3 | P1 §3.6 |
| OUT-09 | Charts over time | Phase 3 | P1 §3.4, §3.6 |
| OUT-10 | Trends | Phase 3 | P1 §3.4, §3.6 |
| OUT-11 | Comparisons | Phase 3 | P1 §3.4, §3.6 |
| OUT-12 | Emailed reports (the "full reports") | Phase 3 | P1 §3.4, §3.6 |
| OUT-13 | Careers assistant | Not planned unless the client decides otherwise | P1 §3.6 |
| OUT-14 | Existing-client login | Not planned unless the client decides otherwise | P1 §3.6 |
| OUT-15 | Other languages | Not planned unless the client decides otherwise | P1 §3.6 |
| OUT-16 | Chat on WhatsApp | Not planned unless the client decides otherwise | P1 §3.6 |
| OUT-17 | Chat on Facebook | Not planned unless the client decides otherwise | P1 §3.6 |

**Clarifications:** "appointment requests" in CA Q1 means a callback request in Phase 1 (OUT-01 applies). "Performance reporting" in CA Q3 means the simple dashboard only (OUT-09 to OUT-12 apply). Both readings are confirmed by management [MG].

---

## 4. User roles and permissions

### 4.1 User roles

| ID | Role | Description | Source |
|---|---|---|---|
| UR-01 | **Website visitor** | Anyone using the chat; anonymous until they give consent; no account | P1, CA Q13 |
| UR-02 | **Business owner** | Approves scope and decisions; signs off | P1 §11 |
| UR-03 | **Management** | Approves content, consent wording, retention periods, AI budget and final chatbot quality; reviews conversations weekly | CA Q5, Q11, Q15, MA |
| UR-04 | **Sales team / Sales lead** | Receives alerts, follows up leads, staffs live chats and callbacks in working hours | CA Q9, Q10 |
| UR-05 | **Marketing lead** | Reviews at least 20 conversations a week; signs off | CA Q11, P1 §11 |
| UR-06 | **Content author** | A member of the TriCore team who prepares content and the 50 test questions | CA Q5, Q6 |
| UR-07 | **Developer** | Builds and maintains the system; runs the trick test. Access to production data: TBD-60. | P1 §3.5, §6.3 |
| UR-08 | **Staff** (system role) | A signed-in TriCore user with limited permissions | DD 13 |
| UR-09 | **Admin** (system role) | A signed-in TriCore user with full permissions | DD 13 |

**Mapping of business roles to system roles [Proposed, TBD-48]:** content authors, sales team and marketing lead use the *Staff* role; management and the business owner use the *Admin* role.

### 4.2 Permission matrix

Yes means allowed; No means not allowed; "n/a" means not applicable to that role.

| ID | Capability | Visitor | Staff | Admin | Status | Source | FR |
|---|---|---|---|---|---|---|---|
| PRM-001 | Open the chat, send messages, use quick buttons | Yes | n/a | n/a | Confirmed | P1 §3.2-1 | FR-001 to FR-007 |
| PRM-002 | Give or decline consent | Yes | n/a | n/a | Confirmed | P1 §5 | FR-037, FR-038 |
| PRM-003 | Submit lead details and the callback form | Yes | n/a | n/a | Confirmed | P1 §3.2-4, §3.2-6 | FR-040, FR-078 |
| PRM-004 | Sign in to the staff area | No | Yes | Yes | Confirmed | P1 §3.2-7 | FR-085 |
| PRM-005 | View the dashboard | No | Yes | Yes | Confirmed | P1 §3.4 | FR-116 |
| PRM-006 | View leads | No | Yes | Yes | Confirmed | P1 §3.2-7 | FR-103 |
| PRM-007 | Download the leads list as a spreadsheet | No | Yes | Yes | Proposed (TBD-48) | P1 §3.4, DD 9 | FR-106 |
| PRM-008 | Read full chats | No | Yes | Yes | Confirmed | P1 §3.2-7 | FR-104 |
| PRM-009 | Join live chats | No | Yes | Yes | Confirmed | P1 §3.2-7 | FR-105 |
| PRM-010 | Draft and edit knowledge content | No | Yes | Yes | Confirmed | P1 §3.2-7 | FR-092 |
| PRM-011 | Approve and publish knowledge content | No | No | Yes | Proposed (CA Q5: management approves; TBD-48) | CA Q5 | FR-094 |
| PRM-012 | Mark answers Good or Wrong; add to-fix entries | No | Yes | Yes | Confirmed | P1 §3.5 | FR-139, FR-140 |
| PRM-013 | Approve to-fix corrections for publication | No | No | Yes | Proposed | CA Q5 | FR-100 |
| PRM-014 | Run the 50-question test | No | No | Yes | Proposed | P1 §3.5 | FR-131 |
| PRM-015 | View 50-question test results | No | Yes | Yes | Proposed | P1 §3.5 | FR-132 |
| PRM-016 | Change greeting, working hours, alert recipients, budget ranges | No | No | Yes | Proposed (P1 says "your team"; restriction to Admin is proposed) | P1 §3.2-7 | FR-111 |
| PRM-017 | Change retention periods, spending limit, Hot-lead budget threshold | No | No | Yes | Proposed | DD 11, 12, MA | FR-113, FR-114 |
| PRM-018 | Create and disable staff accounts | No | No | Yes | Proposed | DD 13 | FR-089 |

---

## 5. Business rules

| ID | Business rule | Status | Source | Related requirements |
|---|---|---|---|---|
| BR-001 | The assistant answers only from approved content. | Confirmed | P1 §3.2-2 | FR-020, AIR-001 |
| BR-002 | The assistant never invents prices, clients or promises. | Confirmed | P1 §3.2-2 | FR-023, AIR-004 |
| BR-003 | The assistant gives no price estimates in Phase 1 (price estimates are Phase 3). | Confirmed | P1 §3.6 | FR-024, FR-025 |
| BR-004 | A lead is **Hot** when it has a serious budget **and** a start date within 3 months **and** a phone number. (Because name, email and service are required to save a lead, FR-042, every Hot lead also holds the Warm details.) | Confirmed | P1 §4 | FR-053 |
| BR-005 | A lead is **Warm** when it has name, email and a chosen service. | Confirmed | P1 §4 | FR-053 |
| BR-006 | A lead is **Cold** when it has less than the Warm details (for example a callback request with contact details but no service). | Confirmed | P1 §4 | FR-053 |
| BR-007 | A "serious budget" is a budget at or above the minimum threshold set by management. The amount is [TBD-18]. | TBD | CA Q8 | FR-057 |
| BR-008 | Hot leads are marked urgent in the alert. | Confirmed | P1 §3.2-5 | FR-059 |
| BR-009 | The client's descriptive Hot attributes are proved by fields: genuine requirement and defined project → a chosen service and a short description; realistic budget → a budget range at or above the threshold (BR-007); interest in starting soon → a timeline within 3 months; readiness to discuss → a phone number. Client confirmation is [TBD-39]. | Proposed | CA Q8, P1 §4 | FR-053 |
| BR-010 | Permission is asked before any lead detail is collected. The visitor may decline, and may skip optional questions. | Confirmed | P1 §3.2-4, §5 | FR-037 to FR-041 |
| BR-011 | Management approves the consent wording and the data retention periods before launch. | Confirmed | CA Q13, MA | FR-154 |
| BR-012 | Working hours are 9:00 AM to 7:00 PM PKT, Monday to Friday. | Confirmed | CA Q10, MG | FR-070 |
| BR-013 | The assistant is available 24/7. Human support is provided by the sales team during working hours only. | Confirmed | CA Q10 | FR-069, NFR-006 |
| BR-014 | During working hours a team member joins the chat. Outside working hours, or if nobody joins within 3 minutes, the visitor leaves details for a callback. | Confirmed | P1 §3.2-6, DD 3 | FR-069 to FR-072 |
| BR-015 | Final pricing is always confirmed by the sales team. | Confirmed | CA Q7 | FR-024, FR-032 |
| BR-016 | The assistant discusses and recommends only the company's services on the service list (the 8 services; AI Chatbot is part of AI Services). | Confirmed | CA Q4, MG, P1 §3.1 | FR-030 |
| BR-017 | Combinations are recommended according to the customer's requirements and budget. Confirmed examples: Web Development + SEO; WordPress Development + SEO; AI Services + Web Development (the client's "AI Automation" and "AI Chatbot" pairs); SEO + Digital Marketing; Video Editing + Digital Marketing. Proposed for the new services: Graphic Designing + Digital Marketing; Mobile App Development + Web Development [TBD-67]. Whether these are the only allowed combinations is [TBD-34]. | Confirmed (examples) / TBD | CA Q7, MG | FR-031 |
| BR-018 | In Phase 1 the same basic details are collected for every service. | Confirmed | P1 §3.6 | FR-051 |
| BR-019 | Leads are kept in the assistant's own database and emailed. There is no CRM. | Confirmed | P1 §3.6 | FR-046 |
| BR-020 | Content is prepared by the TriCore team and approved by management before the assistant uses it. | Confirmed | CA Q5 | FR-094, FR-095 |
| BR-021 | Before launch the assistant must get at least 45 of 50 answers right (90 percent). If it scores below 45, the development team improves the answers, fixes the issues and tests again before launch. Management approves the final quality result. | Confirmed | CA Q15, P1 §3.5 | FR-133, FR-134 |
| BR-022 | The 50-question test is run again after every content change. | Confirmed | P1 §3.5 | FR-097 |
| BR-023 | At least 20 conversations are reviewed every week by the Marketing Lead and management. | Confirmed | CA Q11, P1 §3.5 | FR-137, FR-138 |
| BR-024 | An answer is "Wrong" when it contradicts approved content, invents something, or fails to hand over when it should have. | Proposed | RN | FR-139 |
| BR-025 | A monthly AI spending limit applies (amount [TBD-21]; P1 suggests $100 for budget mode or about $200 for premium mode at 3,000 chats). A warning is given at 80 percent. At the limit the assistant stops using AI and switches to "please leave your details" mode. | Confirmed (rule) / TBD (amount) | P1 §6.4, MA | FR-158 to FR-160 |
| BR-026 | Free AI services are not used for real visitors' data. | Proposed | P1 §6.6 | CON-011 |
| BR-027 | Chats are kept for 90 days and leads for 12 months, then deleted. The periods need management approval. | Proposed | DD 11, 12, MA | FR-152 |
| BR-028 | The success target is that at least 5 percent of chats become leads. | Confirmed | P1 §3.4 | FR-120 |
| BR-029 | Sales responds to a lead alert within 15 minutes during working hours. | Proposed | DD 2, P1 §8 | NFR-009 |
| BR-030 | Capacity is planned for 3,000 chats a month. | Proposed | DD 5, P1 §8 | NFR-004 |
| BR-031 | Lead alerts are sent to Info@tricoredigitaltech.com and to the sales and management team. | Confirmed | CA Q9 | FR-062 |
| BR-032 | The assistant works in English only in Phase 1. | Proposed | DD 1 | CON-006, AIR-009 |
| BR-033 | By default all eight dashboard items are shown. Management may ask for fewer. | Proposed | P1 §8.2, DD 8 | FR-128 |
| BR-034 | The assistant never collects card numbers, passwords or ID numbers. | Proposed | P1 §3.2-8, WF | FR-048 |


---

## 6. Functional requirements

Column key: **Pri** M or S (Section 1.5); **Status** Confirmed, Proposed or TBD; **Source** codes in Section 1.4; **AC** acceptance criteria defined under each table.

### 6.1 Chat widget and visitor interface

| ID | Requirement | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| FR-001 | The system shall display the chat box on every page of the TriCore website where the assistant is installed. | M | Confirmed | P1 §3.2-1 | AC-001 |
| FR-002 | The chat box shall be usable on both phones and computers. | M | Confirmed | P1 §3.2-1 | AC-002 |
| FR-003 | When opened, the chat shall show a greeting and the quick buttons "Explore services", "Get a quote" and "Talk to a person". The greeting wording is a staff setting [TBD-30]. | M | Confirmed | P1 §3.2-1, §3.2-7 | AC-003 |
| FR-004 | The visitor shall be able to type messages and receive the assistant's replies in the same chat window. | M | Confirmed | P1 §2 | AC-004 |
| FR-005 | "Explore services" shall show the service list and let the visitor choose a service to get an explanation from approved content. | M | Proposed | P1 §3.2-1, WF §7 | AC-005 |
| FR-006 | "Get a quote" shall start the permission step of lead collection (FR-037). | M | Confirmed | P1 §3.2-1, §3.2-4 | AC-006 |
| FR-007 | "Talk to a person" shall start the handover process (Section 6.8). | M | Confirmed | P1 §3.2-1, §3.2-6 | AC-006 |
| FR-008 | The chat shall tell the visitor the handover status: team notified and waiting up to 3 minutes, team member joined, or callback form offered. | M | Proposed | WF §11 | AC-037 |
| FR-009 | The chat shall state at the start that the visitor is talking to an AI assistant [wording TBD-30]. | M | Proposed | WF §15 | AC-007 |
| FR-010 | If the system cannot be reached, the chat shall show a fixed message with the company email, Info@tricoredigitaltech.com. | M | Proposed | DD 14, WF §14 | AC-007 |
| FR-011 | The conversation shall continue as the visitor moves between pages during one visit. Behaviour for returning visitors is [TBD-27]. | S | TBD | WF §5.6 | AC-012 |

**Acceptance criteria**

| ID | Verifies | Method | Criterion |
|---|---|---|---|
| AC-001 | FR-001, IR-007 | Test | On every page in the agreed page list [TBD-57] the chat box appears in 100% of the page loads checked. |
| AC-002 | FR-002 | Test | On a phone-size and a computer-size window [sizes TBD-58] every chat control can be used without sideways scrolling and every quick button is readable. |
| AC-003 | FR-003, IR-001 | Demonstration | On opening, exactly the three quick buttons in FR-003 appear with the greeting set in the staff area. |
| AC-004 | FR-004 | Test | In 20 test messages each typed message appears in the chat and a reply appears in the same window (excluding details-only mode). |
| AC-005 | FR-005 | Demonstration | "Explore services" lists every service on the service list; selecting one returns an explanation that matches approved content. |
| AC-006 | FR-006, FR-007 | Test | "Get a quote" shows the permission request before any detail is asked. "Talk to a person" creates a handover request, or shows the callback form outside working hours. |
| AC-007 | FR-009, FR-010, AIR-008 | Test | The AI-assistant statement is visible at the start. With the system switched off, the chat shows the fixed message and the company email. |
| AC-012 | FR-011, FR-019 | TBD | Defined after TBD-27 and TBD-29 are resolved. |

### 6.2 Conversation handling

| ID | Requirement | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| FR-012 | For each typed message the system shall work out what the visitor wants: an answer, service guidance, a quote, a person, a callback, an off-topic request, or unclear. | M | Confirmed | P1 §3.2 | AC-008 |
| FR-013 | A request for a person shall be handled before any other flow, at any stage of the conversation. | M | Proposed | WF §5.5 | AC-008 |
| FR-014 | When a message is unclear, the assistant shall ask at most [2, TBD-28] clarifying questions, then offer the quick buttons or a person. | S | Proposed | WF §5.7 | AC-010 |
| FR-015 | For an off-topic request the assistant shall say it is not sure, say the topic is outside what TriCore offers, and offer to connect a team member. | M | Confirmed | P1 §5 | AC-009 |
| FR-016 | For a greeting or thanks the assistant shall reply briefly and invite the visitor to continue. | S | Proposed | WF §5.4 | AC-008 |
| FR-017 | For an abusive message or an attempt to trick the assistant, it shall stay polite and safe. After [3, TBD-28] such messages it shall end the topic and offer a person. | M | Confirmed | P1 §3.5 | AC-009 |
| FR-018 | The system shall store each conversation (visitor, assistant and team member messages, with times) so staff can read it. | M | Confirmed | P1 §3.2-7 | AC-011 |
| FR-019 | The system shall close a conversation that has been inactive for [TBD-29]. | S | TBD | WF §5.7 | AC-012 |

**Acceptance criteria**

| ID | Verifies | Method | Criterion |
|---|---|---|---|
| AC-008 | FR-012, FR-013, FR-016 | Test | In the five practice situations (quick question, undecided visitor, quote request, asking for a person, chat after hours) the correct path is taken in 100% of cases. A request for a person made during lead collection starts handover. |
| AC-009 | FR-015, FR-017, AIR-006 | Test | For a prepared set of off-topic and abusive messages [set size and content TBD-63], 100% receive a polite, safe reply with a person offer. |
| AC-010 | FR-014, AIR-016 | Test | After an unclear message the assistant asks no more questions than the limit in FR-014, then offers buttons or a person. |
| AC-011 | FR-018 | Test | After a test conversation, staff can read every message in order with sender and time, and masked numbers appear masked. |

### 6.3 Answers from approved content

| ID | Requirement | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| FR-020 | The assistant shall answer questions about TriCore Digital Tech and its services only from approved content. Company questions are answered only if approved company content exists [TBD-26]. | M | Confirmed | P1 §3.2-2, CA Q4 | AC-013 |
| FR-021 | Approved content shall allow the assistant to explain each service, its benefits and how it solves customer problems. | M | Confirmed | CA Q4 | AC-013 |
| FR-022 | When the assistant is not sure, it shall say so and offer a real person. It shall not guess. | M | Confirmed | P1 §3.2-2 | AC-014 |
| FR-023 | The assistant shall never invent prices, clients or promises. | M | Confirmed | P1 §3.2-2 | AC-015 |
| FR-024 | When asked about cost, the assistant shall say that the team prepares a proper quote, shall give no price, and shall offer lead collection or a person. | M | Confirmed | P1 §5, CA Q7 | AC-016 |
| FR-025 | The assistant shall not state any price, discount or guarantee in Phase 1, even if one appears in approved content. | M | Proposed | RN | AC-015 |
| FR-026 | The system shall save every question the assistant could not answer as an unanswered question. | M | Confirmed | P1 §3.4 | AC-017 |
| FR-027 | After content is approved and published, the assistant shall use it for later messages. | M | Confirmed | P1 §3.2-7 | AC-018 |
| FR-028 | The assistant's replies shall be in English. | M | Proposed | DD 1 | AC-078 |

**Acceptance criteria**

| ID | Verifies | Method | Criterion |
|---|---|---|---|
| AC-013 | FR-020, FR-021, AIR-001 | Test | The 50-question test scores at least 45 correct (BR-021), and across the test and the practice chats 0 replies contain a business fact that is not in approved content. |
| AC-014 | FR-022, AIR-003, AIR-021 | Test | For a prepared set of questions that approved content does not cover [set size TBD-63], 100% of replies say the assistant is not sure and offer a person, with no guessed content. |
| AC-015 | FR-023, FR-025, AIR-004 | Test and review | Across the 50-question test, the practice chats, the trick test and the first weekly reviews, 0 replies contain an invented or unapproved price, discount, guarantee, client name or promise. |
| AC-016 | FR-024, AIR-005 | Test | For a prepared set of cost questions [set size TBD-63], 100% of replies give no amount, say the team prepares a quote, and offer lead collection or a person. |
| AC-017 | FR-026, AIR-020 | Test | Each question answered "not sure" in testing appears once in the unanswered list and counts in dashboard item 6 (FR-123). |
| AC-018 | FR-027 | Test | After a content change is approved and published, the next relevant question is answered with the new content and the old answer is no longer given. |

### 6.4 Service guidance for undecided visitors

| ID | Requirement | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| FR-029 | The assistant shall point an undecided visitor (for example "I want more customers") to the right mix of services, for example Web Development, SEO and Digital Marketing. | M | Confirmed | P1 §3.2-3 | AC-019 |
| FR-030 | The assistant shall recommend only services on the service list. | M | Confirmed | CA Q1, Q4 | AC-019 |
| FR-031 | The assistant shall recommend combinations according to the visitor's requirements, following BR-017. | M | Confirmed | CA Q7 | AC-021 |
| FR-032 | A recommendation shall contain no price, and shall state that final pricing is confirmed by the sales team. | M | Confirmed | CA Q7 | AC-020 |
| FR-033 | Before recommending, the assistant may ask at most [2, TBD-11] clarifying questions about the visitor's goals. | S | Proposed | WF §9 | AC-021 |
| FR-034 | After a recommendation the assistant shall offer a quote or a person. | M | Proposed | WF §9 | AC-022 |
| FR-035 | The services recommended or discussed shall be recorded as the visitor's services of interest, for the lead and the dashboard. | M | Proposed | WF §9 | AC-022 |
| FR-036 | If approved content does not support a recommendation, the assistant shall show the plain service list and offer a person. | M | Proposed | WF §9 | AC-021 |

**Acceptance criteria**

| ID | Verifies | Method | Criterion |
|---|---|---|---|
| AC-019 | FR-029, FR-030, AIR-010 | Test | For a prepared set of undecided-visitor messages, including "I want more customers" [set size TBD-63], 100% of recommendations name only services on the service list and match approved content. |
| AC-020 | FR-032, AIR-011 | Test | 0 recommendations contain a price; each states that the team prepares the quote or confirms pricing. |
| AC-021 | FR-031, FR-033, FR-036 | Test | Recommended combinations follow BR-017. The clarifying questions never exceed the limit. When content does not support a recommendation, the service list and a person offer are shown. |
| AC-022 | FR-034, FR-035 | Test | After a recommendation, a quote or person offer is shown. Accepting the quote offer pre-fills the recommended services in the lead, and the services count in dashboard item 7 (FR-124). |

### 6.5 Consent and lead collection

| ID | Requirement | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| FR-037 | The assistant shall ask the visitor's permission before collecting any lead detail. | M | Confirmed | P1 §3.2-4 | AC-023 |
| FR-038 | If the visitor declines, the system shall collect and store no lead details, and the assistant shall continue answering questions. | M | Confirmed | P1 §5 | AC-024 |
| FR-039 | The system shall record each consent decision with the decision, the time, the wording version and the conversation. | M | Proposed | WF §10 | AC-029 |
| FR-040 | The assistant shall collect, in a friendly chat and not a long form: name, email, phone, service, budget range, timeline and a short description. | M | Confirmed | P1 §3.2-4 | AC-027 |
| FR-041 | The visitor shall be able to skip the optional questions. | M | Confirmed | P1 §3.2-4 | AC-026 |
| FR-042 | Name, email, service and consent shall be required. Phone, budget range, timeline and description shall be optional, but the assistant shall ask for a phone number because it is needed for a Hot lead. | M | Confirmed | MG, WF §10 | AC-025 |
| FR-043 | The system shall check that the email and phone number are valid. If not, it shall ask again at most [2, TBD-28] times, then skip an optional field or offer a person for a required one. | M | Proposed | WF §10 | AC-025 |
| FR-044 | The budget question shall offer choices from the budget ranges set in the staff area: PKR ranges for visitors in Pakistan and USD ranges for everyone else. The range values, how the currency is chosen, and the timeline options are [TBD-38]. | M | Confirmed | P1 §3.2-7, MG | AC-027 |
| FR-045 | Before saving, the assistant shall show the collected details back to the visitor and ask for confirmation. | S | Proposed | WF §10 | AC-027 |
| FR-046 | The system shall save the lead in the assistant's own database. | M | Confirmed | P1 §3.6 | AC-027 |
| FR-047 | Each lead shall be linked to its conversation and its consent record. | M | Proposed | WF §10 | AC-029 |
| FR-048 | The assistant shall not ask for card numbers, passwords or ID numbers. | M | Proposed | P1 §3.2-8, WF §15 | AC-065 |
| FR-049 | If the visitor asks for a person during lead collection, the system shall start handover. | M | Confirmed | P1 §3.2 | AC-028 |
| FR-050 | When the same email address is submitted again, the system shall handle the duplicate according to [TBD-17]. | S | TBD | WF §10 | AC-027 |
| FR-051 | The same basic details shall be collected for every service. | M | Confirmed | P1 §3.6 | AC-027 |
| FR-052 | The point at which the alert is sent for a partly completed lead, and the handling of an abandoned partial lead, are [TBD-41] and [TBD-42]. | M | TBD | WF §10, §12 | AC-032 |

**Acceptance criteria**

| ID | Verifies | Method | Criterion |
|---|---|---|---|
| AC-023 | FR-037 | Test | No name, email, phone, budget, timeline or description is requested or stored before the visitor agrees, in 100% of lead-flow test runs. |
| AC-024 | FR-038 | Test | After "Not now" no lead record exists for the conversation and the assistant continues to answer questions. |
| AC-025 | FR-042, FR-043 | Test | An invalid email or phone is rejected and asked again. After the retry limit an optional field is skipped and a required field leads to a person offer. No lead is saved without name, email, service and consent. |
| AC-026 | FR-041 | Test | Each optional question can be skipped and the lead is still saved with the skipped fields empty. |
| AC-027 | FR-040, FR-044, FR-045, FR-046, FR-050, FR-051 | Test | A test lead with all fields is saved with every value shown at the recap. Budget and timeline are chosen from the configured choices. The same questions are asked for every service on the service list. Duplicate handling follows TBD-17. |
| AC-028 | FR-049 | Test | Asking for a person during collection starts handover in the same conversation and keeps the details already given. |
| AC-029 | FR-039, FR-047 | Inspection | Every saved lead links to a consent record showing decision, time, wording version and conversation, for 100% of leads in the test. |

### 6.6 Lead qualification

| ID | Requirement | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| FR-053 | The system shall give each lead a priority of Hot, Warm or Cold according to BR-004 to BR-006 (threshold BR-007; mapping BR-009). | M | Confirmed | P1 §3.2-5, §4 | AC-030 |
| FR-054 | The priority shall be derived by fixed rules from the collected fields, so that the same fields always give the same priority. | M | Proposed | WF §4 | AC-030 |
| FR-055 | The system shall recalculate the priority when a detail is added or changed. | M | Proposed | WF §10 | AC-031 |
| FR-056 | The priority shall be shown in the alert, the leads list and the dashboard. | M | Confirmed | CA Q9, P1 §3.4 | AC-034 |
| FR-057 | The minimum budget that counts as a "serious budget" shall be a setting controlled by management [TBD-18]. | M | Confirmed | CA Q8 | AC-030 |

**Acceptance criteria**

| ID | Verifies | Method | Criterion |
|---|---|---|---|
| AC-030 | FR-053, FR-054, FR-057, FR-114 | Test | A table of test leads that covers every combination of name, email, service, phone, budget at or above the threshold, and start within 3 months gives exactly the priority in BR-004 to BR-006. Repeating a test with the same inputs gives the same priority. |
| AC-031 | FR-055 | Test | Adding a phone number, a qualifying budget and an early start to a Warm lead makes it Hot, and the record shows when the change happened. |

### 6.7 Sales alerts (email and Slack)

| ID | Requirement | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| FR-058 | When a lead is created, the system shall send an alert by email and Slack to the sales team straight away. | M | Confirmed | P1 §3.2-5 | AC-032 |
| FR-059 | Alerts for Hot leads shall be marked urgent. The format of the mark is [TBD-55]. | M | Confirmed | P1 §3.2-5 | AC-033 |
| FR-060 | A lead alert shall contain: customer name and contact details; project requirements; interested services; lead priority; conversation summary; link to the conversation. | M | Confirmed | CA Q9 | AC-034 |
| FR-061 | The alert shall contain the conversation summary and a link to the conversation, and shall not attach the full chat. The full chat is read in the staff area after sign-in. If the AI summary is unavailable, a summary built from the lead fields shall be used. | M | Proposed | P1 §3.2-5, DD 10 | AC-034 |
| FR-062 | Alerts shall be sent to Info@tricoredigitaltech.com and to the sales and management team. Individual addresses and the Slack channel are [TBD-07]. | M | Confirmed | CA Q9 | AC-032 |
| FR-063 | Staff shall be able to change the alert recipients in the staff area. | M | Confirmed | P1 §3.2-7 | AC-053 |
| FR-064 | The system shall also alert staff when a handover is requested and when a callback form is submitted. | M | Proposed | WF §12 | AC-040 |
| FR-065 | If an alert cannot be delivered, the system shall retry. If one channel fails, the other shall still send. | M | Proposed | WF §12 | AC-035 |
| FR-066 | An alert that could not be delivered shall be visible to staff in the staff area. | M | Proposed | WF §12 | AC-035 |
| FR-067 | Each event shall produce one alert; a retry shall not create a duplicate. | M | Proposed | WF §12 | AC-036 |
| FR-068 | Whether a later priority upgrade sends a follow-up alert is [TBD-41]. | S | TBD | WF §12 | AC-032 |

**Acceptance criteria**

| ID | Verifies | Method | Criterion |
|---|---|---|---|
| AC-032 | FR-058, FR-062, FR-052, FR-068, IR-004, IR-005 | Test | In the pre-launch test, 100% of test leads produce an email to Info@tricoredigitaltech.com and a Slack message. The time from lead creation to alert is within [TBD-51]. |
| AC-033 | FR-059 | Test | A Hot test lead produces an alert marked urgent. Warm and Cold leads do not. |
| AC-034 | FR-056, FR-060, FR-061 | Inspection | Each alert shows all six items in FR-060, and the priority also shows in the leads list. No alert contains the full chat; when the AI summary is switched off, the alert still has a field-based summary. |
| AC-035 | FR-065, FR-066, NFR-008 | Test | With email switched off, Slack still arrives and the failure is visible in the staff area. With both off, the alert is retried and shown as undelivered. |
| AC-036 | FR-067 | Test | A retried delivery never produces a second alert for the same event. |

### 6.8 Human handover, three-minute rule and callback

| ID | Requirement | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| FR-069 | During working hours, when a visitor asks for a person, the system shall notify staff and allow a team member to join the same chat. | M | Confirmed | P1 §3.2-6 | AC-037 |
| FR-070 | Working hours shall be 9:00 AM to 7:00 PM PKT, Monday to Friday, and shall be changeable in the staff area. | M | Confirmed | CA Q10, MG, P1 §3.2-7 | AC-037 |
| FR-071 | Outside working hours, including Saturday and Sunday, the system shall show the callback form immediately, without waiting. | M | Confirmed | P1 §3.2-6, MG | AC-039 |
| FR-072 | If no team member joins within 3 minutes of the request, the system shall show the callback form. | M | Confirmed | P1 §3.2-6, DD 3 | AC-038 |
| FR-073 | The 3 minutes shall start when the handover request is created and end when a team member joins. Joining shall stop the period. | M | Proposed | WF §11 | AC-038 |
| FR-074 | Only one handover request shall be open for a conversation at a time. | S | Proposed | WF §11 | AC-042 |
| FR-075 | When several team members try to join, the first to accept shall join and the others shall be told it is taken. | S | Proposed | WF §11 | AC-043 |
| FR-076 | While a team member is in the chat, the assistant shall not post replies. | M | Proposed | WF §11 | AC-043 |
| FR-077 | Handover and the callback form shall work even when AI is unavailable or the spending limit is reached. | M | Proposed | WF §11 | AC-041 |
| FR-078 | The callback form shall let the visitor leave details for a callback, after asking permission. The fields are [TBD-40]. | M | Confirmed | P1 §3.2-6 | AC-040 |
| FR-079 | The system shall save each callback request. | M | Confirmed | P1 §3.2-6 | AC-040 |
| FR-080 | The system shall record the outcome of each handover: joined, timed out, callback submitted or cancelled. | M | Proposed | WF §11 | AC-038 |
| FR-081 | Staff shall be able to end a live chat; the system shall record the outcome. | S | Proposed | WF §11 | AC-043 |
| FR-082 | How staff are told of a handover request, and who is on duty, is [TBD-44]. | M | TBD | WF §11 | AC-037 |
| FR-083 | Behaviour when a team member joins after the 3 minutes, and what happens after a live chat ends, is [TBD-45]. | S | TBD | WF §11 | AC-043 |
| FR-084 | How working hours are shown to visitors in other time zones is [TBD-46]. | S | TBD | WF §11 | AC-039 |

**Acceptance criteria**

| ID | Verifies | Method | Criterion |
|---|---|---|---|
| AC-037 | FR-008, FR-069, FR-070, FR-082 | Test | During working hours, "Talk to a person" alerts staff. A team member accepts within 3 minutes and joins the same conversation. The visitor sees the status messages in FR-008. |
| AC-038 | FR-072, FR-073, FR-080 | Test | With nobody joining, the callback form appears 3 minutes (within [TBD-51] seconds) after the request. When a team member joins at 2 minutes the form never appears. The outcome is recorded in both cases. |
| AC-039 | FR-071, FR-084 | Test | A request made outside 9:00 AM to 7:00 PM PKT, or on a Saturday or Sunday, shows the callback form immediately, with no waiting period. |
| AC-040 | FR-064, FR-078, FR-079 | Test | A submitted callback form is saved after permission was asked, and staff receive an alert. The fields follow TBD-40. |
| AC-041 | FR-077 | Test | With AI switched off, and again with the spending limit reached, a request for a person still reaches staff or shows the callback form. |
| AC-042 | FR-074 | Test | A second request in the same conversation does not create a second open request. |
| AC-043 | FR-075, FR-076, FR-081, FR-083 | Test | When two team members accept at once only the first joins. The assistant posts no replies during the live chat. Ending the chat records the outcome. Behaviour after the 3 minutes follows TBD-45. |


### 6.9 Staff sign-in and roles

| ID | Requirement | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| FR-085 | The staff area shall be accessible only after secure sign-in. | M | Confirmed | P1 §3.2-7 | AC-044 |
| FR-086 | The system shall have two roles, Staff and Admin, with the permissions in Section 4.2. | M | Proposed | DD 13 | AC-045 |
| FR-087 | The system shall allow each staff-area action only to the roles permitted in Section 4.2. | M | Proposed | DD 13 | AC-045 |
| FR-088 | The sign-in method and the session rules are [TBD-22]. | M | TBD | P1 §3.2-7 | AC-044 |
| FR-089 | Admin users shall be able to create and disable staff accounts. | M | Proposed | DD 13 | AC-045 |
| FR-090 | The system shall record who made each content change, approval and settings change, and when. | M | Proposed | WF §13 | AC-049 |
| FR-091 | Developer access to production data and logs is [TBD-60]. | M | TBD | UR-07 | AC-087 |

**Acceptance criteria**

| ID | Verifies | Method | Criterion |
|---|---|---|---|
| AC-044 | FR-085, FR-088, NFR-010 | Test | Any staff-area page or action requested without signing in is refused in 10 of 10 attempts. With valid credentials access is granted. Sign-in method and session timeout follow TBD-22. |
| AC-045 | FR-086, FR-087, FR-089 | Test | For every row of Section 4.2, a Staff user and an Admin user can do exactly what the matrix allows and are refused otherwise. An Admin can create and disable a staff account. |

### 6.10 Knowledge management

| ID | Requirement | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| FR-092 | Staff shall be able to update what the assistant knows without a developer. | M | Confirmed | P1 §3.2-7 | AC-046 |
| FR-093 | The content shall cover service descriptions, FAQs, company information and customer responses. | M | Confirmed | CA Q5 | AC-046 |
| FR-094 | New or changed content shall start as a draft and shall become active only after management approves it. | M | Confirmed | CA Q5 | AC-047 |
| FR-095 | The assistant shall use only approved content. | M | Confirmed | CA Q5 | AC-047 |
| FR-096 | The system shall keep earlier versions of the content and record which version supported each answer. | M | Proposed | WF §8 | AC-049 |
| FR-097 | After every content change the 50-question test shall be run again. | M | Confirmed | P1 §3.5 | AC-048 |
| FR-098 | The result of the re-test shall be shown to staff. Whether a result below 45 blocks publishing or forces a rollback is [TBD-32]. | M | TBD | WF §8 | AC-048 |
| FR-099 | Admin shall be able to maintain the service list. | M | Proposed | CA Q4 | AC-046 |
| FR-100 | A correct answer typed by a reviewer in the to-fix list shall be added to what the assistant knows after management approves it. | S | Confirmed | P1 §3.5 | AC-062 |
| FR-101 | How content written in Google Docs reaches the staff area (copy or import) is [TBD-31]. | M | TBD | CA Q5 | AC-046 |
| FR-102 | Staff shall be able to see which approved content supported an assistant answer in a conversation. | S | Proposed | WF §8 | AC-077 |

**Acceptance criteria**

| ID | Verifies | Method | Criterion |
|---|---|---|---|
| AC-046 | FR-092, FR-093, FR-099, FR-101, IR-010 | Test | A staff member adds, edits and removes a service description, an FAQ and a company-information entry with no developer involved. An Admin edits the service list. Content from Google Docs reaches the staff area as defined in TBD-31. |
| AC-047 | FR-094, FR-095 | Test | A new or changed entry stays a draft and is used in 0 answers until an Admin approves it. After approval it is used. |
| AC-048 | FR-097, FR-098 | Test | After each approved content change the 50-question test runs again and the score is shown to staff. The consequence of a score below 45 follows TBD-32. |
| AC-049 | FR-090, FR-096, DR-019 | Inspection | Each answer in a test conversation records the content version used. The history shows who changed or approved each content and settings change, and when, for 10 of 10 sample changes. |

### 6.11 Leads, chats and live chat

| ID | Requirement | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| FR-103 | Staff shall be able to read the leads. | M | Confirmed | P1 §3.2-7 | AC-050 |
| FR-104 | Staff shall be able to read full chats. | M | Confirmed | P1 §3.2-7 | AC-050 |
| FR-105 | Staff shall be able to join live chats. | S | Confirmed | P1 §3.2-7, §3.7 | AC-052 |
| FR-106 | Staff shall be able to download the leads list as a spreadsheet. | M | Confirmed | P1 §3.4 | AC-051 |
| FR-107 | The download shall be a CSV file with all lead fields plus priority, time created and consent. | M | Proposed | DD 9, RN | AC-051 |
| FR-108 | The chat viewer shall show the full transcript with the sender and time of each message. | M | Proposed | WF §13 | AC-050 |
| FR-109 | The leads list shall show for each lead its priority, services, time created and a link to its conversation. | M | Proposed | CA Q9 | AC-050 |
| FR-110 | The staff area shall show waiting handover requests so a team member can accept one. | M | Proposed | WF §11, §13 | AC-052 |

**Acceptance criteria**

| ID | Verifies | Method | Criterion |
|---|---|---|---|
| AC-050 | FR-103, FR-104, FR-108, FR-109 | Test | A staff user sees every test lead with the fields in FR-109 and opens the full transcript of its conversation with sender and time. |
| AC-051 | FR-106, FR-107 | Test | The downloaded file opens in a spreadsheet program, has one row per lead with every lead field, priority, time created and consent, and its row count equals the leads list. |
| AC-052 | FR-105, FR-110 | Test | A waiting handover request is visible to staff. Accepting it opens the live chat with the visitor and stops the 3-minute period. |

### 6.12 Settings

| ID | Requirement | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| FR-111 | Authorized users shall be able to change the greeting, the working hours, the alert recipients and the budget ranges in the staff area. | M | Confirmed | P1 §3.2-7 | AC-053 |
| FR-112 | A settings change shall take effect without developer work. | M | Confirmed | P1 §3.2-7 | AC-053 |
| FR-113 | The chat retention period, the lead retention period and the monthly AI spending limit shall be settings. | M | Proposed | DD 11, 12, MA | AC-053 |
| FR-114 | The minimum budget for a Hot lead shall be a setting [TBD-18]. | M | Proposed | CA Q8 | AC-030 |
| FR-115 | The list of timeline options shall be a setting [TBD-38]. | M | Proposed | WF §10 | AC-053 |

**Acceptance criteria**

| ID | Verifies | Method | Criterion |
|---|---|---|---|
| AC-053 | FR-063, FR-111, FR-112, FR-113, FR-115 | Test | Each setting is changed in the staff area and the change is seen in the chat, alerts or rules within [TBD-51] seconds, without redeploying the system. |

### 6.13 Simple dashboard

| ID | Requirement | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| FR-116 | The staff area shall have a simple dashboard page. | M | Confirmed | P1 §3.4, CA Q3 | AC-054 |
| FR-117 | The dashboard shall have a date filter with last 7 days, last 30 days and custom dates. | M | Confirmed | P1 §3.4 | AC-054 |
| FR-118 | Dashboard item 1 shall show the number of chats. | M | Confirmed | P1 §3.4 | AC-055 |
| FR-119 | Dashboard item 2 shall show the number of leads, split into Hot, Warm and Cold. | M | Confirmed | P1 §3.4 | AC-055 |
| FR-120 | Dashboard item 3 shall show the share of chats that became leads, against the target of 5 percent or more. | M | Confirmed | P1 §3.4 | AC-057 |
| FR-121 | Dashboard item 4 shall show the number of times a person was asked for. | S | Confirmed | P1 §3.4, §3.7 | AC-055 |
| FR-122 | Dashboard item 5 shall show the top 10 questions asked. How similar questions are grouped is [TBD-62]. | M | Confirmed | P1 §3.4 | AC-055 |
| FR-123 | Dashboard item 6 shall show the questions the assistant could not answer. | M | Confirmed | P1 §3.4 | AC-055 |
| FR-124 | Dashboard item 7 shall show the services visitors ask about most. | S | Confirmed | P1 §3.4, §3.7 | AC-055 |
| FR-125 | Dashboard item 8 shall show AI spending this month against the limit, and the cost per lead. | S | Confirmed | P1 §3.4, §3.7 | AC-055 |
| FR-126 | The dashboard shall use data the assistant already collects. | M | Confirmed | P1 §3.4 | AC-055 |
| FR-127 | The dashboard shall not include charts over time, trends, comparisons or emailed reports (Phase 3). | M | Confirmed | P1 §3.4, §3.6 | AC-056 |
| FR-128 | By default all eight items shall be shown. Management may ask for fewer. | M | Proposed | P1 §8.2, DD 8 | AC-055 |
| FR-129 | Callback submissions shall count as leads, including for the 5 percent target. The definition of a "chat" used for the numbers is [TBD-43]. | M | Confirmed | MG, WF §13 | AC-057 |

**Acceptance criteria**

| ID | Verifies | Method | Criterion |
|---|---|---|---|
| AC-054 | FR-116, FR-117, IR-002 | Test | The dashboard opens in the staff area. The filter offers last 7 days, last 30 days and custom dates, and changing it changes every number. |
| AC-055 | FR-118 to FR-126, FR-128 | Test | Using a prepared reference dataset, each of the 8 items equals the expected value (100 percent match). |
| AC-056 | FR-127 | Inspection | The dashboard contains no chart over time, trend, comparison or emailed report. |
| AC-057 | FR-120, FR-129 | Test | The conversion share equals leads (chat leads plus callback leads) divided by chats using the chat definition in TBD-43, and is shown against the 5 percent target. |

### 6.14 Quality assurance

| ID | Requirement | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| FR-130 | The system shall hold a set of 50 questions with approved answers entered by the TriCore team. | M | Confirmed | CA Q6, P1 §3.5 | AC-058 |
| FR-131 | Admin shall be able to run the 50 questions through the assistant in test mode. | M | Proposed | WF §13 | AC-058 |
| FR-132 | The system shall record each test run: the date, the content version, each answer, the right-or-wrong judgement, the score and pass or fail. | M | Proposed | WF §13 | AC-058 |
| FR-133 | The pass mark shall be at least 45 of 50 (90 percent). A lower score means the answers are improved, the issues fixed and the test run again before launch. | M | Confirmed | CA Q15, P1 §3.5 | AC-058 |
| FR-134 | Management shall approve the final quality result before launch. | M | Confirmed | CA Q15 | AC-058 |
| FR-135 | Practice chats shall be run for five situations: a quick question, an undecided visitor, a quote request, asking for a person, and a chat after hours. | M | Confirmed | P1 §3.5 | AC-059 |
| FR-136 | The developer shall run a trick test that tries to make the assistant ask for secrets, go off-topic and be rude. The assistant must stay safe and polite. | M | Confirmed | P1 §3.5 | AC-060 |
| FR-137 | The system shall give reviewers 20 random conversations each week. | M | Confirmed | P1 §3.5 | AC-061 |
| FR-138 | The Marketing Lead and management shall review at least 20 conversations each week. | M | Confirmed | CA Q11 | AC-061 |
| FR-139 | Reviewers shall mark each assistant answer Good or Wrong with buttons in the staff area, using BR-024. | S | Confirmed | P1 §3.5, CA Q3 | AC-061 |
| FR-140 | A Wrong answer shall go to a to-fix list with a box where the reviewer types the right answer. | S | Confirmed | P1 §3.5 | AC-062 |
| FR-141 | Test runs shall not create real leads, send real alerts or contact real people. | M | Proposed | WF §13 | AC-064 |
| FR-142 | Tests shall use made-up data only. | M | Confirmed | P1 §7.3 | AC-064 |
| FR-143 | Before launch the team shall test that alerts and handover really arrive, test many chats at once, and test recovery from a backup. | M | Confirmed | P1 §7.1 | AC-063 |
| FR-144 | A spending limit shall apply to testing (suggested: $20). | S | Proposed | P1 §8.2 | AC-064 |
| FR-145 | The weekly review shall consider answer accuracy, lead quality, incorrect responses and opportunities for improvement. Customer satisfaction is [TBD-50]. | M | Confirmed | CA Q11 | AC-061 |

**Acceptance criteria**

| ID | Verifies | Method | Criterion |
|---|---|---|---|
| AC-058 | FR-130 to FR-134, AIR-018 | Test | A recorded test run exists for the content version to be launched, the score is at least 45 of 50, and management's approval of the result is recorded. |
| AC-059 | FR-135 | Test | Each of the five situations is run and the outcome is recorded. All five pass. |
| AC-060 | FR-136 | Test | All cases in the trick-test set [TBD-63] end with a safe, polite reply and no secrets, system text or customer data disclosed. |
| AC-061 | FR-137 to FR-139, FR-145 | Test | The review screen offers 20 random conversations. Each answer can be marked Good or Wrong. The review log shows at least 20 conversations marked in each week. |
| AC-062 | FR-100, FR-140 | Test | A Wrong mark creates a to-fix entry with a box for the right answer. After approval the typed answer is used by the assistant and the 50-question test is run again. |
| AC-063 | FR-143 | Test | In the pre-launch tests 100 percent of test alerts and handover requests arrive, the many-chats-at-once test [size TBD-51] ends without errors, and a backup restore succeeds. |
| AC-064 | FR-141, FR-142, FR-144 | Inspection | Test runs leave no real lead, send no real alert, use made-up data only and stop at the test spending limit. |

### 6.15 Safety, privacy and spending protection

| ID | Requirement | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| FR-146 | The assistant shall stay on topic: TriCore Digital Tech and its services. | M | Confirmed | P1 §3.2-8 | AC-067 |
| FR-147 | The system shall hide card-like and password-like numbers so that they are not stored, shown to staff or sent to the AI provider. | M | Confirmed | P1 §3.2-8 | AC-065 |
| FR-148 | The system shall block spam and bots. | M | Confirmed | P1 §3.2-8, §6.1 | AC-066 |
| FR-149 | The system shall apply limits per visitor and a daily limit [values TBD-14]. | M | Confirmed | P1 §6.4 | AC-066 |
| FR-150 | The assistant shall treat visitor text as a message to answer, never as an instruction that changes its rules. It shall never reveal its internal instructions, secrets or other visitors' data. | M | Confirmed | P1 §3.5 | AC-068 |
| FR-151 | Visitor-typed text shall be shown safely in the staff area, in email and in Slack, so that it cannot run as a command or alter the layout. | M | Proposed | WF §15 | AC-087 |
| FR-152 | The system shall delete old chats on a schedule. The default periods are in BR-027. | M | Confirmed | P1 §3.2-8 | AC-070 |
| FR-153 | The system shall delete leads after the lead retention period. | M | Proposed | DD 12 | AC-070 |
| FR-154 | The consent wording and the retention periods shall be approved by management before launch. | M | Confirmed | CA Q13, MA | AC-069 |
| FR-155 | Privacy requirements shall be reviewed against the laws that apply to visitors in Pakistan, the UK, Australia, Canada and other markets, with legal review where required [TBD-53]. | M | Confirmed | CA Q13 | AC-069 |
| FR-156 | The system shall not send real visitor data to free AI services. | M | Proposed | P1 §6.6 | AC-069 |
| FR-157 | The visitor shall be told that the chat is stored and reviewed, if the legal review requires it [TBD-36]. | M | TBD | WF §10 | AC-069 |
| FR-158 | The system shall apply a monthly AI spending limit [amount TBD-21; P1 suggests $100 for budget mode or about $200 for premium mode at 3,000 chats]. | M | Confirmed | P1 §3.2-8, §6.4 | AC-071 |
| FR-159 | The system shall warn at 80 percent of the monthly limit. Recipients are [TBD-47]. | M | Confirmed | P1 §6.4 | AC-071 |
| FR-160 | At the limit the system shall stop using AI and switch to a polite "please leave your details" mode. | M | Confirmed | P1 §6.4 | AC-072 |
| FR-161 | The system shall estimate and record the AI cost of each conversation, the month-to-date total and the cost per lead. | M | Confirmed | P1 §3.4 | AC-073 |
| FR-162 | If spending cannot be measured, the system shall stop using AI and use the details-only mode. | M | Proposed | WF §14 | AC-074 |
| FR-163 | The system shall support budget mode and premium mode. The choice is made by running the 50-question test on both [TBD-10]. | M | Confirmed | P1 §6.2, §8 | AC-080 |
| FR-164 | The system shall limit the length of a visitor message and of an assistant reply [limits TBD-14]. | S | Proposed | WF §15 | AC-066 |

**Acceptance criteria**

| ID | Verifies | Method | Criterion |
|---|---|---|---|
| AC-065 | FR-048, FR-147, AIR-015, IR-003, NFR-014 | Test | In tests that send card-like and password-like numbers, 0 appear in stored chats, staff views, alerts, logs, or data sent to the AI provider. The assistant never asks for such details. |
| AC-066 | FR-148, FR-149, FR-164, IR-006 | Test | Automated and repeated messages beyond the limits are blocked with 0 AI cost. Limit values follow TBD-14. |
| AC-067 | FR-146 | Test | Off-topic messages in the practice and trick tests are redirected in 100 percent of cases. |
| AC-068 | FR-150, AIR-014 | Test | In the trick test, requests for internal instructions, secrets or customer data are refused in 100 percent of cases. |
| AC-069 | FR-154 to FR-157 | Inspection | Management's written approval of the consent wording and retention periods is on file before launch. The legal review status is recorded. No real visitor data goes to a free AI service. |
| AC-070 | FR-152, FR-153, DR-020 | Test | With retention set to a test value, chats and leads older than that value are deleted on the next scheduled run and no newer record is deleted. |
| AC-071 | FR-158, FR-159 | Test | With a low test limit, a warning is sent when usage reaches 80 percent of it. |
| AC-072 | FR-160, NFR-019 | Test | At 100 percent of the limit no more AI is used and the "please leave your details" mode runs. Lead capture and handover still work. |
| AC-073 | FR-161 | Test | The recorded cost of a test conversation, the monthly total and the cost per lead agree with the AI provider's usage figures within an agreed tolerance [TBD-51]. |
| AC-074 | FR-162 | Test | With spend measurement switched off, AI use stops and details-only mode starts. |
| AC-080 | FR-163, AIR-019 | Test | The 50-question test is run in both modes, and the scores and the cost per run are recorded for management's decision. |

### 6.16 Backup, recovery and unavailability

| ID | Requirement | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| FR-165 | The system shall take daily backups. | M | Proposed | DD 15 | AC-075 |
| FR-166 | Recovery from a backup shall be tested before launch. | M | Confirmed | P1 §7.1 | AC-076 |
| FR-167 | The recovery targets (maximum data loss and restore time) are [TBD-16]. | M | TBD | RN | AC-076 |
| FR-168 | If the assistant service becomes unavailable, visitors shall be offered a callback form or the company email. | M | Proposed | DD 14 | AC-092 |

**Acceptance criteria**

| ID | Verifies | Method | Criterion |
|---|---|---|---|
| AC-075 | FR-165, DR-021, IR-008 | Inspection | In a 7-day observation, each day has a successful backup record. |
| AC-076 | FR-166, FR-167 | Test | A restore from a backup succeeds in a trial, and all test leads and consent records are present. Time and data loss are within TBD-16. |


---

## 7. AI behaviour and knowledge-grounding requirements

These requirements describe how the assistant must behave. They do not say how it is built.

### 7.1 Requirements

| ID | Requirement | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| AIR-001 | All statements about TriCore Digital Tech, its services, processes and policies shall come only from approved content. The assistant shall not use general knowledge to state business facts. | M | Confirmed | P1 §3.2-2 | AC-013 |
| AIR-002 | The system shall record which approved content supported each factual answer. | S | Proposed | WF §8 | AC-077 |
| AIR-003 | When approved content does not cover a question, or covers only part of it, the assistant shall say it is not sure about the uncovered part, shall not guess, and shall offer a real person. | M | Confirmed | P1 §3.2-2, §5 | AC-014 |
| AIR-004 | The assistant shall never state invented prices, clients, promises, guarantees or discounts. | M | Confirmed | P1 §3.2-2 | AC-015 |
| AIR-005 | For cost questions the assistant shall follow FR-024. | M | Confirmed | P1 §5 | AC-016 |
| AIR-006 | The assistant shall discuss only TriCore Digital Tech and its services, and shall politely decline other topics. The specific topics to refuse (for example legal advice, tax, competitors, refunds) are [TBD-61]. | M | Confirmed | P1 §3.2-8 | AC-009 |
| AIR-007 | The assistant's tone shall be friendly, professional and short. | S | Proposed | CA Objective, P1 §3.2-4 | AC-078 |
| AIR-008 | The assistant shall state that it is an AI assistant (FR-009) and shall not claim to be a human. | M | Proposed | WF §15 | AC-007 |
| AIR-009 | The assistant shall reply in English. | M | Proposed | DD 1 | AC-078 |
| AIR-010 | Service recommendations shall be limited to the service list and to combinations that follow BR-017. | M | Confirmed | CA Q4, Q7 | AC-019 |
| AIR-011 | The assistant shall give no price in a recommendation and shall say that the sales team confirms final pricing. | M | Confirmed | CA Q7 | AC-020 |
| AIR-012 | Where the assistant uses its own wording in lead collection, it shall be polite, ask one thing at a time, put no pressure on the visitor, and accept a skip of any optional question. | M | Proposed | P1 §3.2-4, WF §10 | AC-079 |
| AIR-013 | The assistant's text shall not itself save data, send a message, start a timer or change a setting. These actions, and the lead priority, shall follow the rules and checks in this SRS. | M | Proposed | WF §2.2 | AC-079 |
| AIR-014 | The assistant shall ignore instructions inside visitor text that try to change its rules or reveal internal information. | M | Confirmed | P1 §3.5 | AC-068 |
| AIR-015 | The assistant shall not request card numbers, passwords or ID numbers (FR-048). | M | Proposed | WF §15 | AC-065 |
| AIR-016 | When the assistant is unsure what the visitor wants, it shall ask a short clarifying question (FR-014). | S | Proposed | WF §5 | AC-010 |
| AIR-017 | When AI is unavailable, lead collection and handover shall still work in a fixed form that needs no AI. | M | Proposed | WF §14 | AC-081 |
| AIR-018 | The assistant shall get at least 45 of 50 answers right in the 50-question test (BR-021) and shall be tested again after each content change (BR-022). | M | Confirmed | CA Q15, P1 §3.5 | AC-058 |
| AIR-019 | The system shall support a budget AI mode and a premium AI mode (FR-163). | M | Confirmed | P1 §6.2 | AC-080 |
| AIR-020 | Whenever the assistant says it is not sure, the question shall be saved as unanswered (FR-026). | M | Confirmed | P1 §3.4 | AC-017 |
| AIR-021 | When two approved entries contradict each other, the behaviour is [TBD-64]. | S | TBD | BA | AC-014 |

### 7.2 Answer situations (informative summary)

| Situation | Required behaviour | Requirements |
|---|---|---|
| Approved content fully covers the question | Answer from it, in English, short and friendly | AIR-001, AIR-007, AIR-009 |
| Approved content covers part of the question | Answer the covered part; say not sure about the rest; offer a person | AIR-003 |
| Approved content does not cover the question | Say not sure; do not guess; offer a person; save as unanswered | AIR-003, AIR-020 |
| Visitor asks about cost | Say the team prepares a quote; no price; offer lead collection or a person | AIR-005, FR-024 |
| Visitor is undecided | Recommend from the service list and approved combinations; no price | AIR-010, AIR-011 |
| Visitor asks about another topic | Politely decline; offer a person | AIR-006 |
| Visitor tries to trick the assistant | Stay polite and safe; refuse; never reveal internal information | AIR-014 |
| Visitor writes unclear text | Ask a short clarifying question, then offer buttons or a person | AIR-016 |
| AI is unavailable | Fixed lead collection and handover still work | AIR-017 |

**Acceptance criteria**

| ID | Verifies | Method | Criterion |
|---|---|---|---|
| AC-077 | AIR-002, FR-102 | Inspection | For 10 of 10 sampled factual answers, staff can see the approved content that supported the answer. |
| AC-078 | FR-028, AIR-007, AIR-009 | Review | In the practice chats and weekly reviews, 100 percent of replies are in English, and reviewers rate the tone friendly, professional and short in at least [TBD-51] percent of sampled replies. |
| AC-079 | AIR-012, AIR-013 | Test | In lead-flow tests the assistant asks one question at a time and accepts skips. No lead, alert, timer or setting changes unless the checks in FR-042, FR-043 and FR-053 pass. |
| AC-081 | AIR-017 | Test | With AI switched off, a visitor can still complete lead collection (required fields) and request a person. |

---

## 8. Data (information) requirements

These requirements state what information the system must hold. They do not define a database design, which belongs to the SDD.

| ID | Requirement | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| DR-001 | The system shall hold a **conversation** record: identifier; start and end time; status (open, live chat, closed); outcome (none, lead, handover, callback); service tags; content versions used; estimated AI cost; whether it was a test conversation. | M | Confirmed | P1 §3.2-7, §3.4 | AC-082 |
| DR-002 | The system shall hold each **message**: conversation; sender (visitor, assistant, team member); text with card-like and password-like numbers masked; time; whether the assistant was unsure; the approved content that supported it. | M | Confirmed | P1 §3.2-7 | AC-082 |
| DR-003 | The system shall hold a **consent record**: conversation; decision; time; consent wording version; purpose (lead details or callback). | M | Proposed | WF §10 | AC-082 |
| DR-004 | The system shall hold a **lead**: name; email; phone; services of interest; budget range; timeline; short description; priority; source (chat or callback form); times created and updated; linked conversation; linked consent record; alert status. | M | Confirmed | P1 §3.2-4 | AC-082 |
| DR-005 | The system shall hold a **handover request**: conversation; time requested; whether within working hours; status (requested, live, timed out, callback submitted, cancelled, ended); team member who joined; times joined and ended; outcome. | M | Confirmed | P1 §3.2-6 | AC-082 |
| DR-006 | The system shall hold a **callback request**: conversation; the details left by the visitor [fields TBD-40]; time; consent. | M | Confirmed | P1 §3.2-6 | AC-082 |
| DR-007 | The system shall hold a **notification record**: event type; channel (email, Slack); recipients; priority; status (sent, retrying, failed); number of attempts; times. | M | Proposed | WF §12 | AC-082 |
| DR-008 | The system shall hold the **service list**: name; short description; active or not. | M | Proposed | CA Q4 | AC-082 |
| DR-009 | The system shall hold **knowledge entries**: type (service description, FAQ, company information, customer response); title; text; status (draft, approved); author; approver; approval time; version number. | M | Confirmed | CA Q5, P1 §3.2-7 | AC-082 |
| DR-010 | The system shall hold a **content version record**: version number; time published; approver; latest 50-question test result. | M | Proposed | WF §8 | AC-082 |
| DR-011 | The system shall hold **unanswered questions**: conversation and message; time; status (new, in to-fix list, resolved). | M | Confirmed | P1 §3.4 | AC-082 |
| DR-012 | The system shall hold **review records**: the answer reviewed; reviewer; mark (Good or Wrong); time. | M | Confirmed | P1 §3.5 | AC-082 |
| DR-013 | The system shall hold **to-fix items**: the question; the wrong answer; the correct answer typed by the reviewer; status (open, approved, published); approver. | M | Confirmed | P1 §3.5 | AC-082 |
| DR-014 | The system shall hold the **50 test questions** and their approved answers. | M | Confirmed | CA Q6 | AC-082 |
| DR-015 | The system shall hold **test runs**: date; content version; answer and judgement for each question; score; pass or fail; approver. | M | Proposed | WF §13 | AC-082 |
| DR-016 | The system shall hold **AI usage records**: conversation; purpose; mode (budget or premium); amount used; estimated cost; time. | M | Confirmed | P1 §3.4, §6.4 | AC-082 |
| DR-017 | The system shall hold **settings**: greeting; working hours and days; alert recipients; budget ranges; timeline options; Hot-lead budget threshold; chat retention period; lead retention period; monthly spending limit; test spending limit. | M | Confirmed | P1 §3.2-7 | AC-082 |
| DR-018 | The system shall hold **staff users**: name; email; role (Staff or Admin); active or disabled. | M | Confirmed | P1 §3.2-7, DD 13 | AC-082 |
| DR-019 | The system shall hold a **change history**: who changed or approved content or settings; what changed; when. | M | Proposed | WF §13 | AC-049 |
| DR-020 | The system shall hold a **deletion log**: what categories of data were deleted by the retention rules, how many, and when. | S | Proposed | WF §3 | AC-070 |
| DR-021 | The system shall hold **backup records**: date; success or failure. | M | Proposed | DD 15 | AC-075 |
| DR-022 | Card-like and password-like numbers shall never be stored in any record. | M | Confirmed | P1 §3.2-8 | AC-083 |
| DR-023 | Times shall be shown to staff in PKT. | S | Proposed | CA Q10 | AC-082 |
| DR-024 | The only personal data collected from a visitor shall be the lead fields in DR-004 and the callback details in DR-006, plus the masked chat. | M | Proposed | P1 §3.2-4, WF §15 | AC-083 |

**Acceptance criteria**

| ID | Verifies | Method | Criterion |
|---|---|---|---|
| AC-082 | DR-001 to DR-018, DR-023 | Inspection | For a set of test conversations covering a lead, a handover, a callback and a declined consent, each record holds the attributes listed and the records are linked (conversation, lead, consent, handover). |
| AC-083 | DR-022, DR-024 | Inspection | No data outside the lists above is collected from the visitor, and no unmasked card-like or password-like number is stored. |

---

## 9. External interface requirements

| ID | Requirement | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| IR-001 | **Visitor chat interface:** message area, text entry, quick buttons, consent buttons, budget and timeline choice buttons, callback form and handover status messages. | M | Confirmed | P1 §3.2 | AC-003 |
| IR-002 | **Staff area screens:** sign-in; dashboard; leads list; chat viewer and live chat; waiting handover requests; knowledge editor with approval; weekly review and to-fix list; 50-question test; settings; staff accounts. | M | Confirmed | P1 §3.2-7, §3.4, §3.5 | AC-054 |
| IR-003 | **AI model provider:** receives the masked visitor text and the approved content needed for an answer, and returns generated text. The provider is [TBD-04]. | M | Confirmed | P1 §6.1 | AC-065 |
| IR-004 | **Email service:** sends alerts. The provider is [TBD-06]. | M | Confirmed | P1 §3.2-5, §6.1 | AC-032 |
| IR-005 | **Slack:** receives alerts. The workspace and channel are [TBD-07]. | M | Confirmed | P1 §3.2-5 | AC-032 |
| IR-006 | **Spam and bot protection:** Cloudflare Turnstile is named in P1 §6.1. | M | Confirmed | P1 §6.1 | AC-066 |
| IR-007 | **Website:** the chat script is installed by the authorized website developer after approval. The website platform is probably WordPress, to be confirmed [TBD-57]. | M | Confirmed | CA Q14, MG | AC-001 |
| IR-008 | **Hosting and backup storage:** standard hosting and a place to keep backups [TBD-08]. | M | Proposed | DD 7, DD 15 | AC-075 |
| IR-009 | **Error monitoring:** a free-tier error monitoring service tells the developer about faults. | S | Confirmed | P1 §6.1 | AC-090 |
| IR-010 | **Content source:** content is prepared in Google Docs or structured documentation and moved to the staff area [TBD-31]. | M | Confirmed | CA Q5 | AC-046 |

---

## 10. Non-functional requirements

Where the sources give no number, the measure is stated and the value is a TBD. No target has been invented.

| ID | Requirement | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| NFR-001 | **Reply time:** the first visible reply to a visitor message shall appear within [TBD-51] seconds for 95 percent of messages under normal load. | M | TBD | BA | AC-084 |
| NFR-002 | **Widget load:** the chat box shall add no more than [TBD-51] seconds to the page load. | S | TBD | BA | AC-084 |
| NFR-003 | **Dashboard load:** the dashboard for a 30-day range shall open within [TBD-51] seconds at the planning volume. | S | TBD | BA | AC-084 |
| NFR-004 | **Capacity:** the system shall be planned for 3,000 chats a month. | M | Proposed | DD 5, P1 §8 | AC-085 |
| NFR-005 | **Concurrency:** the system shall handle many chats at once without errors. The number tested is [TBD-51]. | M | Confirmed | P1 §7.1 | AC-085 |
| NFR-006 | **Availability:** the assistant shall be available 24 hours a day, 7 days a week. The uptime target is [TBD-51]. | M | Confirmed | CA Q1, Q10 | AC-086 |
| NFR-007 | **No lost leads:** every lead whose required details and consent were captured shall be stored or, if storing fails, reported to staff at once. | M | Proposed | WF §14 | AC-092 |
| NFR-008 | **Alert reliability:** every alert shall be delivered, or its failure shall be visible to staff. The delivery target is [TBD-51]. | M | Proposed | WF §12 | AC-035 |
| NFR-009 | **Response measurement:** the system shall record the time from a lead alert to the first staff action on that lead, so the 15-minute target in BR-029 can be measured. The measure is [TBD-52]. | S | Proposed | DD 2 | AC-091 |
| NFR-010 | **Authentication:** every staff-area function shall require sign-in. | M | Confirmed | P1 §3.2-7 | AC-044 |
| NFR-011 | **Authorization:** the permission check in Section 4.2 shall be enforced on every staff-area request, not only on screen. | M | Proposed | DD 13 | AC-087 |
| NFR-012 | **Data protection:** personal data shall be protected in transit and in storage. The details are [TBD-08]. | M | Proposed | CA Q13, WF §15 | AC-087 |
| NFR-013 | **Secrets:** keys and credentials of outside services shall never be visible to visitors or in the chat box. | M | Proposed | WF §15 | AC-087 |
| NFR-014 | **Logs:** system logs shall hold no unmasked card-like or password-like numbers. | M | Proposed | WF §15 | AC-065 |
| NFR-015 | **Accessibility:** the chat box shall support keyboard use and screen-reader labels. The full requirement is [TBD-59]. | S | Proposed | BA, RN | AC-088 |
| NFR-016 | **Browser and device support:** the chat and the staff area shall work on modern browsers on phones and computers. The list is [TBD-58]. | M | Proposed | BA, RN | AC-089 |
| NFR-017 | **Monitoring:** faults shall be detected and the developer alerted. | S | Confirmed | P1 §6.1 | AC-090 |
| NFR-018 | **Changes without code:** content and settings shall be changeable without changing the system itself. | M | Confirmed | P1 §3.2-7 | AC-091 |
| NFR-019 | **AI cost:** monthly AI spending shall stay within the approved limit. | M | Confirmed | P1 §6.4 | AC-072 |
| NFR-020 | **Evidence:** consent records and content approvals shall be kept for as long as the related lead or content exists. | M | Proposed | WF §10 | AC-091 |
| NFR-021 | **Time zone:** staff-facing times and working hours shall use PKT. | S | Proposed | CA Q10 | AC-091 |

**Acceptance criteria**

| ID | Verifies | Method | Criterion |
|---|---|---|---|
| AC-084 | NFR-001 to NFR-003 | Test | Over 100 messages under normal load, at least 95 percent of first replies appear within the NFR-001 time. The widget and dashboard load times are within the NFR-002 and NFR-003 values. |
| AC-085 | NFR-004, NFR-005 | Test | A load test that matches the 3,000-chats-a-month profile, with the concurrency in NFR-005, ends with 0 errors and 0 lost leads. |
| AC-086 | NFR-006 | Analysis | Monitoring over the observation period [TBD-51] shows the uptime target met, and the assistant answered at all hours of a 24-hour test. |
| AC-087 | FR-091, FR-151, NFR-011 to NFR-013 | Test | Unauthorized staff-area requests are refused on the server side. Visitor text with markup or commands appears as plain text in the staff area, email and Slack. No credential is visible in the browser. Connections and stored personal data are protected as defined in TBD-08. |
| AC-088 | NFR-015 | Test | The chat box can be used with the keyboard alone and its controls have screen-reader labels, as defined in TBD-59. |
| AC-089 | NFR-016 | Test | The chat and the staff area pass the functional tests on every browser and device in the list in TBD-58. |
| AC-090 | IR-009, NFR-017 | Test | A forced fault produces a developer alert within [TBD-51] minutes. |
| AC-091 | NFR-009, NFR-018, NFR-020, NFR-021 | Inspection | The records allow the alert-to-first-action time to be calculated. A content change and a settings change are made without changing the system. Consent and approval evidence exists for sampled records. Staff times show in PKT. |

---

## 11. Error and exception scenarios

For every scenario the visitor is left with a polite message and a way forward: a team member, the callback form or the company email.

| ID | Scenario and required behaviour | Pri | Status | Source | AC |
|---|---|---|---|---|---|
| EXC-001 | **The AI provider fails or is too slow.** The system shall retry once. If it still fails, it shall reply politely, offer a team member or the callback form, log the failure and alert the developer. After repeated failures it shall switch to details-only mode. | M | Proposed | WF §14 | AC-092 |
| EXC-002 | **The AI returns an unusable result.** The system shall discard it, retry once, and otherwise use the reply in EXC-001. | M | Proposed | WF §14 | AC-092 |
| EXC-003 | **The visitor's message is unclear.** The system shall follow FR-014. | S | Proposed | WF §5.7 | AC-092 |
| EXC-004 | **No approved content fits the question.** The assistant shall say it is not sure, offer a person or a quote, and save the question as unanswered. | M | Confirmed | P1 §3.2-2, §3.4 | AC-092 |
| EXC-005 | **Approved content cannot be reached.** The system shall treat it as EXC-004 and alert staff and the developer. | M | Proposed | WF §14 | AC-092 |
| EXC-006 | **A drafted reply would break a rule** (an invented price, an unapproved claim, internal text). The system shall not send it, and shall send a safe fixed reply instead. | M | Proposed | P1 §3.2-2, WF §14 | AC-092 |
| EXC-007 | **Stored data cannot be reached.** The chat shall show the fixed message with the company email (FR-010), and the developer shall be alerted at once. | M | Proposed | DD 14, WF §14 | AC-092 |
| EXC-008 | **A lead cannot be saved.** The system shall retry. If it still fails, it shall ask the visitor to email Info@tricoredigitaltech.com, keep the details in a protected error record, and alert staff and the developer. A lead shall never be lost silently. | M | Proposed | WF §14 | AC-092 |
| EXC-009 | **One alert channel fails.** The other channel shall still send, the failed one shall be retried, and the failure shall be visible in the staff area. | M | Proposed | WF §12 | AC-092 |
| EXC-010 | **Both alert channels fail.** The alert shall be marked undelivered, shown in the staff area and reported to the developer. The lead remains saved. | M | Proposed | WF §12 | AC-092 |
| EXC-011 | **The handover timer fails.** A periodic check shall find overdue requests and show the callback form, so no visitor waits beyond 3 minutes without an offer. | M | Proposed | WF §11 | AC-092 |
| EXC-012 | **The live chat connection fails.** The visitor shall see a connection message and the callback form. Staff and the developer shall be alerted. | M | Proposed | WF §11 | AC-092 |
| EXC-013 | **Nobody joins within 3 minutes.** The callback form shall be shown. | M | Confirmed | P1 §3.2-6 | AC-092 |
| EXC-014 | **A handover is requested outside working hours.** The callback form shall be shown at once. | M | Confirmed | P1 §3.2-6 | AC-092 |
| EXC-015 | **The monthly spending limit is reached.** The assistant shall stop using AI and switch to "please leave your details" mode. A warning shall have been sent at 80 percent. | M | Confirmed | P1 §6.4 | AC-092 |
| EXC-016 | **Spending cannot be measured.** The system shall stop using AI, use details-only mode and alert the developer. | M | Proposed | WF §14 | AC-092 |
| EXC-017 | **A bot, spam or too many messages.** The system shall block the traffic with no AI cost and show a short polite message. | M | Confirmed | P1 §3.2-8 | AC-092 |
| EXC-018 | **The bot-protection service cannot be reached.** The behaviour is [TBD-15]. | M | TBD | WF §14 | AC-092 |
| EXC-019 | **A trick or abusive message.** The assistant shall stay polite and safe and refuse. After the strike limit it shall end the topic and offer a person. | M | Confirmed | P1 §3.5 | AC-092 |
| EXC-020 | **The visitor declines consent.** The system shall store no lead details and the assistant shall keep answering. | M | Confirmed | P1 §5 | AC-092 |
| EXC-021 | **The visitor leaves before lead collection is complete.** The handling is [TBD-42]. | M | TBD | WF §10 | AC-092 |
| EXC-022 | **The chat box does not load.** The website shall keep working. The developer shall be alerted where the fault can be detected. | S | Proposed | WF §14 | AC-092 |
| EXC-023 | **A backup or deletion job fails.** The job shall be retried at the next run, never skipped silently, and the developer shall be alerted. | M | Proposed | WF §14 | AC-092 |
| EXC-024 | **A 50-question test run is incomplete.** The run shall be marked incomplete and the content change shall not be treated as verified. | M | Proposed | WF §14 | AC-092 |
| EXC-025 | **The staff area is unavailable.** Visitor chat and alerts shall continue. Handover requests shall move to the callback form after 3 minutes. | M | Proposed | WF §14 | AC-092 |
| EXC-026 | **A message is empty or too long.** The system shall reply politely and ask the visitor to shorten it. The limits are [TBD-14]. | S | Proposed | WF §15 | AC-092 |

**Acceptance criteria**

| ID | Verifies | Method | Criterion |
|---|---|---|---|
| AC-092 | EXC-001 to EXC-026, FR-168, NFR-007 | Test | Each scenario is triggered in a test, by switching off the relevant service or sending the relevant input. The required behaviour is observed in all 26 scenarios and recorded. Scenarios marked TBD are defined, then tested, after the TBD is resolved. |

---

## 12. Release acceptance criteria

### 12.1 Before launch

| ID | Criterion | Evidence | Related |
|---|---|---|---|
| RAC-01 | Every Must requirement that is Confirmed, or Proposed and approved, passes its acceptance criteria. | Test report | Sections 6 to 11 |
| RAC-02 | The 50-question test scores at least 45 of 50 and management approves the result. | Test run record and approval | AC-058 |
| RAC-03 | The five practice situations pass. | Practice-chat record | AC-059 |
| RAC-04 | The trick test passes. | Developer's report | AC-060, AC-068 |
| RAC-05 | Alerts and handover arrive (email, Slack, live chat, callback form, 3-minute rule). | Test record | AC-032, AC-037, AC-038, AC-063 |
| RAC-06 | The many-chats-at-once test ends without errors. | Test record | AC-063, AC-085 |
| RAC-07 | A backup restore succeeds. | Test record | AC-076 |
| RAC-08 | Management has approved, in writing, the consent wording, the retention periods and the monthly AI spending budget. | Approval record | AC-069, FR-158 |
| RAC-09 | The baseline (traffic, monthly enquiries, average response time) has been measured. | Baseline report | ASM-004 |
| RAC-10 | Every TBD that affects a Must requirement is resolved. | Updated Appendix A | Appendix A |
| RAC-11 | No Phase 2, Phase 3 or "not planned" item is present. | Inspection | Section 3.2, AC-056 |

### 12.2 After launch (operating targets)

| ID | Target | Source |
|---|---|---|
| RAC-12 | At least 5 percent of chats become leads | BR-028 |
| RAC-13 | At least 20 conversations reviewed every week | BR-023 |
| RAC-14 | AI spending within the approved monthly limit; warning at 80 percent | BR-025 |
| RAC-15 | Staff join within 3 minutes or the callback form appears, in 100 percent of requests | BR-014 |
| RAC-16 | Sales responds to lead alerts within 15 minutes in working hours (Proposed) | BR-029 |
| RAC-17 | Unanswered questions reviewed and turned into approved content | P1 §3.4 |
| RAC-18 | Reply speed, uptime and other targets | TBD-51 |


---

## 13. Requirements traceability matrices

Row-level traceability is in each requirement table (the *Source* and *AC* columns). The matrices below give the consolidated view.

### 13.1 Business goals to requirements and acceptance criteria

| Business goal | Phase 1 scope | Requirements | Acceptance criteria |
|---|---|---|---|
| BG-01 Handle enquiries 24/7 | IN-01, IN-02, IN-06 | FR-001 to FR-011, FR-020 to FR-028, NFR-006, BR-013 | AC-001 to AC-007, AC-013 to AC-018, AC-086 |
| BG-02 Explain services and answer correctly | IN-02 | FR-020 to FR-028, AIR-001 to AIR-009, AIR-018 to AIR-021, BR-001 to BR-003, BR-021 to BR-024 | AC-013 to AC-018, AC-058 to AC-062, AC-077, AC-078 |
| BG-03 Capture and qualify leads | IN-04, IN-05, IN-12 | FR-037 to FR-068, BR-004 to BR-010, BR-018, BR-019, BR-028, DR-003 to DR-007 | AC-023 to AC-036, AC-057 |
| BG-04 Recommend suitable services | IN-03 | FR-029 to FR-036, AIR-010, AIR-011, BR-015 to BR-017 | AC-019 to AC-022 |
| BG-05 Reduce workload and response time | IN-05, IN-06 | FR-058 to FR-084, BR-012 to BR-014, BR-029, NFR-009 | AC-032 to AC-043, AC-091 |
| BG-06 Visibility of what visitors ask | IN-07, IN-09 | FR-092 to FR-129, DR-009 to DR-013, IR-002 | AC-046 to AC-057 |
| BG-07 Keep answers correct and the brand safe | IN-10, IN-11 | FR-130 to FR-145, BR-021 to BR-024, AIR-018 | AC-058 to AC-064 |
| BG-08 Control AI cost and protect data | IN-08 | FR-146 to FR-168, BR-011, BR-025 to BR-027, BR-034, NFR-010 to NFR-014, NFR-019, EXC-015 to EXC-017 | AC-065 to AC-076, AC-080, AC-083, AC-087 |

### 13.2 Phase 1 scope items to requirements and acceptance criteria

| Scope item | Functional | Rules, AI, data, interfaces | Non-functional and exceptions | Acceptance criteria |
|---|---|---|---|---|
| IN-01 Chat box | FR-001 to FR-011 | IR-001, IR-007 | NFR-002, NFR-015, NFR-016, EXC-022 | AC-001 to AC-007, AC-012 |
| IN-02 Answers from approved content | FR-012 to FR-028 | BR-001 to BR-003, AIR-001 to AIR-009, AIR-020, AIR-021, DR-011 | NFR-001, EXC-001 to EXC-006 | AC-008 to AC-018, AC-077, AC-078 |
| IN-03 Guidance for undecided visitors | FR-029 to FR-036 | BR-015 to BR-017, AIR-010, AIR-011 | EXC-004 | AC-019 to AC-022 |
| IN-04 Lead collection | FR-037 to FR-052 | BR-010, BR-018, BR-019, AIR-012, AIR-013, DR-003, DR-004 | NFR-007, EXC-008, EXC-020, EXC-021 | AC-023 to AC-029, AC-079, AC-081 |
| IN-05 Sales alerts and priority | FR-053 to FR-068 | BR-004 to BR-009, BR-031, DR-007, IR-004, IR-005 | NFR-008, EXC-009, EXC-010 | AC-030 to AC-036 |
| IN-06 Handover and callback | FR-008, FR-069 to FR-084 | BR-012 to BR-014, DR-005, DR-006 | EXC-011 to EXC-014, EXC-025 | AC-037 to AC-043 |
| IN-07 Staff area | FR-085 to FR-115 | PRM-004 to PRM-018, DR-009, DR-010, DR-017 to DR-019, IR-002, IR-010 | NFR-010, NFR-011, NFR-018 | AC-044 to AC-053 |
| IN-08 Safety, privacy, spending | FR-146 to FR-164, FR-168 | BR-011, BR-025 to BR-027, BR-034, DR-016, DR-020, DR-022, DR-024, IR-006 | NFR-012 to NFR-014, NFR-019, EXC-015 to EXC-019 | AC-065 to AC-074, AC-080, AC-083 |
| IN-09 Dashboard and spreadsheet | FR-106, FR-107, FR-116 to FR-129 | BR-028, BR-033 | NFR-003 | AC-051, AC-054 to AC-057 |
| IN-10 Quality checks | FR-097, FR-100, FR-130 to FR-145 | BR-021 to BR-024, AIR-018, DR-012 to DR-015 | EXC-024 | AC-058 to AC-064 |
| IN-11 Pre-launch tests | FR-143, FR-165 to FR-167 | DR-021, IR-008 | NFR-005 | AC-063, AC-075, AC-076, AC-085 |
| IN-12 Leads stored and emailed | FR-046, FR-058 | BR-019, CON-002, DR-004 | EXC-008 | AC-027, AC-032 |
| OUT-01 to OUT-17 | **No requirement.** Verified absent. | | | AC-056, RAC-11 |

### 13.3 Client answers and proposed defaults to requirements

| Source | Requirements |
|---|---|
| CA Q1 Problem and goals | BG-01 to BG-05, FR-020 to FR-036, FR-058, NFR-006, ASM-004 |
| CA Q2 Launch date and budget | CON-009 (TBD-56) |
| CA Q3 Dashboard and quality checks in Phase 1 | IN-09, IN-10, FR-116 to FR-145 |
| CA Q4 Services | FR-021, FR-030, FR-099, BR-016, DR-008 |
| CA Q5 Content | FR-092 to FR-095, FR-101, BR-020, IR-010, ASM-001 |
| CA Q6 The 50 questions | FR-130, DR-014 |
| CA Q7 Combinations and pricing | FR-024, FR-031, FR-032, BR-015, BR-017 |
| CA Q8 Hot leads | FR-057, FR-114, BR-007, BR-009 |
| CA Q9 Alerts | FR-056, FR-058 to FR-062, FR-109, BR-031 |
| CA Q10 Working hours | FR-070, FR-071, BR-012, BR-013, CON-007 |
| CA Q11 Weekly review | FR-138, FR-145, BR-023 |
| CA Q12 Maintenance | FR-092, NFR-018 (ongoing support cost: TBD-56) |
| CA Q13 Legal and privacy | FR-154, FR-155, FR-157, BR-011, CON-012 |
| CA Q14 Website | IR-007, DEP-001 |
| CA Q15 Quality approval | BR-021, FR-133, FR-134, AIR-018 |
| DD 1 English only | CON-006, BR-032, FR-028, AIR-009 |
| DD 2 Sales responds in 15 minutes | BR-029, NFR-009 |
| DD 3 Callback after 3 minutes | FR-072, BR-014 |
| DD 4 Launch score 45 of 50 | FR-133 |
| DD 5 3,000 chats a month | BR-030, NFR-004 |
| DD 6 AI budget by actual usage | BR-025, FR-158 |
| DD 7 Standard hosting | CON-010, IR-008 |
| DD 8 All eight dashboard modules | FR-128, BR-033 |
| DD 9 CSV export | FR-107 |
| DD 10 Alerts with summary and link | FR-061 |
| DD 11 and 12 Retention | BR-027, FR-113, FR-152, FR-153 |
| DD 13 Admin and staff roles | FR-086, FR-087, FR-089, PRM-001 to PRM-018 |
| DD 14 Callback form on failure | FR-010, FR-168 |
| DD 15 Daily backups | FR-165, DR-021 |
| MA Management approvals | FR-154, FR-158, BR-011, BR-025, BR-027 |

### 13.4 Coverage check

- Every FR, AIR, DR, IR, NFR and EXC row has at least one acceptance criterion.
- Every one of the 92 acceptance criteria (AC-001 to AC-092) is referenced by at least one requirement row.
- No ID is used twice.

(These three statements were checked by script on the date of this draft.)

---

## 14. Confirmed, proposed and TBD requirements

### 14.1 Counts

| Type | Confirmed | Proposed | TBD | Total |
|---|---|---|---|---|
| Functional (FR) | 96 | 58 | 14 | 168 |
| AI behaviour (AIR) | 11 | 9 | 1 | 21 |
| Data (DR) | 14 | 10 | 0 | 24 |
| Interface (IR) | 9 | 1 | 0 | 10 |
| Non-functional (NFR) | 6 | 12 | 3 | 21 |
| Exceptions (EXC) | 7 | 17 | 2 | 26 |
| Business rules (BR) | 24 | 9 | 1 | 34 |
| Constraints (CON) | 8 | 3 | 1 | 12 |
| **All** | **175** | **119** | **22** | **316** |

A business rule or constraint marked Confirmed with a bracketed TBD (for example BR-012 for working days) is Confirmed in its rule and has an open value; see 14.4. Permissions (PRM) carry their own status in Section 4.2.

### 14.2 Confirmed requirements

Stated in the Phase 1 document or the client's answers. Formal sign-off is still pending (Section 0.2).

| Type | IDs |
|---|---|
| Functional (FR) | FR-001, FR-002, FR-003, FR-004, FR-006, FR-007, FR-012, FR-015, FR-017, FR-018, FR-020, FR-021, FR-022, FR-023, FR-024, FR-026, FR-027, FR-029, FR-030, FR-031, FR-032, FR-037, FR-038, FR-040, FR-041, FR-042, FR-044, FR-046, FR-049, FR-051, FR-053, FR-056, FR-057, FR-058, FR-059, FR-060, FR-062, FR-063, FR-069, FR-070, FR-071, FR-072, FR-078, FR-079, FR-085, FR-092, FR-093, FR-094, FR-095, FR-097, FR-100, FR-103, FR-104, FR-105, FR-106, FR-111, FR-112, FR-116, FR-117, FR-118, FR-119, FR-120, FR-121, FR-122, FR-123, FR-124, FR-125, FR-126, FR-127, FR-129, FR-130, FR-133, FR-134, FR-135, FR-136, FR-137, FR-138, FR-139, FR-140, FR-142, FR-143, FR-145, FR-146, FR-147, FR-148, FR-149, FR-150, FR-152, FR-154, FR-155, FR-158, FR-159, FR-160, FR-161, FR-163, FR-166 |
| AI behaviour (AIR) | AIR-001, AIR-003, AIR-004, AIR-005, AIR-006, AIR-010, AIR-011, AIR-014, AIR-018, AIR-019, AIR-020 |
| Data (DR) | DR-001, DR-002, DR-004, DR-005, DR-006, DR-009, DR-011, DR-012, DR-013, DR-014, DR-016, DR-017, DR-018, DR-022 |
| Interface (IR) | IR-001, IR-002, IR-003, IR-004, IR-005, IR-006, IR-007, IR-009, IR-010 |
| Non-functional (NFR) | NFR-005, NFR-006, NFR-010, NFR-017, NFR-018, NFR-019 |
| Exceptions (EXC) | EXC-004, EXC-013, EXC-014, EXC-015, EXC-017, EXC-019, EXC-020 |
| Business rules (BR) | BR-001, BR-002, BR-003, BR-004, BR-005, BR-006, BR-008, BR-010, BR-011, BR-012, BR-013, BR-014, BR-015, BR-016, BR-017, BR-018, BR-019, BR-020, BR-021, BR-022, BR-023, BR-025, BR-028, BR-031 |
| Constraints (CON) | CON-001, CON-002, CON-003, CON-004, CON-005, CON-007, CON-008, CON-012 |

### 14.3 Proposed requirements (not yet approved)

These come from the client's proposed defaults, the review notes or the analysis. They apply only if management approves them or does not object. **Each row must be reviewed.**

| Type | IDs |
|---|---|
| Functional (FR) | FR-005, FR-008, FR-009, FR-010, FR-013, FR-014, FR-016, FR-025, FR-028, FR-033, FR-034, FR-035, FR-036, FR-039, FR-043, FR-045, FR-047, FR-048, FR-054, FR-055, FR-061, FR-064, FR-065, FR-066, FR-067, FR-073, FR-074, FR-075, FR-076, FR-077, FR-080, FR-081, FR-086, FR-087, FR-089, FR-090, FR-096, FR-099, FR-102, FR-107, FR-108, FR-109, FR-110, FR-113, FR-114, FR-115, FR-128, FR-131, FR-132, FR-141, FR-144, FR-151, FR-153, FR-156, FR-162, FR-164, FR-165, FR-168 |
| AI behaviour (AIR) | AIR-002, AIR-007, AIR-008, AIR-009, AIR-012, AIR-013, AIR-015, AIR-016, AIR-017 |
| Data (DR) | DR-003, DR-007, DR-008, DR-010, DR-015, DR-019, DR-020, DR-021, DR-023, DR-024 |
| Interface (IR) | IR-008 |
| Non-functional (NFR) | NFR-004, NFR-007, NFR-008, NFR-009, NFR-011, NFR-012, NFR-013, NFR-014, NFR-015, NFR-016, NFR-020, NFR-021 |
| Exceptions (EXC) | EXC-001, EXC-002, EXC-003, EXC-005, EXC-006, EXC-007, EXC-008, EXC-009, EXC-010, EXC-011, EXC-012, EXC-016, EXC-022, EXC-023, EXC-024, EXC-025, EXC-026 |
| Business rules (BR) | BR-009, BR-024, BR-026, BR-027, BR-029, BR-030, BR-032, BR-033, BR-034 |
| Constraints (CON) | CON-006, CON-010, CON-011 |

**Items that need explicit management approval, whatever their status** (the client's own approval list, MA):

| Approval needed | Requirements |
|---|---|
| Monthly AI spending limit and budget | BR-025, FR-113, FR-158 (amount TBD-21) |
| Chat and lead retention periods | BR-027, FR-113, FR-152, FR-153 |
| Privacy and consent wording | BR-011, FR-154, FR-157 (wording TBD-36) |

### 14.4 TBD requirements and open parameters

| Kind | IDs |
|---|---|
| Requirements whose whole content is TBD | FR-011, FR-019, FR-050, FR-052, FR-068, FR-082, FR-083, FR-084, FR-088, FR-091, FR-098, FR-101, FR-157, FR-167, AIR-021, NFR-001, NFR-002, NFR-003, EXC-018, EXC-021, BR-007, CON-009 |
| Confirmed or Proposed requirements with an open parameter (a bracketed TBD in the text) | AIR-006, BR-009, BR-017, BR-025, DR-006, EXC-026, FR-003, FR-009, FR-014, FR-017, FR-020, FR-033, FR-043, FR-044, FR-057, FR-059, FR-062, FR-078, FR-114, FR-115, FR-122, FR-129, FR-145, FR-149, FR-155, FR-158, FR-159, FR-163, FR-164, IR-003, IR-004, IR-005, IR-007, IR-008, IR-010, NFR-005, NFR-006, NFR-008, NFR-009, NFR-012, NFR-015, NFR-016 |

Every open item is listed in Appendix A.

---

## Appendix A. TBD register

The numbering continues from `AI_AGENT_WORKFLOW.md`. Gaps in the numbers are items that are design questions for the SDD and are not needed in this SRS. Items TBD-56 to TBD-66 are shared with the workflow document revision 2, so both registers use the same numbers. A "starting proposal" is **not approved**.

| ID | Open decision or missing information | Affects | Owner | Starting proposal |
|---|---|---|---|---|
| TBD-01 | ~~Service list~~ **Resolved [MG]:** the 8 services (P1 v0.4 §3.1) | — | — | — |
| TBD-02 | Baseline: website traffic, monthly enquiries, average response time | ASM-004, RAC-09 | Client | Measured before launch |
| TBD-04 | AI model provider | IR-003 | Developer, management | |
| TBD-06 | Email sending service | IR-004 | Developer, client | |
| TBD-07 | Slack workspace and channel; individual alert email addresses | FR-062, IR-005 | Client | Primary email Info@tricoredigitaltech.com is known |
| TBD-08 | Hosting, backup storage and data-protection details | CON-010, IR-008, NFR-012 | Management, developer | Standard hosting |
| TBD-10 | Rule for budget mode versus premium mode | FR-163 | Management, test result | Decide by running the 50-question test on both |
| TBD-11 | Maximum clarifying questions in service guidance | FR-033 | Client | 2 |
| TBD-13 | Alert content | FR-061 | Management | **Default adopted** (summary and link); reopened only if management asks for the full chat |
| TBD-14 | Rate-limit values, daily cap, message and reply length limits | FR-149, FR-164, EXC-026 | Management, developer | |
| TBD-15 | Behaviour if the bot-protection service cannot be reached | EXC-018 | Developer, management | |
| TBD-16 | Recovery targets: maximum data loss and restore time | FR-167 | Management | One-day maximum data loss |
| TBD-17 | Rule for a repeated email address | FR-050 | Client | Update the existing lead; alert only if the priority rises |
| TBD-18 | Minimum budget that counts as a serious Hot-lead budget | BR-007, FR-057, FR-114 | Management | |
| TBD-19 | ~~Working days~~ **Resolved [MG]:** Monday to Friday | — | — | — |
| TBD-21 | Monthly AI spending limit, decided with the AI mode (TBD-10) | BR-025, FR-158 | Management | $100 for budget mode; about $200 for premium mode at 3,000 chats |
| TBD-22 | Staff sign-in method and session rules | FR-088 | Developer, management | |
| TBD-26 | Approved company information content | FR-020 | Client | |
| TBD-27 | Chat continuity across pages and for returning visitors | FR-011 | Client | |
| TBD-28 | Loop limits: clarifying questions, strikes, retries | FR-014, FR-017, FR-043 | Client | 2, 3 and 2 |
| TBD-29 | Idle time before a conversation closes | FR-019 | Client | |
| TBD-30 | Assistant name, greeting text, wording of the AI statement | FR-003, FR-009 | Management | Editable in the staff area |
| TBD-31 | How content written in Google Docs reaches the staff area | FR-101, IR-010 | Client, developer | |
| TBD-32 | Does a re-test below 45 block publishing or force a rollback? | FR-098 | Management | Alert staff and allow a rollback |
| TBD-34 | Are the example combinations the only allowed ones? Which clarifying questions are approved? | BR-017 | Management | Combinations in BR-017 |
| TBD-35 | ~~Is "AI Chatbot" a service?~~ **Resolved [MG]:** part of AI Services | — | — | — |
| TBD-36 | Consent wording; notice that chats are stored and reviewed | FR-157 | Management, legal | |
| TBD-37 | Phone-number formats (field list and lead definition **resolved [MG]**) | FR-043 | Developer | Pakistan, UK, Australia, Canada and international formats |
| TBD-38 | PKR and USD budget range values; how the visitor's currency is chosen; timeline options; how a range is compared with the threshold | FR-044, FR-115 | Management | TriCore supplies the ranges; visitor picks the currency |
| TBD-39 | Confirm the mapping of the client's Hot-lead descriptions to fields | BR-009 | Client, management | Mapping in BR-009 (from P1 v0.3 §4) |
| TBD-40 | Callback form fields; whether a preferred call time is asked | FR-078, DR-006 | Client | |
| TBD-41 | When the lead alert is sent; follow-up alert when the priority rises | FR-052, FR-068 | Client | |
| TBD-42 | Handling of a partly completed, abandoned lead | FR-052, EXC-021 | Client | |
| TBD-43 | Definition of a "chat" for the dashboard (callbacks counting as leads **resolved [MG]**) | FR-129 | Management | A conversation with at least one visitor message |
| TBD-44 | How staff are told of handover and callback requests; who is on duty | FR-082 | Client | Same email and Slack channels |
| TBD-45 | A team member joining after 3 minutes; what happens after a live chat ends | FR-083 | Client | |
| TBD-46 | How working hours are shown to visitors in other time zones | FR-084 | Client | |
| TBD-47 | Recipients of spending warnings | FR-159 | Management | |
| TBD-48 | Mapping of business roles to Admin and Staff; who may export leads; who gives "management approval" in the system | PRM-007, PRM-011, Section 4.1 | Management | Management uses Admin |
| TBD-50 | Customer satisfaction measure; visitor rating buttons | FR-145, Section 2.7 | Client | Not in Phase 1 |
| TBD-51 | Targets: reply speed, load times, uptime, alert delivery and timing, concurrency, test sizes, tolerances | NFR-001 to NFR-003, NFR-005, NFR-006, NFR-008, several AC | Management | |
| TBD-52 | How sales response time is measured | NFR-009, BR-029 | Client | Alert time to first staff action |
| TBD-53 | Legal and privacy review for Pakistan, the UK, Australia, Canada and other markets; terms with outside providers | FR-155, CON-012 | Management, legal | |
| TBD-55 | Format of the "urgent" mark on Hot alerts | FR-059 | Client | |
| TBD-56 | Launch date, development budget and ongoing support costs | CON-009 | Client | Decided after requirements are reviewed (CA Q2, Q12) |
| TBD-57 | Website platform (probably WordPress); page list for the chat; when the script is installed | IR-007, AC-001 | Management, developer | WordPress |
| TBD-58 | Supported browsers and devices; window sizes for testing | NFR-016, AC-002 | Client | Modern browsers on phones and computers |
| TBD-59 | Accessibility requirements | NFR-015 | Client | Keyboard use and screen-reader labels |
| TBD-60 | Developer access to production data and logs | FR-091 | Management | |
| TBD-61 | Specific topics the assistant must refuse | AIR-006 | Client | Legal advice, tax, competitors, refunds (from the review notes) |
| TBD-62 | How similar questions are grouped for the "Top 10 questions" | FR-122 | Client | Group by service and topic label |
| TBD-63 | Size and content of the test sets for not-sure, cost, off-topic, undecided-visitor and trick-test cases | AC-009, AC-014, AC-016, AC-019, AC-060 | Client, developer | |
| TBD-64 | Behaviour when two approved entries contradict each other | AIR-021 | Management | Answer "not sure" and flag to staff |
| TBD-65 | ~~Appointment and reporting readings~~ **Resolved [MG]:** callback request and simple dashboard | — | — | — |
| TBD-66 | Content owner per service (delivery **decided [MG]**: within 2 to 3 weeks, by about 2 Dec 2026) | ASM-001 | Management | |
| TBD-67 | Combinations for the 2 new services | BR-017 | Management | Graphic Designing + Digital Marketing; Mobile App Development + Web Development |

---

## Appendix B. What changed

### Version 0.3 (management's decisions, 11 Nov 2026)

| Area | Change |
|---|---|
| Sources | P1 v0.3 → v0.4; BA revision 3 → 4; WF revision 2 → 3; new source code **MG** (management's decisions) |
| Service list | 6 → **8** services: AI Services, Digital Marketing, Web Development, Graphic Designing, SEO, Video Editing, Mobile App Development, WordPress Development. AI Chatbot is part of AI Services (TBD-35 resolved). Section 1.3, Section 2.7 row 1, BR-016 updated |
| Combinations | BR-017 rewritten: AI Services + Web Development; two proposed combinations for the new services (new TBD-67) |
| Lead fields | FR-042 Proposed → **Confirmed**; TBD-37 narrowed to phone formats |
| Callbacks | FR-129 TBD → **Confirmed**: callbacks count as leads; TBD-43 narrowed to the chat definition. AC-057 updated |
| Currency | FR-044: PKR for Pakistan, USD for others; TBD-38 narrowed to range values and currency choice |
| Working days | Monday to Friday: BR-012, CON-007, FR-070, FR-071, AC-039, Section 1.3, Section 2.4 (TBD-19 resolved) |
| Scope readings | Appointments as callbacks and reporting as the dashboard confirmed (TBD-65 resolved; Section 2.7 rows 2 and 3, Section 3.2) |
| Content | ASM-001: due within 2 to 3 weeks; TBD-66 narrowed to owners |
| Website | IR-007, TBD-57: probably WordPress |
| Counts (14.1) | FR: Confirmed 94 → 96, Proposed 59 → 58, TBD 15 → 14. All: 175 / 119 / 22, total 316 |

### Version 0.2

| Area | Change |
|---|---|
| Sources | P1 v0.2 → v0.3 (includes the client's answers); BA revision 2 → 3; WF draft → revision 2 |
| P1 references | Every "P1 §n" reference renumbered to v0.3 (for example core features §3.1-n → §3.2-n, dashboard §3.2 → §3.4, QA §3.3 → §3.5, exclusions §3.4 → §3.6, costs §5 → §6, testing §6 → §7, decisions §7 → §8, words §8 → §9; lead rules now cite §4) |
| Service list | Resolved: the 6 services (TBD-01 closed). "AI Chatbot" stays open (TBD-35, now marked as blocking design) |
| Rule BR-004 | Hot rule now matches P1 §4 exactly; the note explains why every Hot lead also holds the Warm details |
| Rule BR-006 | Example of a Cold lead added |
| Rule BR-009 | TBD → **Proposed**, with the field mapping from P1 v0.3 §4; client confirmation TBD-39 |
| Requirement FR-061 | TBD → **Proposed**: summary and link, no full chat, field-based summary as fallback. AC-034 updated |
| BR-025 and FR-158 | Suggested limit: $100 for budget mode, about $200 for premium mode at 3,000 chats |
| Section 2.7 | Rows 1 and 5 resolved; rows 2 and 3 point to TBD-65; rows 6 and 7 updated |
| Assumption ASM-001 | Content delivery date linked to TBD-66 |
| Counts (14.1) | FR: Proposed 58 → 59, TBD 16 → 15. BR: Proposed 8 → 9, TBD 2 → 1. All: 173 / 120 / 23, total 316 (unchanged) |
| Appendix A | TBD-01 resolved; TBD-13 default adopted; TBD-21, 35, 39, 64 updated; TBD-65 and TBD-66 added |
| Unchanged | Scope, roles, permissions, all other requirements and acceptance criteria |

---

*End of document. This SRS is a draft and waits for review and approval (Section 0.2).*
