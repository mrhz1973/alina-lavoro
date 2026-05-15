# Session — Month Detail Sticky Back Header (task 0317)

**Date:** 2026-05-15
**Task:** 0317-month-detail-sticky-back-header
**Scope:** APP FINALIZATION ONLY — src/frontend/Index.html; no deploy, no tag, no rollback.

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

## What changed

`src/frontend/Index.html` — CSS and inline `<script>` only.

### CSS — global

`.month-detail-sticky-header{display:none}` added globally so the sticky header is hidden on desktop by default.

### CSS — mobile (`@media(max-width:899px)`)

- `.month-detail-sticky-header`: shown as `display:flex`, `position:sticky; top:0; z-index:10; background:var(--bg); padding:10px 0 8px; margin-bottom:6px` — appears at the top of the viewport when the user scrolls down into a long day list.
- `.month-detail-sticky-title`: bold, truncated with ellipsis, fills remaining width.
- `.month-detail-head{display:none}`: hides the back-button row inside the first card on mobile (back is now covered by the sticky header; desktop keeps the original behavior).

### JS — `renderMonthDetail`

After `root.textContent=''; root.dataset.alDetailMonth=mk;`, a sticky header element is created and appended before `sec1`:

- `div.month-detail-sticky-header` containing:
  - `button.ghost-btn` with `t('back')` text and `addEventListener('click', setPage('months'))` — same behavior as the existing back button in sec1.
  - `div.month-detail-sticky-title` with `monthLabel(mk)` text.

All DOM API calls are ES5-compatible. No new JS operators introduced.

### Preserved sections

| Section | Status |
|---|---|
| Back button behavior (`setPage('months')`) | Preserved (sticky back + card back on desktop) |
| Header card: kicker, month label | Preserved (visible on desktop and mobile at top of page) |
| Metrics grid, estimated, salary real | Preserved |
| Day list with proportional bars | Preserved |
| Empty-month message | Preserved |
| renderMonthDetail DOM API/cache (task 0316) | Intact — `monthDetailSig`, `buildMonthDetailSig_`, `monthDetailDomMatches_` unchanged |

---

## Cache behavior

`monthDetailDomMatches_` checks `root.children.length >= 2`. With sticky header added, count is >= 3 — check still passes correctly. No change to cache guard needed.

---

## Checks run

| Check | Result |
|---|---|
| `git diff --check` | clean |
| JS extraction (PowerShell) | OK (length 45534) |
| `node --check` | node not installed on system; manual diff review: ES5-only DOM API, no syntax issues |
| Modern-operator grep (`??`, `\|\|=`, `?.`) | NO MATCH |
| Navbar `data-page` tabs | home, months, notes, settings — unchanged |
| Backend changed | No |
| APP_VERSION bumped | No |
| deploy/tag/rollback | No |

---

## Source changes

- `src/frontend/Index.html` — CSS (global + mobile) and inline JS only

## Recommended next single app micro-step

Manual physical test on Redmi 9C NFC to confirm:
- sticky header appears correctly when scrolling month detail with many days;
- back button in sticky header navigates back to months list;
- desktop layout unchanged;
- then authorize V1.9.3 deploy gate.
