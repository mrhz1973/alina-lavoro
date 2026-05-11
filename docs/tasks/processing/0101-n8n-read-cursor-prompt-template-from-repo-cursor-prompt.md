# Cursor prompt template — default (`Build Cursor prompt`)

Questo file documenta il **layout** del prompt operativo oggi assemblato dal nodo n8n **Build Cursor prompt** (workflow **TEST - GitHub list Alina task queue**). I token `{{nome}}` sono **segnaposto**: la sostituzione da GitHub/n8n sarà introdotta in un task successivo.

| Segnaposto | Contenuto tipico |
|------------|------------------|
| `docs/tasks/queue/0101-n8n-read-cursor-prompt-template-from-repo.md` | Percorso del file task in `docs/tasks/queue/…` |
| `Alina Lavoro` | Nome progetto (es. Alina Lavoro) |
| `n8n-docs` | Tipo task (es. docs-only, test) |
| `normal` | Priorità (es. normal, low) |
| `no` | Politica deploy (es. no, none) |
| `Aggiornare il workflow n8n `TEST - GitHub list Alina task queue` per leggere il file:

- `docs/tasks/templates/cursor-prompt-default.md`

e usare quel contenuto come base del prompt Cursor, sostituendo i segnaposto:

- `{{task_source_path}}`
- `{{project}}`
- `{{type}}`
- `{{priority}}`
- `{{deploy_policy}}`
- `{{objective}}`
- `- Non modificare app Alina.
- Non fare deploy.
- Non creare tag.
- Non cancellare file da `docs/tasks/queue`.
- Non toccare workflow n8n non target.
- Procedere passo passo in n8n.
- Leggere il template da repo prima di `Build Cursor prompt`, oppure inserire un nodo equivalente che renda disponibile il contenuto del template al nodo di build.
- Sostituire i segnaposto mantenendo la struttura del template.
- Mantenere invariati i campi già validati: `task_name`, `task_path`, `cursor_prompt_path`, `session_path`, `next_action`.
- Dopo la modifica, fare un test con un task controllato e verificare che il prompt generato sia identico nella struttura al template, con variabili compilate.`
- `- Workflow n8n target aggiornato manualmente e validato.
- Documentazione aggiornata in `docs/automation/n8n-workflows/`.
- Sessione dedicata in `docs/sessions/`.
- Nessuna modifica app.
- Nessun deploy/tag.
- Nessuna delete da queue.
- Riepilogo finale standard con hash commit e stato Git.`` | Testo sezione Objective (Markdown inline / paragrafi) |
| `- Non modificare app Alina.
- Non fare deploy.
- Non creare tag.
- Non cancellare file da `docs/tasks/queue`.
- Non toccare workflow n8n non target.
- Procedere passo passo in n8n.
- Leggere il template da repo prima di `Build Cursor prompt`, oppure inserire un nodo equivalente che renda disponibile il contenuto del template al nodo di build.
- Sostituire i segnaposto mantenendo la struttura del template.
- Mantenere invariati i campi già validati: `task_name`, `task_path`, `cursor_prompt_path`, `session_path`, `next_action`.
- Dopo la modifica, fare un test con un task controllato e verificare che il prompt generato sia identico nella struttura al template, con variabili compilate.` | Testo o elenco Requirements |
| `- Workflow n8n target aggiornato manualmente e validato.
- Documentazione aggiornata in `docs/automation/n8n-workflows/`.
- Sessione dedicata in `docs/sessions/`.
- Nessuna modifica app.
- Nessun deploy/tag.
- Nessuna delete da queue.
- Riepilogo finale standard con hash commit e stato Git.` | Testo o elenco Expected output |

---

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
docs/tasks/queue/0101-n8n-read-cursor-prompt-template-from-repo.md

Project:
Alina Lavoro

Type:
n8n-docs

Priority:
normal

Deploy policy:
no

Objective:
Aggiornare il workflow n8n `TEST - GitHub list Alina task queue` per leggere il file:

- `docs/tasks/templates/cursor-prompt-default.md`

e usare quel contenuto come base del prompt Cursor, sostituendo i segnaposto:

- `{{task_source_path}}`
- `{{project}}`
- `{{type}}`
- `{{priority}}`
- `{{deploy_policy}}`
- `{{objective}}`
- `- Non modificare app Alina.
- Non fare deploy.
- Non creare tag.
- Non cancellare file da `docs/tasks/queue`.
- Non toccare workflow n8n non target.
- Procedere passo passo in n8n.
- Leggere il template da repo prima di `Build Cursor prompt`, oppure inserire un nodo equivalente che renda disponibile il contenuto del template al nodo di build.
- Sostituire i segnaposto mantenendo la struttura del template.
- Mantenere invariati i campi già validati: `task_name`, `task_path`, `cursor_prompt_path`, `session_path`, `next_action`.
- Dopo la modifica, fare un test con un task controllato e verificare che il prompt generato sia identico nella struttura al template, con variabili compilate.`
- `- Workflow n8n target aggiornato manualmente e validato.
- Documentazione aggiornata in `docs/automation/n8n-workflows/`.
- Sessione dedicata in `docs/sessions/`.
- Nessuna modifica app.
- Nessun deploy/tag.
- Nessuna delete da queue.
- Riepilogo finale standard con hash commit e stato Git.`

Requirements:
- Non modificare app Alina.
- Non fare deploy.
- Non creare tag.
- Non cancellare file da `docs/tasks/queue`.
- Non toccare workflow n8n non target.
- Procedere passo passo in n8n.
- Leggere il template da repo prima di `Build Cursor prompt`, oppure inserire un nodo equivalente che renda disponibile il contenuto del template al nodo di build.
- Sostituire i segnaposto mantenendo la struttura del template.
- Mantenere invariati i campi già validati: `task_name`, `task_path`, `cursor_prompt_path`, `session_path`, `next_action`.
- Dopo la modifica, fare un test con un task controllato e verificare che il prompt generato sia identico nella struttura al template, con variabili compilate.

Expected output:
- Workflow n8n target aggiornato manualmente e validato.
- Documentazione aggiornata in `docs/automation/n8n-workflows/`.
- Sessione dedicata in `docs/sessions/`.
- Nessuna modifica app.
- Nessun deploy/tag.
- Nessuna delete da queue.
- Riepilogo finale standard con hash commit e stato Git.

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
