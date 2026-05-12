# Task — Runner Alternatives No-API Decision

## Metadata

- ID: 0124-runner-alternatives-no-api-decision
- Project: Alina Lavoro
- Type: runner-decision-docs-only
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no
- Runtime: no
- Manual gate: required before any future runtime, VPS, n8n, login, API key, runner, GitHub Actions, Cursor CLI, Codex CLI or Claude CLI execution

## Scope del Task (Docs-Only)

**Questo task è SOLO decisionale/documentale.** La sua presenza in queue NON autorizza:

- ❌ runner automatico
- ❌ API key (di nessun provider)
- ❌ login Claude
- ❌ uso Claude CLI
- ❌ uso Codex CLI
- ❌ uso Cursor CLI
- ❌ modifiche n8n (runtime o workflow)
- ❌ modifiche VPS
- ❌ GitHub Actions
- ❌ deploy/tag/rollback

Serve a decidere la prossima direzione Fase 3A dopo il blocco del login Claude Code CLI su VPS headless (task 0123).

## Output Documentale Richiesto

Il task futuro (dopo gate esplicito separato) deve produrre:

1. **docs/automation/runner-alternatives-no-api-decision.md** — documento decisionale con confronto alternative, raccomandazione Fase 3A e gate futuri
2. **docs/sessions/2026-05-12-runner-alternatives-no-api-decision.md** (o sessione datata equivalente) — log sessione
3. **docs/tasks/done/0124-runner-alternatives-no-api-decision.md** — done marker

## 1. Contesto

### Stato Automazione

- **Fase 2 watcher/polling MVP:** completata (task 0115+0116+0117)
- **Fase 3 runner:** in valutazione
- **Task 0118:** decision gate Fase 3 approvate (runner documentale, scope docs-only, gate manuali permanenti)
- **Task 0119+0120:** preflight VPS read-only completato
- **Task 0121:** Node.js v18.19.1 + npm 9.2.0 installati
- **Task 0122:** Claude Code CLI 2.1.139 installata su VPS
- **Task 0123:** login/subscription su VPS headless **bloccato** — Claude CLI richiede `/login` interattivo non compatibile con headless

### Presupposti Operativi

- **Nessuna API key manuale** come presupposto operativo (requisito utente)
- **Nessun runtime** finché non c'è nuova decisione/gate
- **Runner automatico non attivo** e non autorizzato
- **App Alina V1.9.2** stabile e fuori scope

### Implementatori Attuali

- **Cursor:** temporaneamente sospeso fino al reset (~10 giorni)
- **Claude Code:** implementatore principale supervisionato
- **Windsurf/Cascade:** implementatore di riserva supervisionato

## 2. Obiettivo Decisionale

Scegliere la prossima strada Fase 3A senza API key manuali, mantenendo:

- runner automatico non attivo
- nessun runtime finché non c'è nuova decisione/gate
- app Alina V1.9.2 stabile e non toccata
- n8n runtime non modificato

## 3. Alternative da Confrontare

### A. Claude Code Locale Supervisionato

- **Descrizione:** usare Claude Code sul computer dell'utente, non come runner VPS
- **Vantaggi:**
  - già strumento principale dell'utente
  - sessione autenticata già esistente
  - nessuna modifica VPS necessaria
  - nessuna API key richiesta (usa subscription locale)
- **Limiti:**
  - non automatico, richiede supervisione
  - dipende da macchina locale accesa
  - dipende da sessione Claude Pro locale
- **Rischi:**
  - limiti Claude Pro (quote, token)
  - sessione locale può scadere
  - non integrabile con n8n come runner headless
- **Prerequisiti:** nessuno (già disponibile)
- **Gate futuri:** nessun gate runtime richiesto — uso supervisionato corrente

### B. Windsurf/Cascade Supervisionato

- **Descrizione:** usare Windsurf come implementatore di riserva supervisionato
- **Vantaggi:**
  - disponibile durante blocchi/reset di altri strumenti
  - autenticato localmente
  - integrato nell'IDE operativo
- **Limiti:**
  - non runner headless n8n
  - interazione manuale richiesta
  - non integrabile come runner automatico
- **Rischi:**
  - trial/limiti account
  - dipende da sessione IDE locale
- **Prerequisiti:** sessione Windsurf attiva
- **Gate futuri:** nessun gate runtime — uso supervisionato corrente

### C. Cursor CLI (dopo reset Cursor)

- **Descrizione:** valutare Cursor CLI quando Cursor torna disponibile (~10 giorni)
- **Vantaggi:**
  - più promettente per modalità headless/agent CLI
  - supporto agent mode documentato
  - integrazione con workflow task-based già testata
- **Limiti:**
  - ora non disponibile (Cursor sospeso)
  - richiede verifica autenticazione headless
  - costo/limiti account da verificare
- **Rischi:**
  - autenticazione subscription su VPS da verificare
  - sicurezza credenziali su VPS
  - possibile stesso blocco di Claude CLI (login interattivo)
- **Prerequisiti:** reset Cursor + task separato di verifica
- **Gate futuri:** task separato post-reset per preflight; ulteriore gate per installazione/setup su VPS

### D. Codex CLI / ChatGPT Plus

