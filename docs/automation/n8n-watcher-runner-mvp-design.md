# n8n Watcher + Runner Documentale — Design MVP

## Stato

**Data:** 2026-05-12
**Task:** 0111-n8n-watcher-runner-mvp-design
**Tipo:** n8n-runner-design (docs-only)
**Allineato a:** `docs/automation/runbook.md` (Fase 2 + Fase 3), `docs/automation/permissions.md`

Questo documento descrive il design MVP per i due componenti mancanti dell'automazione Alina Lavoro:
1. **Watcher n8n** — rileva nuovi task in `docs/tasks/queue/` e attiva il runner
2. **Runner documentale** — esegue il prompt generato, commit e push

Non modifica il runtime n8n esistente. L'implementazione avviene in task separati.

---

## 1. Ruoli e componenti MVP

### 1.1 Architettura corrente (già validata)

```
Orchestratore (ChatGPT)
    → crea task in docs/tasks/queue/  (commit su GitHub)
        → n8n queue reader (manuale)
            → genera prompt in docs/tasks/processing/
            → genera sessione in docs/sessions/
        → implementatore umano/Claude Code esegue il prompt
            → commit selettivo + push
            → done marker in docs/tasks/done/
```

**Limite:** il queue reader è eseguito manualmente dal trigger. Il runner (Claude Code) richiede intervento umano per ogni task.

### 1.2 Architettura MVP (obiettivo di questo design)

```
Orchestratore (ChatGPT)
    → crea task in docs/tasks/queue/  (commit su GitHub)
        ↓
    [Watcher n8n — polling]
        → rileva nuovo task eleggibile
        → attiva queue reader (già validato)
            → genera prompt in docs/tasks/processing/
            → genera sessione in docs/sessions/
        ↓
    [Runner documentale — script VPS]
        → git pull --rebase origin main
        → legge prompt da docs/tasks/processing/{task}-cursor-prompt.md
        → esegue implementatore (Claude Code CLI o API)
        → commit selettivo su path consentiti
        → git push origin main
        → crea done marker o failed marker
        ↓
    Orchestratore legge GitHub (aggio) → verifica esito
```

### 1.3 Matrice responsabilità

| Componente | Owner | Tool | Gate umano |
|------------|-------|------|-----------|
| Crea task in queue | Orchestratore / utente | GitHub / ChatGPT | No (scrittura doc) |
| Watcher (rileva task) | n8n | Schedule Trigger | No (polling passivo) |
| Queue reader (genera prompt) | n8n | Workflow esistente | No (già validato) |
| Runner documentale (esegue prompt) | Script VPS | Claude Code CLI o Anthropic API | **Sì (MVP supervisionato)** |
| Verifica esito e done/failed | n8n + utente | Script + review | Sì |
| Deploy / tag / rollback | Utente | Sempre manuale | Sempre |

---

## 2. Trigger MVP — Polling timer

### 2.1 Scelta: polling timer n8n

**Trigger scelto: Schedule Trigger n8n (polling periodico)**

| Opzione | Fattibilità sul VPS attuale | Note |
|---------|----------------------------|------|
| **Polling timer n8n** | **Alta** — nessuna porta pubblica richiesta | Preferita |
| Webhook GitHub push | Bassa — porta 5678 non pubblica | Richiederebbe reverse proxy o tunnel permanente |

**Motivazioni:**

- Il VPS ha n8n vincolato a `127.0.0.1:5678`; nessuna porta pubblica è esposta.
- GitHub non può inviare webhook a `localhost:5678`.
- Il polling timer non richiede infrastruttura aggiuntiva.
- n8n ha già credenziali GitHub configurate per il queue reader — le stesse bastano per il polling.
- La latenza del polling (es. ogni 5 minuti) è accettabile per task documentali asincroni.

### 2.2 Configurazione polling

- **Trigger:** Schedule Trigger n8n — ogni 5 minuti (o configurabile).
- **Condizione di attivazione:** il queue reader restituisce `has_task: true`.
- **Comportamento se `has_task: false`:** il flusso si ferma al nodo `No queued task / already processing` — nessuna azione, nessun log rumoroso.

---

## 3. Runner documentale MVP

### 3.1 Opzioni implementative

