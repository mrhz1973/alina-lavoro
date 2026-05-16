# Session — Claude Aggressive Autonomy Policy (task 0405)

**Date:** 2026-05-16
**Task:** 0405 — implement aggressive Claude Code autonomy policy
**Implementer:** Claude Code

---

## User Decision

The user explicitly prefers recoverable mistakes over project abandonment caused by repeated confirmation prompts.

**Core principle:** a recoverable mistake is acceptable. A blocked project caused by repeated confirmation prompts is not acceptable.

**Problem observed during deploy @33 (task 0404):** Claude repeatedly paused and asked for confirmation before running commands that were already authorized by the prompt (sync, clasp push, clasp deploy). This caused friction and slowed execution without adding safety. The user was the one who had authorized the deploy in the orchestrator prompt — Claude re-asking for the same authorization was redundant.

---

## Policy Implemented

Claude Code must proceed autonomously for all recoverable actions already authorized by the current task prompt. The user decision lives in the orchestrator prompt. Claude must not ask again for the same authorized action inside the same task scope.

### Commands now auto-proceed (when prompt authorizes)

**Always auto-proceed (safe/read-only):**
- git status, git diff, git diff --check, git log, git branch, git remote, git rev-parse, git fetch, git show, git tag --list
- grep / findstr, node --check, python / python3, ls / dir, diff, wc
- git pull --rebase origin main (clean tree)

**Auto-proceed when prompt authorizes commit/push:**
- selective git add with explicit paths
- git commit
- git push origin main

**Auto-proceed when current prompt explicitly authorizes deploy:**
- npm run sync, npm run deploy
- clasp push, clasp deploy, npx clasp push, npx clasp deploy
- `"C:\Program Files\Git\bin\bash.exe" -c "npm run sync && clasp push && clasp deploy"`

**Auto-proceed (task closure):**
- creating task done markers and session notes
- updating state docs (LLMS.md, current-state.md, PROJECT_STATE.md, CHECKPOINT.md)
- retrying after non-destructive command failures (encoding issues, environment fixes, npm config)
- git pull --rebase when rebase is needed after clean local commit

### Commands still gated (non-recoverable)

- git reset --hard, git clean, git push --force
- deleting files outside allowed paths
- rollback
- secrets, credentials, OAuth material, tokens
- billing, provider API keys, new paid services
- destructive database/Sheet operations
- unresolved merge conflicts
- scope drift outside allowed paths
- deploy commands when current prompt does NOT authorize deploy
- stable tag creation without explicit prompt authorization

---

## Files Changed

| File | Change |
|------|--------|
| `.claude/settings.local.json` | Added: `clasp deploy*`, `python3 *`, `dir*`, `findstr *`, `wc *`, `type *` |
| `docs/COMMANDS.md` | Added "Aggressive autonomy policy" section; updated "Comandi sicuri" table |
| `docs/AI_RULES.md` | Added "Aggressive autonomy" implementer rule before "No unnecessary confirmations" |
| `docs/WORKFLOW.md` | Added "Aggressive autonomy policy" workflow section |
| `docs/ORCHESTRATOR_RULES.md` | Added "Aggressive autonomy" bullet in agent-facing summary |
| `docs/LLMS.md` | Updated active workstream + task state for 0405 |
| `docs/wiki/current-state.md` | Updated header + task state for 0405 |

---

## Validation

- `.claude/settings.local.json`: valid JSON (node -e JSON.parse OK)
- git diff --check: clean
- Forbidden paths: not touched (src/**, gas-current/**, .gas/**, appsscript.json, package.json)
- Deploy: not executed
- Tag: not created
- Rollback: not executed
- App source: not modified

---

## Next Gate

Manual user test on phone (`/exec` @33) — task 0391.
After PASS: stable tag `v2.2.0-stable` — task 0392.
