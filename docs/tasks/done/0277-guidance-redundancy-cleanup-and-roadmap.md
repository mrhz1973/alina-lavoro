# Task 0277 — Guidance Redundancy Cleanup and Roadmap

## Done status

- **Task ID:** 0277
- **Slug:** guidance-redundancy-cleanup-and-roadmap
- **Completed by:** Claude Code
- **Completion date:** 2026-05-15
- **Completion commit:** (see session note)

## Summary

Docs-only batch. Reduced documentation bloat and duplication across 10 files. Added compact post-cleanup roadmap to roadmap.md.

## Interventions completed

1. **AGENTS.md** — Fixed LLMS.md line budget: `≤200` → `≤150` to match actual constraint.
2. **docs/LLMS.md** — Fixed naming "Claude Code local" → "Claude Code"; updated Last completed to 0277.
3. **docs/wiki/current-state.md** — Removed stale Measurement Snapshot — 0273 (~17 lines); removed duplicate Active Workstream section; removed duplicate Automation Done Criteria section; added line budget constraint in header; updated to 0277.
4. **docs/wiki/token-efficiency.md** — Merged "Measure-First Rule" and "Docs ROI Gate" into compact "New-doc gate"; reduced "Prompt Size Guard" to a pointer to prompt-routing.md; replaced "Template Use" full prompt block with a pointer to prompt-routing.md.
5. **docs/tasks/templates/implementer-standard.md** — Removed duplicate local clone preflight command block; kept pointer to COMMANDS.md and behavioral rules.
6. **docs/tasks/templates/inbox-decision-recording.md** — Added missing final-report-contract pointer.
7. **docs/tasks/templates/n8n-template-first-task.md** — Added missing Expected output section with final-report-contract pointer.
8. **docs/tasks/templates/state-update-batch.md** — Updated Docs ROI Gate pointer from v31-enforcement-checklist.md to token-efficiency.md — New-doc gate.
9. **docs/roadmap.md** — Added compact post-cleanup roadmap table (NOW/NEXT/LATER/DO NOT).

## Confirmation

- No runtime.
- No n8n UI.
- No workflow Execute.
- No Telegram send.
- No Schedule activation.
- No app source changes.
- No deploy/tag/rollback.
- No provider API.
- No billing.
- No secrets.
- No new guidance documents created.
