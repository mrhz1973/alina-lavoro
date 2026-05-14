# INBOX — Human Decision Inbox

**Design:** `docs/automation/human-decision-inbox-design.md` (task 0129)
**Format:** `docs/automation/decision-packet-format.md` (task 0127)
**Created:** 2026-05-13 (task 0141)

---

## Purpose

INBOX contains **only real human decisions** that require a response.

**INBOX is NOT:**
- a status log
- a task completion feed
- a session automation archive
- a "all green" notification board

**INBOX IS:**
- the single place to find all pending decisions
- compatible with Decision Packet Format (13 canonical fields)
- readable immediately by ChatGPT (LLMS-first) and future n8n
- the archive of decided/deferred/superseded decisions

**INBOX does not bypass gates.** Writing a response here does NOT authorize:
- deploy, tag, rollback
- runtime changes (VPS, n8n, Ollama)
- app source modifications (`src/**`)
- API key creation or provider billing
- GitHub Actions
- physical tests on Alina's phone

Sensitive gates remain manual and require explicit separate authorization.

---

## Response Convention

Reply in chat or commit message using the short form:

| Form | Meaning |
|------|---------|
| `D-NNNN-X = 1` | Choose option 1 |
| `D-NNNN-X = 2` | Choose option 2 |
| `D-NNNN-X = defer` | Explicitly defer (move to Deferred) |
| `D-NNNN-X = skip` | No response (rare; signals disinterest) |
| `D-NNNN-X = retry` | Reformulate — options are insufficient |

ChatGPT records the response by moving the block from Pending to Decided and updating `response` and `decided_at`.

---

## Pending

### D-0217-A — Authorize Telegram Mode A Schedule Activation Readiness Inspection

**inbox_status:** pending
**created_at:** 2026-05-14
**source_task:** 0217-create-schedule-activation-readiness-inspection-decision-packet
**source_document:** docs/automation/telegram-mode-a-schedule-activation-design-first-path.md
**response:**
**decided_at:**
**archive_policy:** keep

---

**Decision ID:** D-0217-A
**Kind:** automation
**Data:** 2026-05-14

## Contesto

Following `D-0213-A = 3` (defer schedule activation; design safer path first, recorded in task 0215), the design-first path has been written in `docs/automation/telegram-mode-a-schedule-activation-design-first-path.md` (task 0216). Stage 2 of that path requires a controlled n8n UI **readiness inspection only** of the intended Telegram Mode A notifier workflow, **before** any schedule activation.

D-0217-A is that narrower gate. It authorizes only inspection. No Execute, no Schedule Trigger, no Telegram send, no workflow import/export.

## Perché serve decisione

Opening the Telegram notifier workflow in the n8n UI — even for inspection only — is a runtime / UI interaction. The user must explicitly authorize it and choose between proceeding now, staying manual-only, or further refining the design.

## Opzioni

1. **Authorize controlled n8n UI readiness inspection only.** Scope:
   - Open the intended Telegram Mode A notifier workflow.
   - Do not open or modify the queue reader workflow.
   - Confirm workflow name and purpose.
   - Confirm `active=false` before any action.
   - Confirm no Schedule Trigger is currently active.
   - Confirm idempotency / state-store nodes are present and wired.
   - Confirm Data Table target is `alina_telegram_notifier_state`.
   - Confirm Telegram node remains notification-only.
   - Confirm no automatic INBOX response logic exists.
   - Confirm D-0209-A duplicate-skip success is recorded in docs.
   - No Execute.
   - No Telegram send.
   - No Schedule Trigger.
   - No workflow import / export.
   - Stop and report findings.

2. **Keep Telegram notifier manual-only and skip readiness inspection for now.** No n8n UI action.

3. **Defer and refine the design further** before any n8n UI inspection.

## Raccomandazione orchestratore

Option 1 only if the user wants to continue toward schedule activation soon. Option 3 if the workflow identity or activation strategy is still unclear. Option 2 if automatic Telegram notifications are not needed now.

## Rischio principale

- Human may inspect or modify the wrong workflow.
- Inspection may accidentally become activation.
- Existing schedule state may be misunderstood.
- Telegram must remain notification-only and must not answer INBOX.

## Impatto

- App Alina: no impact.
- GitHub docs: this Decision Packet plus recording entries when decided.
- Runtime: Option 1 introduces a controlled inspection action only (no schedule, no Execute); Options 2 and 3 introduce no runtime.
- n8n: only the targeted Telegram notifier workflow is opened under Option 1; queue reader workflow untouched.
- INBOX: source of truth; Telegram must not answer it.
- Gate 7: no impact; remains closed.
- Provider API LLM: forbidden by default.
- Billing: no new billing.

## Micro-interazioni umane eliminate

If Option 1 succeeds, it confirms the conditions required for a future activation gate without committing to activation.

## Scelta richiesta

`D-0217-A = 1` per autorizzare un'inspection controllata in n8n UI del workflow Telegram Mode A target (solo lettura/conferma, niente Execute, niente Schedule).
`D-0217-A = 2` per mantenere il notifier manual-only e rinviare anche l'inspection.
`D-0217-A = 3` per rinviare e raffinare ulteriormente il design prima di qualunque azione in n8n UI.

## Cosa succede dopo la scelta

If `D-0217-A = 1`: a future supervised step-by-step user task performs the readiness inspection per the scope above and reports findings; no schedule activation; no Execute; no Telegram send.

If `D-0217-A = 2`: notifier remains manual-only; no n8n UI inspection now; a future Decision Packet may re-open the gate.

If `D-0217-A = 3`: the design is refined first; a future Decision Packet may then re-open the gate.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- Schedule Trigger activation;
- Execute of any workflow;
- Telegram send / test;
- workflow import / export;
- queue reader modification;
- provider API LLM;
- app / deploy / tag / rollback;
- token / chat id / secrets in repo / docs / chat;
- automatic INBOX response;
- automatic `D-NNNN-X = N` writing.

---

## Decided

### D-0213-A — Authorize Telegram Mode A Schedule Activation After Validated Duplicate-Skip (DECIDED)

**inbox_status:** decided
**created_at:** 2026-05-14
**source_task:** 0213-create-schedule-activation-decision-packet-after-validated-idempotency
**source_document:** docs/automation/telegram-idempotency-runtime-ui-handoff.md
**response:** 3
**decided_at:** 2026-05-14
**recorded_by_task:** 0215-record-d0213a-schedule-activation-design-first-decision
**result:** schedule activation deferred; design-first path opened (`docs/automation/telegram-mode-a-schedule-activation-design-first-path.md`, task 0216); next narrower gate `D-0217-A` (task 0217) created as Pending for controlled readiness inspection only
**archive_policy:** keep

---

**Decision ID:** D-0213-A
**Kind:** automation
**Data:** 2026-05-14

## Contesto

D-0209-A = 1 was selected and the user performed exactly one manual Execute run of the imported fully-pinned TEST-only n8n harness (`TEST - Alina Telegram notifier FULLY PINNED HARNESS ONLY`). `Load notification state` found the existing row, the run followed the duplicate-skip path, no Telegram message arrived, and `Store notification state` did not write a new row. Result: `fully pinned duplicate skip succeeded`. Duplicate-skip is now **conclusively validated** on the fully-pinned harness.

The validated principle is:

`same idempotency_key already present in alina_telegram_notifier_state => skip path, no Telegram, no new row.`

The original production-like Telegram notifier remains manual-only / inactive. Schedule activation was deliberately excluded from D-0209-A. D-0213-A is the next valid gate for schedule activation of Telegram Mode A.

## Perché serve decisione

Adding or enabling a Schedule Trigger on a Telegram notifier workflow introduces automatic recurring runtime behavior. This is a runtime gate and must be explicitly authorized by the user.

## Opzioni

1. **Authorize a controlled schedule activation implementation gate for Telegram Mode A.** Scope:
   - Open the relevant Telegram notifier workflow in n8n.
   - Keep the queue reader workflow untouched.
   - Confirm idempotency / state-store path exists in the targeted Telegram notifier workflow.
   - Confirm the D-0209-A duplicate-skip validation result is recorded.
   - Add or enable a Schedule Trigger only in the intended Telegram notifier workflow.
   - Choose a conservative interval, preferably aligned with existing low-touch cadence unless docs specify otherwise.
   - Keep Telegram Mode A as **notification-only**.
   - Telegram must NOT answer INBOX.
   - Observe the first scheduled tick manually.
   - Stop and report.

2. **Keep Telegram notifier manual-only for now.** No Schedule Trigger; continue using Manual Trigger only.

3. **Defer and design a safer schedule activation template/import path** before any schedule activation, consistent with the n8n template-first policy.

## Raccomandazione orchestratore

Option 3 if schedule activation still requires more template-first design. Option 1 only if the existing workflow is clear, the idempotency path is present, and the user wants immediate schedule activation.

## Rischio principale

- Duplicate notifications if the wrong workflow is scheduled or the idempotency path is bypassed.
- Schedule running silently if the first tick is not observed.
- Wrong workflow activation (e.g. activating the harness instead of the production-like notifier).
- Telegram must remain notification-only and must not answer INBOX.

## Impatto

- App Alina: no impact.
- GitHub docs: this Decision Packet plus the recording entries.
- Runtime: depends on the chosen option; Option 1 introduces a recurring schedule under supervision; Options 2 and 3 introduce no runtime.
- n8n: only the targeted Telegram notifier workflow is touched under Option 1; queue reader workflow untouched.
- INBOX: source of truth; Telegram must not answer it.
- Gate 7: no impact; remains closed.
- Provider API LLM: forbidden by default.
- Billing: no new billing.

## Micro-interazioni umane eliminate

If Option 1 is later authorized and executed safely, automatic Telegram notifications reduce the manual checking burden after task completion.

## Scelta richiesta

`D-0213-A = 1` per autorizzare un gate controllato di attivazione Schedule Trigger per Telegram Mode A (notification-only).
`D-0213-A = 2` per mantenere il notifier manual-only per ora.
`D-0213-A = 3` per rinviare e progettare un percorso template-first più sicuro per l'attivazione schedule.

## Cosa succede dopo la scelta

If `D-0213-A = 1`: a future supervised step-by-step user task adds or enables the Schedule Trigger on the intended Telegram notifier workflow with a conservative interval; the first tick is observed manually; report follows.

If `D-0213-A = 2`: notifier remains manual-only; no Schedule Trigger; future schedule activation requires a new gate.

If `D-0213-A = 3`: a template-first schedule activation design is produced before any runtime; a future Decision Packet may then re-open the gate.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- Schedule Trigger activation until D-0213-A is explicitly decided;
- automatic INBOX response;
- queue reader modification unless explicitly scoped in a future gate;
- provider API LLM;
- app / deploy / tag / rollback;
- a second duplicate-skip validation run;
- workflow export with secrets;
- token / chat id in repo / docs / chat;
- automatic notifications outside the Telegram notification-only scope;
- automatic `D-NNNN-X = N` writing.

---

### D-0209-A — Authorize one Execute run of imported fully-pinned n8n harness

