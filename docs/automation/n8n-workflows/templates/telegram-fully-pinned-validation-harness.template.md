# Template — Telegram Fully Pinned Validation Harness (TEST-only)

**Companion to:** `telegram-fully-pinned-validation-harness.template.json`
**Created by:** task 0205 (batch 0204–0208, 2026-05-14)
**Policy:** n8n template-first (priority time and results) — see `docs/ORCHESTRATOR_RULES.md` and `docs/AI_RULES.md`.
**Authorization prerequisite for import/inspection:** `D-0206-A = 1` in `docs/INBOX.md`.
**Authorization for any Execute:** NOT granted by this template. A separate future Decision Packet is required.

---

## 1. Purpose

Provide a **fully-pinned, importable n8n TEST-only workflow** that supersedes the partial-override approach (which failed in D-0197-A) and the slower manual node-by-node inspection path (D-0202-A, now superseded by D-0206-A).

The template enforces one absolute rule from `docs/automation/telegram-fully-pinned-validation-harness-design.md` section 2:

> No downstream node in the pinned test chain may contain any expression that references a dynamic upstream node by name.

All downstream nodes consume `$json.*` from the current item only.

---

## 2. Why template-first

Manual node-by-node UI work was empirically too slow and error-prone (D-0197-A failed because a Set override was inserted but downstream expressions still referenced upstream node outputs). Time and results take priority. An importable template:

- collapses many manual clicks into one Import action;
- removes per-node configuration drift;
- pre-wires the correct chain;
- ships inactive and TEST-only by default.

Manual node-by-node configuration is now the **fallback**, used only when import is not feasible.

---

## 3. Safety properties of this template

- `active: false` — workflow inactive on import.
- **Manual Trigger only.** No active Schedule Trigger.
- **No real secrets:** the Telegram credential reference is a placeholder string; the `chatId` is `REPLACE_WITH_CHAT_ID_PLACEHOLDER`.
- **No `token=` URL** anywhere.
- **Pinned values** are safe test references for task 0193 (already-public file path and SHA from the existing repo).
- **No dynamic upstream nodes:** removed `List done files`, `Pick latest done file`, `Get done file`, `Build idempotency key`, `Override pinned idempotency key`.
- **All expressions** in downstream nodes use `$json.*` or static literals only.

---

## 4. Workflow shape (post-import)

```
Manual Trigger
→ Static pinned input            (Set node — all pinned values originate here)
→ Load notification state        (Data Table lookup by $json.idempotency_key)
→ Normalize notification state   (Code node — $input/$json only)
→ Decide send or skip            (IF: $json.notification_state_decision === 'send')
  ├─ TRUE  → Build notification payload → Send a text message → Store notification state
  └─ FALSE → Duplicate skip (no-op)
```

---

## 5. Import instructions (only if D-0206-A = 1)

These steps assume `D-0206-A = 1`. Without that gate, do not import.

1. Open n8n UI on the local supervised instance.
2. Workflows → Import from File → select `telegram-fully-pinned-validation-harness.template.json`.
3. Confirm the imported workflow name is `TEST - Alina Telegram notifier FULLY PINNED HARNESS ONLY`.
4. Verify `active = false` (workflow toggle remains OFF).
5. Verify no Schedule Trigger exists or is enabled.
6. Open `Send a text message` node:
   - Replace `REPLACE_WITH_CHAT_ID_PLACEHOLDER` with the real chat id **inside n8n only** (never paste in repo/chat).
   - Bind the existing real Telegram credential (already configured in n8n) — do not create a new one with the placeholder name.
7. Open `Load notification state` and `Store notification state` nodes and confirm:
   - Data Table = `alina_telegram_notifier_state`.
   - Lookup column = `idempotency_key`.
   - Lookup value expression = `{{ $json.idempotency_key }}`.
8. Open every node from `Load notification state` onward and confirm that **no expression** references `$('Pick latest done file')`, `$('Get done file')`, `$('Build idempotency key')`, `$('Override pinned idempotency key')`, or any other dynamic upstream node by name. Only `$json.*` and static literals are allowed.
9. Stop. **Do not press Execute.** Report findings.

---

## 6. Fields to verify after import

