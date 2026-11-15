# Assistant Texts — DRAFT (needs management approval)

> ⚠️ DRAFT. Fixed texts used by the assistant's templates (not written by the AI). Each has an ID so code and settings can refer to it. Text in `{braces}` is filled in by the system. Consent and privacy texts need management approval before launch (TBD-36, TBD-53).

## 1. Identity and greeting

| ID | Text |
|---|---|
| `assistant_name` | TriCore Assistant |
| `ai_notice` | I'm an AI assistant. I answer from TriCore's approved information, and a team member can help if I'm not sure. Chats are stored for a limited time to improve our service. {privacy_link} |
| `greeting` | Hi! I'm TriCore's AI assistant. Ask me about our services, get a quote, or talk to our team. |
| `quick_buttons` | Explore services · Get a quote · Talk to a person |
| `services_intro` | We offer AI Services, Digital Marketing, Web Development, Graphic Designing, SEO, Video Editing, Mobile App Development and WordPress Development. Which one would you like to know about? |

## 2. Consent

| ID | Text |
|---|---|
| `consent_lead` | To prepare a quote, our sales team needs a few details, like your name and email. We'll use them only to respond to your enquiry and keep them for up to 12 months. Is that okay? |
| `consent_buttons` | Yes, that's fine · No thanks |
| `consent_declined` | No problem. I won't save any details. You can keep asking me questions. |
| `consent_callback` | ☐ I agree that TriCore may store these details to contact me about my enquiry. {privacy_link} |
| `consent_version` | v0.1-draft (12 Nov 2026) |

## 3. Lead questions

| ID | Text |
|---|---|
| `ask_name` | Great! What's your name? |
| `ask_email` | Thanks, {name}. What's the best email to reach you? |
| `ask_service` | Which service are you interested in? You can choose more than one. |
| `ask_phone` | Would you like to share a phone number so the team can call you? (Optional) |
| `ask_currency` | Which currency should I show the budget ranges in? |
| `ask_budget` | Roughly which budget range are you thinking of? (Optional) |
| `ask_timeline` | When would you like to start? |
| `ask_description` | In a sentence or two, what would you like us to help with? (Optional) |
| `invalid_email` | That email doesn't look quite right. Could you check it? |
| `invalid_phone` | That phone number doesn't look complete. Could you include the country code, like +92 or +44? |
| `skip` | Skip |
| `lead_saved` | Thank you, {name}! I've passed your details to our sales team. They'll contact you {contact_time}. Anything else I can help with? |
| `contact_time_in_hours` | soon, during working hours |
| `contact_time_after_hours` | on the next working day (we work 9 AM–7 PM PKT, Monday to Friday) |

## 4. Handover and callback

| ID | Text |
|---|---|
| `handover_waiting` | Connecting you with our team. This can take up to 3 minutes. |
| `handover_joined` | {staff_name} from TriCore has joined the chat. |
| `handover_ended` | {staff_name} has left the chat. I'm here if you need anything else. |
| `handover_timeout` | Sorry, our team couldn't join right now. Leave your details and we'll call you back. |
| `after_hours` | Our team is available 9:00 AM to 7:00 PM PKT, Monday to Friday ({visitor_local_hours} your time). Leave your details and we'll contact you on the next working day. |
| `holiday_mode` | Our team isn't available today. Leave your details and we'll contact you on the next working day. |
| `callback_saved` | Thank you, {name}. I've passed your request to our team. |

## 5. Safe replies (templates)

| ID | Text |
|---|---|
| `not_sure` | I'm not sure about that, and I don't want to guess. Would you like me to connect you with our team? |
| `price` | Pricing depends on what you need, so our sales team prepares a quote after understanding your requirements. Would you like to share your details for a quote? |
| `guarantee` | I can't promise specific results, but our team can explain what to expect for your project. |
| `out_of_scope` | That's outside what I can help with. I can answer questions about TriCore's services, or connect you with our team. |
| `refused_legal_tax` | I can't give legal, tax or financial advice. For questions about our services, I'm happy to help. |
| `refused_competitors` | I can only speak about TriCore's own services. Would you like to know more about them? |
| `refused_refund_complaint` | I'm sorry to hear that. Let me connect you with our team so they can help properly. |
| `refused_jobs` | I handle service enquiries only. For job applications, please email Info@tricoredigitaltech.com. |
| `abuse_or_trick` | I can only help with questions about TriCore's services. |
| `abuse_final` | It seems I can't help with this. Would you like to talk to our team? |
| `unclear` | Could you tell me a bit more about what you need? |
| `unclear_buttons` | Here are some options: Explore services · Get a quote · Talk to a person |
| `smalltalk` | Thanks! How can I help you with your project today? |
| `details_only` | I can't answer questions right now, but I can take your details so our team can contact you. |
| `service_unavailable` | Our assistant is unavailable right now. Please email Info@tricoredigitaltech.com and we'll get back to you. |
| `error_retry` | Sorry, something went wrong. Please try again. |

## 6. Alert template (email and Slack)

```
Subject: {hot_prefix}New lead – {name} – {services}
({hot_prefix} = "🔥 HOT LEAD – " for Hot leads; Slack adds @here)

Name: {name}
Email: {email}
Phone: {phone_or_dash}
Services: {services}
Budget: {budget_or_dash}
Timeline: {timeline_or_dash}
Priority: {priority}
Requirements: {description_or_dash}
Summary: {summary}
Open conversation: {staff_chat_link}
```

Template summary (default): `{name} is interested in {services}. Budget: {budget_or_not_given}. Timeline: {timeline_or_not_given}. {first_200_chars_of_description}`
