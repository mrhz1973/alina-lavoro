# Sessione — n8n queue reader processing skip

## Data

2026-05-11

## Stato

Implementazione manuale su n8n **testata OK** (anti-doppio-run + **terminatore esplicito** sul ramo `false` dell’IF).

## Workflow

`TEST - GitHub list Alina task queue`

## Scope

Solo workflow n8n reale e documentazione di supporto nel repo; **nessuna modifica** al codice applicativo Alina.

## Modifiche ai nodi (riepilogo)

### `List processing files` (nuovo)

- **Credential:** GitHub (salvata in n8n, es. `GitHub account`).
- **Resource:** File
- **Operation:** List
- **Repository Owner:** `mrhz1973`
- **Repository Name:** `alina-lavoro`
- **Path:** `docs/tasks/processing`

Fornisce l’elenco dei file già presenti in `processing`, usato dal filtro per capire quali task hanno già un prompt generato.

### `Filter first queued task` (modificato)

Il nodo continua a basarsi sulla lista dei file in **`docs/tasks/queue`**, ma integra anche l’output di **`docs/tasks/processing`**:

- considera solo i file **`.md`** in coda (come prima), ignora implicitamente **`.gitkeep`**;
- per ogni candidato in queue (ordinamento per **nome file**, primo disponibile), verifica se in `processing` esiste già il file **`{task}-cursor-prompt.md`**, dove `{task}` è lo stem del file in queue senza estensione (es. `0001-test-n8n-task.md` → `0001-test-n8n-task-cursor-prompt.md`);
- se quel prompt **esiste**, il task viene trattato come **già preso in carico** e **saltato**;
- se **tutti** i task in queue hanno già il relativo prompt in `processing`, l’output segnala **`has_task: false`** con messaggio del tipo: **`No queued task found or all queued tasks already have processing prompts`**;
- se esiste almeno un task in queue **senza** prompt corrispondente in `processing`, viene selezionato il primo in ordine tra quelli ancora “liberi”, con **`has_task: true`** come da logica precedente.

Non è richiesto in questa sessione riportare l’intero codice del nodo: la semantica è **allineata** a `docs/automation/n8n-workflows/task-lifecycle.md` (**Opzione A**: presenza del prompt in `processing` come prova di presa in carico).

### `IF has queued task` (nuovo)

- **Condizione in n8n:**
  - *value1:* `{{ String($json.has_task) }}`
  - *operator:* **is equal to**
  - *value2:* `true`
- **Ramo `true`:** collegato a **`Get queued task file`** (prosegue il flusso storico: decode, classify, build prompt, sessione, GitHub write).
- **Ramo `false`:** collegato al nodo **Code** `No queued task / already processing` (vedi sotto): **nessun** aggiornamento a prompt o sessione su GitHub; solo output strutturato in n8n per osservabilità.

### `No queued task / already processing` (nuovo, ramo `false`)

- **Tipo nodo:** Code (JavaScript).
- **Posizione:** ramo **`false`** di **`IF has queued task`** (terminatore esplicito al posto dello stop “a vuoto”).
- **Scopo:** esporre un item JSON **stabile** con motivazione e timestamp quando non c’è lavoro da fare (`has_task: false`), così l’esecuzione risulta **tracciabile** nell’UI n8n e nei log di run.

Logica implementata:

```javascript
const input = $input.first()?.json || {};

return [
  {
    json: {
      has_task: false,
      status: 'no_action',
      reason: input.message || 'No queued task found or all queued tasks already have processing prompts',
      next_action: 'none',
      checked_at: new Date().toISOString()
    }
  }
];
```

Campi in output:

| Campo | Ruolo |
|--------|--------|
| `has_task` | Sempre `false` su questo ramo. |
| `status` | Valore fisso `no_action` (nessuna azione GitHub). |
| `reason` | Messaggio dal filtro (`input.message`) oppure stringa di fallback uguale al messaggio documentato per “nessun task / tutti già in processing”. |
| `next_action` | Valore fisso `none`. |
| `checked_at` | Timestamp ISO 8601 della valutazione. |

## Esito test manuale

Scenario: task di test ancora presente in **`docs/tasks/queue`**, con **`docs/tasks/processing/{task}-cursor-prompt.md`** già esistente.

- Il workflow ha emesso **`has_task: false`** dal filtro.
- Il ramo **false** dell’**IF** ha eseguito il nodo Code **`No queued task / already processing`**, producendo l’output strutturato (`status: no_action`, `reason`, `checked_at`, ecc.).
- **Prompt** e **sessione** su GitHub **non** sono stati rigenerati né aggiornati.

**Sintesi:** test OK; uscita **esplicita** sul `false` con terminatore Code, senza doppia esecuzione sul task già coperto da prompt in `processing`.

## Condizione IF (riferimento esatto)

```text
{{ String($json.has_task) }}  is equal to  true
```

(`String(...)` normalizza il valore per il confronto con la stringa `true` nel nodo IF.)

## Non-goals (questa modifica)

- Nessuno **spostamento** di file tra cartelle (`queue` / `processing` / `done` / `failed`).
- Nessuna **cancellazione** di file task o prompt.
- Nessuna transizione automatica verso **`done`** o **`failed`**.
- Nessuna **esecuzione automatica** di Cursor.
- Nessun **deploy**, nessun **tag**, nessuna modifica ad **`gas-current/`**, nessuna modifica all’**app**.

## Prossimo passo consigliato

- Procedere verso una **marcatura `processing` più strutturata** (metadata nel task o nella sessione, `picked_at`, ecc.) come evoluzione oltre al solo controllo sul nome file del prompt.
- Valutare **notifiche redatte** (webhook/email) agganciate all’output del terminatore `false`, senza mai includere segreti.

## Riferimenti

- `docs/automation/n8n-workflows/queue-reader.md`
- `docs/automation/n8n-workflows/task-lifecycle.md`
- `docs/sessions/2026-05-11-n8n-queue-reader-manual-audit.md`
