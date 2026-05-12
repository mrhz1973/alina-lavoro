# Task — Runner Market Options & Low-Cost API Research

## Metadata

- ID: 0126-runner-market-options-low-cost-api-research
- Project: Alina Lavoro
- Type: runner-market-research-docs-only
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no
- Runtime: no
- Manual gate: required before any future runtime, installazione, login, API key, VPS, n8n, GitHub Actions, deploy, tag, rollback o runner automatico

## Scope del Task (Docs-Only)

**Questo task è SOLO una ricerca e valutazione documentale.** La sua presenza in queue NON autorizza:

- ❌ runtime di nessun tipo
- ❌ installazione di nessun tool, CLI, SDK, modello
- ❌ esecuzione CLI (Claude, Cursor, Codex, altri)
- ❌ login a nessun servizio
- ❌ configurazione API key (di nessun provider)
- ❌ modifiche VPS
- ❌ modifiche n8n (runtime o workflow)
- ❌ GitHub Actions
- ❌ runner automatico
- ❌ modifiche app Alina
- ❌ deploy / tag / rollback
- ❌ documentazione di token, credenziali, sessioni, OAuth material, URL sensibili

## Contesto e Documenti di Partenza

Il task nasce dall'evoluzione delle decisioni:

- **Task 0124 completato:** decisione Fase 3A no-API — modalità manuale-supervisionata come breve termine; Claude Code CLI VPS non raccomandato; Cursor CLI rinviato al reset
- **Task 0125 completato:** Codex CLI feasibility check — Codex CLI non raccomandato per runner VPS no-API-key nel breve termine; possibile come uso locale supervisionato ma non prioritario

Obiettivo di 0126: espandere l'analisi a soluzioni di mercato più ampie, includendo scenari zero-API, API minime a basso costo e API low-cost/provider alternativi per dati non critici.

**Documenti di contesto obbligatori per l'esecuzione futura:**

| Documento | Percorso |
|-----------|----------|
| Decisione runner alternatives | `docs/automation/runner-alternatives-no-api-decision.md` |
| Feasibility check Codex CLI | `docs/automation/codex-cli-feasibility-check.md` |
| Design Fase 3 | `docs/automation/runner-phase3-design.md` |
| Gate decision Fase 3 | `docs/automation/runner-phase3-gate-decision.md` |
| VPS preflight setup | `docs/automation/vps-runner-setup-preflight.md` |
| VPS read-only check | `docs/automation/vps-runner-read-only-check.md` |
| n8n watcher runner MVP | `docs/automation/n8n-watcher-runner-mvp-design.md` |

## Scope della Ricerca Futura

Il documento decisionale futuro dovrà valutare le seguenti categorie di soluzioni:

### 1. Soluzioni Zero-API / Massima Sicurezza

1.1. **Claude Code locale supervisionato** — stato attuale, implementatore principale
1.2. **Windsurf/Cascade supervisionato** — riserva attuale
1.3. **Cursor CLI post-reset** — da valutare al reset (~10 giorni)
1.4. **Codex CLI locale** — già valutato in 0125; non prioritario ma tecnicamente possibile
1.5. **Claude Code CLI VPS** — solo se cambia presupposto (login interattivo sicuro o API key accettata)

### 2. GitHub Actions

2.1. Supporto per runner documentale automatizzato
2.2. Costi/quote GitHub Actions
2.3. Rischi di accesso al codebase
2.4. Integrazione con n8n watcher

### 3. n8n + LLM API

3.1. n8n HTTP Request nodo verso API LLM esterna
3.2. Costo stimato per task documentale tipico
3.3. Separazione dati sensibili/non sensibili
3.4. Rischi di invio dati al provider

### 4. Servizi Cloud Agentici

4.1. OpenAI Assistants API / Responses API
4.2. Anthropic API (Claude via API)
4.3. Google Gemini API
4.4. Servizi agentici managed (Devin, SWE-agent, altri)
4.5. Costi, quote, lock-in, reversibilità

### 5. Self-Hosted Open-Source Models

5.1. Ollama + modelli locali (Mistral, Llama, Qwen, ecc.)
5.2. Possibilità di runner VPS con modello self-hosted
5.3. Requisiti hardware, costi VPS, qualità output
5.4. Compatibilità con workflow n8n

### 6. API Economiche / Low-Cost

6.1. Provider con pricing inferiore a OpenAI/Anthropic
6.2. Livello di qualità vs task documentale
6.3. Rischi privacy/security per dati non sensibili
6.4. Verifica policy dati del provider

### 7. API Cinesi / Provider Non Occidentali (solo dati non critici)

7.1. DeepSeek API
7.2. Qwen API (Alibaba)
7.3. Moonshot / Kimi API
7.4. ZhipuAI / ChatGLM API
7.5. Altri provider non occidentali

**Restrizione critica per questa categoria:**
Le API cinesi o di provider non occidentali possono essere valutate **solo** per:
- metadata task non sensibili (ID, tipo, stato, data)
- classificazione task (topic, categoria, priorità)
- parsing campi strutturati
- boilerplate documentale
- trasformazione prompt (riformattazione)
- sintesi non sensibile
- generazione bozze documentali generiche

