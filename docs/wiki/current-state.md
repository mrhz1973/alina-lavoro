# Wiki — Current State Snapshot

**Derived memory (Level 2) — planning note 2026-10-27; historical runtime snapshot last updated 2026-05-18. Runtime and legacy automation status were not verified live; do not restart automations from documentation alone.**
**Posture:** V2.2.0 + 0428 in production (@57). Phone test PASS 2026-05-17. HEAD/dev: ExternalImportPreview.html + runtime diagnostic + inline route + diagnostic layer + normalized preview + hardened JS bindings - clasp sync pipeline working; Index.html unchanged at APP_BUILD='0428'; no deploy. Test: `/dev?route=external-import-preview-inline&t=0452`. Tags: v2.2.0-stable (@54/0427), v2.2.0-build0428-stable (@55/0428).
**Keep below ~100 lines. Move history to `docs/history/` or `docs/sessions/`. This is a snapshot, not a log.**
**Canonical sources win on conflict.**

---

## App

**Version label (2026-11-06):** Candidate source `2a5edf1` replaces the inherited 2.2.0 / 0428 label with the deployment version. All 61 existing automated checks passed. Google created version 17 and the private preview, which shares real data, showed Versione: 17 in settings after refresh. The usual link remains on version 16. Automatic approval review rejected promoting version 17 because prior explicit authorization covered version 16. Owner consent is required for this promotion. Before each future release, update the source version constant and verify the immutable Apps Script version before deployment.

**Startup names fix (2026-11-06):** Version 16 supplies the configured workplace names with the initial page and uses the selected name as the heading. Pending local name changes take priority and queued work is preserved. Sixty-one automated tests passed. After the owner explicitly approved publication, Google confirmed version 16 on the usual link. The browser showed both names before data loading finished, the correct heading for each workplace and synchronized status. No attendance records were added in the verification. Android behavior has not been verified.

**Functional review (2026-11-05):** Development candidate protects completed variable-work shifts from accidental restart, preserves the original record when editing a different date, reports synchronization failures accurately, and improves custom-color contrast. Simulated B&B and Ekom journeys and read-only browser checks passed. **Published for the confirmed single-phone workflow.** The owner records and edits all hours on one phone. All 58 automated checks passed again, including offline variable-work recovery, two scheduled shifts on a shared workday and a date-specific correction. A stale variable-work edit from another device can still overwrite a newer one. Multiple editing devices are outside the confirmed workflow. Testing on the physical Android phone, on-site location and home printer is still pending. The usual deployment served version 15 (source `40eb743`) before the version 16 startup names fix described above. Google confirmed both versions during their releases. The usual link loaded both workplaces, showed synchronized status and opened the attendance calendar and monthly PDF with print controls. Verification used read-only navigation.

An isolated local conflict-protection prototype passed 78 JavaScript and 2 PDF tests with synthetic data. It is **not deployable**: legacy queue reconciliation and conflict UI are incomplete, some existing import/maintenance paths are disabled, and older clients or external sheet edits can bypass its guards. A safe migration and real isolated-service and device tests are still required. The prototype is not included in this branch.

**Color adjustment (2026-11-05):** A more saturated workplace background, derived from the user's chosen color, was tested in the isolated preview with 53 JavaScript checks and a narrow browser viewport. Version 15 includes these colors on the usual link. Image files remain outside this repository.

**Isolated UI update (2026-11-04):** Workplace colors are configurable; calendar markers distinguish recorded workplaces. Optional backgrounds and a logo are injected only into private staging: `node tools/inject_workplace_media.cjs INPUT OUTPUT VARIABLE1 VARIABLE2 SCHEDULED LOGO`. Keep the image files outside this public repository. The isolated deployment's browser and a narrow viewport were checked; real Android performance is unverified.

**Isolated candidate:** `codex/multi-lavoro-registro` contains separate scheduled shifts, date-specific overrides, one shared navigation bar, automatic workplace selection and a PDF preview using a separately held template; see `docs/roadmap.md`. A new Apps Script project and private Sheet are separate from the daily app and restricted to the deploying account. Browser startup, configuration read, a settings change and one user-entered variable-work shift were verified in the Sheet. After specific approval a historical attendance snapshot and payslip summaries were copied and checked; future changes in the two apps are not synchronized. Following a user-reported failure opening a new tab, the PDF is rendered inside the app, with zoom; the isolated test and user-facing deployments displayed a real empty-month report with its template and header, and the user confirmed it is visible without specifying the device. A print button invokes the device's print dialog; the Android dialog and home printer have not been verified. The renderer loads on demand and the preview canvas is released on close; real phone performance remains unmeasured. Scheduled-work saving, phone/GPS and unattended monthly PDF generation remain unverified. Keep IDs, personal data, locations and templates outside this repository. The historical baseline below describes `main`, not a verified current runtime.

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
| Last completed | **0452** (harden inline preview button binding — made buttons work in Apps Script iframe — restored inline onclick fallback — added initExternalPreviewButtons with document.readyState check — initializes immediately if DOM loaded — JS ready marker 0452 — preserves normalizedPreview and 0448-runtime-forensic marker — 2026-05-18) |
| Batch completed | …0436 (route fix), 0437 (route diagnostic), 0438 (readonly scope fix), 0439 (remote code verification), 0440 (runtime diagnostic), 0441 (HTML sync fix), 0442 (inline page), 0443 (force route), 0444 (sync issue), 0445 (diagnostic layer), 0446 (sync pipeline fix), 0447 (runtime mapping fix), 0448 (deployment routing forensic), 0450 (preview normalization), 0451 (JS bindings fix), **0452 (hardened bindings)** |
| Queue | **0 pending** — Production stable @57/build 0428. HEAD/dev: ExternalImportPreview + runtime diagnostic + inline route + diagnostic layer + normalized preview + hardened JS bindings (no deploy). |
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
