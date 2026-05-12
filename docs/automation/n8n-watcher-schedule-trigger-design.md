# n8n Watcher — Schedule Trigger Design

## Stato

**Data:** 2026-05-12
**Task:** 0112-n8n-watcher-schedule-trigger-design
**Tipo:** n8n-watcher-design (docs-only)
**Allineato a:** `docs/automation/n8n-watcher-runner-mvp-design.md` (Sezione 2), `docs/automation/runbook.md` (Fase 2), `docs/automation/permissions.md`

Questo documento definisce il design per l'integrazione del Schedule Trigger n8n come watcher automatico del queue reader. Non modifica il runtime n8n. L'implementazione richiede gate manuale prima di qualsiasi modifica al runtime.

---

## 1. Architettura watcher MVP

### 1.1 Opzioni valutate

**Opzione A — Schedule Trigger aggiunto al workflow esistente**

Il trigger schedule viene aggiunto come trigger alternativo direttamente nel workflow `TEST - GitHub list Alina task queue`. Il workflow ottiene due trigger: Manual Trigger (già presente) e Schedule Trigger (nuovo).

| Criterio | Valutazione |
|----------|-------------|
| Semplicità configurazione | Alta — solo un nodo da aggiungere |
| Impatto sul workflow validato | **Alto** — modifica un workflow già testato |
| Isolamento watcher / queue reader | Assente — stessa unità logica |
| Manutenibilità | Bassa — disabilitare il polling richiede modificare il workflow esistente |
| Comportamento in caso di errore | Il fallimento del trigger schedule può interferire con i run manuali |

**Opzione B — Workflow separato con Execute Workflow**

Un nuovo workflow dedicato (`Alina watcher — Schedule Trigger`) contiene solo il Schedule Trigger e un nodo `Execute Workflow` che chiama il queue reader esistente.

| Criterio | Valutazione |
|----------|-------------|
| Semplicità configurazione | Media — richiede un nuovo workflow e la configurazione di Execute Workflow |
| Impatto sul workflow validato | **Nullo** — il queue reader non viene toccato |
| Isolamento watcher / queue reader | Completo — il watcher è un'unità logica separata |
| Manutenibilità | Alta — il watcher si attiva/disattiva indipendentemente |
| Comportamento in caso di errore | I problemi del watcher non interferiscono con i run manuali del queue reader |

### 1.2 Scelta: Opzione B

**Scelta motivata: Opzione B — Workflow separato.**

Motivazioni principali:

1. **Zero rischio di regressione sul queue reader.** Il workflow `TEST - GitHub list Alina task queue` è già validato (task 0101–0108, skip processing/done/failed, ramo has_task:true dopo skip failed). Toccarlo per aggiungere un trigger schedule introduce un rischio di regressione non giustificato dal guadagno di semplicità.

2. **Controllo indipendente.** Il watcher può essere attivato, disattivato o sospeso senza influenzare la capacità di eseguire il queue reader manualmente. Questo è critico nella fase MVP supervisionata.

3. **Separazione concettuale.** Il watcher (rilevazione task) e il queue reader (generazione prompt) sono responsabilità distinte. La separazione in workflow distinti rispetta questa distinzione e facilita il debug.

4. **Coerenza con la fase MVP.** Il runner MVP è supervisionato/manuale. Il watcher deve essere aggiungibile e rimovibile senza impatto sulla pipeline consolidata.

### 1.3 Schema architetturale (Opzione B)

```
[Schedule Trigger — ogni 5 min]
    ↓
[Execute Workflow: "TEST - GitHub list Alina task queue"]
    ↓
    ├─ has_task: false → [No queued task / already processing] (silenzioso)
    └─ has_task: true  → [Genera prompt in processing/]
                          [Genera/aggiorna sessione in sessions/]
                          [Commit + push su main via GitHub API]
                          [Flusso termina — runner non automatico]
```

Il nodo Execute Workflow invoca il queue reader in modalità sincrona; il watcher attende il completamento prima di terminare il suo run.

---

## 2. Configurazione Schedule Trigger

### 2.1 Parametri

| Parametro | Valore |
|-----------|--------|
| Tipo trigger | Schedule Trigger n8n |
| Intervallo | Ogni 5 minuti |
| Fuso orario | `Europe/Berlin` (allineato a `GENERIC_TIMEZONE` del container) |
| Unità | Minutes |
| Valore | 5 |

L'intervallo di 5 minuti è configurabile tramite il nodo trigger senza modificare il resto del workflow. Se si vuole aumentare la frequenza, si modifica solo il valore nel nodo Schedule Trigger del workflow watcher.