**Mai** per:
- codice completo o frammenti di codice proprietario
- repository completo o parti rilevanti
- credenziali, token, chiavi, API key
- dati personali (qualsiasi tipo)
- log sensibili o output di esecuzione
- prompt con contesto operativo completo
- dati soggetti a normative (GDPR, ecc.)

Output sempre revisionato manualmente prima di qualsiasi esecuzione.

### 8. Architetture Ibride

8.1. Planner economico low-cost + executor sicuro supervisionato
8.2. Classificazione metadata con LLM economico + elaborazione locale
8.3. Generazione bozze prompt con LLM economico + revisione umana
8.4. Separazione esplicita tra pipeline dati sensibili e non sensibili

## Output da Produrre (solo alla futura esecuzione con gate separato)

1. **docs/automation/runner-market-options-low-cost-api-research.md** — documento di ricerca completo
2. **docs/sessions/2026-05-12-runner-market-options-low-cost-api-research.md** (o sessione datata equivalente)
3. **docs/tasks/done/0126-runner-market-options-low-cost-api-research.md** — done marker
4. **docs/PROJECT_STATE.md** (aggiornamento)
5. **docs/CHECKPOINT.md** (aggiornamento)

## Criteri di Valutazione per Ogni Soluzione

| Criterio | Descrizione |
|----------|-------------|
| Fattibilità tecnica | Funziona nel contesto Alina Lavoro? |
| Requisito API key | Sì / No / Opzionale |
| Compatibilità headless | VPS senza browser? |
| Costo stimato | Per task documentale tipico |
| Token stimati | Input+output per task tipico |
| Rischio privacy/security | Dati esposti al provider? |
| Rischio modifiche indesiderate | Può toccare codebase? |
| Integrazione con n8n | Richiedibile da n8n watcher? |
| Capacità commit/push | Può eseguire git? |
| Controllo umano | Supervisione richiesta? |
| Maturità documentazione | Doc ufficiale stabile? |
| Rischio lock-in | Dipendenza da provider? |
| Reversibilità | Facile da sostituire? |
| Raccomandazione | Usare / Evitare / Verificare meglio |

## Architetture da Progettare

**A. Zero API / Massima Sicurezza**
- Tutti gli implementatori locali/supervisionati
- n8n solo watcher/tracker
- Nessun dato inviato a provider esterni

**B. API Minima e Dati Non Sensibili**
- LLM economico solo per metadata/classificazione
- Executor locale per tutto il resto
- Revisione umana obbligatoria prima di commit

**C. Runner VPS Semi-Automatico con Gate Umano**
- n8n watcher + gate manuale prima di ogni esecuzione
- Implementatore remoto con accesso controllato

**D. Runner Automatico Futuro Protetto**
- Architettura per eventuale automazione futura
- Token budget e cost cap
- Approval modes e sandbox
- Solo dopo serie di gate manuali progressivi

**E. Planner Economico Low-Cost + Executor Sicuro Supervisionato**
- LLM economico per pianificazione/classificazione
- Claude Code o Codex per esecuzione supervisionata
- Separazione esplicita dati sensibili/non sensibili

**F. Modalità Manuale-Supervisionata Consolidata**
- Runbook dettagliato per Claude Code + Windsurf + Cursor
- Ottimizzazione del flusso corrente senza automazione

## Raccomandazione Finale Richiesta

Il documento futuro deve includere:

1. **Breve termine:** cosa fare subito (prossima settimana)
2. **Prima prova tecnica:** cosa testare per primo, con quale tool, su quale dato
3. **Da evitare:** cosa non fare nel breve termine
4. **Micro-task successivo:** quale task 0127+ proporre
5. **Prove tecniche:** quali esperimenti fare solo dopo autorizzazione esplicita

## Gate Futuri

**Ogni passo oltre la valutazione documentale richiede task separato e gate manuale esplicito:**

| Step | Tipo | Gate |
|------|------|------|
| Valutazione documentale (questo task) | docs-only | Esecuzione 0126 con gate manuale |
| Test API economica su metadata non sensibili | runtime-gated | Task separato + gate esplicito utente |
| Installazione tool/SDK | runtime-gated | Task separato + gate esplicito utente |
| Primo run runner semi-automatico | runtime-gated | Task separato + gate esplicito utente |
| Runner automatico | runtime-gated | Task separato + gate esplicito utente + serie di test progressivi |

## Allowed Paths (futura esecuzione)

- docs/automation/runner-market-options-low-cost-api-research.md
- docs/sessions/2026-05-12-runner-market-options-low-cost-api-research.md
- docs/tasks/done/0126-runner-market-options-low-cost-api-research.md
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
- docs/tasks/queue/**
- docs/tasks/processing/**
- docs/tasks/failed/**
- export JSON n8n non redatti
- file con credenziali, token, chiavi, OAuth material, sessioni locali o URL raw sensibili

## Note Operative

- Nessuna azione runtime in questo step
- Valutazione basata solo su documentazione ufficiale dei provider
- Nessuna credenziale, token, URL sensibile documentato
- App Alina V1.9.2 fuori scope
- n8n runtime fuori scope
- Runner automatico fuori scope

---
**Task creato — Runner market options & low-cost API research in attesa di gate manuale per esecuzione**
