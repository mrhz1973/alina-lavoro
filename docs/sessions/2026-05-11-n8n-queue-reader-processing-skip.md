# Sessione — n8n queue reader processing skip

## Data

2026-05-11

## Stato

Implementazione manuale su n8n **testata OK** (prima logica anti-doppio-run).

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
- **Ramo `false`:** **nessun nodo a valle** — il workflow **termina** senza aggiornare prompt né sessione.

## Esito test manuale

Scenario: task di test ancora presente in **`docs/tasks/queue`**, con **`docs/tasks/processing/{task}-cursor-prompt.md`** già esistente.

- Il workflow ha emesso **`has_task: false`**.
- Il ramo **false** dell’**IF** non ha avviato nodi successivi (**stop corretto**).
- **Prompt** e **sessione** non sono stati rigenerati né aggiornati.

**Sintesi:** test OK; il flusso si è **fermato sul false** come previsto, evitando la **doppia esecuzione** sullo stesso task già dotato di prompt in `processing`.

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

- Valutare un **ramo `false` esplicito** (es. nodo *NoOp*, log strutturato, notifica redatta) per rendere più visibile in n8n l’uscita “tutti i task già in processing”, oppure
- Procedere verso una **marcatura `processing` più strutturata** (metadata nel task o nella sessione, `picked_at`, ecc.) come evoluzione successiva rispetto al solo controllo sul nome file del prompt.

## Riferimenti

- `docs/automation/n8n-workflows/queue-reader.md`
- `docs/automation/n8n-workflows/task-lifecycle.md`
- `docs/sessions/2026-05-11-n8n-queue-reader-manual-audit.md`
