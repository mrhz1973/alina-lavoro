# Task — Runner Market Options & Low-Cost API Research

## Metadata

- ID: 0126-runner-market-options-low-cost-api-research
- Project: Alina Lavoro
- Type: runner-market-research-docs-only
- Priority: normal
- Status: **done**
- Created by: Orchestrator
- Completed by: Windsurf/Cascade (implementatore di riserva/supervisionato)
- Deploy: no
- Runtime: no

## Riferimenti

- **Task queue:** `docs/tasks/queue/0126-runner-market-options-low-cost-api-research.md`
- **Sessione automation n8n (evidenza):** `docs/sessions/automation-0126-runner-market-options-low-cost-api-research.md`
- **Prompt n8n (evidenza automation, incompleto):** `docs/tasks/processing/0126-runner-market-options-low-cost-api-research-cursor-prompt.md`
- **Documento di ricerca:** `docs/automation/runner-market-options-low-cost-api-research.md`
- **Sessione manuale:** `docs/sessions/2026-05-12-runner-market-options-low-cost-api-research.md`

## Gate Ricevuto

> "Autorizzo l'esecuzione del task 0126 runner market options low-cost API research, solo docs-only, nessun runtime, nessuna installazione, nessuna esecuzione CLI, nessun login, nessuna API key, nessuna modifica VPS/n8n/app, nessuna GitHub Actions."

## Fonti Ufficiali Consultate (2026-05-12)

- Anthropic Claude Code (già valutato in 0124)
- OpenAI Codex CLI docs (`developers.openai.com/codex/auth`, `/codex/cli`)
- GitHub Actions docs (`docs.github.com/billing/...`, `/actions/concepts/billing-and-usage`)
- Ollama (`docs.ollama.com/`, `/quickstart`, `/faq`)
- DeepSeek API Pricing (`api-docs.deepseek.com/quick_start/pricing`)
- Alibaba Cloud Model Studio (`alibabacloud.com/help/en/model-studio/model-pricing`, `/models`)
- Moonshot/Kimi (`platform.moonshot.ai/`)
- ZhipuAI (`bigmodel.cn/pricing`, `docs.bigmodel.cn/cn/guide/models/text/glm-5.1`)

## Sintesi Raccomandazione

**Breve termine:** manuale-supervisionata confermata come baseline (architettura A+F).

| Direzione | Azione | Priorità |
|-----------|--------|----------|
| Claude Code locale + Windsurf/Cascade | Consolidare runbook | ✅ alta |
| Cursor CLI | Preflight al reset (~10 giorni) | ✅ alta |
| Ollama locale | Task 0129 runtime-gated feasibility test zero-API | ⚠️ media |
| Token budget + cost cap design | Task 0130 docs-only | ⚠️ media |
| Claude/Codex CLI VPS | Sconsigliato (da 0123/0125) | ❌ |
| OpenAI/Anthropic/Gemini API | Viola presupposto no-API-key | ❌ |
| DeepSeek/Kimi/GLM via Alibaba | Privacy CN — non raccomandato | ❌ |
| Qwen EU via Alibaba | Possibile solo per metadata sintetici in futuro remoto | ⚠️ bassa |
| GitHub Actions orchestratore | Richiederebbe secrets/API key | ❌ |
| Devin/agentici cloud | Lock-in + costo | ❌ |
| Runner automatico | Fuori scope breve termine | ❌ |

**Micro-task proponibili (ordine priorità):** 0127 runbook (docs-only), 0128 Cursor preflight, 0129 Ollama feasibility, 0130 token/cost cap design.

## Conferme di Non-Interferenza

- ✅ **Nessun runtime eseguito** — ricerca solo documentale
- ✅ **Nessuna installazione** — nessun pacchetto/tool/modello installato
- ✅ **Nessuna esecuzione CLI** — nessun comando CLI eseguito
- ✅ **Nessun login** — nessuna autenticazione tentata
- ✅ **Nessuna API key configurata** — presupposto no-API-key rispettato
- ✅ **Nessuna modifica VPS** — VPS invariato
- ✅ **Nessuna modifica n8n runtime** — container n8n invariato
- ✅ **Nessuna GitHub Actions** — nessun workflow creato
- ✅ **Nessun runner automatico attivato** — flusso supervisionato confermato
- ✅ **App Alina V1.9.2 non toccata** — stabile
- ✅ **Nessun deploy / tag / rollback** — codice invariato
- ✅ **Nessun codice privato, repository, credenziale, token o dato personale inviato a provider esterni**

---
**Task 0126 completato — Manuale-supervisionata confermata come baseline; Ollama locale come primo candidato di test futuro runtime-gated**
