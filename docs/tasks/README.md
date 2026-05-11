# Task queue — Alina Lavoro

Questa cartella ospita **specifiche di lavoro** destinate a essere elaborate da **Cursor Agent**, da **Cursor CLI / esecuzione headless**, o da una pipeline futura (**n8n su VPS** → runner → Git).

## A cosa serve `docs/tasks`

- Dare un **formato stabile** ai blocchi di lavoro (metadata, vincoli, permessi file, controlli).
- Separare nettamente **cosa è in attesa**, **cosa è completato**, **cosa è fallito** senza mescolare stati nella stessa directory radice.
- Permettere a **ChatGPT (orchestratore)** di creare o aggiornare un task su **GitHub** che un automa poi materializza come file markdown nella **queue**.

## Directory

| Cartella | Ruolo |
|----------|--------|
| **`queue/`** | Task **pronti** per essere presi in carico dal runner (un solo **current task** alla volta per repo, vedi sotto). |
| **`done/`** | Task **completati** con successo (archivio; possibile prefisso data nel nome file). |
| **`failed/`** | Task **non completati** (errore runner, test falliti, gate manuale non superato); utile per analisi e retry. |
| **`templates/`** | Modelli vuoti per nuovi task (`task-template.md`, `docs-task-template.md`, ecc.). |

**Lifecycle (design):** proposta per stati `queue` → `processing` → `done` / `failed`, path e mitigazioni → [`task-lifecycle.md`](../automation/n8n-workflows/task-lifecycle.md).

## Current task

**Current task** è il singolo task nella **`queue/`** che il sistema considera **attivo**. Convenzione consigliata:

- Al massimo **un file** `CURRENT.md` (o `current-task.md`) in **`queue/`**, oppure
- Un **nome file esplicito** referenziato dal runner/n8n (es. `queue/TASK-2026-05-10-docs-automation.md`) e documentato nel report di sessione.

Obiettivo: evitare che due automazioni lavorino sullo stesso repo in parallelo senza coordinamento.

## Uso futuro: n8n / VPS / Cursor CLI

Flusso previsto (non ancora implementato in questo repository):

1. **Orchestratore (ChatGPT)** definisce il task e lo versiona su **GitHub** (`docs/tasks/queue/…`).
2. **n8n** (su **VPS**) rileva il nuovo task (webhook, polling, issue GitHub, ecc.).
3. Il **runner** clona/aggiorna il repo, esegue **Cursor CLI** o uno script che invoca l’agente con il contenuto del task.
4. **Commit / push** selettivo (mai `git add .` salvo policy esplicita nel task).
5. **Session report** (markdown in `docs/sessions/`) e/o aggiornamento **checkpoint** / **PROJECT_STATE** se il task lo richiede.
6. **`aggio`** (o equivalente) come fotografia finale dello stato repo.

## Cosa può essere automatizzato (indicazioni)

Con **template** e **permessi** adeguati (`docs/automation/permissions.md`):

- Aggiornamenti **solo documentazione** (CHECKPOINT, PROJECT_STATE, roadmap, sessioni).
- Micro-modifiche **frontend** a **basso rischio** (CSS/copy in `src/frontend/Index.html`) con controlli da `docs/COMMANDS.md`.
- Generazione **boilerplate** di sessioni o checklist.

## Cosa richiede approvazione manuale (tipico)

- **Deploy** Apps Script, **tag** di release, **rollback** produzione.
- Modifiche a **`src/backend/Code.gs`**, struttura **Google Sheet**, segreti/credenziali.
- Nuove **librerie**, **service worker**, eliminazioni massive di file.
- Qualsiasi task il cui **Manual test gate** non sia stato esplicitamente superato dall’utente.

Per maggior dettaglio: `docs/automation/README.md`, `docs/automation/runbook.md`, `docs/automation/permissions.md`.
