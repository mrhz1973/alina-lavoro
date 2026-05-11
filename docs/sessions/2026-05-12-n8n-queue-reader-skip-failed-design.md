# Sessione — Task 0106 n8n queue reader skip failed design

**Data:** 2026-05-12  
**Task:** 0106-n8n-queue-reader-skip-failed-design  
**Tipo:** n8n-design  
**Eseguito da:** Windsurf/Cascade (reserve implementer)  
**Stato:** completato

## Obiettivo

Preparare la modifica controllata del workflow n8n `TEST - GitHub list Alina task queue` per aggiungere lo skip `failed`, senza eseguire subito la modifica runtime.

## Contesto

- Task 0104 ha creato stub documentale `failed` intenzionale
- Formato `## Failed status` documentato in `docs/tasks/failed/0104-failed-validation-stub.md`
- Queue reader attuale legge `queue/`, `processing/`, `done/` ma NON `failed/`
- Skip failed deve essere progettato e poi validato in micro-step manuale separato

## Esecuzione

### File creati

1. **docs/automation/n8n-workflows/queue-reader-skip-failed-design.md**
   - Design completo per implementazione skip failed
   - Specifica nodo `List failed files` con `Execute Once`
   - Codice aggiornato per `Filter first queued task`
   - Scenari di validazione manuale
   - Riferimenti a task 0104 e documentazione lifecycle

### File aggiornati

2. **docs/automation/n8n-workflows/queue-reader.md**
   - Aggiunto riferimento a design skip failed
   - Sezione stato aggiornata per indicare design disponibile

3. **docs/automation/n8n-workflows/lifecycle-ownership.md**
   - Stato aggiornato per indicare design implementazione disponibile
   - Tabella comportamenti aggiornata con riferimento design

4. **docs/automation/n8n-workflows/done-failed-design.md**
   - Aggiunto riferimento a design skip failed
   - Coerenza con documentazione lifecycle

5. **docs/automation/n8n-workflows/task-lifecycle.md**
   - Aggiunto riferimento a design implementazione
   - Allineamento stato skip failed

6. **docs/CHECKPOINT.md**
   - Aggiunto task 0106 in corso
   - Aggiornato prossimo passo automazione

7. **docs/PROJECT_STATE.md**
   - Sezione automazione aggiornata con task 0106
   - Riferimento design skip failed

## Design principale

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

## Vincoli rispettati

- ✅ Solo design/documentazione, nessuna modifica n8n runtime
- ✅ Nessuna modifica app (`src/`)
- ✅ Nessun deploy/tag/rollback
- ✅ Nessuna modifica `docs/tasks/queue/0106-*`
- ✅ Nessun file in `docs/tasks/failed/`
- ✅ Skip failed NON dichiarato validato
- ✅ Commit selettivo, mai `git add .`

## Output atteso

- Documento design skip failed creato
- Documentazione lifecycle aggiornata per coerenza
- Stato progetto/checkpoint aggiornati
- Sessione documentale completata
- Task 0106 marcato done copy-only

## Prossimo passo manuale

Dopo questo design:
1. Aprire workflow n8n `TEST - GitHub list Alina task queue`
2. Aggiungere nodo `List failed files`
3. Aggiornare codice `Filter first queued task`
4. Test manuale con scenario 0104
5. Documentare validazione

## Note

- Design basato su formato `## Failed status` già documentato
- Coerenza con skip processing/done esistenti
- Execute Once per evitare duplicati
- Messaggi output aggiornati per chiarezza

---
**Sessione completata - design skip failed preparato**