### 2.2 Overlap protection

n8n Community Edition non ha overlap protection nativa per il Schedule Trigger: se un run dura più di 5 minuti, un secondo run può partire prima che il primo sia terminato.

**Mitigazione:** il queue reader ha già la logica anti-doppio-run tramite skip `processing/{task}-cursor-prompt.md`. Se due run del watcher si sovrappongono:

- Il primo run genera il prompt per il task eleggibile → crea `processing/{task}-cursor-prompt.md`.
- Il secondo run inizia, chiama il queue reader → il filtro `Filter first queued task` trova già il file in `processing/` → restituisce `has_task: false` → il flusso termina silenziosamente.

Il rischio di doppio run con conseguenze dannose è quindi già mitigato a livello di queue reader. Non è necessaria configurazione aggiuntiva per il MVP.

Se in futuro si vuole protezione esplicita (lock n8n), si può valutare l'uso di una variabile statica n8n o di un file flag su GitHub, ma non è necessario per il MVP docs-only.

### 2.3 Comportamento in caso di errore nel queue reader

Se il queue reader fallisce (errore nodo GitHub, rate limit, errore rete):

- n8n registra il fallimento nel log del workflow watcher.
- Il watcher non ritenta automaticamente: il run successivo avverrà al tick del Schedule Trigger (5 minuti dopo).
- Nessun retry automatico senza gate manuale.
- Il file `processing/{task}-cursor-prompt.md` potrebbe non essere creato (a seconda del punto di fallimento) → il task rimane eleggibile al run successivo.
- Se il prompt era già stato creato prima del fallimento, lo skip `processing/` protegge dal doppio run.

**Regola:** nessun retry automatico senza gate. Il fallimento del watcher è osservabile nel log n8n e nel fatto che il prompt non compare su GitHub. L'orchestratore lo rileva con `aggio`.

---

## 3. Gestione has_task:false

Quando il queue reader restituisce `has_task: false`:

- Il flusso entra nel nodo `No queued task / already processing` (Code node).
- Il nodo emette un output JSON con `status: 'no_action'` e il messaggio standard.
- Nessuna scrittura su GitHub.
- Nessun log rumoroso (il nodo Code produce solo output interno n8n, non notifiche esterne).
- Il watcher termina silenziosamente.
- Nessuna modifica al comportamento attuale del queue reader — questo scenario è già validato nei test precedenti (task 0108, secondo run).

Questo comportamento è invariato rispetto al queue reader stand-alone e non richiede nodi aggiuntivi nel workflow watcher.

---

## 4. Gestione has_task:true

Quando il queue reader restituisce `has_task: true`:

- Il queue reader genera (o aggiorna) il prompt in `docs/tasks/processing/{task}-cursor-prompt.md`.
- Il queue reader genera (o aggiorna) la sessione automation in `docs/sessions/automation-{task}.md`.
- Entrambe le operazioni avvengono tramite commit GitHub API (già implementato nel queue reader validato).
- Il commit su `main` è visibile nell'interfaccia GitHub → segnale per l'orchestratore e l'utente.
- **Il flusso si ferma qui.** Il runner non viene eseguito automaticamente.
- Lo skip `processing/` garantisce che il task non venga riprocessato al run successivo del watcher.

**Responsabilità post-generazione prompt:**

```
[Watcher → queue reader → prompt generato su GitHub]
    ↓
[Orchestratore: aggio → legge GitHub → rileva nuovo prompt in processing/]
    ↓
[Orchestratore: propone all'utente di eseguire il prompt con Claude Code locale]
    ↓
[Utente: esegue Claude Code con il prompt]
    ↓
[Claude Code: commit selettivo + push + done marker]
    ↓
[Orchestratore: aggio → verifica esito]
```

Questo flusso è identico al pattern già validato nei task 0101–0111, con la differenza che la generazione del prompt avviene automaticamente (polling) invece che su trigger manuale.

---

## 5. Runner — fuori scope

Questo documento riguarda **esclusivamente** il watcher (Schedule Trigger + chiamata queue reader).

Il runner documentale automatico (Claude Code CLI o Cursor CLI sul VPS) è in scope del **task 0113 futuro**. Non viene progettato né anticipato in questo documento.

Il design del runner è già descritto ad alto livello in `docs/automation/n8n-watcher-runner-mvp-design.md` (Sezione 3.2) e non viene ripetuto qui.

---

