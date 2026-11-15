import { sqliteTable, text, integer, uniqueIndex, index, primaryKey } from "drizzle-orm/sqlite-core";

// 1. staff_user
export const staffUser = sqliteTable(
  "staff_user",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    role: text("role").notNull(), // 'staff' | 'admin'
    status: text("status").notNull().default("active"), // 'active' | 'disabled'
    createdAt: integer("created_at").notNull()
  }
);

// 2. service
export const service = sqliteTable(
  "service",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    isActive: integer("is_active").notNull().default(1),
    sortOrder: integer("sort_order").notNull().default(0)
  }
);

// 3. knowledge_entry
export const knowledgeEntry = sqliteTable(
  "knowledge_entry",
  {
    id: text("id").primaryKey(),
    serviceId: text("service_id").references(() => service.id),
    entryType: text("entry_type").notNull(), // 'service' | 'faq' | 'company' | 'policy' | 'combination'
    title: text("title").notNull(),
    keywords: text("keywords"), // comma separated or JSON array
    status: text("status").notNull().default("draft") // 'draft' | 'approved' | 'superseded'
  }
);

// 4. knowledge_entry_version
export const knowledgeEntryVersion = sqliteTable(
  "knowledge_entry_version",
  {
    id: text("id").primaryKey(),
    entryId: text("entry_id").notNull().references(() => knowledgeEntry.id),
    versionNo: integer("version_no").notNull(),
    body: text("body").notNull(),
    status: text("status").notNull().default("draft"),
    authorId: text("author_id").references(() => staffUser.id),
    approverId: text("approver_id").references(() => staffUser.id),
    approvedAt: integer("approved_at"),
    isLive: integer("is_live").notNull().default(0)
  },
  (t) => ({
    versionIdx: uniqueIndex("idx_entry_version").on(t.entryId, t.versionNo)
  })
);

// 5. knowledge_chunk
export const knowledgeChunk = sqliteTable(
  "knowledge_chunk",
  {
    id: text("id").primaryKey(),
    entryVersionId: text("entry_version_id").notNull().references(() => knowledgeEntryVersion.id),
    chunkText: text("chunk_text").notNull(),
    title: text("title"),
    keywords: text("keywords"),
    chunkSeq: integer("chunk_seq").notNull().default(0)
  }
);

// 6. knowledge_release
export const knowledgeRelease = sqliteTable(
  "knowledge_release",
  {
    id: text("id").primaryKey(),
    releaseNo: integer("release_no").notNull().unique(),
    publishedAt: integer("published_at").notNull(),
    publishedBy: text("published_by").references(() => staffUser.id),
    status: text("status").notNull().default("published") // 'published' | 'superseded' | 'rolled_back'
  }
);

// 7. release_item
export const releaseItem = sqliteTable(
  "release_item",
  {
    releaseId: text("release_id").notNull().references(() => knowledgeRelease.id),
    entryVersionId: text("entry_version_id").notNull().references(() => knowledgeEntryVersion.id)
  },
  (t) => ({
    pk: primaryKey({ columns: [t.releaseId, t.entryVersionId] })
  })
);

// 8. visitor_session
export const visitorSession = sqliteTable(
  "visitor_session",
  {
    id: text("id").primaryKey(),
    tokenHash: text("token_hash").notNull().unique(),
    createdAt: integer("created_at").notNull(),
    lastSeenAt: integer("last_seen_at").notNull()
  }
);

// 9. conversation
export const conversation = sqliteTable(
  "conversation",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id").notNull().references(() => visitorSession.id),
    releaseId: text("release_id").references(() => knowledgeRelease.id),
    stage: text("stage").notNull().default("initial"), // 'initial' | 'qualifying' | 'completed' | 'abandoned'
    outcome: text("outcome"), // 'lead_captured' | 'faq_answered' | 'handed_over' | 'dropped'
    isTest: integer("is_test").notNull().default(0),
    estCost: integer("est_cost").notNull().default(0),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull()
  }
);

// 10. message
export const message = sqliteTable(
  "message",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id").notNull().references(() => conversation.id),
    seq: integer("seq").notNull(),
    sender: text("sender").notNull(), // 'visitor' | 'assistant' | 'staff' | 'system'
    contentMasked: text("content_masked").notNull(),
    intent: text("intent"),
    topicTag: text("topic_tag"),
    answerable: integer("answerable").default(1),
    usedChunkIds: text("used_chunk_ids"), // JSON array of chunk ids
    clientMessageId: text("client_message_id").unique(),
    createdAt: integer("created_at").notNull()
  },
  (t) => ({
    convSeqIdx: uniqueIndex("idx_conv_seq").on(t.conversationId, t.seq)
  })
);

