# n8n Workflow Design — Task Lifecycle

## Ownership canonica

**Aggiornamento (2026-05-11):** per la definizione di **chi possiede le transizioni** di stato (queue → processing → done / failed), le condizioni, i formati e le regole di coesistenza tra n8n e Claude Code runner, il documento **canonico** è:

**[`lifecycle-ownership.md`](./lifecycle-ownership.md)**

Questo documento (`task-lifecycle.md`) resta la **specifica di progettazione** del lifecycle completo (move verso `done`/`failed`, metadata strutturati, lock, ecc.); per le regole operative di ownership leggere prima `lifecycle-ownership.md`.

## Scopo

Questo documento è una **specifica di progettazione** per definire come gestire, in futuro, il **ciclo di vita** dei task **file-based** del repository **Alina Lavoro** (Markdown in `docs/tasks/`, prompt in `processing`, sessioni in `docs/sessions/`). Non sostituisce la documentazione operativa del queue reader in [`queue-reader.md`](./queue-reader.md); le parti già attive nel workflow n8n reale (es. skip anti-doppio-run dal 2026-05-11) sono descritte lì e nelle sessioni collegate.

## Stato

**Proposta / design** per il lifecycle completo (move verso `done`/`failed`, metadata strutturati, lock, ecc.). Il documento resta la fonte per quelle evoluzioni.

**Aggiornamento (2026-05-11):** nel workflow reale `TEST - GitHub list Alina task queue` è stata **testata** una **prima implementazione parziale** dell’**Opzione A**: i task in `queue` per cui esiste già `docs/tasks/processing/{task}-cursor-prompt.md` vengono **saltati**, evitando la doppia esecuzione sullo stesso task. Dettagli operativi in [`queue-reader.md`](./queue-reader.md) e sessione [`docs/sessions/2026-05-11-n8n-queue-reader-processing-skip.md`](../sessions/2026-05-11-n8n-queue-reader-processing-skip.md).

**Workflow separato `TEST - Mark Alina task done copy-only` (0003, copy-only `done`):** [`done-copy-only.md`](./done-copy-only.md) · sessione [`2026-05-11-n8n-done-copy-only-0003-validation.md`](../sessions/2026-05-11-n8n-done-copy-only-0003-validation.md).

**Failed stub documentale (2026-05-12, task 0104):** primo file in `docs/tasks/failed/` creato come validazione manuale del formato `## Failed status`; skip failed nel queue reader non ancora implementato né validato — dettagli in [`lifecycle-ownership.md`](./lifecycle-ownership.md) e sessione [`docs/sessions/2026-05-12-failed-validation-stub.md`](../../sessions/2026-05-12-failed-validation-stub.md). **Design per implementazione disponibile** in [`queue-reader-skip-failed-design.md`](./queue-reader-skip-failed-design.md) (task 0106).

## Scope

**Incluso**

- Task Markdown in `docs/tasks/queue/`.
- Prompt generati in `docs/tasks/processing/`.
- Task completati in `docs/tasks/done/`.
- Task falliti in `docs/tasks/failed/`.
- Report di sessione in `docs/sessions/`.

**Escluso**

- Esecuzione automatica di Cursor.
- Deploy dell’app (Apps Script, `npm run push`, ecc.).
- Tag di release.
- Modifica al codice applicativo (`src/`, ecc.).
- Modifica a `gas-current/`.

## Stato corrente (baseline)

Il workflow n8n **TEST - GitHub list Alina task queue** oggi, in sintesi:

- Elenca i file in **`docs/tasks/queue`** e in **`docs/tasks/processing`**, poi seleziona il **primo file `.md`** in coda **senza** prompt già presente in `processing` (stesso ordinamento deterministico per nome; ignora `.gitkeep`). Se tutti i task in queue hanno già il prompt, il flusso termina con `has_task: false` senza aggiornare file.
- Decodifica e classifica il contenuto del task selezionato.
- **Genera o aggiorna** il prompt Cursor in `docs/tasks/processing/{task}-cursor-prompt.md`.
- **Genera o aggiorna** la sessione in `docs/sessions/automation-{task}.md`.
- **Non esegue** Cursor.
- **Non sposta** il task originale da `queue` verso `done` o `failed`.

Questo design documenta cosa aggiungere **dopo** questa baseline (move `done`/`failed`, metadata aggiuntivi, notifiche, lock, ecc.).

**Nota (2026-05-11):** la mitigazione “skip se esiste `{task}-cursor-prompt.md`” nel queue reader realizza già parte dell’intento dell’**Opzione A** contro il doppio run; restano da progettare/implementare le altre voci di lifecycle (vedi sezioni seguenti).

## Proposta di lifecycle — stati

