CREATE TABLE `ai_usage` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text,
	`purpose` text NOT NULL,
	`model_id` text NOT NULL,
	`mode` text DEFAULT 'stream' NOT NULL,
	`tokens_in` integer DEFAULT 0 NOT NULL,
	`tokens_out` integer DEFAULT 0 NOT NULL,
	`est_cost` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversation`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `backup_record` (
	`id` text PRIMARY KEY NOT NULL,
	`ran_at` integer NOT NULL,
	`status` text NOT NULL,
	`size_bytes` integer,
	`r2_key` text
);
--> statement-breakpoint
CREATE TABLE `budget_range` (
	`id` text PRIMARY KEY NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`label` text NOT NULL,
	`min_amount` integer DEFAULT 0 NOT NULL,
	`meets_hot_threshold` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `callback_request` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text,
	`handover_id` text,
	`lead_id` text,
	`contact_name` text NOT NULL,
	`contact_email` text,
	`contact_phone` text,
	`note` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversation`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`handover_id`) REFERENCES `handover_request`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`lead_id`) REFERENCES `lead`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `change_log` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text,
	`entity_type` text NOT NULL,
	`action` text NOT NULL,
	`before_data` text,
	`after_data` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`actor_id`) REFERENCES `staff_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `consent_record` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`wording_version` integer NOT NULL,
	`purpose` text NOT NULL,
	`decision` integer NOT NULL,
	`recorded_at` integer NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversation`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`wording_version`) REFERENCES `consent_text`(`version`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `consent_text` (
	`version` integer PRIMARY KEY NOT NULL,
	`wording` text NOT NULL,
	`approved_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `conversation` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`release_id` text,
	`stage` text DEFAULT 'initial' NOT NULL,
	`outcome` text,
	`is_test` integer DEFAULT 0 NOT NULL,
	`est_cost` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `visitor_session`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`release_id`) REFERENCES `knowledge_release`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `deletion_log` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`deleted_count` integer NOT NULL,
	`deleted_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `handover_request` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`requested_at` integer NOT NULL,
	`deadline_at` integer NOT NULL,
	`accepted_by` text,
	`outcome` text,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversation`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`accepted_by`) REFERENCES `staff_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `job_run` (
	`id` text PRIMARY KEY NOT NULL,
	`job` text NOT NULL,
	`status` text NOT NULL,
	`ran_at` integer NOT NULL,
	`duration_ms` integer
);
--> statement-breakpoint
CREATE TABLE `knowledge_chunk` (
	`id` text PRIMARY KEY NOT NULL,
	`entry_version_id` text NOT NULL,
	`chunk_text` text NOT NULL,
	`title` text,
	`keywords` text,
	`chunk_seq` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`entry_version_id`) REFERENCES `knowledge_entry_version`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `knowledge_entry` (
	`id` text PRIMARY KEY NOT NULL,
	`service_id` text,
	`entry_type` text NOT NULL,
	`title` text NOT NULL,
	`keywords` text,
	`status` text DEFAULT 'draft' NOT NULL,
	FOREIGN KEY (`service_id`) REFERENCES `service`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `knowledge_entry_version` (
	`id` text PRIMARY KEY NOT NULL,
	`entry_id` text NOT NULL,
	`version_no` integer NOT NULL,
	`body` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`author_id` text,
	`approver_id` text,
	`approved_at` integer,
	`is_live` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`entry_id`) REFERENCES `knowledge_entry`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`author_id`) REFERENCES `staff_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`approver_id`) REFERENCES `staff_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_entry_version` ON `knowledge_entry_version` (`entry_id`,`version_no`);--> statement-breakpoint
CREATE TABLE `knowledge_release` (
	`id` text PRIMARY KEY NOT NULL,
	`release_no` integer NOT NULL,
	`published_at` integer NOT NULL,
	`published_by` text,
	`status` text DEFAULT 'published' NOT NULL,
	FOREIGN KEY (`published_by`) REFERENCES `staff_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `knowledge_release_release_no_unique` ON `knowledge_release` (`release_no`);--> statement-breakpoint
CREATE TABLE `lead` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text,
	`consent_id` text,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`budget_range_id` text,
	`timeline_option_id` text,
	`currency` text DEFAULT 'USD',
	`description` text,
	`priority` text DEFAULT 'warm' NOT NULL,
	`source` text DEFAULT 'assistant' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversation`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`consent_id`) REFERENCES `consent_record`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`budget_range_id`) REFERENCES `budget_range`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`timeline_option_id`) REFERENCES `timeline_option`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `lead_service` (
	`lead_id` text NOT NULL,
	`service_id` text NOT NULL,
	PRIMARY KEY(`lead_id`, `service_id`),
	FOREIGN KEY (`lead_id`) REFERENCES `lead`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`service_id`) REFERENCES `service`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `message` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`seq` integer NOT NULL,
	`sender` text NOT NULL,
	`content_masked` text NOT NULL,
	`intent` text,
	`topic_tag` text,
	`answerable` integer DEFAULT 1,
	`used_chunk_ids` text,
	`client_message_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversation`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `message_client_message_id_unique` ON `message` (`client_message_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_conv_seq` ON `message` (`conversation_id`,`seq`);--> statement-breakpoint
CREATE TABLE `notification` (
	`id` text PRIMARY KEY NOT NULL,
	`event_type` text NOT NULL,
	`channel` text NOT NULL,
	`dedupe_key` text,
	`payload` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`next_attempt_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `notification_dedupe_key_unique` ON `notification` (`dedupe_key`);--> statement-breakpoint
CREATE TABLE `rate_counter` (
	`counter_key` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `release_item` (
	`release_id` text NOT NULL,
	`entry_version_id` text NOT NULL,
	PRIMARY KEY(`release_id`, `entry_version_id`),
	FOREIGN KEY (`release_id`) REFERENCES `knowledge_release`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`entry_version_id`) REFERENCES `knowledge_entry_version`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `review` (
	`id` text PRIMARY KEY NOT NULL,
	`batch_id` text NOT NULL,
	`message_id` text NOT NULL,
	`reviewer_id` text,
	`mark` text NOT NULL,
	`notes` text,
	`reviewed_at` integer NOT NULL,
	FOREIGN KEY (`batch_id`) REFERENCES `review_batch`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`message_id`) REFERENCES `message`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewer_id`) REFERENCES `staff_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `review_batch` (
	`id` text PRIMARY KEY NOT NULL,
	`week_start` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `service` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`is_active` integer DEFAULT 1 NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `service_slug_unique` ON `service` (`slug`);--> statement-breakpoint
CREATE TABLE `setting` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `spend_month` (
	`month` text PRIMARY KEY NOT NULL,
	`real_spent_micro` integer DEFAULT 0 NOT NULL,
	`reserved_micro` integer DEFAULT 0 NOT NULL,
	`test_spent_micro` integer DEFAULT 0 NOT NULL,
	`warning_sent` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `staff_user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `staff_user_email_unique` ON `staff_user` (`email`);--> statement-breakpoint
CREATE TABLE `test_question` (
	`id` text PRIMARY KEY NOT NULL,
	`question` text NOT NULL,
	`approved_answer` text NOT NULL,
	`category` text DEFAULT 'general' NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `test_result` (
	`id` text PRIMARY KEY NOT NULL,
	`run_id` text NOT NULL,
	`question_id` text NOT NULL,
	`assistant_answer` text,
	`judgement` text DEFAULT 'pending' NOT NULL,
	`rationale` text,
	FOREIGN KEY (`run_id`) REFERENCES `test_run`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`question_id`) REFERENCES `test_question`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `test_run` (
	`id` text PRIMARY KEY NOT NULL,
	`release_id` text,
	`status` text DEFAULT 'running' NOT NULL,
	`score` integer,
	`passed` integer,
	`total_questions` integer DEFAULT 0 NOT NULL,
	`started_at` integer NOT NULL,
	`completed_at` integer,
	FOREIGN KEY (`release_id`) REFERENCES `knowledge_release`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `timeline_option` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`within_3_months` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tofix_item` (
	`id` text PRIMARY KEY NOT NULL,
	`review_id` text,
	`unanswered_id` text,
	`correct_answer` text,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`review_id`) REFERENCES `review`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`unanswered_id`) REFERENCES `unanswered_question`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `unanswered_question` (
	`id` text PRIMARY KEY NOT NULL,
	`message_id` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`message_id`) REFERENCES `message`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `usage_snapshot` (
	`id` text PRIMARY KEY NOT NULL,
	`taken_at` integer NOT NULL,
	`metric` text NOT NULL,
	`value` integer NOT NULL,
	`daily_limit` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `visitor_session` (
	`id` text PRIMARY KEY NOT NULL,
	`token_hash` text NOT NULL,
	`created_at` integer NOT NULL,
	`last_seen_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `visitor_session_token_hash_unique` ON `visitor_session` (`token_hash`);
-- FTS5 full-text search table for knowledge chunks
CREATE VIRTUAL TABLE IF NOT EXISTS knowledge_fts USING fts5(
    chunk_id UNINDEXED,
    title,
    keywords,
    body,
    tokenize = 'porter'
);

-- Trigram table for typo-tolerant title/keyword matching
CREATE VIRTUAL TABLE IF NOT EXISTS knowledge_trgm USING fts5(
    chunk_id UNINDEXED,
    title,
    keywords,
    tokenize = 'trigram'
);

-- Triggers to synchronize knowledge_chunk inserts into FTS5
CREATE TRIGGER IF NOT EXISTS trg_knowledge_chunk_ai AFTER INSERT ON knowledge_chunk
BEGIN
    INSERT INTO knowledge_fts(chunk_id, title, keywords, body)
    VALUES (new.id, coalesce(new.title, ''), coalesce(new.keywords, ''), new.chunk_text);

    INSERT INTO knowledge_trgm(chunk_id, title, keywords)
    VALUES (new.id, coalesce(new.title, ''), coalesce(new.keywords, ''));
END;

CREATE TRIGGER IF NOT EXISTS trg_knowledge_chunk_ad AFTER DELETE ON knowledge_chunk
BEGIN
    DELETE FROM knowledge_fts WHERE chunk_id = old.id;
    DELETE FROM knowledge_trgm WHERE chunk_id = old.id;
END;
