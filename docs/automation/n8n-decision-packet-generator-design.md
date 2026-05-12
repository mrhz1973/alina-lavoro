# n8n Decision Packet Generator Design — Low-Touch Loop

**Data:** 2026-05-12  
**Task:** 0131-n8n-decision-packet-generator-design  
**Tipo:** low-touch-loop-docs-only  
**Stato:** completato

---

## Executive Summary

Il **Decision Packet Generator** è il componente logico (inizialmente documentale, futuro n8n) che valuta se un evento rilevato nel sistema richiede una decisione reale dell'utente, e in caso affermativo assembla un Decision Packet Markdown conforme al formato canonico (13 campi) e lo instrada verso `docs/INBOX.md`.

Il generatore è il livello intermedio tra il rilevamento di stato (Auto-Aggio) e la decisione umana (INBOX). Non sostituisce né l'uno né l'altra: li connette in modo strutturato e con filtro esplicito anti-rumore.

**Posizione nell'architettura low-touch:**

```
Auto-Aggio (rileva stato) → DP Generator (valuta + assembla) → INBOX (ospita decisione)
```

**Criterio permanente:** quante micro-interazioni umane elimina ciascuna soluzione proposta? Il generatore elimina la micro-interazione "formulare e formattare il Decision Packet" che oggi richiede all'orchestratore lettura del contesto, scelta dei campi, redazione del testo, e invio manuale.

**Decision Packet:** non emesso. Le alternative architetturali si riducono a una sola progettazione coerente con i vincoli attuali (docs-only, nessun runtime, compatibilità con Auto-Aggio 0130 e INBOX 0129). Non emerge scelta reale tra opzioni equivalenti per l'utente.

---

## 1. Definizione del Generatore

### Cosa è il Decision Packet Generator

Il **DP Generator** è un componente/workflow che:

1. Riceve uno stato ambiguo o una segnalazione da Auto-Aggio o dall'implementatore
2. Valuta se esiste davvero una decisione da prendere (non ogni anomalia è una decisione)
3. Assembla il Decision Packet Markdown conforme al formato canonico (`docs/automation/decision-packet-format.md`, 13 campi in ordine fisso)
4. Accoda il DP in `docs/INBOX.md` sezione `## Pending`, oppure lo invia all'orchestratore

### Differenza tra Emissione Manuale e Emissione Automatica

| Aspetto | Emissione manuale (orchestratore) | Emissione automatica (generatore) |
|---|---|---|
| **Chi decide** | ChatGPT orchestratore legge il contesto e giudica | Generatore applica regole deterministiche + soglie |
| **Quando avviene** | A ogni "aggio" o lettura attiva di GitHub | A ogni trigger strutturato rilevato |
| **Latenza** | Dipende dall'utente (scrive "aggio") | Ridotta: trigger → valutazione → DP in minuti |
| **Formato** | ChatGPT genera testo; può variare | Template standard con mapping deterministico |
| **Filtro anti-rumore** | Giudizio orchestratore | Regole esplicite documentate |
| **Micro-interazione eliminata** | No (orchestratore è ancora nel loop manuale) | Sì: "formulare e inviare DP" |

### Perimetro

**Cosa entra nel generatore:**
- Segnale implementatore con `gate reale segnalato: sì` nel riepilogo finale
- Stato anomalo rilevato da Auto-Aggio (task in `processing/` oltre timeout, `failed/` marker creato)
- Richiesta diretta dell'orchestratore (trigger manuale esplicito)
- Cambio di stato non standard rispetto alla sequenza attesa (queue → processing → done)

**Cosa il generatore deve rifiutare:**
- Task standard completati correttamente (done marker + sessione + commit)
- Task docs-only senza ambiguità e senza scelta reale
- Errori tecnici minori risolvibili autonomamente dall'implementatore
- Situazioni dove l'orchestratore può decidere da solo (raccomandazione univoca, nessuna alternativa reale)
- Trigger già risolti entro la soglia temporale (threshold anti-rumore)

### Relazione con Auto-Aggio e INBOX

