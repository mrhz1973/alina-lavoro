# Sessione — Task 0109 VPS n8n maintenance check

**Data:** 2026-05-12
**Task:** 0109-vps-n8n-maintenance-check
**Tipo:** vps-maintenance-planning
**Eseguito da:** utente (verifica manuale VPS) + Claude Code (documentazione chiusura)
**Stato:** completato

## Obiettivo

Verificare lo stato del VPS IONOS e del servizio n8n in modalità read-only, senza applicare aggiornamenti né modificare il sistema. Task di tipo manutenzione pianificata con gate manuale obbligatorio prima di qualsiasi intervento.

## Dati sistema verificati

- **OS:** Ubuntu 24.04.4 LTS
- **Kernel:** Linux 6.8.0-111-generic
- **Hostname:** ubuntu
- **Virtualizzazione:** kvm
- **Uptime:** circa 1 giorno e 9 ore
- **Load average:** 0.02, 0.01, 0.00 — carico minimo
- **RAM:** 3.8 GiB totali; circa 1.0 GiB usati; circa 2.8 GiB disponibili
- **Swap:** 0
- **Disco root:** 4.9G usati su 116G — circa 5%

## Stato servizio n8n

- n8n **non** è gestito da systemd: `Unit n8n.service could not be found`
- n8n gira in **Docker**:
  - Container: `root-n8n-1`
  - Image: `docker.n8n.io/n8nio/n8n`
  - Status: **Up** circa 34 ore
  - Port binding: `0.0.0.0:5678->5678/tcp` e `[::]:5678->5678/tcp`
  - Docker inspect binding: `{"5678/tcp":[{"HostIp":"","HostPort":"5678"}]}`

## Stato porta 5678 e firewall

- **ufw:** inattivo
- **Test esterno** (IP pubblico VPS su porta 5678): non raggiungibile dal browser
- **Test locale:** `curl -I http://localhost:5678` → `HTTP/1.1 200 OK`
- Interpretazione: n8n risponde correttamente in locale; il mancato accesso esterno è dovuto presumibilmente al firewall del provider (IONOS), non a ufw.

## Aggiornamenti disponibili

Pacchetti aggiornabili rilevati (non installati):

- `libheif-plugin-aomdec`
- `libheif-plugin-aomenc`
- `libheif-plugin-libde265`
- `libheif1`

Tutti relativi alla libreria libheif (codec immagini). Non urgenti, non direttamente correlati a n8n.

## Reboot

- `reboot: no reboot required`
- Nessun reboot eseguito.

## Conclusione

Manutenzione read-only completata. VPS in stato sano:

- Carico, RAM e disco: OK
- n8n: attivo in Docker, risponde localmente su porta 5678
- Aggiornamenti disponibili: non urgenti, nessun impatto su n8n
- Nessun intervento applicato

## Rischio futuro documentato

Docker espone n8n su `0.0.0.0:5678` (tutti gli indirizzi) e ufw è inattivo. L'accesso esterno sembra bloccato dal firewall del provider IONOS, ma la configurazione ideale è:

- vincolare il binding di n8n a `127.0.0.1:5678` nel `docker-compose.yml`, oppure
- attivare ufw con regola esplicita di blocco sulla porta 5678 dall'esterno, oppure
- verificare e documentare la regola firewall del provider IONOS.

**Non corretto in questa sessione.** Intervento da pianificare in un task separato con gate manuale esplicito.

## Esclusioni

- Nessun `apt upgrade` eseguito
- Nessun reboot eseguito
- Nessuna modifica a n8n runtime
- Nessuna modifica ai workflow n8n
- Nessuna modifica app Alina (`src/**`)
- Nessun deploy Apps Script
- Nessun tag o rollback
- Nessun export JSON n8n
- Nessuna credenziale o token documentati

---
**Sessione completata — VPS n8n maintenance check read-only**
