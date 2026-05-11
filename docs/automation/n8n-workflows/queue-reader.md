# n8n Workflow — Queue Reader (`TEST - GitHub list Alina task queue`)

## Nome workflow n8n

**`TEST - GitHub list Alina task queue`**

## Stato

**Aggiornamento (workflow più avanzato della prima documentazione):**

- Test **completo OK**.
- Il workflow **non** si limita più a lettura, decode e classify del task.
- È **ri-eseguibile**: se il prompt Cursor o la sessione automation esistono già, vengono **aggiornati**; altrimenti vengono **creati**.
- **Anti-doppio-run (2026-05-11):** se per un task in `docs/tasks/queue` esiste già `docs/tasks/processing/{task}-cursor-prompt.md`, quel task viene **saltato**; se non resta nessun task “libero”, il flusso va sul ramo **`false`** dell’**IF** con terminatore **Code** `No queued task / already processing` (**nessun** write su prompt/sessione GitHub; dettagli in [`docs/sessions/2026-05-11-n8n-queue-reader-processing-skip.md`](../../sessions/2026-05-11-n8n-queue-reader-processing-skip.md)).
- **Skip `done` (2026-05-11):** il queue reader legge anche **`docs/tasks/done/`** e **non** elegge un file in coda se esiste già **`docs/tasks/done/{task}.md`** con lo stesso nome del task in `queue`. **Implementato e validato manualmente in n8n** (nodo **List done files** con **`Execute Once`**, filtro **Filter first queued task** in versione finale pulita; workflow **`TEST - Mark Alina task done copy-only generalized` non modificato**) — [`docs/sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md`](../../sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md); design in [`docs/sessions/2026-05-11-n8n-queue-reader-skip-done-design.md`](../../sessions/2026-05-11-n8n-queue-reader-skip-done-design.md).
- **Ramo `has_task: true` (task 0005, 2026-05-11):** validazione manuale in n8n su **`0005-test-n8n-queue-reader-true-branch`** (file in `docs/tasks/queue/`): filtro **`has_task: true`** → **Build Cursor prompt** → **Create** prompt in `docs/tasks/processing/` e sessione in `docs/sessions/` (commit **`8d579a8`**, **`05e1292`** su `main`); **secondo run** **`has_task: false`** con messaggio standard → **0005** saltato perché il prompt è già in **processing**. **Nessuna delete** da `docs/tasks/queue/`; altri workflow n8n non toccati. Output numerici e path in [`docs/sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md`](../../sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md).
- **Primo task reale docs-only 0100 (2026-05-11):** `docs/tasks/queue/0100-cursor-prompt-template-in-repo.md` — selezione corretta (**`has_task: true`**, `task_sha` **`b7a221e025659457e97059df84c25ef6167d7276`**, `task_size` **2600**). **Edge case:** metadata in **tabella** Markdown → il parser del nodo **Classify task** (comportamento attuale) non riempie `Project` / `Type` / `Priority` / `Deploy policy` nel prompt. **Senza modificare n8n:** normalizzazione del task in **lista** (`- Project: …`, `- Type: …`, `- Status: …`, `- Deploy: …`); rimozione mirata del prompt errato in **`processing`** (**commit `3f4aa2d`**); rigenerazione corretta (**commit `4f09513`**, SHA file **`7a89e587510616aef2afdf8a0e0c632f434b9002`**) e **Update session file** sulla sessione esistente (**commit `b7ba555`**, SHA **`085b363a8f192382b28fd4ac48f5b98df09da6fa`**). **Secondo run** **`has_task: false`** (messaggio standard, skip **`processing`**). **Nessuna delete** da `queue`. **Per ora** i task in coda devono usare il **formato lista** per i metadata finché il parser non viene esteso. Cronaca in [`docs/sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md`](../../sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md).
- Nessuna modifica al codice applicativo del repo (solo file documentazione/task prodotti dal flusso).

## Ownership lifecycle

