# Fase 3 Runner Documentale — Decisione Gate Orchestratore

**Data decisione:** 2026-05-12
**Status:** Approvato — vincoli operativi fissati. Runtime non autorizzato.
**Task:** 0118-runner-phase3-gate-decision-docs-only
**Documento di design di riferimento:** `docs/automation/runner-phase3-design.md`

## Premessa

Questo documento fissa le risposte dell'orchestratore alle cinque domande gate identificate
in `runner-phase3-design.md`, necessarie prima di qualsiasi implementazione runtime della
Fase 3. Nessun runtime automatico è autorizzato in questa fase.

**Vincoli assoluti invariati (ribaditi):**

- Non installare Claude Code CLI sul VPS.
- Non configurare API key Anthropic sul VPS.
- Non creare workflow GitHub Actions per runner automatico.
- Non attivare runner automatico di nessun tipo.
- Non modificare SSH exec o accessi VPS oltre a quanto già documentato.
- Non modificare app Alina (V1.9.2 / `@24` / `v1.9.2-stable`).
- Non fare deploy Apps Script.
- Non creare tag di release.
- Non fare rollback.

---

## Gate 1 — Scope task runner

**Decisione approvata:** solo task `docs-only`.

Il runner automatico della Fase 3 può operare **esclusivamente** su task classificati
`docs-only`. Qualsiasi task che richieda modifiche a `src/`, deploy Apps Script, tag di
release, modifica VPS o credenziali è fuori scope del runner automatico e rimane manuale.

### Allowlist path (runner automatico — sola lettura/scrittura autorizzata)

| Path | Operazione ammessa |
|------|--------------------|
| `docs/tasks/queue/` | Lettura (selezione task eleggibile) |
| `docs/tasks/processing/` | Lettura prompt; scrittura done marker |
| `docs/tasks/done/` | Scrittura done marker |
| `docs/tasks/failed/` | Scrittura failed marker |
| `docs/sessions/` | Scrittura sessione esito |
| `docs/PROJECT_STATE.md` | Scrittura aggiornamento stato |
| `docs/CHECKPOINT.md` | Scrittura aggiornamento checkpoint |
| `docs/automation/` | Scrittura documenti design/decisione docs-only |

### Denylist assoluta (runner automatico — mai toccabile)

| Path | Motivazione |
|------|-------------|
| `src/**` | Codice applicativo — solo manuale |
| `gas-current/**` | Snapshot deploy — solo manuale |
| `.gas/**` | Build locale — solo manuale |
| `appsscript.json` | Manifest Apps Script — solo manuale |
| `package.json` | Dipendenze e versione — solo manuale |
| `.clasp.json` | Config locale — mai nel repo |
| `.github/workflows/**` | Workflow CI/CD — approvazione separata |
| File con credenziali, token, chiavi SSH | Mai nel repo, mai nel runner output |

---

## Gate 2 — Frequenza attesa

**Decisione approvata:** bassa/media con rate limit obbligatorio.

Frequenza stimata: al massimo 2-5 task docs-only al giorno nei picchi; normalmente meno.
Il runner non deve eseguire loop non controllati.

### Vincoli di frequenza da implementare nel design runner

- **Max task per esecuzione:** 1 task per invocazione del runner (il runner non deve
  consumare tutta la queue in un solo run).
- **Pausa minima tra esecuzioni:** rispettare il polling interval del queue reader
  (5 minuti attuali); nessun loop tight.
- **Stima costo token prima del runtime:** stimare il costo medio per task docs-only
  (input + output token) con Opzione A (Claude Code CLI) e definire un budget mensile
  approvato prima di attivare il runner automatico.
- **Monitoring costo:** verificare periodicamente il consumo nella dashboard Anthropic;
  notifica se il budget supera la soglia concordata.

---

## Gate 3 — Supervisione post-run

**Decisione approvata:** Fase 3A supervisionata — nessun fire-and-forget immediato.

Il runner automatico deve essere introdotto in modalità supervisionata prima di qualsiasi
direct commit autonomo su `main`.

### Sequenza Fase 3A obbligatoria

1. **Dry-run o branch separato:** il runner esegue il task ma non committa su `main`
   direttamente; l'output viene messo su un branch temporaneo o presentato per review.
2. **Revisione manuale dell'output:** l'orchestratore o l'utente approva il diff prima
   del merge su `main`.
3. **Validazione su almeno 3 task dummy:** dopo 3 esecuzioni supervisionate con esito OK,
   si può valutare il passaggio a direct commit su `main` per task docs-only a basso rischio.
4. **Gate esplicito Fase 3B:** prima del direct commit automatico, approvazione
   orchestratore in un task dedicato (non in questo documento).

### Criteri di promozione da Fase 3A a Fase 3B (direct commit)

| Criterio | Soglia |
|----------|--------|
| Task supervisionati con esito OK | ≥ 3 |
| Errori runner nella fase supervisionata | 0 (o tutti tracciati e risolti) |
| Diff ogni task: solo path autorizzati | Verificato ogni run |
| Costo token stimato e approvato | Sì |
| Gate orchestratore esplicito Fase 3B | Sì |

---

## Gate 4 — Gestione errori

**Decisione approvata:** fallimento sempre tracciato, nessun retry automatico.

### Comportamento obbligatorio in caso di errore runner

1. Creare `docs/tasks/failed/{task}.md` con sezione `## Failed status`:
   - `failure_reason`: descrizione leggibile dell'errore
   - `failed_at`: timestamp ISO
   - `session_path`: link alla sessione errore
   - Link al task originale in `queue/`
