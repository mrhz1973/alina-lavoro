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

## Web App `/exec` vs Google Sheet

- Per **uso quotidiano** sul cellulare di Alina va usato il link della **Web App** Apps Script con suffisso **`/exec`** (deployment **`@21`** sopra). Il link diretto al **Google Sheet** è solo **database / amministrazione**; non sostituisce l’interfaccia dell’app.

## Snapshot `gas-current/`

Allineato a **V1.8.10** post-deploy.

## Test manuale

**Aggiornamento post-test:** eseguito su **`/exec`** del deployment **`@21`** — **OK**.

| Voce | Esito |
|------|--------|
| Web App aperta sul cellulare tramite link **`/exec`** (non il link Sheet) | OK |
| Versione **1.8.10** in Impostazioni | OK |
| Promemoria stipendio — «Più tardi» / snooze 24 h | OK |
| Home | OK |
| Mesi | OK |
| Note / Impostazioni | OK |
| Smoke generale | OK |
