# alina-lavoro

Web app personale per la registrazione delle ore di lavoro di Alina.

Stack: **Google Apps Script** (backend) · **Google Sheet** (database) · **HTML/CSS/JavaScript** (frontend in `src/`).

**Versione corrente:** V2.0.1 stabile (`@28`, tag `v2.0.1-stable`). Branch operativo: **`main`** (`dev` legacy/inattivo).

## Uso app

- Aprire l'app tramite il link Web App **`/exec`** (non il Google Sheet).
- La versione è visibile in **Impostazioni** → sotto «Salva».
- Il **quick resume** richiede che il codice di accesso sia stato salvato e la cache locale sia valida.
- Il banner Google «Questa applicazione è stata creata da un utente di Google Apps Script» è una limitazione della piattaforma GAS, non un bug dell'app — chiudibile con X.

## Documentazione progetto

| File | Contenuto |
|------|-----------|
| [docs/LLMS.md](docs/LLMS.md) | Entry point agenti AI — stato corrente, task, navigation |
| [docs/roadmap.md](docs/roadmap.md) | Roadmap e priorità |
| [docs/AI_RULES.md](docs/AI_RULES.md) | Regole permanenti per AI/Cursor |
| [docs/WORKFLOW.md](docs/WORKFLOW.md) | Workflow **aggio** / **checkpoint** / **finito** |
| [docs/COMMANDS.md](docs/COMMANDS.md) | Comandi copiabili (git, npm, controlli, rollback) |
| [docs/PROJECT_STATE.md](docs/PROJECT_STATE.md) | Stato tecnico fallback/audit |
| [docs/CHECKPOINT.md](docs/CHECKPOINT.md) | Ultimo checkpoint di ripartenza |
| [docs/sessions/](docs/sessions/) | Riepiloghi sessione |

## Comandi operativi

- **`npm run aggio`** — Solo lettura: branch, `git status`, log recenti, tag `v*`. Non modifica nulla.
- **`npm run checkpoint`** — Crea/aggiorna `docs/CHECKPOINT.md` e un file datato in `docs/sessions/`. Nessun commit/push/deploy.
- **`npm run finito -- "Messaggio commit" file1 file2 ...`** — Chiude un blocco: `git add` solo dei file elencati, commit, push. Non esegue clasp/deploy.
- **`npm run push`** — Sincronizza `src` → `.gas` e `clasp push` (solo quando serve).
- **`npm run deploy`** — Sync + push + deploy clasp: usare **solo dopo conferma esplicita**.

Script sorgente in `tools/aggio.sh`, `tools/checkpoint.sh`, `tools/finito.sh`.
