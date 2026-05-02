# Alina Lavoro — Regole permanenti per AI / Cursor

Queste regole integrano i vincoli del repository e riducono ambiguita operative.

## Ruoli operativi

- **Orchestratore**: la chat di coordinamento. Legge GitHub e documenti per ricostruire lo stato reale del progetto.
- **Implementatore**: Cursor / Agent. Esegue modifiche, controlli, commit, push e aggiornamento documenti.
- **GitHub**: fonte di verita condivisa tra orchestratore e implementatore.
- **Terminale**: normalmente usato dall'implementatore. L'utente non deve essere costretto a eseguire comandi manuali salvo casi eccezionali.

## Prima di agire

1. **Non inventare stato** del progetto, del deploy o del branch: verificare con `git status`, `git branch`, documenti in `docs/` e, se utile, `npm run aggio`.
2. **Leggere** `docs/roadmap.md`, `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md` quando esistono e sono pertinenti al task.
3. **Branch operativo:** lavorare su **`dev`** salvo istruzioni esplicite diverse.
4. **`gas-current/`** e **solo lettura**: mai modificare, mai usarlo come sorgente di patch.
5. **Modifiche applicative** solo sotto **`src/`** (backend `src/backend/`, frontend `src/frontend/`), salvo workflow/documentazione/tool esplicitamente richiesti.

## Regola obbligatoria: GitHub sempre aggiornato

L'implementatore deve sempre mantenere GitHub aggiornato, anche quando l'utente non scrive esplicitamente `finito`.

Motivo: l'orchestratore ricostruisce lo stato leggendo GitHub. Se Cursor lavora localmente ma non aggiorna GitHub, l'orchestratore resta fuori dal loop.

A fine blocco operativo l'implementatore deve quindi:

1. aggiornare almeno un documento di stato o checkpoint quando cambia contesto, stato, deploy, test o decisione;
2. fare commit selettivo dei file modificati;
3. fare push su GitHub;
4. riportare hash commit e `git status --short` finale.

Eccezione: durante una fase intermedia di sviluppo non ancora revisionata, l'implementatore puo lasciare modifiche locali solo se lo dichiara esplicitamente e non considera il blocco concluso.

## Modalita di lavoro

- Per modifiche **importanti o ambigue**: **Plan** prima di **Agent**, con piano approvato dall'utente.
- **Deploy** Apps Script / aggiornamento deployment **solo** dopo conferma esplicita dell'utente.
- **Niente `git add .`**: usare elenco file selettivo o `npm run finito` con lista esplicita.
- **Commit piccoli e mirati**; messaggi chiari in italiano o inglese coerente con il repo.

## Qualita e output

- Preferire **piccoli blocchi** di modifiche revisionabili.
- **Output finale** (fine turno o fine task) includere quando possibile:
  - file modificati;
  - test eseguiti o da eseguire manualmente;
  - errori o rischi noti;
  - hash commit e conferma push se il blocco e concluso;
  - **prossimo passo** suggerito (una riga).

## Comandi sensibili

- **`npm run push`** / **`clasp push`**: solo dopo verifica locale e consenso utente sullo stato.
- **Rollback**: riferimento al tag `v1.5-stable` come ancora di sicurezza concettuale; non eseguire reset/merge automatici senza ordine esplicito.