- **Descrizione:** valutare Codex CLI come alternativa no-API-key manuale, se login subscription supporta workflow utile
- **Vantaggi:**
  - coerente con ChatGPT Plus (già usato dall'utente)
  - potenziale autenticazione via subscription
- **Limiti:**
  - da verificare documentazione ufficiale
  - supporto headless da confermare
  - workflow integrabile con n8n da verificare
- **Rischi:**
  - autenticazione locale/browser
  - gestione credenziali
  - possibile stesso blocco headless di Claude CLI
  - limiti/costi subscription
- **Prerequisiti:** task di verifica documentale separato prima di qualsiasi installazione
- **Gate futuri:** task preflight solo documentale; poi eventuale gate installazione; poi eventuale gate setup subscription

### E. VPS Runner con Claude Code (solo se cambia presupposto)

- **Descrizione:** possibile solo se in futuro si accetta una delle due strade
- **Condizioni necessarie (alternative):**
  1. login interattivo manuale gestito in modo sicuro (una tantum via tunnel/browser controllato)
  2. API key dedicata (attualmente vietata dal presupposto)
- **Stato attuale:** **non raccomandato e non autorizzato**
- **Rischi:**
  - se login interattivo: gestione sessione lungo termine, rinnovo token
  - se API key: costo, sicurezza credenziali, vietato da presupposto
- **Prerequisiti:** cambio esplicito presupposto operativo dell'utente
- **Gate futuri:** nuovo gate esplicito utente + task separati per ciascuna strada

### F. Restare in Modalità Manuale-Supervisionata

- **Descrizione:** n8n genera prompt/sessioni, ChatGPT orchestra, Claude Code/Windsurf eseguono manualmente
- **Vantaggi:**
  - massimo controllo
  - nessuna modifica VPS/runtime
  - nessuna API key richiesta
  - allineato con workflow corrente funzionante
  - lifecycle n8n già validato (task 0115+0116)
- **Limiti:**
  - meno automazione
  - richiede presenza utente/orchestratore
- **Rischi:**
  - minimi (è il flusso già validato)
- **Prerequisiti:** nessuno
- **Gate futuri:** nessuno — stato corrente

## 4. Criteri di Valutazione

Ogni alternativa deve essere valutata sui seguenti criteri:

1. **No API key manuale** — rispetta il presupposto operativo?
2. **Sicurezza credential** — come gestisce credenziali/token/sessioni?
3. **Compatibilità headless** — funziona su VPS senza browser/TTY?
4. **Compatibilità con n8n** — integrabile con workflow esistenti?
5. **Costo/limiti** — quote, token, costi mensili?
6. **Controllo umano** — livello di supervisione richiesto
7. **Facilità rollback** — quanto è semplice tornare indietro
8. **Isolamento da app Alina** — non deve toccare V1.9.2
9. **Maturità documentazione ufficiale** — supporto documentato vendor
10. **Rischio di modifiche indesiderate** — probabilità di azioni fuori scope

## 5. Raccomandazione Attesa

Il documento decisionale deve proporre una raccomandazione chiara. Raccomandazione iniziale probabile (da confermare/rifinire nel task futuro):

- **Breve termine:** restare su runner supervisionato/manuale (opzione F)
- **Uso corrente:** Claude Code locale (A) + Windsurf/Cascade (B) come riserva
- **Rinvio:** Cursor CLI (C) al reset Cursor (~10 giorni) con task preflight separato
- **Valutazione:** Codex CLI (D) solo dopo verifica documentale con task separato
- **Non proseguire:** Claude Code CLI VPS headless (E) senza cambio presupposti espliciti

La raccomandazione deve essere **documentata, non eseguita**.

## 6. Gate Futuri

**Ogni alternativa operativa deve richiedere task separato e autorizzazione esplicita dell'orchestratore:**

- Opzione A+B+F: uso corrente supervisionato, nessun gate runtime
- Opzione C: task preflight Cursor CLI post-reset (gate separato)
- Opzione D: task verifica documentale Codex CLI (gate separato), poi eventuale task installazione (gate separato)
- Opzione E: cambio presupposto esplicito utente richiesto + task separati per ogni strada

**Nessun runtime autorizzato da 0124. Nessun runner automatico autorizzato da 0124.**

## 7. Done Criteria Futuri

Il task 0124 sarà considerato completato solo quando:

- ✅ Documento decisione creato (`docs/automation/runner-alternatives-no-api-decision.md`)
- ✅ Raccomandazione Fase 3A esplicitata
- ✅ Rischi e gate futuri documentati per ciascuna alternativa
- ✅ Nessuna modifica runtime (VPS, n8n, app)
- ✅ Done marker creato
- ✅ Memoria GitHub aggiornata (PROJECT_STATE.md + CHECKPOINT.md)
- ✅ Commit selettivo e push eseguiti
- ✅ Nessuna API key configurata
- ✅ Nessun CLI eseguito (Claude/Cursor/Codex)
- ✅ Nessun runner automatico attivato

## Allowed Paths (futura esecuzione)

- docs/automation/runner-alternatives-no-api-decision.md
- docs/sessions/2026-05-12-runner-alternatives-no-api-decision.md
- docs/tasks/done/0124-runner-alternatives-no-api-decision.md
- docs/PROJECT_STATE.md
- docs/CHECKPOINT.md

## Forbidden Paths (sempre)

- src/**
- gas-current/**
- .gas/**
- appsscript.json
- package.json
- .clasp.json
- .github/workflows/**
- export JSON n8n non redatti
- file con credenziali, token, chiavi, OAuth material, sessioni locali o URL raw sensibili

## Note Operative

- Questo task è puramente decisionale/documentale
- Nessuna azione runtime deve essere eseguita in questo step
- Ogni alternativa operativa richiederà gate manuale separato
- App Alina V1.9.2 rimane stabile e non toccata
- n8n runtime resta fuori scope
- Runner automatico resta fuori scope
- Cursor sospeso fino al reset (~10 giorni)
- Claude Code implementatore principale supervisionato
- Windsurf/Cascade implementatore di riserva supervisionato
- Presupposto no-API-key prioritario

---
**Task creato — Decisione runner alternatives no-API in attesa di gate manuale per esecuzione documentale**
