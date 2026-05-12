# Sessione — Task 0110 VPS n8n bind localhost hardening

**Data:** 2026-05-12
**Task:** 0110-vps-n8n-bind-localhost-hardening
**Tipo:** vps-hardening-planning
**Eseguito da:** utente (hardening manuale VPS) + Claude Code (documentazione chiusura)
**Stato:** completato

## Obiettivo

Vincolare il binding Docker di n8n da `0.0.0.0:5678` a `127.0.0.1:5678`, rendendo n8n accessibile solo via localhost e tunnel SSH. Sessione di hardening controllata con gate manuale.

## Configurazione pre-hardening

- **Metodo di avvio:** Docker Compose
- **Compose file:** `/root/docker-compose.yaml`
- **Working dir:** `/root`
- **Servizio:** `n8n`
- **Container:** `root-n8n-1`
- **Image:** `docker.n8n.io/n8nio/n8n`
- **Versione n8n (log):** 2.19.5
- **Volume dati:** `root_n8n_data`
- **Mountpoint volume:** `/var/lib/docker/volumes/root_n8n_data/_data`
- **`.env`:** contiene solo `GENERIC_TIMEZONE=Europe/Berlin` — nessun segreto documentato
- **Binding originale:** `5678:5678` (0.0.0.0)

## Backup

- Backup creato prima di qualsiasi modifica: `/root/docker-compose.yaml.bak-20260512-005104`

## Modifica applicata

- **Binding modificato:** da `5678:5678` a `127.0.0.1:5678:5678` in `/root/docker-compose.yaml`
- **Comando applicato:** `cd /root && docker compose up -d`

## Verifica post-hardening

- **`docker ps`:** mostra `127.0.0.1:5678->5678/tcp` — binding corretto
- **`curl -I http://localhost:5678`:** `HTTP/1.1 200 OK` — n8n risponde localmente
- **Browser via tunnel SSH** (`http://localhost:5678`): n8n si apre correttamente
- **Accesso esterno diretto** (`http://217.160.71.145:5678`): non si apre — accesso esterno bloccato

## Warning log (non bloccanti)

- Python task runner interno non avviato: Python 3 non presente sul VPS; JS Task Runner registrato — comportamento normale per installazioni senza Python.
- `N8N_RUNNERS_ENABLED`: deprecata / non più necessaria — warning informativo, nessun impatto operativo.
- Errore isolato: `Cannot read properties of undefined (reading 'endsWith')` — errore non critico, n8n operativo.

Nessun warning blocca l'operatività di n8n.

## Conclusione

Hardening completato con successo:

- Binding n8n ristretto a `127.0.0.1:5678`
- n8n operativo localmente e via tunnel SSH
- Accesso esterno diretto non disponibile
- Volume dati invariato
- Credential n8n non toccate
- Workflow n8n non modificati

## Esclusioni

- Nessun `apt upgrade` eseguito
- Nessun reboot eseguito
- Nessuna modifica ai workflow n8n
- Nessuna modifica app Alina (`src/**`)
- Nessun deploy Apps Script
- Nessun tag o rollback
- Nessun export JSON n8n
- Nessuna credenziale o token documentati

---
**Sessione completata — n8n bind localhost hardening**
