# Alina Lavoro — Regole permanenti per AI / Cursor

Queste regole integrano i vincoli del repository e riducono ambiguità operative.

## Prima di agire

1. **Non inventare stato** del progetto, del deploy o del branch: verificare con `git status`, `git branch`, documenti in `docs/` e, se utile, `npm run aggio`.
2. **Leggere** `docs/roadmap.md`, `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md` quando esistono e sono pertinenti al task.
3. **Branch operativo:** lavorare su **`dev`** salvo istruzioni esplicite diverse.
4. **`gas-current/`** è **solo lettura**: mai modificare, mai usarlo come sorgente di patch.
5. **Modifiche applicative** solo sotto **`src/`** (backend `src/backend/`, frontend `src/frontend/`), salvo workflow/documentazione/tool esplicitamente richiesti.

## Modalità di lavoro

- Per modifiche **importanti o ambigue**: **Plan** prima di **Agent**, con piano approvato dall’utente.
- **Deploy** Apps Script / aggiornamento deployment **solo** dopo conferma esplicita dell’utente.
- **Niente `git add .`**: usare elenco file selettivo o `npm run finito` con lista esplicita.
- **Commit piccoli e mirati**; messaggi chiari in italiano o inglese coerente con il repo.

## Qualità e output

- Preferire **piccoli blocchi** di modifiche revisionabili.
- **Output finale** (fine turno o fine task) includere quando possibile:
  - file modificati;
  - test eseguiti o da eseguire manualmente;
  - errori o rischi noti;
  - **prossimo passo** suggerito (una riga).

## Comandi sensibili

- **`npm run push`** / **`clasp push`**: solo dopo verifica locale e consenso utente sullo stato.
- **Rollback**: riferimento al tag `v1.5-stable` come ancora di sicurezza concettuale; non eseguire reset/merge automatici senza ordine esplicito.
