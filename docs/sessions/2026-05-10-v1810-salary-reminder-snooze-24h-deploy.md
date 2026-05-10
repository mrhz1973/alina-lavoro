# Release **V1.8.10** — snooze **24 ore** promemoria stipendio (locale) — deploy Apps Script

**Data:** 2026-05-10

## Contesto

Richiesta: dopo **«Più tardi»** sul promemoria stipendio in Home, il banner non deve ripresentarsi sullo stesso browser/dispositivo per **24 ore**, senza modificare Sheet né backend.

Precedente release stabile: **V1.8.9** (deploy **`@20`**, tag **`v1.8.9-stable`**).

## Contenuto release

- Costante **`LS_SALARY_REMINDER_SNOOZE`** (`alina_lavoro_salary_reminder_snooze_until_v1`), **`SALARY_REMINDER_SNOOZE_MS`** = 86400000 (24 h).
- Helper: **`getSalaryReminderSnoozeUntil_`**, **`isSalaryReminderSnoozed_`**, **`snoozeSalaryReminder24h_`**, **`shouldShowSalaryReminder_`** (banner solo se `state.reminder.active` **e** snooze non valido).
- **`dismissSalaryReminder()`:** imposta snooze 24 h in **localStorage**, **`state.reminder = { active:false }`**, **`saveCache()`**, toast «Più tardi», **`render()`**.
- **`renderHome()`:** condizione banner tramite **`shouldShowSalaryReminder_()`** così, dopo sync/bootstrap, se il server invia ancora `reminder.active` ma lo snooze locale è attivo, il banner resta nascosto fino a scadenza.
- Backend / Sheet / payload **invariati**.

## Deploy Windows

**Git Bash:** sync manuale (`mkdir -p .gas`, `cp` …) + `npx clasp push` + `npx clasp deploy` — `npm run deploy` da **cmd** può fallire sullo script **`sync`** (`mkdir -p`).

## Esito clasp

| Step | Note |
|------|------|
| Push + deploy **`@21`** | ID **`AKfycbz0_8bE92ATlKeb2oaOrhqOwrUgyiEnw977libqBH5Swkiv2LMwdDK0EbJyo-h7Zpjw6A`** — produzione documentata (`APP_VERSION` **1.8.10**) |

## Rollback immediato precedente

- **V1.8.9 / `@20`:** `AKfycbxxbOtZmmcflqyrToKXo_bR6MaK4pupI-fkDrGRmZsC2vSnjQajmwMNePmg26ji-XY8og` — tag **`v1.8.9-stable`**.
- **V1.8.8 / `@19`:** `AKfycbyzsTI8uaRJDGyiNrmm6jQRGjNyI80kE_Z4W7qwBLcbwKt6wp-coqsmlcG-cXUAJYtKlg` — tag **`v1.8.8-stable`**.

## Tag Git

- **`v1.8.10-stable`** sul commit di release.

## Snapshot `gas-current/`

Allineato a **V1.8.10** post-deploy.

## Test manuale

**Da fare** su Web App **`/exec`** del deployment **`@21`**:

| Voce | Esito |
|------|--------|
| Promemoria visibile se backend attivo e snooze assente/scaduto | |
| «Più tardi»: banner chiuso, toast, nessuna riapparizione entro 24 h | |
| Dopo 24 h (o dopo aver cancellato la chiave LS di test): se reminder ancora attivo dal server, banner di nuovo visibile | |
| Inserimento stipendio: promemoria sparisce come prima (sync) | |
| Smoke Home / Mesi / Note / Impostazioni | |
