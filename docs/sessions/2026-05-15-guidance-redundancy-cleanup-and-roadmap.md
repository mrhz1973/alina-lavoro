# Session — 2026-05-15 — Guidance Redundancy Cleanup and Roadmap (Task 0277)

**Implementer:** Claude Code  
**Task:** 0277  
**Type:** docs-only cleanup batch  
**Branch:** main

---

## Objective

Reduce documentation bloat and duplication across the V3.1 guidance set. No new docs created; net reduction in repeated operational text.

---

## Preflight

- Repository: `mrhz1973/alina-lavoro` ✓
- Branch: `main` ✓
- Working tree: clean before start ✓
- `git pull origin main`: already up to date ✓
- Task-ID preflight: Last completed = 0276 → next free = 0277 ✓

---

## Interventions

### 1 — AGENTS.md
- Fixed: LLMS.md line budget `≤200` → `≤150` (matches actual constraint in LLMS.md).

### 2 — docs/LLMS.md
- Fixed: "Claude Code local" → "Claude Code" in Implementers table.
- Updated: Last completed = 0277.

### 3 — docs/wiki/current-state.md
- Removed: "Measurement Snapshot — 0273" section (~17 lines) — stale history, not a snapshot.
- Removed: "Active Workstream" section — duplicate of LLMS.md.
- Removed: "Automation Done Criteria" section — duplicate of LLMS.md.
- Added: compact line budget constraint in header ("Keep below ~100 lines").
- Updated: last updated date and Last completed = 0277.
- Net reduction: ~28 lines removed (from ~112 to ~84 lines).

### 4 — docs/wiki/token-efficiency.md
- Merged: "Measure-First Rule" + "Docs ROI Gate" → single "New-doc gate" section.
- Reduced: "Prompt Size Guard" → short pointer to prompt-routing.md (canonical home).
- Replaced: "Template Use" full prompt block (21 lines) → 3-line pointer to prompt-routing.md.
- Net reduction: ~30 lines removed.

### 5 — docs/tasks/templates/implementer-standard.md
- Removed: duplicate local clone preflight git command block (5 commands).
- Kept: pointer to `docs/COMMANDS.md` § "Mandatory local preflight" + behavioral rules.
- Net reduction: ~7 lines.

### 6 — docs/tasks/templates/inbox-decision-recording.md
- Added: missing "Final report" pointer to final-report-contract.md.

### 7 — docs/tasks/templates/n8n-template-first-task.md
- Added: missing "Expected output" section with done marker, session note, and final-report-contract pointer.

### 8 — docs/tasks/templates/state-update-batch.md
- Updated: Docs ROI Gate pointer from `v31-enforcement-checklist.md § F` → `token-efficiency.md — New-doc gate` (canonical is now token-efficiency.md after merge).

### 9 — docs/roadmap.md
- Added: compact "Post-cleanup roadmap (2026-05-15)" table with NOW / NEXT / LATER / DO NOT categories (~24 lines).

---

## Measurement (approximate, line-count proxy)

| File | Before | After | Delta |
|---|---:|---:|---:|
| current-state.md | ~112 | ~84 | -28 |
| token-efficiency.md | ~144 | ~108 | -36 |
| implementer-standard.md | ~51 | ~44 | -7 |
| AGENTS.md | ~44 | ~44 | 0 (single-word fix) |
| LLMS.md | ~136 | ~136 | 0 (single-word fixes) |
| Total guidance set | ~487 | ~416 | **-71 lines** |

Files not created compared with previous enforcement plan: 0 new guidance docs.

---

## Checks

- `git diff --check`: no whitespace errors
- No broken references verified: COMMANDS.md still canonical for preflight; prompt-routing.md still canonical for prompt shape; v31-enforcement-checklist.md not deleted (pointer updated in state-update-batch.md only); no default read instruction for PROJECT_STATE.md or CHECKPOINT.md introduced; no duplicate full prompt-shape example left; no duplicate full local preflight command block left.

---

## Files modified

- `AGENTS.md`
- `docs/LLMS.md`
- `docs/wiki/current-state.md`
- `docs/wiki/token-efficiency.md`
- `docs/tasks/templates/implementer-standard.md`
- `docs/tasks/templates/inbox-decision-recording.md`
- `docs/tasks/templates/n8n-template-first-task.md`
- `docs/tasks/templates/state-update-batch.md`
- `docs/roadmap.md`

## Files created

- `docs/tasks/done/0277-guidance-redundancy-cleanup-and-roadmap.md`
- `docs/sessions/2026-05-15-guidance-redundancy-cleanup-and-roadmap.md` (this file)

---

## Confirmation

- No runtime. No n8n UI. No workflow Execute. No Telegram send. No Schedule activation.
- No app source changes (`src/**`). No deploy/tag/rollback.
- No provider API. No billing. No secrets. No token. No real chat_id.
- No new guidance documents created.
- No PROJECT_STATE.md or CHECKPOINT.md read or modified.