Lo skip `processing` e lo skip `done` in questo queue reader sono **comportamenti validati** (2026-05-11). La **ownership della chiusura done/failed** — chi può marcare done, chi può marcare failed, i due pattern validi, le regole di coesistenza — è definita nel documento canonico:

**[`lifecycle-ownership.md`](./lifecycle-ownership.md)**

## Scopo

1. Leggere i file in **`docs/tasks/queue`**, in **`docs/tasks/processing`** e in **`docs/tasks/done`** per individuare il **primo** file **`.md`** in coda (ordinamento per nome file) che **non** abbia né il relativo **`docs/tasks/processing/{task}-cursor-prompt.md`** né **`docs/tasks/done/{task}.md`** (stesso `{task}` = nome file in `queue` senza `.md`). Allineato a *Opzione A* + skip **`done`** in [`task-lifecycle.md`](./task-lifecycle.md) e contratto in [`done-copy-only-generalization.md`](./done-copy-only-generalization.md).
2. **Decodificarlo** e **classificarlo** (metadata + contenuto).
3. **Generare il prompt Cursor** operativo.
4. **Creare o aggiornare** il file prompt in `docs/tasks/processing/`.
5. **Creare o aggiornare** la sessione automation in `docs/sessions/`.

La sessione automation indica esplicitamente che **Cursor non è ancora stato eseguito** sul prompt generato (passo successivo manuale o runner).

- **Test osservati (workflow completo):**
  - scenario **tutti saltati:** **`has_task: false`** e **`message: No queued task found or all queued tasks already have processing prompts or done files`** (nessun eleggibile rispetto a `processing` + `done`); dopo **`Execute Once`** su **`List processing files`**, **nessuna regressione** su questo scenario;
  - scenario **0005 ramo `true`:** vedi bullet **Stato** su **`0005-test-n8n-queue-reader-true-branch`** e secondo run con **`has_task: false`** (skip via **`processing`**);
  - scenario **0100 primo docs-only:** edge case metadata (tabella → campi vuoti; correzione in lista); delete mirata del prompt in **`processing`**; rigenerazione + update sessione; secondo run **`has_task: false`** — vedi bullet **Stato** e [`docs/sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md`](../../sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md).

## Trigger

**Manual Trigger**

## Flusso nodi (struttura finale)

```text
Manual Trigger
→ List files                         (queue: docs/tasks/queue)
→ List processing files              (docs/tasks/processing)
→ List done files                    (docs/tasks/done)
→ Filter first queued task           (salta se esiste processing/{task}-cursor-prompt.md O done/{task}.md)
→ IF has queued task
    ├→ true  → Get queued task file
    │          → Decode task markdown
    │          → Classify task
    │          → Build Cursor prompt
    │             ├→ Check Cursor prompt file exists
    │             │   ├→ Success → IF Cursor prompt file exists
    │             │   │   ├→ true  → Update Cursor prompt file
    │             │   │   └→ false → Create Cursor prompt file
    │             │   └→ Error → Create Cursor prompt file
    │             └→ Build session file
    │                 → Check session file exists
    │                     ├→ Success → IF session file exists
    │                     │   ├→ true  → Update session file
    │                     │   └→ false → Create session file
    │                     └→ Error → Create session file
    └→ false → No queued task / already processing   (Code: output JSON no_action; nessun write GitHub)
```

