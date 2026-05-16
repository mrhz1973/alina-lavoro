# Session — V2.2.0 Patched Source Deploy (task 0404)

**Date:** 2026-05-16
**Task:** 0404 — deploy patched V2.2.0 source to Apps Script
**Implementer:** Claude Code

---

## Deploy Summary

- **Source:** V2.2.0 + patch 2026-05-16 (batch 0399–0403), commit `0118e70`
- **Previous production deploy:** @31 (V2.2.0 pre-patch)
- **New production deploy:** @33 (V2.2.0 patched)
- **Deployment ID:** `AKfycbyIkaQqS-Dce0tfdxyfjdnEEE_xSb3Ys3KdeGL9xiX652QfgfAFRRBSvmuLXdPqQhaXSg` (same as @31; URL unchanged)
- **Deploy method:** `npx clasp deploy -i <deployment-id>` (update existing; 20-deployment limit reached)

---

## Preflight

- Branch: `main`, clean tree
- `git pull origin main`: already up to date
- `git diff --check`: no whitespace issues
- JS syntax check (node --check on extracted inline script): **OK**
- Modern operators grep: **none found**
- Navbar tabs: `home`, `months`, `notes`, `settings` — all present

---

## Patch Contents (batch 0399–0403)

- 0399: dead `loginView` reference removed from `showApp()` — fixes blank-screen-on-resume
- 0400: Dettaglio mese day-label + today-badge ("Oggi") fix — badge only on today's card
- 0401: pre-rendered boot placeholder in `<main id="content">`
- 0402: additive design tokens pass 1
- 0403: day-card readability polish

---

## Deploy Steps

1. `npm config set script-shell "C:\\Program Files\\Git\\bin\\bash.exe"` — fix Windows npm sync issue
2. `npm run sync` — copied src to `.gas/`: **OK**
3. `npx clasp push` — pushed 3 files: **OK** (12:31:24)
4. `npx clasp deploy` — failed: 20-deployment limit
5. `npx clasp deploy -i <id> --description "V2.2.0 patched (0399-0403)"` — **OK → @33**

---

## Post-Deploy

- Files updated: `docs/LLMS.md`, `docs/wiki/current-state.md`, `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md`
- Done marker: `docs/tasks/done/0404-v220-patched-source-deploy.md`
- Tag: **not created** — pending manual user test PASS
- Rollback: **not executed**

---

## Next Gate

Manual user test on phone (`/exec` @33 URL) — must PASS before `v2.2.0-stable` tag (task 0392).
Task 0391 covers the post-deploy test checklist.
