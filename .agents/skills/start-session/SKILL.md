---
name: start-session
description: Pre-flight check and orientation protocol at the start of every session.
---

# Skill: start-session

Use this skill at the beginning of every development session before writing code or running tasks.

## Protocol Steps:
1. **Time Check:** Run `Get-Date -Format o` in PowerShell to capture actual session timestamp.
2. **Repository & Directory Check:**
   - Run `Get-Location` to verify we are in `D:\work\Tricore_AI_assistant`.
   - Run `git status` to verify working branch (must be `build/<stage>` during development).
3. **Control Files Check:**
   - Read `PROGRESS.md` to identify current stage, current state, and exact next action.
   - Read `TODO.md` to identify the next pending task (`[ ]`) for the current stage.
   - Check `ERROR_LOG.md` for any known gotchas or blocked tasks.
4. **Safety Verification:**
   - Confirm `.gitignore` and `.dev.vars.example` are present.
   - Ensure no `.env` or `.dev.vars` secrets are logged or exposed.
5. **State Current Goal:** Concisely state to the user what task is being started, its acceptance criteria, and proceed.

