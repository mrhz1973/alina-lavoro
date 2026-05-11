# n8n Workflow — Done Copy-Only

## Nome workflow n8n

**`TEST - Mark Alina task done copy-only`**

## Stato

Test **manuale OK** sul task **0003** (validazione documentata in [`docs/sessions/2026-05-11-n8n-done-copy-only-0003-validation.md`](../../sessions/2026-05-11-n8n-done-copy-only-0003-validation.md)).

## Scopo

Workflow **separato** dal queue reader ([`queue-reader.md`](./queue-reader.md)):

- Leggere il task **0003** da `docs/tasks/queue`.
- Costruire una **copia** archiviata sotto `docs/tasks/done` con contenuto originale più sezione di esito.
- **Creare o aggiornare** `docs/tasks/done/0003-test-n8n-done-copy-only.md` in modo **ri-eseguibile** (GitHub File Edit).
- Leggere la **sessione automation** del task 0003.
- **Aggiornare** la sessione con esito **done copy-only**.
- **Non** cancellare il file originale in `docs/tasks/queue`.

## Scope

**Incluso**

- Task **0003** (path e nomi fissi nel workflow attuale).
- Modalità **done copy-only** (copia + metadata esito).
- Aggiornamento sessione automation **0003**.

**Escluso**

- **Delete** (o move) del task da `queue`.
- Gestione **generica** `done` / `failed` per qualsiasi task (vedi [`done-failed-design.md`](./done-failed-design.md)).
- Esecuzione **Cursor** automatica.
- **Deploy**, **tag**, modifica **app** (`src/`), **`gas-current/`**.

## Struttura nodi

```text
Manual Trigger
→ Get queue task 0003
→ Build done copy content
→ Update done file 0003
→ Get automation session 0003
→ Build updated session 0003
→ Update automation session 0003
```

## Nodi (descrizione breve)

| Nodo | Ruolo |
|------|--------|
| **Manual Trigger** | Avvio manuale del flusso. |
| **Get queue task 0003** | Legge `docs/tasks/queue/0003-test-n8n-done-copy-only.md` (contenuto da API GitHub, es. base64). |
| **Build done copy content** | Decodifica il markdown, costruisce il body per `done` = task originale + sezione **`## Done copy-only outcome`** con campi strutturati (vedi sotto). |
| **Update done file 0003** | Operazione **GitHub File Edit** (create/update con `sha` se il file esiste) su `docs/tasks/done/0003-test-n8n-done-copy-only.md`. |
| **Get automation session 0003** | Legge `docs/sessions/automation-0003-test-n8n-done-copy-only.md`. |
| **Build updated session 0003** | Aggiunge alla sessione la sezione **`## Done copy-only outcome`** (coerente con il done). |
| **Update automation session 0003** | Aggiorna il file sessione su GitHub (stessa logica idempotente di edit). |

### Sezione attesa in `done` (`## Done copy-only outcome`)

Campi verificati sul repository (indicativi):

- `status`: `done`
- `outcome`: `copy-only validation`
- `completed_at` (timestamp)
- `original_queue_path`
- `cursor_prompt_path`
- `session_path`
- `source_sha` (SHA del file sorgente rilevante, es. queue o ultimo commit)

## Nota idempotenza

Il nodo iniziale **`Create done file 0003`** falliva alla **riesecuzione** perché il file in `done` **esisteva già** (API “create” non idempotente in quel contesto).

Correzione: uso di **Edit** (update con `sha` / upsert supportato dal nodo GitHub) e naming concettuale **`Update done file 0003`** per riflettere il comportamento **ri-eseguibile**.

## Output verificati (GitHub)

- `docs/tasks/done/0003-test-n8n-done-copy-only.md`
- `docs/sessions/automation-0003-test-n8n-done-copy-only.md`

Il file `docs/tasks/queue/0003-test-n8n-done-copy-only.md` **resta** in `queue` (scelta prudente: nessuna delete).

## Vincoli rispettati

- Nessuna delete da `queue`.
- Nessuna modifica all’app Alina.
- Nessun deploy Apps Script.
- Nessun tag Git.
- `gas-current/` non toccato.

## Limiti

- Workflow **hardcoded** sul task **0003** (path fissi).
- **Non** generalizzato a task arbitrari.
- **Non** gestisce `failed`.
- **Non** esegue Cursor.
- **Non** decide outcome in modo automatico oltre alla logica codificata nel build dei contenuti.

## Prossimo passo consigliato

Generalizzare il workflow per ricevere **task id / path queue / path done / path sessione** in modo **dinamico**, oppure introdurre un task **0004** dedicato al test di generalizzazione.

## Riferimenti correlati

- Design lifecycle: [`task-lifecycle.md`](./task-lifecycle.md)
- Design done/failed (move, gate, non ancora tutto in n8n): [`done-failed-design.md`](./done-failed-design.md)
- Queue reader: [`queue-reader.md`](./queue-reader.md)
