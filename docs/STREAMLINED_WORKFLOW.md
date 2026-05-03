# Alina Lavoro — Workflow snello orchestratore

Ultimo aggiornamento: 2026-05-02.

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
- far chiudere Cursor con commit selettivo e push su `dev`.

## Operazioni sensibili

Richiedono conferma esplicita della fase, ma non conferma file per file:

- deploy Apps Script;
- merge `dev -> main`;
- tag stabile;
- rollback;
- modifiche a `gas-current/`;
- modifiche struttura Google Sheet;
- azioni distruttive o difficili da annullare.

Quando l'utente autorizza una fase sensibile, l'orchestratore deve:

1. registrare l'autorizzazione su GitHub se utile;
2. fornire nello stesso turno il prompt Cursor completo;
3. non chiedere ulteriori conferme per documentazione, commit e push collegati a quel blocco.

## Prompt Cursor

Ogni prompt operativo deve essere autosufficiente:

- riferimenti ai documenti canonici;
- obiettivo;
- cosa e autorizzato;
- cosa non e autorizzato;
- controlli da fare;
- chiusura secondo `docs/WORKFLOW.md` e `docs/AI_RULES.md`.

Se una procedura e gia in `docs/COMMANDS.md`, richiamarla per nome. Se non esiste, inserirla direttamente nel prompt Cursor.
