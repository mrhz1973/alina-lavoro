# Task 0232 — n8n template-first and LLM Wiki V3.1 efficiency policy

**Date:** 2026-05-14
**Type:** docs-only / direct GitHub policy patch
**Status:** done

## Summary

This task formalizes two project-wide operational policies:

1. **n8n TEMPLATE-FIRST / JSON-FIRST** as the default for known, validated, or structurally predictable n8n workflows.
2. **LLM Wiki V3.1 — Context Router + Template Pack + Task-ID Guard** to reduce monolithic prompts, repeated boilerplate, stale task IDs, and unnecessary manual click chains.

## Preflight

GitHub LLMS-first preflight found:

- `Last completed = 0231`.
- Telegram Mode A is already active scheduled notification-only automation.
- INBOX has no pending Decision Packets.
- The prompt's older expectation around `Last completed = 0226` / manual-only Telegram state was stale and was not propagated.
- Next free task ID selected: `0232`.

## Files created

- `docs/wiki/task-id-preflight.md`
- `docs/wiki/prompt-routing.md`
- `docs/wiki/context-budget-policy.md`
- `docs/wiki/template-pack-index.md`
- `docs/tasks/templates/implementer-standard.md`
- `docs/tasks/templates/n8n-template-first-task.md`
- `docs/tasks/templates/final-report-contract.md`
- `docs/tasks/done/0232-n8n-template-first-and-llm-wiki-v31-efficiency-policy.md`
- `docs/sessions/2026-05-14-n8n-template-first-and-llm-wiki-v31-efficiency-policy.md`

## No implementer used

- No Claude Code.
- No Windsurf.
- No Cursor.
- No implementer prompt generated.

## No runtime

- No n8n runtime.
- No n8n UI.
- No workflow Execute.
- No Telegram send.
- No Schedule activation.
- No template import.
- No app source change.
- No deploy, tag, rollback.

## Security

- No token recorded.
- No real Telegram Chat ID recorded.
- No credential secret recorded.
- No OAuth material recorded.
- No tokenized URL recorded.
- No provider API LLM introduced.
- No new billing introduced.

## Result

The repository now contains reusable policy and template references that allow future work to prefer:

- importable n8n JSON templates over manual node-by-node reconstruction;
- task-ID preflight before creating tasks;
- short delta-based prompts that reference repository templates;
- explicit final report contracts.

## Note

Due to direct GitHub tool constraints, the patch was applied as direct GitHub docs-only file writes rather than through Claude/Windsurf/Cursor. The user's strategic instruction was followed: no external implementer was used.
