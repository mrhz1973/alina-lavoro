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
docs/tasks/queue/0100-cursor-prompt-template-in-repo.md

Project:
Alina Lavoro

Type:
docs-only

Priority:
normal

Deploy policy:
no

Objective:
Creare il file:
- docs/tasks/templates/cursor-prompt-default.md

con il contenuto attuale del template generato dal nodo
"Build Cursor prompt", in forma di Markdown con segnaposto chiari
per le variabili sostituibili da n8n in futuro.

Requirements:
- Il template deve essere un Markdown leggibile da solo.
- Deve usare segnaposto espliciti per le variabili attuali, es:
  {{task_source_path}}, {{project}}, {{type}}, {{priority}},
  {{deploy_policy}}, {{objective}}, {{requirements}},
  {{expected_output}}
- Deve includere la sezione "Mandatory constraints" come oggi.
- Deve includere la sezione "Final response required" come oggi.
- Deve includere la riga di riferimenti @docs/* come oggi.

Expected output:
- 1 file template Markdown in docs/tasks/templates/
- 1 file sessione in docs/sessions/
- Eventuali aggiornamenti minimi a CHECKPOINT.md e/o PROJECT_STATE.md
- Commit selettivo + push su main
- Riepilogo finale standard (hash, git status, rischi residui)

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