// 11. consent_text
export const consentText = sqliteTable(
  "consent_text",
  {
    version: integer("version").primaryKey(),
    wording: text("wording").notNull(),
    approvedAt: integer("approved_at").notNull()
  }
);

// 12. consent_record
export const consentRecord = sqliteTable(
  "consent_record",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id").notNull().references(() => conversation.id),
    wordingVersion: integer("wording_version").notNull().references(() => consentText.version),
    purpose: text("purpose").notNull(), // 'lead_contact' | 'analytics'
    decision: integer("decision").notNull(), // 1 = consented, 0 = refused
    recordedAt: integer("recorded_at").notNull()
  }
);

// 13. budget_range
export const budgetRange = sqliteTable(
  "budget_range",
  {
    id: text("id").primaryKey(),
    currency: text("currency").notNull().default("USD"),
    label: text("label").notNull(),
    minAmount: integer("min_amount").notNull().default(0),
    meetsHotThreshold: integer("meets_hot_threshold").notNull().default(0)
  }
);

// 14. timeline_option
export const timelineOption = sqliteTable(
  "timeline_option",
  {
    id: text("id").primaryKey(),
    label: text("label").notNull(),
    within3Months: integer("within_3_months").notNull().default(1)
  }
);

// 15. lead
export const lead = sqliteTable(
  "lead",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id").references(() => conversation.id),
    consentId: text("consent_id").references(() => consentRecord.id),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    budgetRangeId: text("budget_range_id").references(() => budgetRange.id),
    timelineOptionId: text("timeline_option_id").references(() => timelineOption.id),
    currency: text("currency").default("USD"),
    description: text("description"),
    priority: text("priority").notNull().default("warm"), // 'hot' | 'warm' | 'cold'
    source: text("source").notNull().default("assistant"),
    createdAt: integer("created_at").notNull()
  }
);

// 16. lead_service
export const leadService = sqliteTable(
  "lead_service",
  {
    leadId: text("lead_id").notNull().references(() => lead.id),
    serviceId: text("service_id").notNull().references(() => service.id)
  },
  (t) => ({
    pk: primaryKey({ columns: [t.leadId, t.serviceId] })
  })
);

// 17. handover_request
export const handoverRequest = sqliteTable(
  "handover_request",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id").notNull().references(() => conversation.id),
    status: text("status").notNull().default("pending"), // 'pending' | 'accepted' | 'timed_out' | 'declined'
    requestedAt: integer("requested_at").notNull(),
    deadlineAt: integer("deadline_at").notNull(),
    acceptedBy: text("accepted_by").references(() => staffUser.id),
    outcome: text("outcome")
  }
);

// 18. callback_request
export const callbackRequest = sqliteTable(
  "callback_request",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id").references(() => conversation.id),
    handoverId: text("handover_id").references(() => handoverRequest.id),
    leadId: text("lead_id").references(() => lead.id),
    contactName: text("contact_name").notNull(),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    note: text("note"),
    createdAt: integer("created_at").notNull()
  }
);

// 19. notification
export const notification = sqliteTable(
  "notification",
  {
    id: text("id").primaryKey(),
    eventType: text("event_type").notNull(), // 'lead_alert' | 'handover_alert' | 'system_alert'
    channel: text("channel").notNull(), // 'email' | 'slack'
    dedupeKey: text("dedupe_key").unique(),
    payload: text("payload").notNull(), // JSON
    status: text("status").notNull().default("pending"), // 'pending' | 'delivered' | 'failed' | 'undeliverable'
    attempts: integer("attempts").notNull().default(0),
    nextAttemptAt: integer("next_attempt_at"),
    createdAt: integer("created_at").notNull()
  }
);

// 20. ai_usage
export const aiUsage = sqliteTable(
  "ai_usage",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id").references(() => conversation.id),
    purpose: text("purpose").notNull(), // 'chat' | 'classification' | 'test'
    modelId: text("model_id").notNull(),
    mode: text("mode").notNull().default("stream"), // 'stream' | 'json'
    tokensIn: integer("tokens_in").notNull().default(0),
    tokensOut: integer("tokens_out").notNull().default(0),
    estCost: integer("est_cost").notNull().default(0),
    createdAt: integer("created_at").notNull()
  }
);

// 21. unanswered_question
export const unansweredQuestion = sqliteTable(
  "unanswered_question",
  {
    id: text("id").primaryKey(),
    messageId: text("message_id").notNull().references(() => message.id),
    status: text("status").notNull().default("open"), // 'open' | 'investigating' | 'resolved'
    createdAt: integer("created_at").notNull()
  }
);

// 22. review_batch
export const reviewBatch = sqliteTable(
  "review_batch",
  {
    id: text("id").primaryKey(),
    weekStart: text("week_start").notNull(),
    createdAt: integer("created_at").notNull()
  }
);

