# Wiki — Current State Snapshot

**Derived memory (Level 2) — last updated: 2026-05-14 (batch 0215–0218)**
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
| Last completed | 0218 — batch (0215–0218) docs-only (2026-05-14): D-0213-A = 3 decided (schedule activation deferred; design-first path opened); design document `docs/automation/telegram-mode-a-schedule-activation-design-first-path.md` created (task 0216); new D-0217-A pending (authorize controlled n8n UI readiness inspection only; no Execute, no Schedule Trigger, no Telegram send); Telegram Mode A remains manual-only/inactive; duplicate-skip remains conclusively validated (D-0209-A); D-0209-A/D-0206-A remain decided; D-0202-A remains superseded; next valid step = user decision on D-0217-A; INBOX: 1 pending (D-0217-A), 1 superseded (D-0202-A), 18 decided (D-0213-A = 3 added) |
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
| D-0206-A | **Decided = 1, applied/completed** (batch 0208–0210, 2026-05-14) — import and inspection of fully-pinned n8n template authorized and performed; user report `import/inspection ok`; workflow `TEST - Alina Telegram notifier FULLY PINNED HARNESS ONLY` present in n8n UI (`active=false`); no Execute performed |
| D-0209-A | **Decided = 1, applied/completed** (batch 0211–0214, 2026-05-14) — exactly one manual Execute run of imported fully-pinned harness; result `fully pinned duplicate skip succeeded`: `Load notification state` found existing row, FALSE branch, no Telegram message, no new Data Table row; duplicate-skip conclusively validated on fully-pinned harness |
| D-0213-A | **Decided = 3** (batch 0215–0218, 2026-05-14) — schedule activation deferred; design-first path opened (`docs/automation/telegram-mode-a-schedule-activation-design-first-path.md`); next narrower gate is D-0217-A |
| D-0217-A | **Pending** (batch 0215–0218, 2026-05-14) — authorize controlled n8n UI readiness inspection only for the intended Telegram Mode A notifier workflow; no Execute, no Schedule Trigger, no Telegram send, no workflow import/export, queue reader untouched |
| Idempotency design | Exists: `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md` |
| Idempotency checklist | Exists: `docs/automation/telegram-notifier-idempotency-implementation-checklist.md` |
| Runtime UI handoff | Exists: `docs/automation/telegram-idempotency-runtime-ui-handoff.md` (task 0183) |
| Data Table | `alina_telegram_notifier_state` — created and one row written (user report 2026-05-14) |
| Idempotency implementation | Done by user report (2026-05-14) — send/write test succeeded; three duplicate-skip validation attempts (D-0187-A, D-0193-A, D-0197-A) all failed to validate (latest-done drift / partial pinning); **D-0209-A duplicate-skip validation succeeded on fully-pinned harness (`fully pinned duplicate skip succeeded`, 2026-05-14)** — duplicate-skip conclusively validated |
| Duplicate-skip validation | **Conclusively validated** on fully-pinned harness (D-0209-A, 2026-05-14). Principle: same idempotency_key already present in `alina_telegram_notifier_state` ⇒ skip path, no Telegram, no new row |
| Token / chat id in repo | None |
| INBOX pending count | 1 (D-0217-A) |
| INBOX superseded count | 1 (D-0202-A → D-0206-A) |
| INBOX decided count | 18 (D-0213-A = 3 schedule activation deferred / design-first path opened added; D-0209-A = 1 fully pinned duplicate skip succeeded; D-0206-A = 1 import/inspection ok; D-0197-A not successful; D-0193-A inconclusive; D-0187-A inconclusive) |
| n8n template-first policy | Adopted (batch 0204–0208, 2026-05-14) — importable template preferred; manual node-by-node = fallback; templates inactive by default, no real secrets |
| Fully-pinned n8n template | Imported into n8n UI and Execute-validated (D-0206-A = 1 + D-0209-A = 1, user report 2026-05-14, tasks 0208/0211) — workflow `TEST - Alina Telegram notifier FULLY PINNED HARNESS ONLY`; `active=false`; Manual Trigger only; no Schedule Trigger; `$json.*`-only; duplicate-skip validated |
| Production-like Telegram notifier | Manual-only / inactive — remains so; D-0213-A = 3 deferred schedule activation; D-0217-A is the next narrower gate (readiness inspection only) |
| Next step | User decision on D-0217-A: Option 1 (authorize controlled n8n UI readiness inspection only — no Execute, no Schedule, no Telegram send), Option 2 (keep manual-only and skip inspection), Option 3 (defer and refine design further) |

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