**inbox_status:** decided
**created_at:** 2026-05-14
**source_task:** 0209-create-fully-pinned-harness-execute-decision-packet
**source_document:** docs/automation/n8n-workflows/templates/telegram-fully-pinned-validation-harness.template.md
**response:** 1
**decided_at:** 2026-05-14
**result:** fully pinned duplicate skip succeeded
**recorded_by_task:** 0211-record-d0209a-fully-pinned-duplicate-skip-success
**archive_policy:** keep

---

**Decision ID:** D-0209-A
**Kind:** automation
**Data:** 2026-05-14

## Decision outcome

The user selected `D-0209-A = 1` and performed exactly one manual Execute run of the imported fully-pinned TEST-only n8n harness (`TEST - Alina Telegram notifier FULLY PINNED HARNESS ONLY`). `Load notification state` found the existing row, the run followed the duplicate-skip path, no Telegram message arrived, and `Store notification state` did not write a new row. Recorded in task 0211 as **fully pinned duplicate skip succeeded**.

Duplicate-skip is now **conclusively validated** on the fully-pinned harness. The validated principle: `same idempotency_key already present in alina_telegram_notifier_state => skip path, no Telegram, no new row.`

The next valid gate for any schedule activation is D-0213-A (created in task 0213, currently Pending).

## Original Decision Packet (preserved for audit)

---

**Decision ID:** D-0209-A
**Kind:** automation
**Data:** 2026-05-14

## Contesto

D-0206-A = 1 was selected and the user reported `import/inspection ok` (task 0208). The fully-pinned TEST-only n8n harness was imported into the supervised n8n UI as workflow `TEST - Alina Telegram notifier FULLY PINNED HARNESS ONLY`. The workflow is currently inactive (`active = false`), uses a Manual Trigger only, has no Schedule Trigger, uses pinned static input for `task_id = 0193` and `idempotency_key = docs/tasks/done/0193-create-duplicate-skip-retry-same-key-decision-packet.md::5d8b3a23c286ae0bc52c041ae789f4a02ee9754e`, and all downstream nodes consume `$json.*` only.

D-0206-A did not authorize Execute. Execute is a separate gate. This Decision Packet is that gate.

The duplicate-skip behavior remains NOT conclusively validated. The fully-pinned harness was built precisely to remove the partial-pinning / dynamic-reference leakage failure mode observed under D-0197-A. One controlled Execute run is the next valid validation step.

## Perché serve decisione

Executing a workflow that contains a real Telegram credential reference and a real chat id (bound inside n8n only) can cause a Telegram message to be sent if the duplicate-skip logic does not route FALSE. Running the workflow is a runtime gate and must be explicitly authorized by the user.

## Opzioni

1. **Authorize exactly one manual Execute run of the imported TEST-only fully-pinned harness.** Scope:
   - Open workflow: `TEST - Alina Telegram notifier FULLY PINNED HARNESS ONLY`.
   - Confirm `active = false` (workflow remains inactive even during Execute).
   - Confirm no Schedule Trigger is active.
   - Confirm the pinned static input still uses:
     - `task_id` = `0193`
     - `idempotency_key` = `docs/tasks/done/0193-create-duplicate-skip-retry-same-key-decision-packet.md::5d8b3a23c286ae0bc52c041ae789f4a02ee9754e`
   - Confirm a Data Table row in `alina_telegram_notifier_state` for this idempotency_key exists pre-run (if visible in UI).
   - Execute the workflow exactly once.
   - Stop immediately after one run.
   - Report either `fully pinned duplicate skip succeeded` or `fully pinned duplicate skip failed`.

2. **Do not execute now.** Keep the imported harness inactive and continue docs/design only.

3. **Defer and refine the imported template/harness** before any Execute.

## Raccomandazione orchestratore

Option 1, because import/inspection has completed and the next validation step is exactly one controlled Execute run.

## Rischio principale

The main risk is that a Telegram message is sent if the Data Table lookup still fails or the TRUE branch runs. If Telegram arrives: stop, do not retry, record failure. A secondary risk is n8n credential or chat id binding errors causing a runtime exception; report and stop without retry.

## Impatto

- App Alina: no impact.
- GitHub docs: this Decision Packet plus the recording entries.
- Runtime: exactly one Execute run authorized; no schedule activation.
- n8n: only the imported TEST-only harness is executed; existing validated workflows untouched.
- INBOX: source of truth; Telegram must not answer it.
- Gate 7: no impact; remains closed.
- Provider API LLM: forbidden by default.
- Billing: no new billing.

## Micro-interazioni umane eliminate

If Option 1 succeeds, the duplicate-skip behavior is conclusively validated, which unblocks the future schedule-activation gate. Success therefore reduces future micro-interactions by enabling automated duplicate handling once schedule activation is later authorized by a separate gate.

## Scelta richiesta

`D-0209-A = 1` per autorizzare un singolo Execute manuale dell'harness fully-pinned già importato.
`D-0209-A = 2` per non eseguire ora; mantenere l'harness inattivo e proseguire solo con docs/design.
`D-0209-A = 3` per rinviare e raffinare ulteriormente il template/harness importato prima di qualsiasi Execute.

## Cosa succede dopo la scelta

Expected success criteria for Option 1:

- `Load notification state` finds the existing row.
- `Normalize notification state` sets `notification_state_decision = skip`.
- `Decide send or skip` routes FALSE.
- `Build notification payload` does NOT execute.
- `Send a text message` does NOT execute.
- `Store notification state` does NOT execute.
- No Telegram message arrives.
- No new Data Table row is created.

If `D-0209-A = 1` and the run matches the success criteria above, duplicate-skip is recorded as conclusively validated. If the run fails any criterion (especially if Telegram arrives or a new Data Table row is written), the result is recorded as failure; no retry is performed under this Decision Packet.

If `D-0209-A = 2`, the harness remains inactive and no Execute occurs. Duplicate-skip remains NOT validated.

If `D-0209-A = 3`, the template/harness is refined before any Execute and a future Decision Packet re-opens the Execute gate.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- A second Execute run;
- Schedule Trigger activation (even on success);
- Automatic notifications;
- Modification of the original idempotency workflow;
- Queue reader workflow modification;
- Workflow JSON export from n8n;
- Token or chat id in repo/docs/AI chat;
- Provider API LLM;
- New billing;
- App/deploy/tag/rollback/merge;
- Browser Bridge runtime;
- Ollama runtime;
- Cursor CLI/headless;
- Automatic INBOX responses;
- Automatic `D-NNNN-X = N` writing.

---

## Superseded

### D-0202-A — Authorize controlled fully-pinned harness inspection and repair (SUPERSEDED)

**inbox_status:** superseded
**created_at:** 2026-05-14
**source_task:** 0202-create-fully-pinned-harness-repair-decision-packet
**source_document:** docs/automation/telegram-fully-pinned-validation-harness-design.md
**response:** superseded
**decided_at:** 2026-05-14
**superseded_by:** D-0206-A
**archive_policy:** keep

**Supersession reason:** Batch 0204–0208 adopted the n8n template-first policy (priority: time and results). Inspecting and repairing the existing duplicate TEST-only workflow in n8n UI is slower than importing a clean fully-pinned template, and carries the risk of reintroducing dynamic-reference leakage during manual node-by-node edits. The template-first deliverable (task 0205) provides an importable artifact that collapses the manual chain into a single Import action. D-0206-A replaces this gate.

No runtime action was taken under D-0202-A. The original inspection/repair scope is preserved for audit below.

---

**Decision ID:** D-0202-A
**Kind:** automation
**Data:** 2026-05-14

## Contesto

D-0197-A = 1 authorized one pinned-file duplicate-skip validation run. The user executed the duplicate TEST-only workflow `TEST - Alina Telegram notifier PINNED VALIDATION ONLY` with an override node (`Override pinned idempotency key`) that correctly output pinned values for task 0193. However, the run routed TRUE / sent Telegram / wrote a new Data Table row for task 0198 (not 0193). `Load notification state` did not return the existing 0193 row fields.

Root cause hypothesis (task 0200): the partial override approach is insufficient because downstream nodes still reference dynamic upstream node outputs by name instead of `$json.*` current item fields. The override changes current item data but does not change the stored output of previously executed nodes.

Task 0201 creates a fully-pinned harness design (`docs/automation/telegram-fully-pinned-validation-harness-design.md`) that removes all dynamic upstream nodes and requires all downstream nodes to use `$json.*` only.

The next safe step is **inspection and repair** of the TEST-only workflow expressions — not another Execute run.

## Perché serve decisione

Inspection and repair of the TEST-only workflow requires opening n8n UI and modifying node expressions. Per project policy, any n8n UI action requires an explicit human gate — even when no Execute is involved.

## Opzioni

1. **Authorize controlled n8n UI inspection and repair of the duplicate TEST-only pinned workflow, with no Execute run.** Scope:
   - Inspect node expressions in `Load notification state`, `Normalize notification state`, `Decide send or skip`, `Build notification payload`, `Send a text message`, `Store notification state`.
   - Ensure the pinned harness uses only `$json.*` current item fields.
   - Remove or bypass dynamic upstream references (`List done files`, `Pick latest done file`, `Get done file`, `Build idempotency key`, `Override pinned idempotency key`).
   - Replace with a single `Static pinned input` node per the fully-pinned harness design.
   - Keep workflow inactive/manual-only.
   - No Telegram run.
   - No Schedule Trigger.
   - No workflow JSON export/import.
   - No token/chat id in docs or chat.
   - Stop before any Execute.
   - Report findings (which expressions were changed, which were already correct).

2. **Do not repair now.** Keep Telegram notifier manual-only and continue docs/design only. Duplicate-skip remains not conclusively validated. Schedule activation remains separately gated.

3. **Defer and refine the fully-pinned harness design further.** No n8n UI action. Refine the design before opening the inspection/repair gate.

## Raccomandazione orchestratore

Option 1. The next safe step is NOT another run. It is only inspection/repair of the TEST-only pinned harness without execution. After inspection/repair, a separate future Decision Packet will be needed to authorize one Execute run.

## Rischio principale

The main risk is that inspection morphs into an Execute run. This Decision Packet explicitly prohibits Execute. The operator must stop before pressing Execute. A secondary risk is that the expression audit reveals complex references that cannot be safely rewritten — in that case, stop and report.

## Impatto

- App Alina: no impact.
- GitHub docs: this Decision Packet only.
- Runtime: no Execute run authorized by this packet. Inspection/repair only.
- n8n: node expression changes in TEST-only duplicate workflow only; original workflow untouched.
- INBOX: source of truth; Telegram must not answer it.
- Gate 7: no impact; remains closed.
- Provider API LLM: forbidden by default.
- Billing: no new billing.

## Micro-interazioni umane eliminate

0 immediately. Successful inspection/repair unblocks a future Execute gate, which if successful unblocks the schedule-activation gate (both separate, future).

## Scelta richiesta

`D-0202-A = 1` per autorizzare inspection/repair controllato del test workflow pinned (senza Execute).
`D-0202-A = 2` per non riparare ora; il notifier resta manual-only.
`D-0202-A = 3` per rinviare e raffinare ulteriormente il design.

## Cosa succede dopo la scelta

