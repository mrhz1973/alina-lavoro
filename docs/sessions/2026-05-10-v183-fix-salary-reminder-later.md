# Fix: promemoria stipendio — pulsante «Più tardi» non chiude la notifica

**Data:** 2026-05-10

## Bug

In Home, sezione promemoria stipendio (`state.reminder.active`): il pulsante **Più tardi** (`t('later')`) chiamava solo `toast(...)`, senza aggiornare lo stato; la notifica restava visibile.

## Fix

- Nuova funzione **`dismissSalaryReminder()`**: imposta `state.reminder = { active: false }`, `saveCache()`, `toast(t('later'))`, `render()`.
- Il pulsante ghost usa `onclick="dismissSalaryReminder()"`.
- Nessun cambio backend; dopo bootstrap/sync il server può ripresentare il promemoria se lo stipendio manca ancora.

## File

- `src/frontend/Index.html`

## Deploy / test

Fix **non** ancora in produzione Apps Script finché non viene eseguito deploy dedicato; **test manuale utente su `/exec`** da ripetere dopo deploy.
