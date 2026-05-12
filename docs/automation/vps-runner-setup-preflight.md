# VPS Runner Setup — Preflight Fase 3A

**Data:** 2026-05-12
**Status:** Documento di preflight — solo su carta. Nessuna installazione. Nessuna configurazione.
**Task:** 0119-vps-runner-setup-preflight-docs-only
**Gate decision di riferimento:** `docs/automation/runner-phase3-gate-decision.md`
**Design Fase 3 di riferimento:** `docs/automation/runner-phase3-design.md`

---

## 1. Compatibilità Claude Code CLI con VPS

### Requisiti di sistema

Claude Code CLI (`@anthropic-ai/claude-code`) è un pacchetto Node.js. I requisiti minimi
di sistema sono:

| Requisito | Valore minimo | Note |
|-----------|--------------|------|
| Node.js | ≥ 18.x (LTS consigliato) | Verificare con `node --version` |
| npm | ≥ 9.x | In genere allineato a Node.js LTS |
| Architettura | x86_64 (amd64) | VPS IONOS standard — compatibile |
| Sistema operativo | Linux (Ubuntu, Debian, altri) | Ubuntu 24.04.4 LTS — compatibile |
| Accesso internet | Necessario per chiamate API Anthropic | Il VPS ha connettività outbound |
| RAM minima | ~512 MB per il processo Node.js | Il VPS ha RAM sufficiente (verificare sezione 2) |
| Spazio disco | ~200 MB per installazione npm global | Verificare spazio libero (sezione 2) |

### Compatibilità con Ubuntu 24.04.4 LTS (kernel 6.8.0-111-generic)

Ubuntu 24.04.4 LTS include Node.js 20.x nei repository ufficiali (LTS al momento della
release). In alternativa, è possibile usare `nvm` (Node Version Manager) per installare
una versione specifica senza toccare il sistema.

**Metodo consigliato:** `nvm` + Node.js 20 LTS, per isolare la versione Node dal sistema.

Vantaggi di `nvm` rispetto al pacchetto di sistema:
- Versione Node.js controllata e aggiornabile senza `sudo`.
- Nessun conflitto con pacchetti di sistema.
- Rollback semplice: basta cambiare versione `nvm`.

**Metodo alternativo:** `npm install -g @anthropic-ai/claude-code` con il Node.js di sistema.

Compatibilità kernel 6.8.0-111-generic: nessun problema noto per applicazioni Node.js.
Il kernel è recente e supporta pienamente le syscall usate da Node.js.

### Installazione (non eseguire — solo riferimento)

```bash
# Opzione A: tramite nvm (consigliata)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
npm install -g @anthropic-ai/claude-code

# Opzione B: tramite npm di sistema (più semplice, meno flessibile)
npm install -g @anthropic-ai/claude-code
```

**Nota:** questi comandi NON devono essere eseguiti in questo task. Sono riportati solo
come riferimento per il task di setup futuro.

### Esecuzione headless (stdin/stdout)

Claude Code CLI supporta l'esecuzione non interattiva tramite il flag `--print` (o `-p`),
che legge il prompt da stdin e scrive l'output su stdout senza aprire una sessione
interattiva. Esempio:

```bash
echo "Scrivi un breve documento di test" | claude --print
# oppure
claude --print < prompt.md
```

Questa modalità è compatibile con l'esecuzione via SSH da n8n, dove non è disponibile
un terminale interattivo (TTY).

**Verifica headless:** da testare nel task read-only VPS con un prompt minimale.

### Limitazioni note

| Limitazione | Dettaglio | Impatto su Fase 3A |
|-------------|-----------|-------------------|
| Context window | ~200K token (Claude Sonnet 4.x) | Sufficiente per task docs-only |
| Sessione stateless | Ogni invocazione `--print` è indipendente | OK — i task docs-only sono autocontenuti |
| Timeout processo | Dipende dal sistema operativo e da n8n | Impostare timeout SSH 120s (sezione 5) |
| Rate limit API | Limiti per minuto/giorno Anthropic | Poco rilevante con frequenza bassa (sezione 3) |
| Output non deterministico | Claude può variare l'output | Gate review in Fase 3A mitiga il rischio |
| Autenticazione | API key richiesta come `ANTHROPIC_API_KEY` | Configurare come segreto VPS (sezione 5) |

---

## 2. Checklist comandi read-only futuri

Questi comandi potranno essere eseguiti via SSH in un futuro task `vps-runner-read-only-check`
per verificare l'ambiente VPS prima dell'installazione. **Non eseguire in questo task.**

### Ambiente sistema

