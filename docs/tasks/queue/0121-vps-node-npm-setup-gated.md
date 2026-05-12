# Task — VPS Node.js/npm Setup (Gated)

## Metadata

- ID: 0121-vps-node-npm-setup-gated
- Project: Alina Lavoro
- Type: vps-setup-gated
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no

## Context

Task 0120 ha completato la verifica read-only del VPS:

- OS: Ubuntu 24.04.4 LTS ✅
- Kernel: 6.8.0-111-generic ✅
- CPU: 4 cores ✅
- RAM: 3.8 GB (2.8 GB available) ✅
- Disco: 116 GB (4.9 GB usati) ✅
- Docker: 29.1.3 ✅
- n8n: running on 127.0.0.1:5678 ✅
- Node.js: NOT installed ❌
- npm: NOT installed ❌
- Claude CLI: NOT installed ❌

Task 0121 deve preparare il futuro setup controllato di Node.js/npm come prerequisito per Claude Code CLI.

## Objective

Preparare il setup controllato di Node.js/npm sul VPS per abilitare il futuro utilizzo di Claude Code CLI.

**Questo task NON esegue nessun comando VPS, NON apre SSH, NON installa nulla e NON modifica n8n runtime.**

## Autorizzazione Gate Obbligatorio

La presenza di questo task in queue **NON autorizza automaticamente** l'esecuzione di alcun comando sul VPS.

Prima di qualsiasi SSH/installazione/real action, è richiesto:

1. Nuovo gate esplicito dell'orchestratore/utente
2. Approvazione scritta dell'azione specifica proposta
3. Conferma che il contesto VPS non è cambiato (task 0120 ancora valido)

## Scope del Task Futuro

Il task futuro, dopo gate esplicito, resterà limitato esclusivamente a:

- Verificare stato attuale Node.js/npm
- Installare o preparare Node.js/npm
- Verificare installazione Node.js/npm

**Fuori scope e vietato in task 0121:**
- Installare Claude Code CLI
- Configurare API key
- Leggere o modificare file `.env`
- Modificare `docker-compose.yaml`
- Modificare n8n runtime
- Modificare workflow n8n
- Creare nodi Execute Command in n8n
- Eseguire `claude` o `claude --print`
- Creare runner automatico
- Deploy, tag, rollback
- Modifiche app Alina

## Opzioni Tecniche da Valutare

### Opzione 1: Node.js/npm da repository Ubuntu (apt)

**Vantaggi:**
- Più semplice da installare e gestire
- Coerente con il sistema operativo
- Aggiornamenti automatici con sistema
- Nessuna gestione ambiente shell aggiuntiva

**Svantaggi:**
- Versione potrebbe non essere la più recente
- Meno flessibile per multi-versione

**Comandi futuri ammessi (solo dopo gate):**
```bash
ssh ionos-n8n
apt-cache policy nodejs npm
apt update
apt install nodejs npm
node --version
npm --version
which node
which npm
```

### Opzione 2: Node.js tramite nvm (Node Version Manager)

**Vantaggi:**
- Più isolato dal sistema
- Più flessibile per gestire versioni multiple
- Permette testare versioni diverse

**Svantaggi:**
- Richiede maggiore attenzione: il runner n8n (via Execute Command o SSH) potrebbe NON ereditare automaticamente l'ambiente shell/nvm
- Richiede configurazione aggiuntiva per rendere nvm disponibile in sessioni non-interattive
- Complicazione potenziale per automazione futura

**Comandi futuri ammessi (solo dopo gate):**
```bash
ssh ionos-n8n
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
node --version
npm --version
```

## Raccomandazione Iniziale

Scegliere il metodo più semplice e stabile per il VPS reale:

- **Preferire apt** se la versione disponibile soddisfa i requisiti minimi per Claude Code CLI (Node.js ≥ 18.x)
- **Usare nvm solo se:** apt non fornisce versione adeguata, o se serve isolamento esplicito, o se richiesto da configurazioni specifiche future

## Stop Conditions (Criteri di Arresto)

Durante l'esecuzione futura, **fermarsi immediatamente** se:

- `apt` propone rimozioni inattese di pacchetti
- `apt` propone upgrade massivi non richiesti
- Servono modifiche a repository di sistema non previste
- Compaiono segreti, token, chiavi o output sensibile nell'output
- L'installazione Node/npm richiede una scelta ambigua o non documentata
- Qualsiasi comando mostra risultati inattesi o potenzialmente dannosi

## Output Documentale Previsto

Dopo esecuzione futura con gate esplicito:

1. **docs/automation/vps-node-npm-setup.md**
   - Metodo scelto (apt vs nvm) e motivazione
   - Comandi eseguiti
   - Output sanitizzato
   - Versioni installate
   - Note su eventuali warning

2. **docs/sessions/2026-05-12-vps-node-npm-setup.md**
   - Timestamp esecuzione
   - Gate ricevuto
   - Comandi eseguiti
   - Output verificato
   - Anomalie riscontrate

3. **docs/tasks/done/0121-vps-node-npm-setup-gated.md**
   - Done marker
   - Evidence completamento
   - Conferma nessuna modifica non autorizzata

## Done Criteria Futuri

Il task 0121 sarà considerato completato solo quando:

- ✅ Node.js installato e verificato (`node --version`)
- ✅ npm installato e verificato (`npm --version`)
- ✅ Nessun Claude CLI installato in questo task
- ✅ Nessuna API key configurata in questo task
- ✅ Nessuna modifica n8n runtime
- ✅ Nessun nodo Execute Command creato
- ✅ Nessun runner automatico attivato
- ✅ Documentazione aggiornata
- ✅ Done marker creato
- ✅ Commit selettivo e push eseguiti
- ✅ Nessuna modifica app Alina

## Allowed Paths (futura esecuzione)

- docs/automation/vps-node-npm-setup.md
- docs/sessions/2026-05-12-vps-node-npm-setup.md
- docs/PROJECT_STATE.md
- docs/CHECKPOINT.md
- docs/tasks/done/0121-vps-node-npm-setup-gated.md

## Forbidden Paths (sempre)

- src/**
- gas-current/**
- .gas/**
- appsscript.json
- package.json
- .clasp.json
- .github/workflows/**
- export JSON n8n non redatti
- file con credenziali, token, chiavi o URL raw sensibili

## Note Operative

- Questo task è puramente preparatorio/informativo
- Nessuna azione runtime deve essere eseguita in questo step
- L'esecuzione reale richiederà gate manuale separato
- App Alina V1.9.2 rimane stabile e non toccata
- Runner automatico non attivo

---
**Task creato - setup Node.js/npm preparato, attesa gate manuale per esecuzione**