- **Micro-ottimizzazione n8n (2026-05-11):** anche **`List processing files`** è impostato con **`Execute Once`**, come **`List done files`**, per evitare la moltiplicazione inutile degli item quando a monte arrivano più trigger/item; dopo la modifica l’output della lista `processing` risulta **4** voci coerenti con i prompt presenti (vedi sessione di validazione).
- **List processing files** / **List done files:** nodi GitHub list directory su **`docs/tasks/processing`** e **`docs/tasks/done`**. Usare **`Execute Once`** su **entrambi** se altrimenti ciascun nodo emette la directory **una volta per ogni** item a monte (duplicati rumorosi nel **Code** `Filter first queued task`). Con **Execute Once**, **`List done files`** resta coerente (es. **3** entry in `done`: `.gitkeep` + due task); **`List processing files`** resta coerente (es. **4** prompt: `0001-` … `0004-…-cursor-prompt.md`). Il **Code** `Filter first queued task` legge le tre liste con **`$('List files').all()`**, **`$('List processing files').all()`**, **`$('List done files').all()`** (nomi nodi devono coincidere).
- **IF has queued task:** `{{ String($json.has_task) }}` **is equal to** `true` sul ramo `true`; sul `false` il flusso entra nel **Code** `No queued task / already processing` (item con `status: 'no_action'` e/o campo `message` coerente con l’output del filtro, ecc.) **senza** aggiornare prompt o sessione su GitHub.
- (Sintassi ramo **Error → Create** invariata come fallback per creazione file quando `has_task` è `true`.)

## Regole operative (invariati principi)

- Ignorare `.gitkeep`.
- Task validi: solo file `.md` in `docs/tasks/queue`, ordinati per nome file; il **primo** eleggibile è il primo `.md` per cui **non** esiste **`docs/tasks/processing/{task}-cursor-prompt.md`** **e** **non** esiste **`docs/tasks/done/{task}.md`** (`{task}` = basename del file in coda senza `.md`). Skip se almeno uno dei due file esiste.
- **Nessuna delete** da `docs/tasks/queue/` in questa fase (né come effetto del filtro, né come “pulizia” post-`done`): il task può restare in coda anche dopo archiviazione in `done`; lo skip evita solo **nuovi** prompt/sessione automation.
- Se **nessun** task in queue resta eleggibile: `has_task: false` e messaggio **`No queued task found or all queued tasks already have processing prompts or done files`** (come osservato nel test finale); il ramo **`false`** dell’**IF** esegue il **Code** `No queued task / already processing` (solo output in n8n); **nessun** aggiornamento a file prompt/sessione su GitHub.
- **Contratto** con il flusso **done copy-only generalizzato** ([`done-copy-only-generalization.md`](./done-copy-only-generalization.md)): dopo **`Verify done file`** e update sessione, il task può restare in `queue`; il queue reader **non** deve rigenerare prompt se `done/{task}.md` esiste già.
- Non modificare codice applicativo (`src/`), non deploy Apps Script, non tag, non `gas-current/` tramite questo workflow.

## File verificati / prodotti (prova su repository)

| Ruolo | Path |
|--------|------|
| Task in coda (input) | `docs/tasks/queue/0001-test-n8n-task.md` |
| Prompt Cursor (output, create/update) | `docs/tasks/processing/0001-test-n8n-task-cursor-prompt.md` |
| File `done` (lettura filtro skip) | `docs/tasks/done/{task}.md` |
| Sessione automation (output, create/update) | `docs/sessions/automation-0001-test-n8n-task.md` |
| Questa documentazione | `docs/automation/n8n-workflows/queue-reader.md` |

## Note sicurezza

- Le **credential GitHub** restano **solo in n8n** (istanza/VPS dell’operatore).
- **Token o segreti** non devono essere salvati nel repository GitHub né committati in chiaro.
- **Non** documentare né incollare in chat **URL raw GitHub** con **token temporanei** o query string sensibili (restano solo in n8n / browser locale, redatti negli export).
- Eventuali **export JSON** del workflow n8n vanno **redatti** prima del commit se contengono riferimenti a credenziali, webhook o dati sensibili.

## Disciplina modifica workflow (allineamento repo)

Per modifiche manuali a **questo** workflow in n8n, applicare **`n8n manual run discipline`** in [`docs/automation/README.md`](../../automation/README.md) e **`docs/ORCHESTRATOR_RULES.md`** (PRIORITÀ 0). **Un passo / un test alla volta**; niente export o “chiusura” finché il grafo non è **pulito** e l’output è **verificato**. **Non** modificare altri workflow già validati se non sono il target del micro-step (es. **non** toccare **`TEST - Mark Alina task done copy-only generalized`** mentre si lavora allo skip `done` del queue reader). Contesto: [`docs/sessions/2026-05-11-operational-step-by-step-hard-rule.md`](../../sessions/2026-05-11-operational-step-by-step-hard-rule.md).

