# Sessione — Registrazione debito tecnico compattazione PROJECT_STATE (2026-05-12)

## Contesto

Dopo la pulizia delle regole operative obsolete, Claude Code ha segnalato un warning di performance:

```
Large docs\PROJECT_STATE.md will impact performance (47.8k chars > 40.0k).
```

Il file `docs/PROJECT_STATE.md` ha accumulato mesi di storico task inline nel blocco `Ultimo aggiornamento`, raggiungendo una dimensione che degrada le prestazioni degli implementatori (Claude Code, Windsurf/Cascade, Cursor) a ogni sessione.

## Motivo del debito tecnico

- `docs/PROJECT_STATE.md` contiene l'intero storico dei task completati (0100–0129+) come testo continuo nella prima riga.
- Questo era funzionale nelle fasi iniziali ma non scala.
- Oltre 40 k caratteri: warning attivo in Claude Code; impatto probabile su Windsurf e Cursor.
- Il file viene caricato a ogni sessione come contesto obbligatorio — il peso si cumula.

## Cosa NON fare ora

- Non compattare `PROJECT_STATE.md` in questo task.
- Non spostare lo storico ora.
- Non creare `docs/history/PROJECT_LOG.md` ora.
- Non toccare app, runtime, n8n runtime, VPS, deploy, tag, rollback.

## Cosa fare nel task futuro (docs-only)

Quando il workstream watcher/runner/low-touch è in una fase stabile, eseguire un task docs-only dedicato:

1. Creare `docs/history/PROJECT_LOG.md` (o struttura equivalente) con lo storico completo dei task.
2. Ridurre `docs/PROJECT_STATE.md` a stato corrente sintetico: versione app, branch, deploy corrente, prossimo passo, rischi aperti — senza storico inline.
3. Ridurre `docs/CHECKPOINT.md` a ripartenza breve: puntatore a PROJECT_STATE + prossimo micro-step + nota rischi/debiti.
4. Verificare che nessuna informazione storica vada persa (il log completo vive in `history/`).
5. Rileggere i documenti di ripartenza (ORCHESTRATOR_RULES.md, AI_RULES.md, WORKFLOW.md) per aggiornare eventuali riferimenti.

Timing raccomandato: appena dopo la chiusura di un task del workstream watcher/runner, senza interferire con task operativi in corso.

## Registrazione

Il debito è stato registrato in:
- `docs/CHECKPOINT.md` — sezione «Debiti tecnici documentali»
- `docs/PROJECT_STATE.md` — riga in «Rischi aperti»

## Conferma scope

- Nessun runtime modificato.
- Nessuna app, deploy, tag, rollback.
- Nessun VPS, n8n runtime, GitHub Actions, runner automatico.
- Nessuna CLI esterna, login, API key.
- Solo registrazione documentale del debito.
