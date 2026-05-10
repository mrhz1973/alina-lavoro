# Sessione 2026-05-10 — Framework task per automazione (solo documentazione)

## Perché nasce

Preparare **Alina Lavoro** come **progetto pilota** per una futura catena **ChatGPT → GitHub → n8n (VPS) → Cursor CLI** → commit/push → report sessione → `aggio`, **senza** introdurre ancora tooling di automazione nel repo.

## Obiettivo del blocco

- Cartelle `docs/tasks/` (`queue`, `done`, `failed`, `templates`) e `docs/automation/`.
- README e template riutilizzabili per task documentali, frontend, release.
- Documenti sintetici: piattaforma prevista, permessi, runbook a fasi.
- Aggiornamenti leggeri a PROJECT_STATE, CHECKPOINT, roadmap, ORCHESTRATOR_RULES.

## Cosa non è stato fatto

- **Nessuna** modifica a `src/frontend/Index.html`, `src/backend/Code.gs`.
- **Nessuna** modifica a `package.json`, `gas-current/`, `appsscript.json`.
- **Nessun** deploy Apps Script; **nessun** tag Git.
- **Nessuna** installazione n8n/VPS nel contesto di questo commit.

## File creati (principali)

- `docs/tasks/README.md`
- `docs/tasks/templates/*.md` (task generico, docs, frontend, release)
- `docs/tasks/queue/.gitkeep`, `done/.gitkeep`, `failed/.gitkeep`
- `docs/automation/README.md`, `permissions.md`, `runbook.md`

## Prossimo passo suggerito

Progettare **MVP** concreto: evento trigger (GitHub vs scheduler), formato nome file task, integrazione Cursor CLI sul VPS, e policy di merge su `main` (PR vs push diretto). Incrociare con `docs/automation/permissions.md`.
