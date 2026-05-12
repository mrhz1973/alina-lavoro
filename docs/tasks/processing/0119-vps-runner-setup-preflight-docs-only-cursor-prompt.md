@docs/roadmap.md
@docs/STREAMLINED_WORKFLOW.md
@docs/ORCHESTRATOR_RULES.md
@docs/AI_RULES.md
@docs/WORKFLOW.md
@docs/CHECKPOINT.md
@docs/PROJECT_STATE.md
@docs/COMMANDS.md

AGENT MODE.

Task source:
docs/tasks/queue/0119-vps-runner-setup-preflight-docs-only.md

Project:
Alina Lavoro

Type:
docs-only

Priority:
normal

Deploy policy:
no

Objective:
Produrre `docs/automation/vps-runner-setup-preflight.md`: documento di preflight per la
Fase 3A runner documentale, interamente su carta. Nessuna esecuzione su VPS. Nessuna
installazione. Nessuna configurazione.

Requirements:
Il documento `vps-runner-setup-preflight.md` deve contenere le seguenti sezioni:

### 1. Compatibilità Claude Code CLI con VPS

Analisi teorica/di design:
- Requisiti di sistema per `claude` CLI (Node.js ≥ versione minima, npm, architettura).
- Compatibilità con Ubuntu 24.04.4 LTS (kernel 6.8.0-111-generic).
- Metodo di installazione consigliato: `npm install -g @anthropic-ai/claude-code` o
  alternativa Docker.
- Note su esecuzione headless (nessuna interfaccia grafica, stdin/stdout).
- Limitazioni note: context window, sessioni, timeout.

### 2. Checklist comandi read-only futuri (non eseguiti in questo task)

Lista dei comandi che potranno essere eseguiti in un futuro task read-only sul VPS per
verificare l'ambiente prima dell'installazione. Non eseguire ora.

Esempi (non esaustivi):
- `node --version`
- `npm --version`
- `which claude` (per verificare se già installato)
- `uname -a`
- `df -h` (spazio disco)
- `free -m` (RAM disponibile)
- `docker --version`

### 3. Stima costo token per task docs-only tipo

Stima preliminare basata su:
- Input token medio: dimensione prompt Cursor tipo (es. 0118) + contesto documenti letti.
- Output token medio: dimensione documenti prodotti (es. gate-decision.md ~ 200 righe).
- Modello: Claude Sonnet 4.x (o equivalente disponibile in Claude Code CLI).
- Costo per 1M token input / output alle tariffe correnti Anthropic (riferimento pubblico,
  non tariffe interne).
- Stima per task: input + output token → costo in USD.
- Stima mensile: N task/giorno × 30 giorni × costo/task.

Nota: la stima è orientativa. Il documento deve indicare l'incertezza e raccomandare
un monitoraggio attivo nelle prime sessioni.

### 4. Proposta budget mensile e soglie di stop

- Budget mensile proposto (USD): definire una soglia ragionevole basata sulla stima sezione 3.
- Soglia di allerta (80% del budget): trigger per notifica manuale.
- Soglia di stop (100% del budget): blocco runner automatico fino a review orchestratore.
- Meccanismo di monitoraggio: dashboard Anthropic + eventuale alerting n8n (futura).
- Approvazione: il budget proposto richiede conferma esplicita dell'orchestratore prima
  dell'attivazione del runner (gate separato in task futuro).

### 5. Design nodo SSH exec n8n (solo su carta)

Design del nodo o sequenza di nodi n8n per eseguire il runner sul VPS via SSH.
Non implementare. Solo specifica.

Campi da documentare:

| Campo | Valore proposto | Note |
|-------|----------------|------|
| Tipo nodo | SSH node o Execute Command | Verificare disponibilità in istanza n8n |
| Host | `127.0.0.1` (loopback VPS) | n8n e VPS sulla stessa macchina |
| Porta SSH | 22 | Standard |
| Autenticazione | Chiave SSH (non password) | Mai password in chiaro |
| Working directory | `/root/alina-runner/` (proposta) | Da creare nel task setup |
| Comando | `claude --print < prompt.md` o equivalente | Da verificare con CLI effettiva |
| Timeout | 120s (proposta) | Task docs-only non dovrebbero superare 2 min |
| Exit code 0 | Successo → crea done marker | |
| Exit code ≠ 0 | Fallimento → crea failed marker | |
| Log stdout | Salvare in sessione `docs/sessions/` | |
| Log stderr | Salvare in sessione `docs/sessions/` | Mai loggare credenziali |
| Segreti | API key solo come variabile d'ambiente sul VPS | Mai nel nodo n8n in chiaro |
| Rollback | Disabilitare il nodo SSH nel workflow n8n | Reversibile in <1 min |

### 6. Allowlist path runner (da passare a Claude Code CLI come istruzione)

Path che il runner automatico può leggere e/o scrivere:

| Path | Operazione |
|------|-----------|
| `docs/tasks/queue/` | Lettura |
| `docs/tasks/processing/` | Lettura prompt; scrittura se necessario |
| `docs/tasks/done/` | Scrittura done marker |
| `docs/tasks/failed/` | Scrittura failed marker |
| `docs/sessions/` | Scrittura sessione esito |
| `docs/PROJECT_STATE.md` | Lettura + scrittura aggiornamento |
| `docs/CHECKPOINT.md` | Lettura + scrittura aggiornamento |
| `docs/automation/` | Scrittura documenti design docs-only |

