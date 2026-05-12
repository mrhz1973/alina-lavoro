# Task — VPS n8n maintenance check

## Metadata

- ID: 0109-vps-n8n-maintenance-check
- Project: Alina Lavoro
- Type: vps-maintenance-planning
- Priority: normal
- Status: done
- Created by: Orchestrator
- Deploy: no

## Context

Preparare una manutenzione controllata del VPS n8n, separata da app Alina e separata dai workflow n8n già validati.

## Objective

Guidare una futura sessione manuale per:
- verificare stato VPS;
- verificare stato servizio n8n;
- elencare aggiornamenti disponibili;
- applicare aggiornamenti solo dopo gate manuale;
- valutare se serve reboot;
- verificare che n8n riparta;
- verificare tunnel e accesso browser.

## Runtime gate obbligatorio

Prima di eseguire qualsiasi comando di manutenzione VPS che modifichi il sistema, l'operatore deve confermare gate manuale esplicito.

Questo task NON autorizza automaticamente:
- apt upgrade;
- reboot;
- modifiche servizi;
- modifiche firewall;
- modifiche n8n;
- modifiche credential;
- modifiche app.

## Done status

- Completed by: utente (verifica manuale VPS) + Claude Code (documentazione)
- Completion date: 2026-05-12
- Session: docs/sessions/2026-05-12-vps-n8n-maintenance-check.md

**Evidence:**

- VPS IONOS: Ubuntu 24.04.4 LTS, kernel 6.8.0-111-generic, uptime ~1g 9h, load 0.02/0.01/0.00, RAM 1.0G/3.8G, disco 4.9G/116G (~5%)
- n8n in Docker: container `root-n8n-1`, image `docker.n8n.io/n8nio/n8n`, Up ~34h, porta 5678 attiva
- Port binding: `0.0.0.0:5678->5678/tcp`; ufw: inattivo
- Test esterno: non raggiungibile; test locale `curl -I http://localhost:5678`: `HTTP/1.1 200 OK`
- Aggiornamenti disponibili: 4 pacchetti libheif — non urgenti, non applicati
- Reboot: no reboot required — non eseguito
- Rischio futuro documentato: binding n8n su 0.0.0.0 con ufw inattivo — da vincolare a 127.0.0.1 o verificare firewall provider in task separato

**Outcome:** manutenzione read-only completata; VPS sano; n8n operativo; nessun intervento applicato; nessuna modifica app, nessun deploy/tag/rollback.