Il runner deve leggere il prompt da `docs/tasks/processing/{task}-cursor-prompt.md` ed eseguirlo. Per l'MVP documentale (solo `docs/**`), le opzioni in ordine di semplicità:

| Opzione | Descrizione | Dipendenze VPS |
|---------|-------------|----------------|
| **A — Claude Code CLI** | `claude` CLI installato sul VPS, eseguito da n8n via Execute Command | `claude` installato, autenticato |
| **B — Anthropic API diretta** | n8n chiama `api.anthropic.com` via HTTP node con il contenuto del prompt | Solo chiave API in n8n |
| **C — Script shell + API** | Script bash sul VPS che chiama l'API e gestisce il commit | `curl`, `git`, `jq` (già disponibili) |

**Raccomandazione MVP: Opzione B (Anthropic API via n8n HTTP node)**

Motivazioni:
- Nessun software aggiuntivo da installare sul VPS.
- n8n gestisce già le credenziali; si aggiunge solo la chiave Anthropic come credenziale n8n.
- Il prompt è già un testo strutturato pronto per l'API.
- Per task docs-only, la risposta può essere scritta direttamente come file tramite nodi n8n GitHub.
- Opzione A (Claude Code CLI) è preferibile a lungo termine per task più complessi, ma richiede installazione sul VPS.

### 3.2 Flusso runner documentale MVP (Opzione B)

```
[n8n: queue reader ha_task:true]
    ↓
[n8n: legge prompt da processing/{task}-cursor-prompt.md via GitHub API]
    ↓
[n8n: chiama Anthropic API con il prompt]
    ↓
[n8n: interpreta risposta — file da creare/modificare]
    ↓
[n8n: per ogni file: crea/aggiorna su GitHub via API]
    → commit message derivato dal task
    ↓
[n8n: verifica esito]
    ├→ successo → crea done marker in docs/tasks/done/
    └→ fallimento → crea failed marker in docs/tasks/failed/
    ↓
[n8n: aggiorna sessione automation]
```

**Vincolo critico:** il runner MVP opera **solo** su path elencati nel task come `Allowed paths`. Se la risposta dell'API tenta di scrivere fuori da questi path, il nodo deve rifiutare e marcare il task come failed.

### 3.3 Flusso runner documentale MVP (Opzione A — Claude Code CLI, futuro)

Per quando Claude Code CLI è installato sul VPS:

```
[n8n: Execute Command node]
    → ssh ionos-n8n "cd /repo && git pull --rebase origin main"
    → ssh ionos-n8n "claude < docs/tasks/processing/{task}-cursor-prompt.md"
    → ssh ionos-n8n "git add [path consentiti] && git commit -m '...' && git push"
```

Questa opzione richiede:
- Repository clonato sul VPS.
- Claude Code CLI installato e autenticato (`~/.claude/`).
- SSH configurato tra n8n container e host VPS (o esecuzione diretta nel container).

### 3.4 Commit e push

In entrambe le opzioni:
- Commit selettivo: solo i file elencati in `Allowed paths` del task.
- Mai `git add .`.
- Push su `origin main`.
- Messaggio di commit derivabile dal tipo task e dall'ID (es. `automation: complete task 0111`).

---

## 4. Gate manuali obbligatori

Il runner MVP documentale **non può** eseguire le seguenti operazioni senza conferma esplicita dell'utente:

| Operazione | Gate |
|------------|------|
| Deploy Apps Script (`clasp push`, `clasp deploy`) | Sempre manuale |
| Tag Git (`v*-stable`) | Sempre manuale |
| Rollback deployment | Sempre manuale |
| Modifica `src/**` | Richiede task frontend esplicito con `Files allowed` |
| Modifica `gas-current/**`, `appsscript.json`, `package.json` | Sempre manuale |
| Eliminazione file applicativi | Sempre manuale |
| Credenziali nel repository | Mai automatico |
| Export JSON n8n non redatto | Mai automatico |
| Operazioni su Google Sheet schema | Sempre manuale |
| Task con tipo diverso da docs-only o basso rischio | Gate manuale prima dell'esecuzione |

**Regola operativa:** se il runner riceve un task che richiede operazioni fuori scope, deve fermarsi, creare un failed marker con `failure_reason: out_of_scope`, e notificare l'orchestratore.