If `D-0202-A = 1`: the user may open the duplicate TEST-only workflow in n8n UI, inspect and repair expressions per `docs/automation/telegram-fully-pinned-validation-harness-design.md`, and report findings. No Execute is authorized. A separate future Decision Packet is required for one Execute run.

If `D-0202-A = 2`: no n8n UI action is authorized. Duplicate-skip remains not validated. Schedule activation remains separately gated.

If `D-0202-A = 3`: design is refined first. A future Decision Packet may then re-open the gate.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- Execute run;
- Telegram message send;
- Schedule Trigger activation;
- Automatic notifications;
- Queue reader workflow modification;
- Workflow JSON export/import;
- Token or chat id in repo/docs/AI chat;
- Provider API LLM;
- New billing;
- App/deploy/tag/rollback/merge;
- Browser Bridge runtime;
- Ollama runtime;
- Cursor CLI/headless;
- Automatic INBOX responses;
- Automatic `D-NNNN-X = N` writing.

---

## Decided

### D-0206-A — Authorize import and inspection of fully-pinned n8n harness template

**inbox_status:** decided
**created_at:** 2026-05-14
**source_task:** 0206-create-template-import-inspection-decision-packet
**source_document:** docs/automation/n8n-workflows/templates/telegram-fully-pinned-validation-harness.template.md
**response:** 1
**decided_at:** 2026-05-14
**result:** import/inspection ok (user report)
**recorded_by_task:** 0208-record-d0206a-import-inspection-ok
**archive_policy:** keep

---

**Decision ID:** D-0206-A
**Kind:** automation
**Data:** 2026-05-14

## Decision outcome

The user selected `D-0206-A = 1` and reported `import/inspection ok` (recorded in task 0208). The fully-pinned TEST-only n8n template was imported into the supervised n8n UI as workflow `TEST - Alina Telegram notifier FULLY PINNED HARNESS ONLY`. Inspection completed successfully by user report. No Execute was performed under this packet. No Telegram message was sent. No Schedule Trigger was activated. No new Data Table row was written by this gate.

The next valid gate for any Execute run is D-0209-A (created in task 0209, currently Pending).

## Original Decision Packet (preserved for audit)

## Contesto

Batch 0204–0208 adopted the **n8n template-first policy** (priority: time and results). Task 0205 produced an importable fully-pinned TEST-only n8n template at `docs/automation/n8n-workflows/templates/telegram-fully-pinned-validation-harness.template.json` with a companion `.md`. The template enforces the rule from `docs/automation/telegram-fully-pinned-validation-harness-design.md` section 2: no downstream node may reference any dynamic upstream node by name; only `$json.*` and static literals.

D-0202-A (controlled inspection/repair of the existing duplicate workflow) is **superseded** by this gate: importing a clean fully-pinned template is faster and removes the risk of reintroducing dynamic-reference leakage during manual edits.

## Perché serve decisione

Importing a workflow into n8n UI is a runtime/UI gate even when no Execute is performed.

## Opzioni (original)

1. Authorize import and inspection of the fully-pinned TEST-only n8n harness template, with no Execute run.
2. Do not import now. Keep Telegram notifier manual-only and continue docs/design only.
3. Defer and refine template/design further before opening the import gate.

## Raccomandazione orchestratore (original)

Option 1.

## Cosa NON è stato autorizzato da D-0206-A

- Execute run;
- Telegram message send;
- Schedule Trigger activation;
- Automatic notifications;
- Queue reader workflow modification;
- Workflow JSON export from n8n;
- Token or chat id in repo/docs/AI chat;
- Provider API LLM;
- New billing;
- App/deploy/tag/rollback/merge;
- Browser Bridge runtime;
- Ollama runtime;
- Cursor CLI/headless;
- Automatic INBOX responses;
- Automatic `D-NNNN-X = N` writing.

---

### D-0197-A — Authorize one pinned-file duplicate-skip validation run

**inbox_status:** decided
**created_at:** 2026-05-14
**source_task:** 0197-create-pinned-duplicate-skip-validation-decision-packet
**source_document:** docs/automation/telegram-pinned-file-duplicate-skip-validation-design.md
**response:** 1
**decided_at:** 2026-05-14
**archive_policy:** keep

---

**Decision ID:** D-0197-A
**Kind:** automation
**Data:** 2026-05-14

## Contesto

D-0187-A and D-0193-A both resulted in inconclusive outcomes due to latest-done drift (dynamic file picker). D-0197-A authorized one pinned-file validation run using a duplicate TEST-only workflow with a partial override node.

## Decision outcome

Recorded by batch 0199–0203 on 2026-05-14: response `D-0197-A = 1`.

**Runtime attempt result: NOT SUCCESSFUL / inconclusive due to partial pinning and downstream dynamic reference leakage.**

User executed exactly one manual run of `TEST - Alina Telegram notifier PINNED VALIDATION ONLY`. The `Override pinned idempotency key` node correctly output pinned values for task 0193. However:
- `Load notification state` output did not contain existing 0193 row fields (only pinned input fields).
- `Decide send or skip` routed **TRUE**.
- `Build notification payload`, `Send a text message`, `Store notification state` all executed.
- Telegram message arrived.
- New Data Table row written for task **0198** (not 0193), proving downstream nodes used dynamic values, not pinned ones.

**Classification:** not successful / inconclusive due to partial pinning and downstream dynamic reference leakage. NOT classified as confirmed pure idempotency bug — the harness failure (partial pinning) prevents drawing conclusions about the idempotency logic itself.

**D-0197-A is consumed.** No further runtime is authorized under D-0197-A.

**Next gate:** D-0202-A (controlled fully-pinned harness inspection/repair without Execute), pending in the section above.

**Scope NOT authorized by D-0197-A = 1:**
- Second run
- Schedule Trigger activation
- Automatic notifications
- Queue reader modification
- Workflow JSON export/import
- Token/chat id in repo/docs/AI chat
- Provider API LLM
- New billing
- App/deploy/tag/rollback
- Automatic INBOX responses

---

### D-0193-A — Authorize one duplicate-skip retry against the same 0190 idempotency key

**inbox_status:** decided
**created_at:** 2026-05-14
**source_task:** 0193-create-duplicate-skip-retry-same-key-decision-packet
**source_document:** docs/tasks/done/0191-record-duplicate-skip-validation-inconclusive-due-to-new-latest-done-file.md
**response:** 1
**decided_at:** 2026-05-14
**archive_policy:** keep

---

**Decision ID:** D-0193-A
**Kind:** automation
**Data:** 2026-05-14

## Contesto

D-0187-A = 1 authorized exactly one duplicate-skip validation run; the run was inconclusive (recorded in task 0191 due to latest-done drift). D-0193-A was created to authorize a retry against the same 0190 idempotency key. The user gave a prior conditional order: if batch 0191–0193 was correct, apply D-0193-A = 1 directly. ChatGPT verified the condition on GitHub via LLMS-first routing and applied D-0193-A = 1.

## Decision outcome

Recorded by batch 0194–0198 on 2026-05-14: response `D-0193-A = 1`, applied per the user's conditional order.

**Runtime attempt result: INCONCLUSIVE (likely new-key send due to latest-done drift).**

User executed exactly one manual run of `TEST - Alina task completion Telegram notifier`. Screenshot evidence and user report ("è arrivato il messaggio") show:
- Manual Trigger executed
- List done files / Pick latest done file / Get done file executed
- Build idempotency key / Load notification state / Normalize notification state executed
- Decide send or skip routed **TRUE**
- Build notification payload / Send a text message / Store notification state executed
- Telegram message arrived

Because docs-only batch 0191–0193 added new done files after the original 0190 idempotency key was stored, `Pick latest done file` most likely selected a newer file than 0190, generating a new key. A TRUE branch on a new key is correct new-key behavior (category (b) in task 0195), **not** a confirmed idempotency bug (category (c)).

**Classification:** inconclusive / likely new-key send due to latest-done drift.

**D-0193-A is consumed.** No further runtime is authorized under D-0193-A.

**Next gate:** D-0197-A (pinned-file duplicate-skip validation), pending in the section above.

**Scope NOT authorized by D-0193-A = 1:**
- Second retry run
- Schedule Trigger activation
- Automatic notifications
- Queue reader modification
- Workflow JSON export/import
- Token/chat id in repo/docs/AI chat
- Provider API LLM
- New billing
- App/deploy/tag/rollback
- Automatic INBOX responses
- Automatic `D-NNNN-X = N` writing

---

### D-0187-A — Authorize one duplicate-skip validation run for Telegram idempotency

**inbox_status:** decided
**created_at:** 2026-05-14
**source_task:** 0187-create-duplicate-skip-validation-decision-packet
**source_document:** docs/automation/telegram-notifier-idempotency-implementation-checklist.md
**response:** 1
**decided_at:** 2026-05-14
**archive_policy:** keep

---

**Decision ID:** D-0187-A
**Kind:** automation
**Data:** 2026-05-14

## Contesto

D-0180-A = 1 opened the idempotency/state-store runtime gate (task 0182, 2026-05-13). The user implemented the Data Table path in n8n (task 0185, 2026-05-14): Data Table `alina_telegram_notifier_state` created; idempotency nodes added; IF condition corrected to `{{ $json.notification_state_decision === "send" }}`; `Store notification state` wired post-send only. One manual send/write test succeeded by user report: one Telegram message arrived, one row was written to the Data Table. The workflow remains inactive/manual-only. No Schedule Trigger is active.

## Decision outcome

Recorded by batch 0188–0190 on 2026-05-14: user response `D-0187-A = 1`.

User selected D-0187-A = 1. Exactly one future duplicate-skip validation run is authorized.

**Expected result:**
- `Decide send or skip` routes false branch (duplicate detected)
- No Telegram message is sent
- No new row is inserted into `alina_telegram_notifier_state`
- Workflow remains inactive/manual-only
- No Schedule Trigger is activated

**Stop condition:** If a duplicate Telegram message is sent, stop immediately, document failure, and do not proceed.

**Scope authorized by D-0187-A = 1:**
- One manual Execute workflow only
- Expected duplicate detection for same latest done file
- Expected false branch routing
- Expected no Telegram message
- Expected no new Data Table row

**Scope not authorized:**
- Second validation run
- Schedule Trigger activation
- Automatic notifications
- Queue reader modification
- Workflow JSON export/import
- Token/chat id in repo/docs/AI chat
- Provider API LLM
- New billing
- App/deploy/tag/rollback
- Automatic INBOX responses
- Automatic `D-NNNN-X = N` writing

**Next runtime micro-step:** Perform exactly one duplicate-skip validation run. Open n8n workflow `TEST - Alina task completion Telegram notifier`, confirm inactive/manual-only, confirm no Schedule Trigger, Execute workflow once, observe: IF branch false, no Telegram message, no Store notification state execution. Stop and report `duplicate skip riuscito` or `duplicate skip errore`.

**Schedule activation:** Remains a separate future gate after duplicate-skip validation succeeds.

---

### D-0180-A — Open Telegram notifier idempotency/state-store runtime implementation gate

**inbox_status:** decided
**created_at:** 2026-05-13
**source_task:** 0180-create-idempotency-runtime-implementation-decision-packet
**source_document:** docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md
**response:** 1
**decided_at:** 2026-05-13
**archive_policy:** keep

