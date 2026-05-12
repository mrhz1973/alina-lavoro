# Alina Lavoro — Workflow operativo (orchestratore / implementatore)

Obiettivo: ridurre il copia/incolla manuale e mantenere sempre GitHub come fonte di verita condivisa.

## Avanzamento senza conferme inutili (regola globale)

Riferimento canonico: `docs/ORCHESTRATOR_RULES.md` — **PRIORITÀ 0A**.

- I task **docs-only determinati** **non richiedono** nuova autorizzazione utente.
- Se il task è già in roadmap o conseguenza diretta del task precedente, l'orchestratore **genera direttamente** il prompt implementatore senza chiedere «vuoi?», «procedo?», «autorizzi?».
- L'implementatore deve **eseguire e chiudere** secondo workflow (sezioni sotto), senza chiedere conferme aggiuntive all'utente.
- Il **gate manuale** resta obbligatorio **solo** per: runtime, VPS runtime, n8n runtime, modifiche app Alina, deploy Apps Script, tag, rollback, API key, login, GitHub Actions, costi nuovi, runner automatico, dati sensibili/credenziali, test fisico reale.
- **GitHub** resta fonte di verità.
- Il ciclo si chiude con **commit/push** e successivo **`aggio`** o auto-aggio per verifica, **non** con richieste «vuoi procedere?».
- La modalità passo-passo (PRIORITÀ 0) resta obbligatoria solo quando l'utente sta operando manualmente su n8n/VPS/browser/terminale/Apps Script.

## Ruoli

- **Utente**: parla con l'orchestratore e con Cursor quando serve, ma non deve gestire normalmente i comandi terminale.
- **Orchestratore**: questa chat di coordinamento. Quando riceve `aggio`, legge GitHub e documenti per ricostruire lo stato reale.
- **Implementatore**: Cursor / Agent. Esegue i comandi terminale, modifica file, aggiorna documenti, fa commit e push.
- **GitHub**: memoria condivisa e **unica fonte di verità che l'orchestratore può leggere** (non il filesystem locale di Cursor). Deve essere aggiornato dall'implementatore a fine blocco, anche se l'utente non scrive esplicitamente `finito`.

## Passo passo e passi manuali (vincolo)

- **Nessun passaggio al passo successivo** (nuovo prompt, export, commit di chiusura, documentazione di completamento) finché il **passo corrente** non è **concluso** e, se richiesto, **confermato** dall’utente.
- Per procedure **n8n**, **VPS**, **browser**, **test visivi** o altre azioni **manuali**: **un solo step** per messaggio o blocco; **attesa** dell’esito o conferma; poi lo step successivo.
- **GitHub** resta fonte di verità per stato **versionato**, ma **non sostituisce** la conferma dell’utente quando il passo è **manuale e visivo** (es. esito run in n8n, schermata clasp): l’orchestratore non deve trattare un push come prova che l’umano ha già validato il passo in UI, salvo che l’utente lo dichiari.

Riferimento normativo: `docs/ORCHESTRATOR_RULES.md` (**PRIORITÀ 0**), `docs/automation/README.md` (disciplina n8n).

## Prima di lavorare (implementatore)

All'inizio di un blocco sul branch operativo (**`main`**):

```bash
git checkout main
git pull origin main
npm run aggio
```

Poi leggere i documenti pertinenti (`PROJECT_STATE`, `CHECKPOINT`, `roadmap`, `STREAMLINED_WORKFLOW`, ecc.).

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
- legge `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md`, `docs/roadmap.md`, `docs/AI_RULES.md`, `docs/STREAMLINED_WORKFLOW.md` e `docs/WORKFLOW.md` se utili;
- verifica **`main`**, **tag stabili** e (solo se serve audit storico) eventuale branch **`dev`** legacy;
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
- fare `clasp push` senza richiesta coerente col task;
- fare deploy senza che il blocco lo preveda (`docs/STREAMLINED_WORKFLOW.md` + istruzioni nel prompt);
- prescrivere merge **`dev` → `main`** nel flusso normale (**`dev`** è legacy/inattivo).

## Relazione con branch e release

- Branch operativo unico: **`main`** (sviluppi, fix, doc, release).
- **`dev`:** legacy, **non** usato per nuovi lavori; può restare sul remoto allineato a `main` senza ruolo operativo.
- Produzione reale: **Apps Script** (deployment corrente documentato in `docs/PROJECT_STATE.md` / sessioni).
- **Tag stabili** su `main` (es. **`v1.8.1-stable`**) sono il principale meccanismo di **rollback** e di ancoraggio release; tag storici (`v1.8.0-stable`, `v1.6.2-stable`, `v1.5-stable`) restano disponibili.
- Dopo una release o micro-release importante: aggiornare documentazione, eventualmente **`gas-current/`** come snapshot del deploy, creare **tag stabile** quando richiesto dal blocco.
