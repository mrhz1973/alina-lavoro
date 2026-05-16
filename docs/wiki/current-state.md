# Wiki — Current State Snapshot

**Derived memory (Level 2) — last updated: 2026-05-16 (task 0364)**
**Posture:** V2.1.1 hotfix source ready — quick resume persistence fix; deploy pending (task 0365).
**Keep below ~100 lines. Move history to `docs/history/` or `docs/sessions/`. This is a snapshot, not a log.**
**Canonical sources win on conflict.**

---

## App

| Field | Value |
|---|---|
| Source version | **V2.1.1** (hotfix ready 2026-05-16; deploy pending task 0365) |
| Production version | **V2.1.0** @29 (live) |
| Tag | **`v2.0.1-stable`** (last stable; v2.1.1-stable pending after 0366 test) |
| Branch | **main** |
| Apps Script | **@29** (V2.1.0 live; V2.1.1 deploy pending) |
| Last test | **FAILED** — task 0362: quick resume broken (code asked every reopen) |
| Scope | **V2.1.1 source ready · quick resume fix · deploy pending 0365** |

---

## Task State

| Item | Value |
|---|---|
| Last completed | **0364 — V2.1.1 quick resume fix** (2026-05-16): `tryQuickResumeFromCache_` fix; APP_VERSION 2.1.1. |
| Done | 0362 — post-deploy test FAILED (quick resume broken). |
| Queue | `docs/tasks/queue/0363-v21-stable-tag.md` (BLOCKED — skip until 0366 passes) |
| Next | task 0365 — deploy V2.1.1 (manual deploy gate) |

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
| V2.1.1 | pending `v2.1.1-stable` (after 0366 test) | @29 pending |
| V2.1.0 | no stable tag (0362 failed) | @29 |
| V2.0.1 | `v2.0.1-stable` | @28 |
| V2.0.0 | `v2.0.0-stable` | @26 |
| V1.9.2 | `v1.9.2-stable` | @24 |
| V1.9.1 | `v1.9.1-stable` | @23 |

Full deploy history → `docs/PROJECT_STATE.md` (fallback/audit only)
