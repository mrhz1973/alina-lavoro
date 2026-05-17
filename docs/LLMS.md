# LLMS.md — Alina Lavoro Agent Entry Point

**For AI agents:** read this file first. It is derived memory (Level 2); canonical docs win on conflict.

**Compact constraint:** LLMS.md should stay below ~150 lines. If it grows beyond that, move older detail to `docs/wiki/current-state.md`, canonical docs, or `docs/history/PROJECT_LOG.md`. LLMS.md is an entry point, not a history file.

---

## Mandatory read order

1. `docs/LLMS.md`
2. `docs/wiki/current-state.md`
3. `docs/wiki/token-efficiency.md`
4. Assigned task file, if any
5. Only task-specific canonical docs

**Do not read by default:**
- `docs/PROJECT_STATE.md` — fallback/audit only; justify if opened.
- `docs/CHECKPOINT.md` — restart context only; justify if opened.
- `docs/history/PROJECT_LOG.md` — audit only.

---

## Current App State

| Field | Value |
|---|---|
| Source version | **V2.2.0 + 0406–0428** (HEAD/dev: build 0428, restored from stable tag; production: build 0428) |
| Production version | **V2.2.0 + 0406–0428** (deployed @57 2026-05-17, URL unchanged — **phone test PASS 2026-05-17**) |
| Tag | **`v2.2.0-stable`** (on @54/0427, 2026-05-17) · **`v2.2.0-build0428-stable`** (on @55/0428, 2026-05-17) |
| Branch | **main** (`dev` legacy/inactive) |
| Apps Script deploy | **@57** (rollback to build 0428 2026-05-17; ID: AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ; URL unchanged) |
| Last manual test | **PASS** — 2026-05-17, phone test on @57 / build 0428 (app boot OK) |
| App scope | **Production @57: V2.2.0 + 0428 · no-login · URL unchanged · tags v2.2.0-stable + v2.2.0-build0428-stable · external import NOT live · no deploy** / **HEAD/dev: ExternalImportPreview.html added (0435) · doGet routes ?page=external-import-preview · spreadsheets.readonly in appsscript.json · Index.html APP_BUILD='0428' unchanged · NO deploy** |

---

## Active Workstream

**External preview read-only scope fix (2026-05-17, task 0438):** Fixed `previewExternalSheetImport()` to use Advanced Sheets Service instead of `SpreadsheetApp.openById` (which required full spreadsheets scope). Implemented read-only access via `Sheets.Spreadsheets.get()` and `Sheets.Spreadsheets.Values.get()`. Added Advanced Sheets Service to appsscript.json. Maintained existing scopes (spreadsheets.currentonly, spreadsheets.readonly). Added specific error messages for authorization/access issues. Production @57 untouched. HEAD/dev push only. Test: `/dev?route=external-import-preview`. Session: `docs/sessions/2026-05-17-external-preview-readonly-scope-fix.md`.

**Force inline preview route (2026-05-17, task 0443):** Fixed route interception issue where `/dev?route=external-import-preview-inline` opened Home instead of inline page. Added explicit route check FIRST in doGet(e) and forced push to remote runtime. Production @57 untouched. HEAD/dev push only. Test: `/dev?route=external-import-preview-inline`. Session: `docs/sessions/2026-05-17-force-inline-preview-route.md`.

**External preview inline page (2026-05-17, task 0442):** Created new DEV inline route `/dev?route=external-import-preview-inline` to bypass HTML sync issues. Implemented `buildExternalImportPreviewInlineHtml_()` function serving complete HTML page directly from Code.gs with runtime diagnostic and preview functionality. Production @57 untouched. HEAD/dev push only. Test: `/dev?route=external-import-preview-inline`. Session: `docs/sessions/2026-05-17-external-preview-inline-page.md`.

**Verify external preview HTML push (2026-05-17, task 0441):** Fixed HTML sync issue where `npm run sync` failed to copy updated ExternalImportPreview.html to `.gas/`, causing runtime diagnostic button to be missing. Manually copied HTML file and pushed with `clasp push --force`. Production @57 untouched. HEAD/dev push only. Test: `/dev?route=external-import-preview` → "Verifica runtime" button should now be visible. Session: `docs/sessions/2026-05-17-verify-external-preview-html-push.md`.

**External preview runtime version check (2026-05-17, task 0440):** Added runtime diagnostic `externalImportPreviewRuntimeInfo()` and "Verifica runtime" button to ExternalImportPreview.html to determine which code version is actually executing in `/dev`. User still sees SpreadsheetApp.openById error despite correct source; this diagnostic will identify if runtime is old/cached or if issue is client-side. Production @57 untouched. HEAD/dev push only. Test: `/dev?route=external-import-preview` → click "Verifica runtime". Session: `docs/sessions/2026-05-17-external-preview-runtime-version-check.md`.

