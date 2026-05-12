# Automazione — runbook (fasi)

Roadmap interna per introdurre automazione **senza** saltare i gate di sicurezza. Le fasi sono cumulative.

## Niente conferme superflue (regola globale)

Riferimento canonico: `docs/ORCHESTRATOR_RULES.md` — **PRIORITÀ 0A**.

- Nelle fasi **docs-only** e **runner documentale**, i passaggi **determinati** non richiedono conferma extra dell'utente.
- L'utente interviene **solo** per:
  - decisioni vere (formato canonico: Decision Packet — `docs/automation/decision-packet-format.md`);
  - gate sensibili: runtime, VPS runtime, n8n runtime, modifiche app Alina, deploy, tag, rollback, API key, login, GitHub Actions, costi nuovi, runner automatico, dati sensibili, test fisico reale.
- Il futuro **Auto-Aggio** (`docs/automation/auto-aggio-design.md`) e la futura **INBOX** (`docs/automation/human-decision-inbox-design.md`) devono **ridurre** conferme e micro-interazioni, **non crearne di nuove**.
- **n8n** non deve generare richieste di autorizzazione ridondanti per task docs-only già determinati: il prompt operativo viene assemblato dal template e consegnato all'implementatore senza step di conferma intermedia.

## Fase 1 — Struttura `docs/tasks` (completata quando questo runbook è adottato)

- Cartelle `queue/`, `done/`, `failed/`, `templates/`.
- README e template task.
- Nessun runner; uso manuale dei template da ChatGPT/Cursor.

## Fase 2 — Watcher n8n (MVP)

- VPS con n8n installato (fuori scope repo Alina Lavoro).
- Workflow: trigger su push GitHub che tocca `docs/tasks/queue/**` oppure polling timer.
- Azione: notifica (email/Telegram/Slack) con titolo task e link al file.
- Disciplina operativa sugli editor/run manuali in n8n: vedi **`n8n manual run discipline`** in `docs/automation/README.md` (passo passo, niente export finché il workflow non è pulito e verificato).

## Fase 3 — Runner documentale

- Job che clone/pull `main`, verifica che il task sia solo-docs, esegue Cursor CLI con prompt derivato dal markdown del task.
- Commit selettivo + push; sposta task da `queue/` a `done/` o `failed/` via PR o script locale supervisionato.

## Fase 4 — Runner frontend basso rischio

- Come fase 3 ma `Files allowed` limitato a `src/frontend/Index.html`; controlli `docs/COMMANDS.md` obbligatori nel pipeline.

## Fase 5 — Deploy semi-automatico

- Runner esegue sync Git Bash / clasp **solo** dopo approvazione umana (pulsante n8n, issue “approved”, o segreto rotabile).
- Aggiornamento `gas-current/` e tag solo se task tipo **release** e gate superato.

## Fase 6 — Multi-progetto

- Stessa intellettura di cartelle `docs/tasks` replicata su altri repo (portfolio, altre app).
- Orchestratore centralizza priorità; VPS separa queue per nome repo.

## Rollback del runbook stesso

Modifiche a questo file passano da commit normale su `main` e revisione orchestratore.
