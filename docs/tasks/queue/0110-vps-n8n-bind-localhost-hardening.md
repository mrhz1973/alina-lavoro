# Task — VPS n8n bind localhost hardening

## Metadata

- ID: 0110-vps-n8n-bind-localhost-hardening
- Project: Alina Lavoro
- Type: vps-hardening-planning
- Priority: normal
- Status: queued
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

## Objective

Preparare una futura sessione manuale controllata per rendere n8n accessibile solo via localhost/tunnel SSH, preferibilmente vincolando Docker a:

127.0.0.1:5678:5678

oppure documentando e verificando in modo esplicito la protezione firewall provider.

## Runtime gate obbligatorio

Prima di modificare Docker, docker-compose, container, firewall, servizio n8n o VPS runtime, l'operatore deve confermare un gate manuale esplicito.

Questo task NON autorizza automaticamente:
- docker compose down/up;
- docker restart;
- modifica docker-compose.yml;
- modifica firewall;
- reboot;
- aggiornamenti apt;
- modifiche credential;
- modifiche workflow n8n;
- modifiche app.

## Scope previsto per futura hardening session

Dopo gate manuale esplicito, procedere un passo alla volta:

1. Identificare come è avviato n8n:
   - docker compose;
   - docker run;
   - file compose path;
   - directory progetto.
2. Fare backup/read-only della configurazione corrente.
3. Verificare eventuali variabili ambiente n8n rilevanti senza esporre segreti.
4. Pianificare binding target:
   - 127.0.0.1:5678:5678
5. Valutare impatto:
   - downtime n8n breve;
   - accesso solo tramite SSH tunnel;
   - credenziali n8n non toccate.
6. Applicare modifica solo dopo ulteriore conferma.
7. Riavviare container solo se autorizzato.
8. Verificare:
   - docker ps mostra 127.0.0.1:5678->5678/tcp oppure equivalente;
   - curl -I http://localhost:5678 ritorna HTTP 200;
   - accesso tunnel da PC a http://localhost:5678 funziona;
   - accesso esterno diretto resta non raggiungibile.
9. Documentare esito.
10. Non modificare workflow n8n.

## Vincoli

- Non modificare app Alina.
- Non modificare src/**.
- Non modificare gas-current/**.
- Non modificare .gas/**.
- Non modificare appsscript.json.
- Non fare deploy Apps Script.
- Non creare tag.
- Non fare rollback.
- Non modificare workflow n8n.
- Non esportare JSON n8n.
- Non documentare token, credenziali o URL raw sensibili.
- Non modificare VPS/Docker/n8n senza gate manuale.

## Allowed paths per futura chiusura dopo hardening reale

Solo dopo hardening reale:
- docs/sessions/2026-05-12-vps-n8n-bind-localhost-hardening.md
- docs/PROJECT_STATE.md
- docs/CHECKPOINT.md
- docs/tasks/done/0110-vps-n8n-bind-localhost-hardening.md

## Forbidden paths

- src/**
- gas-current/**
- .gas/**
- appsscript.json
- package.json
- export n8n non redatti
- file contenenti credenziali o token

## Done criteria futuro

Il task 0110 sarà completato solo quando:
- metodo di avvio n8n identificato;
- configurazione corrente verificata;
- binding modificato o firewall provider documentato;
- n8n verificato localmente;
- tunnel verificato;
- accesso esterno diretto verificato;
- documentazione aggiornata;
- done marker creato;
- commit selettivo e push eseguiti;
- nessun impatto su app Alina.