**Verify 0438 remote code (2026-05-17, task 0439):** Diagnostic confirmed remote Apps Script HEAD contains correct 0438 fix - no `SpreadsheetApp.openById` active, Advanced Sheets Service enabled, proper readonly scopes. User error likely browser cache or authorization pending. No code changes needed. Session: `docs/sessions/2026-05-17-verify-0438-remote-code.md`.

**Route diagnostic fix (2026-05-17, task 0437):** Added `getRequestRoute_(e)` helper (reads `page`/`route`/`view`/`alinaPage`), `isExternalImportPreviewRoute_()`, and `debug-route` diagnostic page. doGet now checks all 4 parameter names before defaulting to Index. Pushed HEAD/dev. No deploy. Test: `/dev?route=debug-route` (verify params), `/dev?route=external-import-preview` (preview page). Session: `docs/sessions/2026-05-17-external-import-preview-route-diagnostic.md`.

**Route fix for external import preview page (2026-05-17, task 0436):** doGet routing made robust — `String(...).trim().toLowerCase()` + try/catch + aliases (`externalimportpreview`, `import-preview`). Previous strict `===` match may have failed due to URL encoding or GAS caching. Re-pushed HEAD/dev. No deploy. Test URL: `/dev?page=external-import-preview`. Full session: `docs/sessions/2026-05-17-external-import-preview-page-route-fix.md`.

**Separate external import preview page (2026-05-17, task 0435):** New architecture — completely separate ExternalImportPreview.html page, accessible only via `/dev?page=external-import-preview`. doGet routes the parameter defensively; default route (no parameter) unchanged. previewExternalSheetImport backend function (read-only). spreadsheets.readonly scope added to appsscript.json. Index.html NOT modified (APP_BUILD='0428'). No deploy. Test URL: `/dev?page=external-import-preview`. Full session: `docs/sessions/2026-05-17-external-import-preview-page-canary.md`.

**Rollback broken preview canary (2026-05-17, task 0434):** 0433 /dev boot test FAIL — "Apertura app…" stuck. Root cause: `renderExternalSheetPreviewSection_()` inside `renderSettings()` causes boot hang. No hotfix. HEAD/dev restored to build 0428 from tag `v2.2.0-build0428-stable`. `spreadsheets.readonly` removed. `previewExternalSheetImport` removed. `clasp push --force` done — HEAD updated, no deploy. Production @57 unchanged. Full session: `docs/sessions/2026-05-17-rollback-broken-preview-canary.md`. Future import attempt must use separate ultra-minimal dev page or lazy render only.

**External sheet preview canary (2026-05-17, task 0433) [FAILED — rolled back by 0434]:** Step B of safe design. Preview-only UI + `previewExternalSheetImport` backend — caused /dev boot failure. Rolled back. Full session: `docs/sessions/2026-05-17-external-sheet-preview-only-canary.md`.

**External sheet import safe design (2026-05-17, task 0432):** docs-only. Design rules: no production deploy without canary, no import in boot path, 5-step progressive strategy (A→E), preview-only before any write, max 1 hotfix then rollback. Full design: `docs/sessions/2026-05-17-external-sheet-import-safe-design.md`.

**ROLLBACK to build 0428 @57 (2026-05-17, task 0431) — phone test PASS:** Build 0430 broke boot ("Apertura app…" stuck). No hotfix attempted. Immediate rollback: restored src/frontend/Index.html, src/backend/Code.gs, appsscript.json from tag v2.2.0-build0428-stable. spreadsheets.readonly scope removed (back to spreadsheets.currentonly only). previewImportFromSpreadsheet is stub only (no external sheet access). applyReplaceFromExternalSheet not present. clasp push --force + deploy @57 (same ID/URL). Remote verified via clasp pull: APP_BUILD='0428'. No tag. **Phone test PASS 2026-05-17 — app boot OK.**

**External Google Sheet import isolated @56 (2026-05-17, task 0430) [ROLLED BACK — app boot broken]:** Replaced stub with real implementation — caused "Apertura app…" boot failure. Rolled back by task 0431.

**Build 0428 stable snapshot (2026-05-17, task 0429):** docs-only tag task. Tag `v2.2.0-build0428-stable` created on @55 / build 0428. `v2.2.0-stable` unchanged on @54 / 0427. No code, no deploy.

**Day bars color fix @55 (2026-05-17, task 0428):** UI-only fix — `.month-detail-day-bar-fill` lacked `display:block`; bars appeared all dark. Added `display:block`; moved bar CSS to general section. Legend colors (purple/teal/yellow) now render. Backend and appsscript.json unchanged. APP_BUILD='0428'. Phone test PASS 2026-05-17.

