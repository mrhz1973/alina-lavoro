# Architettura — B+ minimale confinata

**Data:** 18 maggio 2026  
**Versione:** v1.0  
**Stato:** approved  
**Decisione finale:** utente  
**Revisori:** ChatGPT, Claude

## Contesto e problema

Alina Lavoro è un progetto applicativo personale basato su Google Apps Script e Google Sheets, con repository GitHub `mrhz1973/alina-lavoro` come source of truth. Lo stato operativo corrente è V2.2.0 build 0428, branch operativo unico `main`, Apps Script + Sheets come runtime applicativo, e documentazione di progetto in `docs/`.

Il problema da risolvere è il passaggio da un flusso manuale e discontinuo a un loop semi-autonomo low-touch. Il progetto deve ridurre copy/paste manuale di prompt, richieste continue di aggiornamento tramite "aggio", pause inutili degli implementatori e perdita di memoria tra conversazioni AI.

Il nuovo sistema deve mantenere GitHub come fonte permanente e verificabile, usare strumenti locali o già disponibili, evitare nuovo billing API, degradare in modo esplicito quando un componente non è disponibile, e conservare gate umani per le operazioni realmente rischiose.

## Decisione architetturale

Adottiamo l'architettura **B+ minimale confinata**.

n8n è il control plane operativo. Riceve eventi GitHub, gestisce stato, routing, Telegram, cron, cleanup, gate, commit e notifiche.

Ollama è classifier/router/risk scorer/prompt compressor. Non è orchestratore strategico e non decide deploy, rollback, tag, merge o cambi di direzione. Il classifier primario gira sul PC Ryzen + RTX 3060 quando disponibile. Il classifier fallback gira sul Dell Latitude 5430 in modalità conservativa.

Cursor CLI è l'implementatore automatico a job. Viene invocato da n8n via SSH/Tailscale, lavora su branch dedicati e produce evidence pack. Non è orchestratore always-on.

OpenClaw è solo bridge Codex-as-a-service confinato. Espone un endpoint privato `/codex-consult`, riceve da n8n una richiesta strutturata, invoca Codex tramite Sign in with ChatGPT, restituisce risposta strutturata e non compie altre azioni operative.

ChatGPT/Codex è escalation per task a rischio medio. L'utente resta gate finale per deploy, tag, rollback, cancellazioni, force push, secrets, provider/billing, OAuth, credenziali e decisioni strategiche.

## Diagramma del flusso completo

```text
GitHub event / PR / task queue
        |
        v
n8n control plane on VPS IONOS
        |
        v
Ollama classifier health check
        |
        +--> primary PC Ryzen up
        |       -> rich classifier
        |       -> standard thresholds
        |
        +--> primary offline, Dell fallback up
        |       -> lightweight classifier
        |       -> conservative thresholds
        |       -> Telegram degraded-mode notification
        |
        +--> both classifiers offline
                -> Telegram gate
                -> no automation

After classification:

risk = low
        |
        v
n8n builds implementer prompt
        |
        v
Cursor CLI headless worker on Dell
        |
        v
branch iter/N or task branch -> commit -> PR/evidence pack

risk = medium
        |
        v
n8n calls /codex-consult
        |
        v
OpenClaw bridge -> Codex OAuth -> structured decision
        |
        v
n8n builds prompt -> Cursor CLI job -> PR/evidence pack

risk = high
        |
        v
Telegram bidirectional gate
        |
        v
user decision required
```

## Regole di confinamento OpenClaw

1. OpenClaw MUST NOT have GitHub PAT.
2. OpenClaw MUST NOT manage Telegram.
3. OpenClaw MUST NOT execute shell commands against the repository.
4. OpenClaw MUST NOT install third-party skills.
5. OpenClaw MUST NOT access email, calendar, personal files, browser profiles, or unrelated local resources.
6. OpenClaw MUST NOT handle deploy, tag, rollback, deletion, reset, force push, secrets, billing, provider keys, OAuth management, or destructive operations.
7. OpenClaw MUST expose only the private/local HTTP endpoint `/codex-consult`.
8. OpenClaw MUST return structured responses to n8n and MUST NOT commit, push, merge, label, close, or mutate GitHub state.
9. OpenClaw MUST run on the Dell node, separated from the VPS n8n control plane.
10. n8n remains owner of state, gates, commits, notifications, cleanup, workflow routing, and audit trail.
11. OpenClaw and Ollama may cohabit on the Dell node, but MUST NOT call each other. n8n is the only orchestrator allowed to call both services.

## Componenti e responsabilità

