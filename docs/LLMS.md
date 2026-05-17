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
| Source version | **V2.2.0 + 0406–0420** (UI refinements + external sheet import) |
| Production version | **V2.2.0 + 0406–0420** (deployed 2026-05-17 @49, URL unchanged) |
| Tag | **`v2.1.1-stable`** (last stable; v2.2.0-stable pending phone test) |
| Branch | **main** (`dev` legacy/inactive) |
| Apps Script deploy | **@49** (corrected push 2026-05-17; ID: AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ; URL unchanged — root cause found task 0422) |
| Last manual test | **PASS** (0366, V2.1.1) — V2.2.0 @49 phone test pending |
| App scope | **V2.2.0 · no-login direct start · 0406–0420 deployed @49 · URL unchanged · awaiting manual phone test** |

---

## Active Workstream

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
| Last completed | **0422** (root cause fix — corrected clasp push + redeploy @49, 2026-05-17) |
| Batch completed | 0366–0371 (stable close), 0372–0377 (cleanup + autonomy), 0378–0383 (validation), 0384–0390 (V2.2.0 no-login), 0399–0403 (V2.2.0 frontend fix + polish), 0404 (deploy patch), 0405 (aggressive autonomy policy), 0406 (start-work state fix), 0407–0412 (import/export), 0413 (UI/state fixes), 0414 (deploy-info in Settings), 0415 (deploy @37), 0415b (CC spam fix), 0416 (settings/mesi UX + deploy @39), 0417 (phone-test refinement batch + deploy @41), 0418 (compact-card redesign + deploy @43), 0419 (Mesi final layout cleanup + deploy @45), 0420 (UI refinements + external sheet import + deploy @47), 0421 (failed redeploy attempt @48), **0422 (root cause fix + corrected push + redeploy @49)** |
| Queue | **0391** (post-deploy phone test for @49), **0392** (stable tag after test pass). Next gate: manual user phone test on @49. |
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