| Stato | Significato |
|--------|-------------|
| **`queue`** | Task **pronto** in coda: visibile al lettore di queue, candidato alla selezione. |
| **`processing`** | Task **preso in carico**: prompt generato e/o copia in lavorazione; transizione da “solo in attesa” a “in corso”. |
| **`done`** | Task **completato** con esito positivo (lavoro richiesto soddisfatto secondo criteri del task). |
| **`failed`** | Task **non completato** (errore pipeline, test falliti, policy, annullamento operativo). |

## Regola anti-perdita dati

Logica proposta (sicura e ripetibile su GitHub):

- **Non cancellare** mai il file task originale finché la **destinazione** non esiste ed è **verificata** (contenuto presente, commit riuscito dove applicabile).
- **Preferire**: creare o aggiornare il file nella cartella di destinazione → **verificare** (lettura o status API) → solo dopo **rimuovere** dalla sorgente se la policy lo richiede.
- In caso di **errore intermedio**: lasciare il task in **`queue`** *oppure* creare/aggiornare una copia in **`failed`** con **motivo** e riferimenti, **senza** perdere il Markdown originale finché non si è certi del ripristino.

Obiettivo: nessun task “sparito” per un delete anticipato o per un commit fallito non gestito.

## Path convenzioni proposte

| Ruolo | Path |
|--------|------|
| Task in coda | `docs/tasks/queue/{task}.md` |
| Prompt Cursor (generato) | `docs/tasks/processing/{task}-cursor-prompt.md` |
| Task completato | `docs/tasks/done/{task}.md` |
| Task fallito | `docs/tasks/failed/{task}.md` |
| Sessione automation | `docs/sessions/automation-{task}.md` |

`{task}` è lo stem del file senza estensione (es. `0001-test-n8n-task`), allineato agli esempi già usati nel repo.

## Metadata consigliati (front matter o sezioni)

Da **aggiungere progressivamente** o **preservare** quando si sposta il task:

- `status` — valore coerente con lo stato lifecycle.
- `created_by` — chi ha creato il task (già spesso presente).
- `picked_at` — quando il task è stato preso in carico (processing).
- `processed_at` — quando l’elaborazione principale è iniziata o ha superato un gate (definizione da stringere al momento dell’implementazione).
- `completed_at` — chiusura positiva.
- `failed_at` — chiusura negativa.
- `failure_reason` — testo strutturato o bullet per diagnostica.
- `cursor_prompt_path` — path del prompt relativo al repo.
- `session_path` — path della sessione.
- `commit_hash` — se disponibile (ultimo commit rilevante per il task).
- `deploy` — policy deploy dal task (come già nei template).

## Strategia `processing` — due opzioni

### Opzione A — Nessuno spostamento fisico del task da `queue`

- Il task resta fisicamente in `docs/tasks/queue/{task}.md`.
- La prova di **presa in carico** è la presenza (e aggiornamento) di `docs/tasks/processing/{task}-cursor-prompt.md` e di `docs/sessions/automation-{task}.md`, più metadata `picked_at` quando si introduce il front matter.

**Pro:** si adatta al comportamento **già** del queue reader; meno operazioni GitHub; meno rischio di delete prematuro.

**Contro:** finché il file è in `queue`, senza regole dedicate un secondo run può **riselezionare** lo stesso task. *Mitigazione attiva (2026-05-11, queue reader reale):* salto se esiste già `docs/tasks/processing/{task}-cursor-prompt.md` (vedi [`queue-reader.md`](./queue-reader.md)).

### Opzione B — Copia del task in `processing`

- Oltre al prompt, si crea `docs/tasks/processing/{task}.md` come **copia** del task originale (o symlink non disponibile su tutti i client: meglio copia file).

**Pro:** cartella `processing` riflette anche il **contenuto** del task; più chiaro in audit.

**Contro:** duplicazione; bisogno di **sincronizzare** o congelare versione; più nodi e più commit.

### Raccomandazione prudente per Alina Lavoro

**Partire da Opzione A** arricchita da **regole esplicite anti-doppio-run** (vedi mitigazioni): allineamento immediato al workflow esistente e minor superficie di errore. Valutare **Opzione B** quando servirà audit separato del **testo task** in `processing` o quando la policy richiederà di **rimuovere** dalla queue solo dopo creazione verificata della copia in `processing`.

## Strategia `done`

Un task può essere considerato per lo spostamento (o la copia-verifica-delete) verso **`docs/tasks/done/{task}.md`** quando, **cumulativamente**:

- **Cursor** (o runner equivalente) ha **eseguito** il lavoro previsto dal prompt, secondo i criteri del task.
- **Commit e push** richiesti sono stati **eseguiti** (ove previsti).
- La **sessione** è stata **aggiornata** con esito e riferimenti.
- **Controlli** obbligatori (lint, `git diff --check`, checklist del task) sono **completati** o esplicitamente accettati.

La transizione deve essere **intenzionale** (manuale o tramite workflow dedicato), non implicita solo perché il prompt esiste.