| Node | Field | Expected |
|------|-------|----------|
| Workflow header | `active` | `false` |
| All triggers | type | `Manual Trigger` only |
| Static pinned input | `task_id` | `0193` |
| Static pinned input | `idempotency_key` | `docs/tasks/done/0193-create-duplicate-skip-retry-same-key-decision-packet.md::5d8b3a23c286ae0bc52c041ae789f4a02ee9754e` |
| Load notification state | Data Table | `alina_telegram_notifier_state` |
| Load notification state | filter column | `idempotency_key` |
| Load notification state | filter value | `{{ $json.idempotency_key }}` |
| Normalize notification state | references | `$input` / `$json` only |
| Decide send or skip | condition | `$json.notification_state_decision === 'send'` |
| Send a text message | credential | bound to existing Telegram credential (placeholder replaced) |
| Send a text message | chatId | real chat id (bound inside n8n only) |
| Store notification state | all columns | sourced from `$json.*` |

---

## 7. Success and failure criteria for a future run

A future Decision Packet (separate from D-0206-A) may authorize **exactly one Execute** of this imported workflow. When that happens:

**Success criteria (duplicate skip confirmed):**
- A Data Table row for `idempotency_key = docs/tasks/done/0193-create-duplicate-skip-retry-same-key-decision-packet.md::5d8b3a23c286ae0bc52c041ae789f4a02ee9754e` already exists pre-run.
- `Load notification state` returns the existing row fields (`id`, `notification_status`, `notified_at`).
- `Normalize notification state` sets `notification_state_decision = 'skip'`.
- `Decide send or skip` routes FALSE.
- `Build notification payload`, `Send a text message`, `Store notification state` do NOT execute.
- No Telegram message is sent.
- No new row is appended to `alina_telegram_notifier_state`.

**Failure criteria (any of):**
- `Load notification state` does not return existing row fields when a row exists.
- TRUE branch executes despite an existing row.
- Telegram message is sent.
- A new row is appended.
- Any downstream node references a dynamic upstream node by name.

---

## 8. Forbidden by this template (and by D-0206-A)

- Workflow Execute / run.
- Telegram send during import/inspection.
- Activating Schedule Trigger.
- Adding any real token, password, OAuth material, API key, or exported credential secret to the JSON.
- Pasting any `token=` URL into repo or chat.
- Pasting real chat_id into repo or chat.
- Modifying any other workflow during this gate.
- Modifying queue reader, done-failed, or other validated workflows.
- App Alina changes, deploy, tag, rollback.

---

## 9. n8n schema assumptions

This template is best-effort with respect to exact n8n node parameter shapes. Minor adjustments may be required after import depending on n8n version:

- The Data Table node type name (`n8n-nodes-base.dataTable`) and parameter names (`dataTableId`, `operation: getRows/appendRow`, `filters.conditions[]`) are conservative placeholders. If the local n8n version exposes different field names, adjust in the UI without changing the chain shape or the `$json.*`-only rule.
- The IF node uses a boolean condition with a string-evaluated expression; the equivalent in newer n8n versions may use a different conditions schema. The rule to preserve is: route TRUE when `notification_state_decision === 'send'`, FALSE otherwise.
- The Set node (`Static pinned input`) uses `values.string[]`. Newer n8n versions may use a `assignments` schema; the rule to preserve is: pinned values originate here and only here.
- The Telegram node credential reference name and `chatId` are placeholders; bind to the existing real credential inside n8n only.

Any post-import adjustment to match the local n8n version is permitted **as long as**:
- the chain shape and order are preserved;
- no dynamic upstream node references are introduced in downstream expressions;
- the workflow stays inactive;
- no Schedule Trigger is added;
- no real secret is committed to repo.

---

## 10. References

- Design: `docs/automation/telegram-fully-pinned-validation-harness-design.md`
- Root cause: `docs/tasks/done/0200-document-pinned-validation-failure-root-cause.md` and `docs/tasks/done/0204-document-n8n-template-first-policy-and-partial-pinning-root-cause.md`
- D-0197-A outcome: `docs/tasks/done/0199-record-d0197a-pinned-validation-not-successful.md`
- D-0202-A superseded by: `docs/tasks/done/0206-create-template-import-inspection-decision-packet.md`
- Pending gate: D-0206-A in `docs/INBOX.md`
- Policy: `docs/ORCHESTRATOR_RULES.md` (n8n template-first), `docs/AI_RULES.md` (implementer rule)
