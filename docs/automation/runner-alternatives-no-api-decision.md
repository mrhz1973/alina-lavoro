# Runner Alternatives No-API Decision — Fase 3A

**Data:** 2026-05-12  
**Task:** 0124-runner-alternatives-no-api-decision  
**Tipo:** runner-decision-docs-only  
**Eseguito da:** Windsurf/Cascade (implementatore di riserva/supervisionato)  
**Stato:** completato

---

## 1. Executive Summary

**Stato corrente Fase 3A:**
- Fase 2 watcher/polling MVP completata e validata (task 0115+0116+0117)
- Fase 3 runner in valutazione dopo blocco login Claude Code CLI su VPS headless
- Claude Code CLI 2.1.139 installata su VPS ma non autenticata
- Login interattivo via `/login` richiede browser — incompatibile con ambiente headless

**Blocco documentato:**
- Task 0123: Claude Code CLI VPS subscription-login bloccato per incompatibilità headless
- `claude --print` eseguito solo una volta con input dummy per verifica stato (output: "Not logged in")
- Nessun task reale eseguito tramite CLI

**Presupposto operativo:**
- No API key manuali (requisito utente confermato)
- Nessun login Claude autorizzato
- Runner automatico non attivo e non autorizzato

**Decisione raccomandata:**
> Breve termine: restare in **modalità manuale-supervisionata** (Opzione F). Claude Code locale come implementatore principale, Windsurf/Cascade come riserva. n8n come queue reader/prompt generator/session tracker. Rinviare Cursor CLI al reset (~10 giorni). Valutare Codex CLI con task documentale separato prima di qualsiasi azione. Non proseguire con Claude Code CLI VPS headless finché resta il vincolo no-API-key e senza login interattivo sicuro gestito.

---

## 2. Contesto

### Stato Automazione

| Task | Tipo | Esito |
|------|------|-------|
| 0115 | n8n-runtime-activation | Schedule Trigger attivato, primo tick validato |
| 0116 | n8n-runtime-validation | Ciclo has_task:true validato end-to-end |
| 0117 | docs-only | Fase 2 dichiarata chiusa |
| 0118 | docs-only | Decision gate Fase 3 approvate |
| 0119 | vps-preflight-docs-only | Preflight VPS documentato |
| 0120 | vps-preflight-readonly | Read-only check VPS eseguito |
| 0121 | vps-setup-gated | Node.js v18.19.1 + npm 9.2.0 installati |
| 0122 | cli-setup-planning-gated | Claude Code CLI 2.1.139 installata |
| 0123 | cli-auth-planning-gated | Login/subscription bloccato |

### Infrastruttura Corrente

- **n8n:** queue reader attivo e validato; genera prompt/sessioni; NON esegue runner
- **VPS:** Ubuntu 24.04.4 LTS; Node.js v18.19.1; npm 9.2.0; Claude Code CLI 2.1.139 installata, non autenticata
- **GitHub:** repository `main`; lifecycle docs validato

### Implementatori Correnti

- **Claude Code:** implementatore principale supervisionato (sessione locale autenticata)
- **Windsurf/Cascade:** implementatore di riserva supervisionato
- **Cursor:** temporaneamente sospeso fino al reset (~10 giorni)

---

## 3. Criteri di Valutazione

Ogni alternativa è valutata rispetto ai seguenti criteri:

1. **No API key manuale** — rispetta il presupposto operativo?
2. **Sicurezza credential** — come gestisce credenziali/token/sessioni?
3. **Compatibilità headless** — funziona su VPS senza browser/TTY?
4. **Compatibilità con n8n** — integrabile come runner chiamato da n8n?
5. **Costo/limiti** — quote, token, costi mensili?
6. **Controllo umano** — supervisione richiesta?
7. **Facilità rollback** — quanto è semplice tornare indietro?
8. **Isolamento da app Alina** — non tocca V1.9.2?
9. **Documentazione ufficiale** — maturità/supporto vendor?
10. **Rischio modifiche indesiderate** — probabilità azioni fuori scope?
11. **Disponibilità immediata** — usabile oggi senza gate runtime?