```
┌─────────────────────────────────────────────────────────────────────┐
│  AUTO-AGGIO ENGINE                                                   │
│  - Rileva stato GitHub (done/failed/ambiguo/timeout)                │
│  - NON decide da solo se serve DP                                    │
│  - Delega al DP Generator la valutazione                            │
└────────────────────┬────────────────────────────────────────────────┘
                     │ stato anomalo / segnalazione strutturata
┌────────────────────▼────────────────────────────────────────────────┐
│  DP GENERATOR                                                        │
│  - Valuta: serve davvero una decisione? (filtro anti-rumore)        │
│  - Se sì: assembla DP conforme ai 13 campi canonici                 │
│  - Se no: silenzio (log interno, nessuna notifica)                  │
└────────────────────┬────────────────────────────────────────────────┘
                     │ DP Markdown conforme
┌────────────────────▼────────────────────────────────────────────────┐
│  docs/INBOX.md (futuro task mixed/runtime-gated)                    │
│  - Sezione ## Pending: accoda il DP                                 │
│  - Utente risponde con D-NNNN-X = N                                 │
│  - Sistema registra risposta in ## Decided                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Input del Generatore

### Segnale dall'implementatore (riepilogo finale)

L'implementatore include nel riepilogo finale la sezione strutturata:

```markdown
## Gate reali residui

- gate reale segnalato: sì
- tipo: [scelta architetturale / runtime richiesto / ambiguità / altro]
- descrizione: [testo breve]
- contesto: [task ID, file prodotti, stato GitHub]
```

Il generatore riceve questo segnale e avvia la valutazione.

### Pattern rilevati da Auto-Aggio (stato GitHub)

Auto-Aggio segnala al generatore (input strutturato, non testo libero):

| Pattern GitHub | Segnalazione Auto-Aggio | Input al generatore |
|---|---|---|
| `processing/` oltre timeout senza `done/` | `stato: incompleto, timeout: sì` | trigger: `timeout-senza-done` |
| `failed/` marker creato | `stato: fallito, failed_path: docs/tasks/failed/NNNN-*.md` | trigger: `task-failed` |
| Done marker senza sessione manuale | `stato: ambiguo, mancante: sessione-manuale` | trigger: `ambiguo-senza-sessione` |
| Commit drift fuori allowed paths | `stato: scope-drift, paths: [lista]` | trigger: `scope-drift` |
| DP presente nel documento prodotto | `stato: dp-rilevato, dp_id: D-NNNN-X` | trigger: `dp-rilevato` |

### Richiesta diretta dell'orchestratore (trigger manuale)

L'orchestratore può richiedere esplicitamente la generazione di un DP con:

```markdown
Trigger manuale DP Generator:
- tipo: [architetturale / meta / infra / alina-feature]
- contesto: [testo breve]
- alternativa A: [...]
- alternativa B: [...]
- alternativa C: [...]
- raccomandazione: [A / B / C]
```

### Formato degli input attesi

Il generatore è progettato per input **strutturati**, non testo libero. Input non strutturato (testo libero) non è processabile in modo affidabile e deve essere convertito dall'orchestratore prima di passare al generatore.

| Tipo input | Formato | Affidabilità |
|---|---|---|
| Riepilogo implementatore strutturato | Markdown con sezione `## Gate reali residui` | Alta |
| Segnalazione Auto-Aggio | JSON o Markdown strutturato con campi fissi | Alta |
| Trigger manuale orchestratore | Markdown strutturato con campo `tipo` | Alta |
| Testo libero non strutturato | Non accettato direttamente dal generatore | Bassa — convertire prima |

---

## 3. Trigger Logici

| Trigger | Condizione | Azione generatore | Tipo DP | Silenzioso? |
|---|---|---|---|---|
| Implementatore segnala gate reale | Riepilogo finale con `gate reale segnalato: sì` | Genera DP da contesto segnalato | `automation` / `meta` | No |
| Auto-Aggio: timeout task | Task in `processing/` oltre N minuti senza `done/` | Genera DP recovery (retry / abort / estendi) | `automation` | No |
| Auto-Aggio: task failed | `docs/tasks/failed/{task}.md` creato | Genera DP retry / abort / analisi | `automation` | No |
| Auto-Aggio: stato ambiguo | Done senza sessione, sessione senza commit | Genera DP chiarimento | `automation` | No |
| Auto-Aggio: DP rilevato nel documento | Pattern `# Decision Packet` nel file prodotto | Estrae e re-instrada DP in INBOX | Tipo dal DP originale | No |
| Orchestratore: trigger manuale | Richiesta diretta con alternativestrutte | Genera DP da template per tipo trigger | Tipo dichiarato | No |
| Gate permanente richiesto | Allowed paths includono runtime / VPS / app / deploy / tag / API key | Genera SEMPRE DP, blocca il loop | Tipo per gate | No — sempre attivo |
| Stato normale completato | Done marker + sessione manuale + commit coerente | NON genera DP | — | Sì — silenzioso |
| Task docs-only standard | Nessuna anomalia, nessuna scelta reale | NON genera DP | — | Sì — silenzioso |
| Errore tecnico minore | Errore risolvibile autonomamente dall'implementatore | NON genera DP | — | Sì — log interno |

