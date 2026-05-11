# n8n Workflow Design — Done Copy-Only Generalization

## Stato

**Design documentale** per la generalizzazione del flusso **done copy-only** rispetto al workflow hardcoded [`TEST - Mark Alina task done copy-only`](./done-copy-only.md) (`0003`). Il testo qui sotto resta la **specifica** dei path dinamici e dei nodi consigliati.

**Validazione (2026-05-11):** il workflow n8n reale **`TEST - Mark Alina task done copy-only generalized`** ha superato la **prima validazione manuale** sul task **`0004-test-n8n-done-copy-only-generalized`** (create `done`, update sessione, `queue` intatta). Dettagli operativi e limiti residui in [`docs/sessions/2026-05-11-n8n-done-copy-only-0004-generalized-validation.md`](../sessions/2026-05-11-n8n-done-copy-only-0004-generalized-validation.md).

**Rerun idempotente (2026-05-11):** aggiunto ramo **Success** → **`Update done file`** (GitHub **File / Edit**, path e content dinamici da **`Build done copy content`**), rimosso nodo legacy **`Update done file 0003`**; seconda esecuzione sul **0004** completata senza passare da **`Create done file`**. Dettagli in [`docs/sessions/2026-05-11-n8n-done-copy-only-0004-idempotent-rerun.md`](../sessions/2026-05-11-n8n-done-copy-only-0004-idempotent-rerun.md).

**Verify done file (2026-05-11):** dopo **Create/Edit** del `done`, aggiunto nodo GitHub **File / Get** **`Verify done file`** con **File Path** `{{ $('Build done copy content').item.json.done_path }}` su branch **`main`**; entrambi i rami convergono su **Get** prima della sessione. Validazione manuale **OK** sul **0004**: [`docs/sessions/2026-05-11-n8n-done-copy-only-0004-verify-done.md`](../sessions/2026-05-11-n8n-done-copy-only-0004-verify-done.md).

Nessuna modifica a codice applicativo, deploy, tag o `gas-current/` tramite questo documento.

## Scopo

Definire come passare dal workflow **hardcoded** sul task **0003** (path fissi in ogni nodo) a un flusso **riutilizzabile** per **task arbitrari**, mantenendo le garanzie attuali: **nessuna delete** da `queue`, **create/update** idempotente del file `done`, aggiornamento **sessione** coerente.

Baseline operativa già validata: [`done-copy-only.md`](./done-copy-only.md) · sessione [`2026-05-11-n8n-done-copy-only-0003-validation.md`](../sessions/2026-05-11-n8n-done-copy-only-0003-validation.md). Prima validazione **generalizzata** su **0004**: [`2026-05-11-n8n-done-copy-only-0004-generalized-validation.md`](../sessions/2026-05-11-n8n-done-copy-only-0004-generalized-validation.md). **Rerun idempotente 0004:** [`2026-05-11-n8n-done-copy-only-0004-idempotent-rerun.md`](../sessions/2026-05-11-n8n-done-copy-only-0004-idempotent-rerun.md). **Verify `done` post-write:** [`2026-05-11-n8n-done-copy-only-0004-verify-done.md`](../sessions/2026-05-11-n8n-done-copy-only-0004-verify-done.md).

## Baseline (workflow attuale)

Il workflow **`TEST - Mark Alina task done copy-only`** oggi, in sintesi:

- Legge `docs/tasks/queue/0003-test-n8n-done-copy-only.md`.
- Costruisce contenuto **done** (copia + sezione `## Done copy-only outcome`).
- **Crea/aggiorna** `docs/tasks/done/0003-test-n8n-done-copy-only.md` (GitHub Edit, idempotente dopo correzione Create→Edit).
- Legge e **aggiorna** `docs/sessions/automation-0003-test-n8n-done-copy-only.md`.
- **Non** rimuove il task da `queue`.
- **Non** tocca l’app Alina.

## Obiettivo di generalizzazione

Derivare **dinamicamente** (da input o da upstream) almeno:

| Campo | Ruolo |
|--------|--------|
| `task_name` | Identificatore file senza estensione o slug coerente con i path (es. `0004-test-n8n-done-copy-only-generalized`). |
| `queue_path` | Path completo del task in coda. |
| `done_path` | Path del file archiviato in `done`. |
| `cursor_prompt_path` | Path del prompt in `processing` (per riferimenti nella sessione / outcome). |
| `session_path` | Path sessione automation. |
| `source_sha` | SHA GitHub del file sorgente usato per update sicuri dove richiesto. |
| `completed_at` | Timestamp ISO nell’outcome. |

## Input possibili

### A. Input manuale (Set / Edit Fields)

- Un nodo **Set** (o equivalente) imposta `task_name` e/o `queue_path` prima dei nodi GitHub.
- **Pro:** massima prudenza, testabile con task **0004** senza accoppiare subito al queue reader.
- **Contro:** richiede intervento umano a ogni run (accettabile per fase di validazione).

