# 0204 — Document n8n template-first policy and partial-pinning root cause

- Project: Alina Lavoro
- Type: docs-only
- Status: done
- Priority: normal
- Deploy: no
- Date: 2026-05-14

## Scope

Two related documentation outcomes consolidated into one done task:

### A. Partial-pinning root-cause hypothesis (D-0197-A runtime attempt)

Build on `0200-document-pinned-validation-failure-root-cause.md` (already committed in prior batch 0199–0203). Reaffirm and extend the root cause hypothesis:

- Partial pinning via a Set/Edit Fields override between `Build idempotency key` and `Load notification state` is **insufficient**.
- A Set node changes the current item but does NOT change the stored outputs of previously executed nodes. Downstream nodes referencing `$('Pick latest done file').*`, `$('Get done file').*`, `$('Build idempotency key').*` continue to read the dynamic values.
- Empirical proof: in the D-0197-A run, `Store notification state` wrote a Data Table row for **task 0198**, not the pinned `task_id = 0193`. The store node referenced dynamic upstream node outputs by name, bypassing the override.
- `Load notification state` did not return the existing 0193 row fields. Lookup mismatch hypotheses to investigate separately:
  a. exact string mismatch (whitespace, encoding, casing);
  b. Data Table `If Row Exists` semantics with `alwaysOutputData`;
  c. field-type/string-comparison drift between stored and queried `idempotency_key`;
  d. Normalize node assumption issue;
  e. downstream nodes referencing dynamic upstream outputs by name (most likely).
- New-key send on 0198 is legitimate new-key behavior but **invalidates** D-0197-A as a duplicate-skip test.
- Same-key duplicate-skip validation still requires a fully pinned harness with `$json.*`-only downstream expressions.

### B. New operational policy: n8n template-first

The user explicitly changed project operating priority on 2026-05-14: **priority is TIME AND RESULTS**. Manual n8n node-by-node setup proved too slow and error-prone (D-0197-A failure). New rule:

- **n8n importable template first.** Whenever an n8n workflow or test is needed, the preferred deliverable is an importable JSON template plus a companion `.md` doc.
- **Manual node-by-node configuration is fallback**, used only when import is not feasible.
- Templates should be as **complete as possible** to reduce user clicks and manual friction.
- Templates may include node wiring, Telegram nodes, Data Table nodes, expressions, disabled/inactive Schedule Trigger (if useful at all), credential reference names or placeholders.
- Templates ship **inactive by default** (`active: false`).
- **Real secrets remain out of repo/chat:** no real Telegram bot token, no real password, no OAuth material, no real API keys, no exported credential secrets, no `token=` URLs.
- Credential names and chat_id are placeholders; real values are bound inside n8n only.

This policy is mirrored into `docs/ORCHESTRATOR_RULES.md`, `docs/AI_RULES.md`, and `docs/WORKFLOW.md` by task 0207.

## Done status

- Completed by: Claude Code (implementer)
- Completion commit: this batch
- Evidence:
  - Partial-pinning root cause: this file, sections A above; preserves and extends `0200-document-pinned-validation-failure-root-cause.md`.
  - Template-first policy: this file, section B; cross-referenced from `docs/ORCHESTRATOR_RULES.md`, `docs/AI_RULES.md`, `docs/WORKFLOW.md`, and the new template artifact `docs/automation/n8n-workflows/templates/telegram-fully-pinned-validation-harness.template.json` with companion `.md`.
- No runtime. No n8n UI. No Execute. No secrets committed.