## Stato pubblicazione documentazione

Workflow documentato qui come **TEST** manuale riuscito. Template **AI-friendly** nel repo: **`docs/automation/n8n-workflows/queue-reader-ai-friendly-template.md`**. Un **export JSON** n8n resta opzionale e va redatto prima del commit.

**Audit manuale (2026-05-11):** esito OK rispetto a questa documentazione e al template AI-friendly; dettagli in [`docs/sessions/2026-05-11-n8n-queue-reader-manual-audit.md`](../../sessions/2026-05-11-n8n-queue-reader-manual-audit.md).

**Anti-doppio-run / processing skip (2026-05-11):** implementazione n8n testata; dettagli in [`docs/sessions/2026-05-11-n8n-queue-reader-processing-skip.md`](../../sessions/2026-05-11-n8n-queue-reader-processing-skip.md).

**Validazione task 0002 (2026-05-11):** due esecuzioni manuali (ramo `true` poi ramo `false` con `no_action`); dettagli in [`docs/sessions/2026-05-11-n8n-queue-reader-0002-validation.md`](../../sessions/2026-05-11-n8n-queue-reader-0002-validation.md).

**Validazione task 0003 (2026-05-11):** skip su `0001`/`0002`, selezione `0003`, prompt/sessione creati, nessun `done` (atteso); dettagli in [`docs/sessions/2026-05-11-n8n-queue-reader-0003-validation.md`](../../sessions/2026-05-11-n8n-queue-reader-0003-validation.md).

**Skip `done` + ramo `true` task 0005 (2026-05-11):** [`docs/sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md`](../../sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md). Design iniziale skip `done`: [`docs/sessions/2026-05-11-n8n-queue-reader-skip-done-design.md`](../../sessions/2026-05-11-n8n-queue-reader-skip-done-design.md).

**Primo task reale docs-only 0100 (2026-05-11):** edge case metadata (tabella vs lista), rigenerazione prompt e update sessione — stessa sessione [`docs/sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md`](../../sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md).

**Skip `failed` — implementato e validato manualmente (2026-05-12):** il queue reader ora **salta** task con `docs/tasks/failed/{task}.md`. Il formato `## Failed status` è stato documentato con stub manuale intenzionale (task 0104) — sessione [`docs/sessions/2026-05-12-failed-validation-stub.md`](../../sessions/2026-05-12-failed-validation-stub.md). **Design e validazione completati** in [`queue-reader-skip-failed-design.md`](./queue-reader-skip-failed-design.md) (task 0106) e [`docs/sessions/2026-05-12-n8n-queue-reader-skip-failed-runtime-validation.md`](../../sessions/2026-05-12-n8n-queue-reader-skip-failed-runtime-validation.md) (task 0107). Il workflow legge ora `queue/`, `processing/`, `done/` e `failed/`. Non è stato versionato export JSON n8n.

## Riferimento codice — `Filter first queued task` (implementazione validata)

> **Nota:** il blocco seguente è **solo documentazione di riferimento** per il nodo **Code** nell’istanza n8n; **non** è file sorgente dell’app Alina né parte del build del repository.

Versione **finale** documentata dal run manuale (nomi nodi **`List files`**, **`List processing files`**, **`List done files`**). Vedi anche la sessione di validazione.

