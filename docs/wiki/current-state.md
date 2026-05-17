# Wiki — Current State Snapshot

**Derived memory (Level 2) — last updated: 2026-05-17 (task 0440 external preview runtime version check)**
**Posture:** V2.2.0 + 0428 in production (@57). Phone test PASS 2026-05-17. HEAD/dev: ExternalImportPreview.html + runtime diagnostic (0440); Index.html unchanged at APP_BUILD='0428'; no deploy. Test: `/dev?route=external-import-preview` → click "Verifica runtime". Tags: v2.2.0-stable (@54/0427), v2.2.0-build0428-stable (@55/0428).
**Keep below ~100 lines. Move history to `docs/history/` or `docs/sessions/`. This is a snapshot, not a log.**
**Canonical sources win on conflict.**

---

## App

| Field | Value |
|---|---|
| Source version | **HEAD: V2.2.0 + 0406–0428 + ExternalImportPreview + Advanced Sheets Service read-only (0438)** / Production: V2.2.0 + 0406–0428 |
| Production version | **V2.2.0 + 0406–0428** (deployed @57 2026-05-17, URL unchanged — **phone test PASS 2026-05-17**) |
| Tag | **`v2.2.0-stable`** (on @54/0427) · **`v2.2.0-build0428-stable`** (on @55/0428, 2026-05-17) |
| Branch | **main** |
| Apps Script | **@57** (production, unchanged; HEAD has ExternalImportPreview.html + Advanced Sheets Service from 0438 — no deploy) |
| Last test | **PASS** — 2026-05-17, phone test on @57 / build 0428 (app boot OK) — preview page read-only fix pending test |
| Scope | **Production @57: 0428 · no-login · URL unchanged · external import NOT live · no deploy** / **HEAD: ExternalImportPreview.html added · Advanced Sheets Service enabled · previewExternalSheetImport uses Sheets API read-only · Index.html APP_BUILD='0428' unchanged** |

---

## Task State

| Item | Value |
|---|---|
| Last completed | **0440** (external preview runtime version check — added diagnostic function and button to determine actual runtime version — HEAD/dev push only — 2026-05-17) |
| Batch completed | …0436 (route fix), 0437 (route diagnostic), 0438 (readonly scope fix), 0439 (remote code verification), **0440 (runtime diagnostic)** |
| Queue | **0 pending** — Production stable @57/build 0428. HEAD/dev: ExternalImportPreview + runtime diagnostic. User should test: click "Verifica runtime" button. |
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
| V2.2.0 + 0406–0428 | — | **@57 rollback from broken 0430 (current production — phone test pending 2026-05-17)** |
| V2.2.0 + 0406–0430 | — | @56 external Google Sheet import (BROKEN — boot failure — rolled back by 0431) |
| V2.2.0 + 0406–0428 | **`v2.2.0-build0428-stable`** (2026-05-17) | @55 day bars color fix (PASS 2026-05-17 — rollback reference) |
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