---

## 4. Mapping verso i 13 Campi Canonici

Il generatore deve mappare l'input verso il template Decision Packet Format.

| # | Campo DP | Fonte input | Logica di derivazione |
|---|---|---|---|
| 1 | **Decision ID** | Auto-incrementale `D-NNNN` | Generatore legge ultimo ID in INBOX + 1; formato: `D-0001`, `D-0002`, ... Se INBOX non esiste: usa ID task corrente come riferimento (es. `D-0131-A`) |
| 2 | **kind** | Classificatore trigger | `automation` per trigger operativi; `infra` per trigger VPS/n8n; `alina-feature` per trigger app; `meta` per trigger roadmap/regole. Indicatore strutturale, non domanda all'utente |
| 3 | **Titolo breve** | Estratto dal contesto | Massimo 60 caratteri; derivato da slug task + tipo trigger; es. "Recovery task 0132 timeout in processing" |
| 4 | **Contesto** | Stato GitHub / riepilogo implementatore | Sintetico: task ID, stato corrente, ultimi 2-3 commit rilevanti, file prodotti |
| 5 | **Perché serve decisione** | Motivazione trigger | Testo che spiega perché il sistema NON può decidere da solo: alternativa A non è chiaramente superiore ad alternativa B |
| 6 | **Opzioni (max 3–5)** | Template per tipo trigger + contesto | Ogni tipo trigger ha template di opzioni predefinito (vedi sezione 6 sotto); il generatore personalizza con contesto specifico; include sempre "micro-interazioni eliminate" per opzione |
| 7 | **Raccomandazione orchestratore** | Logica interna del generatore | Sempre presente; derivata da regole per tipo trigger (es. per timeout: "raccomandazione: retry se timeout < 2h, abort se > 6h"); non opzionale |
| 8 | **Rischio principale** | Template per tipo trigger | Rischio primario per la raccomandazione; es. "retry senza diagnosi causa root" |
| 9 | **Impatto** | Su workstream / roadmap | Derivato da tipo trigger: impatto su task successivo, su roadmap, su app, su automazione |
| 10 | **Micro-interazioni eliminate** | Calcolo per opzione | Stima quantificata: "elimina N scritture aggio", "elimina formulazione manuale DP", "elimina interpretazione stato ambiguo" |
| 11 | **Scelta richiesta** | Formula standard | Sempre: `D-NNNN-X = N` (numero opzione); o `defer` / `skip` / `retry` |
| 12 | **Cosa succede dopo** | Per opzione | Derivato da template per tipo trigger; es. "Se 1 (retry): task torna in queue, implementatore riprende" |
| 13 | **Cosa NON senza gate** | Lista gate permanenti | Lista fissa dei gate permanenti del progetto, sempre inclusa — il generatore non la omette mai |

### Note critiche sul mapping

**Campo 2 — kind:** indicatore strutturale, **non** domanda all'utente. Il generatore lo assegna in base al tipo di trigger, non chiede all'utente di sceglierlo.

**Campo 7 — Raccomandazione:** sempre presente. Se il generatore non riesce a derivare una raccomandazione (trigger non classificabile), fallisce in modo esplicito e delega all'orchestratore con messaggio di errore strutturato.

**Campo 13 — Cosa NON senza gate:** lista fissa, mai omessa:
- runtime n8n, VPS runtime
- modifiche app Alina (`src/**`)
- deploy Apps Script
- tag git
- rollback
- API key, login
- GitHub Actions
- costi ricorrenti nuovi
- runner automatico
- dati personali, credenziali, OAuth material
- test fisico reale (Alina su telefono)

---

## 5. Relazione con Auto-Aggio

Auto-Aggio e DP Generator operano in sequenza, con responsabilità distinte:

| Componente | Responsabilità | Cosa NON fa |
|---|---|---|
| **Auto-Aggio** | Rileva stato GitHub (done/failed/ambiguo/timeout) | NON decide se serve un DP |
| **DP Generator** | Valuta se serve un DP; lo assembla se necessario | NON rileva stato GitHub direttamente |

