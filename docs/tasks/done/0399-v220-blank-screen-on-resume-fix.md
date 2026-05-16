# Task 0399 — V2.2.0 Blank Screen On Resume Fix

- Project: Alina Lavoro
- Type: frontend-bugfix
- Priority: high
- Deploy: no

## Symptom (user-reported)

After V2.2.0 reopen, the app no longer asks for a code but renders an empty/black screen. Tapping the Home button makes everything appear.

## Root cause

V2.2.0 removed the `loginView` element from the HTML (task 0386), but `showApp()` still ran `document.getElementById('loginView').classList.add('hidden')`. `getElementById` returned `null`, the `.classList` access threw a TypeError, and the rest of `showApp()` — including `applyThemeLang()` and `render()` — was skipped. The static shell remained on screen with an empty `<main id="content">`. Tapping Home re-entered via `setPage('home')` → `render()`, which is why Home recovered the UI.

## Fix

`src/frontend/Index.html` `showApp()` — drop the dead `loginView` lookup and guard the remaining lookups defensively:

```js
function showApp(){
  var av=document.getElementById('appView');if(av)av.classList.remove('hidden');
  var nv=document.getElementById('nav');if(nv)nv.classList.remove('hidden');
  applyThemeLang();render()
}
```

The other vestigial `loginView`/`loginSub` lookups (`setupMobileUi_`, `applyThemeLang`) already guarded against `null` and were left untouched per minimal-scope rule.

## Done status

- Completed by: Claude Code (Opus 4.7, Extreme)
- Completion date: 2026-05-16
- Session: docs/sessions/2026-05-16-v220-frontend-fix-ui-polish-batch.md
- Deploy/tag/rollback: NOT executed (source-only patch)
