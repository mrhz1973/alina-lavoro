# Sessione — Audit manuale workflow n8n queue reader

## Data

2026-05-11

## Stato

Audit manuale completato, esito OK.

## Workflow verificato

`TEST - GitHub list Alina task queue`

## Scope

Solo audit e documentazione del workflow n8n; nessuna modifica applicativa del progetto Alina (nessun codice app, nessun deploy, nessun tag, nessun intervento su `gas-current/`).

## File e documenti di riferimento

- `docs/automation/n8n-workflows/queue-reader.md`
- `docs/automation/n8n-workflows/queue-reader-ai-friendly-template.md`
- `docs/tasks/processing/0001-test-n8n-task-cursor-prompt.md`
- `docs/sessions/automation-0001-test-n8n-task.md`

## Checklist audit

| Area | Esito |
|------|--------|
| Struttura generale del workflow | OK |
| Credential / sicurezza | OK |
| `List files` — credential n8n salvata `GitHub account`; nessun token in chiaro visibile | OK |
| Repository owner | `mrhz1973` |
| Repository name | `alina-lavoro` |
| Path queue | `docs/tasks/queue` |
| Nodi di scrittura GitHub | OK — usano credential n8n salvata |
| `Filter first queued task` | OK |
| — Legge gli item da `docs/tasks/queue` | OK |
| — Considera solo file `.md` | OK |
| — Esclude implicitamente `.gitkeep` | OK |
| — Ordina per nome | OK |
| — Seleziona il primo task disponibile | OK |
| — Se non trova task: `has_task: false` | OK |
| `Decode task markdown` | OK |
| — Legge `item.json.content` | OK |
| — Decodifica base64 in UTF-8 | OK |
| — Conserva `task_name`, `task_path`, `task_sha`, `task_size` | OK |
| — Produce `markdown` | OK |
| `Classify task` | OK |
| — Normalizza gli a capo | OK |
| — Estrae metadata: `Project`, `Type`, `Priority`, `Status`, `Created by`, `Deploy` | OK |
| — Estrae sezioni: `Objective`, `Requirements`, `Expected output` | OK |
| — Conserva il Markdown | OK |
| `Build Cursor prompt` | OK (dopo correzione manuale nel workflow reale; vedi sotto) |
| `Build session file` | OK |
| — Crea sessione Markdown | OK |
| — Indica `prompt generated, Cursor not executed yet` | OK |
| — Include timestamp, progetto, task, SHA, type, priority, deploy policy | OK |
| — Include path prompt e path sessione | OK |
| — Dichiara nessun codice app, nessun deploy, nessun tag, nessun rollback | OK |
| `Create Cursor prompt file` | OK |
| `Update Cursor prompt file` | OK |
| `Create session file` | OK |
| `Update session file` | OK |
| Rami Error → Create | OK |
| — `Check Cursor prompt file exists` → Error → `Create Cursor prompt file` | OK |
| — `Check session file exists` → Error → `Create session file` | OK |

## Correzione rilevata ed eseguita nel workflow reale n8n

Nel nodo **Build Cursor prompt**, il testo generato includeva una riga ambigua:

- Prima: `- Do not use git add ..`
- Dopo correzione manuale nel workflow n8n reale: `- Do not use git add .`

La forma `..` poteva essere letta come directory padre o come refuso rispetto alla convenzione del progetto (`git add .`). La correzione a `git add .` elimina l’ambiguità e allinea il prompt alle regole del repository.

## Nota sui file già presenti su GitHub

Il workflow n8n reale è stato aggiornato con la correzione sopra. I file prompt/sessione già generati e committati **prima** di quella modifica possono ancora contenere la vecchia stringa (`git add ..`) finché il workflow non viene rieseguito o quei file non vengono aggiornati da un passaggio successivo. Non è previsto un aggiornamento massivo di tali file solo per motivi storici di documentazione.

## Sicurezza

- Nessun token in chiaro osservato durante l’audit.
- Le credential GitHub sono gestite da n8n (credential salvata), non incorporate nel repo come segreti.
- Non committare export JSON reali del workflow senza redazione di dati sensibili.

## Non-goals (questa sessione)

- Nessuna modifica all’applicazione Alina.
- Nessun deploy.
- Nessun tag Git.
- Nessun rollback.
- Nessuna modifica a `gas-current/`.
- Nessuna esecuzione automatica di Cursor.

## Prossimo passo consigliato

Rieseguire il workflow n8n dopo la correzione per rigenerare prompt e file di sessione con la stringa corretta, oppure procedere — come passo separato — alla progettazione del runner Cursor o dell’esecuzione manuale guidata del prompt.
