# Wiki — Current State Snapshot

**Derived memory (Level 2) — last updated: 2026-05-17 (task 0429 stable snapshot tag)**
**Posture:** V2.2.0 STABLE. Tag v2.2.0-stable (on @54/0427). Tag v2.2.0-build0428-stable (on @55/0428). Build 0428 deployed @55 (day bars fix, phone test PASS 2026-05-17). External sheet import NOT live. Maintenance mode.
**Keep below ~100 lines. Move history to `docs/history/` or `docs/sessions/`. This is a snapshot, not a log.**
**Canonical sources win on conflict.**

---

## App

| Field | Value |
|---|---|
| Source version | **V2.2.0 + 0406–0428** (day bars color fix, build 0428) |
| Production version | **V2.2.0 + 0406–0428** (deployed @55 2026-05-17, URL unchanged) |
| Tag | **`v2.2.0-stable`** (on @54/0427) · **`v2.2.0-build0428-stable`** (on @55/0428, 2026-05-17) |
| Branch | **main** |
| Apps Script | **@55** (day bars fix 0428 2026-05-17; ID: AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ; URL unchanged) |
| Last test | **PASS** — 2026-05-17, phone test on @55 / build 0428 (bars purple/teal/yellow OK) |
| Scope | **V2.2.0 stable · no-login · 0406–0428 deployed @55 · URL unchanged · tags v2.2.0-stable + v2.2.0-build0428-stable · import NOT live · maintenance mode** |

---

## Task State

| Item | Value |
|---|---|
| Last completed | **0429** (build 0428 stable snapshot tag — 2026-05-17) |
| Batch completed | 0366–0371 (stable close), 0372–0377 (cleanup + autonomy), 0378–0383 (validation), 0384–0390 (V2.2.0 no-login), 0399–0403 (V2.2.0 frontend fix + polish), 0404 (deploy patch), 0405 (aggressive autonomy policy), 0406 (start-work state fix), 0407–0412 (import/export, source), 0413 (UI/state fixes, source), 0414 (deploy-info, source), 0415 (deploy @37), 0415b (CC spam fix), 0416 (settings/mesi UX + deploy @39), 0417 (phone-test refinement batch + deploy @41), 0418 (compact-card redesign + deploy @43), 0419 (Mesi final layout cleanup + deploy @45), 0420 (UI refinements + external sheet import + deploy @47), 0421 (failed redeploy @48 — push not sent), 0422 (root cause fix + corrected push + redeploy @49), 0423 (boot stuck hotfix + redeploy @50), 0424 (force boot recovery + redeploy @51), 0425 (boot forensic hotfix + redeploy @52), 0426 (rollback to build 0419 + redeploy @53), 0427 (Mesi UI-only cleanup + deploy @54), **0391 (phone test PASS @54), 0392 (stable tag v2.2.0-stable)**, 0428 (day bars color fix deploy @55), **0429 (stable snapshot tag v2.2.0-build0428-stable)** |
| Queue | **0 pending** — V2.2.0 stable closed. Await user direction. |
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
| V2.2.0 + 0406–0428 | **`v2.2.0-build0428-stable`** (2026-05-17) | **@55 day bars color fix (current production — PASS 2026-05-17)** |
| V2.2.0 + 0406–0427 | **`v2.2.0-stable`** (2026-05-17) | @54 UI-only patch |
| V2.2.0 + 0406–0419 | — | @53 rollback (2026-05-17) |
| V2.2.0 + 0406–0425 | — | @52 boot forensic hotfix (broken — superseded by rollback) |
| V2.2.0 + 0406–0424 | — | @51 force boot recovery |
| V2.2.0 + 0406–0423 | — | @50 boot hotfix |
| V2.2.0 + 0406–0420 | — | @49 (0422 corrected push) |
| V2.2.0 + 0406–0419 | — | @45 (original 0419 deploy) |
| V2.2.0 + 0406–0418 | — | @43 |
| V2.2.0 + 0406–0417 | — | @41 |
| V2.2.0 + 0406–0416 | — | @39 |
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
