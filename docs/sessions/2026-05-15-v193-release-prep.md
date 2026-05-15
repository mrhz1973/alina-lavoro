# Session — V1.9.3 Release Prep (task 0321)

**Date:** 2026-05-15
**Task:** 0321-v193-release-prep
**Scope:** DOCS ONLY — roadmap, LLMS.md, current-state.md; no deploy.

---

## V1.9.3 source summary

Changes included in V1.9.3 source (not yet deployed):

| Task | Description |
|---|---|
| 0316 | Month detail DOM API refactor: innerHTML → DOM API + cache |
| 0317 | Month detail sticky back header (mobile) |
| 0318 | Frontend static validation (review-only) |
| 0319 | Physical test OK (Redmi 9C NFC, user "tutto ok" 2026-05-15) |
| 0320 | Version bump: APP_VERSION + package.json → 1.9.3 |
| 0321 | This release prep / docs update |

---

## State after this task

| Field | Value |
|---|---|
| Source version | **V1.9.3** (bumped, not deployed) |
| Production | **V1.9.2 @24** (unchanged) |
| Tag | `v1.9.2-stable` (unchanged) |
| Branch | **main** |

---

## Files updated

- `docs/roadmap.md` — V1.9.3-prep note added at top of Stato attuale
- `docs/LLMS.md` — version, last test, last completed updated
- `docs/wiki/current-state.md` — version, last test, task state updated

---

## Next required gate

**Task 0322 — V1.9.3 deploy gate**

Required actions (explicit user authorization only):
1. `npm run sync` (or equivalent on Windows)
2. `clasp push`
3. `clasp deploy`
4. Verify new deploy URL `@25`
5. Manual smoke test on `/exec @25`
6. Create `v1.9.3-stable` tag
7. Update `gas-current/` snapshot

None of these are authorized by this task.