### B. Lettura dal primo task eleggibile già prodotto dal queue reader

- Il flusso **done copy-only** consuma l’output strutturato del queue reader (path file, metadata).
- **Pro:** meno errori di battitura sui path.
- **Contro:** accoppiamento forte tra workflow; va definito un contratto JSON stabile tra i due flussi.

### C. Input da sessione automation o da prompt in `processing`

- Parse di front matter o sezioni in `automation-{task}.md` o nel file `-cursor-prompt.md`.
- **Pro:** single source of truth dopo la prima generazione.
- **Contro:** parsing fragile; rischio di desincronizzazione se i file sono editati a mano.

## Raccomandazione (fase prudente)

Per la **prima generalizzazione** in n8n:

- Preferire **opzione A**: **Set node** con `task_name` (o `queue_path` completo) valorizzati **manualmente** prima dell’esecuzione.
- Mantenere **nessuna delete** da `queue`.
- Mantenere **Manual Trigger** e test dedicato (es. task **0004**).
- Dopo stabilizzazione, valutare **B** o **C** con contratto dati documentato.

## Convenzione path dinamici

Se il file task in coda è:

`docs/tasks/queue/{task}.md`

allora (allineato alla convenzione già usata nel repo):

| Tipo | Path |
|------|------|
| **Queue** | `docs/tasks/queue/{task}.md` |
| **Done** | `docs/tasks/done/{task}.md` |
| **Prompt Cursor** | `docs/tasks/processing/{task}-cursor-prompt.md` |
| **Sessione automation** | `docs/sessions/automation-{task}.md` |

`{task}` è il nome file **senza** `.md` nella cartella `queue` (es. `0004-test-n8n-done-copy-only-generalized`).

Un nodo **Code** `Build dynamic paths` può calcolare le quattro stringhe a partire da `task_name` e validare che non contengano `..` o separatori anomali.

## Nodi futuri proposti

Struttura **allineata** al workflow generalizzato validato (rami **Create** / **Edit** dopo `Check done file exists`):

```text
Manual Trigger
→ Set task input
→ Build dynamic paths
→ Get queue task
→ Build done copy content
→ Check done file exists
   ├→ Success / file esiste → Update done file → Verify done file
   └→ Error / Not Found    → Create done file → Verify done file
→ Get automation session
→ Build updated session
→ Update automation session
```

## Idempotenza

Solo **Create** su path già esistente tende a **fallire** alla riesecuzione (come osservato con il task 0003). Servono:

- **Check** esistenza file (o gestione 404) **oppure**
- API di **Edit** / update con **`sha`** obbligatorio quando il file esiste.

La policy “**create or update**” (o ramo Error → Create come nel queue reader) deve restare esplicita nei nodi GitHub.

**Stato (2026-05-11):** sul workflow **`TEST - Mark Alina task done copy-only generalized`** il pattern **Check → Success/Edit** vs **Error/Create** è stato **validato** sul task **0004** (vedi [`2026-05-11-n8n-done-copy-only-0004-idempotent-rerun.md`](../sessions/2026-05-11-n8n-done-copy-only-0004-idempotent-rerun.md)). Aggiunto e validato **`Verify done file`** (GET post-write) — [`2026-05-11-n8n-done-copy-only-0004-verify-done.md`](../sessions/2026-05-11-n8n-done-copy-only-0004-verify-done.md).

## Regole anti-perdita dati

1. **No delete** da `queue` in questa fase (principio prudente; allineato a [`done-failed-design.md`](./done-failed-design.md)).
2. **Create/update** del file `done` solo dopo contenuto costruito in memoria (o in item n8n) verificabile.
3. **Verify done file:** GET del `done_path` dopo **Create/Edit** — **implementato** e validato sul **0004** ([`2026-05-11-n8n-done-copy-only-0004-verify-done.md`](../sessions/2026-05-11-n8n-done-copy-only-0004-verify-done.md)); estensioni future possibili su contenuto (sezione outcome, size).
4. **Update session** dopo `done` stabile, con stessi riferimenti path e `source_sha` / `completed_at`.
5. **Delete** (queue o altro) solo in **futuro** e con **gate** esplicito in documento separato / task.

## Interazione con queue reader

Finché i task **restano in `queue`**, il queue reader ([`queue-reader.md`](./queue-reader.md)) può ancora **considerarli** in lista. Oggi il queue reader **salta** i task per cui esiste già `docs/tasks/processing/{task}-cursor-prompt.md` (**Opzione A**).

**Contratto atteso (documentato 2026-05-11, implementazione n8n da validare):** estendere lo stesso principio di skip quando esiste **`docs/tasks/done/{task}.md`**, così un task già chiuso in copy-only **done** non riceve un nuovo prompt pur restando in `queue`. Dettagli e stato lavori in [`docs/sessions/2026-05-11-n8n-queue-reader-skip-done-design.md`](../sessions/2026-05-11-n8n-queue-reader-skip-done-design.md); coordinamento con [`task-lifecycle.md`](./task-lifecycle.md).

