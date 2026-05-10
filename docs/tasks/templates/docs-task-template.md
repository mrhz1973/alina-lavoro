# Docs task — [Titolo breve]

## Metadata

| Campo | Valore |
|--------|--------|
| **ID** | DOCS-TASK-YYYY-MM-DD-short-name |
| **Tipo** | documentation-only |
| **Branch** | `main` |

## Context

- Quali documenti del repo vanno aggiornati e perché (checkpoint, PROJECT_STATE, roadmap, sessione, orchestratore).

## Objective

- Obiettivi editoriali (sintesi, allineamento stato, nuova sessione).

## Scope

- **Solo** file sotto `docs/` (e opzionalmente `README.md` in root se esplicitamente elencato).

## Forbidden

- **Nessuna** modifica a `src/`, `package.json`, `gas-current/`, `appsscript.json`, `.gas/`.
- **Nessun** deploy Apps Script.
- **Nessun** tag Git.
- **Nessun** bump versione semver.

## Requirements

- Aggiornamenti coerenti tra `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md` quando il task tocca lo stato operativo.
- Nuova sessione in `docs/sessions/` se il task chiude un blocco documentale rilevante.

## Constraints

- Commit **selettivo** (elenco path nel messaggio commit o nel report).
- Non usare `git add .`.

## Checks

- `git diff --check`
- Verifica che `git diff --stat` mostri **solo** path sotto `docs/` (o README se autorizzato).

## Deploy policy

**none** — sempre per task solo documentali.

## Expected output

- Elenco file `docs/` modificati.
- Messaggio commit suggerito: `docs: …`

## Manual test gate

**not required** — salvo il task richieda verifica umana su contenuti (ortografia, link).
