# Sessione — n8n Watcher Schedule Trigger Publish Blocked (Task 0114)

**Data:** 2026-05-12
**Task:** 0114-n8n-watcher-schedule-trigger-runtime-activation
**Tipo:** n8n-runtime-activation (bloccato in fase Publish)
**Runner:** utente (verifica manuale in n8n)

## Obiettivo

Attivare il watcher `Alina watcher - Schedule queue reader` con Schedule Trigger ogni 5 minuti e verificare il comportamento `has_task:false` come polling automatico.

## Azioni eseguite in n8n

### Aggiunta Schedule Trigger al watcher

- Aggiunto nodo **Schedule Trigger** al workflow `Alina watcher - Schedule queue reader`.
  - Intervallo: ogni 5 minuti.
  - Timezone: `Europe/Berlin`.
- Il Manual Trigger del watcher è rimasto presente e invariato.
- Il nodo Execute Workflow punta ancora correttamente al queue reader.
- Il nodo Schedule Trigger non mostra errori.

### Test manuale post-aggiunta Schedule Trigger

- Eseguito il workflow watcher tramite Manual Trigger dopo l'aggiunta del Schedule Trigger.
- Esito: **tutto verde**.

### Tentativo di pubblicazione del watcher

- Cliccato **Publish** sul workflow `Alina watcher - Schedule queue reader`.
- Esito: **errore di pubblicazione**.

**Errore esatto:**

```
Cannot publish workflow: Node "Call 'TEST - GitHub list Alina task queue'"
references workflow zEqarh3NhcTcpX74 ("TEST - GitHub list Alina task queue")
which is not published. Please publish all referenced sub-workflows first.
```

### Tentativo di pubblicazione del queue reader

- Tentato di pubblicare `TEST - GitHub list Alina task queue` per soddisfare il requisito.
- Esito: **impossibile / non applicabile**.

**Messaggio n8n:**

```
This workflow has no trigger nodes that require publishing.
```

## Stato lasciato in n8n

- **Queue reader** `TEST - GitHub list Alina task queue`: Manual Trigger + "When Executed by Another Workflow" — **non pubblicato** (considerato non pubblicabile da n8n).
- **Watcher** `Alina watcher - Schedule queue reader`: Manual Trigger + Schedule Trigger + Execute Workflow — **non pubblicato, non attivo come polling**.
- Nessun polling automatico attivo.
- Nessun runner automatico.
- Nessuna modifica app, deploy, tag, rollback.

## Interpretazione

### Causa del blocco

In n8n (versione attuale sul VPS), la pubblicazione di un workflow parent che usa **Execute Workflow** richiede che il workflow target (sub-workflow) sia anch'esso **pubblicato**. Il trigger "When Executed by Another Workflow" non viene considerato da n8n un trigger che richiede pubblicazione, quindi la UI mostra "This workflow has no trigger nodes that require publishing" e non consente di pubblicarlo.

Il risultato è un **deadlock UI**: il watcher non può essere pubblicato perché il queue reader non è pubblicato; il queue reader non può essere pubblicato perché n8n non ritiene che i suoi trigger richiedano pubblicazione.

### Validità di 0113

Il task 0113 (prerequisito B1) resta valido: in **test manuale** (Manual Trigger sul watcher) il queue reader viene richiamato correttamente tramite Execute Workflow e il flusso funziona. Il blocco emerge solo nella fase di **pubblicazione/attivazione come polling automatico**.

### Opzioni per procedere

| Opzione | Descrizione | Rischio |
|---------|-------------|---------|
| **A** | Investigare versione n8n installata sul VPS e documentazione: verificare se esiste una modalità per rendere pubblicabile il queue reader (es. impostazione workflow, flag, versione più recente) | Basso — solo analisi; nessuna modifica runtime |
| **B** | Passare a **Opzione A controllata** del design 0112: aggiungere Schedule Trigger **direttamente nel queue reader** (`TEST - GitHub list Alina task queue`), rinunciando temporaneamente al watcher separato | Medio — modifica il workflow validato; richiede gate manuale e test regressione |
| **C** | Altra alternativa documentata solo se sicura (es. polling via workflow n8n diverso senza Execute Workflow, oppure aggiornamento n8n sul VPS) | Da valutare — non procedere senza analisi |

**Regola operativa:** non forzare con trigger finti, webhook fittizi o workaround non documentati. Non proseguire con runner automatico. La scelta dell'opzione richiede approvazione orchestratore.

## Prossimo passo richiesto

Attendere scelta architetturale dall'orchestratore (Opzione A, B o C) prima di qualsiasi ulteriore modifica al runtime n8n. Il task 0114 resta bloccato/in sospeso fino alla decisione.

---

## Opzione A — indagine UI read-only (2026-05-12)

**Esito: non risolutiva.** Opzione A investigata dall'utente in n8n in modalità read-only. Nessuna modifica al runtime.

### Ispezione Workflow settings del queue reader

Workflow ispezionato: `TEST - GitHub list Alina task queue`.

Voci visibili in **Workflow settings**:
- Execution Logic
- Error Workflow
- Timezone
- Save failed production executions
- Save successful production executions
- Save manual executions
- Save execution progress
- Redact execution data
- Timeout Workflow
- Estimated time saved

**Assente:** nessuna voce tipo "This workflow can be called by" o impostazione equivalente per rendere il workflow pubblicabile come sub-workflow.

### Ispezione del nodo Execute Workflow nel watcher

Nel workflow `Alina watcher - Schedule queue reader`, sul nodo Execute Workflow / Call queue reader, il campo **Source** mostra solo due opzioni:

- **Database**
- **Define Below**

Non sono disponibili opzioni tipo `URL`, `Local File`, `Parameter` esterno o equivalenti.

**`Define Below` non è stato selezionato.** Significherebbe incorporare il JSON del workflow target direttamente nel nodo chiamante — non è una soluzione pulita perché:
- duplica il queue reader nel nodo watcher;
- crea rischio di drift tra la copia incorporata e il workflow reale;
- complica la manutenzione;
- contrasta con la regola di non usare export JSON n8n non redatti.

### Conclusione Opzione A

Non è emersa alcuna leva UI sicura per:
- rendere pubblicabile il queue reader come sub-workflow;
- aggirare pulitamente il vincolo di publish del watcher senza modifiche rischiose.

Il blocco di 0114 resta invariato. Opzione A è chiusa con esito negativo / non risolutiva.

### Prossimo passo deciso

**Opzione B controllata:** aggiungere Schedule Trigger direttamente nel workflow `TEST - GitHub list Alina task queue`, mantenendo il Manual Trigger e il trigger "When Executed by Another Workflow". Preparata come task separato **0115** — nessuna modifica al runtime in questa fase.

Riferimento task: `docs/tasks/queue/0115-n8n-queue-reader-direct-schedule-trigger-runtime-activation.md`.
