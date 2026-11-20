# Operational Runbooks & Troubleshooting Guide

**Project:** TriCore Digital Tech — Website AI Assistant  
**Platform:** Cloudflare Serverless Architecture ($0 Infrastructure Tier)  
**Reference Document:** `doc/SDD_CLOUDFLARE.md` §14.8

---

## Runbook 1: AI Provider Outage or Rate Limit (EXC-001 / EXC-002)

### Symptoms:
- Assistant replies with: *"I am taking a little longer than usual to retrieve that information..."*
- Circuit breaker state moves to `open`.
- Uncaught error alerts in Sentry / logs.

### Action Steps:
1. Verify provider status (OpenAI / Anthropic / Google Cloud status pages).
2. If primary provider key is rate-limited or depleted:
   - Run `wrangler secret put AI_API_KEY` to update with alternate key or fallback model.
3. The circuit breaker resets automatically after 30 seconds of quiet time.
4. Verify recovery by sending a message on `/healthz` or the test chat widget.

---

## Runbook 2: Outbox Notification Delivery Failure (EXC-009 / EXC-010)

### Symptoms:
- Notification rows in D1 marked with `status = 'failed'` or `'undeliverable'`.
- Staff report missing email or Slack alerts for captured leads.

### Action Steps:
1. Query failed notifications via staff API: `GET /api/v1/staff/notifications?status=undeliverable`.
2. Check Slack incoming webhook URL validity:
   - If expired, update secret: `wrangler secret put SLACK_WEBHOOK_URL`.
3. Check Cloudflare Email Routing destination address verification status.
4. Retry failed notification:
   - Run `POST /api/v1/staff/notifications/{id}/retry`.
5. The every-minute cron trigger (`runCronSweep`) automatically picks up and retries pending messages older than 2 minutes up to 5 attempts.

---

## Runbook 3: D1 Database Restore from R2 Backup

### Symptoms:
- Database corruption or accidental deletion.

### Action Steps:
1. List available daily encrypted dumps in Cloudflare R2 bucket `assistant-backups`:
   - Inspect `.github/workflows/backup.yml` run history for latest archive key.
2. Download and decrypt the latest dump.
3. Apply to D1:
   - `npx wrangler d1 execute assistant-dev --file=restore.sql`
4. Verify row counts and integrity:
   - `SELECT count(*) FROM service;`
   - `SELECT count(*) FROM knowledge_chunk;`
5. Check health route: `GET /readyz` must return `{"status": "ok", "database": "connected"}`.

---

## Runbook 4: Transition to Workers Paid if Free-Tier Limits Approached

### Trigger:
- Hourly usage snapshot (`usage_snapshot` table) records daily requests > 60,000 (60% of 100k daily free cap).

### Action Steps:
1. Log into Cloudflare Dashboard -> Workers & Pages -> Plans.
2. Upgrade worker to Workers Paid ($5/month includes 10 million requests/month, 50ms CPU limit, and unmetered Durable Object requests).
3. Update `wrangler.jsonc` if needed to increase maximum batch and duration sizes.
