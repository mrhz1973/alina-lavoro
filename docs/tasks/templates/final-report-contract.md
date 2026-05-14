# Final Report Contract

**Task:** 0232
**Status:** active template

Every implementer final report must include:

**Applies to:** Claude Code, Windsurf/Cascade, Cursor, and Antigravity.

**The final report must not remain only in terminal output or chat.** Write it to GitHub so the orchestrator can read it via `aggio` without user copy/paste:

- Create `docs/sessions/YYYY-MM-DD-<slug>.md` with the full report.
- If this is a numbered completed task, also create `docs/tasks/done/<task-id>-<slug>.md`.
- Stage and push these files selectively (not `git add .`).

Report content must include:

- files created;
- files modified;
- task ID used;
- checks performed;
- runtime actions performed, or explicit `no runtime`;
- secrets handling confirmation;
- commit hash;
- push result;
- final `git status --short`;
- whether workspace is clean.

For docs-only tasks, explicitly confirm:

- no n8n runtime;
- no n8n UI;
- no workflow Execute;
- no Telegram send;
- no Schedule activation;
- no app source changes;
- no deploy/tag/rollback;
- no provider API LLM;
- no new billing;
- no token/chat_id/secrets recorded.