## Strategia `failed`

Un task va verso **`docs/tasks/failed/{task}.md`** (o resta tracciato come failed con copia) quando si verifica almeno uno tra:

- Errore **n8n** (API GitHub, timeout, credential).
- Errore **GitHub** (409, branch protection, conflitto).
- **Prompt non generabile** (contenuto illeggibile, task malformato).
- **Cursor / runner** fallisce (uscita in errore, impossibilità di completare).
- **Controlli** non superati dopo retry ragionevole.
- **Violazione di policy** (permessi file, deploy vietato, uso di `git add .` se vietato, ecc.).

In tutti i casi conviene **appendere** o aggiornare `failure_reason` e la **sessione** con dettaglio sufficiente per retry o analisi.

## Nodi n8n futuri (solo design)

Possibili estensioni del grafo, da definire in JSON/template quando si implementa:

- **Mark task as processing** — aggiorna metadata sessione o file stub; opzionale aggiornamento front matter via commit.
- **Move task to done** — sequenza create/update in `done/` → verifica → delete da `queue` se policy lo richiede.
- **Move task to failed** — analogo verso `failed/` con append motivo.
- **Append failure reason to session** — merge contenuto su `docs/sessions/automation-{task}.md`.
- **Optional notification** — email/Slack/webhook **mai** con segreti; solo stato e link **pubblici** o redatti.

## Policy GitHub (move non atomico)

L’API Git/GitHub **non** offre un “move” atomico elementare come in un filesystem locale tipico. Pattern consigliato:

1. **Create** o **update** del file nella **destinazione** (`done`, `failed`, o `processing` se si usa Opzione B).
2. **Verifica** che il contenuto sia quello atteso (GET file, confronto SHA/size).
3. **Delete** dell’originale in **`queue`** solo dopo conferma (o lasciare in queue con flag documentale fino a processo maturo).
4. **Messaggio di commit** chiaro e ripetibile (vedi sotto).
5. **Evitare** di cancellare la sorgente **prima** che la destinazione sia confermata.

## Commit message suggeriti

- `automation: mark task as processing`
- `automation: complete queued task`
- `automation: mark queued task failed`

## Rischi

| Rischio | Descrizione |
|---------|-------------|
| **Doppia esecuzione** | Lo stesso task viene selezionato due volte da n8n o da due runner. |
| **Perdita task** | Delete da `queue` prima che `done`/`failed` sia persistito correttamente. |
| **Race condition** | Due esecuzioni del workflow leggono la stessa queue simultaneamente. |
| **Commit concorrenti** | Push simultanei su `main` che generano conflitti o stati incoerenti. |
| **Task a metà** | Prompt generato ma Cursor non eseguito; stato ambiguo tra queue e processing. |

## Mitigazioni

- Mantenere il workflow **manuale** o semi-manuale finché non esiste un **lock** o una convenzione forte (es. branch dedicato per automation).
- **Un solo runner attivo** per repo (o serializzazione esplicita).
- **Ordinamento deterministico** del primo task (già in uso: nome file).
- **Sessione sempre aggiornata** con timestamp e stato (“Cursor not executed yet”, “completed”, “failed”).
- **Delete solo dopo create riuscito** e verifica lettura.
- **Lock file** opzionale in futuro (es. `.processing-lock` con owner e timestamp — da valutare per race e cleanup).

## Raccomandazione finale (ordine di implementazione)

Tra **solo `queue → done/failed` documentale/manuale** e **prima introdurre `processing`**:

1. **Priorità:** consolidare innanzitutto il significato di **`processing`** in modo **compatibile con Opzione A**: presenza di prompt + sessione aggiornata + regola **“non riselezionare se già in elaborazione”** (metadata o convenzione su nome file / sezione in sessione). Questo riduce **subito** il rischio di **doppia esecuzione** senza introdurre subito move fisici delicati.
2. **Poi** introdurre **move verso `done`/`failed`** con pattern **create → verify → delete** e commit dedicati.

Saltare direttamente a move **`done`/`failed`** senza un confine **`processing`** chiaro espone di più al doppio run se n8n viene rilanciato.

## Prossimo passo

Dopo l’approvazione di questa specifica come linea guida:

1. Aggiornare **`docs/tasks/README.md`** con un link stabile a questo file (già previsto insieme alla pubblicazione della specifica).
2. Oppure preparare un **prompt di implementazione** mirato: solo **marcatura `processing`** (metadata + skip in filter) **senza** ancora spostare file fisici—come primo micro-step tecnico verso n8n.

---

*Riferimenti correlati: `queue-reader.md`, `queue-reader-ai-friendly-template.md`, sessione audit `docs/sessions/2026-05-11-n8n-queue-reader-manual-audit.md`, design chiusura task [`done-failed-design.md`](./done-failed-design.md).*
