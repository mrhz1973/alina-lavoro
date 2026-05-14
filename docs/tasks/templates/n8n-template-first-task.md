# n8n Template-First / JSON-First Task Template

**Task:** 0232
**Status:** active template

## Rule

For n8n, the default is **TEMPLATE-FIRST / JSON-FIRST** whenever a workflow is structurally known, already validated in a previous variant, replicable as JSON, or made of predictable nodes and wiring.

## Required deliverable

Prefer an importable n8n JSON template plus companion documentation before asking the user to rebuild nodes manually.

## Base rules

Shared preflight, prohibitions (including tokens / real chat_id / credentials / OAuth / provider API keys / tokenized URLs / no app source / no deploy/tag/rollback), git rules, and final-report persistence come from `docs/tasks/templates/implementer-standard.md`.

## n8n-template-specific safety requirements

Every n8n template committed to the repo must additionally satisfy:

- `active=false`;
- no active Schedule Trigger by default;
- no node that answers INBOX;
- no Browser Bridge project-chat write;
- no queue reader modification unless explicitly scoped;
- credential references use placeholders only (real values bound inside n8n only).

## Manual UI fallback

Manual n8n UI is allowed only for credential binding, Data Table selection, active=false inspection, confirming absence of Schedule Trigger, a single explicitly gated test, or a real UI-only condition that a JSON template cannot represent.

## Runtime gates

Import, Execute, Telegram send, Schedule activation, and workflow activation are runtime/UI gates and require explicit user authorization.

## Expected output

- Done marker: `docs/tasks/done/<task-id>-<slug>.md`.
- Session note: `docs/sessions/YYYY-MM-DD-<slug>.md`.
- Final report per `docs/tasks/templates/final-report-contract.md`.
