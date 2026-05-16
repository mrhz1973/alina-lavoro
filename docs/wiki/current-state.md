# Wiki — Current State Snapshot

**Derived memory (Level 2) — last updated: 2026-05-16 (task 0383)**
**Posture:** V2.1.1 stable — tag `v2.1.1-stable` created; maintenance-mode, monitor only.
**Keep below ~100 lines. Move history to `docs/history/` or `docs/sessions/`. This is a snapshot, not a log.**
**Canonical sources win on conflict.**

---

## App

| Field | Value |
|---|---|
| Source version | **V2.1.1** (deployed 2026-05-16) |
| Production version | **V2.1.1** (deployed 2026-05-16) |
| Tag | **`v2.1.1-stable`** (created 2026-05-16, task 0367) |
| Branch | **main** |
| Apps Script | **@30** (V2.1.1 live; same deployment ID as @29/@28/@26/@24; deployed 2026-05-16) |
| Last test | **PASS** (0366, V2.1.1) — "tutto ok 2.1.1" (2026-05-16) |
| Scope | **V2.1.1 stable · quick resume fix · tag `v2.1.1-stable` · maintenance-mode** |

---

## Task State

| Item | Value |
|---|---|
| Last completed | **0383 — autonomy validation batch close** (2026-05-16): batch 0378–0383 done. |
| Batch completed | 0366–0371 (stable close), 0372–0377 (cleanup + autonomy), 0378–0383 (validation) |
| Queue | none pending |
| Superseded | `docs/tasks/queue/0363-v21-stable-tag.md` (superseded by 0367) |

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
| V2.1.1 | `v2.1.1-stable` (2026-05-16) | @30 |
| V2.1.0 | no stable tag (0362 failed) | @29 |
| V2.0.1 | `v2.0.1-stable` | @28 |
| V2.0.0 | `v2.0.0-stable` | @26 |
| V1.9.2 | `v1.9.2-stable` | @24 |
| V1.9.1 | `v1.9.1-stable` | @23 |

Full deploy history → `docs/PROJECT_STATE.md` (fallback/audit only)
