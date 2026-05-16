# Task 0401 — V2.2.0 Startup Boot Placeholder

- Project: Alina Lavoro
- Type: frontend-defensive
- Priority: normal
- Deploy: no

## Goal

Prevent the app from ever looking like a dead empty shell during startup, resume, or transient render failure.

## Change

`src/frontend/Index.html` — `<main id="content">` now ships with a minimal boot card pre-rendered in HTML:

```html
<main id="content">
  <section class="card boot-card" id="bootPlaceholder">
    <div class="kicker">Alina Lavoro</div>
    <div class="status-title">Apertura app…</div>
    <p class="status-subtitle">Caricamento</p>
  </section>
</main>
```

`render()` overwrites `#content.textContent`/`innerHTML` on the first call, so the placeholder is replaced as soon as a page renders. If `render()` never runs (e.g. a future JS error early in startup), the user sees a branded loading card instead of a black/empty screen.

No framework, no fonts, no remote assets. Reuses existing `.card`, `.kicker`, `.status-title`, `.status-subtitle` primitives. One tiny rule `.boot-card{display:flex;flex-direction:column;align-items:flex-start;gap:6px}` added for tidy vertical layout.

## Done status

- Completed by: Claude Code (Opus 4.7, Extreme)
- Completion date: 2026-05-16
- Session: docs/sessions/2026-05-16-v220-frontend-fix-ui-polish-batch.md
- Deploy/tag/rollback: NOT executed (source-only patch)
