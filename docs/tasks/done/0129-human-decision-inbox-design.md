# Task — Human Decision Inbox Design

## Metadata

- ID: 0129-human-decision-inbox-design
- Project: Alina Lavoro
- Type: low-touch-loop-docs-only
- Priority: high
- Status: **done**
- Created by: Orchestrator
- Completed by: Windsurf/Cascade (implementatore di riserva/supervisionato)
- Modalità: AGENT / IMPLEMENTAZIONE
- Deploy: no
- Runtime: no

## Riferimenti

- **Task queue:** `docs/tasks/queue/0129-human-decision-inbox-design.md`
- **Sessione automation n8n (evidenza):** `docs/sessions/automation-0129-human-decision-inbox-design.md`
- **Prompt n8n (evidenza automation, incompleto; nodo "Create Cursor prompt file" errore 500 apparente ma file presente):** `docs/tasks/processing/0129-human-decision-inbox-design-cursor-prompt.md`
- **Documento design:** `docs/automation/human-decision-inbox-design.md`
- **Sessione manuale:** `docs/sessions/2026-05-12-human-decision-inbox-design.md`
- **Prerequisiti:**
  - `docs/tasks/done/0127-decision-packet-format.md`
  - `docs/tasks/done/0128-autonomous-low-touch-loop-design.md`
  - `docs/tasks/done/0130-auto-aggio-design.md`

## Sintesi Risultato

**Human Decision Inbox (INBOX)** progettata come luogo unico file-based per le decisioni vere richieste all'utente. Complemento di Auto-Aggio: Auto-Aggio decide quando notificare; INBOX definisce dove vive la decisione pendente.

**Componenti documentati:**
- Architettura file-based con 3 alternative valutate (A/B/C) + tabella comparativa
- Template Markdown elemento INBOX (13 campi DP Format + 8 campi INBOX-specifici)
- Schema 4 stati: pending / decided / deferred / superseded, con transizioni e archive policy
- Convenzione risposta utente (`D-NNNN-X = N` / `defer` / `skip` / `retry`)
- 9 regole anti-rumore
- Compatibilità con Decision Packet Format, Auto-Aggio, n8n futuro
- Gate manuali permanenti preservati
- Sicurezza: regole esplicite anti-dati-sensibili
- Stima micro-interazioni eliminate
- MVP 3 fasi (design ora / creazione file futuro / integrazione n8n futuro)
- Tabella task futuri runtime/mixed con gate richiesto
- 9 rischi con mitigazioni

## Struttura Raccomandata

**Opzione A — singolo file `docs/INBOX.md`** con 4 sezioni stato:
- `## Pending` — decisioni da rispondere (più recenti in cima)
- `## Decided` — decisioni risposte
- `## Deferred` — rimandate esplicitamente
- `## Superseded` — sostituite da DP successivo

**Motivazione:** lettura immediata da ChatGPT, no scansione directory, commit semplici, nessun rischio file orfani, compatibile con n8n futuro. Opzioni B/C valutate ma non raccomandate per il volume e i lettori attuali.

## MVP Raccomandato

**Docs-first, zero runtime, in tre fasi:**

1. **Ora (task 0129 — questo):** solo design documentale. `docs/INBOX.md` NON creato.
2. **Task futuro mixed/runtime-gated separato:** creazione effettiva `docs/INBOX.md` con template iniziale, eventuale migrazione D-0128-A come primo elemento esempio.
3. **Task runtime-gated successivo:** integrazione n8n (lettura/accodamento automatico/notifica).

**Riduzione tempo "cercare cosa decidere":** da ~30s/decisione (multi-fonte) a ~5s/decisione (un file).

## Decision Packet

**Non emesso.** La scelta Opzione A è univocamente determinata dai vincoli attuali (volume basso, lettura unica preferita, complessità minima). Emettere DP per questa scelta significherebbe creare la micro-interazione che INBOX vuole eliminare. Se in futuro emerge necessità di migrazione, sarà emesso DP dedicato.

## Ordine Roadmap Successivo (confermato)

1. **0131** — n8n Decision Packet Generator Design
2. **0132** — Ollama Classifier/Planner Feasibility
3. **0133** — Cursor/Implementer Bridge Design

**Disciplina:** eventuali cambi d'ordine solo via Decision Packet (kind: `meta` o `automation`), non commenti liberi.

## Conferme di Non-Interferenza

- ✅ **Nessun runtime eseguito**
- ✅ **Nessuna installazione**
- ✅ **Nessuna esecuzione CLI**
- ✅ **Nessun login**
- ✅ **Nessuna API key configurata**
- ✅ **Nessuna modifica VPS**
- ✅ **Nessuna modifica n8n runtime**
- ✅ **Nessuna GitHub Actions**
- ✅ **Nessun runner automatico attivato**
- ✅ **App Alina V1.9.2 non toccata**
- ✅ **Nessun deploy / tag / rollback**
- ✅ **docs/ORCHESTRATOR_RULES.md non modificato**
- ✅ **Task in queue non modificato**
- ✅ **Prompt in processing non modificato**
- ✅ **docs/INBOX.md NON creato** (riservato a task futuro mixed/runtime-gated)
- ✅ **Nessuna directory inbox creata** (`docs/inbox/`, `docs/automation/inbox/` non esistono)

---
**Task 0129 completato — Human Decision Inbox Design definitivo; complemento di Auto-Aggio (0130) nel low-touch loop**