---

## 5. Scope MVP — solo docs-only

In coerenza con `docs/automation/permissions.md`:

**Il runner MVP opera solo su task che soddisfano tutte queste condizioni:**

- `Type`: `docs-only`, `n8n-design`, `vps-maintenance-planning`, `vps-hardening-planning`, o equivalente a basso rischio.
- `Deploy: no` nel metadata.
- `Allowed paths` elencati esplicitamente e limitati a `docs/**`.
- Nessun path in `Forbidden paths` che includa `src/**`, `gas-current/**`, ecc.

**Il runner deve verificare** questi metadata prima di eseguire qualsiasi operazione. Se i metadata non soddisfano le condizioni, il task va a `failed/` con motivazione esplicita.

---

## 6. Notifiche e supervisione MVP

Per la fase MVP, il runner opera in modalità **supervisionata**:

- Ogni esecuzione genera un log/sessione leggibile.
- L'orchestratore verifica con `aggio` dopo ogni ciclo.
- Non esiste fire-and-forget: ogni ciclo ha un esito tracciato (done o failed).
- La notifica all'utente avviene tramite il commit su GitHub (visibile nell'interfaccia) e/o tramite il log di sessione.

Per una notifica più attiva (email/Telegram/Slack secondo Fase 2 del runbook), si può aggiungere un nodo n8n di notifica dopo il ciclo — ma non è obbligatorio per il MVP.

---

## 7. Rischi e mitigazioni

| Rischio | Probabilità | Impatto | Mitigazione attiva |
|---------|-------------|---------|-------------------|
| Doppia esecuzione sullo stesso task | Media | Alto | Skip `processing/` già validato nel queue reader |
| Push race tra n8n e operatore umano | Bassa | Medio | `git pull --rebase` prima di ogni push |
| Runner marca done senza lavoro reale | Bassa | Alto | Verifica file creati prima di creare done marker |
| Prompt genera file fuori da Allowed paths | Bassa | Alto | Validazione path prima di ogni write |
| Credenziali API esposte nel repo | Bassa | Critico | Credenziali solo in n8n, mai in commit |
| Runner fallisce silenziosamente | Media | Alto | Failed marker esplicito con `failure_reason`; sessione aggiornata |
| Task non docs-only passano al runner | Bassa | Alto | Validazione metadata `Type` e `Deploy` prima dell'esecuzione |
| n8n polling accumulato (molti task insieme) | Bassa | Medio | Un task alla volta (queue reader già serializzato) |

---

## 8. Sequenza di implementazione raccomandata

Questo design non implementa nulla. La sequenza operativa raccomandata per i task successivi è:

1. **Task 0112 (futuro):** implementare watcher n8n — Schedule Trigger + chiamata queue reader.
2. **Task 0113 (futuro):** implementare runner documentale MVP — Opzione B (Anthropic API via n8n) o Opzione A (Claude Code CLI).
3. **Task 0114 (futuro):** test end-to-end con un task docs-only di basso rischio in ambiente supervisionato.
4. **Task 0115+ (futuro):** estensione a task frontend (Fase 4 runbook) solo dopo validazione MVP.

Ogni task di implementazione richiede:
- Gate manuale prima del primo run non supervisionato.
- Sessione di validazione dedicata.
- Nessun fire-and-forget prima che il ciclo completo sia verificato.

---

## 9. Allineamento runbook

| Fase runbook | Stato |
|-------------|-------|
| Fase 1 — Struttura `docs/tasks` | **Completata** |
| Fase 2 — Watcher n8n (MVP) | **Design completato** (questo documento); implementazione in task futuri |
| Fase 3 — Runner documentale | **Design completato** (questo documento); implementazione in task futuri |
| Fase 4 — Runner frontend basso rischio | Non avviata |
| Fase 5 — Deploy semi-automatico | Non avviata |
| Fase 6 — Multi-progetto | Non avviata |

---

*Documenti correlati: [`runbook.md`](./runbook.md) · [`permissions.md`](./permissions.md) · [`n8n-workflows/queue-reader.md`](./n8n-workflows/queue-reader.md) · [`n8n-workflows/lifecycle-ownership.md`](./n8n-workflows/lifecycle-ownership.md)*
