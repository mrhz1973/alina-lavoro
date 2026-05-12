# Sessione — Runner Market Options & Low-Cost API Research

**Data:** 2026-05-12  
**Task:** 0126-runner-market-options-low-cost-api-research  
**Tipo:** runner-market-research-docs-only  
**Eseguito da:** Windsurf/Cascade (implementatore di riserva/supervisionato)  
**Stato:** completato

## Gate Ricevuto

> "Autorizzo l'esecuzione del task 0126 runner market options low-cost API research, solo docs-only, nessun runtime, nessuna installazione, nessuna esecuzione CLI, nessun login, nessuna API key, nessuna modifica VPS/n8n/app, nessuna GitHub Actions."

## Nota sul Prompt n8n

Il prompt generato da n8n in `docs/tasks/processing/0126-runner-market-options-low-cost-api-research-cursor-prompt.md` è incompleto nelle sezioni Objective/Requirements/Expected output. Utilizzato solo come evidenza automation, NON come istruzione operativa principale.

## Fonti Ufficiali Consultate

Tutte consultate il **2026-05-12**:

| # | Fonte | URL |
|---|-------|-----|
| 1 | OpenAI Codex CLI — Auth | `developers.openai.com/codex/auth` |
| 2 | OpenAI Codex CLI — CLI | `developers.openai.com/codex/cli` |
| 3 | GitHub Actions — Billing | `docs.github.com/billing/managing-billing-for-github-actions/about-billing-for-github-actions` |
| 4 | GitHub Actions — Usage | `docs.github.com/en/actions/concepts/billing-and-usage` |
| 5 | Ollama Docs | `docs.ollama.com/` |
| 6 | Ollama Quickstart | `docs.ollama.com/quickstart` |
| 7 | Ollama FAQ | `docs.ollama.com/faq` |
| 8 | DeepSeek API Pricing | `api-docs.deepseek.com/quick_start/pricing` |
| 9 | Alibaba Cloud Model Studio — Pricing | `alibabacloud.com/help/en/model-studio/model-pricing` |
| 10 | Alibaba Cloud Model Studio — Models | `alibabacloud.com/help/en/model-studio/models` |
| 11 | Moonshot/Kimi Platform | `platform.moonshot.ai/` |
| 12 | ZhipuAI OpenPlatform | `bigmodel.cn/pricing`, `docs.bigmodel.cn/cn/guide/models/text/glm-5.1` |

Nessun URL con token, query string sensibile, OAuth material o credenziali documentato.

## File Creati / Modificati

1. **docs/automation/runner-market-options-low-cost-api-research.md** (nuovo) — documento di ricerca completo (10 sezioni, matrice sintetica 16 righe, 6 architetture A–F, raccomandazione finale, micro-task 0127+ proposti)
2. **docs/sessions/2026-05-12-runner-market-options-low-cost-api-research.md** (questo file)
3. **docs/tasks/done/0126-runner-market-options-low-cost-api-research.md** (nuovo) — done marker
4. **docs/PROJECT_STATE.md** (aggiornato)
5. **docs/CHECKPOINT.md** (aggiornato)

## Sintesi Risultato

**Decisione 0124 confermata e rafforzata.** La ricerca documentale su soluzioni di mercato non identifica alternative concretamente raccomandate nel breve termine. L'architettura manuale-supervisionata (A+F) resta baseline. Si identificano però tre direzioni future concrete:

1. **Cursor CLI post-reset** — implementatore principale più probabile
2. **Ollama locale (architettura E1)** — primo candidato per test zero-API su metadata sintetici
3. **Architettura ibrida planner+executor (E)** — strategia di medio termine

## Raccomandazione Finale

### Breve termine
- Restare su modalità manuale-supervisionata (A+F)
- Consolidare runbook Claude Code/Windsurf
- Attendere reset Cursor (~10 giorni)

### Prima prova tecnica proponibile (runtime-gated)
- **Task 0129 proponibile:** Ollama locale feasibility test su metadata sintetici

### Da evitare nel breve termine
- ❌ API key manuali
- ❌ Login CLI su VPS
- ❌ API cinesi (anche per dati non sensibili) — privacy non giustifica costi più bassi
- ❌ GitHub Actions come orchestratore
- ❌ Runner automatico in qualsiasi forma

### Micro-task proponibili (priorità)
- 0127: Consolidare runbook manuale-supervisionato (docs-only)
- 0128: Cursor CLI preflight post-reset (runtime-gated light)
- 0129: Ollama locale feasibility test (runtime-gated)
- 0130: Token budget + cost cap design (docs-only)

## Rischi Residui

- Reset Cursor timing incerto
- Subscription Claude/Windsurf come dipendenza continuata
- Pricing provider cinesi variabile
- VPS hardware GPU non verificato
- Policy dati provider non occidentali soggette a cambiamenti

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
- ✅ Nessun codice privato, repository completo, credenziale, token o dato personale inviato a provider esterni

---
**Sessione completata — Ricerca market options & low-cost API: docs-only eseguita**
