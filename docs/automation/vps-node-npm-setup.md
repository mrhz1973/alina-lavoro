# VPS Node.js/npm Setup

**Data:** 2026-05-12  
**Task:** 0121-vps-node-npm-setup-gated  
**Tipo:** vps-setup-gated  
**Eseguito da:** Windsurf/Cascade (reserve implementer)  
**Stato:** completato

## Scopo

Setup controllato di Node.js/npm sul VPS come prerequisito futuro per Claude Code CLI.

## Gate Ricevuto

> "Autorizzo l'esecuzione del task 0121 Node.js/npm setup, solo Node/npm, nessun Claude CLI, nessuna API key, nessun runner automatico."

## Metodo Scelto

**apt** (repository Ubuntu ufficiale)

### Motivazione

- Versione Node.js disponibile da apt (18.19.1) soddisfa requisito minimo (>= 18)
- Metodo più semplice e stabile
- Coerente con il sistema operativo
- Nessuna gestione ambiente shell aggiuntiva
- Raccomandato dal task 0121 per questa esecuzione

## Comandi Eseguiti

| Fase | Comando | Scopo |
|------|---------|-------|
| Verifica preliminare | `node --version \|\| true` | Verifica stato Node.js |
| Verifica preliminare | `npm --version \|\| true` | Verifica stato npm |
| Verifica preliminare | `which node \|\| true` | Verifica path Node.js |
| Verifica preliminare | `which npm \|\| true` | Verifica path npm |
| Verifica preliminare | `apt-cache policy nodejs npm` | Verifica versione disponibile |
| Installazione | `apt update` | Aggiorna lista pacchetti |
| Installazione | `apt install -y nodejs npm` | Installa Node.js e npm |
| Verifica post | `node --version` | Conferma installazione Node.js |
| Verifica post | `npm --version` | Conferma installazione npm |
| Verifica post | `which node` | Path Node.js installato |
| Verifica post | `which npm` | Path npm installato |
| Verifica post | `which claude \|\| true` | Conferma Claude CLI non installato |
| Verifica post | `claude --version \|\| true` | Conferma Claude CLI non presente |

## Output Sintetico e Sanitizzato

### Verifica Preliminare

```
node --version: command not found
npm --version: command not found
```

**Stato iniziale:** Node.js e npm non installati (confermato task 0120)

### Versione Disponibile da apt

```
nodejs:
  Candidate: 18.19.1+dfsg-6ubuntu5
  Version table: 18.19.1+dfsg-6ubuntu5 500 (noble/universe)

npm:
  Candidate: 9.2.0~ds1-2
  Version table: 9.2.0~ds1-2 500 (noble/universe)
```

**Valutazione:** Node.js 18.19.1 >= 18 ✓ Procedere con apt

### Installazione apt

```
apt update: OK (Fetched 3131 kB, 4 packages can be upgraded - informativo)
apt install -y nodejs npm: OK (installati pacchetti nodejs, npm + dipendenze)
```

**Note:** Warning debconf su frontend (Dialog/Readline) sono normali in sessione SSH non-interattiva, non influenzano l'installazione.

### Verifica Post-Installazione

```
node --version: v18.19.1 ✓
npm --version: 9.2.0 ✓
which node: /usr/bin/node ✓
which npm: /usr/bin/npm ✓
which claude: command not found ✓
claude --version: command not found ✓
```

## Versioni Installate

- **Node.js:** v18.19.1
- **npm:** 9.2.0

## Path Installazione

- **Node.js:** /usr/bin/node
- **npm:** /usr/bin/npm

## Conferme di Non-Interferenza

- ✅ **Claude CLI:** NON installato (`claude: command not found`)
- ✅ **API key:** NON configurate (nessun file .env letto/modificato)
- ✅ **n8n runtime:** NON modificato (Docker container n8n running)
- ✅ **docker-compose:** NON modificato
- ✅ **Workflow n8n:** NON modificati
- ✅ **Nodi Execute Command:** NON creati
- ✅ **Runner automatico:** NON attivato
- ✅ **App Alina:** NON toccata

## Warning/Anomalie

- **debconf frontend warning:** Normale in sessione SSH non-interattiva, non impatta l'installazione
- **4 packages can be upgraded:** Informativo da `apt update`, non richiede azione per questo task

## Conclusione

**VPS ora pronto per futuro task Claude CLI.**

- Node.js 18.19.1 installato e funzionante
- npm 9.2.0 installato e funzionante
- Requisito minimo Node.js >= 18 soddisfatto
- Claude CLI non installato (previsto, scope separato)
- API key non configurate (previsto, scope separato)
- Nessuna modifica non autorizzata al sistema

Il VPS è pronto per ricevere l'installazione di Claude Code CLI in un task futuro, soggetto a gate manuale esplicito.
