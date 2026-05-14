# 0205 — Create fully pinned n8n importable template

- Project: Alina Lavoro
- Type: docs-only / importable template artifact
- Status: done
- Priority: normal
- Deploy: no
- Date: 2026-05-14

## Scope

Create a fully-pinned, importable n8n TEST-only workflow template that supersedes the partial-override approach (which failed in D-0197-A) and the slower node-by-node inspection/repair path (D-0202-A, now superseded by D-0206-A).

Deliverables created:

1. `docs/automation/n8n-workflows/templates/telegram-fully-pinned-validation-harness.template.json` — best-effort importable n8n workflow JSON.
2. `docs/automation/n8n-workflows/templates/telegram-fully-pinned-validation-harness.template.md` — companion documentation (purpose, import instructions, fields to verify, success/failure criteria, schema assumptions, forbidden actions).

## Template properties

- Workflow name: `TEST - Alina Telegram notifier FULLY PINNED HARNESS ONLY`.
- `active: false`.
- Manual Trigger only.
- No active Schedule Trigger.
- Static pinned input as the only source of identity fields (`task_id`, `done_file_path`, `done_file_sha`, `idempotency_key`, `message_preview_safe`, `workflow_name`).
- Data Table lookup uses `{{ $json.idempotency_key }}`.
- Normalize node uses `$input` / `$json` only.
- IF condition: `$json.notification_state_decision === 'send'`.
- TRUE branch: Build notification payload → Send a text message → Store notification state.
- FALSE branch: Duplicate skip (no-op) Code node.
- No references to `$('Manual Trigger')`, `$('List done files')`, `$('Pick latest done file')`, `$('Get done file')`, `$('Build idempotency key')`, or `$('Override pinned idempotency key')`.
- Telegram credential reference: placeholder string only (no real id).
- Telegram `chatId`: `REPLACE_WITH_CHAT_ID_PLACEHOLDER`.
- Pinned values are safe test references for task 0193 (already-public file path and SHA in the existing repo).

## Conformance to `telegram-fully-pinned-validation-harness-design.md`

The template implements section 2 (no dynamic upstream references), section 3 (target harness shape), and the safety properties listed in the design doc. Minor n8n schema details (Data Table parameter shape, IF condition shape, Set node assignments shape) may need post-import adjustment in the UI depending on the local n8n version — the companion `.md` documents these assumptions explicitly.

## Done status

- Completed by: Claude Code (implementer)
- Completion commit: this batch
- Evidence:
  - Template JSON: `docs/automation/n8n-workflows/templates/telegram-fully-pinned-validation-harness.template.json`
  - Companion doc: `docs/automation/n8n-workflows/templates/telegram-fully-pinned-validation-harness.template.md`
- No runtime. No n8n UI. No import. No Execute. No real secrets. No real chat_id. No real Telegram token. No `token=` URLs. No app/deploy/tag/rollback.
