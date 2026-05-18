# Architettura — Dell Latitude 5430 always-on node

**Data:** 18 maggio 2026  
**Versione:** v1.0  
**Stato:** approved  
**Decisione finale:** utente  
**Revisori:** ChatGPT, Claude

## Scopo

Questo documento specifica il nodo always-on dedicato dell'architettura B+ minimale confinata. Il Dell Latitude 5430 ospita servizi indipendenti, confinati e raggiungibili via Tailscale. Non sostituisce n8n come control plane.

## Hardware

| Voce | Specifica |
|---|---|
| Modello | Dell Latitude 5430 |
| CPU | Intel Core i7-1185G7, 4 core / 8 thread, fino a circa 3.0 GHz operativi |
| RAM | 16 GB |
| Storage | 500 GB SSD |
| GPU | Intel Iris Xe, nessuna GPU dedicata |
| Sistema operativo | Windows 11 64 bit |
| Profilo operativo | Always-on, dedicato, basso consumo |
| Continuità | Batteria integrata usata come UPS naturale |

## Servizi ospitati

### OpenClaw bridge

OpenClaw gira in Docker Desktop con backend WSL2. Il container espone solo l'endpoint `/codex-consult`.

Regole operative:

- MUST run with restart policy `unless-stopped`.
- MUST be reachable only through Tailscale or local trusted network.
- MUST authenticate to Codex via Sign in with ChatGPT.
- MUST NOT have GitHub PAT.
- MUST NOT manage Telegram.
- MUST NOT execute repository shell commands.
- MUST NOT install third-party skills.
- MUST NOT access browser profiles, email, calendar, personal files or unrelated local resources.
- MUST NOT perform deploy, tag, rollback, deletion, reset, force push, secret handling or billing/provider changes.
- MUST write only local service logs needed for audit.

### Ollama nativo Windows

Ollama gira nativamente su Windows e agisce come fallback classifier quando il PC Ryzen/Ollama primario non è disponibile.

Configurazione prevista:

| Voce | Valore |
|---|---|
| Modello iniziale | `llama3.2:3b` |
| Modello di escalation | `qwen3:7b` se il 3B risulta insufficiente nei test |
| Thread | `OLLAMA_NUM_THREAD=4` |
| Keep alive | `OLLAMA_KEEP_ALIVE=-1` |
| Bind locale | `127.0.0.1:11434` |
| Accesso n8n | via Tailscale, con endpoint esposto in modo controllato |
| Ruolo | fallback classifier-grade, non orchestratore |

Il modello fallback usa soglie conservative. Quando è attivo, n8n deve aumentare l'escalation verso medium/high e notificare Telegram che il sistema opera in modalità degradata.

### Cursor CLI headless

Cursor CLI è invocato a job da n8n via SSH/Tailscale.

Regole operative:

- MUST use isolated workspace.
- MUST NOT run as persistent autonomous session.
- MUST work only on branch dedicati.
- MUST produce evidence pack and final report.
- MUST NOT deploy, tag, rollback, reset, clean, force push or delete without explicit gate.
- MUST be considered implementer, not orchestrator.

### Tailscale

Tailscale fornisce raggiungibilità sicura tra VPS IONOS, Dell e altri nodi autorizzati.

Regole operative:

- MUST be always-on.
- MUST be configured to expose only required services.
- SHOULD use stable device names.
- MUST NOT expose OpenClaw or Ollama to the public Internet.

## Routing classifier n8n

```text
GitHub event
    |
    v
n8n on VPS IONOS
    |
    v
health check Ollama primary on PC Ryzen
    |
    +-- primary reachable
    |       |
    |       v
    |   classifier rich 14B/20B
    |       |
    |       v
    |   standard thresholds
    |
    +-- primary offline, Dell fallback reachable
    |       |
    |       v
    |   classifier light 3B/7B
    |       |
    |       v
    |   conservative thresholds
    |       |
    |       v
    |   Telegram degraded-mode notification
    |
    +-- both offline
            |
            v
        all events -> Telegram gate
        no automation
```

## Risorse stimate

| Servizio | RAM stimata | CPU stimata | Note |
|---|---:|---:|---|
| Windows 11 base | 3-4 GB | bassa | Sistema always-on |
| Docker Desktop + WSL2 | 1-2 GB | bassa/media | Backend container OpenClaw |
| OpenClaw bridge | 1-2 GB | variabile | Picchi durante consulti Codex |
| Ollama `llama3.2:3b` | 2-3 GB | media | CPU-only classifier |
| Ollama `qwen3:7b` | 4-5 GB | media/alta | Solo se 3B insufficiente |
| Cursor CLI job | 1-2 GB | variabile | Solo durante job |
| Tailscale + SSH | <0.5 GB | bassa | Always-on |
| Margine residuo | 4-7 GB | variabile | A regime stimato 9-11 GB su 16 GB |

## Configurazione Windows 11 obbligatoria

| Impostazione | Valore richiesto |
|---|---|
| Sleep su alimentazione AC | Never |
| Sleep su batteria | Never, salvo policy termica/sicurezza |
| Schermo | Può spegnersi |
| Account utente | Loggato persistente |
| Docker Desktop | Avvio automatico al boot |
| Ollama | Servizio Windows o startup automatico |
| Tailscale | Always-on |
| SSH | Abilitato solo per accesso controllato da n8n/Tailscale |
| Windows Update | Configurato per ridurre reboot non pianificati |

## Recovery

### Dell offline

Se il Dell è offline, n8n deve:

1. rilevare failure tramite health check;
2. sospendere chiamate OpenClaw, Ollama fallback e Cursor CLI worker;
3. degradare a Telegram gate;
4. non bloccare il repository;
5. non avviare automazioni low/medium senza worker disponibile;
6. notificare stato degradato.

### OpenClaw offline

Se OpenClaw è offline ma il Dell è raggiungibile:

1. ramo medium torna al mock manuale Telegram/ChatGPT;
2. ramo low può continuare solo se classifier e Cursor CLI sono disponibili;
3. nessun task medium viene auto-approvato.

### Ollama fallback offline

Se fallback Dell è offline ma PC Ryzen primario è up, n8n usa il primario. Se entrambi sono offline, tutti gli eventi passano a Telegram gate.

### Cursor CLI failure

Il task viene marcato failed o done-unverified, con log e evidence pack. Non si ritenta indefinitamente senza policy di retry.

## Test post-setup

Eseguire i test minimi dopo installazione e dopo ogni reboot rilevante.

```powershell
# Tailscale reachability from VPS or authorized node
tailscale ping dell-latitude-5430

# SSH reachability
ssh dell-latitude-5430 "hostname"

# Ollama health on Dell local
curl http://127.0.0.1:11434/api/tags

# Ollama health through Tailscale path
curl http://<dell-tailscale-ip>:11434/api/tags

# OpenClaw bridge mock health
curl http://<dell-tailscale-ip>:<openclaw-port>/codex-consult

# Cursor CLI availability
ssh dell-latitude-5430 "cursor --version"

# Docker/OpenClaw status
ssh dell-latitude-5430 "docker ps"
```

## Riferimenti correlati

- `docs/ARCHITECTURE.md`
- `docs/CONTRACTS.md`
- `docs/DOD.md`
- `docs/ROADMAP-EXECUTION.md`

## Changelog

| Versione | Data | Stato | Modifica |
|---|---|---|---|
| v1.0 | 2026-05-18 | approved | Specifica del Dell node con OpenClaw bridge, Ollama fallback, Cursor CLI e Tailscale |