---

**Decision ID:** D-0180-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

Telegram Mode A manual test succeeded (task 0170). D-0173-A = 3 (task 0177, 2026-05-13) deferred schedule activation and required an intermediate idempotency/state-store implementation task first. The idempotency/state-store implementation design now exists (`docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md`, task 0178). The implementation checklist now exists (`docs/automation/telegram-notifier-idempotency-implementation-checklist.md`, task 0179). Workflow `TEST - Alina task completion Telegram notifier` remains inactive. No Schedule Trigger is active. No token or chat id in repo.

## Perché serve decisione

Implementing idempotency and state-store logic modifies the n8n runtime workflow. Any n8n runtime change requires an explicit human gate per project policy. The design and checklist exist, but no implementation may begin without an explicit gate decision.

## Opzioni

1. **Open idempotency/state-store implementation gate only** — authorize future step-by-step user-supervised n8n UI implementation of idempotency key computation, state-store lookup, send/skip branch, and state-write-on-success logic per the design and checklist. No Schedule Trigger. No automatic notifications. No repeated Telegram test unless separately gated.
2. **Keep design-only for now** — no runtime implementation; idempotency design and checklist remain docs-only; no n8n workflow modification.
3. **Defer and refine design/checklist further** — no runtime; return to this gate after additional design work or clarification.

## Raccomandazione orchestratore

Option 1, as a narrow runtime gate for idempotency/state-store and duplicate-skip logic only. Schedule remains a separate gate after idempotency is validated.

## Rischio principale

Scope creep from idempotency implementation toward schedule activation or repeated Telegram messages without separate gates. The implementation must remain single-step and user-supervised, targeting only the state-store/duplicate-skip logic.

## Impatto

- App Alina: no impact.
- GitHub docs: this task records the decision only.
- Runtime: no runtime performed by this task; idempotency implementation is a future manual user step.
- n8n: no workflow modification by this task.
- INBOX: remains source of truth; Telegram must not answer it.
- Gate 7: no impact; remains closed.
- Provider API LLM: no impact; still forbidden by default.
- Billing: no new LLM billing.

## Micro-interazioni umane eliminate

0 immediately. After idempotency is implemented and validated, a future schedule activation gate may enable automatic notifications that reduce manual checking burden.

## Scelta richiesta

`D-0180-A = 1` per aprire il gate implementazione idempotency/state-store (solo n8n UI, senza Schedule Trigger).
`D-0180-A = 2` per mantenere tutto docs-only; nessuna implementazione runtime.
`D-0180-A = 3` per rimandare e affinare ulteriormente il design.

## Cosa succede dopo la scelta

If `D-0180-A = 1`: future supervised step-by-step n8n UI task implements idempotency key computation, state-store lookup, send/skip branch, state-write-on-success. Workflow remains manual-trigger only. No Schedule Trigger.
If `D-0180-A = 2`: idempotency design and checklist remain docs-only. Schedule activation gate remains separate.
If `D-0180-A = 3`: return after additional design refinement.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- Schedule Trigger activation;
- automatic notifications;
- queue reader workflow modification;
- workflow JSON export/import with secrets;
- token or chat id in repo/docs/AI chat;
- provider API LLM;
- new billing;
- app/deploy/tag/rollback;
- automatic INBOX responses;
- automatic `D-NNNN-X = N` writing.

If option 1 is chosen, the scope is limited to:
- idempotency key computation node;
- state-store lookup node;
- send/skip IF branch;
- state-write node (post-send only);
- fail-closed paths;
- workflow kept inactive (no Schedule Trigger).

## Decision outcome

Recorded by task 0182 on 2026-05-13: user response `D-0180-A = 1`.

User selected D-0180-A = 1. The idempotency/state-store runtime implementation gate is open. Scope is limited to idempotency/state-store and duplicate-skip logic only.

**Scope authorized by D-0180-A = 1:**
- idempotency key computation node in n8n;
- state-store lookup node (Data Store first choice, static data fallback);
- send/skip IF branch;
- state-write node (post-send only, after successful Telegram send);
- fail-closed paths for all error conditions;
- workflow kept inactive (manual-trigger only, no Schedule Trigger).

**Scope forbidden (no change from prior state):**
- No Schedule Trigger activation.
- No automatic notifications.
- No queue reader workflow modification.
- No workflow JSON export/import with secrets.
- No token or chat id in repo/docs/AI chat.
- No provider API LLM.
- No new billing.
- No app/deploy/tag/rollback.
- No automatic INBOX responses.
- No automatic `D-NNNN-X = N` writing.
- No runtime performed by this docs-only task.
- Runtime implementation must happen later, one n8n UI step at a time, under ChatGPT supervision.
- Schedule activation remains a separate gate after idempotency implementation and validation.

**Next runtime micro-step:** open `TEST - Alina task completion Telegram notifier`, confirm inactive/no Schedule Trigger, inspect whether Data Store/Data Table node is available, then stop and report. Do not add nodes yet.

---

**Decision ID:** D-0173-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

Task 0170 recorded that one manual Telegram test message arrived successfully by user report. D-0171-A = 3 (task 0171) deferred schedule activation pending hardening. Task 0172 created the runbook and idempotency hardening documentation (`docs/automation/telegram-notifier-runbook-idempotency-hardening.md`). Workflow `TEST - Alina task completion Telegram notifier` exists by user report but is inactive. No Schedule Trigger is active.

## Perché serve decisione

Schedule activation introduces automatic recurring runtime behavior. The workflow can send duplicate notifications unless idempotency state-store logic is implemented and validated first. This is a new runtime gate requiring explicit human decision.

## Opzioni

1. **Open a narrow schedule activation implementation gate** — authorize a future step-by-step user-supervised implementation of idempotency state-store in n8n, followed by Schedule Trigger activation. Only after state-store/idempotency path is explicitly present and validated.
2. **Keep Telegram notifier manual-only** — no Schedule Trigger; continue using Manual Trigger only when the user wants a notification; no further implementation.
3. **Defer schedule activation and add an intermediate idempotency implementation task first** — do not activate schedule now; create a separate task to implement the idempotency/state-store path in n8n before returning to this gate.

## Raccomandazione orchestratore

Option 3 if the idempotency state-store is not yet implemented in n8n.
Option 1 only after the state-store/idempotency path is explicitly present, implemented, and validated in n8n.

## Rischio principale

Sending duplicate Telegram notifications if the schedule is activated before idempotency logic exists. Also: schedule running silently without user awareness after initial activation.

## Impatto

- App Alina: no impact.
- GitHub docs: this task records the decision only.
- Runtime: no runtime performed by this task; schedule activation is a future manual user step.
- n8n: no workflow modification by this task.
- INBOX: remains source of truth; Telegram must not answer it.
- Gate 7: no impact; remains closed.
- Provider API LLM: no impact; still forbidden by default.
- Billing: no new LLM billing.

## Micro-interazioni umane eliminate

0 immediately. After schedule activation with idempotency, Telegram Mode A may reduce manual checking burden by notifying the user automatically when a task is done.

## Scelta richiesta

`D-0173-A = 1` per aprire il gate di implementazione schedule (solo dopo idempotency/state-store validato).
`D-0173-A = 2` per mantenere il notifier solo manuale.
`D-0173-A = 3` per rimandare e creare prima un task di implementazione idempotency.

## Cosa succede dopo la scelta

If `D-0173-A = 1`: a future supervised step-by-step n8n UI task may implement the state-store and enable the Schedule Trigger. Must observe first scheduled run manually.
If `D-0173-A = 2`: Telegram notifier remains manual-trigger only. No schedule implementation.
If `D-0173-A = 3`: a new task is created to implement idempotency/state-store first; this gate returns after that task is complete.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- sending duplicate Telegram messages;
- activating Schedule Trigger without idempotency/state-store in place;
- modifying the existing queue reader workflow;
- answering INBOX;
- writing any `D-NNNN-X = N` response;
- workflow JSON export/import with secrets;
- token or chat id in repo;
- provider API LLM;
- new billing;
- app/deploy/tag/rollback;
- automatic INBOX responses;
- automatic `D-NNNN-X = N` writing.

---

### D-0173-A — Authorize Telegram notifier schedule activation after hardening

**inbox_status:** decided
**created_at:** 2026-05-13
**source_task:** 0173-create-telegram-schedule-activation-decision-packet
**source_document:** docs/automation/telegram-notifier-runbook-idempotency-hardening.md
**response:** 3
**decided_at:** 2026-05-13
**archive_policy:** keep

---

**Decision ID:** D-0173-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

Task 0170 recorded that one manual Telegram test message arrived successfully by user report. D-0171-A = 3 (task 0171) deferred schedule activation pending hardening. Task 0172 created the runbook and idempotency hardening documentation (`docs/automation/telegram-notifier-runbook-idempotency-hardening.md`). Workflow `TEST - Alina task completion Telegram notifier` exists by user report but is inactive. No Schedule Trigger is active.

## Perché serve decisione

Schedule activation introduces automatic recurring runtime behavior. The workflow can send duplicate notifications unless idempotency state-store logic is implemented and validated first. This is a new runtime gate requiring explicit human decision.

## Opzioni

1. Open a narrow schedule activation implementation gate — authorize a future step-by-step user-supervised implementation of idempotency state-store in n8n, followed by Schedule Trigger activation.
2. Keep Telegram notifier manual-only — no Schedule Trigger; continue using Manual Trigger only when the user wants a notification.
3. Defer schedule activation and add an intermediate idempotency implementation task first — do not activate schedule now; create a separate task to implement the idempotency/state-store path in n8n before returning to this gate.

## Decision outcome

Recorded by task 0177 on 2026-05-13: user response `D-0173-A = 3`.

User selected D-0173-A = 3. Schedule activation is deferred. An intermediate idempotency/state-store implementation path must be designed and gated first.

**Scope allowed by this decision (batch 0177–0181, 2026-05-13):**
- Docs-only: design for idempotency/state-store implementation (task 0178).
- Docs-only: implementation checklist (task 0179).
- Docs-only: new pending Decision Packet D-0180-A for idempotency runtime gate (task 0180).
- Docs-only: cross-reference updates (task 0181).

**Scope forbidden (no change from prior state):**
- No schedule activation.
- No Schedule Trigger.
- No automatic notifications.
- No runtime performed by this decision.
- Future idempotency runtime implementation requires a separate explicit gate (D-0180-A — pending).
- Schedule activation remains separately gated after idempotency implementation and validation.
- No token or chat id in repo.
- No provider API LLM.
- No new billing.
- No app/deploy/tag/rollback.
- No automatic INBOX responses.
- No automatic `D-NNNN-X = N` writing.

---

## Decided

### D-0171-A — Defer Telegram schedule activation and consolidate hardening first

**inbox_status:** decided
**created_at:** 2026-05-13
**source_task:** 0171-record-telegram-schedule-deferral-and-hardening-decision
**source_document:** docs/automation/telegram-mode-a-completion-notification-mvp.md
**response:** 3
**decided_at:** 2026-05-13
**archive_policy:** keep

---

**Decision ID:** D-0171-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

