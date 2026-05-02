# Alina Lavoro — Regole permanenti per AI / Cursor

Queste regole integrano i vincoli del repository e riducono ambiguita operative.

## Ruoli operativi

- **Orchestratore**: la chat di coordinamento. **Non legge il filesystem locale di Cursor**: ricostruisce lo stato da **GitHub** (e da quanto l’utente incolla in chat).
- **Implementatore**: Cursor / Agent. Esegue modifiche, controlli, commit, push e aggiornamento documenti su GitHub.
- **GitHub**: **fonte di verita per l’orchestratore** e memoria condivisa con l’implementatore.
- **Terminale**: normalmente usato dall'implementatore. L'utente non deve essere costretto a eseguire comandi manuali salvo casi eccezionali.

## Prima di agire

0. **Sincronizzarsi con GitHub** prima di un nuovo blocco di lavoro sul branch corrente (di norma `dev`):

   ```bash
   git pull
   npm run aggio
   ```

1. **Non inventare stato** del progetto, del deploy o del branch: verificare con `git status`, `git branch`, documenti in `docs/` e, se utile, `npm run aggio`.
2. **Leggere** `docs/roadmap.md`, `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md` quando esistono e sono pertinenti al task.
3. **Branch operativo:** lavorare su **`dev`** salvo istruzioni esplicite diverse.
4. **`gas-current/`** e **solo lettura**: mai modificare, mai usarlo come sorgente di patch.
5. **Modifiche applicative** solo sotto **`src/`** (backend `src/backend/`, frontend `src/frontend/`), salvo workflow/documentazione/tool esplicitamente richiesti.

## Regola obbligatoria: GitHub sempre aggiornato

L'implementatore deve sempre mantenere GitHub aggiornato a **fine blocco operativo o sessione**, anche quando l'utente **non** scrive esplicitamente `finito`.

Motivo: l'orchestratore **non** legge il workspace locale; se GitHub non è aggiornato, l'orchestratore resta fuori dal loop.

A fine blocco l'implementatore deve **sempre**, in ordine:

1. **Controllare lo stato reale** (locale, prima di documentare e committare):

   ```bash
   git status
   git branch --show-current
   git log --oneline -5
   ```

2. **Aggiornare la documentazione** se lo stato è cambiato: `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md`, e se utile un file in `docs/sessions/YYYY-MM-DD-*.md` (o `npm run checkpoint` se si usa quello schema).

3. **Eseguire i controlli minimi** pertinenti al blocco. Se viene modificato `src/frontend/Index.html`, l'implementatore deve eseguire i **controlli frontend standard** definiti in `docs/COMMANDS.md`, senza chiedere all'utente di lanciarli manualmente.

4. **Commit selettivo** — mai `git add .`; elenco file esplicito o `npm run finito -- "msg" file1 file2 …`.

5. **Push su GitHub** (`git push` sul branch di lavoro, di norma `origin dev`).

6. **Riepilogo finale** in risposta all'utente con:
   - file modificati;
   - test/check eseguiti;
   - errori o rischi residui;
   - **hash** del commit;
   - output di **`git status --short`** finale;
   - **conferma esplicita**: workspace **pulito** oppure **non pulito** (e perche).

Eccezione: durante una fase intermedia non ancora considerata conclusa, l'implementatore può lasciare modifiche locali **solo** se lo dichiara esplicitamente nel riepilogo e non presenta il blocco come chiuso.

## Controlli standard

Quando un prompt Cursor riguarda `src/frontend/Index.html`, l'orchestratore non deve riscrivere ogni volta tutti i comandi shell. Deve invece richiamare questa formula:

> Esegui i controlli frontend standard da `docs/COMMANDS.md`.

L'implementatore deve interpretarla come obbligo di eseguire il blocco canonico in `docs/COMMANDS.md`, cioe almeno:

- `git diff --check`;
- estrazione dello script inline da `src/frontend/Index.html`;
- `node --check` sullo script estratto;
- grep degli operatori moderni da evitare su WebView vecchie;
- verifica delle tab `data-page` della navbar.

Se un comando non e disponibile nell'ambiente, l'implementatore deve usare un equivalente e dichiararlo nel riepilogo finale.

## Modalita di lavoro

- Per modifiche **importanti o ambigue**: **Plan** prima di **Agent**, con piano approvato dall'utente.
- **Deploy** Apps Script / aggiornamento deployment **solo** dopo conferma esplicita dell'utente.
- **Niente `git add .`**: usare elenco file selettivo o `npm run finito` con lista esplicita.
- **Commit piccoli e mirati**; messaggi chiari in italiano o inglese coerente con il repo.

## Qualita e output

- Preferire **piccoli blocchi** di modifiche revisionabili.
- **Output finale** (fine turno o fine task / fine blocco) allineato al punto 6 sopra: file modificati, test/check, errori/rischi, hash commit, `git status --short`, workspace pulito o meno, **prossimo passo** (una riga).

## Comandi sensibili

- **`npm run push`** / **`clasp push`**: solo dopo verifica locale e consenso utente sullo stato.
- **Rollback**: riferimento al tag `v1.5-stable` come ancora di sicurezza concettuale; non eseguire reset/merge automatici senza ordine esplicito.