---

## 4. Alternative

### A. Claude Code Locale Supervisionato

**Descrizione:** Claude Code viene usato sul computer dell'utente come implementatore supervisionato. n8n genera il prompt, l'utente/orchestratore porta il prompt in Claude Code, Claude Code esegue il task docs-only, committe e pusha.

**Vantaggi:**
- Già strumento principale dell'utente, sessione autenticata attiva
- Nessuna modifica VPS necessaria
- Nessuna API key (usa subscription locale)
- Workflow già validato su task 0102/0103/etc.
- Massimo isolamento da VPS e infrastruttura runtime

**Limiti:**
- Non automatico: richiede supervisione e presenza dell'utente
- Non integrabile come runner headless n8n
- Dipende dalla macchina locale e dalla sessione Claude Pro

**Rischi:**
- Limiti Claude Pro (quote, token, rate limit)
- Sessione locale può scadere o reset
- Non scalabile come runner automatico

**Prerequisiti:** nessuno — già disponibile

**Gate futuri:** nessun gate runtime — uso supervisionato immediato

**Giudizio:** ✅ **Raccomandata per breve termine** — già operativa, zero rischi infrastruttura

---

### B. Windsurf/Cascade Supervisionato

**Descrizione:** Windsurf/Cascade viene usato come implementatore di riserva supervisionato durante blocchi/reset di altri strumenti.

**Vantaggi:**
- Disponibile durante blocchi/reset Cursor o Claude Code
- Autenticato localmente nell'IDE
- Nessuna API key (usa subscription locale)
- Integrato con filesystem locale e git

**Limiti:**
- Non runner headless n8n
- Interazione manuale richiesta
- Non integrabile come runner automatico

**Rischi:**
- Trial/limiti account Windsurf
- Dipende da sessione IDE locale
- Meno esperienza operativa accumulata rispetto a Claude Code

**Prerequisiti:** sessione Windsurf attiva (corrente)

**Gate futuri:** nessun gate runtime — uso supervisionato immediato

**Giudizio:** ✅ **Raccomandata come riserva** — disponibile, zero rischi infrastruttura, già in uso

---

### C. Cursor CLI dopo Reset Cursor

**Descrizione:** Valutare Cursor CLI come runner headless/agent dopo il reset Cursor (~10 giorni). Cursor ha modalità agent documentata che potrebbe supportare esecuzione headless.

**Vantaggi:**
- Più promettente per modalità headless/agent CLI
- Supporto agent mode documentato ufficialmente
- Integrazione workflow task-based già testata
- Potenziale compatibilità con n8n come runner

**Limiti:**
- **Ora non disponibile** (Cursor sospeso fino al reset)
- Autenticazione headless su VPS da verificare — potrebbe avere lo stesso blocco di Claude Code CLI
- Costo/limiti account da verificare per uso VPS

**Rischi:**
- Login interattivo su VPS potrebbe essere bloccato come Claude CLI
- Sicurezza credenziali su VPS
- Costo subscription + utilizzo VPS da valutare

**Prerequisiti:** reset Cursor completato + task preflight separato (docs-only prima; runtime solo dopo gate)

**Gate futuri:** task preflight documentale post-reset (0125-bis o equivalente); poi gate separato per installazione/setup su VPS; poi gate separato per primo run supervisionato

**Giudizio:** ⏳ **Rinviata** — da valutare al reset Cursor con task separato

---

### D. Codex CLI / ChatGPT Plus

**Descrizione:** Valutare Codex CLI come alternativa no-API-key manuale, se login subscription ChatGPT Plus supporta workflow headless utile.

**Vantaggi:**
- Coerente con ChatGPT Plus già usato come orchestratore
- Potenziale autenticazione via subscription senza API key
- OpenAI ufficialmente supporta Codex CLI

**Limiti:**
- Documentazione headless subscription da verificare ufficialmente
- Integrazione con n8n da verificare
- Workflow integrabile con lifecycle docs da verificare

