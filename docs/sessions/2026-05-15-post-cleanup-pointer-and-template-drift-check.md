# Session — 2026-05-15 — Post-Cleanup Pointer and Template Drift Check (Task 0278)

**Implementer:** Claude Code (Opus 4.7)
**Task:** 0278
**Type:** docs-only audit + targeted drift fix
**Branch:** main
**Repository:** mrhz1973/alina-lavoro
**Authorization:** user-granted overnight autonomy for docs-only work; runtime scope limited to local git/shell inspection commands

---

## Objective

Follow-on to task 0277 (guidance redundancy cleanup). Audit the V3.1 guidance surface for residual pointer and ownership drift across:

- `AGENTS.md`
- `docs/LLMS.md`
- `docs/wiki/current-state.md`
- `docs/wiki/token-efficiency.md`
- `docs/wiki/prompt-routing.md`
- `docs/wiki/task-id-preflight.md`
- `docs/wiki/context-budget-policy.md`
- `docs/wiki/template-pack-index.md`
- `docs/wiki/examples/delta-based-prompt-example.md`
- all 8 implementer templates in `docs/tasks/templates/`
- `docs/COMMANDS.md`
- `docs/roadmap.md`

---

## Preflight

- Repository: `mrhz1973/alina-lavoro` ✓
- Branch: `main` ✓
- Working tree: clean before start ✓
- Last completed (from LLMS.md on main): 0277 ✓
- Task-ID preflight: next free ID = 0278 (no `done/0278*` file; no `queue/0278*` file) ✓
- No dirty changes to inspect or handle.

---

## Audit findings — drift fixed

### Finding 1 — AGENTS.md: Docs ROI Gate misattributed

`AGENTS.md` § "For task routing" originally read:

> `docs/wiki/prompt-routing.md` — template selection table + Prompt Size Guard + Docs ROI Gate

But the Docs ROI Gate / New-doc gate lives in `docs/wiki/token-efficiency.md` (canonical home, merged there by task 0277 intervention 4) and `docs/wiki/v31-enforcement-checklist.md` § F (formal rule). `prompt-routing.md` only contained partial duplicate wording.

**Fix:**
- The token-efficiency.md bullet in § "Read first" now explicitly mentions the New-doc gate / Docs ROI Gate.
- The prompt-routing.md bullet in § "For task routing" now reads "prompt shape, template selection table, Prompt Size Guard" only.

### Finding 2 — prompt-routing.md: duplicated New-doc gate bullets

`docs/wiki/prompt-routing.md` § "Size and subtraction rules" duplicated New-doc gate wording in two bullets:

> - Before adding new guidance docs, measure cold-start file/line count and prefer consolidation.
> - A new document that only adds another file to read is a regression.

These bullets restated `token-efficiency.md` § "New-doc gate" almost verbatim, violating the single-canonical-home principle.

**Fix:** Replaced both bullets with a single pointer:

> - For new guidance docs, apply the New-doc gate in `docs/wiki/token-efficiency.md` (canonical home).

Net change: `prompt-routing.md` 65 → 64 lines.

### Finding 3 — roadmap.md: stale NOW row + outdated trigger

`docs/roadmap.md` § "Post-cleanup roadmap (2026-05-15)" listed as a NOW item:

> Complete docs guidance redundancy cleanup; fix pointers; no new guidance docs · Task 0277 · None — docs-only

This work was closed by task 0277 (guidance trim) plus task 0278 (pointer fix). The "Verify cold-start is lighter after cleanup" NEXT row still pointed to "After 0277".

**Fix:**
- Removed the stale NOW row.
- Updated the NEXT row trigger from "After 0277" to "After 0278".

---

## Audit findings — no drift, no change

