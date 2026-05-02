# Alina Lavoro — Comandi copiabili

Percorsi relativi alla radice del repository. Eseguire da macchina con repo clonato.

## Orchestratore (consigliato)

```bash
npm run aggio
```

```bash
npm run checkpoint
```

```bash
npm run finito -- "Messaggio commit descrittivo" percorso/file1.md percorso/file2.sh
```

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

## Controlli frontend (`Index.html`)

Estrazione script e sintassi (richiede `node`):

```bash
python3 -c "
import re
s=open('src/frontend/Index.html').read()
m=re.search(r'<script>\s*(.*)\s*</script>',s,re.S)
open('/tmp/alina-inline.js','w').write(m.group(1))
"
node --check /tmp/alina-inline.js
```

Operatori moderni da evitare su WebView vecchie (nessun match atteso):

```bash
grep -E '\?\?|\|\|=|\?\.[^/]' src/frontend/Index.html || true
```

Navbar (4 tab):

```bash
grep -o 'data-page="[^"]*"' src/frontend/Index.html | sort -u
```

## Controlli Apps Script (locale)

Sincronizzazione verso `.gas/` (non push):

```bash
npm run sync
```

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

```bash
git push origin dev
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
