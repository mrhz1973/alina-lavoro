# Wiki — Current State Snapshot

**Derived memory (Level 2) — last updated: 2026-05-15 (task 0321)**
**Posture:** app finalization active (marker: task 0315); automation baseline stable / monitor.
**Keep below ~100 lines. Move history to `docs/history/` or `docs/sessions/`. This is a snapshot, not a log.**
**Canonical sources win on conflict.**

---

## App

| Field | Value |
|---|---|
| Version | **V1.9.3-prep** (source bumped; not deployed) |
| Tag | `v1.9.2-stable` (production) |
| Branch | **main** |
| Apps Script | **@24** (production; V1.9.3 not yet deployed) |
| Last test | OK 2026-05-15 (Redmi 9C NFC, user "tutto ok") |
| Scope | Active — V1.9.3 source ready; awaiting deploy gate (task 0322) |

---

## Task State

| Item | Value |
|---|---|
| Last completed | **0321 — V1.9.3 release prep** (2026-05-15): roadmap/LLMS.md/current-state updated; V1.9.3 source ready; deploy gate pending explicit authorization. |
| Previous | **0320 — V1.9.3 version bump** (2026-05-15): APP_VERSION + package.json → 1.9.3. |
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
