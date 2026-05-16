# Session — 2026-05-16 — Deploy 0407–0413 for phone test

## Summary

Explicit deploy gate. Published source 0407–0413 (import/export tools + manual-test UI/state fixes + deploy-info in Settings) to Apps Script.

## Preflight

- Branch: main
- Working tree: clean
- Last 5 commits included 0413 and 0414 source patches
- `git diff --check`: clean
- JS syntax (node --check extracted inline script): OK
- Modern operator grep: no matches
- import/export functions present: yes

## Deploy steps

1. `npm run deploy` → `clasp push` pushed 3 files (Code.gs, Index.html, appsscript.json)
2. First attempt failed: "Scripts may only have up to 20 versioned deployments at a time" (21 found)
3. Deleted oldest deployment @5 (V1.6.2, covered by `v1.6.2-stable` tag): `npx clasp undeploy AKfycbx_L4ORviJSWp9lApFST-a-EfYl34t1evKK9NfaNBbCVgavzCPiejnxhQJAFkeahos56A`
4. Re-ran `npm run deploy` → `clasp deploy` succeeded

## Outcome

- New deployment: **@37** (ID: `AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ`)
- URL: **changed** — new deployment ID; user must update /exec link to the @37 deployment ID
- Previous production: @35 (still exists, shows old version)
- Source deployed: V2.2.0 + 0406 + 0407–0412 + 0413 + 0414

## What the user can now test on mobile

- Import/Export appears in Settings page
- Bottom nav: Home / Mesi / Note only (gear icon opens Settings)
- Language toggle shows IT / RU correctly
- Theme no longer reverts after sync
- Home metric cards are compact (2×2)
- Mesi page title is a heading, not a card
- Annual analytics labels and year-scoped data fixed
- Settings shows: Versione 2.2.0 · Deploy @37 · Build 0413

## Deploy / tag / rollback

- Deploy: **executed** @37
- Tag: NOT created (0392 still pending)
- Rollback: NOT executed
- 0391/0392: left pending (post-deploy test and stable-tag gate)

## Next step

User opens the @37 /exec link on phone and tests the deployed app.