### Flusso Auto-Aggio → DP Generator

```
Auto-Aggio rileva anomalia
    │
    ▼
Auto-Aggio produce segnalazione strutturata:
{
  "stato": "incompleto | fallito | ambiguo | dp-rilevato | scope-drift",
  "trigger": "timeout-senza-done | task-failed | ...",
  "task_id": "NNNN-slug",
  "dettaglio": "...",
  "timestamp": "2026-MM-DD HH:MM"
}
    │
    ▼
DP Generator riceve segnalazione
    │
    ▼
Filtro anti-rumore (sezione 7)
    │
    ├─ Non serve DP → silenzio (log interno)
    │
    └─ Serve DP → assembla DP con mapping 13 campi
                     │
                     ▼
                  Accoda in docs/INBOX.md ## Pending
```

**Principio chiave:** Auto-Aggio non decide da solo se serve un DP. Delega sempre la valutazione al generatore. Questo mantiene la logica decisionale centralizzata e applicabile a regole uniformi.

---

## 6. Relazione con INBOX (`docs/INBOX.md`)

### Cosa produce il generatore

Il generatore produce un blocco Markdown auto-contenuto conforme al template INBOX (`docs/automation/human-decision-inbox-design.md`):

```markdown
### D-NNNN-X — [titolo breve]

**inbox_status:** pending
**created_at:** 2026-MM-DD
**source_task:** NNNN-slug
**source_document:** docs/automation/{topic}.md
**response:**
**decided_at:**
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-NNNN-X
**kind:** automation | infra | alina-feature | meta
**Titolo breve:** [≤ 60 caratteri]

**Contesto minimo:** [2–4 righe]

**Perché serve decisione:** [perché il sistema non può decidere]

**Opzioni:**
1. [opzione 1]
2. [opzione 2]
3. [opzione 3]

**Raccomandazione orchestratore:** [opzione N — motivo breve]

**Rischio principale:** [rischio chiave]

**Impatto:** [chi/cosa]

**Micro-interazioni umane eliminate:** [stima quantificata]

**Scelta richiesta:** rispondi con `D-NNNN-X = N` oppure `defer` / `skip` / `retry`

**Cosa succede dopo la scelta:** [per ogni opzione]

**Cosa NON verrà fatto senza ulteriore gate:** [lista gate permanenti]
```

### Posizione in INBOX

Il blocco viene inserito in cima alla sezione `## Pending` (più recente prima), come da regole di accodamento definite in `docs/automation/human-decision-inbox-design.md`.

### Vincolo di fase

In questa fase **docs-only**: il generatore è progettato e documentato, ma `docs/INBOX.md` **non esiste ancora** (riservato a task futuro mixed/runtime-gated). Il generatore è pronto per integrarsi con INBOX appena sarà disponibile.

In fase docs-only: il DP viene prodotto e presentato all'orchestratore/utente direttamente in chat o nel documento di sessione, non accodato via commit automatico.

---

## 7. Comportamento quando NON serve una decisione (filtro anti-rumore)

Il generatore ha un filtro anti-rumore esplicito che impedisce la generazione di DP non necessari.

### Regole "NON generare DP"

1. **Task standard completati correttamente** — done marker + sessione manuale + commit coerente presenti → silenzio (Auto-Aggio gestisce con riepilogo passivo)
2. **Task docs-only già determinati senza ambiguità** — scope chiaro, allowed paths rispettati, nessuna alternativa reale → silenzio
3. **Errori tecnici minori** — errore risolvibile autonomamente dall'implementatore senza scelta strategica (es. typo, import mancante, path errato) → silenzio + log interno
4. **Orchestratore ha già decisione univoca** — una sola opzione reale, nessuna alternativa equivalente → silenzio, orchestratore procede direttamente
5. **Trigger già risolto** — anomalia rilevata ma risolta entro soglia temporale (N minuti configurabile) → silenzio
6. **Meno di 2 opzioni reali** — DP richiede ≥ 2 opzioni reali per l'utente; se c'è solo una strada, non è una decisione
7. **Stesso trigger già in INBOX come `pending`** — non duplicare; verificare se esiste già DP per quel trigger prima di generarne uno nuovo
8. **Task con gate permanente già noto e risposta pendente** — se INBOX ha già un DP `pending` per quel gate, non generare un secondo DP