**Rischi:**
- Autenticazione potrebbe richiedere browser (stesso blocco di Claude CLI)
- Gestione credenziali/token su VPS
- Limiti/costi ChatGPT Plus per uso CLI
- Non ancora validato nel contesto operativo

**Prerequisiti:** task verifica documentale separato PRIMA di qualsiasi installazione o runtime

**Gate futuri:** task 0125 Codex CLI feasibility check (docs-only); poi gate installazione; poi gate setup subscription; poi gate primo run supervisionato

**Giudizio:** 🔍 **Da verificare con task separato** — non scelta immediata; nessun runtime prima di verifica documentale

---

### E. VPS Runner con Claude Code (solo se cambia presupposto)

**Descrizione:** Usare Claude Code CLI già installata sul VPS come runner automatico headless.

**Condizioni necessarie (alternative, entrambe attualmente non ammesse):**
1. **Login interattivo manuale sicuro una tantum** — richiederebbe tunnel/browser gestito, gestione sessione lungo termine, rinnovo periodico token
2. **API key dedicata** — attualmente vietata dal presupposto operativo utente

**Stato attuale:** ❌ **Non raccomandato e non autorizzato**

**Rischi:**
- Se login interattivo: gestione sessione complessa, token scaduti, sicurezza tunnel
- Se API key: costo, sicurezza credenziali su VPS, vietato da presupposto
- Alto rischio di esposizione credential in ambiente server
- Complessità operativa elevata

**Gate futuri:** richiede cambio esplicito presupposto operativo da parte dell'utente + task separati per ciascuna strada (login interattivo o API key)

**Giudizio:** ❌ **Non raccomandata** — non autorizzata finché resta vincolo no-API-key e senza login interattivo sicuro gestito

---

### F. Restare in Modalità Manuale-Supervisionata

**Descrizione:** n8n genera prompt/sessioni automaticamente; ChatGPT orchestra; Claude Code/Windsurf eseguono i task docs-only manualmente; nessun runner automatico.

**Vantaggi:**
- Massimo controllo su ogni azione
- Nessuna modifica VPS/runtime
- Nessuna API key richiesta
- Già validato e funzionante (task 0100-0124)
- n8n lifecycle già validato end-to-end
- Rollback immediato — nessun runtime da fermare
- Zero rischi infrastruttura

**Limiti:**
- Meno automazione rispetto al runner automatico
- Richiede presenza utente/orchestratore per ogni task

**Rischi:**
- Minimi — è il flusso già validato e stabile
- Dipende disponibilità implementatore (Claude Code/Windsurf)

**Prerequisiti:** nessuno — stato corrente

**Gate futuri:** nessuno per questa modalità; gate separati solo se si vuole evolvere verso runner automatico

**Giudizio:** ✅ **Raccomandata come baseline** — stato corrente stabile, zero rischi

---

## 5. Matrice Comparativa

| Alternativa | No API key | Headless | n8n-ready | Rischio credential | Automazione | Disponibilità attuale | Raccomandazione |
|-------------|-----------|---------|-----------|-------------------|------------|----------------------|----------------|
| A. Claude Code locale | ✅ Sì | ❌ No | ❌ No | ✅ Basso | Supervisionata | ✅ Ora | ✅ Breve termine |
| B. Windsurf/Cascade | ✅ Sì | ❌ No | ❌ No | ✅ Basso | Supervisionata | ✅ Ora | ✅ Riserva |
| C. Cursor CLI | ✅ Sì (da verificare) | ⚠️ Da verificare | ⚠️ Da verificare | ⚠️ Medio | Potenziale | ❌ ~10 giorni | ⏳ Post-reset |
| D. Codex CLI | ✅ Forse | ⚠️ Da verificare | ⚠️ Da verificare | ⚠️ Medio | Potenziale | ❌ Da verificare | 🔍 Task separato |
| E. VPS runner Claude CLI | ❌ Richiede API key o login | ⚠️ Con login sicuro | ✅ Potenziale | ❌ Alto | Automatica | ❌ Non autorizzata | ❌ Non raccomandata |
| F. Manuale supervisionato | ✅ Sì | N/A | N/A (n8n genera) | ✅ Basso | Manuale | ✅ Ora | ✅ Baseline |

