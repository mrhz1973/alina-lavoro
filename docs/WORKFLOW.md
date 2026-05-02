# Alina Lavoro — Workflow operativo (orchestratore / implementatore)

Obiettivo: ridurre il copia/incolla manuale e mantenere sempre GitHub come fonte di verita condivisa.

## Ruoli

- **Utente**: parla con l'orchestratore e con Cursor quando serve, ma non deve gestire normalmente i comandi terminale.
- **Orchestratore**: questa chat di coordinamento. Quando riceve `aggio`, legge GitHub e documenti per ricostruire lo stato reale.
- **Implementatore**: Cursor / Agent. Esegue i comandi terminale, modifica file, aggiorna documenti, fa commit e push.
- **GitHub**: memoria condivisa e **unica fonte di verità che l'orchestratore può leggere** (non il filesystem locale di Cursor). Deve essere aggiornato dall'implementatore a fine blocco, anche se l'utente non scrive esplicitamente `finito`.

## Prima di lavorare (implementatore)

All'inizio di un blocco sul branch operativo (`dev`):

```bash
git pull
npm run aggio
```

Poi leggere i documenti pertinenti (`PROJECT_STATE`, `CHECKPOINT`, `roadmap`, ecc.).

## Regola principale

L'implementatore deve sempre aggiornare GitHub quando conclude un blocco operativo o una sessione.

È obbligatorio perché l'orchestratore non legge il filesystem locale di Cursor: legge GitHub. Se Cursor non aggiorna GitHub, l'orchestratore resta fuori dal loop.

A fine blocco l'implementatore deve, in ordine:

1. **Stato reale:** `git status`, `git branch --show-current`, `git log --oneline -5`.
2. **Documentazione** se lo stato è cambiato: `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md`, eventuale `docs/sessions/YYYY-MM-DD-*.md` (o `npm run checkpoint` se si genera una sessione datata).
3. **Controlli minimi** pertinenti al blocco.
4. **Commit selettivo** — mai `git add .`.
5. **Push** su GitHub.
6. **Riepilogo** con: file modificati; test/check eseguiti; errori o rischi residui; hash commit; `git status --short` finale; dichiarazione **workspace pulito** o **non pulito**.

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

Deve (allineato alla checklist a fine blocco in `docs/AI_RULES.md`):

1. verificare stato reale (`git status`, branch, `git log --oneline -5`);
2. aggiornare `docs/PROJECT_STATE.md` e/o `docs/CHECKPOINT.md` se necessario;
3. creare o aggiornare un file in `docs/sessions/` se utile;
4. eseguire controlli minimi;
5. fare commit selettivo;
6. fare push;
7. riportare hash commit, `git status --short` finale, e se il workspace è pulito o meno.

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
