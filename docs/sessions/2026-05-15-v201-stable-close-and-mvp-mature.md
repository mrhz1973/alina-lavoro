# Session — V2.0.1 Stable Close + MVP Maturity Completion

**Date:** 2026-05-15
**Tasks:** 0328–0352
**Type:** docs-only batch + snapshot update + tag
**Implementer:** Claude Code

---

## Summary

Batch closes V2.0.1 as stable and marks the Alina Lavoro app as MVP mature / maintenance-ready.

- User confirmed: "tutto ok 2.0.1" — positive post-deploy /exec test (task 0328).
- gas-current snapshot updated to V2.0.1 @28 (task 0329).
- Stable tag `v2.0.1-stable` created and pushed (task 0331).
- LLMS.md + current-state.md + roadmap.md updated to reflect V2.0.1 stable.
- README.md updated.
- No source changes, no deploy, no rollback in this batch.

---

## V2.0.1 Release Summary (task 0332)

| Field | Value |
|---|---|
| Version | V2.0.1 |
| Feature | Quick resume from cache — app shows immediately when LS_ACCESS + valid cache exist; server login in background |
| Deploy slot | @28 (same deployment ID as @26/@24) |
| Stable tag | `v2.0.1-stable` |
| Production status | Stable — user tested OK 2026-05-15 |
| No source changes in batch | Confirmed |
| No deploy repeated in batch | Confirmed |

---

## MVP Maturity Definition (task 0333)

The Alina Lavoro app is **MVP mature** when:

1. Stable deploy exists and is user-tested.
2. User can record work shifts (INIZIO / FINE LAVORO).
3. User can view month summaries in Mesi.
4. User can view day-level detail in Dettaglio mese.
5. User can record notes.
6. Settings (language, theme, style, access code, payroll day) are usable.
7. Mobile usage (Redmi 9C NFC) is acceptable.
8. Rollback path exists via stable tags.
9. No immediate source blocker remains.

**Status at V2.0.1:** all criteria met.

---

## MVP Feature-Completeness Audit (task 0334)

| Feature | Category | Notes |
|---|---|---|
| Login / access code | A — complete | Retained; access code guards the app |
| Quick resume | A — complete | V2.0.1: cached app shown immediately if LS_ACCESS + cache valid |
| Offline fallback | A — complete | Cached app shown if server unreachable |
| Shift recording (INIZIO/FINE) | A — complete | With 5-minute rounding modal |
| Manual shift edit modal | A — complete | Full date/time/pause/note |
| Home metrics grid | A — complete | Today hours, month days, month hours, estimated |
| Salary reminder / snooze | A — complete | 24h snooze in localStorage |
| Mesi list grouped by year | A — complete | Collapsible year sections |
| Mesi 2-col grid on mobile | A — complete | Compact; fallback 1-col below 360px |
| Mesi salary button (past months only) | A — complete | Hidden for current/future months |
| Dettaglio mese DOM API | A — complete | V2.0.0 refactor |
| Dettaglio mese sticky header mobile | A — complete | V2.0.0 |
| Dettaglio mese metrics + cards + bars | A — complete | V1.9.2 |
| Note list / create / toggle / delete | A — complete | Functional |
| Impostazioni (language/theme/style/payroll) | A — complete | |
| Access code change in Impostazioni | A — complete | |
| Version display in Impostazioni | A — complete | APP_VERSION shown |
| Sync / queue / offline flush | A — complete | localStorage queue |
| Google Apps Script banner | B — known limitation | Platform-level, not app bug; can be dismissed |
| Startup login flash (pre-quick-resume) | B — acceptable | V2.0.1 reduces but doesn't eliminate; future optional polish |
| No-login mode | C — future optional | Only if user explicitly accepts link-only protection |
| Calendar/weekly view | C — future optional | Not currently requested |
| Charts / graphs | C — future optional | Not currently requested |
| Annual summary | C — future optional | Not currently requested |
| Service worker / PWA caching | D — not worth now | App is GAS-hosted; complexity vs value unclear |

---

## Login / Quick Resume Decision Record (task 0335)

- Login (access code) is retained as default behavior.
- No-login mode is not enabled by default.
- Quick resume (V2.0.1) is the accepted compromise: cached app shown immediately; server login completes in background.
- No-login mode remains a future decision only if user explicitly accepts link-only protection model.
- No source change needed in this batch.

---

## Startup / Cache UX Maturity Audit (task 0336)

V2.0.1 quick resume behavior:
- When LS_ACCESS and valid cache exist → `tryQuickResumeFromCache_` shows app immediately.
- Server `getBootstrap` call completes in background via `loginBackground_`.
- On success: state merged, cache saved, re-render.
- On failure: serverOk=false, render shows offline/stale state.

Expected improvement: perceived startup is near-instant if user returns to app with saved code and existing cache.

What to check if user still perceives slow startup:
- Verify LS_ACCESS is stored (first login must succeed).
- Verify cache is not stale/corrupted (localStorage key `alina_lavoro_cache_v1`).
- Verify network conditions (GAS server cold start is external).

Future optional polish (not now): cached badge indicator or reduced login flash animation.

---

## Page Maturity Audits (tasks 0337–0341)

### Home (task 0337)
Status: **MVP mature**.
- Shift start/end works.
- Today metrics shown.
- Monthly estimated income shown.
- Salary reminder with snooze works.
- Sync/offline indicator works.
- Active notes mini-list shown.