```bash
uname -a                          # kernel, architettura, hostname
lsb_release -a                    # distribuzione e versione OS
cat /etc/os-release               # alternativa a lsb_release
```

### Node.js e npm

```bash
node --version                    # versione Node.js installata
npm --version                     # versione npm installata
which node                        # path eseguibile node
which npm                         # path eseguibile npm
nvm --version 2>/dev/null || echo "nvm non installato"
```

### Claude Code CLI

```bash
which claude 2>/dev/null || echo "claude CLI non installato"
claude --version 2>/dev/null || echo "claude CLI non installato"
```

### Risorse hardware

```bash
free -m                           # RAM totale, usata, disponibile (MB)
df -h /                           # spazio disco root
df -h /root                       # spazio disco home root
nproc                             # numero CPU disponibili
```

### Rete e connettività

```bash
curl -s -o /dev/null -w "%{http_code}" https://api.anthropic.com/health 2>/dev/null || echo "connettività API da verificare"
```

### Docker e n8n

```bash
docker --version                  # versione Docker
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"  # container attivi
curl -s -o /dev/null -w "%{http_code}" http://localhost:5678/healthz  # health n8n
```

### SSH e permessi

```bash
whoami                            # utente corrente
id                                # UID, GID, gruppi
ls -la /root/                     # contenuto home root (verifica directory runner)
```

**Nota:** i risultati di questi comandi andranno documentati nella sessione del task
`vps-runner-read-only-check`, mai committati se contengono path o configurazioni sensibili.

---

## 3. Stima costo token per task docs-only tipo

### Modello di riferimento

**Claude Sonnet 4.x** (modello usato da Claude Code CLI per default al momento della
scrittura di questo documento).

