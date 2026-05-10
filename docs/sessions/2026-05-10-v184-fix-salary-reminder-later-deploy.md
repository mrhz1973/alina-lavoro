# Release **V1.8.4** — fix promemoria stipendio «Più tardi» — deploy Apps Script

**Data:** 2026-05-10

## Contenuto release

- Commit funzionale: **`beb277a`** — `dismissSalaryReminder()`: chiude la notifica stipendio in Home al tap su **«Più tardi»** (vedi `docs/sessions/2026-05-10-v183-fix-salary-reminder-later.md`).
- Backend: invariato.

## Deploy Windows

Copia in **`.gas/`** da `src/` + `appsscript.json`, poi `npx.cmd clasp push` e `npx.cmd clasp deploy`.

## Esito clasp

| Step | Note |
|------|------|
| Push + deploy **@13** | ID `AKfycbzm6utrOnZ6dTyH_Pqcp-2c_O7XowvI-nEIpvqrfca4eAh-S2twQLkweuBgc_D4Q-LdpA` — fix incluso, **`APP_VERSION` ancora 1.8.3** (superseded) |
| Bump **1.8.4** in `package.json` / `Index.html` | |
| Push + deploy **@14** | ID `AKfycbx-PVHZvRait-KwBfLzc6pWfuMltRN9s0WiJMZN9p71hoK32Bmw9N62ICQod8JIAJVV4Q` — **produzione documentata** |

## Rollback immediato precedente

- **V1.8.3 / `@12`:** `AKfycbwp39AN4DPH4BXikfemvF7G6yUdObnYro63nC3fqvUcn9G5XxzWyXD91AR2H8pfV9WDaw` — tag **`v1.8.3-stable`**.

## Tag Git

- **`v1.8.4-stable`** sul commit di release (bump + doc + snapshot).

## Test manuale

**Da ripetere su `/exec`** del deployment **`@14`**: versione **1.8.4** in Impostazioni; promemoria stipendio; **«Più tardi»** chiude il banner; **«Inserisci»** apre ancora la modale.
