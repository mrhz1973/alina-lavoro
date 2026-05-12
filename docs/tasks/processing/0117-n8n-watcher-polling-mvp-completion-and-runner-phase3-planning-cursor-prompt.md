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
docs/tasks/queue/0117-n8n-watcher-polling-mvp-completion-and-runner-phase3-planning.md

Project:
Alina Lavoro

Type:
docs-only

Priority:
normal

Deploy policy:
no

Objective:
Consolidare documentalmente il completamento della Fase 2 watcher/polling MVP e produrre un
documento di design/decisione per la Fase 3 runner documentale, senza attivare alcun runtime
automatico.

Il documento di output deve:

1. Dichiarare la Fase 2 watcher/polling MVP completata e validata.
2. Descrivere lo stato architetturale corrente (queue reader con Schedule Trigger, lifecycle
   queue/processing/done/failed validato, runner manuale/supervisionato invariato).
3. Definire le opzioni candidate per la Fase 3 runner documentale (almeno: opzione VPS
   Claude Code CLI, opzione Cursor CLI, opzione runner GitHub Actions, confronto rischi/costi).
4. Identificare i gate manuali e i prerequisiti tecnici prima di qualsiasi implementazione
   runtime della Fase 3.
5. Non implementare alcun runner automatico in questo task.

Requirements:
- Nessuna modifica a `src/**`.
- Nessuna modifica a `gas-current/**`.
- Nessuna modifica a `.gas/**`.
- Nessuna modifica a `appsscript.json`.
- Nessuna modifica a `package.json`.
- Nessun deploy Apps Script.
- Nessun tag.
- Nessun rollback.
- Nessun runner automatico Claude Code CLI / Cursor CLI attivato.
- Nessun export JSON n8n non redatto.
- Nessuna credenziale, token o URL raw sensibile.
- Gate manuale obbligatorio prima di qualsiasi implementazione runtime n8n/VPS/CLI.
- La Fase 3 runner documentale resta futura: questo task produce solo design/decisione.

Expected output:
- `docs/automation/n8n-watcher-polling-mvp-completion.md` (o path equivalente sotto `docs/automation/`)
  che dichiari la Fase 2 completata con evidenze (task 0115, 0116, commit n8n).
- `docs/automation/runner-phase3-design.md` (o path equivalente) con:
  - opzioni candidate per la Fase 3 runner documentale;
  - confronto rischi/costi/complessità per ciascuna opzione;
  - prerequisiti tecnici e gate manuali prima dell'implementazione;
  - scelta raccomandata con motivazione, o lista di domande da rispondere prima di scegliere.
- Aggiornamento `docs/PROJECT_STATE.md` e `docs/CHECKPOINT.md` per riflettere il completamento
  della Fase 2 e lo stato "design in corso" della Fase 3.

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