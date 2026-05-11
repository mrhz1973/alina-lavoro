# Sessione — Task 0103: Lifecycle ownership design

Data: 2026-05-11
Tipo: docs-only
Task: `docs/tasks/queue/0103-lifecycle-ownership-design.md`
Runner: Claude Code (temporaneo al posto di Cursor, ~11 giorni)

## Obiettivo

Creare `docs/automation/n8n-workflows/lifecycle-ownership.md` come fonte canonica per ownership delle transizioni queue → processing → done / failed, armonizzando i pattern esistenti senza modificare retroattivamente i file done già scritti.

## Premesse reali al momento dell'esecuzione

- Skip `processing` già validato: queue reader salta task se `processing/{task}-cursor-prompt.md` esiste.
- Skip `done` già validato empiricamente: n8n non ha riprocessato 0102 dopo la creazione di `docs/tasks/done/0102-update-docs-automation-state.md`.
- Due pattern `done` coesistono: `## Done status` (Claude Code runner) e `## Done copy-only outcome` (n8n workflow).
- Failed handling non validato: nessun file in `docs/tasks/failed/` ancora creato.
- Task 0101 e 0102 completati e marcati done.
- Claude Code runner temporaneo: non fire-and-forget, approvazione manuale per ogni commit/push.

## File creati

| File | Ruolo |
|------|-------|
| `docs/automation/n8n-workflows/lifecycle-ownership.md` | Fonte canonica per ownership lifecycle |
| `docs/sessions/2026-05-11-lifecycle-ownership-design.md` | Questa sessione |

## File aggiornati

| File | Modifica |
|------|----------|
| `docs/automation/n8n-workflows/task-lifecycle.md` | Aggiunta sezione "Ownership canonica" con link a `lifecycle-ownership.md` |
| `docs/automation/n8n-workflows/done-failed-design.md` | Aggiunta sezione "Ownership canonica" con link, chiarimento due pattern validi, stato failed non validato |
| `docs/automation/n8n-workflows/queue-reader.md` | Aggiunta sezione "Ownership lifecycle" con link al canonico |
| `docs/tasks/README.md` | Aggiunto riferimento a `lifecycle-ownership.md` prima del riferimento a `task-lifecycle.md` |
| `docs/PROJECT_STATE.md` | Registrato completamento task 0103, prossimo passo aggiornato |
| `docs/CHECKPOINT.md` | Aggiornato con task 0103 completato e prossimo passo |

## Decisioni documentali

1. **Due pattern done coesistono senza retro-normalizzazione**: `## Done status` e `## Done copy-only outcome` sono entrambi validi. Il queue reader controlla solo l'esistenza del file, non il contenuto.
2. **Failed resta design non validato**: il documento descrive il design atteso ma non crea `docs/tasks/failed/`. La validazione è task separato.
3. **Retry policy**: retry pulito = nuovo task `-retry-N`; retry tecnico = rimozione esplicita di `failed/{task}.md` con documentazione.
4. **Nessun delete da `queue/`**: la policy delete non è ancora matura; i file task restano in queue anche dopo marcatura done.
5. **Aggiornamenti minimal**: i documenti esistenti (`task-lifecycle.md`, `done-failed-design.md`, `queue-reader.md`) sono stati aggiornati con sezioni di raccordo, senza riscrittura completa.

## Cosa NON è stato fatto

- Nessuna modifica a `src/**`, `gas-current/**`, `.gas/**`, `appsscript.json`, `package.json`.
- Nessun file creato o modificato in `docs/tasks/done/**`.
- Nessun file creato o modificato in `docs/tasks/failed/**`.
- Nessun workflow n8n runtime modificato o eseguito.
- Nessun export JSON n8n committato.
- Nessun deploy Apps Script.
- Nessun tag Git.
- Nessun rollback.
- Nessuna validazione del pattern failed.
- Nessuna modifica retroattiva ai file done esistenti (0101, 0102, 0003, 0004).

## Controlli eseguiti

- `git diff --check`: nessun errore whitespace.
- `git diff --stat`: solo path sotto `docs/`.
- `git status --short`: solo file consentiti dal task.
- Verifica manuale: nessun path fuori da `docs/` nei file modificati/creati.

## Esito

- Task 0103 completato: `lifecycle-ownership.md` creato, documenti collegati aggiornati, sessione creata.
- Nessuna modifica app / n8n runtime / done / failed / deploy / tag / rollback.

## Prossimo passo suggerito

Validare il pattern failed: creare un task stub es. `docs/tasks/queue/0104-failed-validation-stub.md` (tipo `n8n-docs` o `docs-only`), creare manualmente un file `docs/tasks/failed/0104-failed-validation-stub.md` con sezione `## Failed status`, verificare che il queue reader lo salti (skip `failed/{task}.md`). Non eseguire ora: è task separato successivo a decisione orchestratore.

## Follow-up — Done marker (micro-fix post-commit 7f37ded)

- `docs/tasks/done/0103-lifecycle-ownership-design.md` creato in modalità copy-only.
- Queue file `docs/tasks/queue/0103-lifecycle-ownership-design.md` mantenuto intatto.
- Completion commit di riferimento: `7f37ded` — `docs: define task lifecycle ownership`.
- Questo follow-up impedisce la rieleggibilità di 0103 dal queue reader n8n (skip done su `done/{task}.md` validato da `lifecycle-ownership.md`).
