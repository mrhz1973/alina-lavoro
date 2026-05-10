# Release task — [Titolo breve es. v1.x.y]

## Metadata

| Campo | Valore |
|--------|--------|
| **ID** | REL-TASK-YYYY-MM-DD-vX-Y-Z |
| **Tipo** | release |
| **Versione target** | X.Y.Z |
| **Branch** | `main` |

## Context

- Release precedente (versione, deploy `@N`, tag stable).
- Motivo della release (fix, feature, docs-only eccezionale — preferire task separati se solo docs).

## Objective

- Bump semver coerente con semantica progetto.
- Allineamento `package.json` e `APP_VERSION` in `src/frontend/Index.html` quando la release include frontend.

## Files allowed

- Come da release: tipicamente `src/frontend/Index.html`, `package.json`, `docs/**`, `gas-current/**` post-deploy.

## Files forbidden fino alla fase indicata

- `gas-current/` — **solo snapshot post-deploy**, mai come passo intermedio fuori sequenza documentata.

## Requirements

### Version bump

- `package.json` → versione finale.
- `APP_VERSION` in `src/frontend/Index.html` → stessa versione utente visibile in Impostazioni.

### Deploy Apps Script

- Sync verso `.gas/` (Git Bash su Windows se `npm run sync` fallisce da cmd).
- `clasp push` + `clasp deploy` — annotare **deployment ID** e **numero @** dall’output.

### Snapshot

- Copia in `gas-current/` **dopo** deploy riuscito (`Codice.js` ← `Code.gs`, `Index.html`, `appsscript.json`).

### Tag stabile

- Tag `vX.Y.Z-stable` su commit che riflette release finale — **solo** se incluso nel task.

### Rollback documentato

- Deploy e tag precedenti da citare in sessione (`docs/sessions/`) per rollback immediato.

## Constraints

- Backend (`Code.gs`) e Sheet: modifiche **solo** se il task lo autorizza esplicitamente.
- Commit selettivo; no `git add .`.

## Checks

- Controlli frontend standard da `docs/COMMANDS.md` se toccato `Index.html`.
- `git diff --check`.
- Verifica assenza modifiche accidentali a file non autorizzati.

## Deploy policy

**allowed-with-gate** — deploy è parte integrante del task; richiede credenziali clasp valide sul runner.

## Expected output

- Sessione deploy in `docs/sessions/` con ID deployment e numero @.
- Aggiornamento `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md`, `docs/roadmap.md` se convenzione progetto.

## Manual test gate

**required**

- Web App `/exec` sul deployment finale.
- Smoke base + dispositivo target se disponibile (es. Xiaomi Redmi 9C NFC).
- Conferma versione UI in Impostazioni.
