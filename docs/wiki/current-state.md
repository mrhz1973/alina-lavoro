# Wiki — Current State Snapshot

**Derived memory (Level 2) — last updated: 2026-05-14 (batch 0204–0208)**
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
| Last completed | 0207 — batch (0204–0208) docs-only (2026-05-14): user shifted priority to TIME AND RESULTS; adopted n8n template-first policy (importable template preferred, manual = fallback); 0204 documented partial-pinning root cause + template-first policy; 0205 created importable fully-pinned TEST-only n8n template (`docs/automation/n8n-workflows/templates/telegram-fully-pinned-validation-harness.template.json` + companion `.md`); 0206 created D-0206-A pending (import/inspection of template, no Execute) and superseded D-0202-A; 0207 propagated state updates; D-0206-A pending; D-0202-A superseded; duplicate-skip remains NOT conclusively validated; next valid step = D-0206-A import/inspection of fully-pinned template (no Execute); workflow inactive/manual-only; no Schedule Trigger; no token/chat id in repo; no real secrets in templates; INBOX: 1 pending (D-0206-A), 1 superseded (D-0202-A), 15 decided |
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
| Telegram workflow | Inactive — no Schedule Trigger |
| D-0173-A | Decided = 3 (task 0177, 2026-05-13) — schedule deferred; implement idempotency first |
| D-0180-A | Decided = 1 (task 0182, 2026-05-13) — idempotency/state-store runtime gate opened |
| D-0187-A | **Decided = 1, consumed/inconclusive** (batch 0188–0190, 2026-05-14; result recorded batch 0191–0193) — duplicate-skip validation gate opened, one run executed, result inconclusive due to latest-done drift |
| D-0193-A | **Decided = 1, consumed/inconclusive** (batch 0194–0198, 2026-05-14) — retry applied per user's prior conditional order; runtime TRUE branch / Telegram arrived / likely new-key send due to latest-done drift; NOT a confirmed idempotency bug |
| D-0197-A | **Decided = 1, not successful** (batch 0199–0203, 2026-05-14) — one manual pinned run executed; override node output correct for 0193; but downstream nodes used dynamic values; `Store notification state` wrote task 0198 (not 0193); `Load notification state` did not find existing 0193 row; classification: partial pinning / dynamic reference leakage, NOT confirmed pure idempotency bug |
| D-0202-A | **Superseded by D-0206-A** (batch 0204–0208, 2026-05-14) — template-first policy makes inspection/repair slower than importing a clean fully-pinned template; original design preserved at `docs/automation/telegram-fully-pinned-validation-harness-design.md` |
| D-0206-A | **Pending** (batch 0204–0208, 2026-05-14) — authorize import and inspection of fully-pinned n8n template into n8n UI, no Execute; template: `docs/automation/n8n-workflows/templates/telegram-fully-pinned-validation-harness.template.json` + companion `.md` |
| Idempotency design | Exists: `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md` |
| Idempotency checklist | Exists: `docs/automation/telegram-notifier-idempotency-implementation-checklist.md` |
| Runtime UI handoff | Exists: `docs/automation/telegram-idempotency-runtime-ui-handoff.md` (task 0183) |
| Data Table | `alina_telegram_notifier_state` — created and one row written (user report 2026-05-14) |
| Idempotency implementation | Done by user report (2026-05-14) — send/write test succeeded; three duplicate-skip validation attempts (D-0187-A, D-0193-A, D-0197-A) all failed to validate: D-0187-A/D-0193-A inconclusive (latest-done drift), D-0197-A not successful (partial pinning / dynamic reference leakage); requires fully-pinned harness with `$json.*` only |
| Token / chat id in repo | None |
| INBOX pending count | 1 (D-0206-A) |
| INBOX superseded count | 1 (D-0202-A → D-0206-A) |
| INBOX decided count | 15 (D-0197-A not successful, D-0193-A inconclusive, D-0187-A inconclusive) |
| n8n template-first policy | Adopted (batch 0204–0208, 2026-05-14) — importable template preferred; manual node-by-node = fallback; templates inactive by default, no real secrets |
| Fully-pinned n8n template | Created (task 0205) — `docs/automation/n8n-workflows/templates/telegram-fully-pinned-validation-harness.template.json` + companion `.md`; TEST-only; `active=false`; no Schedule Trigger; `$json.*`-only |
| Next step | User decision on D-0206-A: Option 1 (authorize import and inspection of fully-pinned n8n template into n8n UI, no Execute), Option 2 (do not import now), Option 3 (defer and refine template/design) |

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