Task 0170 recorded that one manual Telegram test message arrived successfully by user report. Workflow `TEST - Alina task completion Telegram notifier` exists by user report and remains inactive / not automatic. No Schedule Trigger is active. No token or chat id is stored in the repository.

## Perché serve decisione

Schedule activation would introduce automatic recurring runtime behavior. The current workflow has no idempotency/anti-duplication logic implemented in n8n. Without this, automatic schedule could produce duplicate notifications.

## Opzioni

1. **Open schedule activation gate immediately** — authorize next step-by-step n8n UI steps to enable Schedule Trigger; risk of duplicates without idempotency.
2. **Defer schedule activation; add intermediate idempotency implementation task first** — do not activate schedule now; return to gate after idempotency task.
3. **Defer schedule activation; consolidate documentation, runbook, idempotency and anti-duplication logic first** — complete hardening docs before any schedule gate is opened.

## Raccomandazione orchestratore

Option 3. Manual test succeeded. Next step is not to activate schedule but to consolidate the minimum safety documentation: runbook, idempotency key definition, state-store selection, and duplicate-prevention rules. Once hardening is documented, a separate activation gate can be opened cleanly.

## Decision outcome

Recorded by task 0171 on 2026-05-13: user response `D-0171-A = 3`.

**Scope allowed:**
- Documentation, runbook, idempotency, and anti-duplication design consolidation (tasks 0172 and 0173 in this batch).
- Future Decision Packet for schedule activation after hardening.

**Scope forbidden:**
- No Schedule Trigger.
- No automatic notifications.
- No repeated test messages.
- No workflow JSON export/import.
- No token or chat id in repo/docs/AI chat.
- No provider API LLM.
- No new billing.
- No app/deploy/tag/rollback.
- No automatic INBOX responses.
- No automatic `D-NNNN-X = N` writing.

**Follow-up (tasks 0172 and 0173, 2026-05-13):**
- Task 0172 created `docs/automation/telegram-notifier-runbook-idempotency-hardening.md` with idempotency model, state-store options, duplicate-prevention rules, stop conditions, recovery/rollback, and schedule activation checklist.
- Task 0173 created pending Decision Packet D-0173-A for future schedule activation choice.
- Telegram Mode A remains manual-tested but not automatic.
- No Schedule Trigger. No automatic notifications. No token/chat id in repo.

**User architecture note:**
The user stated that historically they follow the orchestrator's recommendations almost 100% of the time and suggested that future automation could potentially auto-select the orchestrator's recommendation when the choice is clear. This is recorded as a future architecture consideration only. It does NOT authorize: automatic INBOX responses, automatic `D-NNNN-X = N` writing, automatic schedule activation, or runtime execution without a future explicit policy gate. Any future auto-acceptance policy requires a separate explicit design, risk scoring, allowlist, and manual opt-in.

---

### D-0169-A — Authorize one manual Telegram test message

**inbox_status:** decided
**created_at:** 2026-05-13
**source_task:** 0169-record-single-manual-telegram-test-message-gate-decision
**source_document:** docs/automation/telegram-mode-a-completion-notification-mvp.md
**response:** 1
**decided_at:** 2026-05-13
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-0169-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

Task 0166 recorded workflow skeleton creation. Task 0167 recorded `D-0167-A = 1`, opening Telegram node addition gate. Task 0168 recorded user-reported Telegram node addition completion. Current workflow by user report: Manual Trigger → List done files → Pick latest done file → Get done file → Build notification payload → Telegram. No test message has been sent. No Execute/Test has been performed. No Schedule Trigger exists or is enabled.

## Perché serve decisione

A Telegram test message is real runtime behavior. Even one manual test message requires explicit human gate per project policy.

## Opzioni

1. **Authorize exactly one future manual test message** — user may manually execute the existing workflow once under supervision; verify whether one Telegram message arrives; report result as text only; workflow remains inactive; no Schedule Trigger.
2. **Defer test message** — keep workflow at node-only state; return to this gate later.
3. **Cancel Telegram Mode A path** — block Telegram implementation entirely until explicit future reconsideration.

## Raccomandazione orchestratore

Option 1. The workflow is fully configured. A single manual test message is the narrowest safe validation step: user executes once, verifies arrival, reports result. No automatic behavior is enabled.

## Rischio principale

Scope creep: repeated messages or schedule activation without separate gates. The test must be exactly once, with the result reported before any next step.

## Impatto

- App Alina: no impact.
- GitHub docs: this task records the decision only.
- Runtime: no runtime performed by this task; test execution is a future manual user step.
- n8n: no workflow modification by this task.
- INBOX: remains source of truth; Telegram must not answer it.
- Gate 7: no impact; remains closed.
- Provider API LLM: no impact; still forbidden by default.
- Billing: no new LLM billing.

## Micro-interazioni umane eliminate

0 immediately. After test succeeds and schedule is activated, Telegram Mode A may reduce manual checking burden.

## Scelta richiesta

`D-0169-A = 1` per autorizzare esattamente un test message manuale futuro.
`D-0169-A = 2` per rimandare.
`D-0169-A = 3` per annullare il percorso Telegram.

## Cosa succede dopo la scelta

If `D-0169-A = 1`, user may manually execute the workflow once. If the message arrives correctly, a separate gate for schedule activation may follow.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- repeated test messages;
- Schedule Trigger activation;
- making the workflow active/published for automatic notifications;
- modification of the existing queue reader workflow;
- workflow deletion;
- workflow JSON export/import;
- token/chat id in repo/docs/AI chat;
- provider API LLM;
- new billing;
- app/deploy/tag/rollback;
- Browser Bridge project-chat;
- Ollama runtime;
- Cursor CLI/headless runner.

## Decision outcome

Recorded by task 0169 on 2026-05-13: user response `D-0169-A = 1`.
This authorizes exactly one future manual Telegram test message under user supervision.
The user may manually execute the existing workflow once and verify whether one Telegram message arrives.
Workflow must remain inactive. No Schedule Trigger. No automatic notifications.
Retry (if test fails) requires a separate explicit gate.
No runtime was performed by this task. No Telegram message was sent by this task.
Schedule activation requires a separate future explicit gate.
No token or chat id stored in repo. No provider API LLM. No new billing. No app/deploy/tag/rollback.

**Follow-up status (task 0170, 2026-05-13):** The user reported that one manual Telegram test message arrived successfully, executed once under D-0169-A = 1. Workflow `TEST - Alina task completion Telegram notifier` remains inactive / not automatic. No Schedule Trigger was added or enabled. No second test execution is authorized by this record. No workflow JSON was exported. No token or chat id is stored in the repository. Schedule activation remains separately gated.

---

### D-0167-A — Open Telegram node addition gate

**inbox_status:** decided
**created_at:** 2026-05-13
**source_task:** 0167-record-telegram-node-addition-gate-decision
**source_document:** docs/automation/telegram-mode-a-completion-notification-mvp.md
**response:** 1
**decided_at:** 2026-05-13
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-0167-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

Task 0161 created docs-only MVP scaffolding. Task 0162 created the credential prerequisite guide. Task 0163 recorded `D-0163-A = 1`. Task 0164 recorded user-reported credential prerequisite completion. Task 0165 recorded `D-0165-A = 1`, opening the workflow creation gate only. Task 0166 recorded user-reported workflow skeleton creation: `TEST - Alina task completion Telegram notifier` (Manual Trigger → List done files → Pick latest done file → Get done file → Build notification payload), no Telegram node.

## Perché serve decisione

Adding a Telegram node is an n8n workflow modification. Even without sending a message, it introduces Telegram send capability and must remain explicitly gated per project policy.

## Opzioni

1. **Open only Telegram node addition gate** — authorize future step-by-step user-supervised addition of a Telegram node after `Build notification payload`; credential by name only; no test message; no Execute/Test; no Schedule Trigger.
2. **Defer Telegram node addition** — keep workflow at skeleton-only state; return to this gate later.
3. **Cancel Telegram Mode A path** — block Telegram implementation entirely until explicit future reconsideration.

## Raccomandazione orchestratore

Option 1. The skeleton is in place. Adding only the Telegram node (without executing it) is the narrowest safe next step. No test message is sent. No schedule is enabled. The scope is narrow and reversible.

## Rischio principale

Scope creep toward executing/testing the Telegram node without a separate gate. The node addition must not trigger any send.

## Impatto

- App Alina: no impact.
- GitHub docs: this task records the decision only.
- Runtime: no runtime performed by this task; node addition is a future manual user step.
- n8n: no workflow modification by this task.
- INBOX: remains source of truth; Telegram must not answer it.
- Gate 7: no impact; remains closed.
- Provider API LLM: no impact; still forbidden by default.
- Billing: no new LLM billing.

## Micro-interazioni umane eliminate

0 immediately. After node addition and future test/schedule gates, Telegram Mode A may reduce manual checking burden.

## Scelta richiesta

`D-0167-A = 1` per aprire solo il gate aggiunta nodo Telegram.
`D-0167-A = 2` per rimandare.
`D-0167-A = 3` per annullare il percorso Telegram.

## Cosa succede dopo la scelta

If `D-0167-A = 1`, user may proceed step-by-step in n8n UI to add one Telegram node. No test message until a separate future gate.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- sending any Telegram test message;
- executing/testing the workflow;
- enabling Schedule Trigger;
- making the workflow active/published for automatic notifications;
- modifying the existing queue reader workflow;
- deleting any existing workflow;
- exporting/importing workflow JSON with secrets;
- committing secrets;
- using provider API LLM;
- introducing new billing;
- modifying the app;
- deploy/tag/rollback;
- Browser Bridge real project-chat;
- Ollama runtime;
- Cursor CLI/headless runner.

## Decision outcome

Recorded by task 0167 on 2026-05-13: user response `D-0167-A = 1`.
This opens only the Telegram node addition gate.
It authorizes future user-supervised step-by-step n8n UI addition of one Telegram node after `Build notification payload`, with credential referenced by name only (`telegram_alina_notifier`), chat id used only in n8n UI/runtime by the user (never in repo/docs/AI chat), and workflow kept manual-safe.
No runtime was performed by this task. No Telegram node was created by this task.
Test message requires a separate future explicit gate. Schedule activation requires a separate future explicit gate.
No token or chat id stored in repo. No provider API LLM. No new billing. No app/deploy/tag/rollback.

**Follow-up status (task 0168, 2026-05-13):** The user reported adding and saving the Telegram node. Workflow name: `TEST - Alina task completion Telegram notifier`. Node chain: Manual Trigger → List done files → Pick latest done file → Get done file → Build notification payload → Telegram. Credential by name only: `telegram_alina_notifier`. Text expression: `{{ $json.telegram_message }}`. Chat id was entered in n8n UI by the user and is not recorded in the repository. No Telegram test message was sent. No Execute/Test was performed. No Schedule Trigger was added or enabled. No workflow JSON was exported. No token or chat id is stored in the repository. Test message and schedule activation remain separately gated.

---

### D-0165-A — Open n8n Telegram notifier workflow creation gate

