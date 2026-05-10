# Automazione — runbook (fasi)

Roadmap interna per introdurre automazione **senza** saltare i gate di sicurezza. Le fasi sono cumulative.

## Fase 1 — Struttura `docs/tasks` (completata quando questo runbook è adottato)

- Cartelle `queue/`, `done/`, `failed/`, `templates/`.
- README e template task.
- Nessun runner; uso manuale dei template da ChatGPT/Cursor.

## Fase 2 — Watcher n8n (MVP)

- VPS con n8n installato (fuori scope repo Alina Lavoro).
- Workflow: trigger su push GitHub che tocca `docs/tasks/queue/**` oppure polling timer.
- Azione: notifica (email/Telegram/Slack) con titolo task e link al file.

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