**V2.2.0 STABLE CLOSED (2026-05-17, tasks 0391+0392):** Phone test PASS on @54 / build 0427. Tag v2.2.0-stable created. Import Google Sheet external NOT live (future separate workstream). App in maintenance mode.

**Mesi UI-only cleanup @54 (2026-05-17, task 0427):** UI-only patch on top of rollback 0419 base. Removed duplicate month display (per-month chart inside year accordion); added compact year-stats-strip (ore/giorni/guadagno inline); inline stats in month card head; year toggle highlight; `hoursLabel_()` function. APP_BUILD='0427'. Index.html only — Code.gs and appsscript.json unchanged.

**Rollback to build 0419 @53 (2026-05-17, task 0426):** Builds 0420–0425 left app broken ("Errore avvio app"). Restored src/frontend/Index.html, src/backend/Code.gs, appsscript.json from commit e476618 (0419 state). Removed stale .gas/Code.js. clasp push --force + deploy @53 (same ID/URL). APP_BUILD='0419'. External sheet import (0420) not live. 0391/0392 pending.

**Boot forensic hotfix @52 (2026-05-17, task 0425):** [superseded by rollback 0426] APP_BUILD='0425' deployed @52 — boot error persisted.

**Force boot recovery @51 (2026-05-17, task 0424):** Second boot stuck fix pass. Added `ensureStateShape_()` centralised guard; DOMContentLoaded now guarantees immediate render() from local state (no async dependency); render failure → `renderBootFallback_()` (Riprova + Impostazioni); `window.onerror` calls fallback if bootPlaceholder still visible; `initBackground_()` + `setupMobileUi_()` wrapped in try/catch; 3s timer removed. APP_BUILD='0424'. Remote verified @51.

**Boot stuck hotfix @50 (2026-05-17, task 0423):** App stuck on "Apertura app…" after @49. Fix: null-guards, applyThemeLang null-safe, 3s fallback timer, showApp try/catch. APP_BUILD='0423'.

**Root cause fix @49 (2026-05-17, task 0422):** `clasp pull` confirmed remote HEAD still had APP_BUILD='0419' — the `clasp push` in task 0420/0421 never actually sent 0420 to Apps Script remote. Fix: `rm .gas/Code.js` (stale pull artifact) + `clasp push --force` + `clasp deploy --deploymentId` → @49 (same ID/URL). Remote verified via pull: APP_BUILD='0420'. Phone test pending → 0391 → 0392.

**Fix redeploy @48 (2026-05-17, task 0421):** Attempted redeploy — re-ran `clasp deploy --deploymentId` → @48 but push hadn't sent 0420; remote still served 0419. Fixed by task 0422.

**Deployed @47 (2026-05-17, task 0420):** Theme flash fix (sync `<script>` in `<head>` applies theme from localStorage before CSS); year stats compact inline strip (ore rounded `213h`, giorni + guadagno same line, accordion highlight, no duplicate month chart); day cards in Month Detail flex row (date left, stats right); external sheet import in Settings (Preview + mandatory checkbox + Replace, backend `previewImportFromSpreadsheet` + `applyReplaceFromExternalSheet` with LockService + backup guard); `spreadsheets.readonly` scope added to `appsscript.json`. APP_BUILD='0420'. URL unchanged. Phone test pending → 0391 → 0392.

**Deployed @45 (2026-05-17, task 0419):** Mesi final layout cleanup — removed global "Analisi" block; all years (including current) are now accordions, current year open by default; each year accordion contains: color legend + annual stats + per-month 3-bar chart + months list. Month Detail compact header: removed two big metric cards, replaced with one compact stats line (total hours · estimated · real salary). Day cards in Month Detail now have 3 colored bars (presence/hours/estimated) matching month card style. APP_BUILD='0419'. URL unchanged.

**Deployed @43 (2026-05-17, task 0418):** Mesi + Month Detail compact-card redesign — compact `.month-tab` cards with 3-bar mini chart; clickable day cards opening shift modal; note indicator. URL unchanged — redeploy in place (20-deployment cap hit).

**Deployed @41 (2026-05-17, task 0417):** Phone-test refinement batch — Home header shows localized "Ciao Alina" only (date moved to hero subtitle, eyebrow removed); annual analytics rebuilt per-year with 3 colored bars per month (days / hours / salary) + single legend; Mesi list simplified to one clickable card per month (no "Dettaglio" button, salary button still available for editable past months). URL unchanged (same deployment ID as @37/@39).

**Deployed @39 (2026-05-17, task 0416):** Settings UX + mesi UX fixes. URL unchanged.

**Claude Code confirmation spam mitigation (task 0415b, 2026-05-16):** `.claude/settings.local.json` deny rules added (git reset/clean/push --force); PowerShell patterns added; user guide in `docs/COMMANDS.md` — "Claude Code confirmation spam"; `--dangerously-skip-permissions` fallback documented.

