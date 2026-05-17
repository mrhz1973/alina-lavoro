# Session — External Google Sheet Import Safe Design (task 0432)

**Date:** 2026-05-17
**Task:** 0432 — Design-only: safe strategy for future external Google Sheet import
**Implementer:** Claude Code (Sonnet)

---

## Context

Build 0430 implemented external Google Sheet import directly in production. The app boot failed ("Apertura app…" stuck). Root cause: likely the new OAuth scope (`spreadsheets.readonly`) or the import code running in the boot path. No hotfix was attempted; immediate rollback to v2.2.0-build0428-stable was the correct response.

This document defines the rules that must govern any future re-implementation.

---

## Rules for future implementation

### Rule 1 — No direct production deploy

- Never deploy external import code directly to the production URL without prior canary/test validation.
- Canary = a separate `clasp deploy` to a test deployment ID, or a manual local `clasp run` test.
- Production deploy only after: preview-only tested + boot verified + phone test gate passed.

### Rule 2 — No import call in the boot path

The following functions must NOT call any external import or sheet-reading logic:

- `DOMContentLoaded` handler
- `render()`
- `renderHome()`
- `renderSettings()`
- `showApp()`
- `initBackground_()`
- `getBootstrap()`
- any function called during the initial app load sequence

Import functions may only be triggered by explicit user action (button click in Settings).

### Rule 3 — Progressive implementation steps

| Step | Content | Gate |
|---|---|---|
| A | Design docs only (this document) | Docs PR / review |
| B | Preview-only UI + backend stub (no write, no replace) | Boot test on canary |
| C | Full boot test: open app, navigate, verify no hang | Manual phone test |
| D | Replace with backup, LockService, canary only | Successful preview + checkbox gate |
| E | Production deploy | Explicit task prompt gate |

If app boot fails at any step: immediate rollback to `v2.2.0-build0428-stable`. No hotfix chains.

### Rule 4 — Preview-only mode (Step B)

The preview UI must include:
- Input field: Google Sheet URL or ID
- Input field: sheet/tab name
- Preview button (triggers read-only fetch, no data changes)
- Result display: first N rows or error message
- **No write operations**
- **No replace operations**
- **No backup creation**
- **No data clear**
- **No Drive file operations**

Errors must be shown inline in readable Italian.

### Rule 5 — Replace mode (Step D, canary only)

Replace may be implemented only after a stable preview:
- Mandatory checkbox: user must confirm they understand data will be overwritten
- Mandatory backup of current app data before replace
- LockService to prevent concurrent runs
- Replace only app data rows — never delete Drive files, never delete the spreadsheet
- If replace fails mid-run, restore from backup
- Boot test immediately after replace

### Rule 6 — Token budget and hotfix limit

- Maximum 1 hotfix attempt if import code breaks boot
- If 1 hotfix does not resolve: immediate rollback to `v2.2.0-build0428-stable`
- No chains like 0423–0425 (multiple failed hotfix deploys)
- Checkpoint at 80–85% token budget before closing any implementation block

### Rule 7 — OAuth scope

- No new scope added to `appsscript.json` until it is strictly required
- If external read is needed: add only `spreadsheets.readonly` (minimum)
- Do NOT add Drive scope unless there is a concrete documented reason
- No OAuth tokens, secrets, or credentials in repo or chat
- Scope change must be in its own commit, separate from logic changes

---

## Rollback reference

If at any future step the app boot breaks:
- Tag: `v2.2.0-build0428-stable`
- Deploy: @55 (stable) or @57 (current production, same build)
- Files: `src/frontend/Index.html`, `src/backend/Code.gs`, `appsscript.json`
- Command: `git checkout v2.2.0-build0428-stable -- src/frontend/Index.html src/backend/Code.gs appsscript.json`

---

## Status

Design-only task. No code written. No deploy. This document is the entire deliverable for task 0432.
