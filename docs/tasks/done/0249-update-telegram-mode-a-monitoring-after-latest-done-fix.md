---
task: "0249"
date: 2026-05-14
type: docs-only / state update
status: done
---

# Task 0249 — Update Telegram Mode A monitoring after latest-done fix

## Summary

Following the latest-done selection bug (task 0246) and fix (task 0247), monitoring and stabilization documentation was updated to help future debugging when silent-success-with-no-Telegram is observed.

## Files updated

### docs/automation/telegram-mode-a-post-activation-stabilization-plan.md

Added section 10: "Latest done selection anomaly — resolved / pending scheduled observation"

Content includes:
- Description of the symptom and root cause.
- Fix summary (numeric sort, workflow inactive during fix).
- Validation outcome (Telegram 0245 arrived).
- Current status: first scheduled tick post-fix still pending observation.
- Instruction: if scheduled tick fails or duplicates, disable and record incident.

### docs/automation/telegram-mode-a-post-activation-monitoring-checklist.md

Added section 3b: "Diagnostic: silent success with no Telegram (latest-done selection staleness)"

Content includes:
- Step-by-step diagnostic when workflow succeeds but no Telegram arrives.
- Compare `Pick latest done file` output `task_id` against `Last completed` in `docs/LLMS.md`.
- If stale: inspect `Pick latest done file` node; ensure numeric sort descending.
- If match but still no Telegram: check duplicate-skip path in `Decide send or skip`.
- Reference to `docs/automation/telegram-mode-a-latest-done-selection-fix.md`.

### docs/automation/telegram-mode-a-latest-done-selection-fix.md (new)

Created in task 0246 scope. Full incident documentation, correct selection pattern, validation checklist, and current validation status table.

## Constraints

- No app source changes.
- No provider API LLM.
- No secrets recorded.

## Done status

Completed by: Claude Code (docs-only)
Task: 0249
