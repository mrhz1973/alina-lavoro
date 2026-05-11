# n8n Workflow — Queue Reader (`TEST - GitHub list Alina task queue`)

## Nome workflow n8n

**`TEST - GitHub list Alina task queue`**

## Stato

**Aggiornamento (workflow più avanzato della prima documentazione):**

- Test **completo OK**.
- Il workflow **non** si limita più a lettura, decode e classify del task.
- È **ri-eseguibile**: se il prompt Cursor o la sessione automation esistono già, vengono **aggiornati**; altrimenti vengono **creati**.
- **Anti-doppio-run (2026-05-11):** se per un task in `docs/tasks/queue` esiste già `docs/tasks/processing/{task}-cursor-prompt.md`, quel task viene **saltato**; se non resta nessun task “libero”, il flusso va sul ramo **`false`** dell’**IF** con terminatore **Code** `No queued task / already processing` (**nessun** write su prompt/sessione GitHub; dettagli in [`docs/sessions/2026-05-11-n8n-queue-reader-processing-skip.md`](../../sessions/2026-05-11-n8n-queue-reader-processing-skip.md)).
- Nessuna modifica al codice applicativo del repo (solo file documentazione/task prodotti dal flusso).

## Scopo

1. Leggere i file in **`docs/tasks/queue`** e quelli in **`docs/tasks/processing`** per individuare il **primo task Markdown** in coda che **non** abbia ancora il relativo **`{task}-cursor-prompt.md`** in `processing` (allineato a *Opzione A* in `task-lifecycle.md`).
2. **Decodificarlo** e **classificarlo** (metadata + contenuto).
3. **Generare il prompt Cursor** operativo.
4. **Creare o aggiornare** il file prompt in `docs/tasks/processing/`.
5. **Creare o aggiornare** la sessione automation in `docs/sessions/`.

La sessione automation indica esplicitamente che **Cursor non è ancora stato eseguito** sul prompt generato (passo successivo manuale o runner).

## Trigger

**Manual Trigger**

## Flusso nodi (struttura finale)

```text
Manual Trigger
→ List files                         (queue: docs/tasks/queue)
→ List processing files              (docs/tasks/processing)
→ Filter first queued task           (salta task se esiste {task}-cursor-prompt.md in processing)
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

- **IF has queued task:** `{{ String($json.has_task) }}` **is equal to** `true` sul ramo `true`; sul `false` il flusso entra nel **Code** `No queued task / already processing` (item con `status: 'no_action'`, `reason`, `checked_at`, ecc.) **senza** aggiornare prompt o sessione su GitHub.
- (Sintassi ramo **Error → Create** invariata come fallback per creazione file quando `has_task` è `true`.)

## Regole operative (invariati principi)

- Ignorare `.gitkeep`.
- Task validi: solo file `.md` in `docs/tasks/queue`, ordinati per nome file; il **primo** considerato è il primo **senza** corrispondente `docs/tasks/processing/{task}-cursor-prompt.md` (i task “già presi in carico” tramite prompt esistente vengono **saltati**).
- Se **nessun** task in queue resta eleggibile: `has_task: false` e messaggio coerente (es. *No queued task found or all queued tasks already have processing prompts*); il ramo **`false`** dell’**IF** esegue il **Code** `No queued task / already processing` (solo output in n8n); **nessun** aggiornamento a file prompt/sessione su GitHub.
- Non modificare codice applicativo (`src/`), non deploy Apps Script, non tag, non `gas-current/` tramite questo workflow.

## File verificati / prodotti (prova su repository)

| Ruolo | Path |
|--------|------|
| Task in coda (input) | `docs/tasks/queue/0001-test-n8n-task.md` |
| Prompt Cursor (output, create/update) | `docs/tasks/processing/0001-test-n8n-task-cursor-prompt.md` |
| Sessione automation (output, create/update) | `docs/sessions/automation-0001-test-n8n-task.md` |
| Questa documentazione | `docs/automation/n8n-workflows/queue-reader.md` |

## Note sicurezza

- Le **credential GitHub** restano **solo in n8n** (istanza/VPS dell’operatore).
- **Token o segreti** non devono essere salvati nel repository GitHub né committati in chiaro.
- Eventuali **export JSON** del workflow n8n vanno **redatti** prima del commit se contengono riferimenti a credenziali, webhook o dati sensibili.

## Stato pubblicazione documentazione

Workflow documentato qui come **TEST** manuale riuscito. Template **AI-friendly** nel repo: **`docs/automation/n8n-workflows/queue-reader-ai-friendly-template.md`**. Un **export JSON** n8n resta opzionale e va redatto prima del commit.

**Audit manuale (2026-05-11):** esito OK rispetto a questa documentazione e al template AI-friendly; dettagli in [`docs/sessions/2026-05-11-n8n-queue-reader-manual-audit.md`](../../sessions/2026-05-11-n8n-queue-reader-manual-audit.md).

**Anti-doppio-run / processing skip (2026-05-11):** implementazione n8n testata; dettagli in [`docs/sessions/2026-05-11-n8n-queue-reader-processing-skip.md`](../../sessions/2026-05-11-n8n-queue-reader-processing-skip.md).

**Validazione task 0002 (2026-05-11):** due esecuzioni manuali (ramo `true` poi ramo `false` con `no_action`); dettagli in [`docs/sessions/2026-05-11-n8n-queue-reader-0002-validation.md`](../../sessions/2026-05-11-n8n-queue-reader-0002-validation.md).

## Prossimo passo consigliato

Template **AI-friendly** (descrizione nodi + parametri redatti, senza JSON segreti): **`docs/automation/n8n-workflows/queue-reader-ai-friendly-template.md`**. Un export JSON n8n redatto resta opzionale e va revisionato prima di ogni commit.

**Lifecycle task:** [`task-lifecycle.md`](./task-lifecycle.md) (design per `done`/`failed` e move; la parte **skip** se prompt già in `processing` è attiva nel workflow reale dal 2026-05-11).