### Schema decisionale del filtro

```
Trigger ricevuto
    │
    ▼
Già in INBOX come pending con stesso trigger? → sì → Silenzio + log "duplicato"
    │ no
    ▼
Trigger già risolto entro soglia? → sì → Silenzio + log "risolto"
    │ no
    ▼
Esistono ≥ 2 opzioni reali? → no → Silenzio + log "no alternativa" + orchestratore procede
    │ sì
    ▼
Orchestratore può decidere da solo? → sì → Silenzio + log "decisione univoca"
    │ no
    ▼
GENERA DP
```

### Principio guida

**Meno DP = meno micro-interazioni = rispetto del criterio permanente.** Un DP non necessario è una micro-interazione sprecata, l'opposto dell'obiettivo del sistema.

---

## 8. Comportamento per Gate Manuali Permanenti

Per i gate permanenti del progetto il comportamento è speciale:

- **Genera SEMPRE un DP** — mai silenzioso su gate permanenti, anche se sembra "ovvio"
- **Blocca il loop** — il prossimo task non viene avviato finché l'utente non risponde
- **Non propone "procedere" come default** — le opzioni del DP non includono mai "procedere senza gate"
- **Lista gate permanenti sempre nel campo 13** — mai omessa

### Elenco gate permanenti che attivano DP obbligatorio

| Gate | Indicatore nel task / nei paths | Tipo DP emesso |
|---|---|---|
| Runtime n8n | `runtime: yes` o `type: n8n-runtime-*` | `automation` |
| VPS runtime | Task tocca VPS (SSH, docker, compose) | `infra` |
| Modifiche app Alina | Allowed paths include `src/**` | `alina-feature` |
| Deploy Apps Script | Task include `npm run deploy` o `clasp deploy` | `infra` |
| Tag git | Task include `git tag` | `meta` |
| Rollback | Task include riferimento a tag precedente per reset | `infra` |
| API key, login | Task include credenziali, OAuth, token | `infra` |
| GitHub Actions | Task tocca `.github/workflows/**` | `infra` |
| Costi ricorrenti nuovi | Task introduce servizio a pagamento | `infra` |
| Runner automatico | Task attiva esecuzione headless non supervisionata | `automation` |
| Dati personali / credenziali | Task processa dati identificativi o segreti | `meta` |
| Test fisico reale | Task richiede validazione su telefono di Alina | `alina-feature` |

---

## 9. Failure Modes del Generatore

| Rischio | Probabilità | Impatto | Mitigazione |
|---|---|---|---|
| **Falso positivo: DP non necessario** | Media | Medio (micro-interazione sprecata) | Filtro anti-rumore esplicito (sezione 7); regola "≥ 2 opzioni reali" |
| **Falso negativo: decisione mancata** | Bassa | Alto (loop bloccato o proseguito erroneamente) | Fallback manuale orchestratore sempre disponibile; gate guard non bypassabile |
| **Mapping incompleto ai 13 campi** | Media | Medio (DP malformato, non leggibile) | Template con placeholder obbligatori + validazione struttura prima dell'invio |
| **Loop infinito (DP → decisione → DP)** | Bassa | Alto (sistema bloccato in ciclo) | Regola: un solo DP attivo per stesso trigger/stato; ID univoco per DP |
| **Stato ambiguo non classificabile** | Media | Medio (generatore si blocca) | Fallback "stato non classificabile" → log + escalation orchestratore; nessuna emissione DP automatica |
| **Creazione DP duplicato su gate già noto** | Media | Basso (duplicazione, non critico) | Deduplica: check esistenza DP per trigger identico in INBOX prima della generazione |
| **Campo 7 (raccomandazione) non derivabile** | Bassa | Medio (DP incompleto) | Generatore fallisce esplicitamente → orchestratore produce raccomandazione manuale |
| **Decision ID non incrementale** | Bassa | Basso (confusione tracking) | In assenza di INBOX: generatore usa ID composto (task ID + lettera progressiva) |
| **DP generato su gate già risposto** | Bassa | Basso (ridondanza) | Check `## Decided` in INBOX prima della generazione |
| **Scope drift del generatore stesso** | Bassa | Alto (generatore scrive in paths vietati) | Forbidden paths hardcoded nel generatore; nessuna scrittura in `src/**`, credenziali, export JSON non redatti |

---

## 10. Anti-rumore / Anti-falso Positivo