```javascript
const queuedFiles = $('List files').all().map(item => item.json);
const processingFiles = $('List processing files').all().map(item => item.json);
const doneFiles = $('List done files').all().map(item => item.json);

const processingNames = new Set(
  processingFiles
    .map(file => String(file.name || ''))
    .filter(name => name.endsWith('-cursor-prompt.md'))
    .map(name => name.replace(/-cursor-prompt\.md$/i, '.md'))
);

const doneNames = new Set(
  doneFiles
    .map(file => String(file.name || ''))
    .filter(name => name.endsWith('.md') && name !== '.gitkeep')
);

const tasks = queuedFiles
  .filter(file => {
    const name = String(file.name || '');
    const path = String(file.path || '');

    if (!name.endsWith('.md')) return false;
    if (path.indexOf('docs/tasks/queue/') !== 0) return false;

    if (processingNames.has(name)) return false;
    if (doneNames.has(name)) return false;

    return true;
  })
  .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));

if (!tasks.length) {
  return [
    {
      json: {
        has_task: false,
        message: 'No queued task found or all queued tasks already have processing prompts or done files'
      }
    }
  ];
}

const task = tasks[0];

return [
  {
    json: {
      has_task: true,
      task_name: task.name,
      task_path: task.path,
      task_sha: task.sha || '',
      task_size: task.size || 0,
      skip_reason: ''
    }
  }
];
```


## Aggiornamento 2026-05-11 — Template prompt letto dal repository (task 0101)

- Workflow modificato in n8n: **`TEST - GitHub list Alina task queue`** (solo questo workflow).
- Nuovo nodo aggiunto: **`Get cursor prompt template`** (lettura file GitHub `docs/tasks/templates/cursor-prompt-default.md`).
- Flusso logico finale nel ramo `has_task: true`:
  - `Classify task` → `Get cursor prompt template` → `Build Cursor prompt`.
- `Build Cursor prompt` ora:
  - usa `const templateFile = items[0].json;` (fix errore precedente `item is not defined`);
  - decodifica `templateFile.content` (`base64`/`utf8`);
  - divide il file template sul separatore `---`;
  - usa **solo la parte operativa dopo `---`**, evitando l’header documentativo `# Cursor prompt template — default`.
- Validazione manuale task `0101-n8n-read-cursor-prompt-template-from-repo.md`:
  - output coerente (`Project: Alina Lavoro`, `Type: n8n-docs`, `Priority: normal`, `Deploy policy: no`);
  - `cursor_prompt_path`: `docs/tasks/processing/0101-n8n-read-cursor-prompt-template-from-repo-cursor-prompt.md`;
  - `session_path`: `docs/sessions/automation-0101-n8n-read-cursor-prompt-template-from-repo.md`;
  - `next_action: create_cursor_prompt_file`;
  - `cursor_prompt` generato con inizio corretto: `@docs/roadmap.md`.
- Test di idempotenza finale (secondo run):
  - `has_task: false`;
  - messaggio: `No queued task found or all queued tasks already have processing prompts or done files`;
  - interpretazione: task `0101` saltato correttamente perché il prompt esiste già in `docs/tasks/processing/`.
- Nota residua invariata: finché `Classify task` non viene esteso, i task devono mantenere metadata in **formato lista** (`- Project: ...`, `- Type: ...`, ...).

## Prossimo passo consigliato

1. **Export JSON** n8n: se serve versionare il workflow, **redigere** credenziali/URL/token prima di ogni commit (mai URL raw con `token=` in documentazione).
2. Evoluzioni **watcher** / runner — `docs/automation/runbook.md`. Template: [`queue-reader-ai-friendly-template.md`](./queue-reader-ai-friendly-template.md).

**Done copy-only (0003, workflow separato `TEST - Mark Alina task done copy-only`):** [`done-copy-only.md`](./done-copy-only.md); sessione [`docs/sessions/2026-05-11-n8n-done-copy-only-0003-validation.md`](../../sessions/2026-05-11-n8n-done-copy-only-0003-validation.md).

**Lifecycle task:** [`task-lifecycle.md`](./task-lifecycle.md) (**skip** `processing` e **`done`** attivi nel workflow reale dal 2026-05-11). **Chiusura `done`/`failed` (design, non implementato):** [`done-failed-design.md`](./done-failed-design.md). **Done copy-only generalizzato + verify:** [`done-copy-only-generalization.md`](./done-copy-only-generalization.md). **Done copy-only (workflow test separato, 0003):** [`done-copy-only.md`](./done-copy-only.md).
