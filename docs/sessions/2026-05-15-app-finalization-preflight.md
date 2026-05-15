# Session — App Finalization Preflight (task 0315)

**Date:** 2026-05-15
**Task:** 0315-app-finalization-preflight
**Scope:** APP FINALIZATION ONLY — docs + candidate-fix map; no deploy, no tag, no rollback, no automation changes.

---

## App baseline

| Field | Value |
|---|---|
| Version | V1.9.2 |
| Tag | v1.9.2-stable |
| Deploy | @24 |
| Last test | OK 2026-05-10 (`/exec @24`, Redmi 9C NFC) |
| Branch | main |

---

## Files inspected

- `src/frontend/Index.html` (full read)
- `src/backend/Code.gs` (full read)

---

## Checks run

| Check | Result |
|---|---|
| `git diff --check` | clean (docs-only commit) |
| Modern-operator grep (`??`, `\|\|=`, `?.`) on Index.html | **NO MATCH** — no problematic operators in inline JS |
| Branch | main |
| Working tree before commit | clean |

---

## Candidate-fix map

### A. Safe immediate fix candidates (future tasks)

| ID | Area | Finding | Action |
|---|---|---|---|
| A1 | Frontend — month detail rendering | `renderMonthDetail` builds HTML via `innerHTML` string concatenation. Unlike `renderMonths` (DOM API + signature cache), it always rebuilds on every navigation. On Redmi 9C NFC this may be perceptible. All values go through `esc()` so no XSS risk, but performance is suboptimal. | Create V1.9.3 task: convert `renderMonthDetail` to DOM API + navigation-signature cache. |
| A2 | Frontend — month detail UX | "Indietro" back button is inside the first card, not sticky/fixed. On small screens the user must scroll to top to navigate back if the day list is long. | Create V1.9.3 task: sticky back-button header for month detail on mobile. |
| A3 | Frontend — `renderMonths` re-render guard | `monthsDomMatches_` / `monthsViewSig` cache prevents re-render of the months list. Month detail has no equivalent. | Bundled with A1 (DOM API + cache). |

### B. Requires manual app test before decision

| ID | Area | Finding | Action |
|---|---|---|---|
| B1 | CSS — `color-mix()` | Used only inside `@supports (color-mix(in srgb,red,red))` blocks. Base styles (non-color-mix) are the actual defaults. Should be verified on old Android to confirm base fallback renders correctly. | Test on Redmi 9C NFC / old Android before deciding if any fallback improvement is needed. |
| B2 | CSS — `backdrop-filter` | Explicitly set to `none` on mobile (`@media(max-width:899px)`). No performance issue expected. | Confirm OK on next physical test. |

### C. Release-only / deploy-gated

| ID | Area | Finding | Action |
|---|---|---|---|
| C1 | Version bump | `APP_VERSION = '1.9.2'` in Index.html and `package.json`. | Bump only at V1.9.3 release step with explicit deploy authorization. |

### D. Reject / not worth doing

| ID | Area | Reason |
|---|---|---|
| D1 | DOM API refactor of `renderMonthDetail` in this micro-step | Too large for a preflight; handled as dedicated V1.9.3 task. |
| D2 | Retroactive CSS cosmetic changes | No user-reported problem. |
| D3 | Backend `eliminaTurniFuturi` TODO comment | Function is manual-only (editor-only, not called by app flow). Off-by-one risk acknowledged; no production impact. No change. |

### Backend findings

| Finding | Conclusion |
|---|---|
| `saveNoteDirect_` writes `completata` as string `'true'`/`'false'`; frontend reads it back with `String(n.completata)!=='true'` | Consistent. No bug. |
| `// TODO(eliminaTurniFuturi): verificare possibile off-by-one` (line ~991) | Manual-only function; acknowledged risk; no production impact; no change. |
| `importaStoricoSoloFinoAOggi` — legacy import function | Not exposed to app users; harmless. |
| Modern JS operators `??`, `||=`, `?.` | **Grep confirmed: NO MATCH** in inline JS. |

---

## Source changes in this micro-step

**None.** All candidates are documented for follow-on tasks.

---

## Recommended next single app micro-step

Create task `0316-month-detail-dom-api-render.md` scoping:
- Convert `renderMonthDetail` to DOM API (matching `renderMonths` style)
- Add navigation-signature cache to skip rebuild on repeated visits to same month
- Keep back-button UX fix in scope or as separate 0317

Gate: requires manual test on Redmi 9C NFC after implementation before deploy.