Queste regole si applicano **dopo** il filtro base (sezione 7) come livello aggiuntivo di protezione:

1. **Un solo DP attivo per stesso trigger/stato** — se INBOX ha già `pending` con stesso trigger (`source_task` + tipo anomalia), non generare un secondo DP. Aggiornare quello esistente solo se il contesto è sostanzialmente cambiato.

2. **DP solo con ≥ 2 opzioni reali per l'utente** — se non esistono almeno due alternative equivalenti, l'orchestratore può decidere da solo e il DP non va emesso. Presentare una sola opzione non è una decisione, è un'istruzione.

3. **Threshold temporale anti-jitter** — non generare DP se il trigger è stato rilevato e risolto entro N minuti (default: 15 minuti). Questo previene falsi positivi dovuti a ritardi di polling o a task che si completano rapidamente.

4. **Silenzio attivo per task standard** — log interno (non commit, non notifica) che registra "trigger rilevato ma filtrato: task standard". Il silenzio è documentato, non vuoto.

5. **Deduplica per trigger + stato** — prima di emettere un DP, il generatore verifica: stesso trigger per stesso task in INBOX (pending o decided recente)? Se sì: silenzio, log "deduplica", eventuale update dello stato del DP esistente.

---

## 11. Path Documentali per Fase

| Fase | Path | Tipo | Gate richiesto |
|---|---|---|---|
| **Docs-only (questo task)** | `docs/automation/n8n-decision-packet-generator-design.md` | Progettazione | Nessuno |
| **Docs-only (questo task)** | `docs/sessions/2026-05-12-n8n-decision-packet-generator-design.md` | Sessione | Nessuno |
| **Docs-only (questo task)** | `docs/tasks/done/0131-n8n-decision-packet-generator-design.md` | Done marker | Nessuno |
| **Mixed/runtime-gated futuro** | `docs/INBOX.md` | Creazione e popolamento con DP | Gate manuale leggero |
| **Runtime-gated futuro** | Workflow n8n DP Generator | Implementazione nodo | Gate manuale esplicito |
| **Runtime-gated futuro** | Integrazione Auto-Aggio ↔ DP Generator (n8n) | Integrazione | Gate manuale esplicito |
| **Runtime-gated futuro** | Notifica utente (es. Telegram, STATUS.md) | Canale notifica | Gate manuale esplicito + scelta canale |

---

## 12. Criteri di Sicurezza

Il generatore rispetta i seguenti vincoli di sicurezza, non negoziabili:

1. **Non scrive mai in `src/**`, `gas-current/**`, `.gas/**`** — il DP Generator è componente documentale, non tocca codice applicativo
2. **Non include token, API key, URL raw sensibili nel DP** — qualsiasi dato sensibile nel contesto viene rimosso o redatto prima dell'assemblaggio del DP
3. **Il DP contiene solo contesto decisionale** — mai dati personali, credenziali, OAuth material, session ID, `download_url` con token
4. **Non attiva deploy, tag, rollback autonomamente** — il generatore produce un DP che richiede conferma; non esegue l'azione
5. **Scan anti-dati-sensibili pre-emissione** — prima di scrivere il blocco INBOX, il generatore applica pattern matching per token/credenziali. Se trova corrispondenza: blocca l'emissione e segnala all'orchestratore
6. **Non esporta JSON n8n non redatti** — qualsiasi export di workflow n8n deve essere redatto prima del commit

---

## 13. Confini Docs-Only vs Runtime-Gated

| Componente | Fase | Gate richiesto | Note |
|---|---|---|---|
| **Progettazione formato DP** | Docs-only ✅ | Nessuno | Questo documento |
| **Template DP per tipo trigger** | Docs-only ✅ | Nessuno | Sezioni 3 e 4 di questo documento |
| **Logica classificazione trigger** | Docs-only ✅ | Nessuno | Sezioni 5 e 7 |
| **Regole filtro anti-rumore** | Docs-only ✅ | Nessuno | Sezione 7 e 10 |
| **Mapping ai 13 campi** | Docs-only ✅ | Nessuno | Sezione 4 |
| **Definizione gate permanenti** | Docs-only ✅ | Nessuno | Sezione 8 |
| **Creazione `docs/INBOX.md`** | Mixed/runtime-gated | Gate manuale leggero | Task futuro separato |
| **Implementazione nodo n8n DP Generator** | Runtime-gated | Gate manuale esplicito | Task runtime-gated futuro |
| **Integrazione Auto-Aggio ↔ DP Generator** | Runtime-gated | Gate manuale esplicito | Task runtime-gated futuro |
| **Scrittura automatica su `docs/INBOX.md` da n8n** | Runtime-gated | Gate manuale esplicito | Task runtime-gated futuro |
| **Notifica utente (canale esterno)** | Runtime-gated | Gate manuale esplicito + scelta canale | Task runtime-gated futuro |

