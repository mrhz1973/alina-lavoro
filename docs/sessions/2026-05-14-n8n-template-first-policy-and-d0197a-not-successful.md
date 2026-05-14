# Session 2026-05-14 — n8n template-first policy adopted; D-0197-A not successful reaffirmed; D-0202-A superseded by D-0206-A

**Type:** docs-only batch session
**Batch:** 0204–0208 (5 done markers + this session + INBOX/canonical updates)
**Branch:** main
**Runtime:** none

## 1. User priority update

The user explicitly changed the project operating priority on 2026-05-14:

- Priority is **TIME AND RESULTS**.
- Manual n8n node-by-node setup is too slow and must become **fallback**.
- For n8n workflows/tests, the preferred method is **importable n8n template first**.
- Manual node-by-node configuration is fallback, used only when import is not feasible.
- Templates should be as complete as possible to reduce user clicks and manual friction.

## 2. Security boundary (preserved)

Allowed in templates/repo:
- complete workflow structure, node names, parameters, expressions;
- Manual Trigger;
- disabled/inactive Schedule Trigger (if useful at all);
- Telegram nodes;
- Data Table nodes;
- credential reference names or placeholders;
- chat_id placeholder or expression;
- TEST-only pinned fields;
- `active = false`.

Forbidden in templates/repo/chat:
- real Telegram bot token;
- real passwords;
- real OAuth material;
- real API keys;
- exported credential secrets;
- URL values containing `token=`;
- real chat_id;
- any secret-bearing n8n credential export.

Real credential binding remains inside n8n only.

## 3. Runtime observation (D-0197-A, reaffirmed)

Reaffirms the prior batch 0199–0203 record (no new runtime in this batch):

- D-0197-A = 1 was decided by the user.
- The user executed exactly one manual run of the duplicate TEST-only workflow `TEST - Alina Telegram notifier PINNED VALIDATION ONLY`.
- `Override pinned idempotency key` node output correct pinned values for task 0193.
- `Load notification state` did not return existing 0193 row fields (only pinned input fields).
- `Decide send or skip` routed TRUE.
- `Build notification payload`, `Send a text message`, `Store notification state` all executed.
- Telegram message arrived.
- New Data Table row was written for task **0198** (not 0193) with `id = 4`, `notification_status = sent`, `notified_at = 2026-05-14T03:34:35.524+02:00`, `workflow_name = TEST - Alina task completion Telegram notifier`.

## 4. Data Table state observation

`alina_telegram_notifier_state` after the run contained 4 rows: existing rows for 0184, 0190, 0193 plus the new row for 0198.

## 5. Classification

D-0197-A consumed. **Not successful / inconclusive** pinned validation due to **partial pinning / downstream dynamic reference leakage**. NOT classified as a confirmed pure idempotency bug — the harness failure prevents drawing conclusions about idempotency logic itself.

## 6. Root cause hypothesis (reaffirmed)

A Set/Edit Fields override before `Load notification state` is insufficient: downstream nodes may still reference dynamic upstream node outputs (`Pick latest done file`, `Get done file`, `Build idempotency key`) by name, bypassing the override. `Store notification state` writing task 0198 instead of pinned 0193 is direct empirical evidence.

A fully pinned harness must use only `$json.*` current item fields in every downstream node.

## 7. Template created

`docs/automation/n8n-workflows/templates/telegram-fully-pinned-validation-harness.template.json` plus companion `.md`. TEST-only, `active: false`, Manual Trigger only, no Schedule Trigger, no real secrets, `$json.*`-only downstream expressions, credential reference and chat_id are placeholders.

## 8. Gate created

`D-0206-A` pending in `docs/INBOX.md` — authorizes import and inspection only (no Execute) of the fully-pinned template into the local supervised n8n instance.

`D-0202-A` superseded by D-0206-A: template-first policy makes inspection/repair of the existing duplicate workflow slower than importing a clean template, and risks reintroducing dynamic-reference leakage during manual edits. No runtime action was ever taken under D-0202-A.

## 9. Files changed in this batch

- `docs/automation/n8n-workflows/templates/telegram-fully-pinned-validation-harness.template.json` (new)
- `docs/automation/n8n-workflows/templates/telegram-fully-pinned-validation-harness.template.md` (new)
- `docs/tasks/done/0204-document-n8n-template-first-policy-and-partial-pinning-root-cause.md` (new)
- `docs/tasks/done/0205-create-fully-pinned-n8n-importable-template.md` (new)
- `docs/tasks/done/0206-create-template-import-inspection-decision-packet.md` (new)
- `docs/tasks/done/0207-update-project-policy-and-state-after-template-first-decision.md` (new)
- `docs/INBOX.md` (updated)
- `docs/LLMS.md` (updated)
- `docs/wiki/current-state.md` (updated)
- `docs/wiki/token-efficiency.md` (updated)
- `docs/ORCHESTRATOR_RULES.md` (updated — new PRIORITÀ 0B)
- `docs/AI_RULES.md` (updated — new implementer rule)
- `docs/WORKFLOW.md` (updated — new template-first workflow section)
- `docs/automation/candidate-gate-backlog.md` (updated)
- `docs/roadmap.md` (updated)
- `docs/automation/telegram-idempotency-runtime-ui-handoff.md` (updated)
- `docs/sessions/2026-05-14-n8n-template-first-policy-and-d0197a-not-successful.md` (this file)

## 10. Forbidden actions respected

- No n8n UI opened, no workflow imported, no workflow executed.
- No Schedule Trigger added or activated.
- No Telegram message sent.
- No Telegram token requested or stored.
- No chat id committed or pasted.
- No workflow JSON exported from n8n.
- No API key created.
- No provider API proposed.
- No `src/**` change.
- No `gas-current/**` change.
- No deploy, tag, or rollback.
- No `git add .`.
- No real secrets or `token=` URL added.

## 11. Checks performed

- `git branch --show-current` → `main`.
- `git status --short` initial → only `.obsidian/` untracked.
- `git pull origin main` → already up to date.
- `git diff --check` after writes → no whitespace errors expected.
- Path allowlist respected; only docs/template paths touched.

## 12. Numbering note

The user's prompt requested numbers 0199–0203 for this content, but those numbers were already taken by the prior committed batch (commit `3f25066`) which had different scope (controlled inspection/repair design + D-0202-A). After explicit user confirmation via AskUserQuestion, the new batch was assigned numbers **0204–0208** (one number skipped from queue alignment: 0204, 0205, 0206, 0207 are done markers; this session note is the fifth artifact) and D-0202-A is moved to Superseded. The prior 0199–0203 audit content remains intact and is preserved on `main`.
