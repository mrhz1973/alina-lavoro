# Wiki — Current State Snapshot

**Derived memory (Level 2) — last updated: 2026-05-15 (task 0326)**
**Posture:** app finalization active (marker: task 0315); automation baseline stable / monitor.
**Keep below ~100 lines. Move history to `docs/history/` or `docs/sessions/`. This is a snapshot, not a log.**
**Canonical sources win on conflict.**

---

## App

| Field | Value |
|---|---|
| Source version | **V2.0.1** (prep 2026-05-15, task 0325 — not yet deployed) |
| Production version | **V2.0.0** (stable 2026-05-15) |
| Tag | **`v2.0.0-stable`** (created 2026-05-15, task 0324) |
| Branch | **main** |
| Apps Script | **@26** (V2.0.0 live; same deployment ID as @24; deployed 2026-05-15) |
| Last test | OK 2026-05-15 post-deploy /exec — user "tutto ok post deploy" (task 0324) |
| Scope | **Stable prod V2.0.0** · source V2.0.1-prep awaiting test gate + deploy gate |

---

## Task State

| Item | Value |
|---|---|
| Last completed | **0326 — V2.0.1 quick resume review** (2026-05-15): startup flow reviewed, no blocking issue; safe for manual test gate. |
| Previous | **0325 — V2.0.1 quick resume prep** (2026-05-15): quick resume from cache, APP_VERSION 2.0.1, no deploy. |
| Queue | `docs/tasks/queue/` |

---

## Telegram Mode A / INBOX

| Item | State |
|---|---|
| Telegram workflow | Active Schedule Trigger every 5 minutes; notification-only |
| Stability | **stable-after-fix** after latest-done numeric sort fix and duplicate-skip validation |
| INBOX pending | **0** |
| INBOX decided | 21 |
| INBOX superseded | 1 (`D-0202-A → D-0206-A`) |
| Telegram scope | Must not answer INBOX or record decisions |

Routine posture: monitor passively. Check logs only when Telegram arrives unexpectedly, duplicates, or anomaly appears.

---

## Current Constraints

- No app work unless explicitly requested.
- No runtime/n8n UI/Execute/Schedule/Telegram send without explicit gate.
- No deploy/tag/rollback.
- No provider API or new billing.
- No secrets, real chat IDs, tokenized URLs, OAuth material, or credential exports.
- `AGENTS.md` stays pointer-only.
- LLMS.md stays compact; it is not a history file.
- Future ideas remain future unless explicitly opened.

---

## Future / Not Active

CLI Printing Press, repo hygiene scanner, local AI router, browser bridge, dual-agent loop, VPS backup plan, n8n health check, INBOX auto-read, GitHub write automation.

---

## Rollback References

| Version | Tag | Deploy |
|---|---|---|
| V1.9.1 | `v1.9.1-stable` | @23 |
| V1.9.0 | `v1.9.0-stable` | @22 |
| V1.8.10 | `v1.8.10-stable` | @21 |

Full deploy history → `docs/PROJECT_STATE.md` (fallback/audit only)