## Test consigliato

Il task **`0004-test-n8n-done-copy-only-generalized.md`** in `docs/tasks/queue/` è stato usato per la **prima validazione** del workflow **`TEST - Mark Alina task done copy-only generalized`** (Set manuale `task_name`, path dinamici, create `done`, update sessione). Esito: **OK** — vedi [`docs/sessions/2026-05-11-n8n-done-copy-only-0004-generalized-validation.md`](../sessions/2026-05-11-n8n-done-copy-only-0004-generalized-validation.md).

**Rerun idempotente:** dopo implementazione ramo **Success** → **`Update done file`**, seconda esecuzione sullo stesso **0004** senza **`Create done file`** — [`docs/sessions/2026-05-11-n8n-done-copy-only-0004-idempotent-rerun.md`](../sessions/2026-05-11-n8n-done-copy-only-0004-idempotent-rerun.md).

**Verify done file:** GET post-write su `done_path` da entrambi i rami — [`docs/sessions/2026-05-11-n8n-done-copy-only-0004-verify-done.md`](../sessions/2026-05-11-n8n-done-copy-only-0004-verify-done.md).

Per regressioni future: rieseguire con lo stesso `task_name` e verificare outcome in `done` + sessione.

## Rischi

| Rischio | Descrizione |
|---------|-------------|
| Path derivati errati | Typo in `task_name` → sovrascrittura file sbagliati. |
| Sessione aggiornata male | Riferimenti a prompt/sessione non allineati al `task` reale. |
| Done duplicati / incoerenti | Convenzione `{task}` non rispettata tra cartelle. |
| Chiusura “done” senza esito reale | Automazione segnala done senza gate umano o senza lavoro Cursor completato (se applicabile). |
| Conflitti GitHub | Commit concorrenti, SHA obsoleto su update. |

## Mitigazioni

- **Set node manuale** (fase A) per ridurre ambiguità.
- **Preview path** in un nodo **Code** (log o output read-only) prima dei write.
- **Nessuna delete** da queue in questa fase.
- **Verify done file** (GET su `done_path` dopo write) — **validato** sul **0004**; vedi [`2026-05-11-n8n-done-copy-only-0004-verify-done.md`](../sessions/2026-05-11-n8n-done-copy-only-0004-verify-done.md).
- **Sessione** sempre aggiornata con gli stessi path usati per `done` e `source_sha` coerente.
- **Un solo runner** attivo per repo (evita race su stesso `task_name`).

## Prossimo passo consigliato

1. **Implementare e testare in n8n** lo skip del queue reader quando esiste **`docs/tasks/done/{task}.md`** — specifica in [`queue-reader.md`](./queue-reader.md), template in [`queue-reader-ai-friendly-template.md`](./queue-reader-ai-friendly-template.md), traccia in [`docs/sessions/2026-05-11-n8n-queue-reader-skip-done-design.md`](../sessions/2026-05-11-n8n-queue-reader-skip-done-design.md); contesto anche in [`docs/sessions/2026-05-11-n8n-done-copy-only-0004-verify-done.md`](../sessions/2026-05-11-n8n-done-copy-only-0004-verify-done.md) e [`task-lifecycle.md`](./task-lifecycle.md).
2. **Opzionale:** rafforzare `Verify done file` con controlli sul **contenuto** (presenza `## Done copy-only outcome`, vincoli di size) oltre al GET di esistenza.
3. **Contratto dati** con il queue reader (**opzione B**) dopo che lo skip per `done` è **implementato e testato** in n8n.

## Riferimenti

- Workflow validato (0003): [`done-copy-only.md`](./done-copy-only.md)
- Validazione generalizzata (0004, prima run): [`docs/sessions/2026-05-11-n8n-done-copy-only-0004-generalized-validation.md`](../sessions/2026-05-11-n8n-done-copy-only-0004-generalized-validation.md)
- Rerun idempotente (0004): [`docs/sessions/2026-05-11-n8n-done-copy-only-0004-idempotent-rerun.md`](../sessions/2026-05-11-n8n-done-copy-only-0004-idempotent-rerun.md)
- Verify done file (0004): [`docs/sessions/2026-05-11-n8n-done-copy-only-0004-verify-done.md`](../sessions/2026-05-11-n8n-done-copy-only-0004-verify-done.md)
- Lifecycle: [`task-lifecycle.md`](./task-lifecycle.md)
- Done/failed design: [`done-failed-design.md`](./done-failed-design.md)
- Queue reader: [`queue-reader.md`](./queue-reader.md) · skip `done` (design): [`docs/sessions/2026-05-11-n8n-queue-reader-skip-done-design.md`](../sessions/2026-05-11-n8n-queue-reader-skip-done-design.md)
