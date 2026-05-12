@docs/roadmap.md
@docs/STREAMLINED_WORKFLOW.md
@docs/ORCHESTRATOR_RULES.md
@docs/AI_RULES.md
@docs/WORKFLOW.md
@docs/CHECKPOINT.md
@docs/PROJECT_STATE.md
@docs/COMMANDS.md

AGENT MODE.

Task source:
docs/tasks/queue/0116-n8n-queue-reader-has-task-true-scheduled-polling-validation.md

Project:
Alina Lavoro

Type:
n8n-runtime-validation

Priority:
normal

Deploy policy:
no

Objective:
Validare che il polling automatico del queue reader gestisca correttamente un task eleggibile (`has_task:true`), generando i file attesi in `docs/tasks/processing/` e/o `docs/sessions/automation-*`, senza modificare app, deploy, tag, rollback o runner automatico.

Requirements:
- Usare un task docs-only minimale.
- Nessuna modifica a `src/**`.
- Nessuna modifica a `gas-current/**`.
- Nessuna modifica a `.gas/**`.
- Nessuna modifica a `appsscript.json`.
- Nessuna modifica a `package.json`.
- Nessun deploy Apps Script.
- Nessun tag.
- Nessun rollback.
- Nessun runner automatico Claude Code CLI / Cursor CLI.
- Nessun export JSON n8n non redatto.
- Nessuna credenziale, token o URL raw sensibile.
- Gate manuale/orchestratore prima di considerare riuscita la validazione runtime.
- Il successo del test non deve essere dichiarato solo perché il file task viene creato: deve essere verificato dopo il polling n8n.

Expected output:
Dopo il polling automatico, verificare e documentare:

1. Il queue reader seleziona questo task come eleggibile (`has_task:true`).
2. Viene generato il prompt/sessione atteso in `docs/tasks/processing/` e/o `docs/sessions/automation-*`.
3. Un secondo run successivo non riprocessa il task grazie allo skip su `processing/`.
4. Nessuna modifica app.
5. Nessun deploy.
6. Nessun tag.
7. Nessun rollback.
8. Nessun runner automatico attivato.
9. Sessione di validazione creata.
10. Stato finale documentato in `PROJECT_STATE.md` e `CHECKPOINT.md`.

Mandatory constraints:
- Work on branch main only.
- Do not use dev.
- Do not use git add .
- Do not modify gas-current unless explicitly authorized by a deploy/release task.
- Do not deploy unless the task explicitly authorizes deploy.
- Do not create tags unless the task explicitly authorizes tag creation.
- Run the repository checks required by docs/COMMANDS.md.
- Commit selectively and push only the intended changes.

Final response required:
- Files changed.
- Checks executed.
- Commit hash.
- Git status final.
- Any risks or manual tests required.