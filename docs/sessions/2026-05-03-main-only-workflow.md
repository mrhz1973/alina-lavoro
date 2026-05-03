# Passaggio a workflow **main-only**

**Data:** 2026-05-03

## Motivo

Ridurre complessità operativa: il doppio branch **`dev`** / **`main`** non è più necessario per la scala attuale del progetto. L’utente richiede un unico flusso lineare su **`main`**, usando i **tag stabili** come principale meccanismo di rollback.

## Stato iniziale (blocco documentale)

- **`main`** e **`dev`** **identici** sullo stesso commit al momento della verifica locale immediatamente prima degli aggiornamenti documentali (nessun delta `git diff main dev`).
- **`package.json`:** **1.8.1**.
- Produzione Apps Script: deployment **`@9`**, tag Git **`v1.8.1-stable`**.
- Nessuna modifica a `src/` in questo blocco; nessun deploy; nessun nuovo tag.

## Nuova policy branch

| Elemento | Policy |
|----------|--------|
| **`main`** | Unico branch **operativo**: sviluppi, fix, micro-release, documentazione. Cursor **committa e pusha** su `main`. |
| **`dev`** | **Legacy / inattivo**: non usato per nuovi lavori; può restare sul remoto; non va citato come branch operativo nei prompt ordinari. |
| Merge `dev` → `main` | **Non** parte del flusso normale. |
| Rollback | Principale strumento: **tag stabili** precedenti su `main` (es. `v1.8.0-stable`, `v1.6.2-stable`, …). |
| Produzione | Resta **Apps Script** (deployment corrente documentato in `PROJECT_STATE` / sessioni). |
| **`gas-current/`** | Solo **snapshot** post-deploy quando aggiornato in sede di release; non sorgente primaria. |
| GitHub | Resta **fonte di verità** per l’orchestratore. |

## Cosa fare nei prossimi prompt Cursor

- Chiedere esplicitamente lavoro su **`main`**: `git checkout main`, `git pull origin main`.
- Chiudere i blocchi con commit selettivo e **`git push origin main`**.
- Per deploy: seguire **`docs/STREAMLINED_WORKFLOW.md`** e il prompt del task (`npm run deploy` quando coerente).
- Dopo release importante: aggiornare doc, creare **tag stabile** quando richiesto dal blocco.

## Cosa non fare più

- Non pianificare **merge `dev` → `main`** come step routine.
- Non dire «branch beta obbligatorio» / «lavora su `dev`» salvo contesto storico nelle sessioni passate.
- Non gestire due linee di sviluppo parallele **`dev`** / **`main`** per il lavoro ordinario.

## Documenti aggiornati

`docs/STREAMLINED_WORKFLOW.md`, `docs/ORCHESTRATOR_RULES.md`, `docs/WORKFLOW.md`, `docs/AI_RULES.md`, `docs/CHECKPOINT.md`, `docs/PROJECT_STATE.md`, `docs/roadmap.md`, `docs/COMMANDS.md`.

## Branch remoto `dev`

In questo blocco **non** viene cancellato il branch remoto `dev`; eventualmente si può solo **riallinearlo** a `main` per tenerlo identico, senza usarlo operativamente.
