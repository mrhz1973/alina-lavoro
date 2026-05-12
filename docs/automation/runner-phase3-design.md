# Fase 3 — Runner Documentale: Design e Decisione

**Data:** 2026-05-12
**Status:** Design — non implementato. Gate manuale obbligatorio prima di qualsiasi runtime.

## Contesto

La Fase 2 watcher/polling MVP è completata (vedi `n8n-watcher-polling-mvp-completion.md`).
n8n genera automaticamente un cursor prompt in `docs/tasks/processing/` per ogni task
eleggibile. Il prompt attende esecuzione manuale o automatica da un runner.

La Fase 3 introduce un **runner documentale** che esegue automaticamente il cursor prompt
per task di tipo `docs-only`, senza intervento umano, sul VPS già attivo (IONOS, Docker n8n,
Ubuntu 24.04.4 LTS).

**Questa fase non è ancora implementata.** Questo documento definisce le opzioni e i
prerequisiti per la decisione architetturale.

## Obiettivo Fase 3

Eseguire automaticamente i task `docs-only` senza runner manuale:

1. n8n rileva task eleggibile (`has_task:true`) → genera cursor prompt in `processing/`.
2. Runner legge il prompt → esegue Claude Code CLI (o Cursor CLI) con il prompt come input.
3. Claude Code / Cursor modifica solo file `docs/` autorizzati → commit selettivo → push.
4. n8n (o lo stesso runner) sposta il task da `queue/` a `done/` (o `failed/`).
5. Sessione aggiornata con esito.

## Opzioni candidate

### Opzione A — Claude Code CLI sul VPS (SSH exec da n8n)

**Descrizione:** n8n esegue via SSH un comando `claude` (Claude Code CLI) sul VPS, passando
il contenuto del cursor prompt come input.

| Dimensione | Valutazione |
|------------|-------------|
| Allineamento infrastruttura | Alto — VPS già attivo, n8n già su VPS |
| Complessità installazione | Media — install `claude` CLI, gestione API key |
| Costo operativo | Medio — consumo token API Anthropic per ogni task |
| Sicurezza | Richiede API key in segreto n8n; SSH key per accesso VPS |
| Affidabilità | Dipende da timeout SSH, stabilità CLI |
| Rollback | Semplice — disabilitare il nodo SSH in n8n |
| Context window | Limite sessione Claude Code; task lunghi possono richiedere gestione |

**Prerequisiti tecnici:**
- `claude` CLI installato sul VPS (npm global o Docker image).
- API key Anthropic configurata come segreto n8n (mai in chiaro nel repo).
- SSH key tra n8n e VPS (o stessa macchina: `localhost` → `127.0.0.1`).
- Test manuale: esecuzione singola supervisionata prima di attivare automatismo.

**Rischi principali:**
- Drift: Claude Code interpreta il prompt in modo inatteso → commit non autorizzati.
- Token runaway: task mal formato → loop o output enorme.
- SSH timeout: task lento → n8n timeout → stato indefinito.

---

### Opzione B — Cursor CLI sul VPS (headless)

**Descrizione:** n8n avvia `cursor` in modalità headless sul VPS con il cursor prompt come
file di input.

| Dimensione | Valutazione |
|------------|-------------|
| Allineamento infrastruttura | Medio — Cursor non è attualmente sul VPS |
| Complessità installazione | Alta — Cursor headless su Linux server non documentato ufficialmente |
| Costo operativo | Dipende da licenza Cursor; seat server non garantito |
| Sicurezza | Licenza server; autenticazione Cursor CLI |
| Affidabilità | Bassa — Cursor è progettato per uso interattivo, headless meno testato |
| Rollback | Semplice — disabilitare il nodo in n8n |

**Prerequisiti tecnici:**
- Verifica che Cursor supporti modalità headless server-side con licenza attuale.
- Installazione e test su VPS.
- Autenticazione Cursor CLI senza interfaccia grafica.

**Rischi principali:**
- Cursor headless non supportato ufficialmente → instabilità o comportamento imprevedibile.
- Licenza non compatibile con uso server → blocco account.

**Raccomandazione:** da approfondire solo se Opzione A risulta inadeguata. Non prioritaria.

---

### Opzione C — GitHub Actions runner

**Descrizione:** workflow GitHub Actions triggerato dal push di un file in
`docs/tasks/processing/` (evento `push` su path specifico). Il runner legge il cursor prompt,
chiama Claude API direttamente (via SDK Python/Node) o installa `claude` CLI.

| Dimensione | Valutazione |
|------------|-------------|
| Allineamento infrastruttura | Medio — non richiede VPS per il runner, ma introduce un secondo sistema |
| Complessità installazione | Media — YAML workflow, segreti GitHub, gestione token |
| Costo operativo | GitHub Actions minutes (free tier limitato) + token Anthropic |
| Sicurezza | Segreti GitHub Actions (non in repo); permessi workflow da limitare |
| Affidabilità | Alta per CI standard; dipende da minuti disponibili |
| Rollback | Disabilitare il workflow file o rimuovere il trigger |

