# Sessione — Human Decision Inbox Design

**Data:** 2026-05-12  
**Task:** 0129-human-decision-inbox-design  
**Tipo:** low-touch-loop-docs-only  
**Modalità:** AGENT / IMPLEMENTAZIONE  
**Eseguito da:** Windsurf/Cascade (implementatore di riserva/supervisionato)  
**Stato:** completato

## Task Eseguito

`docs/tasks/queue/0129-human-decision-inbox-design.md` — design della Human Decision Inbox come luogo unico file-based per le decisioni vere che richiedono utente, integrata con Decision Packet Format e Auto-Aggio.

## Riferimento al Completamento 0130

- Task 0130 completato: `docs/tasks/done/0130-auto-aggio-design.md`
- Documento Auto-Aggio: `docs/automation/auto-aggio-design.md`
- INBOX è il complemento di Auto-Aggio: Auto-Aggio decide quando notificare; INBOX definisce dove vive la decisione pendente.

## Nota sul Prompt n8n

- Sessione automation n8n: `docs/sessions/automation-0129-human-decision-inbox-design.md`
- Prompt processing: `docs/tasks/processing/0129-human-decision-inbox-design-cursor-prompt.md`
- Errore 500 apparente sul nodo "Create Cursor prompt file" ma file processing presente su GitHub
- Prompt n8n incompleto nelle sezioni Objective/Requirements/Expected output: utilizzato solo come **evidenza automation**, NON come istruzione operativa.

## File Creati / Modificati

1. **docs/automation/human-decision-inbox-design.md** (nuovo)
2. **docs/sessions/2026-05-12-human-decision-inbox-design.md** (questo file)
3. **docs/tasks/done/0129-human-decision-inbox-design.md** (nuovo, done marker)
4. **docs/PROJECT_STATE.md** (aggiornato — task 0129 completato)
5. **docs/CHECKPOINT.md** (aggiornato — task 0129 completato)

## Sintesi del Design

**Human Decision Inbox (INBOX)** = artefatto file-based che contiene **solo** decisioni vere richieste all'utente, in formato standardizzato basato su Decision Packet Format.

**Struttura raccomandata MVP:** **Opzione A** — singolo file `docs/INBOX.md` con quattro sezioni stato: Pending / Decided / Deferred / Superseded.

**Template elemento INBOX:** ingloba i 13 campi del Decision Packet Format canonico + 8 campi INBOX-specifici (`inbox_status`, `created_at`, `source_task`, `source_document`, `response`, `decided_at`, `superseded_by`, `archive_policy`). Campo `kind` resta in posizione 2 come da DP Format.

**Schema stato:** pending / decided / deferred / superseded, con transizioni definite e archive policy per stato.

**Risposta utente:** convenzione `D-NNNN-X = N` (numero opzione) o `D-NNNN-X = defer / skip / retry`. Canale primario MVP: chat con ChatGPT; canale futuro runtime-gated: commit dedicato letto da n8n.

**Anti-rumore (9 regole):** solo DP veri, niente log generici / status / sessioni / task standard / messaggi "tutto OK" / duplicati / frammenti.

**Compatibilità:**
- Decision Packet Format: 13 campi invarianti + 8 campi INBOX aggiuntivi
- Auto-Aggio: accodamento DP rilevati, notifica transizione pending→decided
- n8n: design solo documentale, runtime futuro gated

**Gate manuali permanenti preservati:** app/deploy/tag/rollback/VPS/n8n runtime/API key/login/GitHub Actions/costi nuovi/runner automatico/test fisico/dati personali.

**Sicurezza:** mai inserire token, credenziali, OAuth material, URL raw con token, download_url sensibili. Pattern accettato per credenziali: "serve configurare credenziale X" (no valori).

## Alternative Valutate

| Opzione | Struttura | Raccomandazione |
|---|---|---|
| **A — file unico** | `docs/INBOX.md` con 4 sezioni | ✅ **MVP raccomandato** |
| **B — directory** | `docs/inbox/D-NNNN-X.md` + indice | Migrazione futura se volume cresce |
| **C — subdirectory automation** | `docs/automation/inbox/pending/` + `archive/` | Non raccomandato (overhead senza benefici) |
| D | Non emersa | — |

## MVP Proposto

**Docs-first, zero runtime, tre fasi:**

1. **Ora (task 0129):** solo design documentale. `docs/INBOX.md` NON creato.
2. **Task futuro mixed/runtime-gated:** creazione `docs/INBOX.md` con template iniziale, eventuale migrazione D-0128-A come esempio.
3. **Task runtime-gated successivo:** integrazione n8n (lettura, accodamento automatico, notifica).

**Riduzione tempo "cercare cosa decidere":** da ~30s/decisione (multi-fonte) a ~5s/decisione (un file).

## Decision Packet Prodotto

**Nessuno.**

**Motivazione:** la scelta Opzione A è univocamente determinata dai vincoli attuali (volume basso, lettura unica preferita, complessità minima). Emettere un DP per chiedere all'utente significherebbe creare proprio la micro-interazione che INBOX vuole eliminare. Se in futuro emerge necessità di migrazione (volume crescente, multi-utente, versionamento singolo DP), si emetterà DP dedicato secondo Decision Packet Format.

## Ordine Roadmap (confermato)

1. **0131** — n8n Decision Packet Generator Design
2. **0132** — Ollama Classifier/Planner Feasibility
3. **0133** — Cursor/Implementer Bridge Design

Eventuali cambi d'ordine: solo via Decision Packet (kind: `meta` o `automation`), non commenti liberi.

## Controlli Eseguiti

- `git checkout main` + `git pull origin main` ✅
- `git diff --check` ✅
- `git diff --stat` ✅
- `git status --short` ✅
- Verifica allowed paths ✅
- Verifica forbidden paths non toccati ✅
- Verifica `docs/INBOX.md` NON creato ✅

## Conferme di Non-Interferenza

- ✅ Nessun runtime eseguito
- ✅ Nessuna installazione
- ✅ Nessuna esecuzione CLI
- ✅ Nessun login
- ✅ Nessuna API key configurata
- ✅ Nessuna modifica VPS
- ✅ Nessuna modifica n8n runtime
- ✅ Nessuna GitHub Actions
- ✅ Nessun runner automatico attivato
- ✅ App Alina V1.9.2 non toccata
- ✅ Nessun deploy / tag / rollback
- ✅ docs/ORCHESTRATOR_RULES.md non modificato
- ✅ Task in queue non modificato
- ✅ Prompt in processing non modificato
- ✅ **docs/INBOX.md NON creato** (riservato a task futuro mixed/runtime-gated)
- ✅ Nessuna directory inbox creata

---
**Sessione completata — Human Decision Inbox Design definito; foundation low-touch loop estesa (0127 + 0128 + 0130 + 0129)**
