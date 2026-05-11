# Sessione — Task 0105: Add Claude Code project memory

Data: 2026-05-12
Tipo: docs-only
Task: `docs/tasks/queue/0105-add-claude-code-project-memory.md`
Runner: Claude Code (temporaneo al posto di Cursor, ~11 giorni)

## Obiettivo

Creare `CLAUDE.md` nella root del repository come memoria progetto stabile per Claude Code, per ridurre il rischio di perdita istruzioni dopo il compacting frequente della conversazione.

## Premesse reali al momento dell'esecuzione

- `CLAUDE.md` non esisteva nel repository.
- Il compacting è normale quando il contesto cresce, ma aumenta il rischio di perdere istruzioni date solo in chat.
- Il progetto ha già documenti canonici (`ORCHESTRATOR_RULES.md`, `PROJECT_STATE.md`, `CHECKPOINT.md`, `WORKFLOW.md`, `AI_RULES.md`, `COMMANDS.md`, `roadmap.md`) — `CLAUDE.md` non li duplica, li punta.
- Task 0103 e 0104 completati e marcati done o in queue.
- Produzione app invariata: V1.9.2 / Apps Script @24 / tag v1.9.2-stable.

## File creati

| File | Ruolo |
|------|-------|
| `CLAUDE.md` | Memoria progetto root per Claude Code |
| `docs/sessions/2026-05-12-add-claude-code-project-memory.md` | Questa sessione |
| `docs/tasks/done/0105-add-claude-code-project-memory.md` | Done marker copy-only |

## File aggiornati

| File | Modifica |
|------|----------|
| `docs/PROJECT_STATE.md` | Registrato completamento task 0105, CLAUDE.md aggiunto |
| `docs/CHECKPOINT.md` | Aggiornato con task 0105 completato e prossimo passo |

## Contenuto di CLAUDE.md

- Breve, non duplicativo dei documenti canonici.
- Punta ai documenti canonici con `@docs/...`.
- Ricorda ruoli: Claude Code = implementatore temporaneo, ChatGPT = orchestratore, GitHub = fonte di verità.
- Sezione `Hard rules`: branch main, no `git add .`, no deploy/tag/rollback senza richiesta esplicita, no `src/**` senza autorizzazione.
- Sezione `Compact Instructions`: cosa preservare dopo ogni compacting.

## Decisioni

1. **Nessuna duplicazione**: `CLAUDE.md` non riscrive i documenti canonici, usa solo riferimenti `@docs/...`.
2. **Sezione Compact Instructions esplicita**: lista chiara di cosa non va mai persa dopo compacting.
3. **Nessun contenuto sensibile**: nessun token, URL raw, credential, deploy ID nel file.

## Cosa NON è stato fatto

- Nessuna modifica a `src/**`, `gas-current/**`, `.gas/**`, `appsscript.json`, `package.json`.
- Nessun file creato o modificato in `docs/tasks/failed/**`.
- Nessun workflow n8n runtime modificato o eseguito.
- Nessun export JSON n8n committato.
- Nessun deploy Apps Script.
- Nessun tag Git.
- Nessun rollback.
- Nessuna delete da `docs/tasks/queue/`.

## Controlli eseguiti

- `git diff --check`: nessun errore whitespace.
- `git diff --stat`: solo path `CLAUDE.md`, `docs/sessions/`, `docs/tasks/done/`, `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md`.
- `git status --short`: solo file consentiti dal task.
- Verifica manuale: nessun path fuori dallo scope consentito.

## Esito

- Task 0105 completato: `CLAUDE.md` creato, sessione e done marker creati, documentazione aggiornata.
- Nessuna modifica app / n8n runtime / failed / deploy / tag / rollback.

## Prossimo passo suggerito

Decidere se eseguire task 0104 (failed validation stub) o tornare all'app Alina (nuove feature / fix). Decisione orchestratore.
