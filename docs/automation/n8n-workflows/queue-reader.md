# n8n Workflow — Queue Reader (`TEST - GitHub list Alina task queue`)

## Nome workflow n8n

**`TEST - GitHub list Alina task queue`**

## Stato

**Aggiornamento (workflow più avanzato della prima documentazione):**

- Test **completo OK**.
- Il workflow **non** si limita più a lettura, decode e classify del task.
- È **ri-eseguibile**: se il prompt Cursor o la sessione automation esistono già, vengono **aggiornati**; altrimenti vengono **creati**.
- Nessuna modifica al codice applicativo del repo (solo file documentazione/task prodotti dal flusso).

## Scopo

1. Leggere il **primo task Markdown** in `docs/tasks/queue`.
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
→ List files
→ Filter first queued task
→ Get queued task file
→ Decode task markdown
→ Classify task
→ Build Cursor prompt
   ├→ Check Cursor prompt file exists
   │   ├→ Success → IF Cursor prompt file exists
   │   │   ├→ true  → Update Cursor prompt file
   │   │   └→ false → Create Cursor prompt file
   │   └→ Error → Create Cursor prompt file
   └→ Build session file
       → Check session file exists
           ├→ Success → IF session file exists
           │   ├→ true  → Update session file
           │   └→ false → Create session file
           └→ Error → Create session file
```

(Sintassi nodi allineata alla grafica n8n: ramo **Error → Create** come fallback per creazione file.)

## Regole operative (invariati principi)

- Ignorare `.gitkeep`.
- Task validi: solo file `.md` in `docs/tasks/queue`, ordinati per nome file; primo disponibile.
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

## Prossimo passo consigliato

Template **AI-friendly** (descrizione nodi + parametri redatti, senza JSON segreti): **`docs/automation/n8n-workflows/queue-reader-ai-friendly-template.md`**. Un export JSON n8n redatto resta opzionale e va revisionato prima di ogni commit.