Tariffe pubbliche Anthropic (riferimento orientativo — verificare dashboard Anthropic
prima dell'attivazione del runner):

| Categoria | Tariffa |
|-----------|---------|
| Input token | $3.00 / 1M token |
| Output token | $15.00 / 1M token |

### Stima token per task docs-only tipo

Basata su task simili già eseguiti (0117, 0118, 0119):

**Input token stimati per task:**

| Componente | Stima token |
|------------|-------------|
| System prompt + CLAUDE.md | ~3.000 |
| Documenti letti (PROJECT_STATE, CHECKPOINT, 2-3 docs automation) | ~15.000 |
| Task file (queue) | ~2.000 |
| Processing prompt n8n | ~1.000 |
| Overhead conversazione Claude Code | ~2.000 |
| **Totale input stimato** | **~23.000** |

**Output token stimati per task:**

| Componente | Stima token |
|------------|-------------|
| Documento principale prodotto (~200 righe) | ~3.000 |
| Done marker | ~300 |
| Aggiornamenti PROJECT_STATE / CHECKPOINT | ~500 |
| **Totale output stimato** | **~3.800** |

**Costo stimato per task:**

| Voce | Calcolo | Costo |
|------|---------|-------|
| Input | 23.000 × $3 / 1.000.000 | $0,069 |
| Output | 3.800 × $15 / 1.000.000 | $0,057 |
| **Totale per task** | | **~$0,13** |

### Stima mensile

| Scenario | Task/giorno | Task/mese | Costo/mese |
|----------|-------------|-----------|-----------|
| Basso | 1 | 30 | ~$3,90 |
| Medio | 3 | 90 | ~$11,70 |
| Picco | 5 | 150 | ~$19,50 |

**Incertezza:** la stima è orientativa con margine ±50%. I task con più documenti da
leggere o output più lunghi possono costare il doppio. È necessario monitorare
attivamente nelle prime sessioni e aggiornare la stima dopo i primi 10 task reali.

---

## 4. Proposta budget mensile e soglie di stop

### Budget proposto

| Parametro | Valore proposto | Note |
|-----------|----------------|------|
| Budget mensile | $25 USD | Copre il picco stimato (150 task) con margine |
| Soglia di allerta (80%) | $20 USD | Notifica manuale → review frequenza e costo/task |
| Soglia di stop (100%) | $25 USD | Blocco runner automatico fino a review orchestratore |
| Periodo di revisione | Fine mese (o al superamento della soglia) | |

### Meccanismo di monitoraggio

**Fase 3A (supervisionata):**
- Consultare la dashboard Anthropic manualmente dopo ogni sessione supervisionata.
- Annotare il costo effettivo nel done marker o nella sessione di chiusura del task.
- Confrontare con la stima sezione 3 per calibrare.

**Fase 3B (futura, direct commit):**
- Valutare alerting automatico via n8n: nodo HTTP → API Anthropic usage → confronto soglia.
- Alternativa: script bash di check-costo eseguito prima del runner, che blocca se il
  consumo del mese supera la soglia.

### Approvazione budget

Il budget proposto ($25/mese) **richiede conferma esplicita dell'orchestratore** prima
dell'attivazione del runner automatico. La conferma avverrà in un task dedicato, non
in questo documento.

**Chiave API dedicata:** il costo del runner deve essere separato dall'uso personale
della API key. Creare una chiave API Anthropic dedicata con limite di spesa mensile
configurato nella dashboard Anthropic (funzione "Usage limits" se disponibile).

---

## 5. Design nodo SSH exec n8n (solo su carta)

### Contesto infrastruttura

n8n e il VPS sono sulla stessa macchina fisica. L'esecuzione può avvenire:
- **Via SSH loopback** (`127.0.0.1`): simulazione SSH completa, richiede SSH server attivo.
- **Via Execute Command** (nodo n8n locale): esecuzione shell diretta senza SSH, più
  semplice ma meno isolata.

**Raccomandazione:** usare il **nodo Execute Command** di n8n per i primi test in Fase 3A,
poiché n8n e il runner sono sulla stessa macchina. SSH loopback è ridondante e aggiunge
complessità. Valutare SSH reale solo se il runner viene spostato su una macchina separata.

### Design nodo Execute Command n8n

| Campo | Valore proposto | Note |
|-------|----------------|------|
| Tipo nodo | **Execute Command** | Disponibile in n8n community edition |
| Comando | `bash -c "cd /root/alina-runner && ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY claude --print < current-prompt.md 2>&1"` | Da raffinare nel task setup |
| Working directory | `/root/alina-runner/` | Directory dedicata al runner (da creare nel task setup) |
| Variabile env | `ANTHROPIC_API_KEY` come credential n8n | Mai in chiaro nel nodo |
| Timeout | 120 secondi | Task docs-only non dovrebbero superare 2 min |
| Exit code 0 | Successo → nodo successivo: crea done marker | |
| Exit code ≠ 0 | Fallimento → nodo failed: crea failed marker | |
| stdout | Catturato da n8n → salvato in sessione `docs/sessions/` | |
| stderr | Catturato da n8n → salvato in sessione (filtrato da segreti) | Mai loggare valori `ANTHROPIC_API_KEY` |

### Flusso n8n Fase 3A (su carta)

```text
Schedule Trigger (5 min)
→ Queue reader: seleziona task eleggibile
→ IF has_task: true
    → Leggi cursor prompt da processing/
    → Scrivi prompt in /root/alina-runner/current-prompt.md
    → Execute Command: claude --print < current-prompt.md
    → IF exit code == 0
    │   → Crea done marker (GitHub API)
    │   → Aggiorna sessione con esito OK
    │   → Notifica (opzionale)
    └→ IF exit code != 0
        → Crea failed marker (GitHub API)
        → Salva log errore in sessione
        → Notifica manuale obbligatoria
```

### Gestione segreti

- **ANTHROPIC_API_KEY:** configurare come **credential n8n** (tipo "Generic Credential"
  con campi nome/valore). Il nodo Execute Command riceve la variabile senza esporla nel
  log del workflow n8n.
- **Mai** inserire la chiave in chiaro nel campo "Command" del nodo.
- **Log filtro:** prima di salvare stderr in `docs/sessions/`, filtrare qualsiasi riga
  che contenga `ANTHROPIC` o `API_KEY` o `Bearer`.

### Rollback / disabilitazione

- Disabilitare il nodo Execute Command nel workflow n8n: il workflow continua a girare
  ma non esegue il runner (fallisce silenziosamente o con errore gestito).
- Alternativa: aggiungere un nodo IF di controllo "runner_enabled" (valore booleano da
  segreto n8n) che bypassa l'Execute Command quando `false`.
- Reversibile in < 1 minuto dall'interfaccia n8n.

---

## 6. Allowlist path runner

Path che il runner automatico (Claude Code CLI via Execute Command n8n) può leggere
e/o scrivere nel repository. Da passare al runner come istruzione di sistema o tramite
CLAUDE.md runner-specific.

| Path | Operazione | Motivazione |
|------|-----------|-------------|
| `docs/tasks/queue/` | Lettura | Selezione task eleggibile |
| `docs/tasks/processing/` | Lettura prompt; scrittura opzionale | Lettura cursor prompt; eventuale aggiornamento |
| `docs/tasks/done/` | Scrittura done marker | Chiusura task completato |
| `docs/tasks/failed/` | Scrittura failed marker | Chiusura task fallito |
| `docs/sessions/` | Scrittura sessione esito | Tracciabilità run |
| `docs/PROJECT_STATE.md` | Lettura + scrittura | Aggiornamento stato progetto |
| `docs/CHECKPOINT.md` | Lettura + scrittura | Aggiornamento checkpoint |
| `docs/automation/` | Scrittura documenti design docs-only | Output task tipo runner-phase3-gate-decision |
| `docs/roadmap.md` | Lettura opzionale | Contesto progetto |
| `CLAUDE.md` | Lettura | Regole progetto |

**Istruzione da passare al runner (bozza):**

```text
Sei il runner automatico docs-only di Alina Lavoro.
Puoi modificare solo file sotto: docs/tasks/done/, docs/tasks/failed/,
docs/sessions/, docs/PROJECT_STATE.md, docs/CHECKPOINT.md, docs/automation/.
Non modificare mai: src/, gas-current/, .gas/, appsscript.json, package.json,
.clasp.json, .github/workflows/, o file con credenziali/token/chiavi.
Non fare deploy, non creare tag, non fare rollback.
Non usare git add . — usa sempre commit selettivo.
```

---

## 7. Denylist assoluta

Path che il runner automatico non deve mai toccare, indipendentemente dal contenuto
del task o del prompt.

| Path | Motivazione |
|------|-------------|
| `src/**` | Codice applicativo — solo manuale |
| `gas-current/**` | Snapshot deploy — solo manuale |
| `.gas/**` | Build locale — mai nel runner |
| `appsscript.json` | Manifest Apps Script — solo manuale |
| `package.json` | Dipendenze e versione — solo manuale |
| `package-lock.json` | Lock file — solo manuale |
| `.clasp.json` | Config locale — mai nel repo |
| `.github/workflows/**` | Workflow CI/CD — approvazione esplicita separata |
| `.env`, `.env.*` | Variabili d'ambiente — mai nel repo |
| Qualsiasi file contenente `token`, `key`, `secret`, `password` nel nome | Segreti — mai nel runner output |

**Meccanismo di enforcement:**
- Il runner riceve l'istruzione esplicita nella sezione 6.
- Post-run: il nodo n8n verifica `git diff --stat` e blocca il commit se compaiono
  path fuori allowlist (da implementare nel task setup).
- In Fase 3A: review manuale del diff prima di ogni push.

---

## 8. Piano Fase 3A supervisionata

### Obiettivo

Validare il runner automatico su almeno 3 task dummy prima di autorizzare il direct
commit autonomo su `main` (Fase 3B).

### Sequenza obbligatoria

**Step 1 — Setup ambiente runner (task separato, non questo):**
- Creare directory `/root/alina-runner/` sul VPS.
- Installare Claude Code CLI (`npm install -g @anthropic-ai/claude-code`).
- Configurare `ANTHROPIC_API_KEY` come credential n8n.
- Configurare nodo Execute Command nel workflow n8n (draft sezione 5).
- Gate: test manuale dell'Execute Command con prompt minimale ("scrivi 'hello'").

**Step 2 — Task dummy #1 (branch separato o dry-run):**
- Creare task docs-only minimale: aggiungere una riga a un file non critico in `docs/`.
- Runner esegue il task su un branch `runner/test-1` (non `main`).
- Review manuale del diff: solo path autorizzati, contenuto corretto.
- Gate: approvazione orchestratore prima del merge.

**Step 3 — Task dummy #2 e #3:**
- Ripetere con task docs-only leggermente più complessi.
- Verificare allowlist, costo token effettivo, log corretto, failed marker in caso di
  errore simulato.

**Step 4 — Gate Fase 3B:**
- Dopo 3 task dummy OK: l'orchestratore approva esplicitamente il direct commit su `main`
  in un task dedicato `runner-phase3b-gate`.
- Solo allora il runner può committare direttamente su `main` senza review manuale.

### Criteri di promozione Fase 3A → Fase 3B

| Criterio | Soglia | Verificato da |
|----------|--------|---------------|
| Task supervisionati con esito OK | ≥ 3 | Orchestratore |
| Errori runner in Fase 3A | 0 (o tutti tracciati) | Log sessioni |
| Diff ogni task: solo path autorizzati | Verificato ogni run | `git diff --stat` |
| Costo token effettivo approvato | Sì | Dashboard Anthropic |
| Budget mensile approvato | Sì | Gate orchestratore |
| Gate esplicito Fase 3B | Sì | Task `runner-phase3b-gate` |

---

## 9. Rischi e mitigazioni

| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| **Runaway token** — task mal formato produce output enorme o loop | Bassa | Alto costo | Timeout SSH 120s; max 1 task/run; soglia di stop $25/mese |
| **Timeout SSH/Execute Command** — task lento → stato indefinito | Media | Medio | Gestione exit code ≠ 0 → failed marker automatico; log errore in sessione |
| **Output non autorizzato** — runner tocca path fuori allowlist | Bassa | Alto | Istruzione allowlist esplicita; verifica `git diff --stat` post-run; review manuale in Fase 3A |
| **Leak segreti nel log** — API key compare in stderr | Bassa | Alto | Filtro stderr prima di salvare in `docs/sessions/`; mai loggare variabili d'ambiente |
| **Loop n8n/GitHub** — push del runner riattiva il workflow | Bassa | Alto | Trigger solo Schedule (non su push); anti-doppio-run su `processing/` già validato in Fase 2 |
| **Fallimento parziale** — commit a metà (done marker senza aggiornamento stato) | Bassa | Medio | Sequenza atomica: done marker solo dopo verifica `git status --short` pulito e push OK |
| **Drift allowlist** — nuovi file aggiunti al repo non considerati nel runner | Media | Medio | Review allowlist a ogni nuovo tipo di task; aggiornare istruzione runner in CLAUDE.md |
| **Costo imprevisto** — tariffa Anthropic cambia o task più pesanti del previsto | Media | Medio | Monitoraggio dashboard; soglia allerta $20; stima aggiornata dopo prime 10 sessioni |
| **CLI non aggiornata** — versione `claude` CLI deprecata o con bug | Bassa | Basso | Pinning versione npm (`npm install -g @anthropic-ai/claude-code@X.Y.Z`); aggiornamento manuale pianificato |
| **Errore GitHub API** — push del runner fallisce (409, rate limit) | Bassa | Medio | `git pull --rebase` prima di ogni push; retry manuale documentato in failed marker |

---

## 10. Criteri per il task successivo

Il task successivo a 0119 **richiede approvazione esplicita dell'orchestratore** prima
di essere creato. Non procedere senza gate.

### Opzione A — raccomandata: `vps-runner-read-only-check` (tipo `vps-preflight-readonly`)

**Cosa fa:** esegue via SSH (o login diretto) solo i comandi della checklist sezione 2
sul VPS reale, per raccogliere le informazioni sull'ambiente.

**Non fa:** nessuna installazione, nessuna configurazione, nessun runner automatico.

**Prerequisiti:**
- Gate orchestratore esplicito.
- Conferma utente prima dell'SSH exec (PRIORITÀ 0 — azione manuale).
- Risultati documentati in sessione dedicata, mai committati se sensibili.

**Output atteso:** documento `docs/automation/vps-environment-check.md` con i risultati
dei comandi read-only.

### Opzione B — successiva ad A: `vps-runner-cli-install` (tipo `vps-setup`)

**Cosa fa:** installa Claude Code CLI sul VPS e verifica che `claude --print` funzioni
con un prompt minimale.

**Non fa:** nessuna configurazione API key nel runner, nessun nodo n8n attivo.

**Prerequisiti:**
- Opzione A completata e approvata.
- Budget mensile approvato dall'orchestratore.
- API key dedicata Anthropic creata (separata dall'account personale).
- Gate orchestratore esplicito per ogni step.

### Non autorizzato senza gate esplicito

- Configurazione API key nel runner o in n8n.
- Attivazione nodo Execute Command in n8n.
- Qualsiasi runner automatico.
- Direct commit su `main` da runner.

---

## Riepilogo stato

| Dimensione | Stato |
|------------|-------|
| Compatibilità CLI con Ubuntu 24.04.4 LTS | Verificata teoricamente ✓ |
| Checklist comandi read-only | Definita ✓ (da eseguire in task futuro) |
| Stima costo token | ~$0,13/task; ~$11,70/mese (scenario medio) ✓ |
| Budget proposto | $25/mese con soglia stop ✓ (richiede approvazione orchestratore) |
| Design nodo Execute Command n8n | Definito su carta ✓ (da implementare in task setup) |
| Allowlist path runner | Definita ✓ |
| Denylist assoluta | Definita ✓ |
| Piano Fase 3A supervisionata | Definito ✓ |
| Rischi e mitigazioni | Documentati ✓ |
| Criteri task successivo | Definiti ✓ |
| Installazioni eseguite | Nessuna ✓ |
| Modifiche VPS/n8n | Nessuna ✓ |
| Runner automatico attivato | No ✓ |
