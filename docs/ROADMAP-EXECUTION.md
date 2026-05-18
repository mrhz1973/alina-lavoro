# Roadmap Execution — B+ minimale confinata

**Data:** 18 maggio 2026  
**Versione:** v1.0  
**Stato:** approved  
**Decisione finale:** utente  
**Revisori:** ChatGPT, Claude

## Scopo

Questo documento definisce il piano operativo in tre fasi per rendere attiva l'architettura B+ minimale confinata. Il piano è prescrittivo e misurabile. Non riapre la discussione architetturale.

## Stato di partenza

| Voce | Stato |
|---|---|
| App | Alina Lavoro V2.2.0 build 0428 |
| Runtime | Google Apps Script + Google Sheets |
| Repository | `mrhz1973/alina-lavoro` |
| Branch operativo | `main` |
| Produzione | stabile, nessun deploy incluso in questa roadmap |
| Automazione target | n8n + Ollama + Cursor CLI + OpenClaw bridge confinato |
| Gate manuali | deploy, tag, rollback e operazioni distruttive |

## Fase 0 — Documentazione architetturale

**Durata stimata:** oggi, 1-2 ore  
**Obiettivo:** creare memoria permanente del sistema.

### Deliverable

- `docs/ARCHITECTURE.md`
- `docs/ARCHITECTURE-DELL-NODE.md`
- `docs/DOD.md`
- `docs/CONTRACTS.md`
- `docs/ROADMAP-EXECUTION.md`

### Criterio di chiusura

Fase 0 è chiusa quando i 5 documenti sono committati su `main` in GitHub e recuperabili indipendentemente dalla conversazione AI.

## Fase 1 — Loop autonomo all'80%

**Durata stimata:** 5-7 giorni  
**Obiettivo:** attivare il loop n8n + Ollama + Cursor CLI con ramo medium gestito da mock Telegram/manuale.

### Setup tecnico

1. Configurare endpoint Ollama HTTP sul Dell.
2. Configurare health check n8n verso:
   - Ollama primario PC Ryzen;
   - Ollama fallback Dell.
3. Configurare workflow n8n:
   - GitHub webhook;
   - chiamata classifier;
   - routing low/medium/high;
   - Telegram degraded-mode notification;
   - cron cleanup `iter/*`.
4. Configurare Cursor CLI headless sul Dell:
   - workspace isolato;
   - invocazione via SSH/Tailscale;
   - branch dedicato;
   - evidence pack.
5. Configurare ramo medium come mock OpenClaw:
   - notifica Telegram "apri ChatGPT manualmente";
   - risposta normalizzata nello stesso schema `/codex-consult`.

### Routing Fase 1

| Rischio | Azione |
|---|---|
| low | n8n invoca Cursor CLI headless |
| medium | n8n invia mock Telegram/manuale con schema `/codex-consult` |
| high | Telegram bidirezionale, gate utente |
| classifier offline | Telegram gate, nessuna automazione |

### Criterio di chiusura Fase 1

Fase 1 è chiusa quando almeno 20 task low vengono completati senza intervento manuale sul ramo low, con evidence pack valido e senza violazioni di gate.

## Fase 2 — OpenClaw bridge vivo

**Durata stimata:** 3-5 giorni  
**Obiettivo:** sostituire il mock manuale del ramo medium con il bridge OpenClaw `/codex-consult`.

### Setup tecnico

1. Installare OpenClaw in Docker Desktop sul Dell.
2. Configurare auth Codex via Sign in with ChatGPT.
3. Esporre solo `/codex-consult` via Tailscale.
4. Disabilitare Telegram, GitHub PAT, skill terze e shell repo in OpenClaw.
5. Collegare n8n al nuovo endpoint usando lo stesso contratto JSON di Fase 1.
6. Loggare le ultime invocazioni per audit.

### Criterio di chiusura Fase 2

Fase 2 è chiusa quando 10 task ramo medium vengono gestiti automaticamente tramite `/codex-consult`, senza GitHub PAT in OpenClaw, senza Telegram in OpenClaw, senza shell repo e senza bypass dei gate.

## Fase 3 — Tuning continuo

**Durata:** continuo  
**Obiettivo:** migliorare soglie, retention e hard cap solo con dati reali.

### Attività ammesse

- tuning soglie classifier;
- tuning hard cap iterazioni;
- tuning retention branch `iter/*`;
- riduzione falsi positivi/negativi;
- miglioramento evidence pack;
- misurazione latenza e affidabilità.

### Divieti

Non aggiungere nuovi componenti, gateway, skill, API a pagamento o orchestratori paralleli senza dato operativo che lo giustifichi.

## Indicatori di successo

| Indicatore | Target iniziale |
|---|---:|
| Task low autonomi/giorno | >= 5 nei giorni attivi |
| Task low completati senza intervento | >= 80% |
| Output classifier JSON valido | >= 95% |
| Task medium gestiti da `/codex-consult` in Fase 2 | >= 10 |
| Rollback necessari | 0 per settimana |
| Violazioni gate manuale | 0 |
| Latenza media classifier primario | < 20s |
| Latenza media classifier fallback | < 45s |
| OpenClaw bridge crash | <= 1/settimana dopo stabilizzazione |

## Indicatori di fallimento

| Indicatore | Azione richiesta |
|---|---|
| >3 rollback in una settimana | stop automazione e revisione DOD |
| >50% task low richiedono intervento manuale | rituning classifier o riduzione scope low |
| OpenClaw bridge crash >3/settimana | tornare a mock Telegram/manuale |
| Output JSON invalido >10% | cambiare prompt/schema/modello classifier |
| Qualsiasi violazione gate deploy/tag/rollback | stop immediato del loop |
| Branch `iter/*` non puliti | sospendere nuove iterazioni e correggere cleanup |
| Evidence pack assente | task non può essere `done` |

## Misurazioni minime

n8n deve mantenere o produrre un log con:

- timestamp evento;
- classifier provider usato;
- degraded mode true/false;
- risk assegnato;
- executor scelto;
- task status;
- commit SHA;
- durata;
- errori;
- escalation Telegram o Codex;
- esito finale.

## Riferimenti correlati

- `docs/ARCHITECTURE.md`
- `docs/ARCHITECTURE-DELL-NODE.md`
- `docs/DOD.md`
- `docs/CONTRACTS.md`
- `docs/roadmap.md`

## Changelog

| Versione | Data | Stato | Modifica |
|---|---|---|---|
| v1.0 | 2026-05-18 | approved | Piano operativo Fase 0, Fase 1, Fase 2 e Fase 3 con metriche |