**inbox_status:** decided
**created_at:** 2026-05-13
**source_task:** 0165-record-n8n-telegram-notifier-workflow-creation-gate-decision
**source_document:** docs/automation/telegram-mode-a-completion-notification-mvp.md
**response:** 1
**decided_at:** 2026-05-13
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-0165-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

Task 0161 created docs-only MVP scaffolding for Telegram Mode A completion notification.
Task 0162 created the credential prerequisite guide.
Task 0163 recorded `D-0163-A = 1` (manual credential prerequisite gate open).
Task 0164 recorded user-reported completion: bot exists, `telegram_alina_notifier` credential in n8n tested OK, chat id saved privately; no token/chat id in repo.

The next step — creating the n8n notifier workflow — is an n8n runtime modification. Runtime gates require explicit human decision per project policy.

## Perché serve decisione

Workflow creation is an n8n runtime modification. Even a manual user-supervised UI creation requires an explicit gate before any runtime step begins.

## Opzioni

1. **Open only workflow creation gate** — authorize future step-by-step user-supervised n8n UI creation of `TEST - Alina task completion Telegram notifier`; credential referenced by name only; workflow kept manual-safe; no test message; no Schedule Trigger.
2. **Defer workflow creation** — keep Telegram at credential-only state; no n8n workflow created; return to this gate later.
3. **Cancel Telegram Mode A path** — block Telegram implementation entirely until explicit future reconsideration.

## Raccomandazione orchestratore

Option 1. The credential is in place. Workflow creation is the narrowest safe next step: supervised n8n UI only, no test message, no schedule. Scope is narrow and reversible (workflow can be deleted from n8n UI at any time).

## Rischio principale

Scope creep from workflow creation toward test message or schedule activation without separate gates. Each must remain separately gated.

## Impatto

- App Alina: no impact.
- GitHub docs: this task records the decision only.
- Runtime: no runtime performed by this task; workflow creation is a future manual user step.
- n8n: no workflow created by this task.
- INBOX: remains source of truth; Telegram must not answer it.
- Gate 7: no impact; remains closed.
- Provider API LLM: no impact; still forbidden by default.
- Billing: no new LLM billing.

## Micro-interazioni umane eliminate

0 immediately. After workflow creation and future test/schedule gates, Telegram Mode A may reduce manual checking burden.

## Scelta richiesta

`D-0165-A = 1` per aprire solo il gate creazione workflow n8n notifier.
`D-0165-A = 2` per rimandare.
`D-0165-A = 3` per annullare il percorso Telegram.

## Cosa succede dopo la scelta

If `D-0165-A = 1`, user may proceed with step-by-step supervised n8n UI workflow creation. Test message requires a separate future gate.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- sending any Telegram test message;
- enabling Schedule Trigger;
- making the workflow active/published for automatic notifications;
- modifying the existing queue reader workflow;
- deleting any existing workflow;
- exporting/importing workflow JSON with secrets;
- committing secrets;
- using provider API LLM;
- introducing new billing;
- modifying the app;
- deploy/tag/rollback;
- Browser Bridge real project-chat;
- Ollama runtime;
- Cursor CLI/headless runner.

## Decision outcome

Recorded by task 0165 on 2026-05-13: user response `D-0165-A = 1`.
This opens only the n8n Telegram notifier workflow creation gate.
It authorizes future user-supervised step-by-step n8n UI creation of `TEST - Alina task completion Telegram notifier`, with credential referenced by name only (`telegram_alina_notifier`), workflow kept manual-safe and not automatically active.
No runtime was performed by this task. No workflow was created by this task.
Test message requires a separate future explicit gate. Schedule activation requires a separate future explicit gate.
No token or chat id stored in repo. No provider API LLM. No new billing. No app/deploy/tag/rollback.

**Follow-up status (task 0166, 2026-05-13):** The user reported creating and saving the n8n workflow skeleton. Workflow name: `TEST - Alina task completion Telegram notifier`. Node chain: Manual Trigger → List done files → Pick latest done file → Get done file → Build notification payload. No Telegram node was added. No Telegram test message was sent. No Schedule Trigger was added or enabled. No workflow JSON was exported. No token or chat id is stored in the repository. Test message and schedule activation remain separately gated.

---

### D-0163-A — Open Telegram credential prerequisite manual gate

**inbox_status:** decided
**created_at:** 2026-05-13
**source_task:** 0163-record-telegram-credential-prerequisite-gate-decision
**source_document:** docs/automation/telegram-mode-a-credential-prerequisite-guide.md
**response:** 1
**decided_at:** 2026-05-13
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-0163-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

Task 0161 (commit 25aff57) created docs-only scaffolding for the Telegram Mode A completion notification MVP, pinning scope, message template, trigger model, idempotency key, credential boundary, test ladder, and stop conditions.

Task 0162 (commit 073e9b6) created a docs-only user-guided prerequisite guide documenting how a future human operator will create a Telegram bot via BotFather, obtain the token privately, identify the chat id privately, and store both only in the n8n credential vault (`telegram_alina_notifier`).

Credentials and an n8n credential vault are sensitive configuration. Even a manual human-guided prerequisite phase requires an explicit human gate before the operator begins collecting or storing secrets.

## Perché serve decisione

The credential prerequisite guide (task 0162) describes manual user steps that involve creating a real Telegram bot and handling a real token. Without an explicit gate, the project cannot confirm the user intentionally chooses to proceed with this credential phase. Without the credential in place, no future n8n workflow can be tested.

## Opzioni

1. **Open only the manual Telegram credential prerequisite gate** — authorize only the human-guided prerequisite phase: user may create bot via BotFather, obtain token privately, identify chat id privately, and store token/chat id only in n8n credential vault as `telegram_alina_notifier`. Does not authorize workflow creation, test messages, Schedule Trigger, workflow JSON export/import, app/deploy/tag/rollback, provider API LLM, or new billing.
2. **Defer credential prerequisite** — keep all Telegram steps docs-only; no credential creation authorized; return to this gate later.
3. **Cancel Telegram Mode A path** — block Telegram implementation entirely until explicit future reconsideration.

## Raccomandazione orchestratore

Option 1.
The credential prerequisite is the narrowest possible manual step: it only authorizes the human operator to create a bot and store credentials privately in n8n vault. No runtime workflow is created. No message is sent. The scope is narrow and the step is fully reversible (revoke bot via BotFather if needed).

## Rischio principale

Credential leakage into the repo: if the operator inadvertently commits the bot token or chat id, the credential must be treated as compromised. The prerequisite guide (task 0162) already documents clipboard hygiene, redaction rules, and the git grep check for leaked token shapes.

## Impatto

- App Alina: no impact.
- GitHub docs: this task records the decision only.
- Runtime: no runtime in this task; credential creation is a future manual user step.
- n8n: no workflow creation in this task.
- INBOX: remains source of truth; Telegram must not answer it.
- Browser Bridge: no change; remains sandbox-only.
- Gate 7: no impact; remains closed.
- Provider API LLM: no impact; still forbidden by default.
- Billing: no new LLM billing.

## Micro-interazioni umane eliminate

0 immediately. After credential and future n8n workflow are in place, Telegram Mode A may reduce the user's manual checking burden. This decision alone does not eliminate micro-interactions.

## Scelta richiesta

Scrivi: `D-0163-A = 1` per aprire solo il gate prerequisito credenziali Telegram.
Scrivi: `D-0163-A = 2` per rimandare.
Scrivi: `D-0163-A = 3` per annullare il percorso Telegram.

## Cosa succede dopo la scelta

If `D-0163-A = 1` is recorded, the user may proceed with the manual credential prerequisite steps described in `docs/automation/telegram-mode-a-credential-prerequisite-guide.md`. A separate future gated task is required before any n8n workflow creation or test message.
If `D-0163-A = 2` or `defer`, no credential creation proceeds; Telegram remains docs-only.
If `D-0163-A = 3` or `skip`, the Telegram path remains blocked until explicitly reconsidered.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- creating or modifying an n8n workflow;
- sending any Telegram message;
- enabling any Schedule Trigger;
- exporting/importing workflow JSON;
- committing secrets;
- using provider API LLM;
- introducing new billing;
- modifying the app;
- deploy/tag/rollback;
- Browser Bridge real project-chat;
- Ollama runtime;
- Cursor CLI/headless runner.

## Decision outcome

Recorded by task 0163 on 2026-05-13: user response `D-0163-A = 1`.
This opens only the manual Telegram credential prerequisite gate.
It authorizes the human operator to: create a Telegram bot via BotFather, obtain the bot token privately, identify the target chat id privately, and store both only in the n8n credential vault as `telegram_alina_notifier`.
It does not authorize n8n workflow creation, test messages, Schedule Trigger activation, workflow JSON export/import, app/deploy/tag/rollback, provider API LLM, or new billing.
No runtime was performed by this task.
A separate future gated task is required before any n8n workflow creation or test message.

**Follow-up status (task 0164, 2026-05-13):** The user reported completing the manual credential prerequisite phase. Telegram bot exists. n8n credential `telegram_alina_notifier` exists and connection test succeeded. Chat id saved privately by user. No token or chat id is stored in the repository. No n8n workflow was created. No Telegram message was sent. Workflow creation / test message / schedule activation remain separately gated.

---

### D-0157-A — Open Telegram Mode A completion notification MVP gate

**inbox_status:** decided
**created_at:** 2026-05-13
**source_task:** 0157-telegram-mode-a-completion-notification-decision-packet
**source_document:** docs/automation/telegram-browser-bridge-trigger-coordination-design.md
**response:** 1
**decided_at:** 2026-05-13
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-0157-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

The Browser Bridge project-chat path is deferred by `D-0154-A = 2`, and Browser Bridge remains sandbox-only.
The low-touch workflow still needs a safe way to notify the user when a supervised implementer task appears to be complete and ready for ChatGPT post-check.

Telegram Mode A is the notification-only path: Telegram informs the user; it does not orchestrate, decide, answer INBOX, or execute project actions.
ChatGPT remains the orchestrator. GitHub and `docs/INBOX.md` remain the source of truth.

## Perché serve decisione

Telegram Mode A would introduce an external notification channel and likely a Telegram bot/token in a future implementation task.
Even if the MVP is notification-only, it still involves credentials and runtime configuration, so it requires an explicit human gate before implementation.

Without this decision, no Telegram runtime implementation prompt may be generated.

## Opzioni

1. **Open Telegram Mode A completion notification MVP gate only** — authorize a future implementation task for Telegram-only task completion notifications. The future MVP may notify the user with task id/slug, commit hash, optional INBOX pending count, and the instruction "scrivi aggio per post-check". It must not answer INBOX, must not create decisions, must not execute actions, must not use Browser Bridge, must not use Ollama, must not use Cursor, must not touch app/deploy/tag/rollback, must not use provider API LLM, and must not introduce new LLM billing.
2. **Defer Telegram Mode A MVP** — keep Telegram design-only; continue with docs-only hardening, local tooling, or another candidate gate later.
3. **Reject Telegram path for now** — keep all Telegram automation blocked until explicit future reconsideration.

## Raccomandazione orchestratore

Option 1.
Telegram Mode A completion notification is the safest useful low-touch step after Browser Bridge was stopped at sandbox-only.
It does not write into the real ChatGPT / Claude.ai chat, does not answer INBOX, does not decide anything, and can reduce the user's manual checking burden by telling the user when to run the post-check manually.

