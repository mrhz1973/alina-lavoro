# Task — VPS runner read-only check

## Metadata

- ID: 0120-vps-runner-read-only-check
- Project: Alina Lavoro
- Type: vps-preflight-readonly
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no

## Context

Task 0119 ha completato il setup preflight del VPS runner in modalità docs-only:

- Documentazione VPS runner setup creata
- Requisiti hardware/software definiti
- Strategia di sicurezza e isolamento definita
- Nessuna modifica runtime VPS eseguita
- Nessuna installazione Claude Code CLI
- Nessuna configurazione API key
- Nessun runner automatico attivato

Task 0120 deve preparare una futura verifica read-only del VPS per confermare lo stato attuale senza modifiche.

## Objective

Preparare la futura verifica read-only del VPS per confermare lo stato attuale dell'infrastruttura senza apportare modifiche.

Questo task NON deve eseguire SSH, NON deve modificare VPS, NON deve installare software, NON deve configurare API key e NON deve attivare runner automatico.

## Runtime gate obbligatorio

Prima di qualsiasi azione SSH o runtime, l'operatore deve confermare esplicitamente il gate manuale.

Questo task autorizza SOLO comandi read-only sul VPS.

## Scope previsto per futura verifica read-only

Dopo gate manuale esplicito, saranno ammessi solo comandi read-only:

### Comandi sistema read-only
- `uname -a` - informazioni kernel
- `lsb_release -a` oppure `cat /etc/os-release` - distribuzione
- `node --version` - versione Node.js
- `npm --version` - versione npm
- `which node` - percorso Node.js
- `which npm` - percorso npm
- `which claude` - verifica presenza Claude CLI (se installata)
- `claude --version` - versione Claude CLI (se installata)
- `free -m` - memoria disponibile
- `df -h /` - spazio disco root
- `df -h /root` - spazio disco home
- `nproc` - numero processori
- `docker --version` - versione Docker
- `docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"` - container attivi
- `curl` read-only verso n8n health endpoint (se documentato e sicuro)
- `whoami` - utente corrente
- `id` - informazioni utente
- `ls -la /root/` oppure directory runner se già esistente

### Azioni esplicitamente vietate
- **Installazioni**: apt, yum, npm install, docker pull
- **Upgrade**: apt upgrade, yum update
- **Reboot**: reboot, shutdown
- **Modifiche file**: touch, echo, cat >, vim, nano
- **Creazione directory**: mkdir
- **Modifica docker-compose**: docker-compose up/down/edit
- **Modifica n8n**: qualsiasi comando n8n che modifichi configurazione
- **Modifica workflow n8n**: accesso UI n8n per modifiche
- **Creazione/configurazione API key**: qualsiasi comando con chiavi
- **Test Claude con API reale**: claude con --key o configurazione
- **Comando claude --print con API key**
- **Deploy**: qualsiasi comando di deploy
- **Tag**: git tag
- **Rollback**: qualsiasi operazione di rollback
- **Runner automatico**: systemctl enable/start, docker-compose up

## Output atteso documentale

L'esecuzione futura dovrà produrre:

1. **docs/automation/vps-runner-read-only-check.md**
   - Riepilogo comandi eseguiti
   - Output sanitizzato (senza credenziali)
   - Stato attuale VPS
   - Raccomandazioni per eventuali step successivi

2. **docs/sessions/[data]-vps-runner-read-only-check.md**
   - Sessione dettagliata
   - Timestamp comandi
   - Output completo redatto
   - Eventuali problemi riscontrati

3. **docs/tasks/done/0120-vps-runner-read-only-check.md**
   - Done marker
   - Evidence della verifica
   - Criteri di completamento

## Sicurezza e redazione

- **Non committare output sensibili**: password, token, chiavi private
- **Redarre hostname, IP pubblici, path sensibili** se presenti nell'output
- **Criterio di stop immediato** se un comando mostra segreti o output inatteso
- **Sanitizzare output** prima del commit

## Allowed paths per futura chiusura

Solo dopo verifica reale:

- docs/automation/vps-runner-read-only-check.md
- docs/sessions/[data]-vps-runner-read-only-check.md
- docs/PROJECT_STATE.md
- docs/CHECKPOINT.md
- docs/tasks/done/0120-vps-runner-read-only-check.md

## Forbidden paths

- src/**
- gas-current/**
- .gas/**
- appsscript.json
- package.json
- .clasp.json
- .github/workflows/**
- export n8n non redatti
- file con credenziali, token, chiavi o URL raw sensibili

## Done criteria futuri

Il task 0120 sarà considerato completato solo quando:

- verifica read-only VPS sarà eseguita;
- output sarà sanitizzato e documentato;
- documentazione sarà creata;
- done marker sarà creato;
- commit selettivo e push saranno eseguiti;
- nessuna modifica VPS sarà stata apportata;
- nessuna installazione sarà stata eseguita;
- nessun runner automatico sarà stato attivato.

## Note operative

- Questo task è puramente informativo/preparatorio
- Nessuna azione runtime deve essere eseguita in questo step
- L'esecuzione reale richiederà gate manuale separato
- App Alina V1.9.2 rimane stabile e non toccata

---
**Task creato - verifica read-only VPS preparata**
