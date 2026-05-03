# Alina Lavoro — Workflow snello orchestratore

Ultimo aggiornamento: 2026-05-03.

Questo file chiarisce come ridurre passaggi inutili tra utente, orchestratore e Cursor.

## Regola principale

Quando lo stato GitHub rende chiaro il prossimo passo, l'orchestratore deve dare subito il prompt Cursor completo.

L'utente non deve dover capire da solo quale prompt dare a Cursor.

## Operazioni ordinarie

Sono considerate sempre incluse nel blocco di lavoro corrente, senza chiedere consenso file per file:

- aggiornare documentazione in `docs/`;
- creare note in `docs/sessions/`;
- aprire issue GitHub per TODO/miglioramenti richiesti;
- aggiornare roadmap, checkpoint, project state e regole operative;
- far chiudere Cursor con commit selettivo e push sul branch operativo.

## Autorizzazione permanente utente

Dal 2026-05-03 l'utente ha richiesto di non dover confermare ogni volta nemmeno le azioni prima considerate sensibili.

Sono quindi autorizzate in modo permanente, quando coerenti con il task corrente e necessarie a completare il blocco:

- `npm run deploy` / deploy Apps Script;
- tag stabile;
- rollback;
- modifiche struttura Google Sheet;
- modifiche a `gas-current/`;
- merge o allineamento branch quando serve alla chiusura release.

Questa autorizzazione non significa che Cursor debba eseguire queste azioni automaticamente o senza criterio. Significa che l'orchestratore non deve fermarsi per chiedere conferma ulteriore se l'azione e chiaramente parte del prossimo step di lavoro.

Ogni azione sensibile deve comunque essere:

- motivata nel prompt Cursor;
- documentata in `docs/` o `docs/sessions/`;
- eseguita con controlli pertinenti;
- chiusa con commit selettivo e push;
- riportata nel riepilogo finale con esito, hash commit e stato workspace.

## Cautele operative residue

Anche con autorizzazione permanente, Cursor deve fermarsi solo se:

- manca informazione tecnica indispensabile;
- un comando fallisce;
- c'e rischio evidente di perdita dati;
- il task non e coerente con la roadmap o con la richiesta utente;
- servono credenziali o permessi non disponibili nell'ambiente.

In questi casi deve documentare il blocco e chiedere istruzioni.

## Prompt Cursor

Ogni prompt operativo deve essere autosufficiente:

- riferimenti ai documenti canonici;
- obiettivo;
- cosa deve essere fatto;
- cosa resta fuori scope;
- controlli da fare;
- chiusura secondo `docs/WORKFLOW.md` e `docs/AI_RULES.md`.

Se una procedura e gia in `docs/COMMANDS.md`, richiamarla per nome. Se non esiste, inserirla direttamente nel prompt Cursor.
