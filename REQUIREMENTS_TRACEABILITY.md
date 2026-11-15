# Requirements Traceability Matrix

**Project:** TriCore Digital Tech — Website AI Assistant (Phase 1)
**Source Document:** doc/SRS.md (v0.3)
**Verified Total Unique Requirements:** 316 Core (168 FR, 21 AIR, 24 DR, 10 IR, 21 NFR, 26 EXC, 34 BR, 12 CON) + 18 PRM + 92 AC + 6 ASM + 4 DEP

## Summary by Category

| Category | Prefix | Total Count | Stage Mapped | Implementation Target |
|:---|:---|:---|:---|:---|
| Functional Requirements | FR | 168 | G3, G4, G5 | Worker API, Widget, Staff Dashboard |
| AI Agent Requirements | AIR | 21 | G3 | Worker LLM Agent & Prompt State Machine |
| Data Requirements | DR | 24 | G2 | D1 SQLite Tables, Migrations, Drizzle Schemas |
| Interface Requirements | IR | 10 | G3, G4, G5 | REST Endpoints, SSE Streams, WebSocket DO |
| Non-Functional Requirements | NFR | 21 | G3, G6 | Latency, Security, Error Handling, Backoff |
| Exclusions (Out of Scope Phase 1) | EXC | 26 | G0-G6 | Guardrails (Audio, Multilingual, Booking blocked) |
| Business Rules | BR | 34 | G2, G3 | Rate Limits, Qualification, Retention Rules |
| Constraints | CON | 12 | G1-G6 | Cloudflare Free-Tier CPU/Memory/Storage Bounds |
| Prompt Requirements | PRM | 18 | G3 | Prompt Templates, Seed Texts, Brand Guidelines |
| Acceptance Criteria | AC | 92 | G4, G5, G6 | Automated Vitest & Playwright Test Assertions |

---

## Traceability Matrix