**V2.2.0 start-work state fix (task 0406, 2026-05-16):** included in @37 deploy.

**Aggressive autonomy policy (task 0405, 2026-05-16):** active.

Automation (watcher/runner/low-touch): **baseline stable / monitor**.

---

## Task State

| State | Info |
|---|---|
| Last completed | **0443** (force inline preview route — fixed route interception where inline route opened Home — added explicit check FIRST in doGet — HEAD/dev push only — 2026-05-17) |
| Batch completed | …**0436 (route fix)**, **0437 (route diagnostic)**, **0438 (readonly scope fix)**, **0439 (remote code verification)**, **0440 (runtime diagnostic)**, **0441 (HTML sync fix)**, **0442 (inline page)**, **0443 (force route)** |
| Queue | **0 pending** — Production stable @57/build 0428. HEAD/dev: ExternalImportPreview.html + runtime diagnostic + forced inline route. User should test: `/dev?route=external-import-preview-inline`. |
| Superseded | `docs/tasks/queue/0363-v21-stable-tag.md` (superseded by 0367) |

---

## Low-Touch Stack Snapshot

| Component | Status | Pointer |
|---|---|---|
| n8n queue reader | Operational, scheduled polling validated | `docs/automation/n8n-workflows/queue-reader.md` |
| Telegram Mode A | **Active scheduled notification-only**, stable-after-fix | `docs/automation/telegram-mode-a-post-activation-monitoring-checklist.md` |
| INBOX | Active; **0 pending**, 21 decided, 1 superseded | `docs/INBOX.md` |
| Decision Packet format | Canonical for real decisions/gates only | `docs/automation/decision-packet-format.md` |
| LLM Wiki V3.1 | Active, but must stay subtractive/measure-first | `docs/wiki/` |
| Template Pack | Active; use core + task overlay + final report | `docs/tasks/templates/` |
| AGENTS.md | Pointer-only root entry | `AGENTS.md` |

---

## Automation Done Criteria

The automation phase is **sufficiently stable** when:
- Telegram Mode A is active and monitored;
- INBOX pending count is manageable;
- template-first policy is stable;
- no new runtime is required to remove current friction.

After that point, every new automation workstream must prove which manual friction it eliminates before it is opened.

---

## Future / Low Priority — Not Active Workstreams

- CLI Printing Press
- repo hygiene scanner/report-only
- local AI router / Ollama integration beyond documented feasibility
- browser bridge
- dual-agent loop
- VPS backup plan, n8n health check, INBOX auto-read, GitHub write automation

All remain gated/future unless the user explicitly opens them.

---

## Open Gates

Require explicit manual gate before action:
runtime, VPS/n8n UI, workflow import/export/Execute, Telegram send, Schedule change, provider API, billing, API key, login, GitHub Actions, deploy, tag, rollback, app source changes (`src/**`), secrets, OAuth material, real chat IDs, physical tests.

Provider APIs are out of scope by default. ChatGPT = web/on-demand; Claude Code/Cursor/Windsurf = supervised tools; Local AI = Ollama/local models.

---

## Implementers

| Implementer | Status | CLI capability |
|---|---|---|
| Claude Code | Principal supervised implementer (current) | Confirmed — batch/non-interactive |
| Cursor | **Future dual-agent target** (Agent 1 + Agent 2); suspended until reset | Interactive-only (v3.3.30; `agent` subcommand interactive) |
| Windsurf/Cascade | Fallback supervised tool; not an active verification target | CLI present, no agent mode (v1.110.1) |
| Antigravity | Fallback supervised tool; not an active verification target | Partially confirmed (`chat --mode agent` v1.107.0; headless unverified) |

Cursor-first decision: `docs/automation/dual-cli-orchestrator-lite-design.md` §1c · CLI capability matrix: §1b

---

## Quick Navigation

| Need | Read |
|---|---|
| State snapshot | `docs/wiki/current-state.md` |
| Token/routing rules | `docs/wiki/token-efficiency.md` |
| Task ID guard | `docs/wiki/task-id-preflight.md` |
| Prompt routing | `docs/wiki/prompt-routing.md` |
| Templates | `docs/wiki/template-pack-index.md`, then specific `docs/tasks/templates/*` |
| Orchestrator rules | `docs/ORCHESTRATOR_RULES.md` |
| Implementer rules | `docs/AI_RULES.md` |
| Workflow | `docs/WORKFLOW.md` |
| Commands | `docs/COMMANDS.md` |
| Roadmap | `docs/roadmap.md` |

---

## Update Rule

Update this file at task completion, but keep it compact. Move history out; keep only current state, latest task, active gates, and pointers.
