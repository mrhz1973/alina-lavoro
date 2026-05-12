# Task — VPS n8n bind localhost hardening

## Metadata

- ID: 0110-vps-n8n-bind-localhost-hardening
- Project: Alina Lavoro
- Type: vps-hardening-planning
- Priority: normal
- Status: done
- Created by: Orchestrator
- Deploy: no

## Context

Task 0109 ha verificato il VPS IONOS/n8n in modalità read-only.

Esito rilevante:
- n8n gira in Docker;
- container: root-n8n-1;
- image: docker.n8n.io/n8nio/n8n;
- n8n risponde localmente su http://localhost:5678;
- Docker espone la porta come 0.0.0.0:5678 e [::]:5678;
- docker inspect mostra HostIp vuoto per 5678/tcp;
- ufw è inactive;
- test esterno su IP pubblico porta 5678 non apre;
- probabile filtro lato provider, ma configurazione locale non ideale.

## Done status

- Completed by: utente (hardening manuale VPS) + Claude Code (documentazione)
- Completion date: 2026-05-12
- Session: docs/sessions/2026-05-12-vps-n8n-bind-localhost-hardening.md

**Evidence:**

- Compose file: `/root/docker-compose.yaml`; working dir: `/root`; servizio `n8n`; versione 2.19.5
- Volume dati: `root_n8n_data` (invariato)
- `.env`: solo `GENERIC_TIMEZONE=Europe/Berlin` — nessun segreto documentato
- Backup creato: `/root/docker-compose.yaml.bak-20260512-005104`
- Binding modificato: `5678:5678` → `127.0.0.1:5678:5678`
- Comando: `cd /root && docker compose up -d`
- `docker ps` post-hardening: `127.0.0.1:5678->5678/tcp` — binding corretto
- `curl -I http://localhost:5678`: `HTTP/1.1 200 OK`
- Browser via tunnel SSH `http://localhost:5678`: n8n si apre
- Accesso esterno `http://217.160.71.145:5678`: non si apre
- Warning log: Python runner assente (non critico), `N8N_RUNNERS_ENABLED` deprecata (informativo), errore `endsWith` isolato (non bloccante)

**Outcome:** binding n8n ristretto a 127.0.0.1; n8n operativo via tunnel SSH; accesso esterno diretto bloccato; nessun impatto app, nessun deploy/tag/rollback.
