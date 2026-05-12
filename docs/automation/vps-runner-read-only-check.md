# VPS Runner Read-Only Check

**Data:** 2026-05-12  
**Task:** 0120-vps-runner-read-only-check  
**Tipo:** vps-preflight-readonly  
**Eseguito da:** Windsurf/Cascade (reserve implementer)  
**Stato:** completato

## Scopo

Verifica read-only dello stato attuale del VPS per il futuro setup del runner documentale. Nessuna modifica eseguita sul VPS.

## Comandi eseguiti

| Categoria | Comando | Scopo |
|-----------|---------|-------|
| Sistema | `uname -a` | Kernel e architettura |
| Sistema | `cat /etc/os-release` | Distribuzione OS |
| Sistema | `whoami` | Utente corrente |
| Sistema | `id` | Gruppi utente |
| Sistema | `nproc` | Numero CPU |
| Node | `node --version` | Versione Node.js |
| Node | `npm --version` | Versione npm |
| Node | `which node` | Percorso Node |
| Node | `which npm` | Percorso npm |
| Claude | `which claude` | Presenza Claude CLI |
| Claude | `claude --version` | Versione Claude CLI |
| Risorse | `free -m` | Memoria RAM |
| Risorse | `df -h /` | Spazio disco root |
| Risorse | `df -h /root` | Spazio disco home |
| Docker | `docker --version` | Versione Docker |
| Docker | `docker ps` | Container attivi |
| n8n | `curl -s -o /dev/null -w "%{http_code}" http://localhost:5678/healthz` | Health check n8n |
| Filesystem | `ls -la /root/` | Contenuto directory root |

## Output sintetico e sanitizzato

### Sistema operativo

- **OS:** Ubuntu 24.04.4 LTS (Noble Numbat)
- **Kernel:** Linux 6.8.0-111-generic #111-Ubuntu SMP PREEMPT_DYNAMIC
- **Architettura:** x86_64
- **User:** root (uid=0)
- **CPU:** 4 cores

### Stato Node.js / npm

- **Node.js:** NON installato
- **npm:** NON installato
- **Percorso node:** N/A
- **Percorso npm:** N/A

### Stato Claude CLI

- **Claude CLI:** NON installato
- **Percorso claude:** N/A

### Risorse sistema

| Risorsa | Valore |
|---------|--------|
| RAM totale | 3.8 GB |
| RAM usata | 986 MB |
| RAM available | ~2.8 GB |
| Swap | 0 MB |
| Disco totale | 116 GB |
| Disco usato | 4.9 GB (5%) |
| Disco available | 111 GB |

### Stato Docker

- **Docker version:** 29.1.3
- **Container attivi:** 1

| Container | Image | Status | Ports | Names |
|-----------|-------|--------|-------|-------|
| n8n | docker.n8n.io/n8nio/n8n | Up 4 hours | 127.0.0.1:5678->5678/tcp | root-n8n-1 |

### Stato n8n

- **Health check:** HTTP 200 OK
- **Binding:** 127.0.0.1:5678 (localhost-only, coerente con hardening)
- **Container:** in esecuzione da 4 ore

### Filesystem /root

Directory /root contiene file standard di configurazione shell (.bashrc, .profile, .bash_history) e:

- `docker-compose.yaml` - configurazione Docker Compose
- `docker-compose.yaml.bak-20260512-005104` - backup configurazione
- `.env` - file environment (non letto, presumibilmente contiene segreti)
- `.ssh/` - directory SSH keys
- `local-files/` - directory dati locali

**Nota:** file `.env` non è stato letto in ottemperanza alle regole di sicurezza.

## Analisi e note

### Warning identificati

1. **Node.js non installato:** richiesto per il futuro runner documentale con Claude Code CLI
2. **Claude CLI non installato:** tool principale del runner non presente
3. **File .env presente:** potenziale contenitore di segreti, non esplorato

### Stato idoneità runner

| Componente | Stato | Azione richiesta |
|------------|-------|------------------|
| OS Ubuntu 24.04 | ✅ OK | Nessuna |
| RAM 3.8GB | ✅ OK | Nessuna |
| Disco 116GB | ✅ OK | Nessuna |
| Docker | ✅ OK | Nessuna |
| n8n | ✅ OK | Nessuna |
| Node.js | ❌ Mancante | Installazione richiesta |
| Claude CLI | ❌ Mancante | Installazione richiesta |
| API key | ❌ Non configurata | Setup richiesto |

## Conclusione

**Idoneità VPS:** Il VPS è idoneo come piattaforma hardware/OS per il runner documentale, ma richiede l'installazione di Node.js, Claude Code CLI e la configurazione di API key dedicata prima di poter essere operativo.

**Nessuna modifica eseguita:** Tutti i comandi eseguiti sono stati di sola lettura. Nessuna installazione, upgrade, reboot, modifica file, creazione directory, modifica docker-compose, modifica n8n, configurazione API key, test Claude API o attivazione runner automatica è stata eseguita.

## Conferma vincoli

- ✅ Solo comandi read-only eseguiti
- ✅ Nessuna installazione
- ✅ Nessun upgrade
- ✅ Nessun reboot
- ✅ Nessuna modifica file VPS
- ✅ Nessuna creazione directory
- ✅ Nessuna modifica docker-compose
- ✅ Nessuna modifica n8n
- ✅ Nessuna configurazione API key
- ✅ Nessun test Claude API
- ✅ Nessun runner automatico attivato

---
**Verifica completata - VPS pronto per setup futuro**