## 6. Gate manuale obbligatorio prima dell'implementazione runtime

Prima di qualsiasi modifica al runtime n8n (creazione workflow watcher, attivazione Schedule Trigger, collegamento Execute Workflow):

1. **Revisione e approvazione di questo documento** da parte dell'orchestratore e dell'utente.
2. **Verifica che nessun workflow n8n sia in esecuzione** al momento della modifica (controllare la lista run attivi in n8n).
3. **Conferma utente esplicita** prima di attivare il polling automatico.
4. **Test iniziale con un singolo run manuale** del workflow watcher (tramite il Manual Trigger temporaneo o il tasto "Test workflow" in n8n) per verificare che Execute Workflow invochi correttamente il queue reader.
5. **Solo dopo il test manuale:** attivare lo Schedule Trigger.

**Il gate è un requisito non bypassabile.** L'attivazione del polling automatico senza gate è una modifica al runtime n8n che può avere effetti imprevisti sul VPS e sulla pipeline. La disciplina passo passo definita in `docs/ORCHESTRATOR_RULES.md` (PRIORITÀ 0) si applica integralmente.

---

## 7. Validazione manuale futura (post-implementazione)

Dopo la creazione e attivazione del watcher in n8n:

1. **Osservare almeno un ciclo completo** con `has_task: false` (coda vuota): verificare che il log n8n non contenga errori, che nessuna scrittura GitHub avvenga, che il run termini silenziosamente.
2. **Osservare almeno un ciclo completo** con `has_task: true` (task eleggibile in coda): verificare che il prompt e la sessione siano creati su GitHub, che il commit sia visibile, che il secondo run successivo restituisca `has_task: false` (skip processing).
3. **Verificare l'assenza di doppia esecuzione** su task già in `processing/`: eseguire due run del watcher in rapida successione con lo stesso task eleggibile e verificare che il secondo non generi un secondo prompt.
4. **Documentare l'esito** in una sessione dedicata (`docs/sessions/2026-05-NN-n8n-watcher-schedule-trigger-runtime-validation.md`).

Questa sessione di validazione è prerequisito per passare al task 0113 (runner documentale automatico).

---

## 8. Allineamento ai documenti di riferimento

| Documento | Punto di allineamento |
|-----------|-----------------------|
| `docs/automation/n8n-watcher-runner-mvp-design.md` | Sezione 2: trigger polling scelto; Sezione 3.1: runner MVP supervisionato/manuale; Sezione 4: gate manuali |
| `docs/automation/runbook.md` | Fase 2: watcher n8n con polling timer; Fase 3: runner documentale (escluso da questo doc) |
| `docs/automation/permissions.md` | Il watcher non esegue operazioni applicative; le scritture GitHub sono limitate a `docs/tasks/processing/` e `docs/sessions/` (già consentite dalla policy docs-only) |
| `docs/automation/n8n-workflows/queue-reader.md` | Il queue reader è invocato via Execute Workflow; il suo comportamento interno (skip processing/done/failed, has_task) rimane invariato |
| `docs/automation/n8n-workflows/lifecycle-ownership.md` | La transizione queue → processing rimane di ownership n8n (queue reader); nessun nuovo owner introdotto da questo watcher |
| `docs/ORCHESTRATOR_RULES.md` | PRIORITÀ 0 passo passo applicata al gate runtime; runner manuale/supervisionato per MVP |

---

## 9. Done criteria del design (questo documento)

- [x] Opzione architetturale scelta (B) e motivata.
- [x] Configurazione Schedule Trigger specificata (5 min, Europe/Berlin, overlap mitigato).
- [x] Comportamento errore queue reader descritto (no retry automatico).
- [x] Gestione `has_task: false` descritta (silenzioso, invariato).
- [x] Gestione `has_task: true` descritta (prompt + sessione generati, runner non automatico).
- [x] Runner escluso esplicitamente dallo scope (→ task 0113).
- [x] Gate manuale prima dell'implementazione runtime definito.
- [x] Validazione futura pianificata.
- [x] Allineamento a design MVP (0111), runbook Fase 2, permissions.md verificato.

---

*Documenti correlati: [`n8n-watcher-runner-mvp-design.md`](./n8n-watcher-runner-mvp-design.md) · [`runbook.md`](./runbook.md) · [`permissions.md`](./permissions.md) · [`n8n-workflows/queue-reader.md`](./n8n-workflows/queue-reader.md) · [`n8n-workflows/lifecycle-ownership.md`](./n8n-workflows/lifecycle-ownership.md)*
