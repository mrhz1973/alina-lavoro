# Task 0402 — V2.2.0 Design Token Polish (Pass 1)

- Project: Alina Lavoro
- Type: frontend-polish
- Priority: normal
- Deploy: no

## Goal

Add a small set of design tokens to make future visual work consistent, without disturbing the existing palette or layout.

## Change

`src/frontend/Index.html` `:root` and `html[data-theme="dark"]` — new tokens, additive only:

- `--surface-alt` (aliases existing `--surface2` so future code can use the more descriptive name)
- `--border-soft` (lighter border for subtle separators)
- `--primary-hover` (darker primary, ready for hover states)
- `--success` (#0f9d58 light / unchanged dark — for future success affordances)
- `--shadow-soft` (compact shadow, reused by today-card highlight)
- `--radius-sm` (14px small radius for pills/badges)

No existing token was renamed or repointed; every current selector that uses `--surface2`, `--border`, `--shadow`, `--radius`, etc. continues to resolve identically. Dark theme overrides extended for `--border-soft` and `--shadow-soft` so the new tokens behave correctly under `data-theme="dark"`.

Tokens are used by the today-card highlight and today-badge (TASK 0403). No third-party fonts, icon packs, or CDN assets introduced. System font stack untouched (already in `--font`).

## Done status

- Completed by: Claude Code (Opus 4.7, Extreme)
- Completion date: 2026-05-16
- Session: docs/sessions/2026-05-16-v220-frontend-fix-ui-polish-batch.md
- Deploy/tag/rollback: NOT executed (source-only patch)
