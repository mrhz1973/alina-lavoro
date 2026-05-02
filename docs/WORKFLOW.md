# Alina Lavoro — Workflow operativo (orchestratore / implementatore)

Obiettivo: ridurre il copia/incolla manuale e mantenere sempre GitHub come fonte di verita condivisa.

## Ruoli

- **Utente**: parla con l'orchestratore e con Cursor quando serve, ma non deve gestire normalmente i comandi terminale.
- **Orchestratore**: questa chat di coordinamento. Quando riceve `aggio`, legge GitHub e documenti per ricostruire lo stato reale.
- **Implementatore**: Cursor / Agent. Esegue i comandi terminale, modifica file, aggiorna documenti, fa commit e push.
- **GitHub**: memoria condivisa. Deve essere aggiornato dall'implementatore a fine blocco, anche se l'utente non scrive esplicitamente `finito`.

## Regola principale

L'implementatore deve sempre aggiornare GitHub quando conclude un blocco operativo o una sessione.

Questo e obbligatorio perche l'orchestratore non legge il filesystem locale di Cursor: legge GitHub. Se Cursor non aggiorna GitHub, l'orchestratore resta fuori dal loop.

A fine blocco l'implementatore deve:

1. aggiornare documenti di stato/checkpoint se lo stato e cambiato;
2. eseguire controlli minimi;
3. fare commit selettivo;
4. fare push su GitHub;
5. riportare hash commit;
6. riportare `git status --short` finale.

## Comandi convenzionali

| Comando conversazionale | Chi lo riceve | Effetto |
|-------------------------|---------------|---------|
| `aggio` | Orchestratore | L'orchestratore legge GitHub e fa il punto reale. Nessun comando locale richiesto all'utente. |
| `checkpoint` | Orchestratore o Cursor | Se serve, Cursor genera checkpoint, commit e push; l'orchestratore lo usa per ripartenza. |
| `finito` | Normalmente Cursor | Cursor chiude la sessione/blocco con documenti, commit, push e stato pulito. |

## Comandi npm disponibili per Cursor

| Comando npm | Uso |
|-------------|-----|
| `npm run aggio` | Fotografia locale sola lettura del repository. |
| `npm run checkpoint` | Genera `docs/CHECKPOINT.md` e una sessione in `docs/sessions/`. |
| `npm run finito -- "Messaggio" file1 file2 ...` | Commit e push selettivo dei file indicati. |

## `aggio` per l'orchestratore

Quando l'utente scrive `aggio` in chat orchestratore:

- l'orchestratore non chiede terminale;
- legge GitHub;
- legge `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md`, `docs/roadmap.md`, `docs/AI_RULES.md` e `docs/WORKFLOW.md` se utili;
- confronta `dev`, `main` e tag disponibili;
- segnala eventuali incongruenze;
- propone il prossimo passo.

`aggio` non crea checkpoint automaticamente.

## `checkpoint`

Checkpoint serve solo quando:

- il contesto sta diventando lungo;
- si chiude una fase importante;
- si vuole garantire ripartenza in nuova chat;
- l'orchestratore lo richiede esplicitamente.

Se Cursor esegue `checkpoint`, deve normalmente chiuderlo con commit e push, altrimenti GitHub non viene aggiornato.

## `finito`

`finito` e il comando di chiusura blocco/sessione usato soprattutto da Cursor.

Deve:

1. verificare stato reale;
2. aggiornare `docs/PROJECT_STATE.md` e/o `docs/CHECKPOINT.md` se necessario;
3. creare riepilogo in `docs/sessions/` se utile;
4. eseguire controlli minimi;
5. fare commit selettivo;
6. fare push;
7. riportare hash commit;
8. confermare workspace pulito.

Non deve:

- usare `git add .`;
- fare `clasp push` senza richiesta;
- fare deploy senza conferma;
- fare merge verso `main` senza ordine separato.

## Relazione con branch e release

- Branch operativo: **`dev`**.
- Branch stabile: **`main`**.
- Rollback concettuale: tag **`v1.5-stable`**.
- Merge `dev -> main` solo quando la versione e considerata stabile.
