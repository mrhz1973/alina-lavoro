# Lifecycle Ownership — Task Queue / Processing / Done / Failed

## Scopo e stato

Questo documento è la **fonte canonica** per definire chi possiede le transizioni di stato nel lifecycle file-based dei task di Alina Lavoro: queue → processing → done / failed.

**Stato (2026-05-12):** documento attivo. Queue reader, skip processing e skip done validati. Failed stub documentale creato per task 0104 (2026-05-12) — formato `## Failed status` documentato in `docs/tasks/failed/0104-failed-validation-stub.md`; **skip failed nel queue reader implementato e validato manualmente** (2026-05-12) — sessione `docs/sessions/2026-05-12-n8n-queue-reader-skip-failed-runtime-validation.md`. Design e validazione completati in `queue-reader-skip-failed-design.md` (task 0106) e `0107-n8n-queue-reader-skip-failed-runtime-validation.md`. Sessione stub: `docs/sessions/2026-05-12-failed-validation-stub.md`.

Documenti correlati: [`task-lifecycle.md`](./task-lifecycle.md) · [`done-failed-design.md`](./done-failed-design.md) · [`queue-reader.md`](./queue-reader.md) · [`docs/tasks/README.md`](../../tasks/README.md).

---

## Stato reale corrente

| Comportamento | Stato |
|---------------|-------|
| Queue reader legge `queue/`, `processing/`, `done/`, `failed/` | **validato** (2026-05-12) |
| Skip task se `processing/{task}-cursor-prompt.md` esiste | **validato** (2026-05-11) |
| Skip task se `done/{task}.md` esiste | **validato** empiricamente (2026-05-11) |
| Skip task se `failed/{task}.md` esiste | **validato manualmente** (2026-05-12) |
| Done copy-only via n8n (workflow `TEST - Mark Alina task done copy-only generalized`) | **validato** (2026-05-11) |
| Done manuale via Claude Code runner (`## Done status`) | **validato** (2026-05-11, task 0101 e 0102) |
| Failed handling (create `failed/{task}.md`, marker, retry) | **skip validato** — design in questo doc e in [`done-failed-design.md`](./done-failed-design.md); **implementazione e validazione** in [`queue-reader-skip-failed-design.md`](./queue-reader-skip-failed-design.md) e [`0107-n8n-queue-reader-skip-failed-runtime-validation.md`](../../sessions/2026-05-12-n8n-queue-reader-skip-failed-runtime-validation.md) |
| Failed stub manuale (pattern `## Failed status`, intenzionale) | **stub creato** (2026-05-12, task 0104) — formato documentato; skip failed validato in queue reader; scenario 0104 usato come validazione |

---

## Definizione degli stati

| Stato | Significato |
|-------|-------------|
| **queue** | Task pronto in `docs/tasks/queue/{task}.md`; candidato alla selezione dal queue reader. |
| **processing** | Prompt Cursor generato in `docs/tasks/processing/{task}-cursor-prompt.md`; lavoro preso in carico o in corso. Non implica completamento. |
| **done** | Task completato con esito positivo; file in `docs/tasks/done/{task}.md`. Intenzionale e tracciato. |
| **failed** | Task non completato; file in `docs/tasks/failed/{task}.md` con `failure_reason`. Non validato — design sotto. |

---

## Matrice ownership

| Operazione | Owner | Come | Note |
|------------|-------|------|------|
| Crea task in `queue/` | Orchestratore (ChatGPT) / utente | File Markdown in `docs/tasks/queue/{task}.md` | Pattern già in uso. |
| Genera prompt in `processing/` | n8n (`TEST - GitHub list Alina task queue`) | Nodo `Build Cursor prompt` + commit via GitHub API | Automatico dopo selezione task. |
| Aggiorna prompt / sessione in `processing/` | n8n (stesso workflow) | Update idempotente con SHA | Se prompt esiste, aggiorna; altrimenti crea. |
| Marca task **done** — pattern A | Claude Code runner (manuale) | Crea `docs/tasks/done/{task}.md` con sezione `## Done status` | Usato per 0101 e 0102. Approvazione manuale per ogni commit/push. |
| Marca task **done** — pattern B | n8n (`TEST - Mark Alina task done copy-only generalized`) | Copy-only verso `done/`, aggiornamento sessione, nessun delete da `queue/` | Usato per task 0003. |
| Marca task **failed** | Claude Code runner (manuale, futuro) o n8n (futuro) | Crea `docs/tasks/failed/{task}.md` con sezione `## Failed status` e `failure_reason` | **Non ancora validato.** Solo design. |
| Delete da `queue/` | **Nessuno per ora** | — | Nessun workflow o runner deve cancellare da `queue/` finché la policy delete non è matura. |
| Deploy / tag / rollback | Utente (manuale) | `npm run deploy`, `git tag`, ecc. | Mai automatico dal lifecycle docs. |

