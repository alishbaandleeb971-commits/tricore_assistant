---
name: implement-task
description: Step-by-step TDD and implementation protocol for executing a single task from TODO.md.
---

# Skill: implement-task

Follow this protocol for every individual task (`TASK-xxx`) defined in `TODO.md`.

## Protocol Steps:
1. **Scope & Requirements Check:**
   - Locate `TASK-xxx` in `TODO.md`. Read its description, dependencies, acceptance criteria, and tests.
   - Verify all prerequisite tasks are marked `[x]`. If a dependency is missing, do not proceed.
2. **Write / Update Test First (TDD):**
   - Write automated unit or integration test covering the acceptance criteria before or alongside implementation.
   - Run the test locally (`npx vitest ...`) to see it fail or verify expected baseline.
3. **Implement Feature / Component:**
   - Create or edit only the files required for this task.
   - Adhere strictly to pre-approved packages and Cloudflare Zero-Cost constraints ($0 tier).
   - Never store visitor IP, never invent pricing or business policies.
4. **Run Verification Commands:**
   - TypeScript check: `npx tsc --noEmit`
   - Linter / Code style: `npx eslint` / `npx prettier --check`
   - Test suite: `npx vitest run`
5. **Git Commit (Local Only):**
   - Stage modified files: `git add <files>`
   - Commit on `build/<stage>` branch with exact message: `TASK-xxx: <concise summary of changes>`
6. **Update Progress & Traceability:**
   - Mark task `[x]` in `TODO.md`.
   - Update `PROGRESS.md` with current completed task.
   - If test failed twice, log in `ERROR_LOG.md` and mark task `Blocked`.

