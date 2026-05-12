# Sessione — Rimozione regole operative obsolete (2026-05-12)

## Titolo

Rimozione regole obsolete su `aggio` obbligatorio e istruzioni fuori prompt come routine.

## Contesto

Windsurf aveva iniziato a implementare questo task docs-only ma si è bloccato per limite token giornaliero dopo aver aggiunto le nuove sezioni (PRIORITÀ 0A, regole niente-conferme-superflue) senza rimuovere quelle obsolete. Claude Code ha recuperato lo stato delle modifiche parziali e completato l'intervento.

## Problema

Le seguenti regole operative in `docs/ORCHESTRATOR_RULES.md` erano diventate obsolete dopo l'introduzione di PRIORITÀ 0A e del design Auto-Aggio:

1. **«Regola richiesta esplicita di `aggio`»** — imponeva all'orchestratore di scrivere fuori dal blocco prompt «Quando Cursor finisce, scrivi: aggio» come istruzione routinaria all'utente.
2. **«Regola sequenza prompt / aggio»** — bloccava la preparazione di un nuovo prompt operativo se l'utente non aveva ancora scritto `aggio` dopo l'ultimo prompt, anche quando GitHub era verificabile dall'orchestratore.
3. **«Regola output prompt Cursor»** — nel suo template di output includeva «Quando Cursor finisce, scrivi: aggio» come riga standard fuori dal blocco, consolidando il pattern come routine.

Queste regole:
- usavano l'utente come ponte manuale obbligatorio tra implementatore e orchestratore;
- imponevano una micro-interazione non necessaria («scrivi aggio») per task standard;
- bloccavano il flusso su regola procedurale invece di lasciare all'orchestratore la verifica autonoma su GitHub.

## Obiettivo

Rendere canonica la disciplina:
- `aggio` = comando **volontario/fallback** dell'utente;
- l'orchestratore legge GitHub direttamente quando GitHub è aggiornato (Auto-Aggio livello immediato);
- nessuna istruzione fuori blocco all'utente salvo decisione reale o gate reale non eseguibile dall'implementatore;
- formato output verso implementatore: riga MODALITÀ + unico blocco prompt.

## File modificati

| File | Tipo intervento |
|------|----------------|
| `docs/ORCHESTRATOR_RULES.md` | Rimozione sezioni obsolete; riscrittura regole output e aggio |
| `docs/WORKFLOW.md` | Aggiunta sezione «Avanzamento senza conferme inutili» (da Windsurf) |
| `docs/AI_RULES.md` | Aggiunta sezione «Regola implementatori — Niente conferme superflue» (da Windsurf) |
| `docs/COMMANDS.md` | Aggiunta nota operativa niente conferme superflue (da Windsurf) |
| `docs/automation/runbook.md` | Aggiunta sezione disciplina low-touch (da Windsurf) |
| `docs/automation/permissions.md` | Aggiunta politica conferme docs-only (da Windsurf) |
| `docs/tasks/templates/cursor-prompt-default.md` | `AGENT MODE.` → `MODALITÀ: AGENT / IMPLEMENTAZIONE`; vincolo no-istruzioni-fuori-blocco |
| `docs/PROJECT_STATE.md` | Aggiornamento intestazione con questo task |
| `docs/CHECKPOINT.md` | Aggiornamento ripartenza con questo task |
| `docs/sessions/2026-05-12-remove-obsolete-operational-rules.md` | Questo file |

## Regole obsolete rimosse

### Da `docs/ORCHESTRATOR_RULES.md`

1. **Sezione «Regola richiesta esplicita di `aggio`»** (intera sezione rimossa) — prescriveva di scrivere «Quando Cursor finisce, scrivi: aggio» fuori dal blocco come routine standard.

2. **Sezione «Regola sequenza prompt / aggio»** (intera sezione rimossa) — bloccava la preparazione di un nuovo prompt se mancava `aggio`, con risposta tipo «Prima verifico il risultato del prompt precedente: quando Claude Code/Cursor finisce, scrivi aggio.»

3. **Riferimenti interni nelle sezioni PRIORITÀ 0 e Principio principale** — aggiornati per non prescrivere più `aggio` fuori blocco come routine.

4. **Sezione «Regola output prompt Cursor»** (riscritta come «Regola output verso implementatore») — rimosso il template con «Quando Cursor finisce, scrivi: aggio» come riga standard fuori blocco.

## Nuova regola canonica

### «Regola `aggio` — comando volontario/fallback»

`aggio` è un comando **volontario** dell'utente per chiedere all'orchestratore di rileggere GitHub. Non è una routine imposta. L'orchestratore può verificare GitHub autonomamente quando il repo è aggiornato (Auto-Aggio livello immediato).

### «Regola output verso implementatore»

Formato:
1. Riga MODALITÀ (dentro o fuori il blocco prompt);
2. Unico blocco prompt implementatore con tutto il necessario;
3. Fuori dal blocco: **solo** decisione reale o gate reale non eseguibile dall'implementatore.

Non è consentito fuori dal blocco:
- «Quando finisce scrivi: aggio» come routine;
- riepiloghi di validazione;
- elenchi di file già nel blocco;
- vincoli già nel blocco;
- ripetizioni o parafrasi.

### «MODALITÀ: AGENT / IMPLEMENTAZIONE»

Sostituisce «AGENT MODE.» nel template `cursor-prompt-default.md`.

## Stato recupero modifiche parziali Windsurf

**Presenti.** Windsurf aveva completato le aggiunte (PRIORITÀ 0A, sezione AI_RULES, sezione WORKFLOW, sezione COMMANDS, sezione runbook, sezione permissions, vincoli Mandatory constraints nel template) ma non aveva rimosso le sezioni obsolete da ORCHESTRATOR_RULES.md né creato la sessione né aggiornato PROJECT_STATE/CHECKPOINT con questo task. Tutte le modifiche Windsurf sono state preservate e completate.

## Controlli eseguiti

- `git diff --check`: nessun whitespace error.
- `git status --short`: 9 file modificati su branch `main`.
- Ricerche pattern obsoleti:
  - `grep "Regola richiesta esplicita"` → nessun match in sezioni normative (residua solo in header storico).
  - `grep "Regola sequenza prompt / aggio"` → rimossa.
  - `grep "scrivi: aggio"` → nessun match normativo.
  - `grep "Quando Cursor finisce"` → nessun match normativo.
  - `grep "Prima verifico il risultato"` → rimossa.

## Conferma scope

- Nessun runtime modificato.
- Nessuna installazione CLI esterna.
- Nessun login, API key, VPS, n8n runtime, GitHub Actions.
- Nessun runner automatico.
- Nessun deploy, tag, rollback.
- Nessuna modifica app Alina (`src/**`, `gas-current/**`).
- App **V1.9.2** stabile su `main`, tag `v1.9.2-stable`, deploy `@24`.

## Rischi residui

Nessuno. Modifiche docs-only con scope circoscritto a regole operative.

## Prossimo step documentale

**0131 — n8n Decision Packet Generator Design**: progettare in `docs/automation/` il workflow n8n che genera automaticamente un Decision Packet strutturato (13 campi canonici) quando il sistema rileva una decisione da prendere — secondo roadmap confermata.
