# Alina Lavoro — Comandi copiabili

Percorsi relativi alla radice del repository. Eseguire da macchina con repo clonato.

## Nota operativa — Niente conferme superflue

Riferimento canonico: `docs/ORCHESTRATOR_RULES.md` — **PRIORITÀ 0A**.

- I comandi conversazionali `aggio`, `checkpoint`, `finito` **non** devono essere usati come scusa per chiedere conferme inutili all'utente.
- Per **task docs-only determinati** (allowed paths chiari, nessun gate sensibile), l'implementatore deve **chiudere con commit selettivo e push**, senza domande «procedo?» o «vai?».
- L'orchestratore verifica l'esito con **`aggio`** o futuro **auto-aggio** (vedi `docs/automation/auto-aggio-design.md`).
- Le conferme esplicite restano obbligatorie solo per gate sensibili (runtime, VPS runtime, n8n runtime, app, deploy, tag, rollback, API key, login, GitHub Actions, costi nuovi, runner automatico, dati sensibili, test fisico reale).

## Orchestratore / aggio locale

Cursor deve scegliere automaticamente il comando corretto in base all'ambiente, senza chiedere all'utente quale usare.

Regola:

- **Mac / Linux / shell con `bash` nel PATH:** usare `npm run aggio`.
- **Windows / PowerShell senza `bash` nel PATH:** usare `npm.cmd run aggio:win`.

Comando standard Mac/Linux:

```bash
npm run aggio
```

Comando Windows consigliato quando `bash` non e nel `PATH`:

```bash
npm.cmd run aggio:win
```

Lo script Windows usa il percorso breve **`C:\\Progra~1\\Git\\bin\\bash.exe`** (equivalente a *Program Files*\\Git, senza spazi così `cmd` non spezza il comando). Se Git è installato altrove, usare manualmente il percorso completo a `bash.exe` con `tools/aggio.sh`.

Nei prompt Cursor, l'orchestratore deve scrivere formule del tipo:

> Esegui `aggio` usando il comando corretto per l'ambiente corrente, come documentato in `docs/COMMANDS.md`.

Cursor deve rilevare l'ambiente dal terminale:

- prompt tipo `PS C:\\...` = Windows / PowerShell → `npm.cmd run aggio:win`;
- shell `bash` / `zsh` / percorso `/Users/...` o Linux = Mac/Linux → `npm run aggio`.

Non chiedere all'utente di scegliere il comando.

## Checkpoint e finito

```bash
npm run checkpoint
```

```bash
npm run finito -- "Messaggio commit descrittivo" percorso/file1.md percorso/file2.sh
```

## Mandatory local preflight

Run before any edit in Claude Code / Windsurf / Cursor sessions. Prevents stale clones, wrong folders, and duplicate task IDs.

```bash
git rev-parse --show-toplevel
git remote -v
git branch --show-current
git status --short
git log --oneline -5
```

- Verify repo is `mrhz1973/alina-lavoro`, branch is `main`. If not: stop and report.
- If dirty tree: **do not pull, reset, stash, or delete**. Run only `git diff --stat` and `git diff --check`, then stop and report.
- If clean: `git pull origin main`, then `git status --short` and `git log --oneline -5`. Report before edits.

Reference: `docs/tasks/templates/implementer-standard.md` § "Local clone preflight".

## Stato progetto (manuale)

```bash
git branch --show-current
git status --short
git log --oneline -5
git tag --list "v*"
git rev-parse --short HEAD
```

## Diff

```bash
git diff
git diff --stat
git diff -- src/frontend/Index.html
git diff -- src/backend/Code.gs
```

## Controlli frontend standard (`src/frontend/Index.html`)

Questi sono i controlli canonici da eseguire ogni volta che viene modificato `src/frontend/Index.html`.

Nei prompt Cursor l'orchestratore puo scrivere semplicemente:

> Esegui i controlli frontend standard da `docs/COMMANDS.md`.

L'implementatore deve allora eseguire almeno questo blocco, senza chiedere all'utente di lanciarlo manualmente.

Spazi finali / diff sporchi:

```bash
git diff --check
```

Estrazione script inline e controllo sintassi JavaScript (richiede `node`):

```bash
python3 -c "
import re
s=open('src/frontend/Index.html').read()
m=re.search(r'<script>\s*(.*)\s*</script>',s,re.S)
open('/tmp/alina-inline.js','w').write(m.group(1))
"
node --check /tmp/alina-inline.js
```

Operatori moderni da evitare su WebView vecchie (nessun match atteso, salvo commenti o casi motivati):

```bash
grep -E '\?\?|\|\|=|\?\.[^/]' src/frontend/Index.html || true
```

Navbar / tab disponibili:

```bash
grep -o 'data-page="[^"]*"' src/frontend/Index.html | sort -u
```

Se `python3` non e disponibile, usare comando equivalente disponibile nell'ambiente. Se un controllo fallisce o produce match inattesi, l'implementatore deve fermarsi o motivare chiaramente nel riepilogo finale.

## Controlli Apps Script (locale)

Sincronizzazione verso `.gas/` (non push):

```bash
npm run sync
```

Su **Windows**, se `npm run sync` fallisce (`cp` / `mkdir -p` non trovati), la shell predefinita di npm è spesso `cmd`: usare **Git Bash** per `npm run sync`, oppure impostare `npm config set script-shell "C:\\Program Files\\Git\\bin\\bash.exe"`, oppure copiare manualmente in `.gas/` come in `docs/sessions/2026-05-05-v182-arrotondamento-orari-release.md` (blocco PowerShell).

Push verso Google (solo dopo verifica):

```bash
npm run push
```

## Commit selettivo (manuale, senza `git add .`)

```bash
git add docs/WORKFLOW.md tools/aggio.sh
git status --short
git commit -m "docs: descrizione breve"
```

## Push

Branch operativo: **`main`** (`dev` è legacy/inattivo — non usare per nuovi push di lavoro).

```bash
git push origin main
```

## Deploy (solo con conferma)

```bash
npm run deploy
```

Esegue `sync` + `clasp push` + `clasp deploy`. **Non** lanciare in CI o in batch senza consenso.

## Rollback concettuale a `v1.5-stable`

Il tag **`v1.5-stable`** è ancoraggio di sicurezza. Esempi **non automatici** — valutare sempre backup Sheet/Apps Script:

```bash
git fetch origin
git log -1 --oneline v1.5-stable
# Opzione A: ispezionare file a quel tag
git show v1.5-stable:src/backend/Code.gs | head -20

# Opzione B: branch di prova dal tag (solo se consapevoli)
# git checkout -b recovery/v1.5 v1.5-stable
```

Non eseguire `reset --hard` su branch condivisi senza coordinamento.

## Tag stabile `v1.6.2-stable`

Punta al commit di stabilizzazione V1.6.2 su `main` (documentazione + allineamento release). Ispezione / rollback concettuale (non automatico):

```bash
git fetch origin
git log -1 --oneline v1.6.2-stable
git show v1.6.2-stable:src/backend/Code.gs | head -20
```

## Tag stabile `v1.8.1-stable` (release corrente al 2026-05-03)

Micro-release issue **#3** (versione in UI), deploy documentato **`@9`**:

```bash
git fetch origin
git log -1 --oneline v1.8.1-stable
git show v1.8.1-stable:src/frontend/Index.html | grep -n APP_VERSION | head -5
```

Per rollback concettuale verso la release precedente: **`v1.8.0-stable`** (deploy storico `@8`).