---

## Regole per `processing`

- La presenza di `docs/tasks/processing/{task}-cursor-prompt.md` indica che il prompt Cursor è stato generato.
- **Non significa** che il lavoro è completato.
- **Non implica** done.
- Il queue reader salta un task se questo file esiste (anti-doppio-run).
- Il file può essere aggiornato in modo idempotente (update se esiste, create altrimenti).
- Se il prompt viene rimosso per rigenerazione (es. edge case formato metadata), la rimozione deve essere esplicita e documentata in sessione.

---

## Regole per `done`

- Done è **intenzionale**: non avviene per implicazione o automaticamente solo perché il prompt esiste.
- La transizione verso `done/` è **copy-only** in questa fase: il file task originale **non viene cancellato** da `queue/`.
- Il queue reader salta il task se `docs/tasks/done/{task}.md` esiste, evitando nuovi prompt/sessione.
- **Due pattern validi coesistono** e non vanno retro-normalizzati:

| Pattern | Sezione nel file | Owner | Usato in |
|---------|-----------------|-------|----------|
| `## Done status` | blocco con `Completed by`, `Completion commit`, evidence | Claude Code runner manuale | 0101, 0102 |
| `## Done copy-only outcome` | blocco con `completed_at`, `session_path`, `commit_hash` | n8n workflow `done copy-only generalized` | 0003, 0004 |

- Entrambi i pattern sono equivalenti ai fini dello skip del queue reader (il reader controlla solo l'esistenza di `done/{task}.md`, non il contenuto interno).
- **Non riformattare retroattivamente** i file in `docs/tasks/done/` già scritti.

---

## Regole per `failed` (validato)

- **Validato:** skip failed implementato e validato nel queue reader n8n (2026-05-12) — sessione [`docs/sessions/2026-05-12-n8n-queue-reader-skip-failed-runtime-validation.md`](../../sessions/2026-05-12-n8n-queue-reader-skip-failed-runtime-validation.md).
- Il file `docs/tasks/failed/{task}.md` deve contenere:
  - il contenuto del task originale (copy-only);
  - una sezione `## Failed status` con `failure_reason` leggibile, evidence, timestamp, link al task originale e alla sessione.
- Il queue reader **salta** task con `failed/{task}.md` (implementato e validato).
- **Niente failed automatico fire-and-forget** finché il pattern non è completamente automatizzato.
- Failed è la destinazione per: errore n8n, errore GitHub, parsing task fallito, runner fallisce, controlli non superati, violazione di policy.

---

## Politica retry

- **Retry pulito:** creare un nuovo task in `queue/` con suffisso `-retry-N` (es. `0099-task-name-retry-1.md`). Lascia `failed/{task}.md` intatto per tracciabilità.
- **Retry tecnico su stesso stem:** rimuovere o rinominare `docs/tasks/failed/{task}.md` solo con decisione esplicita e documentazione in sessione. Il queue reader potrà poi rieleggere il task originale.
- **Ogni retry deve essere tracciato** in sessione dedicata con riferimento al tentativo precedente e al motivo del fallimento.

---

## Regola anti-perdita dati

- Sequenza obbligatoria: **create → verify → eventualmente delete**.
- **Nessun delete automatico** da `queue/` nella fase corrente.
- Non cancellare il file sorgente prima che la destinazione (`done/` o `failed/`) sia stata creata, committata e verificata.
- In caso di errore intermedio: lasciare il task in `queue/` con il file `failed/` se esiste, o senza transizione se il failed non è stato committato.

---

## Gate manuali permanenti

- **Deploy Apps Script**, **tag di release**, **rollback**: sempre manuali, mai automatici da questo lifecycle.
- **App production** (V1.9.2 / `@24`): non toccata da nessuna transizione lifecycle docs.
- **n8n/VPS**: non fire-and-forget su operazioni lifecycle finché non esiste un lock o serializzazione validata.
- **Approvazione manuale per commit/push** durante la finestra Claude Code runner temporaneo.

---

## Rischi principali

| Rischio | Mitigazione attiva |
|---------|-------------------|
| Queue reader riprocessa task chiusi se `processing/` viene ripulita | Skip su `done/{task}.md` già validato |
| Doppia esecuzione sullo stesso task | Skip su `processing/{task}-cursor-prompt.md` già validato |
| Failed non tracciato (task sparisce silenziosamente) | Failed = file esplicito in `failed/` — niente fire-and-forget |
| Conflitti push race tra n8n e Claude Code runner | `git pull --rebase` prima di ogni push (patterned da task 0102) |
| Drift documentazione vs realtà | Gate documentale a fine ogni micro-step (PROJECT_STATE + CHECKPOINT + sessione) |