---

## 6. Decisione Raccomandata

### Breve Termine (immediato)

1. **Restare in modalità manuale-supervisionata** (Opzione F — baseline)
2. **Claude Code locale** come implementatore principale supervisionato (Opzione A)
3. **Windsurf/Cascade** come implementatore di riserva supervisionato (Opzione B)
4. **n8n** resta queue reader / prompt generator / session tracker — NON runner automatico

### Medio Termine (~10 giorni)

5. **Cursor CLI** — valutare al reset Cursor con task preflight separato (Opzione C)
   - Task: preflight documentale solo; poi gate installazione; poi gate run supervisionato

### Valutazione Futura (separata)

6. **Codex CLI / ChatGPT Plus** — valutare con task documentale separato PRIMA di qualsiasi azione (Opzione D)
   - Task 0125 Codex CLI feasibility check (docs-only) — proposto, non creato qui

### Non Proseguire

7. **Claude Code CLI VPS headless** (Opzione E) — non raccomandato finché:
   - resta il vincolo no-API-key, E
   - non si accetta un percorso di login interattivo sicuro gestito

---

## 7. Decisioni Operative Esplicite

Con questa decisione documentale si stabilisce che:

- ❌ **Nessun runner automatico** viene attivato
- ❌ **Nessuna API key** viene autorizzata (di nessun provider)
- ❌ **Nessun login Claude** viene autorizzato su VPS o in modo non supervisonato
- ❌ **Nessuna modifica n8n** (runtime o workflow) viene autorizzata
- ❌ **Nessuna modifica VPS** viene autorizzata
- ❌ **Nessuna GitHub Action** viene autorizzata
- ❌ **App Alina V1.9.2** resta fuori scope e non toccata
- ✅ **Claude Code locale** continua come implementatore principale supervisionato
- ✅ **Windsurf/Cascade** continua come implementatore di riserva supervisionato
- ✅ **n8n** continua come queue reader / prompt generator / session tracker

---

## 8. Gate Futuri Proposti

I seguenti task sono proposti come opzioni future — **non creati né autorizzati da questo task:**

| Task proposto | Tipo | Prerequisiti | Note |
|--------------|------|--------------|------|
| 0125 Codex CLI / ChatGPT Plus feasibility check | docs-only | Gate manuale | Solo verifica documentale; nessun runtime |
| Cursor CLI preflight post-reset | docs-only | Reset Cursor completato + gate | Verifica autenticazione headless e limiti |
| Consolidamento workflow manuale-supervisionato | docs-only | Gate manuale | Runbook operativo Claude Code + Windsurf |
| Claude Code local-runbook | docs-only | Gate manuale | Documentazione modalità operativa |
| Claude Code CLI VPS login sicuro | runtime-gated | Cambio presupposto utente | Solo se utente cambia presupposto no-API-key |

---

## 9. Done Criteria

- ✅ Documento decisionale creato
- ✅ Raccomandazione Fase 3A esplicitata (breve termine manuale-supervisionato)
- ✅ Alternative A/B/C/D/E/F confrontate con criteri standardizzati
- ✅ Matrice comparativa prodotta
- ✅ Rischi e gate futuri documentati per ciascuna alternativa
- ✅ Nessuna modifica runtime (VPS, n8n, app)
- ✅ Done marker creato
- ✅ Memoria GitHub aggiornata (PROJECT_STATE.md + CHECKPOINT.md)
- ✅ Commit selettivo e push eseguiti
- ✅ Nessuna API key configurata
- ✅ Nessun CLI eseguito (Claude/Cursor/Codex)
- ✅ Nessun runner automatico attivato

---
**Task 0124 completato — Decisione Fase 3A documentata: breve termine manuale-supervisionato**