The future implementation must remain extremely narrow:
- notification-only;
- task id / slug;
- commit hash;
- optional INBOX pending count;
- fixed instruction: "scrivi aggio per post-check";
- no INBOX answer;
- no automatic decision;
- no Browser Bridge;
- no Ollama;
- no Cursor;
- no app/deploy/tag/rollback;
- no provider API LLM;
- no new LLM billing.

## Rischio principale

The main risk is notification-channel creep: Telegram could slowly become a control plane instead of a notification channel.
The implementation must therefore keep Telegram Mode A notification-only, with no authority to answer decisions, write INBOX responses, or execute project actions.

Credential handling is also a risk. Any future Telegram token must be handled only through an explicitly approved secure mechanism and must never be committed to the repository.

## Impatto

- App Alina: no impact.
- GitHub docs: this task records the user decision only.
- Runtime: no runtime in this task; Telegram runtime requires a separate future implementation task.
- INBOX: remains the source of truth; Telegram must not answer it.
- Browser Bridge: no change; remains sandbox-only.
- n8n: no change in this task.
- Ollama / Gate 7: no impact.
- Cursor CLI / Gate 7: no impact.
- Provider API LLM: no impact; still forbidden by default.
- Billing: no new LLM billing.

## Micro-interazioni umane eliminate

0 immediately.
If later implemented, Telegram Mode A may reduce the need for the user to manually check GitHub/INBOX after implementer completion. It may send a completion notification that tells the user to write `aggio` for ChatGPT post-check. This decision alone does not eliminate micro-interactions.

## Scelta richiesta

Scrivi: `D-0157-A = 1` per aprire solo il gate Telegram Mode A completion notification MVP.
Scrivi: `D-0157-A = 2` per rimandare.
Scrivi: `D-0157-A = 3` per respingere per ora il percorso Telegram.
In alternativa: `D-0157-A = defer`, `D-0157-A = skip`, oppure `D-0157-A = retry`.

## Cosa succede dopo la scelta

If `D-0157-A = 1` is recorded in `docs/INBOX.md`, the orchestrator may generate a future implementer prompt for a narrow Telegram Mode A MVP implementation task. That future task must be notification-only and must not answer INBOX, make decisions, execute project actions, use Browser Bridge, use Ollama, use Cursor, modify the app, deploy, tag, rollback, use provider API LLM, or introduce new LLM billing.
If `D-0157-A = 2` or `defer`, Telegram remains design-only and no Telegram runtime prompt is generated.
If `D-0157-A = 3` or `skip`, the Telegram path remains blocked until explicitly reconsidered.
If `D-0157-A = retry`, the orchestrator reformulates the Decision Packet.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- Telegram bot creation;
- Telegram token creation or storage;
- n8n runtime modification;
- answering INBOX;
- reading INBOX from a bridge;
- writing any `D-NNNN-X = N` response;
- Browser Bridge project-chat;
- Ollama install or model pull;
- Cursor CLI/headless execution;
- Gate 7;
- provider API LLM;
- new LLM billing;
- app source modification;
- Apps Script deploy;
- tag;
- rollback.

## Decision outcome

Recorded by task 0159 on 2026-05-13: user response `D-0157-A = 1`.
This opens the Telegram Mode A completion notification MVP gate only.
It authorizes only a future narrow implementation task.
It does not implement Telegram.
It does not create a bot.
It does not create or store a Telegram token.
It does not configure n8n runtime.
It does not send Telegram messages.
It does not answer INBOX.
It does not create decisions.
It does not use Browser Bridge.
It does not use Ollama.
It does not use Cursor.
It does not touch app/deploy/tag/rollback.
It does not use provider API LLM.
It does not introduce new LLM billing.
A separate future task/prompt is required to implement the MVP.
Credential handling must be explicitly secured in the future implementation task and no secret may be committed.

---

### D-0154-A — Open Browser Bridge project-chat write gate

**inbox_status:** decided
**created_at:** 2026-05-13
**source_task:** 0154-browser-bridge-project-chat-gate-decision-packet
**source_document:** docs/automation/candidate-gate-backlog.md
**response:** 2
**decided_at:** 2026-05-13
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-0154-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

Task 0150 implemented the Browser Bridge dry-run.
Task 0153 implemented the Browser Bridge sandbox with local `file://` sandbox only, `aggio` allowlist, idempotency, rate-limit, invalid-message rejection, and safety flags confirming no project chat, no ChatGPT / Claude.ai, no INBOX, and no external network.

The remaining Browser Bridge phase is **project-chat write**: a future bridge that could write only the literal message `aggio` into the real ChatGPT / Claude.ai orchestration chat after an implementer task completes.

This is the highest-risk Browser Bridge phase because it touches the real orchestration chat.

## Perché serve decisione

Project-chat write would move from local/sandbox validation to the real assistant conversation.
Even if the bridge is limited to `aggio`, it could affect project orchestration if mis-scoped, duplicated, triggered at the wrong time, or pointed at the wrong browser context.

Project rules require a separate explicit human gate before any automation writes to the real ChatGPT / Claude.ai project chat.

Without this decision, no project-chat implementation prompt may be generated.

## Opzioni

1. **Open project-chat write gate only** — authorize a future narrow implementation task that may write only the literal message `aggio` to the real ChatGPT / Claude.ai orchestration chat, with strict safeguards: user-controlled target, no INBOX read/answer, no `D-NNNN-X`, no arbitrary text, idempotency, rate-limit, visible logging, fail-closed behavior, and no n8n/Telegram/Ollama/Cursor/API/billing/app/deploy/tag/rollback.
2. **Defer project-chat write** — keep Browser Bridge at sandbox-only state for now; optionally do more hardening/docs/manual validation before any real chat write.
3. **Stop Browser Bridge at sandbox for now** — treat dry-run and sandbox as sufficient for the current low-touch phase; keep project-chat automation blocked until a future explicit reconsideration.

## Raccomandazione orchestratore

Option 2.
The sandbox implementation is complete, but the optional real browser-open path was intentionally skipped in task 0153. Before touching the real project chat, the safer sequence is to defer project-chat write and, if needed, perform a separate manual/local verification or hardening step first.

If the user prefers faster automation, Option 1 can be chosen, but the future implementation must be extremely narrow: `aggio` only, user-controlled visible browser context only, no INBOX, no decision responses, no hidden background action, no arbitrary text, no external provider API, and fail closed if the target chat is not explicitly recognized as the intended project chat.

## Rischio principale

The main risk is that automation writes into the wrong conversation, writes at the wrong time, writes more than `aggio`, or becomes a path for silently answering INBOX or triggering orchestration without human awareness.
The implementation must therefore be designed as a visible, user-supervised bridge, not an autonomous chat controller.

## Impatto

- App Alina: no impact.
- GitHub docs: only the INBOX decision is added now.
- Runtime: no runtime in this task; possible real project-chat write runtime only if Option 1 is later recorded as decided and a separate implementation task is generated.
- Browser Bridge: dry-run and sandbox remain implemented; project-chat remains unimplemented until a future task.
- INBOX: no bridge read/answer is authorized.
- n8n: no impact.
- Telegram: no impact.
- Ollama / Gate 7: no impact.
- Cursor CLI / Gate 7: no impact.

## Micro-interazioni umane eliminate

0 immediately.
If later implemented and validated, project-chat write may reduce the need for the user to manually type `aggio` after task completion. This decision alone does not eliminate micro-interactions.

## Scelta richiesta

Scrivi: `D-0154-A = 1` per aprire solo il gate Browser Bridge project-chat write.
Scrivi: `D-0154-A = 2` per rimandare.
Scrivi: `D-0154-A = 3` per fermare per ora il Browser Bridge allo stato sandbox-only.
In alternativa: `D-0154-A = defer`, `D-0154-A = skip`, oppure `D-0154-A = retry`.

## Cosa succede dopo la scelta

If `D-0154-A = 1` is recorded in `docs/INBOX.md`, the orchestrator may generate a future implementer prompt for a narrow project-chat implementation task. That future task must write only `aggio`, must be visibly user-supervised, must not answer INBOX, must not write any `D-NNNN-X = N` response, must not send arbitrary text, and must fail closed if the target context is not explicitly safe.
If `D-0154-A = 2` or `defer`, Browser Bridge remains sandbox-only and no project-chat runtime prompt is generated.
If `D-0154-A = 3` or `skip`, the project-chat write path remains blocked until explicitly reconsidered.
If `D-0154-A = retry`, the orchestrator reformulates the Decision Packet.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- answering INBOX;
- reading INBOX from the bridge;
- writing any `D-NNNN-X = N` response;
- arbitrary text entry;
- hidden background chat control;
- n8n runtime modification;
- Telegram configuration;
- Ollama install or model pull;
- Cursor CLI/headless execution;
- Gate 7;
- provider API;
- API key creation;
- billing;
- app source modification;
- Apps Script deploy;
- tag;
- rollback.

Even if Option 1 is approved, any future expansion beyond writing literal `aggio` remains a separate future gate.

## Decision outcome

Recorded by task 0155 on 2026-05-13: user response `D-0154-A = 2`.
This defers Browser Bridge project-chat write.
Browser Bridge remains sandbox-only for now.
Project-chat gate is not open.
No project-chat implementation is authorized.
No automation may write to the real ChatGPT / Claude.ai project chat.
No INBOX read or answer is authorized from any bridge.
No `D-NNNN-X = N` response writing is authorized.
Future reconsideration requires a new or reopened Decision Packet and an explicit user response.
Dry-run (task 0150) and sandbox (task 0153) remain implemented.
Gate 7 remains closed.

---

### D-0151-A — Open Browser Bridge sandbox gate

**inbox_status:** decided
**created_at:** 2026-05-13
**source_task:** 0151-browser-bridge-sandbox-gate-decision-packet
**source_document:** docs/automation/candidate-gate-backlog.md
**response:** 1
**decided_at:** 2026-05-13
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-0151-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

Task 0150 completed the Browser Bridge dry-run implementation.
The dry-run is local-file-only: it writes `aggio` to `.local/browser-bridge-dry-run/dry-run-output.jsonl`, rejects DP-like messages, uses idempotency and rate-limit controls, and does not use browser, network, ChatGPT / Claude.ai, or INBOX.
The next candidate in the phased Browser Bridge path is the **sandbox** phase: testing browser automation only against a throwaway/sandbox browser context, not the real project chat.

## Perché serve decisione

Sandbox introduces actual browser automation.
Even if it targets only a throwaway/sandbox browser context, it is a higher-risk runtime step than dry-run because it may open or control a browser.
Project rules require an explicit human gate before any browser automation or sandbox execution.

Without this decision, no Browser Bridge sandbox implementation prompt may be generated.

## Opzioni