// 23. review
export const review = sqliteTable(
  "review",
  {
    id: text("id").primaryKey(),
    batchId: text("batch_id").notNull().references(() => reviewBatch.id),
    messageId: text("message_id").notNull().references(() => message.id),
    reviewerId: text("reviewer_id").references(() => staffUser.id),
    mark: text("mark").notNull(), // 'pass' | 'fail' | 'needs_fix'
    notes: text("notes"),
    reviewedAt: integer("reviewed_at").notNull()
  }
);

// 24. tofix_item
export const tofixItem = sqliteTable(
  "tofix_item",
  {
    id: text("id").primaryKey(),
    reviewId: text("review_id").references(() => review.id),
    unansweredId: text("unanswered_id").references(() => unansweredQuestion.id),
    correctAnswer: text("correct_answer"),
    status: text("status").notNull().default("open"), // 'open' | 'fixed' | 'dismissed'
    createdAt: integer("created_at").notNull()
  }
);

// 25. test_question
export const testQuestion = sqliteTable(
  "test_question",
  {
    id: text("id").primaryKey(),
    question: text("question").notNull(),
    approvedAnswer: text("approved_answer").notNull(),
    category: text("category").notNull().default("general"),
    isActive: integer("is_active").notNull().default(1)
  }
);

// 26. test_run
export const testRun = sqliteTable(
  "test_run",
  {
    id: text("id").primaryKey(),
    releaseId: text("release_id").references(() => knowledgeRelease.id),
    status: text("status").notNull().default("running"), // 'running' | 'completed' | 'failed'
    score: integer("score"),
    passed: integer("passed"),
    totalQuestions: integer("total_questions").notNull().default(0),
    startedAt: integer("started_at").notNull(),
    completedAt: integer("completed_at")
  }
);

// 27. test_result
export const testResult = sqliteTable(
  "test_result",
  {
    id: text("id").primaryKey(),
    runId: text("run_id").notNull().references(() => testRun.id),
    questionId: text("question_id").notNull().references(() => testQuestion.id),
    assistantAnswer: text("assistant_answer"),
    judgement: text("judgement").notNull().default("pending"), // 'pass' | 'fail' | 'pending'
    rationale: text("rationale")
  }
);

// 28. setting
export const setting = sqliteTable(
  "setting",
  {
    key: text("key").primaryKey(),
    value: text("value").notNull(), // JSON serialized
    updatedAt: integer("updated_at").notNull()
  }
);

// 29. change_log
export const changeLog = sqliteTable(
  "change_log",
  {
    id: text("id").primaryKey(),
    actorId: text("actor_id").references(() => staffUser.id),
    entityType: text("entity_type").notNull(),
    action: text("action").notNull(),
    beforeData: text("before_data"), // JSON
    afterData: text("after_data"), // JSON
    createdAt: integer("created_at").notNull()
  }
);

// 30. deletion_log
export const deletionLog = sqliteTable(
  "deletion_log",
  {
    id: text("id").primaryKey(),
    category: text("category").notNull(),
    deletedCount: integer("deleted_count").notNull(),
    deletedAt: integer("deleted_at").notNull()
  }
);

// 31. backup_record
export const backupRecord = sqliteTable(
  "backup_record",
  {
    id: text("id").primaryKey(),
    ranAt: integer("ran_at").notNull(),
    status: text("status").notNull(),
    sizeBytes: integer("size_bytes"),
    r2Key: text("r2_key")
  }
);

// 32. job_run
export const jobRun = sqliteTable(
  "job_run",
  {
    id: text("id").primaryKey(),
    job: text("job").notNull(),
    status: text("status").notNull(),
    ranAt: integer("ran_at").notNull(),
    durationMs: integer("duration_ms")
  }
);

// 33. spend_month
export const spendMonth = sqliteTable(
  "spend_month",
  {
    month: text("month").primaryKey(), // 'YYYY-MM'
    realSpentMicro: integer("real_spent_micro").notNull().default(0),
    reservedMicro: integer("reserved_micro").notNull().default(0),
    testSpentMicro: integer("test_spent_micro").notNull().default(0),
    warningSent: integer("warning_sent").notNull().default(0)
  }
);

// 34. rate_counter
export const rateCounter = sqliteTable(
  "rate_counter",
  {
    counterKey: text("counter_key").primaryKey(),
    count: integer("count").notNull().default(0),
    expiresAt: integer("expires_at").notNull()
  }
);

// 35. usage_snapshot
export const usageSnapshot = sqliteTable(
  "usage_snapshot",
  {
    id: text("id").primaryKey(),
    takenAt: integer("taken_at").notNull(),
    metric: text("metric").notNull(),
    value: integer("value").notNull(),
    dailyLimit: integer("daily_limit").notNull()
  }
);
