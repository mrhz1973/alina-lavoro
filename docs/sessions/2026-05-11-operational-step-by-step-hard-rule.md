# Sessione — regola operativa passo passo (vincolo assoluto)

## Data

2026-05-11

## Motivo della modifica

Rendere **prioritaria e permanente** nel repository la disciplina **passo passo** quando sono coinvolte azioni umane su strumenti esterni (n8n, VPS, browser, Cursor, terminale, GitHub, Google Apps Script, ecc.), così orchestratore e implementatore non anticipano passi mentre un’operazione è ancora aperta o non confermata.

## Errore operativo rilevato

- Durante una procedura **manuale n8n**, è stato proposto il **passo successivo** prima che il **passo corrente** fosse **chiuso e confermato** dall’utente.
- È stata introdotta una versione **diagnostica temporanea** del **Code** `Filter first queued task` rischiando di restare come versione “finale” senza un ciclo esplicito di ripristino, test e conferma.

## Regola introdotta (sintesi)

- **PRIORITÀ 0** in `docs/ORCHESTRATOR_RULES.md`: vincolo assoluto **passo passo**; divieto di anticipare export/commit/documentazione/passi successivi se il passo corrente non è completato o l’utente sta verificando; chiusura esplicita del **diagnostico temporaneo** prima di proseguire; chiarimento che **«non chiedere vai»** non autorizza a **saltare** passi manuali.
- `docs/AI_RULES.md`: regole per **Cursor/Agent** (blocchi piccoli, niente anticipazione, stato passi manuali, diagnostica temporanea, riepilogo passi manuali aperti).
- `docs/WORKFLOW.md`: nessun passo successivo finché il corrente non è concluso; GitHub non sostituisce la conferma su passi **visivi** (n8n, browser).
- `docs/automation/README.md` + `runbook.md`: **`n8n manual run discipline`** (nodo/test alla volta, export solo con workflow pulito e verificato, non toccare workflow validati fuori target; **non** modificare **`TEST - Mark Alina task done copy-only generalized`** mentre il target è lo skip `done` del **queue reader**).
- `queue-reader.md` / `queue-reader-ai-friendly-template.md`: richiami alla stessa disciplina.

## File aggiornati

- `docs/ORCHESTRATOR_RULES.md`
- `docs/AI_RULES.md`
- `docs/WORKFLOW.md`
- `docs/automation/README.md`
- `docs/automation/runbook.md`
- `docs/automation/n8n-workflows/queue-reader.md`
- `docs/automation/n8n-workflows/queue-reader-ai-friendly-template.md`
- `docs/sessions/2026-05-11-operational-step-by-step-hard-rule.md` (questo file)

## Cosa NON è stato modificato

- Codice applicativo Alina (`src/`, `Index.html`, `Code.gs`).
- `gas-current/`, `.gas/`, deploy, tag, rollback.
- Nessun **export JSON** n8n aggiunto o modificato nel repo.

## Prossimo passo operativo (singolo)

Tornare al workflow n8n **`TEST - GitHub list Alina task queue`**, **confermare** che il nodo **`Filter first queued task`** è in **stato finale pulito** (nessun codice diagnostico residuo), **verificare** l’output atteso con un run controllato; **solo dopo** conferma utente, procedere eventualmente a **export** (se necessario) e aggiornamento documentazione di validazione in `docs/sessions/`.

## Riferimenti

- [`docs/ORCHESTRATOR_RULES.md`](../ORCHESTRATOR_RULES.md)
- [`docs/automation/README.md`](../automation/README.md)