| Componente | Ruolo | Autorità operativa | Note |
|---|---|---|---|
| GitHub | Source of truth | Repository state | Branch unico `main`; iter branch per automazione |
| n8n | Control plane | Routing, gate, commit, Telegram, cleanup | Unico orchestratore operativo |
| Ollama PC Ryzen | Classifier primario | Solo classificazione | Modello ricco `qwen3:14b` o `gpt-oss:20b` |
| Ollama Dell | Classifier fallback | Solo classificazione conservativa | `llama3.2:3b`, eventuale escalation a `qwen3:7b` |
| OpenClaw | Bridge Codex | Solo risposta `/codex-consult` | Nessuna credenziale GitHub o Telegram |
| Cursor CLI | Implementatore | Modifica branch dedicati | Job temporaneo invocato da n8n |
| Telegram | Gate umano | Decisioni manuali | Gestito solo da n8n |
| Utente | Autorità finale | Gate strategici e rischiosi | Deploy/tag/rollback sempre manuali |

## Alternative valutate e scartate

| Opzione | Descrizione | Motivo dello scarto |
|---|---|---|
| A — Cursor×2 | Due sessioni Cursor: orchestratore-mini e implementatore | Consumo crediti elevato, always-on fragile, controllo esterno non nativo |
| B — OpenClaw centrale | OpenClaw gateway completo con Telegram, GitHub, skill e orchestrazione | Blast radius troppo ampio e troppi permessi concentrati |
| C — n8n + wrapper custom | n8n con wrapper Codex scritto ad hoc | Richiede software custom da mantenere e debug futuro |
| D — Ollama orchestratore | Ollama decide strategia e task successivi | Modelli locali piccoli/medi non affidabili come orchestratori strategici |

## Trust boundaries

Il boundary primario separa VPS IONOS e Dell. La VPS contiene il control plane stabile: n8n, Telegram, GitHub webhook e cron cleanup. Il Dell contiene servizi esecutivi confinati: OpenClaw bridge, Ollama fallback, Cursor CLI worker e Tailscale.

Il boundary secondario separa OpenClaw e Ollama anche se coabitano sul Dell. I due servizi non condividono responsabilità, non si chiamano reciprocamente e non coordinano azioni. n8n è l'unico componente che decide quando consultarli.

Il boundary terzo separa classifier e implementer. Ollama classifica, Cursor CLI implementa. Nessun classifier può espandere l'autorità automatica oltre le policy definite da n8n.

## Degradazione operativa

| Evento | Comportamento richiesto |
|---|---|
| PC Ryzen/Ollama primario offline | n8n usa Dell fallback con soglie conservative e notifica Telegram |
| Dell/Ollama fallback offline | se primario offline, tutti gli eventi passano a Telegram gate |
| OpenClaw offline | ramo medium torna a mock manuale Telegram/ChatGPT |
| Cursor CLI failure | task marcato failed o done-unverified; evidence pack obbligatorio |
| n8n failure | automazione sospesa; GitHub resta source of truth |
| Telegram failure | nessuna operazione high risk procede automaticamente |

## Gate manuali

Deploy, tag, rollback, cancellazioni, reset, force push, secrets, credenziali, OAuth, billing, provider API, cancellazione deployment e modifica policy richiedono gate umano esplicito. Nessun componente automatico può auto-approvare questi casi.

## Sequenza fasi

| Fase | Stato atteso | Descrizione |
|---|---|---|
| Fase 0 | Documentazione | Commit documenti architetturali e contratti |
| Fase 1 | Loop autonomo 80% | n8n + Ollama + Cursor CLI, ramo medium su mock Telegram/manuale |
| Fase 2 | Bridge vivo | OpenClaw `/codex-consult` sostituisce il mock medium |
| Fase 3 | Tuning | Soglie, hard cap, retention e metriche basate su dati |

## Regola di congelamento architetturale

L'architettura B+ minimale confinata è congelata fino alla produzione di dati reali di Fase 1. Non si introducono nuovi componenti, nuovi gateway, nuove skill, nuove API a pagamento o nuove revisioni strategiche senza misurazioni operative.

## Riferimenti correlati

- `docs/ARCHITECTURE-DELL-NODE.md`
- `docs/CONTRACTS.md`
- `docs/DOD.md`
- `docs/ROADMAP-EXECUTION.md`
- `docs/roadmap.md`
- `docs/LLMS.md`
- `docs/wiki/current-state.md`

## Changelog

| Versione | Data | Stato | Modifica |
|---|---|---|---|
| v1.0 | 2026-05-18 | approved | Decisione architetturale B+ minimale confinata formalizzata |
