# Wiki — Current State Snapshot

**Derived memory (Level 2) — last updated: 2026-05-16 (task 0361)**
**Posture:** V2.1.0 deployed — analytics/charts on Mesi; stable tag pending post-deploy test (task 0362).
**Keep below ~100 lines. Move history to `docs/history/` or `docs/sessions/`. This is a snapshot, not a log.**
**Canonical sources win on conflict.**

---

## App

| Field | Value |
|---|---|
| Source version | **V2.1.0** (deployed 2026-05-16) |
| Production version | **V2.1.0** (deployed 2026-05-16) |
| Tag | **`v2.0.1-stable`** (last stable; v2.1.0-stable pending 0362) |
| Branch | **main** |
| Apps Script | **@29** (V2.1.0 live; same deployment ID as @28/@26/@24; deployed 2026-05-16) |
| Last test | Pending — task 0362 post-deploy test required |
| Scope | **V2.1.0 deployed · analytics/charts Mesi · stable tag pending 0362** |

---

## Task State

| Item | Value |
|---|---|
| Last completed | **0361 — V2.1 deploy** (2026-05-16): V2.1.0 deployed @29. |
| Batch completed | **0353–0360** (V2.1 analytics implementation, 2026-05-16). |
| Queue | `docs/tasks/queue/0362-v21-post-deploy-test.md` (GATE: manual test) |
| Queue | `docs/tasks/queue/0363-v21-stable-tag.md` (GATE: after 0362 OK) |

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
| V2.1.0 | pending `v2.1.0-stable` (after 0362) | @29 |
| V2.0.1 | `v2.0.1-stable` | @28 |
| V2.0.0 | `v2.0.0-stable` | @26 |
| V1.9.2 | `v1.9.2-stable` | @24 |
| V1.9.1 | `v1.9.1-stable` | @23 |

Full deploy history → `docs/PROJECT_STATE.md` (fallback/audit only)
