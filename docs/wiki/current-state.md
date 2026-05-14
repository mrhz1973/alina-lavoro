# Wiki — Current State Snapshot

**Derived memory (Level 2) — last updated: 2026-05-14 (task 0258)**
**Canonical source:** `docs/PROJECT_STATE.md`

---

## App

| Field | Value |
|-------|-------|
| Version | **V1.9.2** |
| Tag | `v1.9.2-stable` |
| Branch | **main** |
| Apps Script | **@24** |
| Last test | OK 2026-05-10 (Redmi 9C NFC) |
| Scope | Stable — not touched during automation workstream |

---

## Active Workstream

**automation / watcher / runner / low-touch**
Constraint: do not return to Alina app work until this workstream is closed.

---

## Task State

| Item | Value |
|------|-------|
| Last completed | 0258 — batch 0254–0258 (2026-05-14): V3.1 Enforcement + Prompt Size Guard + Future Optimization Backlog; created `docs/wiki/v31-enforcement-checklist.md`; updated V3.1 routing docs (prompt-routing, context-budget-policy, template-pack-index, compact-implementer-prompt-workflow, compact-task-creation-workflow, token-efficiency); recorded CLI Printing Press as future/low-priority idea; AGENTS.md deferred; repo hygiene scanner deferred; Telegram Mode A remains active and stable-after-fix; INBOX: 0 pending, 20 decided; no runtime. **Previous 0253** — batch 0251–0253 (2026-05-14): record Telegram Mode A post-fix scheduled validation; first scheduled tick sent Telegram for task 0250 (new latest after docs batch 0246–0250); second scheduled tick duplicate-skipped 0250; **Telegram Mode A declared stable-after-fix**; routine-check posture; INBOX: 0 pending, 20 decided; no implementer runtime. **Previous 0250** — batch 0246–0250 (2026-05-14): record Telegram Mode A latest-done selection fix and manual validation; `Pick latest done file` bug diagnosed (stale selection via `files[files.length - 1]`); fix recorded (numeric sort descending); manual validation: Telegram 0245 arrived; monitoring/stabilization docs updated; `telegram-mode-a-latest-done-selection-fix.md` created; **first scheduled tick post-fix pending observation**; INBOX: 0 pending, 20 decided; no implementer runtime. **Previous 0245** — batch 0241–0245 (2026-05-14): prepare next low-touch runtime gate backlog; created telegram-mode-a-post-activation-stabilization-plan.md, next-low-touch-runtime-gate-backlog.md, v31-next-task-selection-rubric.md; candidate-gate-backlog updated; Telegram Mode A remains active; INBOX: 0 pending, 20 decided; no runtime. **Previous 0240** — batch 0236–0240 (2026-05-14): operationalize LLM Wiki V3.1 workflow; created compact-task-creation-workflow.md, compact-implementer-prompt-workflow.md, multi-step-batch-planning-rules.md, v31-compact-workflow-cookbook.md; V3.1 workflow layer complete; Telegram Mode A remains active; INBOX: 0 pending, 20 decided; no runtime. **Previous 0235** — task 0235 (2026-05-14): create first delta-based prompt example using V3.1 templates; `docs/wiki/examples/delta-based-prompt-example.md` created; Telegram Mode A remains active; INBOX: 0 pending, 20 decided; no runtime. **Previous 0234** — task 0234 (2026-05-14): complete LLM Wiki V3.1 template pack; created 5 missing templates (docs-only-task, runtime-gated-task, inbox-decision-recording, n8n-ui-supervised-cleanup, state-update-batch); Template Pack V3.1 complete; Telegram Mode A remains active; INBOX: 0 pending, 20 decided; no runtime. **Previous 0233** — task 0233 (2026-05-14): consolidate direct GitHub 0232 policy patch; 0232 created LLM Wiki V3.1 (task-id-preflight, prompt-routing, context-budget-policy, template-pack-index) + implementer templates (implementer-standard, n8n-template-first-task, final-report-contract); no implementer for 0232; state docs updated to 0233; Telegram Mode A remains active scheduled notification-only; INBOX: 0 pending, 20 decided; no runtime; no secrets. **Previous 0231 — batch (0227–0231) docs-only (2026-05-14):** cleanup performed by user in n8n UI (task 0227) — scope_note updated, short_hash mapping updated, no Execute during cleanup; conditional follow-on activation intent applied; Schedule Trigger activated on `TEST - Alina task completion Telegram notifier` (every 5 minutes; Schedule Trigger → List done files; Manual Trigger retained); first scheduled tick: **success / Telegram arrived** (task 0228); Telegram Mode A is now **active scheduled notification-only automation**; D-0221-A = 3 remains decided (cleanup-first + conditional activation intent applied); duplicate-skip remains conclusively validated (D-0209-A); D-0217-A/D-0213-A/D-0209-A/D-0206-A remain decided; D-0202-A remains superseded; queue reader untouched; no secrets recorded; INBOX: 0 pending, 1 superseded (D-0202-A), 20 decided; next valid posture: monitor active Telegram Mode A; disable/report on anomaly; no immediate decision pending |
| Queue | `docs/tasks/queue/` |

