# Wiki — Current State Snapshot

**Derived memory (Level 2) — last updated: 2026-05-15 (task 0352)**
**Posture:** maintenance mode — app MVP mature at V2.0.1; automation baseline stable / monitor.
**Keep below ~100 lines. Move history to `docs/history/` or `docs/sessions/`. This is a snapshot, not a log.**
**Canonical sources win on conflict.**

---

## App

| Field | Value |
|---|---|
| Source version | **V2.0.1** (stable 2026-05-15) |
| Production version | **V2.0.1** (stable 2026-05-15) |
| Tag | **`v2.0.1-stable`** (created 2026-05-15, task 0331) |
| Branch | **main** |
| Apps Script | **@28** (V2.0.1 live; same deployment ID as @26/@24; deployed 2026-05-15) |
| Last test | OK 2026-05-15 post-deploy /exec — user "tutto ok 2.0.1" (task 0328) |
| Scope | **Stable prod V2.0.1 @28 · MVP mature / maintenance-ready** |

---

## Task State

| Item | Value |
|---|---|
| Last completed | **0352 — Final MVP mature close marker** (2026-05-15): V2.0.1 stable close complete; app is MVP mature / maintenance-ready. |
| Previous | **0351 — V2.0.2 candidate map** (2026-05-15). |
| Queue | `docs/tasks/queue/0353-v202-decision-or-maintenance-review.md` |

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

- App work only if user reports issue or explicitly requests.
- No speculative refactor; no deploy/tag/rollback without explicit gate.
- No runtime/n8n UI/Execute/Schedule/Telegram send without explicit gate.
- No provider API or new billing.
- No secrets, real chat IDs, tokenized URLs, OAuth material, or credential exports.
- `AGENTS.md` stays pointer-only.
- LLMS.md stays compact; it is not a history file.
- Future ideas remain future unless explicitly opened.

---

## Future / Not Active

CLI Printing Press, repo hygiene scanner, local AI router, browser bridge, dual-agent loop, VPS backup plan, n8n health check, INBOX auto-read, GitHub write automation.
V2.0.2 candidates: startup UX polish (on demand), no-login mode (explicit gate), minor cleanup. See task 0353.

---

## Rollback References

| Version | Tag | Deploy |
|---|---|---|
| V2.0.1 | `v2.0.1-stable` | @28 |
| V2.0.0 | `v2.0.0-stable` | @26 |
| V1.9.2 | `v1.9.2-stable` | @24 |
| V1.9.1 | `v1.9.1-stable` | @23 |

Full deploy history → `docs/PROJECT_STATE.md` (fallback/audit only)
