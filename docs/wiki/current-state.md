# Wiki — Current State Snapshot

**Derived memory (Level 2) — last updated: 2026-05-17 (task 0416)**
**Posture:** V2.2.0 + 0406–0416 deployed @39 (2026-05-17). URL unchanged (same deployment ID as @37). Manual phone test pending → stable tag pending.
**Keep below ~100 lines. Move history to `docs/history/` or `docs/sessions/`. This is a snapshot, not a log.**
**Canonical sources win on conflict.**

---

## App

| Field | Value |
|---|---|
| Source version | **V2.2.0 + 0406–0416** (deployed @39) |
| Production version | **V2.2.0 + 0406–0416** (deployed 2026-05-17 @39, URL unchanged) |
| Tag | **`v2.1.1-stable`** (last stable; v2.2.0-stable pending phone test) |
| Branch | **main** |
| Apps Script | **@39** (2026-05-17; ID: AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ; URL unchanged) |
| Last test | **PASS** (0366, V2.1.1) — V2.2.0 @39 phone test pending |
| Scope | **V2.2.0 · no-login · 0406–0416 deployed @39 · URL unchanged · phone test pending · stable tag pending** |

---

## Task State

| Item | Value |
|---|---|
| Last completed | **0416** (settings/mesi UX fixes + deploy @39, 2026-05-17) |
| Batch completed | 0366–0371 (stable close), 0372–0377 (cleanup + autonomy), 0378–0383 (validation), 0384–0390 (V2.2.0 no-login), 0399–0403 (V2.2.0 frontend fix + polish), 0404 (deploy patch), 0405 (aggressive autonomy policy), 0406 (start-work state fix), 0407–0412 (import/export, source), 0413 (UI/state fixes, source), 0414 (deploy-info, source), 0415 (deploy @37), 0415b (CC spam fix), **0416 (settings/mesi UX + deploy @39)** |
| Queue | **0391** (post-deploy phone test for @39), **0392** (stable tag). Next gate: manual phone test on @39. |
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
V2.0.2 candidates: startup UX polish (on demand), minor cleanup. See task 0353. **no-login mode: implemented in V2.2.0.**

---

## Rollback References

| Version | Tag | Deploy |
|---|---|---|
| V2.2.0 + 0406–0416 | `v2.2.0-stable` (pending phone test) | @39 (URL same as @37) |
| V2.2.0 + 0406–0414 | — | @37 |
| V2.2.0 + 0406 fix | — | @35 |
| V2.2.0 patched | — | @33 |
| V2.1.1 | `v2.1.1-stable` (2026-05-16) | @30 |
| V2.1.0 | no stable tag (0362 failed) | @29 |
| V2.0.1 | `v2.0.1-stable` | @28 |
| V2.0.0 | `v2.0.0-stable` | @26 |
| V1.9.2 | `v1.9.2-stable` | @24 |
| V1.9.1 | `v1.9.1-stable` | @23 |

Full deploy history → `docs/PROJECT_STATE.md` (fallback/audit only)
