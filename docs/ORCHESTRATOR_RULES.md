# Alina Lavoro — Regole prioritarie orchestratore

Ultimo aggiornamento: 2026-05-02.

Questo file contiene le regole prioritarie per ChatGPT/orchestratore e per qualsiasi nuova chat AI che ricostruisce lo stato del progetto da GitHub.

## Principio principale

- GitHub e la fonte di verita operativa.
- L'orchestratore non deve chiedere all'utente riepiloghi manuali se le informazioni sono gia su GitHub.
- Cursor/Agent e l'implementatore operativo: modifica file, esegue controlli, commit e push.
- L'utente non deve essere usato come ponte manuale tra Cursor e ChatGPT, salvo errore locale non pushato.
- Le procedure ripetitive devono stare nei documenti del repository, non essere riscritte ogni volta nei prompt.

## Regola `aggio`

Quando l'utente scrive `aggio` o `aggiornati`, l'orchestratore deve leggere GitHub, non la memoria della chat.

Ordine consigliato di lettura:

1. `docs/ORCHESTRATOR_RULES.md` — regole prioritarie di questa chat/orchestratore.
2. `docs/PROJECT_STATE.md` — stato reale aggiornato.
3. `docs/CHECKPOINT.md` — ripartenza sintetica.
4. `docs/WORKFLOW.md` — workflow orchestratore/implementatore.
5. `docs/AI_RULES.md` — regole AI/Cursor.
6. `docs/COMMANDS.md` — comandi canonici.
7. `docs/roadmap.md` — roadmap prodotto/tecnica.
8. `docs/sessions/` solo se serve dettaglio storico.
9. `README.md` e `package.json` solo se serve capire struttura/comandi.
10. `src/backend/Code.gs` e `src/frontend/Index.html` solo se serve analisi tecnica del codice.

Risposta attesa dopo `aggio`:

1. stato reale del progetto;
2. branch e relazione `dev/main`;
3. versione attuale dell'app;
4. stato deploy Apps Script se documentato;
5. ultimo checkpoint utile;
6. rischi aperti;
7. prossimo passo consigliato.

## Cursor / Agent

Cursor deve sempre aggiornare GitHub a fine blocco operativo o sessione, anche se l'utente non scrive `finito`.

A fine blocco Cursor deve riportare e/o documentare:

- file modificati;
- controlli eseguiti;
- errori o rischi residui;
- hash commit;
- push eseguito;
- `git status --short` finale;
- workspace pulito o non pulito.

Se Cursor lavora in Plan Mode, potrebbe non fare commit/push. In quel caso l'orchestratore puo non trovare il piano su GitHub; solo allora l'utente puo incollare il piano o chiedere a Cursor di salvarlo in `docs/sessions/`.

## Prompt per Cursor

Nei prompt Cursor l'orchestratore deve includere sempre almeno:

```text
@docs/ORCHESTRATOR_RULES.md
@docs/AI_RULES.md
@docs/WORKFLOW.md
@docs/CHECKPOINT.md
@docs/PROJECT_STATE.md
```

Se il task tocca codice frontend, includere anche:

```text
@docs/COMMANDS.md
@src/frontend/Index.html
```

Se il task tocca backend, includere anche:

```text
@src/backend/Code.gs
```

## Richiamo sintetico delle procedure standard

L'orchestratore non deve riscrivere ogni volta procedure standard gia documentate, come controlli frontend, commit selettivo o push.

Nei prompt Cursor usare formule brevi, per esempio:

```text
Esegui i controlli frontend standard da docs/COMMANDS.md.
```

```text
Chiudi il blocco secondo docs/WORKFLOW.md e docs/AI_RULES.md, con commit selettivo e push su GitHub.
```

Cursor deve leggere i documenti e applicare le procedure canoniche. Se un comando fallisce o non e disponibile, deve usare un equivalente e dichiararlo nel riepilogo finale.

## Controlli standard

Quando il task modifica `src/frontend/Index.html`, nel prompt Cursor basta scrivere:

```text
Esegui i controlli frontend standard da docs/COMMANDS.md.
```

Cursor deve eseguire i controlli canonici definiti in `docs/COMMANDS.md` e riportarne l'esito.

## Chiusura blocco / commit / push

L'orchestratore non deve riscrivere ogni volta il blocco terminale con `git status`, `git add`, `git commit` e `git push`.

Quando serve chiudere un blocco, nel prompt Cursor basta scrivere:

```text
Chiudi il blocco secondo docs/WORKFLOW.md e docs/AI_RULES.md, con commit selettivo e push su GitHub.
```

Resta obbligatorio:

- non usare `git add .`;
- committare solo i file necessari;
- pushare su GitHub a fine blocco;
- riportare hash commit e `git status --short` finale;
- dichiarare workspace pulito o non pulito.

## Vincoli permanenti

- Lavorare su `dev` salvo istruzione esplicita diversa.
- Merge `dev -> main` solo quando richiesto esplicitamente.
- Deploy Apps Script solo con conferma esplicita.
- Non modificare `gas-current/`.
- Non usare `git add .`.
- Non cambiare struttura Google Sheet salvo richiesta esplicita.
- Non introdurre librerie esterne o service worker senza approvazione.
- Preferire blocchi piccoli, testabili e committabili.

## Stato stabile corrente

- Produzione stabile: V1.6.2 su `main`.
- Tag stabile V1.6.2: `v1.6.2-stable`.
- Rollback storico: `v1.5-stable`.
- Sviluppo corrente: V1.8A su `dev` per performance pagina Mesi.
