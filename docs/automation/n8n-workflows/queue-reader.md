# n8n Workflow — Queue Reader (`TEST - GitHub list Alina task queue`)

## Nome workflow n8n

**`TEST - GitHub list Alina task queue`**

## Stato

**Aggiornamento (workflow più avanzato della prima documentazione):**

- Test **completo OK**.
- Il workflow **non** si limita più a lettura, decode e classify del task.
- È **ri-eseguibile**: se il prompt Cursor o la sessione automation esistono già, vengono **aggiornati**; altrimenti vengono **creati**.
- **Anti-doppio-run (2026-05-11):** se per un task in `docs/tasks/queue` esiste già `docs/tasks/processing/{task}-cursor-prompt.md`, quel task viene **saltato**; se non resta nessun task “libero”, il flusso va sul ramo **`false`** dell’**IF** con terminatore **Code** `No queued task / already processing` (**nessun** write su prompt/sessione GitHub; dettagli in [`docs/sessions/2026-05-11-n8n-queue-reader-processing-skip.md`](../../sessions/2026-05-11-n8n-queue-reader-processing-skip.md)).
- **Skip `done` (design 2026-05-11):** il queue reader deve considerare anche **`docs/tasks/done/`**: un task in coda va **saltato** anche se esiste **`docs/tasks/done/{task}.md`** (stesso basename del file `.md` in `queue`, senza estensione = `{task}`). Allinea il contratto con [`done-copy-only-generalization.md`](./done-copy-only-generalization.md) (task che restano in `queue` dopo copy-only **done** non devono essere riselezionati). **Stato:** logica e grafo documentati qui e nel template AI-friendly; **implementazione e test end-to-end in n8n** restano da eseguire — [`docs/sessions/2026-05-11-n8n-queue-reader-skip-done-design.md`](../../sessions/2026-05-11-n8n-queue-reader-skip-done-design.md).
- Nessuna modifica al codice applicativo del repo (solo file documentazione/task prodotti dal flusso).

## Scopo

1. Leggere i file in **`docs/tasks/queue`**, in **`docs/tasks/processing`** e in **`docs/tasks/done`** per individuare il **primo** file **`.md`** in coda (ordinamento per nome file) che **non** abbia né il relativo **`docs/tasks/processing/{task}-cursor-prompt.md`** né **`docs/tasks/done/{task}.md`** (stesso `{task}` = nome file in `queue` senza `.md`). Allineato a *Opzione A* + skip **`done`** in [`task-lifecycle.md`](./task-lifecycle.md) e contratto in [`done-copy-only-generalization.md`](./done-copy-only-generalization.md).
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

- **List done files:** stesso tipo di nodo GitHub usato per listare `queue` / `processing` (directory **`docs/tasks/done`**). Il nodo **Filter first queued task** (Code) riceve le tre liste (in n8n: **Merge** dei tre rami in un item unico oppure lettura sequenziale aggregata — dettaglio implementativo lasciato al maintainer).
- **IF has queued task:** `{{ String($json.has_task) }}` **is equal to** `true` sul ramo `true`; sul `false` il flusso entra nel **Code** `No queued task / already processing` (item con `status: 'no_action'`, `reason`, `checked_at`, ecc.) **senza** aggiornare prompt o sessione su GitHub.
- (Sintassi ramo **Error → Create** invariata come fallback per creazione file quando `has_task` è `true`.)

## Regole operative (invariati principi)

- Ignorare `.gitkeep`.
- Task validi: solo file `.md` in `docs/tasks/queue`, ordinati per nome file; il **primo** eleggibile è il primo `.md` per cui **non** esiste **`docs/tasks/processing/{task}-cursor-prompt.md`** **e** **non** esiste **`docs/tasks/done/{task}.md`** (`{task}` = basename del file in coda senza `.md`). Skip se almeno uno dei due file esiste.
- **Nessuna delete** da `docs/tasks/queue/` in questa fase (né come effetto del filtro, né come “pulizia” post-`done`): il task può restare in coda anche dopo archiviazione in `done`; lo skip evita solo **nuovi** prompt/sessione automation.
- Se **nessun** task in queue resta eleggibile: `has_task: false` e messaggio coerente (es. *No queued task found or all queued tasks skipped — processing prompt and/or done file already present*); il ramo **`false`** dell’**IF** esegue il **Code** `No queued task / already processing` (solo output in n8n); **nessun** aggiornamento a file prompt/sessione su GitHub.
- **Contratto** con il flusso **done copy-only generalizzato** ([`done-copy-only-generalization.md`](./done-copy-only-generalization.md)): dopo **`Verify done file`** e update sessione, il task può restare in `queue`; il queue reader **non** deve rigenerare prompt se `done/{task}.md` esiste già.
- Non modificare codice applicativo (`src/`), non deploy Apps Script, non tag, non `gas-current/` tramite questo workflow.

## File verificati / prodotti (prova su repository)

| Ruolo | Path |
|--------|------|
| Task in coda (input) | `docs/tasks/queue/0001-test-n8n-task.md` |
| Prompt Cursor (output, create/update) | `docs/tasks/processing/0001-test-n8n-task-cursor-prompt.md` |
| File `done` (solo lettura filtro; design 2026-05-11) | `docs/tasks/done/{task}.md` |
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

**Validazione task 0003 (2026-05-11):** skip su `0001`/`0002`, selezione `0003`, prompt/sessione creati, nessun `done` (atteso); dettagli in [`docs/sessions/2026-05-11-n8n-queue-reader-0003-validation.md`](../../sessions/2026-05-11-n8n-queue-reader-0003-validation.md).

**Skip `done` — design documentale (2026-05-11):** [`docs/sessions/2026-05-11-n8n-queue-reader-skip-done-design.md`](../../sessions/2026-05-11-n8n-queue-reader-skip-done-design.md) (nodo **List done files** + filtro; **validazione n8n reale ancora da fare**).

**Done copy-only (0003, workflow separato `TEST - Mark Alina task done copy-only`):** [`done-copy-only.md`](./done-copy-only.md); sessione [`docs/sessions/2026-05-11-n8n-done-copy-only-0003-validation.md`](../../sessions/2026-05-11-n8n-done-copy-only-0003-validation.md).

## Prossimo passo consigliato

1. **Implementare in n8n** il nodo **List done files** (`docs/tasks/done`) e aggiornare il **Code** `Filter first queued task` secondo questa documentazione e [`queue-reader-ai-friendly-template.md`](./queue-reader-ai-friendly-template.md); poi **eseguire test manuali** (task con solo `done`, solo `processing`, entrambi, nessuno) e aggiornare una sessione in `docs/sessions/`.
2. Template **AI-friendly** (descrizione nodi + parametri redatti, senza JSON segreti): **`docs/automation/n8n-workflows/queue-reader-ai-friendly-template.md`**. Un export JSON n8n redatto resta opzionale e va revisionato prima di ogni commit.

**Lifecycle task:** [`task-lifecycle.md`](./task-lifecycle.md) (design per `done`/`failed` e move; **skip** se prompt in `processing` **attivo** nel workflow reale dal 2026-05-11; **skip** se file in `done` **documentato**, implementazione n8n da completare). **Chiusura `done`/`failed` (design, non implementato):** [`done-failed-design.md`](./done-failed-design.md). **Done copy-only generalizzato + verify:** [`done-copy-only-generalization.md`](./done-copy-only-generalization.md). **Done copy-only (workflow test separato, 0003):** [`done-copy-only.md`](./done-copy-only.md).
