# Task — VPS n8n maintenance check

## Metadata

- ID: 0109-vps-n8n-maintenance-check
- Project: Alina Lavoro
- Type: vps-maintenance-planning
- Priority: normal
- Status: queued
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

## Scope previsto per futura manutenzione

Dopo gate manuale esplicito, procedere un passo alla volta:

1. Verificare che non ci siano workflow n8n in esecuzione.
2. Verificare stato servizio n8n.
3. Verificare spazio disco, memoria e carico.
4. Eseguire apt update.
5. Elencare pacchetti aggiornabili.
6. Decidere se applicare upgrade.
7. Se autorizzato, eseguire upgrade controllato.
8. Verificare se serve reboot.
9. Se autorizzato, eseguire reboot.
10. Dopo reboot, verificare SSH.
11. Verificare servizio n8n.
12. Verificare tunnel:
    ssh -L 5678:localhost:5678 ionos-n8n
13. Verificare browser:
    http://localhost:5678
14. Non modificare workflow n8n.
15. Documentare esito.

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
- Non applicare aggiornamenti VPS senza gate manuale.

## Allowed paths per futura chiusura dopo manutenzione reale

Solo dopo manutenzione reale:
- docs/sessions/2026-05-12-vps-n8n-maintenance-check.md
- docs/PROJECT_STATE.md
- docs/CHECKPOINT.md
- docs/tasks/done/0109-vps-n8n-maintenance-check.md

## Forbidden paths

- src/**
- gas-current/**
- .gas/**
- appsscript.json
- package.json
- export n8n non redatti
- file contenenti credenziali o token

## Done criteria futuro

Il task 0109 sarà completato solo quando:
- stato VPS verificato;
- eventuali aggiornamenti gestiti con gate manuale;
- n8n verificato dopo la manutenzione;
- tunnel e browser verificati;
- documentazione aggiornata;
- done marker creato;
- commit selettivo e push eseguiti;
- nessun impatto su app Alina.