2. Creare sessione errore in `docs/sessions/runner-error-{task}-{timestamp}.md` con:
   - Log dell'errore (non includere credenziali o token)
   - Stack trace se disponibile
   - Stato del workspace al momento del fallimento
3. **Non cancellare** il file da `queue/` — il task resta in queue con il file failed
   che lo esclude dallo skip del queue reader.
4. **Notifica:** la presenza di `failed/{task}.md` è visibile via GitHub e rilevabile
   da n8n al prossimo polling; non è necessario un sistema di notifica aggiuntivo nella
   Fase 3A supervisionata.
5. **Manual review obbligatoria** prima di qualsiasi retry — l'orchestratore deve
   analizzare `failed/{task}.md` e la sessione errore prima di autorizzare il retry.
6. **Nessun retry automatico** senza approvazione orchestratore esplicita.

### Pattern retry approvato

- Creare un nuovo task in `queue/` con suffisso `-retry-1` (es.
  `0118-runner-phase3-gate-decision-docs-only-retry-1.md`).
- Lasciare intatto `failed/{task}.md` per tracciabilità.
- Documentare il motivo del retry nella sezione `## Context` del nuovo task.

---

## Gate 5 — Autenticazione CLI / API key

**Decisione approvata:** chiave API Anthropic dedicata; configurazione solo dopo approvazione esplicita.

### Regole API key

| Regola | Dettaglio |
|--------|-----------|
| Chiave dedicata | Chiave Anthropic separata dall'account personale; creata appositamente per il runner VPS |
| Mai nel repo | Né in chiaro, né codificata, né in variabili d'ambiente committate |
| Segreto n8n/VPS esclusivo | Configurata solo come segreto nell'istanza n8n o come variabile d'ambiente sul VPS — mai altrove |
| Costo approvato | Il piano/budget della chiave dedicata deve essere definito e approvato dall'orchestratore prima della configurazione |
| Task dedicato | La configurazione della chiave avviene in un task `vps-runner-setup` separato — non in questo documento |
| Rotazione | Definire una policy di rotazione (frequenza, procedura) nel task `vps-runner-setup` |

**Questa decisione non autorizza la creazione né la configurazione della chiave.** La chiave
sarà oggetto del task preflight/setup che verrà creato dopo la fase di design corrente.

---

## Opzione raccomandata

**Opzione A — Claude Code CLI sul VPS** (confermata come prima scelta).

Motivazione (allineata a `runner-phase3-design.md`):

- Il VPS IONOS è già operativo con Docker n8n (Ubuntu 24.04.4 LTS).
- SSH è già usato per manutenzione (documentato in task 0109/0110).
- Claude Code CLI è lo stesso tool usato manualmente come runner supervisionato.
- Delta di implementazione limitato: aggiungere il nodo SSH exec in n8n, installare
  `claude` CLI, configurare la chiave come segreto n8n.
- Rollback semplice: disabilitare il nodo SSH exec nel workflow n8n.

**Opzione C — GitHub Actions** (alternativa valida):

- Preferire se il VPS diventa instabile o se si vuole separare il runner dall'infrastruttura n8n.
- Richiede un file `.github/workflows/runner-docs.yml` nel repo — approvazione separata.
- Attenzione al loop trigger: il push del runner su `processing/` non deve riattivare il
  workflow stesso.

---

## Prossimo task dopo 0118

Il prossimo task deve essere ancora **design/preflight**, non runtime pieno.

**Task consigliato:** `vps-runner-setup-preflight` (tipo `docs-only` o `vps-preflight`).

Contenuto atteso:

1. Verifica compatibilità `claude` CLI con Ubuntu 24.04.4 LTS + npm sul VPS (solo read-only
   su VPS, nessuna installazione).
2. Stima costo token per task docs-only tipo (input prompt medio + output atteso).
3. Proposta budget mensile per approvazione orchestratore.
4. Design del nodo SSH exec in n8n: parametri, timeout, gestione errori.
5. Design allowlist path da passare a Claude Code CLI come istruzione di sistema.

**Non autorizzato ancora:**

- Installazione `claude` CLI sul VPS.
- Configurazione API key Anthropic.
- Modifica di n8n runtime.
- Esecuzione SSH exec da n8n.
- Qualsiasi runner automatico.

---

## Riepilogo decisioni gate

| Gate | Decisione |
|------|-----------|
| 1 — Scope | Solo `docs-only`; allowlist esplicita; denylist assoluta su `src/**` e credenziali |
| 2 — Frequenza | Bassa/media; max 1 task/run; rate limit; budget token da approvare prima del runtime |
| 3 — Supervisione | Fase 3A obbligatoria (dry-run/branch separato); ≥3 task supervisionati prima di direct commit |
| 4 — Errori | Failed tracciato in `failed/`; sessione errore; no retry automatico; manual review |
| 5 — API key | Chiave dedicata; mai nel repo; segreto n8n/VPS; task `vps-runner-setup` separato |

---

## Gate manuali permanenti (invariati dalla Fase 2)

Indipendentemente dall'avanzamento della Fase 3, questi gate restano **sempre manuali**:

- Deploy Apps Script (`@24` e successivi).
- Tag di release (`v*-stable`).
- Rollback deployment.
- Modifiche a `src/backend/Code.gs`.
- Modifiche a struttura Google Sheet.
- Modifiche a credenziali, chiavi SSH, segreti.
- Qualsiasi task non classificato `docs-only`.
- Promozione da Fase 3A a Fase 3B (direct commit automatico).
