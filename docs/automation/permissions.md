# Automazione — politica permessi

Le azioni sotto sono classificate per ridurre rischio su **produzione** (Apps Script **@24**, Sheet, utenti finali). Un task in **`docs/tasks/queue/`** può **restringere** ulteriormente; non può **allargare** senza revisione orchestratore.

## Politica conferme — docs-only senza nuovo gate umano

Riferimento canonico: `docs/ORCHESTRATOR_RULES.md` — **PRIORITÀ 0A**.

- I task **docs-only** con **allowed paths sotto `docs/`** e **senza segreti/dati sensibili** sono **consentiti senza nuovo gate umano**: l'implementatore esegue e chiude secondo workflow.
- Il **gate esterno (conferma utente esplicita)** resta **obbligatorio** per:
  - runtime / esecuzione CLI esterna;
  - VPS runtime;
  - n8n runtime;
  - modifiche app Alina (`src/**`, `gas-current/**`, `.gas/**`, `appsscript.json`, `package.json`, `.clasp.json`);
  - deploy Apps Script;
  - tag git;
  - rollback;
  - API key, login;
  - GitHub Actions (`.github/workflows/**`);
  - costi ricorrenti nuovi;
  - runner automatico;
  - dati personali, credenziali, OAuth material, segreti.
- Un task **non può allargare i permessi** oltre quanto documentato; ogni allargamento richiede revisione orchestratore.
- Se durante un task docs-only **emerge un gate sensibile** (es. necessità imprevista di modificare runtime), l'implementatore deve **fermarsi**, dichiararlo nel riepilogo finale, e non procedere oltre.

## Sempre consentito

- Lettura repository; `git status`, `git diff`, `git log`.
- Creazione/modifica file **solo** sotto `docs/` quando il task è dichiarato documentale.
- Esecuzione controlli **read-only** da `docs/COMMANDS.md` (grep, `node --check` su script estratto, ecc.).
- Aggiornamento **`docs/tasks/`** (queue/done/failed) come meta-lavoro documentato.

## Consentito a basso rischio (con task esplicito)

- Commit su **`main`** che toccano solo path consentiti nel task.
- Push su **`main`** dopo verifica diff e `git diff --check`.
- Copia template da `docs/tasks/templates/` verso `docs/tasks/queue/`.

## Consentito solo se il task lo autorizza per iscritto

| Operazione | Note |
|------------|------|
| Modifica `src/frontend/Index.html` | Richiede template **frontend** o sezione Files allowed |
| Modifica `src/backend/Code.gs` | Backend — sempre esplicito |
| Bump `package.json` / `APP_VERSION` | Tipicamente solo **release task** |
| Modifica `gas-current/` | Solo **snapshot post-deploy** documentato |
| `clasp push` / `clasp deploy` | Credenziali e ambiente dedicati |
| Tag Git (`v*-stable`) | Solo release task + conferma |
| Eliminazione file/directory applicative | Path elencati nel task |

## Richiede conferma esplicita dell’utente (gate esterno)

- **Deploy** su Apps Script che influisce sulla Web App in produzione.
- **Rollback** deployment o ripristino tag precedente come “nuova verità” operativa.
- **Google Sheet**: schema, colonne, script legati ai dati live.
- **Eliminazioni** irreversibili (branch, storico sensibile).
- **Nuove librerie** npm o CDN nel frontend.
- **Service worker** o modifiche che cambiano modello di caching/offline.
- **Credenziali**: `.clasp.json`, token API, chiavi SSH sul VPS, password Sheet.

## Principio

Se un’operazione non è né **sempre consentita** né coperta da un **task valido**, l’implementatore (umano o agente) deve **fermarsi** e demandare all’orchestratore/utente.