**Prerequisiti tecnici:**
- File `.github/workflows/runner-docs.yml` (nuovo file nel repo — richiede approvazione).
- Segreto `ANTHROPIC_API_KEY` in GitHub repo secrets.
- Permessi workflow limitati (`contents: write` solo per path `docs/`).
- Test manuale del workflow prima di attivazione automatica.

**Rischi principali:**
- Workflow file nel repo → visibile a chi ha accesso al repo (ok se repo privato).
- Trigger `push` su `processing/` → potenziale loop se il runner fa push che riattiva se stesso.
- GitHub Actions minutes possono esaurirsi su free tier.

---

### Opzione D — Runner locale supervisionato (stato attuale, non automatico)

**Descrizione:** l'utente o l'orchestratore esegue Claude Code manualmente leggendo il cursor
prompt in `docs/tasks/processing/`. Nessuna automazione aggiuntiva.

| Dimensione | Valutazione |
|------------|-------------|
| Rischio | Minimo |
| Controllo | Massimo |
| Scalabilità | Nulla — richiede intervento umano per ogni task |
| Costo | Solo tempo umano |

Questo è lo stato corrente. È adeguato per task rari e di alta importanza; non scalabile
per task frequenti o notturni.

---

## Confronto riassuntivo

| Opzione | Rischio | Complessità | Costo | Scalabilità | Priorità |
|---------|---------|-------------|-------|-------------|----------|
| A — Claude Code CLI VPS | Medio | Media | Medio | Alta | **Prima scelta** |
| B — Cursor CLI VPS | Alto | Alta | Incerto | Bassa | Non prioritaria |
| C — GitHub Actions | Medio | Media | Basso/Medio | Alta | Alternativa |
| D — Manuale (attuale) | Minimo | Nulla | Zero | Nulla | Fase corrente |

## Raccomandazione

**Opzione A — Claude Code CLI sul VPS** è la scelta più allineata all'infrastruttura attuale:
il VPS con Docker n8n è già operativo, SSH è già usato per manutenzione, e Claude Code CLI
è lo stesso tool usato manualmente. Il delta di implementazione è limitato.

**Opzione C — GitHub Actions** è una valida alternativa se si vuole evitare la gestione
di un processo long-running sul VPS o se il VPS diventa instabile.

Prima di scegliere, rispondere alle domande del prossimo paragrafo.

## Domande da rispondere prima dell'implementazione (gate orchestratore)

1. **Scope task runner Fase 3:** il runner automatico deve gestire solo task `docs-only`
   o anche task con modifiche frontend a basso rischio (tipo `src/frontend/Index.html`)?
   → Determina i permessi del runner e il livello di controllo richiesto.

2. **Frequenza attesa:** quanti task docs-only al giorno/settimana si prevede di avere?
   → Determina se il costo operativo (token API) è sostenibile con Opzione A o se
   GitHub Actions free tier è sufficiente con Opzione C.

3. **Supervisione post-run:** il runner deve aprire una PR per review umana prima del merge,
   oppure committare direttamente su `main`?
   → Se PR: aumenta sicurezza ma richiede review manuale; se direct commit: più autonomo
   ma richiede gate pre-commit più robusti (path allowlist, no `git add .`).

4. **Gestione errori:** se il runner fallisce (timeout, errore Claude, test non superati),
   chi viene notificato? Telegram? Email? Semplice scrittura in `docs/tasks/failed/`?

5. **Autenticazione CLI:** la API key Anthropic usata dal runner VPS è la stessa
   dell'account personale o si preferisce una chiave dedicata (spesa separata)?

## Prerequisiti tecnici minimi (validi per Opzione A)

- [ ] `claude` CLI installabile sul VPS (verificare compatibilità Ubuntu 24.04.4 LTS + npm).
- [ ] API key Anthropic disponibile e configurabile come segreto n8n (mai in chiaro).
- [ ] Definire path allowlist per il runner (solo `docs/`, no `src/`, no `gas-current/`).
- [ ] Test manuale end-to-end su VPS con un task docs-only dummy prima di attivazione
      automatica.
- [ ] Procedura di rollback: come disabilitare il runner in caso di anomalia.
- [ ] Gate manuale post-primo-run: review dell'output prima di dichiarare la Fase 3 attiva.

## Gate manuali permanenti

Indipendentemente dall'opzione scelta, questi gate restano manuali anche nella Fase 3:

- Deploy Apps Script (`@24`).
- Tag di release (`v*-stable`).
- Rollback deployment.
- Modifiche a `src/backend/Code.gs`.
- Modifiche a struttura Google Sheet.
- Modifiche a credenziali o chiavi SSH.
- Qualsiasi task non classificato `docs-only`.

## Prossimo passo

1. L'orchestratore risponde alle domande della sezione "Gate orchestratore".
2. L'orchestratore approva l'opzione scelta (A o C).
3. Si crea un task di tipo `n8n-runner-setup` o `vps-runner-setup` con i passi tecnici
   specifici per l'installazione e il test supervisionato.
4. Il primo run del runner automatico avviene sotto gate manuale esplicito.
