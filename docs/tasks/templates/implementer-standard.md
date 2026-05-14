# Implementer Standard Template

**Task:** 0232
**Status:** active template

## Role

**Applies to:** Claude Code, Windsurf/Cascade, Cursor, and Antigravity.

All are supervised implementers — not autonomous runners. GitHub is the source of truth; the user makes all real decisions. n8n is a supervised runtime, not an autonomous agent.

**Read GitHub instructions, not only chat.** Always fetch `docs/LLMS.md`, `docs/wiki/current-state.md`, and the assigned task file from the repository before acting. Do not rely solely on what the user pasted in the chat prompt.

## Mandatory preflight

- Run the task-ID guard in `docs/wiki/task-id-preflight.md`.
- Read `docs/LLMS.md`, then `docs/wiki/current-state.md`, then `docs/wiki/token-efficiency.md`.
- Do not read `docs/PROJECT_STATE.md` or `docs/CHECKPOINT.md` by default.

### Local clone preflight (run before any edit)

Full command block: `docs/COMMANDS.md` § "Mandatory local preflight".

- Verify repository is `mrhz1973/alina-lavoro` and branch is `main`. If not, stop and report.
- If dirty tree: **do not pull, reset, stash, or delete**. Run `git diff --stat` and `git diff --check`, then stop and report.
- If clean: run `git pull origin main`, then `git status --short` and `git log --oneline -5`. Report before starting edits.

## Permanent prohibitions without explicit gate

No app changes, deploy, tag, rollback, provider API LLM, new billing, new API key, credential export, real token, real Chat ID, OAuth material, password, or tokenized URL.

## Git rules

Use selective staging only. Do not use `git add .`. Final state must report checks, commit hash, push result, and workspace cleanliness.

## Final report persistence

The final report must **not** remain only in terminal output or chat. After every completed task:

- Write the report to `docs/sessions/YYYY-MM-DD-<slug>.md`.
- If this is a numbered completed task, also create `docs/tasks/done/<task-id>-<slug>.md`.
- Stage and push these files selectively so the orchestrator can read the result via `aggio` without user copy/paste.
- See `docs/tasks/templates/final-report-contract.md` for the required content checklist.