---

## n8n Runtime

- Schedule polling: **active** (5 min, Europe/Berlin)
- Queue reader: validated — skip done / processing / failed
- `has_task:true` path: validated end-to-end (task 0116)

---

## VPS

Ubuntu 24.04.4 LTS | Docker/n8n at `127.0.0.1:5678` (hardened)
Node.js 18.19.1 | Claude Code CLI 2.1.139 | login blocked | no runner

---

## Telegram Mode A / INBOX State

| Item | State |
|------|-------|
| Telegram workflow | **Active — Schedule Trigger every 5 minutes** (activated batch 0227–0231, 2026-05-14) |
| D-0173-A | Decided = 3 (task 0177, 2026-05-13) — schedule deferred; implement idempotency first |
| D-0180-A | Decided = 1 (task 0182, 2026-05-13) — idempotency/state-store runtime gate opened |
| D-0187-A | **Decided = 1, consumed/inconclusive** (batch 0188–0190, 2026-05-14; result recorded batch 0191–0193) — duplicate-skip validation gate opened, one run executed, result inconclusive due to latest-done drift |
| D-0193-A | **Decided = 1, consumed/inconclusive** (batch 0194–0198, 2026-05-14) — retry applied per user's prior conditional order; runtime TRUE branch / Telegram arrived / likely new-key send due to latest-done drift; NOT a confirmed idempotency bug |
| D-0197-A | **Decided = 1, not successful** (batch 0199–0203, 2026-05-14) — one manual pinned run executed; override node output correct for 0193; but downstream nodes used dynamic values; `Store notification state` wrote task 0198 (not 0193); `Load notification state` did not find existing 0193 row; classification: partial pinning / dynamic reference leakage, NOT confirmed pure idempotency bug |
| D-0202-A | **Superseded by D-0206-A** (batch 0204–0208, 2026-05-14) — template-first policy makes inspection/repair slower than importing a clean fully-pinned template; original design preserved at `docs/automation/telegram-fully-pinned-validation-harness-design.md` |
| D-0206-A | **Decided = 1, applied/completed** (batch 0208–0210, 2026-05-14) — import and inspection of fully-pinned n8n template authorized and performed; user report `import/inspection ok`; workflow `TEST - Alina Telegram notifier FULLY PINNED HARNESS ONLY` present in n8n UI (`active=false`); no Execute performed |
| D-0209-A | **Decided = 1, applied/completed** (batch 0211–0214, 2026-05-14) — exactly one manual Execute run of imported fully-pinned harness; result `fully pinned duplicate skip succeeded`: `Load notification state` found existing row, FALSE branch, no Telegram message, no new Data Table row; duplicate-skip conclusively validated on fully-pinned harness |
| D-0213-A | **Decided = 3** (batch 0215–0218, 2026-05-14) — schedule activation deferred; design-first path opened (`docs/automation/telegram-mode-a-schedule-activation-design-first-path.md`); next narrower gate is D-0217-A |
| D-0217-A | **Decided = 1, applied/completed** (batch 0219–0223, 2026-05-14) — readiness inspection succeeded; target workflow `TEST - Alina task completion Telegram notifier` confirmed inactive, no Schedule Trigger, idempotency path wired, Data Table `alina_telegram_notifier_state` confirmed, Telegram notification-only, no INBOX-answering logic; minor cleanup candidates: stale D-0165-A scope_note, short_hash empty mapping (non-blocking); queue reader untouched; no Execute; no Telegram send |
| D-0221-A | **Decided = 3, sequence completed** (batch 0224–0226 + 0227–0231, 2026-05-14) — cleanup-first path selected; conditional follow-on activation intent recorded and applied; cleanup completed (task 0227): scope_note updated, short_hash mapping updated; Schedule Trigger activated (task 0228): every 5 minutes, first tick success / Telegram arrived |
| Cleanup (batch 0227) | ✅ Completed — `Build notification payload` scope_note updated; `Store notification state` short_hash mapping updated; no Execute; no new risk found |
| Schedule activation (batch 0228) | ✅ Succeeded — Schedule Trigger added, workflow activated, first scheduled tick: **success / Telegram arrived** |
| Idempotency design | Exists: `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md` |
| Idempotency checklist | Exists: `docs/automation/telegram-notifier-idempotency-implementation-checklist.md` |
| Runtime UI handoff | Exists: `docs/automation/telegram-idempotency-runtime-ui-handoff.md` (task 0183) |
| Data Table | `alina_telegram_notifier_state` — created and one row written (user report 2026-05-14) |
| Idempotency implementation | Done by user report (2026-05-14) — send/write test succeeded; **D-0209-A duplicate-skip validation succeeded on fully-pinned harness** — duplicate-skip conclusively validated |
| Duplicate-skip validation | **Conclusively validated** on fully-pinned harness (D-0209-A, 2026-05-14). Principle: same idempotency_key already present in `alina_telegram_notifier_state` ⇒ skip path, no Telegram, no new row |
| Token / chat id in repo | None |
| INBOX pending count | 0 |
| INBOX superseded count | 1 (D-0202-A → D-0206-A) |
| INBOX decided count | 20 |
| n8n template-first policy | Adopted (batch 0204–0208, 2026-05-14) — importable template preferred; manual node-by-node = fallback; templates inactive by default, no real secrets |
| Fully-pinned n8n template | Imported into n8n UI and Execute-validated (D-0206-A = 1 + D-0209-A = 1, user report 2026-05-14, tasks 0208/0211) — workflow `TEST - Alina Telegram notifier FULLY PINNED HARNESS ONLY`; `active=false`; Manual Trigger only; no Schedule Trigger; `$json.*`-only; duplicate-skip validated |
| Production-like Telegram notifier | **Active scheduled notification-only** — `TEST - Alina task completion Telegram notifier`; Schedule Trigger every 5 minutes; first tick success / Telegram arrived (2026-05-14) |
| Latest-done selection fix | ✅ **Fixed + scheduled validation complete — stable-after-fix** (batch 0246–0253, 2026-05-14) — bug fixed (numeric sort descending); manual validation: Telegram 0245 arrived; first scheduled tick: Telegram for task 0250; second scheduled tick: duplicate-skip 0250; **Mode A declared stable-after-fix** | `docs/automation/telegram-mode-a-latest-done-selection-fix.md` |
| Post-activation monitoring | `docs/automation/telegram-mode-a-post-activation-monitoring-checklist.md` (updated with latest-done selection diagnostic and post-fix stable status, 2026-05-14) |
| Next step | Routine-check posture: monitor passively; check execution log when Telegram arrives or on anomaly; no active watch needed |

---

## Open Technical Debts

| Debt | Status | Task |
|------|--------|------|
| PROJECT_STATE.md / CHECKPOINT.md physical compression | Completed 2026-05-13 | History moved to docs/history/PROJECT_LOG.md (audit-only) |
| `docs/INBOX.md` not created | **Resolved 2026-05-13** | Created in task 0141 |

---

## Rollback References

| Version | Tag | Deploy |
|---------|-----|--------|
| V1.9.1 | `v1.9.1-stable` | @23 |
| V1.9.0 | `v1.9.0-stable` | @22 |
| V1.8.10 | `v1.8.10-stable` | @21 |

Full deploy history → `docs/PROJECT_STATE.md`
Full project history → `docs/history/PROJECT_LOG.md` (audit-only, not default read)

---
→ Mandatory read order: `docs/LLMS.md` → this file → `docs/wiki/token-efficiency.md` → task file → task-specific canonicals
→ Full state (fallback/audit only): `docs/PROJECT_STATE.md` — do NOT read by default
→ Restart context (fallback only): `docs/CHECKPOINT.md` — do NOT read by default
