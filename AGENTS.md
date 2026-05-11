# AGENTS.md — Alina Lavoro

You are an implementation assistant for the Alina Lavoro project.

GitHub is the source of truth. ChatGPT is the orchestrator. Cursor is the preferred implementer; Claude Code is the temporary primary fallback; Windsurf/Cascade may be used only as a reserve implementer for short task-scoped work.

## Required reading

Before acting, read:

- `docs/ORCHESTRATOR_RULES.md`
- `docs/orchestrator/prompt-sequence-gate.md`
- `docs/orchestrator/claude-code-usage-budget.md`
- `docs/PROJECT_STATE.md`
- `docs/CHECKPOINT.md`
- `docs/WORKFLOW.md`
- `docs/AI_RULES.md`
- `docs/COMMANDS.md`
- `docs/roadmap.md`

When working on automation tasks, also read:

- `docs/tasks/README.md`
- the current task in `docs/tasks/queue/`
- relevant files in `docs/automation/n8n-workflows/`

## Hard rules

- Work only on branch `main`.
- `dev` is legacy/inactive.
- Never use `git add .`.
- Commit selectively.
- Do not modify `gas-current/` as source.
- Do not deploy, tag, or rollback unless explicitly requested by the orchestrator.
- Do not modify `src/**`, `.gas/**`, `appsscript.json`, or `package.json` unless the current task explicitly allows it.
- For docs-only/design tasks, touch only allowed documentation paths.
- Do not modify n8n runtime unless the current task explicitly says so.
- Do not execute n8n unless the current task explicitly says so.
- Never commit secrets, credentials, tokens, raw URLs with token query strings, or unredacted n8n exports.

## Work discipline

One session = one task.

After completing a task:

1. run required checks;
2. commit selectively;
3. push to `origin main`;
4. report changed files, checks, commit hash, final `git status --short`, and whether the workspace is clean.

Do not continue to a new task in the same session unless the orchestrator explicitly instructs it after `aggio`.
