# Website AI Assistant, Phase 1: Features, Running Cost and Testing Cost

| | |
|---|---|
| **Company** | TriCore Digital Tech (https://tricoredigitaltech.com/) |
| **Version** | 0.4 (Draft, updated with the client's answers and management's decisions of 11 November 2026) |
| **Date** | 11 November 2026 |
| **For** | Management, sales and marketing |
| **Prices checked** | 18 October 2026 (re-check before approving a budget) |
| **Currency** | US dollars; Pakistani rupees at Rs 280 per dollar; all amounts before tax |

---

## 1. What this document is

This is a plain-language description of the first working version (Phase 1) of the AI assistant on the TriCore Digital Tech website. It explains:

- what the assistant will do,
- what it costs to keep running after it is built,
- what it costs to test it before launch,
- what has been decided, and what still needs management's decision.

No technical knowledge is needed. Words that may be new are explained in Section 9.

---

## 2. Phase 1 in one paragraph

A chat box appears on the TriCore website. Visitors ask about TriCore's 8 services and get quick, correct answers at any hour. If they want a quote, the assistant politely collects their details and alerts the sales team straight away. If they want a person, the chat is handed to the sales team during working hours (9:00 AM to 7:00 PM PKT), or the visitor leaves details for a callback. Management gets a simple dashboard showing what visitors ask and how many become leads, plus quality checks that keep the answers correct.

**Goals (from TriCore):** handle website enquiries 24/7, explain the services, answer customer questions, capture and qualify leads, recommend suitable services, support sales and callback requests, and reduce manual workload and response time.

---

## 3. What Phase 1 includes

### 3.1 The services the assistant covers

1. AI Services (includes AI automation and AI chatbots)
2. Digital Marketing
3. Web Development
4. Graphic Designing
5. Search Engine Optimization (SEO)
6. Video Editing
7. Mobile App Development
8. WordPress Development

This list was set by TriCore management on 11 November 2026. It replaces the 6 services in the client's written answers, which did not include Graphic Designing or Mobile App Development and named "AI Automation" instead of AI Services.

For each service, the assistant explains what it is, its benefits and how it solves the customer's problem, using only content approved by management.

### 3.2 Core features (the project does not work without these)

| # | Feature | What it means for TriCore |
|---|---|---|
| 1 | **Chat box on every page** | Visitors can start a chat from any page, on phone or computer. It opens with quick buttons: "Explore services", "Get a quote" and "Talk to a person". |
| 2 | **Answers about the 8 services** | The assistant answers only from content approved by management. If it is not sure, it says so and offers a real person. It never invents prices, clients or promises. Final pricing is always confirmed by the sales team. |
| 3 | **Help for undecided visitors** | A visitor who says "I want more customers" is pointed to a suitable mix, for example Web Development, SEO and Digital Marketing (see 3.3). |
| 4 | **Collecting lead details** | In a friendly chat, not a long form, it asks for name, email, phone, service, budget range, timeline and a short description. It asks permission first, and visitors can skip the optional questions. |
| 5 | **Instant alert to sales** | An email to Info@tricoredigitaltech.com and a Slack message to the sales and management team. Each alert contains the customer's name and contact details, project requirements, interested services, lead priority, a short conversation summary and a link to the full conversation. Hot leads are marked urgent. |
| 6 | **Handover to a real person** | During working hours (9:00 AM to 7:00 PM PKT, Monday to Friday), a sales team member joins the same chat. Outside working hours, or if nobody joins within 3 minutes, the visitor leaves details for a callback. The assistant itself stays available 24/7. |
| 7 | **Staff area** | TriCore staff sign in securely, update what the assistant knows (no developer needed), read leads and full chats, join live chats, and change the greeting, working hours, alert recipients and budget ranges. There are two access levels: **Admin** and **Staff**. |
| 8 | **Safety, privacy and spending protection** | The assistant stays on topic, asks for consent, hides card-like and password-like numbers, deletes old chats on a schedule, blocks spam and bots, and stops spending at a monthly limit. Daily backups are taken. If the assistant service is unavailable, visitors see a callback form or the company email instead. |

### 3.3 Service combinations the assistant may suggest

The assistant suggests combinations based on what the visitor needs. Examples approved by TriCore:

| Combination |
|---|
| Web Development + SEO |
| WordPress Development + SEO |
| AI Services + Web Development (covers the client's "AI Automation + Website Development" and "AI Chatbot + Website Development") |
| SEO + Digital Marketing |
| Video Editing + Digital Marketing |
| Graphic Designing + Digital Marketing *(proposed; to be confirmed)* |
| Mobile App Development + Web Development *(proposed; to be confirmed)* |

Custom packages are shaped by the sales team based on the client's requirements and budget. The assistant never quotes a price.

### 3.4 Dashboard (confirmed for Phase 1)

One page in the staff area with a date filter (last 7 days, last 30 days, or custom dates). All 8 items are included:

| What you see | Why it is useful |
|---|---|
| Number of chats | Shows whether visitors are using the assistant |
| Number of leads, split into Hot, Warm and Cold | Shows how good the leads are |
| Share of chats that became leads | The main success number (target: 5 percent or more) |
| Number of times a person was asked for | Shows how often the assistant could not help |
| Top 10 questions asked | Shows what visitors care about |
| Questions the assistant could not answer | Tells you exactly what content to add next |
| Services visitors ask about most | Shows where demand is |
| AI spending this month against the limit, and cost per lead | Keeps the bill under control |

The leads list can be downloaded as a **CSV file** (opens in Excel or Google Sheets).

**About "performance reporting":** in Phase 1 this means the dashboard above (confirmed by management). Charts over time, trends, comparisons and emailed reports are the full reports in Phase 3.

The dashboard uses data the assistant already collects, so it adds almost nothing to the monthly running cost. It only adds developer time to build.

### 3.5 Quality checks (confirmed for Phase 1)

"QA" here means quality assurance: making sure the assistant's answers are correct and stay correct.

1. **Before launch, a 50-question test.** The TriCore team writes 50 real questions with approved answers. The assistant must get **at least 45 right**. If it scores below 45, the development team improves the answers, fixes the issues and tests again before launch. **Management approves the final result.**
2. **Practice chats.** TriCore employees try each situation: a quick question, an undecided visitor, a quote request, asking for a person, and a chat after hours. They also note any wrong or incomplete answers.
3. **Trick test.** The developer tries to make the assistant misbehave (ask for secrets, go off-topic, be rude). It must stay safe and polite.
4. **Weekly review after launch.** The Marketing Lead and management review **at least 20 conversations a week**, checking answer accuracy, lead quality, wrong answers and what to improve. Each answer is marked **Good** or **Wrong** with buttons in the staff area. Wrong answers go to a to-fix list with a box to type the right answer, which is added to what the assistant knows once management approves it. About 1 hour a week.
5. **Re-test after every content change.** The 50-question test is run again so a new entry does not break an old answer.

The Good and Wrong buttons are for TriCore's reviewers. Phase 1 has no rating buttons for visitors, so "customer satisfaction" is judged by the reviewers reading the chats (see Decision 9).

### 3.6 What is not in Phase 1

| When | What |
|---|---|
| **Phase 2** | Booking calls or appointments inside the chat. *(In Phase 1, "appointment requests" are handled as a callback request; confirmed by management.)* |
| **Phase 2** | Separate question sets for each service and the automatic project brief. (In Phase 1 the assistant collects the same basic details for every service.) |
| **Phase 2** | Connection to a CRM. (In Phase 1, leads are kept in the assistant's own database and emailed.) |
| **Phase 3** | Portfolio matching, price estimates, file upload and the free website check. |
| **Phase 3** | Charts, trends, comparisons and emailed full reports. |
| **Not planned unless TriCore decides otherwise** | Careers assistant, existing-client login, languages other than English, and chat on WhatsApp or Facebook. |

### 3.7 If time or money is tight: what could wait

Our recommendation is to keep all 8 core features. If cuts are forced, drop these first, in this order:

| Drop first | What you lose | What you keep |
|---|---|---|
| Live takeover of chats by staff | Real-time handover | Callback form plus instant alerts, so every lead is still followed up |
| Good and Wrong buttons | Convenience | Weekly review using a shared spreadsheet |
| Half of the dashboard (keep chats, leads, conversion, top questions and unanswered questions) | Spending and service views | The spending limit still protects you |

Never cut these, because they protect TriCore's brand, legal position and bill: answers only from approved content, consent and privacy, the spending limit, spam protection, the instant alert to sales, and the 50-question test.

---

## 4. Lead priority: Hot, Warm and Cold

| Level | Rule used by the system |
|---|---|
| **Hot** | Ready to buy soon: a budget at or above management's minimum, a start date within 3 months, and a phone number |
| **Warm** | Interested: name, email and a chosen service |
| **Cold** | Anything less (for example, a callback request with contact details but no service chosen) |

**Decided by management:** a lead is saved only when it has a name, an email and a chosen service (plus consent); phone, budget, timeline and description are optional. **Callback requests also count as leads**, including for the 5 percent target.

TriCore describes a Hot lead as having a genuine business requirement, a clearly defined project or problem, a realistic budget, interest in starting soon, and readiness to discuss the project. The system checks these through the fields above: the service and description show the requirement and project, the budget range shows the budget, the timeline shows the start date, and the phone number shows readiness to talk.

**Still needed:** the minimum budget for a Hot lead (management, Decision 3).

---

## 5. A sample conversation

> **Visitor:** Do you build websites for small businesses?
> **Assistant:** Yes. We offer Web Development and WordPress Development, both built around your business needs. Would you like to tell me about your project?
>
> **Visitor:** I want a website for my gym. How much will it cost?
> **Assistant:** The cost depends on the features you need, so our sales team prepares a proper quote. May I take your name and email so they can contact you? You can say no and I will still answer questions.
>
> **Visitor:** Sure. Ali Khan, ali@example.com.
> **Assistant:** Thank you, Ali. What budget range are you thinking of, and when would you like to start?
>
> **Visitor:** Do you also do tax advice?
> **Assistant:** I am not sure about that, and it is outside what we offer. Would you like me to connect you with a team member?

The last reply shows the "not sure" behaviour: the assistant does not guess.

---

## 6. What it costs to run after development

Prices change, so they must be checked again before management approves a budget. They come from third-party summaries of vendor pages.

### 6.1 What costs money, and what is free

| Item | Free or paid | Cost |
|---|---|---|
| **AI usage** (paid per conversation) | Paid | Budget mode: about 1 to 2 cents per chat (Rs 3 to 6). Premium mode: about 4 to 6 cents per chat (Rs 11 to 17). |
| **Server** (the computer that runs the assistant, standard hosting) | Paid | About $15 to $40 a month (Rs 4,200 to 11,200) |
| **Small extras** (daily backups, email sending, monitoring) | Mostly small | $0 to $30 a month (Rs 0 to 8,400). Backup storage is about $2 to $5 (Rs 560 to 1,400). Email sending is free at small volume. Error monitoring is free at first, with limits. |
| **Slack alerts** | Free | $0 |
| **Spam protection** (Cloudflare Turnstile) | Free | $0 |
| **Dashboard, CSV export and quality-check tools** | No extra running cost | Built into the staff area |
| **Booking tool and CRM** | Not in Phase 1 | Phase 2 |

*Budget mode:* a smaller AI answers routine questions. *Premium mode:* a bigger AI answers everything.

### 6.2 Monthly total

Monthly total = AI usage + fixed costs (server plus extras, **$15 to $70**, Rs 4,200 to 19,600).

| Chats per month | AI usage, budget mode | **Total, budget mode** | AI usage, premium mode | **Total, premium mode** |
|---|---|---|---|---|
| About 500 (smaller site) | $5 to $10 (Rs 1,400 to 2,800) | **$20 to $80 (Rs 5,600 to 22,400)** | $20 to $30 (Rs 5,600 to 8,400) | **$35 to $100 (Rs 9,800 to 28,000)** |
| About 3,000 (planning figure) | $30 to $60 (Rs 8,400 to 16,800) | **$45 to $130 (Rs 12,600 to 36,400)** | $120 to $180 (Rs 33,600 to 50,400) | **$135 to $250 (Rs 37,800 to 70,000)** |
| About 15,000 (very busy site) | $150 to $300 (Rs 42,000 to 84,000) | **$165 to $370 (Rs 46,200 to 103,600)** | $600 to $900 (Rs 168,000 to 252,000) | **$615 to $970 (Rs 172,200 to 271,600)** |

The lower end of each total assumes a basic server and free-tier extras; the upper end assumes a larger server and paid extras.

A rough guide: about 1 in 20 visitors opens the chat, so 3,000 chats a month means about 60,000 website visits a month. TriCore will measure current traffic before launch, so this planning figure can be corrected.

Budget mode is usually good enough for routine questions. Premium mode sounds a little more natural on harder ones. We choose by running the 50-question test on both.

**Note on the spending limit:** at 3,000 chats a month, premium mode needs about $120 to $180 of AI usage. A $100 monthly limit would cover budget mode at that volume but not premium mode (see Decision 1).

### 6.3 People time (not a bill, but real)

- Developer maintenance: about 4 to 8 hours a month (estimate). Who pays for this is to be agreed (Decision 7).
- Weekly quality review: about 1 hour (Marketing Lead and management).
- Adding or fixing content: about 1 to 2 hours a month (TriCore team).
- Answering sales alerts quickly. This matters most: a fast alert is wasted if nobody responds. Target: within 15 minutes during working hours.

### 6.4 Protection against surprise bills

- A monthly AI spending limit, approved by management. You get a warning at 80 percent.
- At the limit, the assistant switches to a polite "please leave your details" mode instead of running up costs. Lead capture and handover still work.
- Limits per visitor and a daily limit stop spam from causing a big bill.

### 6.5 Not included

The developer's build fee, writing the content, taxes, and bank or card conversion fees. Rupee amounts use Rs 280 to the dollar (about the open-market selling rate in mid-October 2026). The rate changes, so recalculate before budgeting.

### 6.6 Going live for almost nothing (the free option)

If the budget is very small, the assistant can run for almost nothing. Only the AI usage has to be paid for.

| Piece | Free-leaning choice | Monthly cost |
|---|---|---|
| AI answers | Budget mode | $5 to $10 at 500 chats (Rs 1,400 to 2,800) |
| Server | A free cloud plan, or a server TriCore already pays for (for example Oracle Cloud's always-free plan; availability and rules are not guaranteed) | $0 |
| Backups | A free storage tier, or a weekly manual copy | $0 |
| Alerts, spam protection, error monitoring | Slack, Cloudflare Turnstile and free tiers | $0 |
| **Total** | | **About $5 to $10 a month (Rs 1,400 to 2,800) at 500 chats** |

**What you give up:**

- A free server can be unavailable, or switched off if you break the provider's rules, and nobody guarantees uptime.
- Updates and backups become the developer's job, and daily backups are harder to guarantee.
- A small free server may be slow at busy times.

**Free AI services are not recommended for real visitors.** Summaries of the 2026 free tiers (Google Gemini, Mistral and others) agree that free tiers may log prompts, and some may use them to improve the provider's products. Visitors' names and emails would pass through them. Request limits also apply, and terms can change without notice. Free AI is fine for practice with made-up data (Section 7.3).

**Default: standard hosting** (as TriCore proposed), because uptime matters when a missed chat can mean a missed lead.

---

## 7. What testing costs before launch

### 7.1 What gets tested

The 50-question test, practice chats for every situation, the trick test, alerts and handover (do emails to Info@tricoredigitaltech.com and Slack messages really arrive?), the 3-minute callback rule, a test with many chats at once, and recovery from a backup.

### 7.2 Cost, with free options

| Item | Cost | Free option |
|---|---|---|
| AI usage during testing | About $5 to $15 in total (Rs 1,400 to 4,200) | Not free, but small. Set a $20 test limit (Rs 5,600). Some AI providers give new accounts free starter credit; do not count on it. |
| A computer to test on | $0 on the developer's laptop. A small trial server costs about $5 to $15 for the month (Rs 1,400 to 4,200, estimate). | The laptop |
| Testing software | $0 | Free and open-source tools |
| Code storage and automatic checks | $0 | GitHub's free plan (confirm current limits) |
| Test alerts (Slack, email) and spam check | $0 | Free plans |
| Error monitoring | $0 | Free tier |
| TriCore people time | About 10 to 15 hours across the team (estimate): 3 to 4 hours to write the 50 questions and answers, 3 to 4 hours for practice chats, 2 hours to check alerts and handover, 1 to 2 hours to check the dashboard | Not avoidable, but only a few hours |

**How the AI testing cost was worked out:** running the 50-question test ten times costs about $5 in premium mode. Thirty practice chats cost about $2. One hundred trick messages cost about $1. Twenty realistic chats cost about $1. That adds up to about $9 (Rs 2,500); the range of $5 to $15 leaves room for repeats. Budget mode costs a fraction of this.

**Total cash for testing:** about $5 to $30 (Rs 1,400 to 8,400), often close to $5 (Rs 1,400) on the developer's laptop.

### 7.3 The free option for testing

1. Use the developer's laptop as the test computer.
2. Use made-up data only (invented names and emails), so no real visitor information goes to a free AI service.
3. Practise with a free AI tier (for example Google Gemini or Mistral free tiers, or a free open-source model on the laptop). Check current terms; limits change.
4. Run the final tests on the real model chosen for launch. A free AI is weaker, so its scores do not predict launch quality. One 50-question run costs about Rs 140 in premium mode and much less in budget mode.
5. Use the free tools from the table above for everything else.

**Result:** about Rs 0 in cash during practice, and about Rs 500 to 1,500 ($2 to $5) for the final tests with the real AI. Staff time is still needed (about 10 to 15 hours).

---

## 8. Decisions

### 8.1 Already decided (from TriCore's answers)

| Topic | Decision |
|---|---|
| Services | The 8 services in Section 3.1 (management, 11 Nov 2026); "AI Chatbot" is part of AI Services |
| Dashboard and quality checks | Included in Phase 1 (all 8 dashboard items, 50-question test, weekly review, Good/Wrong buttons) |
| Content | Written by the TriCore team in Google Docs or structured documents; approved by management; ready before training and testing |
| 50 test questions | Written by the TriCore team; employees join testing |
| Pass mark | 45 of 50; below that, fix and re-test; management approves the final result |
| Pricing | The assistant never quotes prices; the sales team confirms final pricing |
| Alert recipients | Info@tricoredigitaltech.com and the sales and management team |
| Alert content | Name and contact, requirements, services, priority, summary, link to the chat (not the full chat) |
| Working hours | 9:00 AM to 7:00 PM PKT, Monday to Friday; assistant available 24/7; sales team staffs live chats; at weekends a request for a person goes straight to the callback form |
| Lead fields | Name, email and service required (plus consent); the rest optional |
| Callbacks | Count as leads, including for the 5 percent target |
| Budget currency | PKR ranges for visitors in Pakistan, USD ranges for everyone else |
| Appointments and reporting | Phase 1 handles appointment requests as callbacks, and "performance reporting" is the simple dashboard |
| Content timing | Ready within 2 to 3 weeks (by about 2 December 2026); development starts with placeholder content |
| Weekly review | Marketing Lead and management, at least 20 chats a week |
| Content upkeep | TriCore team |
| Website | https://tricoredigitaltech.com/; the authorised website developer adds the chat script after approval |

### 8.2 Proposed defaults (apply unless management asks for a change)

| # | Default |
|---|---|
| 1 | English only |
| 2 | Sales responds within 15 minutes during working hours |
| 3 | Callback option after 3 minutes without a team member joining |
| 4 | Launch score at least 45 of 50 |
| 5 | Planning capacity: 3,000 chats a month |
| 6 | Standard hosting |
| 7 | All 8 dashboard items |
| 8 | CSV export of leads |
| 9 | Alerts contain a summary and link, not the full chat |
| 10 | Chats kept for 90 days, leads for 12 months, then deleted *(needs management approval)* |
| 11 | Admin and Staff access levels |
| 12 | Callback form or company email if the assistant service is unavailable |
| 13 | Daily backups |
| 14 | Testing: $20 limit, developer's laptop, trial server only if needed |

### 8.3 Still needed from management or TriCore

| # | Question | Why it matters | Suggested starting point |
|---|---|---|---|
| 1 | **Monthly AI spending limit** (management approval required) | Sets the cap and the 80 percent warning | $100 a month for budget mode; about $200 if premium mode is chosen at 3,000 chats |
| 2 | Combinations for the 2 new services (Graphic Designing, Mobile App Development) | Guidance for undecided visitors | The two proposed in Section 3.3 |
| 3 | Minimum budget for a Hot lead | The Hot rule cannot work without it | Management decides later; it is a staff setting |
| 4 | The budget ranges (PKR and USD) and timeline choices | Needed for lead collection | TriCore will supply the ranges |
| 5 | **Consent wording and retention periods** (management approval required; legal review where needed) | Visitors are in Pakistan, the UK, Australia, Canada and elsewhere | 90 days for chats, 12 months for leads |
| 6 | The Slack channel for alerts | Alerts depend on it | A dedicated sales-leads channel |
| 7 | Launch date, build budget, and who pays for ongoing developer time and hosting | To be set after the requirements and design are reviewed | — |
| 8 | Budget mode or premium mode | Cost versus answer quality | Decide by running the 50-question test on both |
| 9 | Should visitors rate answers (for customer satisfaction)? | Not in Phase 1 unless requested | Reviewers judge satisfaction from the chats |
| 10 | Website platform | Affects how the chat script is added | Probably WordPress; to be confirmed |
| 11 | Assistant's name and greeting | Brand experience | Editable in the staff area |

---

## 9. Words explained

- **Lead:** a visitor who has agreed to share contact details and shown interest in a service.
- **Hot, Warm, Cold lead:** see Section 4.
- **Handover:** passing the chat from the assistant to a real team member.
- **Callback:** the visitor leaves details so the team can contact them later.
- **Dashboard:** one page of key numbers.
- **CSV:** a simple spreadsheet file that opens in Excel or Google Sheets.
- **QA (quality assurance):** checking that answers are correct.
- **What the assistant knows:** the approved content (services, FAQs, company information) TriCore provides. It answers only from this.
- **Budget mode and premium mode:** a smaller AI for routine answers (cheaper), or a bigger AI for everything (costlier, more natural).
- **Spending limit:** a monthly cap on AI fees. The assistant stops using AI when it is reached.
- **Admin and Staff:** the two access levels in the staff area. Admin can change settings and approve content; Staff can read leads and chats, join live chats and draft content.
- **Server:** the computer, hosted by a company, that runs the assistant day and night.
- **Trial server:** a spare copy used only for testing before launch.
- **CRM:** software where a sales team tracks leads and customers. Not part of Phase 1.
- **PKT:** Pakistan Standard Time.

---

## 10. What changed

### From version 0.3 to 0.4 (management's decisions, 11 November 2026)

- Services: **8 services** (AI Services, Digital Marketing, Web Development, Graphic Designing, SEO, Video Editing, Mobile App Development, WordPress Development) replace the client's 6. "AI Chatbot" is part of AI Services.
- Combinations: AI Services + Web Development replaces the AI Automation and AI Chatbot pairs; two combinations proposed for the new services.
- Decided: required lead fields (name, email, service); callbacks count as leads; PKR and USD budget ranges; Monday to Friday working days; appointments as callbacks and reporting as the dashboard; content within 2 to 3 weeks.
- Still needed list updated: the AI Chatbot question removed; working days removed; budget ranges to be supplied by TriCore; website platform probably WordPress.

### From version 0.2 to 0.3

- Services: "8 services" replaced by TriCore's **6 services**; the combination list added.
- Dashboard and quality checks: now **confirmed** for Phase 1 (was waiting for a decision).
- Alerts: summary and link instead of the full chat; recipients and alert contents added.
- Working hours (9:00 AM to 7:00 PM PKT), reviewers (Marketing Lead and management), content owner, pass-mark process, roles, retention, backups and the unavailable-service fallback added.
- "Appointment requests" clarified as callback requests in Phase 1; "performance reporting" clarified as the simple dashboard.
- Hot-lead section added, linking TriCore's description to the rule.
- Sample conversation changed from mobile apps (not one of the 6 services) to websites.
- Monthly totals rebuilt as AI usage plus fixed costs, so every figure can be checked.
- Free-option cost corrected from $2 to $7 to **$5 to $10** at 500 chats, to match the budget-mode price per chat.
- One 50-question premium run corrected from about Rs 130 to about Rs 140.
- Decisions split into decided, proposed defaults and still needed.

---

## 11. Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| Management | | | |
| Sales lead | | | |
| Marketing lead | | | |