### Mesi (task 0338)
Status: **MVP mature**.
- All months grouped by year, collapsible.
- 2-column grid on mobile.
- Stipendio button hidden for current/future months.
- Dettaglio button always shown.
- DOM API construction; no large innerHTML string.

### Dettaglio mese (task 0339)
Status: **MVP mature**.
- V2.0.0: DOM API refactor, sticky back-button header on mobile.
- V1.9.2: metrics row, day cards, proportional hour bars.
- Tested OK on Redmi 9C NFC (V2.0.0 post-deploy).
- No calendar view — intentional MVP decision; future optional.

### Note (task 0340)
Status: **MVP mature**.
- Create, list, toggle done, delete work.
- Notes sync via queue.
- Active notes shown in Home mini-list.

### Impostazioni (task 0341)
Status: **MVP mature**.
- Language (IT/RU), theme (light/dark), style (6 options) work.
- Access code change works.
- Payroll day setting works.
- Average months setting works.
- Version displayed: `APP_VERSION · Apps Script`.

---

## Mobile / Redmi Maturity Checklist (task 0342)

| Scenario | Status |
|---|---|
| Cold open (no cache) | Acceptable — login screen, manual code entry |
| Warm open / quick resume | OK — V2.0.1 shows app immediately if cache valid |
| Offline open (no network) | OK — cached app shown, offline toast |
| Home page | OK — tested Redmi 9C NFC |
| Mesi page | OK — 2-col grid, compact cards |
| Dettaglio mese | OK — sticky header, day cards, bars |
| Mesi sticky header mobile | OK — V2.0.0 |
| Note page | OK — functional |
| Impostazioni | OK — functional |
| GAS platform banner | Known limitation — dismissable, not app bug |
| Redmi 9C NFC explicit test | OK — V2.0.0 post-deploy confirmed |

---

## Performance Maturity Checklist (task 0343)

| Area | Status |
|---|---|
| Dettaglio mese | Improved — DOM API (V2.0.0), no innerHTML rebuild |
| Startup | Improved — quick resume V2.0.1 |
| Mesi list | Acceptable — DOM API construction, 2-col grid |
| Home | Acceptable — no performance issue reported |
| Note | Acceptable — no performance issue reported |
| Speculative refactor | Not warranted — only if real slowness reported by user |

---

## Data Safety / Backend Maturity Audit (task 0344)

- No backend changes in this batch.
- Existing data flow: frontend queue → `syncBatch` → Google Sheet (TURNI/STIPENDI/NOTE/CONFIG/SYNC_LOG).
- LockService guards saveShift and syncBatch.
- Backup-before-destructive-ops exists (`backupSheet_`, max 5 backups).
- No data migration in this batch.
- No destructive operations in this batch.
- Rollback remains via stable tag + deploy-slot reference.
- Backend assessed as MVP mature.

---

## Apps Script Deployment-Slot Maintenance Note (task 0345)

- Google Apps Script allows max 20 deployment slots per project.
- The 20-slot limit was reached during V2.0.0 development.
- Current strategy: update existing deployment ID in place (`clasp deploy --deploymentId <ID>`).
- Do not delete deployments without explicit rollback/deployment maintenance gate.
- Do not create a new deployment slot unless explicitly required and gate confirmed.
- Deployment ID (used for @24 / @26 / @28): `AKfycbyIkaQqS-Dce0tfdxyfjdnEEE_xSb3Ys3KdeGL9xiX652QfgfAFRRBSvmuLXdPqQhaXSg`.

---

## Rollback Readiness (task 0346)

| Version | Tag | Deploy | Notes |
|---|---|---|---|
| V2.0.1 | `v2.0.1-stable` | @28 | Current stable |
| V2.0.0 | `v2.0.0-stable` | @26 | Previous stable |
| V1.9.2 | `v1.9.2-stable` | @24 | Prior stable |
| V1.9.1 | `v1.9.1-stable` | @23 | Historical |
| V1.9.0 | `v1.9.0-stable` | @22 | Historical |
| V1.8.10 | `v1.8.10-stable` | @21 | Historical |

Rollback: checkout tag → `npm run deploy` after explicit user gate.

---

## Source-of-Truth Consistency (task 0347)

| Source | Role |
|---|---|
| `src/frontend/Index.html` | Canonical frontend source |
| `src/backend/Code.gs` | Canonical backend source |
| `gas-current/` | Post-deploy snapshot — read-only; never use as source for patches |
| `.gas/` | Generated sync area (`npm run sync` output); not source |
| GitHub `main` + stable tags | Source of truth for orchestrator and rollback |
| Apps Script editor | Runtime only; no manual editor edits as source |

---

## V2.0.2 Candidate Map (task 0351)

| Group | Description | Priority |
|---|---|---|
| A | Optional startup UX polish — if user still sees login flash after quick resume | Low / on demand |
| B | Optional no-login mode decision — only if user explicitly accepts link-only protection | Low / explicit gate |
| C | Optional old comment/version note cleanup in source | Cosmetic only |
| D | Optional Home/Mesi/Note performance review — only if real slowness reported | On demand |
| E — Reject | Redesign, charts, calendar, new framework, service worker | Not unless explicitly requested |

No V2.0.2 source changes in this batch.

---

## MVP Mature Close (task 0352)

- V2.0.1 stable close complete.
- App is **MVP mature / maintenance-ready**.
- V2.0.2 not started.
- Next recommended step: review whether quick resume resolves perceived startup for the user.
  - If yes: no source change needed.
  - If not: decide between startup UX polish (group A) or no-login mode (group B).
- No deploy repeated in this batch.
- No rollback in this batch.
- No source behavior changes in this batch.