---

## 14. MVP Documentale

**Cosa è realizzabile adesso, senza runtime:**

1. **Template DP per tipo trigger** — i template delle sezioni 4 e 6 sono pronti per uso manuale dall'orchestratore, senza n8n. L'orchestratore può applicare le regole del generatore come "disciplina di assemblaggio" al momento di formulare un DP.

2. **Checklist pre-emissione** — l'orchestratore usa le regole del filtro anti-rumore (sezione 7) prima di emettere un DP: "serve davvero? Ci sono ≥ 2 opzioni reali? È già in INBOX?"

3. **Mapping 13 campi** — l'orchestratore usa la tabella della sezione 4 come guida per compilare i 13 campi in ordine, con le fonti corrette per ciascun campo.

4. **Regole gate permanenti** — già applicabili dall'orchestratore senza runtime: quando il prossimo step tocca un gate permanente, genera DP obbligatorio.

**Micro-interazioni eliminate immediatamente con solo docs-only MVP:**

| Micro-interazione | Eliminata? |
|---|---|
| "Devo emettere un DP adesso?" (valutazione manuale ad ogni anomalia) | ✅ Sì — regole esplicite |
| "Quali campi devo compilare?" (formato da ricordare) | ✅ Sì — template + mapping |
| "Sto dimenticando qualche gate?" (lista gate da memoria) | ✅ Sì — lista fissa campo 13 |
| "È già in INBOX questo DP?" (verifica manuale) | ✅ Sì — regola deduplica esplicita |
| Emissione DP automatica tramite n8n | ❌ No — richiede runtime-gated futuro |
| Accodamento automatico in `docs/INBOX.md` | ❌ No — richiede INBOX esistente + runtime-gated |

---

## 15. Decision Packet

**Non emesso.**

**Motivazione:** durante la progettazione non è emersa una scelta reale tra alternative architetturali equivalenti che richiedesse input dell'utente. L'architettura del generatore è univocamente determinata dai vincoli attuali:
- Fase docs-only → nessun runtime
- Auto-Aggio già progettato in 0130 → flusso di input definito
- INBOX già progettata in 0129 → formato di output definito
- Decision Packet Format già definito in 0127 → 13 campi in ordine fisso

Se in futuro emergono scelte tra alternative reali (es. canale di input al generatore, soglia timeout configurabile, meccanismo di deduplica ID), si emetterà un Decision Packet dedicato (kind: `automation`).

---

## Ordine Roadmap Successivo

Dopo il completamento di 0131, l'ordine atteso è:

1. **0132** — Ollama Classifier/Planner Feasibility
2. **0133** — Cursor/Implementer Bridge Design

Cambi d'ordine solo tramite Decision Packet (kind: `meta` o `automation`).

---

## Micro-Interazioni Eliminate — Riepilogo

| Scenario | Micro-interazioni eliminate dal DP Generator MVP |
|---|---|
| Task failed rilevato | Formulazione manuale DP recovery (~5 min) |
| Timeout processing rilevato | Valutazione manuale se è anomalia (~3 min) + formulazione DP (~5 min) |
| Gate permanente richiesto | Verifica manuale lista gate (~2 min) + formulazione DP (~5 min) |
| DP già in INBOX (deduplica) | Riformulazione erronea di DP duplicato (~5 min) |
| "Serve un DP?" (ogni anomalia) | Giudizio ad-hoc non sistematico (~2 min × N anomalie/giorno) |
| Compilazione 13 campi | Ricerca formato canonico + compilazione campo per campo (~8 min) |

**Stima riduzione:** con solo il MVP documentale (disciplina orchestratore + template + checklist), ogni DP generato secondo queste regole richiede ~3 minuti invece di ~15 minuti di lavoro manuale non sistematico.

Con runtime n8n futuro: automazione quasi completa (trigger → DP → INBOX) senza intervento orchestratore per casi standard.

---

**n8n Decision Packet Generator Design completato — task 0131 docs-only**
