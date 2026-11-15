---
name: gate-report
description: Gate verification and reporting protocol when completing a project stage (G0 to G6).
---

# Skill: gate-report

Use this skill when all tasks in a stage (G0 through G6) are completed.

## Protocol Steps:
1. **Verification Checklist:**
   - Verify every task in the stage is marked `[x]` in `TODO.md`.
   - Run full test suite (`npx vitest run`, `npx playwright test`, `npx tsc --noEmit`).
   - Check git status (`git status`, clean working tree on `build/<stage>`).
2. **Compile Gate Report (Section A6 Format):**
   - **Result:** Summary of stage outcome, test results, pass/fail counts.
   - **What I must do now (for Developer Alishba):** Plain English checklist of any manual or review steps needed.
   - **Decisions I must make (for Alishba):** Any open choices or confirmations.
   - **Problems / Risks:** Any blocked items or technical risks discovered.
   - **What you will do next:** The exact next stage and first task if approved.
   - **Metrics:** Documents read, requirements covered, files created/changed.
3. **MANDATORY STOP:**
   - Present the gate report.
   - STOP execution completely.
   - Do not proceed to the next stage until Alishba explicitly responds with the gate approval (e.g., `"go G1"`).

