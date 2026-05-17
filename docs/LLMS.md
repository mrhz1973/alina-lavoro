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
| Source version | **V2.2.0 + 0406–0433** (HEAD/dev: build 0433 preview canary; production: build 0428) |
| Production version | **V2.2.0 + 0406–0428** (deployed @57 2026-05-17, URL unchanged — **phone test PASS 2026-05-17**) |
| Tag | **`v2.2.0-stable`** (on @54/0427, 2026-05-17) · **`v2.2.0-build0428-stable`** (on @55/0428, 2026-05-17) |
| Branch | **main** (`dev` legacy/inactive) |
| Apps Script deploy | **@57** (rollback to build 0428 2026-05-17; ID: AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ; URL unchanged) |
| Last manual test | **PASS** — 2026-05-17, phone test on @57 / build 0428 (app boot OK) |
| App scope | **Production @57: V2.2.0 + 0428 · no-login · URL unchanged · tags v2.2.0-stable + v2.2.0-build0428-stable · external import NOT live · spreadsheets.readonly NOT in production** / **HEAD/dev build 0433: preview-only UI + previewExternalSheetImport backend · spreadsheets.readonly added to appsscript.json · no deploy created** |

---

## Active Workstream

**External sheet preview canary (2026-05-17, task 0433):** Step B of safe design. Preview-only UI + `previewExternalSheetImport` backend. HEAD/dev build 0433. `spreadsheets.readonly` scope added to `appsscript.json`. `clasp push --force` done — HEAD updated, no new deployment. Production @57 / build 0428 NOT touched. No deploy, no replace, no data write. Full session: `docs/sessions/2026-05-17-external-sheet-preview-only-canary.md`. Next: Step C = boot test on HEAD, then Step D (replace + backup), Step E (production deploy) — all need separate explicit task gates.

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
| Last completed | **0433** (external sheet preview canary — preview-only build 0433 HEAD/dev — 2026-05-17) |
| Batch completed | 0366–0371 (stable close), 0372–0377 (cleanup + autonomy), 0378–0383 (validation), 0384–0390 (V2.2.0 no-login), 0399–0403 (V2.2.0 frontend fix + polish), 0404 (deploy patch), 0405 (aggressive autonomy policy), 0406 (start-work state fix), 0407–0412 (import/export), 0413 (UI/state fixes), 0414 (deploy-info in Settings), 0415 (deploy @37), 0415b (CC spam fix), 0416 (settings/mesi UX + deploy @39), 0417 (phone-test refinement batch + deploy @41), 0418 (compact-card redesign + deploy @43), 0419 (Mesi final layout cleanup + deploy @45), 0420 (UI refinements + external sheet import + deploy @47), 0421 (failed redeploy @48), 0422 (root cause fix + corrected push + redeploy @49), 0423 (boot stuck hotfix + redeploy @50), 0424 (force boot recovery + redeploy @51), 0425 (boot forensic hotfix + redeploy @52), 0426 (rollback to build 0419 + redeploy @53), 0427 (Mesi UI-only cleanup + deploy @54), **0391 (phone test PASS @54), 0392 (stable tag v2.2.0-stable)**, 0428 (day bars color fix deploy @55), **0429 (build 0428 stable snapshot tag v2.2.0-build0428-stable)**, 0430 (external sheet import + deploy @56 — BROKEN), **0431 (rollback to build 0428 + deploy @57 — phone test PASS)**, **0432 (external sheet import safe design — docs-only)** |
| Queue | **0 pending** — Production stable @57/build 0428. Phone test PASS 2026-05-17. External import: HEAD/dev build 0433 preview canary ready. Next: Step C boot test on HEAD (separate gate). |
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
