# Cursor prompt template — default (`Build Cursor prompt`)

Questo file documenta il **layout** del prompt operativo oggi assemblato dal nodo n8n **Build Cursor prompt** (workflow **TEST - GitHub list Alina task queue**). I token `{{nome}}` sono **segnaposto**: la sostituzione da GitHub/n8n sarà introdotta in un task successivo.

| Segnaposto | Contenuto tipico |
|------------|------------------|
| `{{task_source_path}}` | Percorso del file task in `docs/tasks/queue/…` |
| `{{project}}` | Nome progetto (es. Alina Lavoro) |
| `{{type}}` | Tipo task (es. docs-only, test) |
| `{{priority}}` | Priorità (es. normal, low) |
| `{{deploy_policy}}` | Politica deploy (es. no, none) |
| `{{objective}}` | Testo sezione Objective (Markdown inline / paragrafi) |
| `{{requirements}}` | Testo o elenco Requirements |
| `{{expected_output}}` | Testo o elenco Expected output |

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
{{task_source_path}}

Project:
{{project}}

Type:
{{type}}

Priority:
{{priority}}

Deploy policy:
{{deploy_policy}}

Objective:
{{objective}}

Requirements:
{{requirements}}

Expected output:
{{expected_output}}

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
