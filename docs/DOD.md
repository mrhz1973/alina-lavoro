# Definition of Done - Alina Lavoro automation

**Data:** 18 maggio 2026  
**Versione:** v1.0  
**Stato:** approved  
**Decisione finale:** utente  
**Revisori:** ChatGPT, Claude

## Principio

Un task non e' **done** senza prova oggettiva. La dichiarazione "task completato" senza evidence pack e' invalida.

Il sistema deve distinguere tra codice scritto, codice committato, codice pushato, build verde, deploy eseguito, feature funzionante e feature verificata nel browser reale. Ogni stato richiede evidenza separata.

## Stati ammessi

| Stato | Significato |
|---|---|
| `done` | Task completato con evidence pack sufficiente |
| `done-unverified` | Build o commit presenti, ma verifica runtime/browser mancante o fallita |
| `failed` | Task non completato, causa documentata |
| `blocked` | Richiede gate umano, credenziali, accesso o decisione |
| `superseded` | Sostituito da task successivo |
| `rejected` | Output non accettato |

## Evidence pack obbligatorio

Ogni task deve produrre un evidence pack proporzionato al tipo di lavoro.

| Evidenza | Quando obbligatoria | Requisito |
|---|---|---|
| Commit SHA finale | Sempre per modifiche GitHub | SHA del feature/iter branch o `main` se autorizzato |
| Diff o link confronto | Sempre | Nessun "ho fatto" senza diff |
| `git status --short` | Sempre | Deve essere pulito o spiegato |
| Test/check eseguiti | Sempre | Output o esito sintetico |
| `clasp status` | Task GAS | Output incluso o motivazione se non eseguito |
| Apps Script deployment ID | Task deploy GAS | ID deployment o nota "no deploy" |
| Fetch HTTP prod/dev URL | Task UI/runtime | URL e marker atteso verificato |
| Grep marker atteso | Task UI/runtime | Versione/stringa nuova trovata o assente |
| `clasp pull` + diff remoto | Task backend `.gs` | Conferma allineamento col remoto o sync issue |
| Browser reale | Quando richiesto | Se non fatto, scrivere esplicitamente "non testato in browser reale" |

## Marker versionato in produzione

Ogni release deve lasciare in pagina un marker leggibile dal browser, con formato simile:

```text
v2.2.0-build0428-stable+<short-sha>
```

Il browser e' ground truth per la release visibile all'utente. GitHub, clasp e build locale non bastano a dichiarare una release funzionante.

## Smoke test minimo pre-done

Prima di dichiarare `done`, l'implementatore deve eseguire almeno:

1. check sintattici o build disponibili;
2. controllo diff;
3. controllo stato Git;
4. verifica del marker o della stringa funzionale se il task impatta UI/runtime;
5. verifica di non aver toccato path vietati.

Se lo smoke test fallisce e il codice resta committato, lo stato massimo ammesso e' `done-unverified`.

## Build verde e feature funzionante

Build OK e' necessaria ma non sufficiente. Una feature e' funzionante solo se:

- il codice corretto e' nel branch previsto;
- il runtime previsto usa quel codice;
- l'evidenza dimostra il comportamento atteso;
- eventuali limiti di test sono dichiarati.

## Regola ask once

L'implementatore puo' chiedere chiarimenti solo all'inizio del task. Dopo la partenza deve procedere secondo policy, ridurre scope in modo conservativo o marcare `blocked` con motivo oggettivo.

## Messaggio di chiusura task

Ogni chiusura task deve includere:

- path modificati;
- commit SHA;
- diff summary o link confronto;
- test eseguiti;
- evidenze runtime/browser se applicabili;
- stato finale;
- limitazioni esplicite;
- prossimo gate se richiesto.

## Anti-hallucinazione di stato

L'implementatore deve dichiarare solo cio' che ha fatto o verificato su GitHub/runtime. Non deve dichiarare:

- deploy riuscito se non ha deployment ID;
- browser test passato se non e' stato eseguito;
- sync Apps Script riuscito se non c'e' evidenza remota;
- produzione aggiornata se il marker browser non lo conferma;
- task autonomo completato se mancano diff e SHA.

## Definition of Done per tipo task

### Docs-only task

`done` richiede:

- file Markdown creati/modificati;
- diff controllato;
- link o SHA commit;
- nessun path runtime toccato;
- Markdown leggibile su GitHub.

### n8n workflow task

`done` richiede:

- export o descrizione workflow redatta;
- credenziali non esposte;
- test manuale o dry-run documentato;
- evidenza ramo true/false se applicabile;
- rollback/restore path documentato.

### Cursor CLI implementation task

`done` richiede:

- branch dedicato;
- prompt usato o riferimento al prompt;
- diff;
- test/check;
- evidence pack;
- PR o commit pushato secondo policy.

### OpenClaw bridge task

`done` richiede:

- endpoint `/codex-consult` testato;
- nessun PAT GitHub;
- nessun Telegram gestito da OpenClaw;
- nessuna skill terza installata;
- test risposta JSON valida;
- log audit disponibile.

### Ollama classifier task

`done` richiede:

- modello indicato;
- endpoint health;
- test JSON su dataset minimo;
- soglie usate;
- degraded-mode se fallback Dell;
- percentuale di output JSON valido.

## Deploy, tag e rollback

Deploy, tag e rollback sono esclusi da ogni task salvo autorizzazione separata ed esplicita. Se un task richiede deploy/tag/rollback ma il prompt non lo autorizza chiaramente, lo stato deve essere `blocked`.

## Riferimenti correlati

- `docs/ARCHITECTURE.md`
- `docs/ARCHITECTURE-DELL-NODE.md`
- `docs/CONTRACTS.md`
- `docs/ROADMAP-EXECUTION.md`

## Changelog

| Versione | Data | Stato | Modifica |
|---|---|---|---|
| v1.0 | 2026-05-18 | approved | Definition of Done con evidence pack e regole anti-hallucinazione |
