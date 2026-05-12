# Task — Codex CLI Feasibility Check

## Metadata

- ID: 0125-codex-cli-feasibility-check
- Project: Alina Lavoro
- Type: runner-feasibility-docs-only
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no
- Runtime: no
- Manual gate: required before any future runtime, installazione, login, API key, Codex CLI, VPS, n8n, GitHub Actions, deploy, tag, rollback o runner automatico

## Scope del Task (Docs-Only)

**Questo task è SOLO una valutazione documentale.** La sua presenza in queue NON autorizza:

- ❌ installazione Codex CLI (su VPS o altrove)
- ❌ esecuzione Codex CLI
- ❌ login ChatGPT / OpenAI
- ❌ configurazione API key (di nessun provider)
- ❌ modifiche VPS
- ❌ modifiche n8n (runtime o workflow)
- ❌ GitHub Actions
- ❌ runner automatico
- ❌ modifiche app Alina
- ❌ deploy / tag / rollback

Scopo: valutare solo documentalmente se Codex CLI / ChatGPT Plus può essere una alternativa futura no-API-key manuale per Fase 3A runner documentale, sulla base della documentazione ufficiale OpenAI disponibile, dopo la decisione documentata in task 0124.

## Contesto

- **Task 0124 completato:** decisione Fase 3A no-API documentata
- **Raccomandazione 0124:** breve termine modalità manuale-supervisionata; Codex CLI valutabile con task documentale separato
- **Presupposto operativo:** no API key manuali (requisito utente)
- **Stato corrente:** runner automatico non attivo; VPS non modificato; n8n solo queue reader

## Output da Produrre (solo alla futura esecuzione con gate separato)

1. **docs/automation/codex-cli-feasibility-check.md** — documento valutazione documentale
2. **docs/sessions/2026-05-12-codex-cli-feasibility-check.md** (o sessione datata equivalente) — log sessione
3. **docs/tasks/done/0125-codex-cli-feasibility-check.md** — done marker
4. **docs/PROJECT_STATE.md** (aggiornamento)
5. **docs/CHECKPOINT.md** (aggiornamento)

## Criteri da Valutare (docs-only, no runtime)

Il documento decisionale futuro dovrà ricercare e valutare esclusivamente sulla base di documentazione ufficiale OpenAI:

1. **Documentazione ufficiale Codex CLI disponibile** — esiste documentazione pubblica stabile su Codex CLI?
2. **Autenticazione con ChatGPT Plus/subscription senza API key manuale** — è supportata ufficialmente in modalità CLI?
3. **Compatibilità headless/VPS** — Codex CLI supporta ambienti headless senza browser/TTY?
4. **Necessità browser/login interattivo** — il flusso di autenticazione richiede browser (come Claude CLI)?
5. **Gestione credential/token/sessioni** — come vengono gestite le credenziali? Scadono? Richiedono rinnovo?
6. **Compatibilità con n8n come runner futuro** — è integrabile come runner richiamato da n8n?
7. **Limiti/costi/quote** — quote API/subscription, costi per utilizzo, rate limiting?
8. **Isolamento da app Alina V1.9.2** — uso Codex CLI può interferire con il codebase?
9. **Rischi di modifiche indesiderate** — probabilità di azioni fuori scope su repo?
10. **Possibilità di dry-run/sandbox/manual-supervised** — esiste modalità supervisionata sicura?
11. **Confronto con opzioni già decise in 0124** — come si posiziona rispetto ad A/B/C/E/F?

## Raccomandazione Attesa

Il documento futuro deve:

- **Non autorizzare runtime** — solo valutazione documentale
- Se la documentazione ufficiale **non conferma chiaramente** login subscription headless sicuro senza API key manuale: **raccomandare di non procedere** con Codex CLI
- Se la documentazione conferma supporto headless sicuro senza API key: proporre task separato runtime-gated per preflight installazione
- Eventuali passi runtime devono essere **task separati con gate manuali separati**

## Gate Futuri

**Ogni passo oltre la valutazione documentale richiede task separato e gate manuale esplicito:**

| Step | Tipo | Gate |
|------|------|------|
| Valutazione documentale (questo task) | docs-only | Esecuzione 0125 con gate manuale |
| Installazione Codex CLI su VPS | runtime-gated | Task separato + gate esplicito utente |
| Setup autenticazione | runtime-gated | Task separato + gate esplicito utente |
| Primo run supervisionato | runtime-gated | Task separato + gate esplicito utente |

**Nessun runtime autorizzato da 0125. Nessun runner automatico autorizzato da 0125.**

## Allowed Paths (futura esecuzione)

- docs/automation/codex-cli-feasibility-check.md
- docs/sessions/2026-05-12-codex-cli-feasibility-check.md
- docs/tasks/done/0125-codex-cli-feasibility-check.md
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

- Questo task è esclusivamente documentale/valutativo
- Nessuna azione runtime deve essere eseguita in questo step
- La valutazione si basa solo su documentazione ufficiale OpenAI pubblica
- Nessuna credenziale, nessun token, nessun URL sensibile deve essere documentato
- App Alina V1.9.2 rimane stabile e fuori scope
- n8n runtime resta fuori scope
- Runner automatico resta fuori scope
- Presupposto no-API-key prioritario

---
**Task creato — Codex CLI feasibility check in attesa di gate manuale per esecuzione documentale**
