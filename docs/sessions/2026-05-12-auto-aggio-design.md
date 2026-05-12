# Sessione — Auto-Aggio Design

**Data:** 2026-05-12  
**Task:** 0130-auto-aggio-design  
**Tipo:** low-touch-loop-docs-only  
**Modalità:** AGENT / IMPLEMENTAZIONE  
**Eseguito da:** Windsurf/Cascade (implementatore di riserva/supervisionato)  
**Stato:** completato

## Task Eseguito

`docs/tasks/queue/0130-auto-aggio-design.md` — design del meccanismo Auto-Aggio per ridurre/eliminare la scrittura manuale "aggio" quando il completamento è già verificabile da GitHub/n8n.

## Decisione di Riferimento

**D-0128-A = 2** (Auto-Aggio prima) — registrata in `docs/tasks/queue/0130-auto-aggio-design.md` e nelle sessioni precedenti.

## Nota sul Prompt n8n

Il prompt generato da n8n in `docs/tasks/processing/0130-auto-aggio-design-cursor-prompt.md` è incompleto nelle sezioni Objective/Requirements/Expected output. Utilizzato solo come **evidenza automation**, NON come istruzione operativa principale.

## File Creati / Modificati

1. **docs/automation/auto-aggio-design.md** (nuovo)
2. **docs/sessions/2026-05-12-auto-aggio-design.md** (questo file)
3. **docs/tasks/done/0130-auto-aggio-design.md** (nuovo, done marker)
4. **docs/PROJECT_STATE.md** (aggiornato — task 0130 completato)
5. **docs/CHECKPOINT.md** (aggiornato — task 0130 completato)

## Sintesi del Design

**Auto-Aggio** = rilevamento automatico (ChatGPT + n8n) che un task è completato/fallito/richiede attenzione, **senza** che l'utente scriva manualmente "aggio".

**Architettura logica:** State scanner → Indicator validator → Anti-false-positive filter → State classifier → DP detector → Gate guard → Summary generator → Notifier.

**Fonti di verità GitHub** (priorità decrescente): done marker > sessione manuale > commit > sessione automation > processing.

**8 stati definiti** (con tabella obbligatoria): completato / fallito / incompleto / ambiguo / con DP / con gate manuale / docs-only standard / runtime-gated.

**10 regole anti-falso positivo** (triade preferita: done marker + sessione + commit; failed > done in conflitto; gate manuale → stop; scope drift → stop).

**Notifiche:** silenzioso per task standard; attivo solo per DP / errore / ambiguità / gate / runtime / scope drift.

**Compatibilità:** Auto-Aggio non sostituisce Decision Packet, lo segnala. Si integra con INBOX.md futura (task 0129).

**Gate manuali permanenti preservati:** app Alina, deploy, tag, rollback, VPS, n8n runtime, API key, login, GitHub Actions, costi nuovi, runner automatico, test fisici.

## MVP Proposto

**Due livelli:**

- **Livello immediato (attivabile subito, zero runtime):** disciplina di lettura GitHub da parte di ChatGPT orchestratore. Riduzione stimata ~50–60% degli "aggio" manuali. L'utente può smettere di scrivere "aggio" per task standard chiari; ChatGPT riallinea da solo applicando le regole Auto-Aggio in autonomia.
- **Livello automatizzato (runtime-gated futuro):** workflow n8n con polling/webhook done/failed + generazione riepilogo + notifica solo per casi attivi + integrazione INBOX. Riduzione stimata ~70–80%.

**Cosa resta manuale:** recovery post-failure, task ambigui, risposta DP, gate manuali, test fisici.

## Stati Definiti (sintesi)

| Stato | Notifica | Esempio indicatori |
|---|---|---|
| Completato | Nessuna | Done marker + sessione + commit `complete task` |
| Fallito | Attiva | Failed marker + sessione errore |
| Incompleto | Attiva (timeout) | Processing senza done |
| Ambiguo | Attiva | Triade incompleta |
| Con DP | Attiva | Pattern `# Decision Packet` nel documento |
| Con gate manuale | Attiva | Allowed paths includono runtime/app/deploy/... |
| Docs-only standard | Nessuna | Triade completa, no DP, no gate |
| Runtime-gated | Attiva | Marker `runtime: yes` |

## Failure Modes (sintesi)

10 failure mode identificati: n8n polling down, marker mancanti, commit ambigui, DP non rilevati, gate bypassato, scope drift, disallineamento ChatGPT/n8n.  
**Mitigazioni principali:** triade obbligatoria, failed > done in conflitto, gate guard whitelist, forbidden paths scan, fallback aggio manuale sempre disponibile.

## Fallback Manuale

L'aggio manuale resta sempre disponibile. Casi di fallback obbligatorio:
- Polling n8n down
- Lavoro non committato (Plan Mode)
- Task con scope ambiguo
- Recovery post-failure
- Sospetto falso positivo dell'utente

## Decision Packet Prodotto

**Nessuno.** La raccomandazione è chiara e coerente con il design 0128 e la decisione D-0128-A. Non c'è scelta reale tra alternative architetturali in questo step. Le scelte specifiche (canale notifica, soglia silenzio, formato INBOX) emergeranno nei task successivi (0129 e runtime-gated) con DP dedicati.

## Ordine Roadmap (confermato)

1. **0129** — Human Decision Inbox Design
2. **0131** — n8n Decision Packet Generator Design
3. **0132** — Ollama Classifier/Planner Feasibility
4. **0133** — Cursor/Implementer Bridge Design

Eventuali cambi d'ordine: solo via Decision Packet, non commenti liberi.

## Controlli Eseguiti

- `git checkout main` + `git pull origin main` ✅
- `git diff --check` ✅
- `git diff --stat` ✅
- `git status --short` ✅
- Verifica allowed paths ✅
- Verifica forbidden paths non toccati ✅

## Conferme di Non-Interferenza

- ✅ Nessun runtime eseguito
- ✅ Nessuna installazione
- ✅ Nessuna esecuzione CLI
- ✅ Nessun login
- ✅ Nessuna API key configurata
- ✅ Nessuna modifica VPS
- ✅ Nessuna modifica n8n runtime
- ✅ Nessuna GitHub Actions
- ✅ Nessun runner automatico attivato
- ✅ App Alina V1.9.2 non toccata
- ✅ Nessun deploy / tag / rollback
- ✅ docs/ORCHESTRATOR_RULES.md non modificato
- ✅ Task in queue non modificato
- ✅ Prompt in processing non modificato

---
**Sessione completata — Auto-Aggio Design definito; foundation low-touch loop estesa (0127 + 0128 + 0130)**
