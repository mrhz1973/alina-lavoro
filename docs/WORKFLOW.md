# Alina Lavoro — Workflow operativo (comandi convenzionali)

Comandi orchestrati da `package.json` e script in `tools/`. Obiettivo: meno copia/incolla manuale, stessi passaggi ripetibili.

| Comando | npm |
|---------|-----|
| Aggiornamento lettura stato | `npm run aggio` |
| Checkpoint sessione | `npm run checkpoint` |
| Chiusura blocco con commit + push | `npm run finito -- "Messaggio" file1 file2 …` |

---

## `aggio` (`npm run aggio`)

**Scopo:** fotografia **sola lettura** del repository: branch, modifiche, ultimi commit, tag, presenza documentazione operativa.

**Legge:** `git`, elenco file in `docs/`, eventuale `git diff --stat` se working tree sporco.

**Modifica:** nessun file.

**Comandi eseguiti:** vedi `tools/aggio.sh` (in sintesi: `git branch`, `git status`, `git log`, `git tag`, `git rev-parse`, verifica esistenza doc).

**Non deve:** modificare file, `git add`, `commit`, `push`, `clasp`.

**Output atteso:** report leggibile in terminale; exit 0 se i comandi git hanno successo.

---

## `checkpoint` (`npm run checkpoint`)

**Scopo:** creare **memoria di ripartenza** per la sessione: file datato in `docs/sessions/` e aggiornamento sintetico di `docs/CHECKPOINT.md`.

**Legge:** stato git (branch, HEAD, ultimo commit, `git status --short`).

**Modifica:** crea `docs/sessions/` se manca; crea `docs/sessions/YYYY-MM-DD-checkpoint.md` (con suffisso orario se il file giornaliero esiste già); riscrive/aggiorna `docs/CHECKPOINT.md`.

**Comandi eseguiti:** vedi `tools/checkpoint.sh`.

**Non deve:** `commit`, `push`, `deploy`, `clasp`.

**Output atteso:** percorso del file sessione creato; sommario in `CHECKPOINT.md`.

---

## `finito` (`npm run finito -- "Messaggio" file1 file2 …`)

**Scopo:** chiudere un **blocco** di lavoro: controlli, `git add` **solo** dei file elencati, `commit`, `push`, riepilogo hash e stato finale.

**Legge:** working tree; per ogni path passato verifica esistenza; se tra i file c’è `src/frontend/Index.html`, esegue controlli frontend aggiuntivi (vedi script).

**Modifica:** solo i file passati esplicitamente (staging + commit); **push** su `origin` del branch corrente.

**Comandi eseguiti:** vedi `tools/finito.sh` (`git diff --check`, controlli opzionali su Index, `git add` selettivo, `git commit`, `git push`).

**Non deve:** `git add .`, `clasp push`, deploy, merge verso `main` senza ordine separato.

**Output atteso:** stat diff, esito controlli, hash commit, `git status --short` finale.

**Uso:**

```bash
npm run finito -- "docs: aggiorna workflow" README.md docs/WORKFLOW.md
```

---

## Relazione con branch e release

- Branch operativo: **`dev`**.
- Branch stabile: **`main`** (merge solo quando stabile).
- Rollback concettuale: tag **`v1.5-stable`** — vedi `docs/COMMANDS.md` per comandi manuali, non automatizzati qui.