### 7. Denylist assoluta (mai toccabile dal runner automatico)

| Path | Motivazione |
|------|-------------|
| `src/**` | Codice applicativo — solo manuale |
| `gas-current/**` | Snapshot deploy — solo manuale |
| `.gas/**` | Build locale — solo manuale |
| `appsscript.json` | Manifest Apps Script — solo manuale |
| `package.json` | Dipendenze e versione — solo manuale |
| `.clasp.json` | Config locale — mai nel repo |
| `.github/workflows/**` | Workflow CI/CD — approvazione separata |
| File con credenziali, token, chiavi SSH | Mai nel repo, mai nell'output runner |

Il runner deve ricevere queste istruzioni esplicitamente (es. CLAUDE.md runner-specific
o argomento `--system` se supportato dalla CLI).

### 8. Piano Fase 3A supervisionata

Sequenza obbligatoria prima di qualsiasi direct commit automatico su `main`:

1. **Task dummy di test:** creare un task docs-only minimale (es. aggiunta di una riga
   a un file non critico) eseguito dal runner in modalità supervisionata.
2. **Output su branch separato o dry-run:** il runner non committa direttamente su `main`;
   l'output viene presentato per review manuale.
3. **Review diff:** l'orchestratore verifica che il diff contenga solo path autorizzati
   e che il contenuto sia corretto.
4. **Iterazione:** ripetere per almeno 3 task dummy con esito OK.
5. **Gate Fase 3B:** solo dopo 3 validazioni OK, l'orchestratore approva esplicitamente
   il passaggio a direct commit su `main` in un task dedicato.

Criteri di promozione Fase 3A → Fase 3B (da verificare nel task gate 3B):

| Criterio | Soglia |
|----------|--------|
| Task supervisionati con esito OK | ≥ 3 |
| Errori runner nella fase supervisionata | 0 o tutti tracciati/risolti |
| Diff ogni task: solo path autorizzati | Verificato ogni run |
| Costo token stimato e approvato | Sì (task budget) |
| Gate orchestratore esplicito Fase 3B | Sì |

### 9. Rischi e mitigazioni

| Rischio | Impatto | Mitigazione |
|---------|---------|-------------|
| Runaway token | Alto costo / contesto esaurito | Timeout SSH 120s; max 1 task/run; soglia di stop budget |
| Timeout SSH | Stato indefinito — task né done né failed | Gestione exit code ≠ 0 → failed marker automatico |
| Output non autorizzato (path fuori allowlist) | Modifica non voluta del repo | Allowlist esplicita nel prompt; `git diff --stat` post-run |
| Leak segreti nel log | Esposizione API key o token | Filtrare stderr prima di salvare in sessione; mai loggare variabili d'ambiente |
| Loop n8n/GitHub | Run infiniti o commit a cascata | Trigger solo su Schedule (non su push); anti-doppio-run su `processing/` già validato |
| Fallimento parziale (commit a metà) | File done creato senza aggiornamento stato | Sequenza atomica: done marker solo dopo verifica `git status --short` pulito |
| Drift allowlist | Runner tocca file non previsti | Review diff post-run in Fase 3A; CLAUDE.md runner-specific con allowlist |

### 10. Criteri per il task successivo

Il task successivo a 0119 potrà essere uno dei seguenti, ma **solo dopo approvazione
esplicita dell'orchestratore**:

**Opzione A (raccomandata):** `vps-runner-read-only-check` (tipo `vps-preflight-readonly`)
- Esecuzione SSH read-only sul VPS per verificare ambiente (solo comandi della checklist
  sezione 2, nessuna installazione).
- Richiede: gate orchestratore esplicito + conferma utente prima dell'SSH exec.

**Opzione B:** `vps-runner-cli-install` (tipo `vps-setup`)
- Installazione `claude` CLI sul VPS.
- Richiede: gate orchestratore + approvazione budget + chiave API dedicata creata.
- Non procedere senza aver completato Opzione A.

**Non autorizzato come prossimo task senza gate esplicito:**
- Nessuna installazione o configurazione API key.
- Nessun nodo SSH exec attivo in n8n.
- Nessun runner automatico.

Expected output:
- `docs/automation/vps-runner-setup-preflight.md`
- Aggiornamento `docs/PROJECT_STATE.md`
- Aggiornamento `docs/CHECKPOINT.md`
- Done marker: `docs/tasks/done/0119-vps-runner-setup-preflight-docs-only.md`

Mandatory constraints:
- Work on branch main only.
- Do not use dev.
- Do not use git add .
- Do not modify gas-current unless explicitly authorized by a deploy/release task.
- Do not deploy unless the task explicitly authorizes deploy.
- Do not create tags unless the task explicitly authorizes tag creation.
- Run the repository checks required by docs/COMMANDS.md.
- Commit selectively and push only the intended changes.

Final response required:
- Files changed.
- Checks executed.
- Commit hash.
- Git status final.
- Any risks or manual tests required.