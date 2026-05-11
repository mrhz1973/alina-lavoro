# Task — n8n queue reader skip failed design

## Metadata

- ID: 0106-n8n-queue-reader-skip-failed-design
- Project: Alina Lavoro
- Type: n8n-design
- Priority: normal
- Status: done
- Created by: Orchestrator
- Completed by: Windsurf/Cascade
- Deploy: no

## Context

Task 0104 ha creato uno stub documentale `failed` intenzionale:

- `docs/tasks/failed/0104-failed-validation-stub.md`
- `docs/tasks/done/0104-failed-validation-stub.md`
- `docs/sessions/2026-05-12-failed-validation-stub.md`

Il formato `## Failed status` è ora documentato, ma lo skip `failed` nel queue reader n8n non è ancora implementato né validato.

Stato reale documentato:

- il queue reader attuale legge `docs/tasks/queue`;
- legge `docs/tasks/processing`;
- legge `docs/tasks/done`;
- salta task con prompt già in `processing`;
- salta task con marker già in `done`;
- NON legge ancora `docs/tasks/failed` come condizione di skip;
- lo skip `failed` deve essere progettato e poi validato in un micro-step manuale separato.

## Objective

Preparare la modifica controllata del workflow n8n `TEST - GitHub list Alina task queue` per aggiungere lo skip `failed`, senza eseguire subito la modifica runtime.

Questo task deve produrre una progettazione operativa chiara per il passo successivo manuale in n8n.

## Done copy-only outcome

- **completed_at**: 2026-05-12
- **session_path**: docs/sessions/2026-05-12-n8n-queue-reader-skip-failed-design.md
- **commit_hash**: 3ab1ed6
- **completed_by**: Windsurf/Cascade (reserve implementer)

## Design output creato

1. **docs/automation/n8n-workflows/queue-reader-skip-failed-design.md**
   - Design completo per implementazione skip failed
   - Specifica nodo `List failed files` con `Execute Once`
   - Codice aggiornato per `Filter first queued task`
   - Scenari di validazione manuale

2. **Documentazione lifecycle aggiornata**
   - queue-reader.md: riferimento design
   - lifecycle-ownership.md: stato design disponibile
   - done-failed-design.md: riferimento design
   - task-lifecycle.md: stato design disponibile

3. **Stato progetto aggiornato**
   - CHECKPOINT.md: task 0106 in corso
   - PROJECT_STATE.md: sezione automazione aggiornata

4. **Sessione documentale**
   - docs/sessions/2026-05-12-n8n-queue-reader-skip-failed-design.md

## Specifiche implementative

### Nodo da aggiungere
- **Nome**: `List failed files`
- **Tipo**: GitHub List Directory
- **Directory**: `docs/tasks/failed`
- **Execute Once**: YES

### Modifica filtro
- Aggiungere `failedNames` Set
- Condizione skip: `if (failedNames.has(name)) return false`
- Messaggi output aggiornati per includere "failed files"

### Scenari validazione
- **0104**: deve essere saltato (ha `failed/` marker)
- **Senza marker**: deve essere eleggibile
- **Nessun task**: ramo `false/no_action`

## Constraints rispettati

- ✅ Solo design/documentazione, nessuna modifica n8n runtime
- ✅ Nessuna modifica app (`src/`)
- ✅ Nessun deploy/tag/rollback
- ✅ Nessuna modifica `docs/tasks/queue/0106-*`
- ✅ Nessun file in `docs/tasks/failed/`
- ✅ Skip failed NON dichiarato validato
- ✅ Commit selettivo, mai `git add .`

## Note

- Design basato su formato `## Failed status` già documentato
- Coerenza con skip processing/done esistenti
- Execute Once per evitare duplicati
- Messaggi output aggiornati per chiarezza

## Prossimo passo manuale

Dopo questo design:
1. Aprire workflow n8n `TEST - GitHub list Alina task queue`
2. Aggiungere nodo `List failed files`
3. Aggiornare codice `Filter first queued task`
4. Test manuale con scenario 0104
5. Documentare validazione

---
**Task completato - design skip failed preparato**