| Req ID | Category | Summary / Description | Primary Stage | SDD / Implementation Reference | Test Verification |
|:---|:---|:---|:---|:---|:---|
| AIR-001 | AIR | All statements about TriCore Digital Tech, its services, processes and policies shall come only from approved content. The assistant shall not use general knowledge to state business facts. | G3 | packages/worker/src/ai | vitest/agent |
| AIR-002 | AIR | The system shall record which approved content supported each factual answer. | G3 | packages/worker/src/ai | vitest/agent |
| AIR-003 | AIR | When approved content does not cover a question, or covers only part of it, the assistant shall say it is not sure about the uncovered part, shall not guess, and shall offer a real person. | G3 | packages/worker/src/ai | vitest/agent |
| AIR-004 | AIR | The assistant shall never state invented prices, clients, promises, guarantees or discounts. | G3 | packages/worker/src/ai | vitest/agent |
| AIR-005 | AIR | For cost questions the assistant shall follow FR-024. | G3 | packages/worker/src/ai | vitest/agent |
| AIR-006 | AIR | The assistant shall discuss only TriCore Digital Tech and its services, and shall politely decline other topics. The specific topics to refuse (for example legal advice, tax, competitors, refunds) are [TBD-61]. | G3 | packages/worker/src/ai | vitest/agent |
| AIR-007 | AIR | The assistant's tone shall be friendly, professional and short. | G3 | packages/worker/src/ai | vitest/agent |
| AIR-008 | AIR | The assistant shall state that it is an AI assistant (FR-009) and shall not claim to be a human. | G3 | packages/worker/src/ai | vitest/agent |
| AIR-009 | AIR | The assistant shall reply in English. | G3 | packages/worker/src/ai | vitest/agent |
| AIR-010 | AIR | Service recommendations shall be limited to the service list and to combinations that follow BR-017. | G3 | packages/worker/src/ai | vitest/agent |
| AIR-011 | AIR | The assistant shall give no price in a recommendation and shall say that the sales team confirms final pricing. | G3 | packages/worker/src/ai | vitest/agent |
| AIR-012 | AIR | Where the assistant uses its own wording in lead collection, it shall be polite, ask one thing at a time, put no pressure on the visitor, and accept a skip of any optional question. | G3 | packages/worker/src/ai | vitest/agent |
| AIR-013 | AIR | The assistant's text shall not itself save data, send a message, start a timer or change a setting. These actions, and the lead priority, shall follow the rules and checks in this SRS. | G3 | packages/worker/src/ai | vitest/agent |
| AIR-014 | AIR | The assistant shall ignore instructions inside visitor text that try to change its rules or reveal internal information. | G3 | packages/worker/src/ai | vitest/agent |
| AIR-015 | AIR | The assistant shall not request card numbers, passwords or ID numbers (FR-048). | G3 | packages/worker/src/ai | vitest/agent |
| AIR-016 | AIR | When the assistant is unsure what the visitor wants, it shall ask a short clarifying question (FR-014). | G3 | packages/worker/src/ai | vitest/agent |
| AIR-017 | AIR | When AI is unavailable, lead collection and handover shall still work in a fixed form that needs no AI. | G3 | packages/worker/src/ai | vitest/agent |
| AIR-018 | AIR | The assistant shall get at least 45 of 50 answers right in the 50-question test (BR-021) and shall be tested again after each content change (BR-022). | G3 | packages/worker/src/ai | vitest/agent |
| AIR-019 | AIR | The system shall support a budget AI mode and a premium AI mode (FR-163). | G3 | packages/worker/src/ai | vitest/agent |
| AIR-020 | AIR | Whenever the assistant says it is not sure, the question shall be saved as unanswered (FR-026). | G3 | packages/worker/src/ai | vitest/agent |
| AIR-021 | AIR | When two approved entries contradict each other, the behaviour is [TBD-64]. | G3 | packages/worker/src/ai | vitest/agent |
| BR-001 | BR | The assistant answers only from approved content. | G2 | packages/worker/src/services | vitest/rules |
| BR-002 | BR | The assistant never invents prices, clients or promises. | G2 | packages/worker/src/services | vitest/rules |
| BR-003 | BR | The assistant gives no price estimates in Phase 1 (price estimates are Phase 3). | G2 | packages/worker/src/services | vitest/rules |
| BR-004 | BR | A lead is **Hot** when it has a serious budget **and** a start date within 3 months **and** a phone number. (Because name, email and service are required to save a lead, FR-042, every Hot lead also holds the Warm details.) | G2 | packages/worker/src/services | vitest/rules |
| BR-005 | BR | A lead is **Warm** when it has name, email and a chosen service. | G2 | packages/worker/src/services | vitest/rules |
| BR-006 | BR | A lead is **Cold** when it has less than the Warm details (for example a callback request with contact details but no service). | G2 | packages/worker/src/services | vitest/rules |
| BR-007 | BR | A "serious budget" is a budget at or above the minimum threshold set by management. The amount is [TBD-18]. | G2 | packages/worker/src/services | vitest/rules |
| BR-008 | BR | Hot leads are marked urgent in the alert. | G2 | packages/worker/src/services | vitest/rules |
| BR-009 | BR | The client's descriptive Hot attributes are proved by fields: genuine requirement and defined project â†’ a chosen service and a short description; realistic budget â†’ a budget range at or above the threshold (BR-007); interest in starting soon â†’ a timeline within 3 months; readiness to discuss â†’ a phone number. Client confirmation is [TBD-39]. | G2 | packages/worker/src/services | vitest/rules |
| BR-010 | BR | Permission is asked before any lead detail is collected. The visitor may decline, and may skip optional questions. | G2 | packages/worker/src/services | vitest/rules |
| BR-011 | BR | Management approves the consent wording and the data retention periods before launch. | G2 | packages/worker/src/services | vitest/rules |
| BR-012 | BR | Working hours are 9:00 AM to 7:00 PM PKT, Monday to Friday. | G2 | packages/worker/src/services | vitest/rules |
| BR-013 | BR | The assistant is available 24/7. Human support is provided by the sales team during working hours only. | G2 | packages/worker/src/services | vitest/rules |
| BR-014 | BR | During working hours a team member joins the chat. Outside working hours, or if nobody joins within 3 minutes, the visitor leaves details for a callback. | G2 | packages/worker/src/services | vitest/rules |
| BR-015 | BR | Final pricing is always confirmed by the sales team. | G2 | packages/worker/src/services | vitest/rules |
| BR-016 | BR | The assistant discusses and recommends only the company's services on the service list (the 8 services; AI Chatbot is part of AI Services). | G2 | packages/worker/src/services | vitest/rules |
| BR-017 | BR | Combinations are recommended according to the customer's requirements and budget. Confirmed examples: Web Development + SEO; WordPress Development + SEO; AI Services + Web Development (the client's "AI Automation" and "AI Chatbot" pairs); SEO + Digital Marketing; Video Editing + Digital Marketing. Proposed for the new services: Graphic Designing + Digital Marketing; Mobile App Development + Web Development [TBD-67]. Whether these are the only allowed combinations is [TBD-34]. | G2 | packages/worker/src/services | vitest/rules |
| BR-018 | BR | In Phase 1 the same basic details are collected for every service. | G2 | packages/worker/src/services | vitest/rules |
| BR-019 | BR | Leads are kept in the assistant's own database and emailed. There is no CRM. | G2 | packages/worker/src/services | vitest/rules |
| BR-020 | BR | Content is prepared by the TriCore team and approved by management before the assistant uses it. | G2 | packages/worker/src/services | vitest/rules |
| BR-021 | BR | Before launch the assistant must get at least 45 of 50 answers right (90 percent). If it scores below 45, the development team improves the answers, fixes the issues and tests again before launch. Management approves the final quality result. | G2 | packages/worker/src/services | vitest/rules |
| BR-022 | BR | The 50-question test is run again after every content change. | G2 | packages/worker/src/services | vitest/rules |
| BR-023 | BR | At least 20 conversations are reviewed every week by the Marketing Lead and management. | G2 | packages/worker/src/services | vitest/rules |
| BR-024 | BR | An answer is "Wrong" when it contradicts approved content, invents something, or fails to hand over when it should have. | G2 | packages/worker/src/services | vitest/rules |
| BR-025 | BR | A monthly AI spending limit applies (amount [TBD-21]; P1 suggests $100 for budget mode or about $200 for premium mode at 3,000 chats). A warning is given at 80 percent. At the limit the assistant stops using AI and switches to "please leave your details" mode. | G2 | packages/worker/src/services | vitest/rules |
| BR-026 | BR | Free AI services are not used for real visitors' data. | G2 | packages/worker/src/services | vitest/rules |
| BR-027 | BR | Chats are kept for 90 days and leads for 12 months, then deleted. The periods need management approval. | G2 | packages/worker/src/services | vitest/rules |
| BR-028 | BR | The success target is that at least 5 percent of chats become leads. | G2 | packages/worker/src/services | vitest/rules |
| BR-029 | BR | Sales responds to a lead alert within 15 minutes during working hours. | G2 | packages/worker/src/services | vitest/rules |
| BR-030 | BR | Capacity is planned for 3,000 chats a month. | G2 | packages/worker/src/services | vitest/rules |
| BR-031 | BR | Lead alerts are sent to Info@tricoredigitaltech.com and to the sales and management team. | G2 | packages/worker/src/services | vitest/rules |
| BR-032 | BR | The assistant works in English only in Phase 1. | G2 | packages/worker/src/services | vitest/rules |
| BR-033 | BR | By default all eight dashboard items are shown. Management may ask for fewer. | G2 | packages/worker/src/services | vitest/rules |
| BR-034 | BR | The assistant never collects card numbers, passwords or ID numbers. | G2 | packages/worker/src/services | vitest/rules |
| DR-001 | DR | The system shall hold a **conversation** record: identifier; start and end time; status (open, live chat, closed); outcome (none, lead, handover, callback); service tags; content versions used; estimated AI cost; whether it was a test conversation. | G2 | packages/worker/src/db | unit/db |
| DR-002 | DR | The system shall hold each **message**: conversation; sender (visitor, assistant, team member); text with card-like and password-like numbers masked; time; whether the assistant was unsure; the approved content that supported it. | G2 | packages/worker/src/db | unit/db |
| DR-003 | DR | The system shall hold a **consent record**: conversation; decision; time; consent wording version; purpose (lead details or callback). | G2 | packages/worker/src/db | unit/db |
| DR-004 | DR | The system shall hold a **lead**: name; email; phone; services of interest; budget range; timeline; short description; priority; source (chat or callback form); times created and updated; linked conversation; linked consent record; alert status. | G2 | packages/worker/src/db | unit/db |
| DR-005 | DR | The system shall hold a **handover request**: conversation; time requested; whether within working hours; status (requested, live, timed out, callback submitted, cancelled, ended); team member who joined; times joined and ended; outcome. | G2 | packages/worker/src/db | unit/db |
| DR-006 | DR | The system shall hold a **callback request**: conversation; the details left by the visitor [fields TBD-40]; time; consent. | G2 | packages/worker/src/db | unit/db |
| DR-007 | DR | The system shall hold a **notification record**: event type; channel (email, Slack); recipients; priority; status (sent, retrying, failed); number of attempts; times. | G2 | packages/worker/src/db | unit/db |
| DR-008 | DR | The system shall hold the **service list**: name; short description; active or not. | G2 | packages/worker/src/db | unit/db |
| DR-009 | DR | The system shall hold **knowledge entries**: type (service description, FAQ, company information, customer response); title; text; status (draft, approved); author; approver; approval time; version number. | G2 | packages/worker/src/db | unit/db |
| DR-010 | DR | The system shall hold a **content version record**: version number; time published; approver; latest 50-question test result. | G2 | packages/worker/src/db | unit/db |
| DR-011 | DR | The system shall hold **unanswered questions**: conversation and message; time; status (new, in to-fix list, resolved). | G2 | packages/worker/src/db | unit/db |
| DR-012 | DR | The system shall hold **review records**: the answer reviewed; reviewer; mark (Good or Wrong); time. | G2 | packages/worker/src/db | unit/db |
| DR-013 | DR | The system shall hold **to-fix items**: the question; the wrong answer; the correct answer typed by the reviewer; status (open, approved, published); approver. | G2 | packages/worker/src/db | unit/db |
| DR-014 | DR | The system shall hold the **50 test questions** and their approved answers. | G2 | packages/worker/src/db | unit/db |
| DR-015 | DR | The system shall hold **test runs**: date; content version; answer and judgement for each question; score; pass or fail; approver. | G2 | packages/worker/src/db | unit/db |
| DR-016 | DR | The system shall hold **AI usage records**: conversation; purpose; mode (budget or premium); amount used; estimated cost; time. | G2 | packages/worker/src/db | unit/db |
| DR-017 | DR | The system shall hold **settings**: greeting; working hours and days; alert recipients; budget ranges; timeline options; Hot-lead budget threshold; chat retention period; lead retention period; monthly spending limit; test spending limit. | G2 | packages/worker/src/db | unit/db |
| DR-018 | DR | The system shall hold **staff users**: name; email; role (Staff or Admin); active or disabled. | G2 | packages/worker/src/db | unit/db |
| DR-019 | DR | The system shall hold a **change history**: who changed or approved content or settings; what changed; when. | G2 | packages/worker/src/db | unit/db |
| DR-020 | DR | The system shall hold a **deletion log**: what categories of data were deleted by the retention rules, how many, and when. | G2 | packages/worker/src/db | unit/db |
| DR-021 | DR | The system shall hold **backup records**: date; success or failure. | G2 | packages/worker/src/db | unit/db |
| DR-022 | DR | Card-like and password-like numbers shall never be stored in any record. | G2 | packages/worker/src/db | unit/db |
| DR-023 | DR | Times shall be shown to staff in PKT. | G2 | packages/worker/src/db | unit/db |
| DR-024 | DR | The only personal data collected from a visitor shall be the lead fields in DR-004 and the callback details in DR-006, plus the masked chat. | G2 | packages/worker/src/db | unit/db |
| EXC-001 | EXC | **The AI provider fails or is too slow.** The system shall retry once. If it still fails, it shall reply politely, offer a team member or the callback form, log the failure and alert the developer. After repeated failures it shall switch to details-only mode. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-002 | EXC | **The AI returns an unusable result.** The system shall discard it, retry once, and otherwise use the reply in EXC-001. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-003 | EXC | **The visitor's message is unclear.** The system shall follow FR-014. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-004 | EXC | **No approved content fits the question.** The assistant shall say it is not sure, offer a person or a quote, and save the question as unanswered. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-005 | EXC | **Approved content cannot be reached.** The system shall treat it as EXC-004 and alert staff and the developer. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-006 | EXC | **A drafted reply would break a rule** (an invented price, an unapproved claim, internal text). The system shall not send it, and shall send a safe fixed reply instead. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-007 | EXC | **Stored data cannot be reached.** The chat shall show the fixed message with the company email (FR-010), and the developer shall be alerted at once. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-008 | EXC | **A lead cannot be saved.** The system shall retry. If it still fails, it shall ask the visitor to email Info@tricoredigitaltech.com, keep the details in a protected error record, and alert staff and the developer. A lead shall never be lost silently. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-009 | EXC | **One alert channel fails.** The other channel shall still send, the failed one shall be retried, and the failure shall be visible in the staff area. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-010 | EXC | **Both alert channels fail.** The alert shall be marked undelivered, shown in the staff area and reported to the developer. The lead remains saved. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-011 | EXC | **The handover timer fails.** A periodic check shall find overdue requests and show the callback form, so no visitor waits beyond 3 minutes without an offer. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-012 | EXC | **The live chat connection fails.** The visitor shall see a connection message and the callback form. Staff and the developer shall be alerted. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-013 | EXC | **Nobody joins within 3 minutes.** The callback form shall be shown. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-014 | EXC | **A handover is requested outside working hours.** The callback form shall be shown at once. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-015 | EXC | **The monthly spending limit is reached.** The assistant shall stop using AI and switch to "please leave your details" mode. A warning shall have been sent at 80 percent. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-016 | EXC | **Spending cannot be measured.** The system shall stop using AI, use details-only mode and alert the developer. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-017 | EXC | **A bot, spam or too many messages.** The system shall block the traffic with no AI cost and show a short polite message. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-018 | EXC | **The bot-protection service cannot be reached.** The behaviour is [TBD-15]. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-019 | EXC | **A trick or abusive message.** The assistant shall stay polite and safe and refuse. After the strike limit it shall end the topic and offer a person. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-020 | EXC | **The visitor declines consent.** The system shall store no lead details and the assistant shall keep answering. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-021 | EXC | **The visitor leaves before lead collection is complete.** The handling is [TBD-42]. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-022 | EXC | **The chat box does not load.** The website shall keep working. The developer shall be alerted where the fault can be detected. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-023 | EXC | **A backup or deletion job fails.** The job shall be retried at the next run, never skipped silently, and the developer shall be alerted. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-024 | EXC | **A 50-question test run is incomplete.** The run shall be marked incomplete and the content change shall not be treated as verified. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-025 | EXC | **The staff area is unavailable.** Visitor chat and alerts shall continue. Handover requests shall move to the callback form after 3 minutes. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| EXC-026 | EXC | **A message is empty or too long.** The system shall reply politely and ask the visitor to shorten it. The limits are [TBD-14]. | G3 | packages/worker/src/ai/guardrails | vitest/guardrails |
| FR-001 | FR | The system shall display the chat box on every page of the TriCore website where the assistant is installed. | G4 | packages/widget | playwright/widget |
| FR-002 | FR | The chat box shall be usable on both phones and computers. | G4 | packages/widget | playwright/widget |
| FR-003 | FR | When opened, the chat shall show a greeting and the quick buttons "Explore services", "Get a quote" and "Talk to a person". The greeting wording is a staff setting [TBD-30]. | G4 | packages/widget | playwright/widget |
| FR-004 | FR | The visitor shall be able to type messages and receive the assistant's replies in the same chat window. | G4 | packages/widget | playwright/widget |
| FR-005 | FR | "Explore services" shall show the service list and let the visitor choose a service to get an explanation from approved content. | G4 | packages/widget | playwright/widget |
| FR-006 | FR | "Get a quote" shall start the permission step of lead collection (FR-037). | G4 | packages/widget | playwright/widget |
| FR-007 | FR | "Talk to a person" shall start the handover process (Section 6.8). | G4 | packages/widget | playwright/widget |
| FR-008 | FR | The chat shall tell the visitor the handover status: team notified and waiting up to 3 minutes, team member joined, or callback form offered. | G4 | packages/widget | playwright/widget |
| FR-009 | FR | The chat shall state at the start that the visitor is talking to an AI assistant [wording TBD-30]. | G4 | packages/widget | playwright/widget |
| FR-010 | FR | If the system cannot be reached, the chat shall show a fixed message with the company email, Info@tricoredigitaltech.com. | G4 | packages/widget | playwright/widget |
| FR-011 | FR | The conversation shall continue as the visitor moves between pages during one visit. Behaviour for returning visitors is [TBD-27]. | G4 | packages/widget | playwright/widget |
| FR-012 | FR | For each typed message the system shall work out what the visitor wants: an answer, service guidance, a quote, a person, a callback, an off-topic request, or unclear. | G4 | packages/widget | playwright/widget |
| FR-013 | FR | A request for a person shall be handled before any other flow, at any stage of the conversation. | G4 | packages/widget | playwright/widget |
| FR-014 | FR | When a message is unclear, the assistant shall ask at most [2, TBD-28] clarifying questions, then offer the quick buttons or a person. | G4 | packages/widget | playwright/widget |
| FR-015 | FR | For an off-topic request the assistant shall say it is not sure, say the topic is outside what TriCore offers, and offer to connect a team member. | G4 | packages/widget | playwright/widget |
| FR-016 | FR | For a greeting or thanks the assistant shall reply briefly and invite the visitor to continue. | G4 | packages/widget | playwright/widget |
| FR-017 | FR | For an abusive message or an attempt to trick the assistant, it shall stay polite and safe. After [3, TBD-28] such messages it shall end the topic and offer a person. | G4 | packages/widget | playwright/widget |
| FR-018 | FR | The system shall store each conversation (visitor, assistant and team member messages, with times) so staff can read it. | G4 | packages/widget | playwright/widget |
| FR-019 | FR | The system shall close a conversation that has been inactive for [TBD-29]. | G4 | packages/widget | playwright/widget |
| FR-020 | FR | The assistant shall answer questions about TriCore Digital Tech and its services only from approved content. Company questions are answered only if approved company content exists [TBD-26]. | G4 | packages/widget | playwright/widget |
| FR-021 | FR | Approved content shall allow the assistant to explain each service, its benefits and how it solves customer problems. | G4 | packages/widget | playwright/widget |
| FR-022 | FR | When the assistant is not sure, it shall say so and offer a real person. It shall not guess. | G4 | packages/widget | playwright/widget |
| FR-023 | FR | The assistant shall never invent prices, clients or promises. | G4 | packages/widget | playwright/widget |
| FR-024 | FR | When asked about cost, the assistant shall say that the team prepares a proper quote, shall give no price, and shall offer lead collection or a person. | G4 | packages/widget | playwright/widget |
| FR-025 | FR | The assistant shall not state any price, discount or guarantee in Phase 1, even if one appears in approved content. | G4 | packages/widget | playwright/widget |
| FR-026 | FR | The system shall save every question the assistant could not answer as an unanswered question. | G4 | packages/widget | playwright/widget |
| FR-027 | FR | After content is approved and published, the assistant shall use it for later messages. | G4 | packages/widget | playwright/widget |
| FR-028 | FR | The assistant's replies shall be in English. | G4 | packages/widget | playwright/widget |
| FR-029 | FR | The assistant shall point an undecided visitor (for example "I want more customers") to the right mix of services, for example Web Development, SEO and Digital Marketing. | G4 | packages/widget | playwright/widget |
| FR-030 | FR | The assistant shall recommend only services on the service list. | G4 | packages/widget | playwright/widget |
| FR-031 | FR | The assistant shall recommend combinations according to the visitor's requirements, following BR-017. | G4 | packages/widget | playwright/widget |
| FR-032 | FR | A recommendation shall contain no price, and shall state that final pricing is confirmed by the sales team. | G4 | packages/widget | playwright/widget |
| FR-033 | FR | Before recommending, the assistant may ask at most [2, TBD-11] clarifying questions about the visitor's goals. | G4 | packages/widget | playwright/widget |
| FR-034 | FR | After a recommendation the assistant shall offer a quote or a person. | G4 | packages/widget | playwright/widget |
| FR-035 | FR | The services recommended or discussed shall be recorded as the visitor's services of interest, for the lead and the dashboard. | G4 | packages/widget | playwright/widget |
| FR-036 | FR | If approved content does not support a recommendation, the assistant shall show the plain service list and offer a person. | G4 | packages/widget | playwright/widget |
| FR-037 | FR | The assistant shall ask the visitor's permission before collecting any lead detail. | G4 | packages/widget | playwright/widget |
| FR-038 | FR | If the visitor declines, the system shall collect and store no lead details, and the assistant shall continue answering questions. | G4 | packages/widget | playwright/widget |
| FR-039 | FR | The system shall record each consent decision with the decision, the time, the wording version and the conversation. | G4 | packages/widget | playwright/widget |
| FR-040 | FR | The assistant shall collect, in a friendly chat and not a long form: name, email, phone, service, budget range, timeline and a short description. | G4 | packages/widget | playwright/widget |
| FR-041 | FR | The visitor shall be able to skip the optional questions. | G4 | packages/widget | playwright/widget |
| FR-042 | FR | Name, email, service and consent shall be required. Phone, budget range, timeline and description shall be optional, but the assistant shall ask for a phone number because it is needed for a Hot lead. | G4 | packages/widget | playwright/widget |
| FR-043 | FR | The system shall check that the email and phone number are valid. If not, it shall ask again at most [2, TBD-28] times, then skip an optional field or offer a person for a required one. | G4 | packages/widget | playwright/widget |
| FR-044 | FR | The budget question shall offer choices from the budget ranges set in the staff area: PKR ranges for visitors in Pakistan and USD ranges for everyone else. The range values, how the currency is chosen, and the timeline options are [TBD-38]. | G4 | packages/widget | playwright/widget |
| FR-045 | FR | Before saving, the assistant shall show the collected details back to the visitor and ask for confirmation. | G4 | packages/widget | playwright/widget |
| FR-046 | FR | The system shall save the lead in the assistant's own database. | G4 | packages/widget | playwright/widget |
| FR-047 | FR | Each lead shall be linked to its conversation and its consent record. | G4 | packages/widget | playwright/widget |
| FR-048 | FR | The assistant shall not ask for card numbers, passwords or ID numbers. | G4 | packages/widget | playwright/widget |
| FR-049 | FR | If the visitor asks for a person during lead collection, the system shall start handover. | G4 | packages/widget | playwright/widget |
| FR-050 | FR | When the same email address is submitted again, the system shall handle the duplicate according to [TBD-17]. | G5 | packages/staff | vitest/staff |
| FR-051 | FR | The same basic details shall be collected for every service. | G5 | packages/staff | vitest/staff |
| FR-052 | FR | The point at which the alert is sent for a partly completed lead, and the handling of an abandoned partial lead, are [TBD-41] and [TBD-42]. | G5 | packages/staff | vitest/staff |
| FR-053 | FR | The system shall give each lead a priority of Hot, Warm or Cold according to BR-004 to BR-006 (threshold BR-007; mapping BR-009). | G5 | packages/staff | vitest/staff |
| FR-054 | FR | The priority shall be derived by fixed rules from the collected fields, so that the same fields always give the same priority. | G5 | packages/staff | vitest/staff |
| FR-055 | FR | The system shall recalculate the priority when a detail is added or changed. | G5 | packages/staff | vitest/staff |
| FR-056 | FR | The priority shall be shown in the alert, the leads list and the dashboard. | G5 | packages/staff | vitest/staff |
| FR-057 | FR | The minimum budget that counts as a "serious budget" shall be a setting controlled by management [TBD-18]. | G5 | packages/staff | vitest/staff |
| FR-058 | FR | When a lead is created, the system shall send an alert by email and Slack to the sales team straight away. | G5 | packages/staff | vitest/staff |
| FR-059 | FR | Alerts for Hot leads shall be marked urgent. The format of the mark is [TBD-55]. | G5 | packages/staff | vitest/staff |
| FR-060 | FR | A lead alert shall contain: customer name and contact details; project requirements; interested services; lead priority; conversation summary; link to the conversation. | G5 | packages/staff | vitest/staff |
| FR-061 | FR | The alert shall contain the conversation summary and a link to the conversation, and shall not attach the full chat. The full chat is read in the staff area after sign-in. If the AI summary is unavailable, a summary built from the lead fields shall be used. | G5 | packages/staff | vitest/staff |
| FR-062 | FR | Alerts shall be sent to Info@tricoredigitaltech.com and to the sales and management team. Individual addresses and the Slack channel are [TBD-07]. | G5 | packages/staff | vitest/staff |
| FR-063 | FR | Staff shall be able to change the alert recipients in the staff area. | G5 | packages/staff | vitest/staff |
| FR-064 | FR | The system shall also alert staff when a handover is requested and when a callback form is submitted. | G5 | packages/staff | vitest/staff |
| FR-065 | FR | If an alert cannot be delivered, the system shall retry. If one channel fails, the other shall still send. | G5 | packages/staff | vitest/staff |
| FR-066 | FR | An alert that could not be delivered shall be visible to staff in the staff area. | G5 | packages/staff | vitest/staff |
| FR-067 | FR | Each event shall produce one alert; a retry shall not create a duplicate. | G5 | packages/staff | vitest/staff |
| FR-068 | FR | Whether a later priority upgrade sends a follow-up alert is [TBD-41]. | G5 | packages/staff | vitest/staff |
| FR-069 | FR | During working hours, when a visitor asks for a person, the system shall notify staff and allow a team member to join the same chat. | G5 | packages/staff | vitest/staff |
| FR-070 | FR | Working hours shall be 9:00 AM to 7:00 PM PKT, Monday to Friday, and shall be changeable in the staff area. | G5 | packages/staff | vitest/staff |
| FR-071 | FR | Outside working hours, including Saturday and Sunday, the system shall show the callback form immediately, without waiting. | G5 | packages/staff | vitest/staff |
| FR-072 | FR | If no team member joins within 3 minutes of the request, the system shall show the callback form. | G5 | packages/staff | vitest/staff |
| FR-073 | FR | The 3 minutes shall start when the handover request is created and end when a team member joins. Joining shall stop the period. | G5 | packages/staff | vitest/staff |
| FR-074 | FR | Only one handover request shall be open for a conversation at a time. | G5 | packages/staff | vitest/staff |
| FR-075 | FR | When several team members try to join, the first to accept shall join and the others shall be told it is taken. | G5 | packages/staff | vitest/staff |
| FR-076 | FR | While a team member is in the chat, the assistant shall not post replies. | G5 | packages/staff | vitest/staff |
| FR-077 | FR | Handover and the callback form shall work even when AI is unavailable or the spending limit is reached. | G5 | packages/staff | vitest/staff |
| FR-078 | FR | The callback form shall let the visitor leave details for a callback, after asking permission. The fields are [TBD-40]. | G5 | packages/staff | vitest/staff |
| FR-079 | FR | The system shall save each callback request. | G5 | packages/staff | vitest/staff |
| FR-080 | FR | The system shall record the outcome of each handover: joined, timed out, callback submitted or cancelled. | G5 | packages/staff | vitest/staff |
| FR-081 | FR | Staff shall be able to end a live chat; the system shall record the outcome. | G5 | packages/staff | vitest/staff |
| FR-082 | FR | How staff are told of a handover request, and who is on duty, is [TBD-44]. | G5 | packages/staff | vitest/staff |
| FR-083 | FR | Behaviour when a team member joins after the 3 minutes, and what happens after a live chat ends, is [TBD-45]. | G5 | packages/staff | vitest/staff |
| FR-084 | FR | How working hours are shown to visitors in other time zones is [TBD-46]. | G5 | packages/staff | vitest/staff |
| FR-085 | FR | The staff area shall be accessible only after secure sign-in. | G5 | packages/staff | vitest/staff |
| FR-086 | FR | The system shall have two roles, Staff and Admin, with the permissions in Section 4.2. | G5 | packages/staff | vitest/staff |
| FR-087 | FR | The system shall allow each staff-area action only to the roles permitted in Section 4.2. | G5 | packages/staff | vitest/staff |
| FR-088 | FR | The sign-in method and the session rules are [TBD-22]. | G5 | packages/staff | vitest/staff |
| FR-089 | FR | Admin users shall be able to create and disable staff accounts. | G5 | packages/staff | vitest/staff |
| FR-090 | FR | The system shall record who made each content change, approval and settings change, and when. | G3 | packages/worker/src/routes | vitest/api |
| FR-091 | FR | Developer access to production data and logs is [TBD-60]. | G3 | packages/worker/src/routes | vitest/api |
| FR-092 | FR | Staff shall be able to update what the assistant knows without a developer. | G3 | packages/worker/src/routes | vitest/api |
| FR-093 | FR | The content shall cover service descriptions, FAQs, company information and customer responses. | G3 | packages/worker/src/routes | vitest/api |
| FR-094 | FR | New or changed content shall start as a draft and shall become active only after management approves it. | G3 | packages/worker/src/routes | vitest/api |
| FR-095 | FR | The assistant shall use only approved content. | G3 | packages/worker/src/routes | vitest/api |
| FR-096 | FR | The system shall keep earlier versions of the content and record which version supported each answer. | G3 | packages/worker/src/routes | vitest/api |
| FR-097 | FR | After every content change the 50-question test shall be run again. | G3 | packages/worker/src/routes | vitest/api |
| FR-098 | FR | The result of the re-test shall be shown to staff. Whether a result below 45 blocks publishing or forces a rollback is [TBD-32]. | G3 | packages/worker/src/routes | vitest/api |
| FR-099 | FR | Admin shall be able to maintain the service list. | G3 | packages/worker/src/routes | vitest/api |
| FR-100 | FR | A correct answer typed by a reviewer in the to-fix list shall be added to what the assistant knows after management approves it. | G3 | packages/worker/src/routes | vitest/api |
| FR-101 | FR | How content written in Google Docs reaches the staff area (copy or import) is [TBD-31]. | G3 | packages/worker/src/routes | vitest/api |
| FR-102 | FR | Staff shall be able to see which approved content supported an assistant answer in a conversation. | G3 | packages/worker/src/routes | vitest/api |
| FR-103 | FR | Staff shall be able to read the leads. | G3 | packages/worker/src/routes | vitest/api |
| FR-104 | FR | Staff shall be able to read full chats. | G3 | packages/worker/src/routes | vitest/api |
| FR-105 | FR | Staff shall be able to join live chats. | G3 | packages/worker/src/routes | vitest/api |
| FR-106 | FR | Staff shall be able to download the leads list as a spreadsheet. | G3 | packages/worker/src/routes | vitest/api |
| FR-107 | FR | The download shall be a CSV file with all lead fields plus priority, time created and consent. | G3 | packages/worker/src/routes | vitest/api |
| FR-108 | FR | The chat viewer shall show the full transcript with the sender and time of each message. | G3 | packages/worker/src/routes | vitest/api |
| FR-109 | FR | The leads list shall show for each lead its priority, services, time created and a link to its conversation. | G3 | packages/worker/src/routes | vitest/api |
| FR-110 | FR | The staff area shall show waiting handover requests so a team member can accept one. | G3 | packages/worker/src/routes | vitest/api |
| FR-111 | FR | Authorized users shall be able to change the greeting, the working hours, the alert recipients and the budget ranges in the staff area. | G3 | packages/worker/src/routes | vitest/api |
| FR-112 | FR | A settings change shall take effect without developer work. | G3 | packages/worker/src/routes | vitest/api |
| FR-113 | FR | The chat retention period, the lead retention period and the monthly AI spending limit shall be settings. | G3 | packages/worker/src/routes | vitest/api |
| FR-114 | FR | The minimum budget for a Hot lead shall be a setting [TBD-18]. | G3 | packages/worker/src/routes | vitest/api |
| FR-115 | FR | The list of timeline options shall be a setting [TBD-38]. | G3 | packages/worker/src/routes | vitest/api |
| FR-116 | FR | The staff area shall have a simple dashboard page. | G3 | packages/worker/src/routes | vitest/api |
| FR-117 | FR | The dashboard shall have a date filter with last 7 days, last 30 days and custom dates. | G3 | packages/worker/src/routes | vitest/api |
| FR-118 | FR | Dashboard item 1 shall show the number of chats. | G3 | packages/worker/src/routes | vitest/api |
| FR-119 | FR | Dashboard item 2 shall show the number of leads, split into Hot, Warm and Cold. | G3 | packages/worker/src/routes | vitest/api |
| FR-120 | FR | Dashboard item 3 shall show the share of chats that became leads, against the target of 5 percent or more. | G3 | packages/worker/src/routes | vitest/api |
| FR-121 | FR | Dashboard item 4 shall show the number of times a person was asked for. | G3 | packages/worker/src/routes | vitest/api |
| FR-122 | FR | Dashboard item 5 shall show the top 10 questions asked. How similar questions are grouped is [TBD-62]. | G3 | packages/worker/src/routes | vitest/api |
| FR-123 | FR | Dashboard item 6 shall show the questions the assistant could not answer. | G3 | packages/worker/src/routes | vitest/api |
| FR-124 | FR | Dashboard item 7 shall show the services visitors ask about most. | G3 | packages/worker/src/routes | vitest/api |
| FR-125 | FR | Dashboard item 8 shall show AI spending this month against the limit, and the cost per lead. | G3 | packages/worker/src/routes | vitest/api |
| FR-126 | FR | The dashboard shall use data the assistant already collects. | G3 | packages/worker/src/routes | vitest/api |
| FR-127 | FR | The dashboard shall not include charts over time, trends, comparisons or emailed reports (Phase 3). | G3 | packages/worker/src/routes | vitest/api |
| FR-128 | FR | By default all eight items shall be shown. Management may ask for fewer. | G3 | packages/worker/src/routes | vitest/api |
| FR-129 | FR | Callback submissions shall count as leads, including for the 5 percent target. The definition of a "chat" used for the numbers is [TBD-43]. | G3 | packages/worker/src/routes | vitest/api |
| FR-130 | FR | The system shall hold a set of 50 questions with approved answers entered by the TriCore team. | G3 | packages/worker/src/routes | vitest/api |
| FR-131 | FR | Admin shall be able to run the 50 questions through the assistant in test mode. | G3 | packages/worker/src/routes | vitest/api |
| FR-132 | FR | The system shall record each test run: the date, the content version, each answer, the right-or-wrong judgement, the score and pass or fail. | G3 | packages/worker/src/routes | vitest/api |
| FR-133 | FR | The pass mark shall be at least 45 of 50 (90 percent). A lower score means the answers are improved, the issues fixed and the test run again before launch. | G3 | packages/worker/src/routes | vitest/api |
| FR-134 | FR | Management shall approve the final quality result before launch. | G3 | packages/worker/src/routes | vitest/api |
| FR-135 | FR | Practice chats shall be run for five situations: a quick question, an undecided visitor, a quote request, asking for a person, and a chat after hours. | G3 | packages/worker/src/routes | vitest/api |
| FR-136 | FR | The developer shall run a trick test that tries to make the assistant ask for secrets, go off-topic and be rude. The assistant must stay safe and polite. | G3 | packages/worker/src/routes | vitest/api |
| FR-137 | FR | The system shall give reviewers 20 random conversations each week. | G3 | packages/worker/src/routes | vitest/api |
| FR-138 | FR | The Marketing Lead and management shall review at least 20 conversations each week. | G3 | packages/worker/src/routes | vitest/api |
| FR-139 | FR | Reviewers shall mark each assistant answer Good or Wrong with buttons in the staff area, using BR-024. | G3 | packages/worker/src/routes | vitest/api |
| FR-140 | FR | A Wrong answer shall go to a to-fix list with a box where the reviewer types the right answer. | G3 | packages/worker/src/routes | vitest/api |
| FR-141 | FR | Test runs shall not create real leads, send real alerts or contact real people. | G3 | packages/worker/src/routes | vitest/api |
| FR-142 | FR | Tests shall use made-up data only. | G3 | packages/worker/src/routes | vitest/api |
| FR-143 | FR | Before launch the team shall test that alerts and handover really arrive, test many chats at once, and test recovery from a backup. | G3 | packages/worker/src/routes | vitest/api |
| FR-144 | FR | A spending limit shall apply to testing (suggested: $20). | G3 | packages/worker/src/routes | vitest/api |
| FR-145 | FR | The weekly review shall consider answer accuracy, lead quality, incorrect responses and opportunities for improvement. Customer satisfaction is [TBD-50]. | G3 | packages/worker/src/routes | vitest/api |
| FR-146 | FR | The assistant shall stay on topic: TriCore Digital Tech and its services. | G3 | packages/worker/src/routes | vitest/api |
| FR-147 | FR | The system shall hide card-like and password-like numbers so that they are not stored, shown to staff or sent to the AI provider. | G3 | packages/worker/src/routes | vitest/api |
| FR-148 | FR | The system shall block spam and bots. | G3 | packages/worker/src/routes | vitest/api |
| FR-149 | FR | The system shall apply limits per visitor and a daily limit [values TBD-14]. | G3 | packages/worker/src/routes | vitest/api |
| FR-150 | FR | The assistant shall treat visitor text as a message to answer, never as an instruction that changes its rules. It shall never reveal its internal instructions, secrets or other visitors' data. | G3 | packages/worker/src/routes | vitest/api |
| FR-151 | FR | Visitor-typed text shall be shown safely in the staff area, in email and in Slack, so that it cannot run as a command or alter the layout. | G3 | packages/worker/src/routes | vitest/api |
| FR-152 | FR | The system shall delete old chats on a schedule. The default periods are in BR-027. | G3 | packages/worker/src/routes | vitest/api |
| FR-153 | FR | The system shall delete leads after the lead retention period. | G3 | packages/worker/src/routes | vitest/api |
| FR-154 | FR | The consent wording and the retention periods shall be approved by management before launch. | G3 | packages/worker/src/routes | vitest/api |
| FR-155 | FR | Privacy requirements shall be reviewed against the laws that apply to visitors in Pakistan, the UK, Australia, Canada and other markets, with legal review where required [TBD-53]. | G3 | packages/worker/src/routes | vitest/api |
| FR-156 | FR | The system shall not send real visitor data to free AI services. | G3 | packages/worker/src/routes | vitest/api |
| FR-157 | FR | The visitor shall be told that the chat is stored and reviewed, if the legal review requires it [TBD-36]. | G3 | packages/worker/src/routes | vitest/api |
| FR-158 | FR | The system shall apply a monthly AI spending limit [amount TBD-21; P1 suggests $100 for budget mode or about $200 for premium mode at 3,000 chats]. | G3 | packages/worker/src/routes | vitest/api |
| FR-159 | FR | The system shall warn at 80 percent of the monthly limit. Recipients are [TBD-47]. | G3 | packages/worker/src/routes | vitest/api |
| FR-160 | FR | At the limit the system shall stop using AI and switch to a polite "please leave your details" mode. | G3 | packages/worker/src/routes | vitest/api |
| FR-161 | FR | The system shall estimate and record the AI cost of each conversation, the month-to-date total and the cost per lead. | G3 | packages/worker/src/routes | vitest/api |
| FR-162 | FR | If spending cannot be measured, the system shall stop using AI and use the details-only mode. | G3 | packages/worker/src/routes | vitest/api |
| FR-163 | FR | The system shall support budget mode and premium mode. The choice is made by running the 50-question test on both [TBD-10]. | G3 | packages/worker/src/routes | vitest/api |
| FR-164 | FR | The system shall limit the length of a visitor message and of an assistant reply [limits TBD-14]. | G3 | packages/worker/src/routes | vitest/api |
| FR-165 | FR | The system shall take daily backups. | G3 | packages/worker/src/routes | vitest/api |
| FR-166 | FR | Recovery from a backup shall be tested before launch. | G3 | packages/worker/src/routes | vitest/api |
| FR-167 | FR | The recovery targets (maximum data loss and restore time) are [TBD-16]. | G3 | packages/worker/src/routes | vitest/api |
| FR-168 | FR | If the assistant service becomes unavailable, visitors shall be offered a callback form or the company email. | G3 | packages/worker/src/routes | vitest/api |
| IR-001 | IR | **Visitor chat interface:** message area, text entry, quick buttons, consent buttons, budget and timeline choice buttons, callback form and handover status messages. | G3 | packages/worker/src/routes | vitest/contract |
| IR-002 | IR | **Staff area screens:** sign-in; dashboard; leads list; chat viewer and live chat; waiting handover requests; knowledge editor with approval; weekly review and to-fix list; 50-question test; settings; staff accounts. | G3 | packages/worker/src/routes | vitest/contract |
| IR-003 | IR | **AI model provider:** receives the masked visitor text and the approved content needed for an answer, and returns generated text. The provider is [TBD-04]. | G3 | packages/worker/src/routes | vitest/contract |
| IR-004 | IR | **Email service:** sends alerts. The provider is [TBD-06]. | G3 | packages/worker/src/routes | vitest/contract |
| IR-005 | IR | **Slack:** receives alerts. The workspace and channel are [TBD-07]. | G3 | packages/worker/src/routes | vitest/contract |
| IR-006 | IR | **Spam and bot protection:** Cloudflare Turnstile is named in P1 Â§6.1. | G3 | packages/worker/src/routes | vitest/contract |
| IR-007 | IR | **Website:** the chat script is installed by the authorized website developer after approval. The website platform is probably WordPress, to be confirmed [TBD-57]. | G3 | packages/worker/src/routes | vitest/contract |
| IR-008 | IR | **Hosting and backup storage:** standard hosting and a place to keep backups [TBD-08]. | G3 | packages/worker/src/routes | vitest/contract |
| IR-009 | IR | **Error monitoring:** a free-tier error monitoring service tells the developer about faults. | G3 | packages/worker/src/routes | vitest/contract |
| IR-010 | IR | **Content source:** content is prepared in Google Docs or structured documentation and moved to the staff area [TBD-31]. | G3 | packages/worker/src/routes | vitest/contract |
| NFR-001 | NFR | **Reply time:** the first visible reply to a visitor message shall appear within [TBD-51] seconds for 95 percent of messages under normal load. | G6 | packages/worker, shared | bench/e2e |
| NFR-002 | NFR | **Widget load:** the chat box shall add no more than [TBD-51] seconds to the page load. | G6 | packages/worker, shared | bench/e2e |
| NFR-003 | NFR | **Dashboard load:** the dashboard for a 30-day range shall open within [TBD-51] seconds at the planning volume. | G6 | packages/worker, shared | bench/e2e |
| NFR-004 | NFR | **Capacity:** the system shall be planned for 3,000 chats a month. | G6 | packages/worker, shared | bench/e2e |
| NFR-005 | NFR | **Concurrency:** the system shall handle many chats at once without errors. The number tested is [TBD-51]. | G6 | packages/worker, shared | bench/e2e |
| NFR-006 | NFR | **Availability:** the assistant shall be available 24 hours a day, 7 days a week. The uptime target is [TBD-51]. | G6 | packages/worker, shared | bench/e2e |
| NFR-007 | NFR | **No lost leads:** every lead whose required details and consent were captured shall be stored or, if storing fails, reported to staff at once. | G6 | packages/worker, shared | bench/e2e |
| NFR-008 | NFR | **Alert reliability:** every alert shall be delivered, or its failure shall be visible to staff. The delivery target is [TBD-51]. | G6 | packages/worker, shared | bench/e2e |
| NFR-009 | NFR | **Response measurement:** the system shall record the time from a lead alert to the first staff action on that lead, so the 15-minute target in BR-029 can be measured. The measure is [TBD-52]. | G6 | packages/worker, shared | bench/e2e |
| NFR-010 | NFR | **Authentication:** every staff-area function shall require sign-in. | G6 | packages/worker, shared | bench/e2e |
| NFR-011 | NFR | **Authorization:** the permission check in Section 4.2 shall be enforced on every staff-area request, not only on screen. | G6 | packages/worker, shared | bench/e2e |
| NFR-012 | NFR | **Data protection:** personal data shall be protected in transit and in storage. The details are [TBD-08]. | G6 | packages/worker, shared | bench/e2e |
| NFR-013 | NFR | **Secrets:** keys and credentials of outside services shall never be visible to visitors or in the chat box. | G6 | packages/worker, shared | bench/e2e |
| NFR-014 | NFR | **Logs:** system logs shall hold no unmasked card-like or password-like numbers. | G6 | packages/worker, shared | bench/e2e |
| NFR-015 | NFR | **Accessibility:** the chat box shall support keyboard use and screen-reader labels. The full requirement is [TBD-59]. | G6 | packages/worker, shared | bench/e2e |
| NFR-016 | NFR | **Browser and device support:** the chat and the staff area shall work on modern browsers on phones and computers. The list is [TBD-58]. | G6 | packages/worker, shared | bench/e2e |
| NFR-017 | NFR | **Monitoring:** faults shall be detected and the developer alerted. | G6 | packages/worker, shared | bench/e2e |
| NFR-018 | NFR | **Changes without code:** content and settings shall be changeable without changing the system itself. | G6 | packages/worker, shared | bench/e2e |
| NFR-019 | NFR | **AI cost:** monthly AI spending shall stay within the approved limit. | G6 | packages/worker, shared | bench/e2e |
| NFR-020 | NFR | **Evidence:** consent records and content approvals shall be kept for as long as the related lead or content exists. | G6 | packages/worker, shared | bench/e2e |
| NFR-021 | NFR | **Time zone:** staff-facing times and working hours shall use PKT. | G6 | packages/worker, shared | bench/e2e |
| PRM-001 | PRM | Open the chat, send messages, use quick buttons | G3 | packages/worker/src/ai/prompts | vitest/prompts |
| PRM-002 | PRM | Give or decline consent | G3 | packages/worker/src/ai/prompts | vitest/prompts |
| PRM-003 | PRM | Submit lead details and the callback form | G3 | packages/worker/src/ai/prompts | vitest/prompts |
| PRM-004 | PRM | Sign in to the staff area | G3 | packages/worker/src/ai/prompts | vitest/prompts |
| PRM-005 | PRM | View the dashboard | G3 | packages/worker/src/ai/prompts | vitest/prompts |
| PRM-006 | PRM | View leads | G3 | packages/worker/src/ai/prompts | vitest/prompts |
| PRM-007 | PRM | Download the leads list as a spreadsheet | G3 | packages/worker/src/ai/prompts | vitest/prompts |
| PRM-008 | PRM | Read full chats | G3 | packages/worker/src/ai/prompts | vitest/prompts |
| PRM-009 | PRM | Join live chats | G3 | packages/worker/src/ai/prompts | vitest/prompts |
| PRM-010 | PRM | Draft and edit knowledge content | G3 | packages/worker/src/ai/prompts | vitest/prompts |
| PRM-011 | PRM | Approve and publish knowledge content | G3 | packages/worker/src/ai/prompts | vitest/prompts |
| PRM-012 | PRM | Mark answers Good or Wrong; add to-fix entries | G3 | packages/worker/src/ai/prompts | vitest/prompts |
| PRM-013 | PRM | Approve to-fix corrections for publication | G3 | packages/worker/src/ai/prompts | vitest/prompts |
| PRM-014 | PRM | Run the 50-question test | G3 | packages/worker/src/ai/prompts | vitest/prompts |
| PRM-015 | PRM | View 50-question test results | G3 | packages/worker/src/ai/prompts | vitest/prompts |
| PRM-016 | PRM | Change greeting, working hours, alert recipients, budget ranges | G3 | packages/worker/src/ai/prompts | vitest/prompts |
| PRM-017 | PRM | Change retention periods, spending limit, Hot-lead budget threshold | G3 | packages/worker/src/ai/prompts | vitest/prompts |
| PRM-018 | PRM | Create and disable staff accounts | G3 | packages/worker/src/ai/prompts | vitest/prompts |