| Item | Status |
|---|---|
| AGENTS.md pointer-only (≤45 lines) | ✓ 43 lines |
| token-efficiency.md vs prompt-routing.md ownership (after fixes 1–2) | ✓ split is clean: navigation/New-doc gate vs prompt shape/Prompt Size Guard |
| final-report-contract pointer in all 7 task overlays | ✓ all use `final-report-contract.md` reference; no duplication |
| Local clone preflight: COMMANDS.md canonical; implementer-standard.md pointer-only | ✓ already standardized in task 0274 / 0277 |
| LLMS.md ≤150 lines | ✓ 135 lines |
| current-state.md ≤100 lines | ✓ 74 lines (before state update; remains within budget after) |
| Templates 40–60 lines each | ✓ range 40–56 |
| PROJECT_STATE.md / CHECKPOINT.md as default reads | ✓ no default-read instruction anywhere; all mentions are framed as fallback/audit |
| CLI Printing Press, repo hygiene scanner, local AI router, browser bridge, dual-agent loop frozen as future/gated | ✓ consistent across LLMS.md, current-state.md, roadmap.md |
| Roadmap compactness | ✓ post-cleanup table now 17 rows (was 18); rest of file is product history, out of scope |

---

## Files modified

- `AGENTS.md` — 1 line attribution fix on routing pointer; 1 line clarification on token-efficiency.md bullet.
- `docs/wiki/prompt-routing.md` — Two duplicate bullets replaced with one pointer (−1 line net).
- `docs/roadmap.md` — Stale NOW row removed; NEXT trigger updated to 0278.
- `docs/LLMS.md` — Last completed = 0278; Previous = 0277.
- `docs/wiki/current-state.md` — Header date and Last completed row updated to 0278.

## Files created

- `docs/tasks/done/0278-post-cleanup-pointer-and-template-drift-check.md`
- `docs/sessions/2026-05-15-post-cleanup-pointer-and-template-drift-check.md` (this file)

## Approximate line-count delta

| File | Before | After | Delta |
|---|---:|---:|---:|
| `prompt-routing.md` | 65 | 64 | -1 |
| `AGENTS.md` | 43 | 43 | 0 |
| `roadmap.md` | 344 | 343 | -1 |
| `LLMS.md` | 135 | 135 | 0 |
| `current-state.md` | 74 | 74 | 0 |
| **Net guidance lines** | — | — | **−2** |

Small delta is expected: 0277 already removed ~71 lines; 0278 is a targeted pointer fix, not another deletion pass.

---

## Checks run

- `git diff --check` — no whitespace errors.
- Local git preflight commands only (status / branch / log / remote).
- No grep of forbidden paths returned changes outside the allow-list.
- No new guidance/policy/checklist doc created.
- Done marker and session note pushed to GitHub so the orchestrator can read the result.

---

## Runtime scope actually used

Local only: `git remote -v`, `git branch --show-current`, `git status --short`, `git log --oneline -5`, `git diff --check`, `wc -l`. Final `git add` (selective), `git commit`, `git push origin main`.

No n8n UI, no workflow Execute, no Schedule change, no Telegram send, no app source changes, no Apps Script deploy, no tag, no rollback, no provider API, no billing, no credentials, no real chat_id / token / OAuth material, no external AI tools, no autonomous runner setup, no GitHub Actions setup.

---

## Residual risks

- None identified. The post-cleanup guidance set now has a single canonical home for New-doc gate (token-efficiency.md) and a single canonical home for prompt shape and size guard (prompt-routing.md).

## Next micro-step

- None mandatory. The optional NEXT row in `roadmap.md` ("Verify cold-start is lighter after cleanup") can be addressed when convenient — task 0278 is the close of the post-cleanup batch begun in 0277.

## Confirmation

- No runtime. No n8n UI. No workflow Execute. No Telegram send. No Schedule activation.
- No app source changes (`src/**`). No deploy/tag/rollback.
- No provider API. No billing. No secrets. No token. No real chat_id.
- No new guidance documents created.
- No `docs/PROJECT_STATE.md` or `docs/CHECKPOINT.md` read or modified.
