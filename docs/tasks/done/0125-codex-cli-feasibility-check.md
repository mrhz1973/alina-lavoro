# Task — Codex CLI Feasibility Check

## Metadata

- ID: 0125-codex-cli-feasibility-check
- Project: Alina Lavoro
- Type: runner-feasibility-docs-only
- Priority: normal
- Status: **done**
- Created by: Orchestrator
- Completed by: Windsurf/Cascade (implementatore di riserva/supervisionato)
- Deploy: no
- Runtime: no

## Riferimenti

- **Task queue:** `docs/tasks/queue/0125-codex-cli-feasibility-check.md`
- **Sessione automation n8n (evidenza, incompleta):** `docs/sessions/automation-0125-codex-cli-feasibility-check.md`
- **Prompt n8n (evidenza automation, incompleto):** `docs/tasks/processing/0125-codex-cli-feasibility-check-cursor-prompt.md`
- **Documento decisionale:** `docs/automation/codex-cli-feasibility-check.md`
- **Sessione manuale:** `docs/sessions/2026-05-12-codex-cli-feasibility-check.md`

## Gate Ricevuto

> "Autorizzo l'esecuzione del task 0125 Codex CLI feasibility check, solo docs-only, nessun runtime, nessuna installazione, nessuna API key, nessun login, nessuna modifica VPS/n8n/app."

## Fonti Consultate (ufficiali)

- https://developers.openai.com/codex/cli (consultata 2026-05-12)
- https://developers.openai.com/codex/auth (consultata 2026-05-12)
- https://developers.openai.com/codex/cli/features (consultata 2026-05-12)
- https://developers.openai.com/codex/changelog (consultata 2026-05-12)

## Sintesi Raccomandazione

**Codex CLI non è raccomandato per runner VPS no-API-key nel breve termine.**

| Scenario | Raccomandazione |
|----------|----------------|
| Runner VPS headless no-API-key | ❌ Non raccomandato — token in chiaro su VPS, device code beta, OpenAI raccomanda API key per automazione |
| Uso locale supervisionato | ⚠️ Tecnicamente possibile ma non prioritario — Claude Code e Windsurf già operativi |
| Runner VPS con API key | ⚠️ Via raccomandata OpenAI ma vietata da presupposto utente |
| Runner VPS con login interattivo sicuro gestito | ⚠️ Possibile se cambia presupposto — richiede task separato e gate |

**Decisione corrente confermata (da 0124):** restare in modalità manuale-supervisionata.

**Prossimo passo:** restare su modalità manuale-supervisionata; Cursor CLI preflight al reset Cursor; Codex CLI da rivalutare solo se cambia presupposto no-API-key o si accetta login interattivo sicuro gestito.

## Conferme di Non-Interferenza

- ✅ **Nessun runtime eseguito** — valutazione solo documentale
- ✅ **Nessuna installazione Codex CLI** — nessun pacchetto installato
- ✅ **Nessuna esecuzione Codex CLI** — nessun comando CLI eseguito
- ✅ **Nessun login ChatGPT / OpenAI** — nessuna autenticazione tentata
- ✅ **Nessuna API key configurata** — presupposto no-API-key rispettato
- ✅ **Nessuna modifica VPS** — VPS invariato
- ✅ **Nessuna modifica n8n runtime** — container n8n invariato
- ✅ **Nessuna GitHub Actions** — nessun workflow automatico
- ✅ **Nessun runner automatico attivato** — flusso supervisionato confermato
- ✅ **App Alina V1.9.2 non toccata** — stabile
- ✅ **Nessun deploy / tag / rollback** — codice invariato

---
**Task 0125 completato — Codex CLI: non raccomandato per runner VPS no-API-key nel breve termine**
