# Wiki — Current State Snapshot

**Derived memory (Level 2) — last updated: 2026-05-16 (task 0365)**
**Posture:** V2.1.1 deployed @30 — quick resume persistence fix; stable tag pending manual test (task 0366).
**Keep below ~100 lines. Move history to `docs/history/` or `docs/sessions/`. This is a snapshot, not a log.**
**Canonical sources win on conflict.**

---

## App

| Field | Value |
|---|---|
| Source version | **V2.1.1** (deployed 2026-05-16) |
| Production version | **V2.1.1** (deployed 2026-05-16) |
| Tag | **`v2.0.1-stable`** (last stable; v2.1.1-stable pending 0366) |
| Branch | **main** |
| Apps Script | **@30** (V2.1.1 live; same deployment ID as @29/@28/@26/@24; deployed 2026-05-16) |
| Last test | **FAILED** (0362, V2.1.0) — Pending 0366 (V2.1.1) |
| Scope | **V2.1.1 deployed · quick resume fix · stable tag pending 0366** |

---

## Task State

| Item | Value |
|---|---|
| Last completed | **0365 — V2.1.1 deploy** (2026-05-16): V2.1.1 deployed @30. |
| Done | 0362 — post-deploy test FAILED (V2.1.0 quick resume broken). |
| Queue | `docs/tasks/queue/0366-v211-post-deploy-test.md` (GATE: manual test) |
| Queue | `docs/tasks/queue/0367-v211-stable-tag.md` (GATE: after 0366 OK) |
| Blocked | `docs/tasks/queue/0363-v21-stable-tag.md` (superseded by 0367) |

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
| V2.1.1 | pending `v2.1.1-stable` (after 0366) | @30 |
| V2.1.0 | no stable tag (0362 failed) | @29 |
| V2.0.1 | `v2.0.1-stable` | @28 |
| V2.0.0 | `v2.0.0-stable` | @26 |
| V1.9.2 | `v1.9.2-stable` | @24 |
| V1.9.1 | `v1.9.1-stable` | @23 |

Full deploy history → `docs/PROJECT_STATE.md` (fallback/audit only)
