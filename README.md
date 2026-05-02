# alina-lavoro

Web app basata su **Google Apps Script**, **Google Sheet** e frontend **HTML/CSS/JavaScript** in `src/`. Cursor è l’implementor operativo; branch di lavoro **`dev`**, branch stabile **`main`**, tag di rollback **`v1.5-stable`**.

## Documentazione progetto

| File | Contenuto |
|------|-----------|
| [docs/roadmap.md](docs/roadmap.md) | Roadmap e priorità |
| [docs/PROJECT_STATE.md](docs/PROJECT_STATE.md) | Stato tecnico di riferimento (stack, branch, directory) |
| [docs/CHECKPOINT.md](docs/CHECKPOINT.md) | Ultimo checkpoint di ripartenza (aggiornato da `checkpoint`) |
| [docs/AI_RULES.md](docs/AI_RULES.md) | Regole permanenti per AI/Cursor |
| [docs/WORKFLOW.md](docs/WORKFLOW.md) | Workflow **aggio** / **checkpoint** / **finito** |
| [docs/COMMANDS.md](docs/COMMANDS.md) | Comandi copiabili (git, npm, controlli, rollback concettuale) |
| [docs/sessions/](docs/sessions/) | Riepiloghi sessione generati da `checkpoint` |

## Comandi operativi

- **`npm run aggio`** — Solo lettura: branch, `git status`, log recenti, tag `v*`, presenza documenti, `diff --stat` se ci sono modifiche. Non modifica nulla.
- **`npm run checkpoint`** — Crea/aggiorna `docs/CHECKPOINT.md` e un file datato in `docs/sessions/`. Nessun commit/push/deploy.
- **`npm run finito -- "Messaggio commit" file1 file2 ...`** — Chiude un blocco: controlli, `git add` solo dei file elencati, commit, push. Richiede messaggio e lista file esplicita. **Non** esegue clasp/deploy. Se tra i file c’è `src/frontend/Index.html`, esegue controlli aggiuntivi (vedi [docs/WORKFLOW.md](docs/WORKFLOW.md)).
- **`npm run push`** — Sincronizza `src` → `.gas` e `clasp push` (solo quando serve davvero).
- **`npm run deploy`** — Sync + push + deploy clasp: usare **solo dopo conferma** esplicita.

Script sorgente in `tools/aggio.sh`, `tools/checkpoint.sh`, `tools/finito.sh`.
