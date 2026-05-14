# Wiki — Current State Snapshot

**Derived memory (Level 2) — last updated: 2026-05-14 (batch 0185–0187)**
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
| Last completed | 0198 — batch (0194–0198) docs-only (2026-05-14): 0194 recorded D-0193-A retry attempt inconclusive due to latest-done drift (TRUE branch / Telegram arrived / likely new-key send, not confirmed idempotency bug); 0195 documented root cause and 3 result categories (a same-key success, b new-key send, c true idempotency failure); 0196 created pinned-file duplicate-skip validation design; 0197 created D-0197-A pending; 0198 propagated state updates; D-0193-A moved to Decided (= 1, inconclusive); duplicate-skip remains NOT conclusively validated; next valid gate = pinned-file validation; workflow inactive/manual-only; no Schedule Trigger; no token/chat id in repo; INBOX: 1 pending (D-0197-A), 14 decided |
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
| D-0197-A | **Pending** (batch 0194–0198, 2026-05-14) — one future manual pinned-file duplicate-skip validation run; design: `docs/automation/telegram-pinned-file-duplicate-skip-validation-design.md` |
| Idempotency design | Exists: `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md` |
| Idempotency checklist | Exists: `docs/automation/telegram-notifier-idempotency-implementation-checklist.md` |
| Runtime UI handoff | Exists: `docs/automation/telegram-idempotency-runtime-ui-handoff.md` (task 0183) |
| Data Table | `alina_telegram_notifier_state` — created and one row written (user report 2026-05-14) |
| Idempotency implementation | Done by user report (2026-05-14) — send/write test succeeded; two duplicate-skip validation attempts (D-0187-A, D-0193-A) both inconclusive due to latest-done drift; structurally requires pinned-file input |
| Token / chat id in repo | None |
| INBOX pending count | 1 (D-0197-A) |
| INBOX decided count | 14 (D-0193-A inconclusive, D-0187-A inconclusive) |
| Next step | User decision on D-0197-A: Option 1 (authorize one pinned-file run per `docs/automation/telegram-pinned-file-duplicate-skip-validation-design.md`), Option 2 (do not run now), Option 3 (defer and refine design) |

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