1. **Open Browser Bridge sandbox gate only** — authorize a future implementation task for a sandbox-only browser automation test. The future task may target only a throwaway/sandbox browser context and may attempt to send only `aggio` there. It does not authorize the real project chat, INBOX reading, INBOX answering, n8n runtime changes, Telegram, Ollama, Cursor CLI, API keys, billing, app source, deploy, tag, or rollback.
2. **Defer Browser Bridge sandbox** — keep Browser Bridge at dry-run-only state; continue with docs-only planning, hardening, or another candidate gate later.
3. **Reject browser automation path for now** — keep dry-run as the terminal Browser Bridge implementation for now; sandbox and project-chat remain blocked until future explicit reconsideration.

## Raccomandazione orchestratore

Option 1, but only with narrow scope.
The dry-run has already validated message allowlist, idempotency, duplicate skip, invalid-message rejection, and local output evidence. Sandbox is the next logical validation step, but it must remain isolated from the real orchestration chat.
The future implementation prompt must require a throwaway/sandbox browser context, must forbid project-chat access, and must preserve the rule that Browser Bridge may only write `aggio` and must never read or answer INBOX.

## Rischio principale

The main risk is scope creep from sandbox browser automation toward real project-chat automation.
A sandbox test could be accidentally expanded to the actual ChatGPT / Claude.ai project chat if boundaries are not enforced.
The future implementation prompt must therefore explicitly separate sandbox from project-chat and must fail closed if no sandbox/throwaway context is available.

## Impatto

- App Alina: no impact.
- GitHub docs: only the INBOX decision is added now.
- Runtime: no runtime in this task; possible browser sandbox runtime only if Option 1 is later recorded as decided and a separate implementation task is generated.
- Browser Bridge: dry-run remains implemented; sandbox remains unimplemented until a future task.
- n8n: no impact.
- Telegram: no impact.
- Ollama / Gate 7: no impact.
- Cursor CLI / Gate 7: no impact.

## Micro-interazioni umane eliminate

0 immediately.
If later implemented and validated, sandbox is a prerequisite toward a future project-chat bridge that may reduce the need for the user to manually type `aggio` after task completion. This decision alone does not eliminate micro-interactions.

## Scelta richiesta

Scrivi: `D-0151-A = 1` per aprire solo il gate Browser Bridge sandbox.
Scrivi: `D-0151-A = 2` per rimandare.
Scrivi: `D-0151-A = 3` per respingere per ora il percorso browser automation.
In alternativa: `D-0151-A = defer`, `D-0151-A = skip`, oppure `D-0151-A = retry`.

## Cosa succede dopo la scelta

If `D-0151-A = 1` is recorded in `docs/INBOX.md`, the orchestrator may generate a future implementer prompt for a narrow sandbox implementation task. That future task must be sandbox-only, must not touch the real project chat, and must not read or answer INBOX.
If `D-0151-A = 2` or `defer`, Browser Bridge remains dry-run-only and no sandbox runtime prompt is generated.
If `D-0151-A = 3` or `skip`, the browser automation path remains blocked until explicitly reconsidered.
If `D-0151-A = retry`, the orchestrator reformulates the Decision Packet.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- project-chat Browser Bridge phase;
- writing to the real ChatGPT / Claude.ai project chat;
- answering INBOX;
- reading INBOX from the bridge;
- writing any `D-NNNN-X = N` response;
- Telegram configuration;
- n8n runtime modification;
- Ollama install or model pull;
- Cursor CLI/headless execution;
- Gate 7;
- provider API;
- API key creation;
- billing;
- app source modification;
- Apps Script deploy;
- tag;
- rollback.

Even if Option 1 is approved, the project-chat Browser Bridge phase remains a separate future gate.

## Decision outcome

Recorded by task 0152 on 2026-05-13: user response `D-0151-A = 1`.
This opens the Browser Bridge **sandbox gate only**, authorizing a future narrow sandbox implementation task.
The future task must target only a throwaway/sandbox browser context, may attempt to send only `aggio`, and must fail closed if no sandbox context is available.
No sandbox has been implemented. No browser automation has been executed. No runtime has been activated.
This decision does not authorize:
- project-chat Browser Bridge phase or writing to the real ChatGPT / Claude.ai project chat;
- INBOX read or answer from the bridge;
- n8n runtime modification; Telegram; Ollama; Cursor CLI; Gate 7; provider API; API key; billing;
- app source modification; Apps Script deploy; tag; rollback.
A separate future task/prompt is required to implement the sandbox.
Project-chat phase remains a separate future gate.

---

### D-0148-A — Open Browser Bridge dry-run gate

**inbox_status:** decided
**created_at:** 2026-05-13
**source_task:** 0148-browser-bridge-dry-run-gate-decision-packet
**source_document:** docs/automation/candidate-gate-backlog.md
**response:** 1
**decided_at:** 2026-05-13
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-0148-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

Task 0147 created the Candidate Gate Backlog and ranked **Browser Bridge dry-run** as the recommended next gate candidate.
The Browser Bridge design defines a phased path: dry-run → sandbox → project chat.
This decision concerns only the **dry-run** phase: a local test that writes to a local test file, with no browser and no ChatGPT / Claude.ai write.

## Perché serve decisione

Even though dry-run is the safest first phase, it is still a runtime step because it would create and execute local automation logic later.
The project rules require an explicit human gate before any runtime activation.
Without this decision, no Browser Bridge dry-run implementation prompt may be generated.

## Opzioni

1. **Open Browser Bridge dry-run gate only** — authorize a future implementation task that creates a local dry-run script writing only to a local test file. No browser, no ChatGPT / Claude.ai write, no INBOX read, no INBOX response, no n8n runtime change.
2. **Defer Browser Bridge dry-run** — keep Browser Bridge fully design-only; continue with docs-only planning or another candidate gate later.
3. **Reject Browser Bridge path for now** — keep all Browser Bridge phases blocked until a future explicit reconsideration.

## Raccomandazione orchestratore

Option 1.
It is the narrowest and most reversible runtime-adjacent step: local file output only, no browser, no API key, no billing, no provider API, no app impact, and no n8n modification.
It validates the future Auto-Aggio trigger path without touching the actual ChatGPT / Claude.ai project chat.

## Rischio principale

Even a dry-run introduces a local automation surface. The risk is small but real: a future script could be expanded incorrectly if scope controls are not enforced.
The implementation prompt must therefore keep the output to a local test file only and must explicitly forbid browser automation, INBOX decisions, API keys, billing, app changes, deploy, tag, rollback, and n8n runtime changes.

## Impatto

- App Alina: no impact.
- GitHub docs: only the INBOX decision is added now.
- Runtime: no runtime in this task; possible runtime only if Option 1 is later recorded as decided.
- n8n: no impact.
- Telegram: no impact.
- Ollama / Gate 7: no impact.
- Cursor CLI / Gate 7: no impact.

## Micro-interazioni umane eliminate

0 immediately.
If later implemented and then advanced through sandbox/project-chat gates, the Browser Bridge path may reduce the need for the user to manually type `aggio` after future task completions. This decision alone does not eliminate micro-interactions.

## Scelta richiesta

Scrivi: `D-0148-A = 1` per aprire solo il gate Browser Bridge dry-run.
Scrivi: `D-0148-A = 2` per rimandare.
Scrivi: `D-0148-A = 3` per respingere il percorso Browser Bridge per ora.
In alternativa: `D-0148-A = defer`, `D-0148-A = skip`, oppure `D-0148-A = retry`.

## Cosa succede dopo la scelta

If `D-0148-A = 1` is recorded in `docs/INBOX.md`, the orchestrator may generate a future implementer prompt for a narrow dry-run implementation task. That future task may create a local script that writes only to a local test file and includes idempotency/rate-limit/logging checks.
If `D-0148-A = 2` or `defer`, Browser Bridge remains design-only and no runtime prompt is generated.
If `D-0148-A = 3` or `skip`, the Browser Bridge path remains blocked until explicitly reconsidered.
If `D-0148-A = retry`, the orchestrator reformulates the Decision Packet.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- browser automation;
- writing to ChatGPT / Claude.ai;
- answering INBOX;
- reading INBOX from the bridge;
- Telegram configuration;
- n8n runtime modification;
- Ollama install or model pull;
- Cursor CLI/headless execution;
- Gate 7;
- provider API;
- API key creation;
- billing;
- app source modification;
- Apps Script deploy;
- tag;
- rollback.

Even if Option 1 is approved, sandbox and project-chat Browser Bridge phases remain separate future gates.

## Decision outcome

Recorded by task 0149 on 2026-05-13: user response `D-0148-A = 1`.
This response opens the Browser Bridge **dry-run gate only**, authorizing a future narrow implementation task with the strict scope described above.
A separate future task/prompt is required to implement the dry-run. No runtime has been executed by this decision: it is a recorded authorization, not an activation.
Sandbox and project-chat Browser Bridge phases remain separate future gates. Browser Bridge still cannot answer INBOX (Hard Constraint #4 preserved). Gate 7 remains closed.

---

## Deferred

_No deferred decisions._

---

## Superseded (legacy placeholder)

_See the Superseded section above for D-0202-A (superseded by D-0206-A, 2026-05-14)._

---

## Template — Future Decision Packet

Use this block when adding a new decision. Preserve field order.

```markdown
### D-NNNN-X — [short title]

**inbox_status:** pending
**created_at:** YYYY-MM-DD
**source_task:** NNNN-slug
**source_document:** docs/automation/{topic}.md
**response:**
**decided_at:**
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-NNNN-X
**Kind:** alina-feature | automation | infra | meta
**Data:** YYYY-MM-DD

## Contesto

[2–4 lines minimum context]

## Perché serve decisione

[what changed / why a choice is needed now]

## Opzioni

1. **[option 1]** — [brief description]
2. **[option 2]** — [brief description]
3. **[option 3]** — [brief description]

## Raccomandazione orchestratore

[recommended option with brief reason]

## Rischio principale

[key risk of the recommended option]

## Impatto

[who/what is impacted]

## Micro-interazioni umane eliminate

[how many micro-interactions does this option eliminate?]

## Scelta richiesta

Scrivi: `D-NNNN-X = N` (option number) or `D-NNNN-X = defer` / `D-NNNN-X = skip`

## Cosa succede dopo la scelta

[next step after user responds]

## Cosa NON verrà fatto senza ulteriore gate

[explicit permanent gates — no deploy, no runtime, no API key, etc.]
```

---

## Archive Policy

| Status | Default policy | Notes |
|--------|---------------|-------|
| `pending` | N/A — never archive | Stays until responded |
| `decided` | `keep` | Perpetual audit of resolved decisions |
| `deferred` | `manual` | Review periodically; rotate if obsolete |
| `superseded` | `keep` | Traceable history with `superseded_by` |

If `## Pending` exceeds 5 items, signal as congestion (Auto-Aggio rule).
If file grows excessively, propose rotation to `docs/INBOX-ARCHIVE.md` via dedicated Decision Packet.

---

## Anti-Noise Rules

1. Only real Decision Packets or genuine human decisions.
2. No generic logs (sessions, commits, automation events).
3. No status updates ("task completed", "all green").
4. No standard completed tasks — Auto-Aggio handles those silently.
5. No automation session files (those live in `docs/sessions/automation-*`).
6. No duplicate entries — each DP enters once; updates = state transitions.
7. If no real decision is needed, do not enqueue.
8. Never include tokens, credentials, OAuth material, sensitive personal data.
