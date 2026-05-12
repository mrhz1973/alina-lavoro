# Ollama Classifier/Planner Feasibility — Post-Wiki

**Data:** 2026-05-12  
**Task:** 0133-ollama-classifier-planner-feasibility-post-wiki  
**Tipo:** low-touch-loop-docs-only  
**Stato:** completato

---

## Executive Summary

Questo documento valuta la fattibilità di Ollama locale come classifier/planner zero-API per il low-touch loop di Alina Lavoro, **riformulata post-wiki** dopo il completamento di task 0132.

**Cambiamento chiave rispetto alla versione pre-wiki:** il classifier non deve più leggere `docs/PROJECT_STATE.md` (47k+ caratteri) come input primario. Legge `docs/LLMS.md` (≤200 righe) + `docs/wiki/current-state.md` (≤100 righe) + file task (~2–4k caratteri). Il contesto di input totale scende da ~47k a ~3–6k caratteri per classificazione — riducendo i requisiti computazionali e migliorando la fattibilità su hardware modesto.

**Raccomandazione:** **PROCEDERE** con un futuro task di preflight runtime-gated (es. "0134 Ollama Local Preflight Install").

- **Macchina candidata:** MacBook Pro M2 (16 GB RAM unificata, always-on)
- **Modello iniziale:** Qwen 2.5 7B (ottima instruction following, multilingue IT/RU, 7B sostenibile su M2)
- **Fallback modello:** Llama 3.1 8B (Meta, open weights, ben documentato)
- **Gate necessari:** 7 espliciti — qualità, sicurezza, hardware, policy, isolamento, supervisione, conferma utente

---

## 1. Obiettivo Reale del Classifier

### Cosa fa

Il classifier Ollama è un componente di **triage automatico locale** che analizza i task in queue e restituisce una classificazione strutturata per ridurre le micro-interazioni manuali di routing.

| Funzione | Descrizione |
|----------|-------------|
| Classifica tipo task | `docs-only`, `runtime-gated`, `mixed`, `app-change`, `vps-change` |
| Stima rischio | `low` / `medium` / `high` |
| Identifica gate richiesti | rileva gate permanenti espliciti nel task |
| Suggerisce implementatore | Claude Code / Windsurf / Cursor / manuale |
| Indica se serve Decision Packet | sì/no, con motivazione sintetica |
| Determina se può procedere automaticamente | solo per task `docs-only` a rischio `low` |
| Indica se serve intervento umano esplicito | flag per escalation obbligatoria |
| Genera prompt skeleton | bozza prompt implementatore (draft, non definitivo) |
| Legge LLMS.md + wiki/current-state.md + task file | input primario compatto |

### Cosa NON fa

| Funzione | Motivazione |
|----------|-------------|
| Non sostituisce ChatGPT orchestratore | ChatGPT gestisce decisioni architetturali, gestione DP complessi, ragionamento contestuale |
| Non prende decisioni finali su deploy/tag/rollback | gate manuali permanenti invariati |
| Non legge PROJECT_STATE.md come input primario | l'input compatto è il punto di forza post-wiki |
| Non gestisce credenziali o dati sensibili | nessun accesso a credenziali, OAuth, API key |
| Non modifica file direttamente | solo output classificazione in testo strutturato |
| Non è fonte di verità | i canonici vincono sempre; il classifier è advisory |
| Non autorizza azioni — solo suggerisce | ogni output è un suggerimento, non un'autorizzazione |

**Principio fondamentale:** se il classifier fallisce o è incerto, il fallback è il triage manuale dell'orchestratore (Fase A). Nessuna degradazione dello stato — GitHub è fonte di verità, tutto è recuperabile.

---

## 2. Input del Classifier

### Set di input minimale (post-wiki)

| Input | Fonte | Priorità | Dimensione tipica |
|-------|-------|----------|------------------|
| Stato sistema compatto | `docs/LLMS.md` | Primario | ~3–4k caratteri |
| Snapshot stato corrente | `docs/wiki/current-state.md` | Primario | ~2k caratteri |
| File task singolo | `docs/tasks/queue/{task}.md` | Primario | ~1–4k caratteri |
| Metadata task estratti | da file task | Primario | ~500 caratteri |
| Riepilogo Auto-Aggio | output Auto-Aggio se disponibile | Secondario | ~1–2k caratteri |
| PROJECT_STATE.md completo | solo come fallback esplicito | Fallback | ~47k+ caratteri |

**Totale input primario tipico: ~6–10k caratteri** — contro i 47k+ del pre-wiki. Riduzione ~80%.

### Regola di input fondamentale

Il classifier non deve mai caricare `docs/PROJECT_STATE.md` come input standard. Se `docs/LLMS.md` + `docs/wiki/current-state.md` + file task non bastano per la classificazione, il fallback è il **triage manuale dell'orchestratore**, non il caricamento del PROJECT_STATE completo.

**Implicazione operativa:** il protocollo di aggiornamento wiki (definito in task 0132, cadenza identica a PROJECT_STATE) è un prerequisito diretto per l'affidabilità del classifier. Se il wiki è stale, il classifier produce output stale. I canonici vincono sempre.

---

## 3. Output del Classifier

### Formato output atteso

| Campo | Tipo | Valori possibili | Note |
|-------|------|-----------------|------|
| `task_type` | enum | `docs-only` / `runtime-gated` / `mixed` / `app-change` / `vps-change` | Campo più critico |
| `risk_level` | enum | `low` / `medium` / `high` | Determina routing |
| `gates_required` | lista | gate permanenti rilevati nel task | Falsi negativi non tollerabili |
| `recommended_implementer` | string | `Claude Code` / `Windsurf` / `Cursor` / `manual` | Advisory |
| `needs_decision_packet` | bool | `true` / `false` | Se serve scelta utente |
| `can_auto_proceed` | bool | `true` / `false` | Solo se `docs-only` + `risk: low` + nessun gate |
| `needs_human` | bool | `true` / `false` | Escalation obbligatoria |
| `prompt_skeleton` | testo | bozza prompt implementatore | Draft — non definitivo |
| `confidence` | enum | `high` / `medium` / `low` | Soglia di affidabilità |

### Regola di routing per confidence

| Confidence | Azione |
|-----------|--------|
| `high` | Usa output classifier come advisory; n8n può procedere con supervisione |
| `medium` | Usa output ma segna per revisione umana prima di azione automatica |
| `low` | **Ignora output classifier; triage manuale obbligatorio** |

Se `confidence: low`, il classifier deve indicare esplicitamente il motivo (task ambiguo, informazioni insufficienti, gate non riconoscibili) e non deve fingere certezza.

---

## 4. Modelli Candidati

Valutazione docs-only su specifiche pubbliche — nessun test reale eseguito.

| Modello | Parametri | RAM stimata (4-bit quant) | Hardware | Valutazione |
|---------|-----------|--------------------------|----------|-------------|
| **Qwen 2.5 7B** | 7B | ~5–6 GB | MacBook Pro M2 | ⭐ **Prima scelta** — Alibaba, ottima instruction following, multilingue incluso IT/RU, ottimo per classificazione strutturata, formato JSON nativo |
| **Qwen 3 7B** | 7B | ~5–6 GB | MacBook Pro M2 | Alternativa aggiornata a Qwen 2.5 7B — da valutare per instruction following migliorato |
| **Llama 3.1 8B** | 8B | ~5–6 GB | MacBook Pro M2 | Meta, open weights, buona documentazione, ottimo fallback; leggermente più pesante di Qwen 7B |
| **Mistral 7B** | 7B | ~5–6 GB | MacBook Pro M2 | Europeo (Mistral AI, FR), buono per instruction following, GDPR-friendly per origine; alternativa valida |
| **Phi-3 Mini** | 3.8B | ~3–4 GB | MacBook Pro M2 | Microsoft, molto leggero; adatto per classificazione semplice se latenza è priorità; qualità instruction following inferiore a 7B |
| **Qwen 2.5 14B** | 14B | ~9–10 GB | RTX 3060 12GB | Solo se 12 GB VRAM sufficienti senza offloading significativo; da verificare nel preflight; non per primo test |

### Raccomandazione modello

**Primo test:** Qwen 2.5 7B su MacBook Pro M2.

**Motivazione:** instruction following strutturato superiore per output JSON/tabellare, supporto multilingue IT/RU rilevante per i task del progetto, dimensione ottimale per 16 GB RAM unificata M2 senza saturazione, documentazione e community consolidata.

**Fallback:** Llama 3.1 8B se Qwen 2.5 7B non raggiunge la soglia qualitativa minima nel benchmark sintetico.

**14B non per il primo test:** il preflight con 7B/8B deve confermare l'approccio prima di aumentare la dimensione. La qualità del prompt (system prompt compatto, input strutturato) ha più impatto della dimensione del modello per questo use case.

---

## 5. Hardware Disponibile

### Analisi match hardware/modello

| Macchina | Specs rilevanti | Suitability | Candidato per |
|----------|----------------|-------------|---------------|
| **MacBook Pro M2** | Apple Silicon, 16 GB RAM unificata, 1 TB SSD | ✅ **Always-on leggero** | ⭐ **Primo test e uso operativo** — Ollama 7B/8B sostenibile; latenza bassa per classificazione; memoria unificata CPU/GPU favorisce modelli 7B senza VRAM limit; always-on compatibile con uso automatico futuro |
| **Workstation AMD Ryzen 9 3900X** | 32 GB RAM, RTX 3060 12 GB VRAM | ✅ Capacità maggiore | AI locale più pesante; 14B possibile se 12 GB VRAM sufficienti; embedding generation; non always-on — non adatta per primo test automatizzato |
| **VPS IONOS** | CPU-only, 1 vCPU, RAM limitata | ❌ **Non adatta** | n8n runtime — mantenerla solo per automazione; inferenza LLM CPU-only con 7B+ ha latenza >60s — non accettabile per classifier |

### Raccomandazione hardware

**Primo test: MacBook Pro M2.**

Motivazioni:
1. Always-on — compatibile con integrazione n8n futura che chiama Ollama su localhost
2. RAM unificata 16 GB — nessun limite VRAM separato; modello 7B usa ~5–6 GB, rimane margine
3. Apple Silicon — Ollama ha ottimizzazioni native per M1/M2/M3; performance superiore a CPU x86 per inferenza
4. Non blocca la workstation per lavoro — classifier leggero non impatta uso quotidiano
5. Isolamento naturale — MacBook non esposto a internet durante inferenza

**Workstation RTX 3060:** da valutare come opzione secondaria dopo il primo test su M2, per modelli 14B o per embedding generation se necessari in futuro.

---

## 6. Feasibility Senza Runtime

### Criteri di qualità minimi (da verificare nel preflight)

Questi criteri devono essere soddisfatti prima di qualsiasi uso operativo del classifier:

| Criterio | Soglia minima | Nota |
|----------|--------------|------|
| Accuratezza classificazione tipo task | ≥ 90% su dataset sintetico 20 task storici | Errore di tipo = micro-interazione in più, tollerabile |
| Gate identification (recall) | ≥ 95% — falsi negativi non tollerabili | Un falso negativo su gate = rischio alto; soglia alta |
| Gate identification (precision) | ≥ 80% — falsi positivi tollerabili | Un falso positivo crea solo conferma extra; accettabile |
| Confidence `low` su task ambigui | ≥ 90% corretto flagging | Il classifier non deve fingere certezza |
| Latenza classificazione | ≤ 10 secondi su MacBook Pro M2 | Oltre 30s = skip classifier e triage manuale |
| Output strutturalmente valido | ≥ 95% JSON/YAML parseable | Malformato = retry o fallback manuale |

### Benchmark sintetico futuro

Il preflight runtime-gated deve includere:

- **Dataset:** 20–30 task storici del progetto (0100–0132) con classificazione umana nota
- **Metriche:** precision / recall / F1 per ogni campo output (task_type, risk_level, gates_required)
- **Ambiente:** MacBook Pro M2, Ollama, modello 7B/8B (Qwen 2.5 7B come prima scelta)
- **System prompt:** fisso, versionato nel repository come template
- **Test script:** script Python/shell che legge task, genera prompt, chiama Ollama via API localhost, confronta output con classificazione umana di riferimento
- **Threshold pass/fail:** tutti i criteri minimi sopra soddisfatti contemporaneamente

### Failure modes

| Rischio | Probabilità | Impatto | Fallback |
|---------|------------|---------|---------|
| Classifier sbaglia tipo task (docs-only vs runtime-gated) | Media | **Alto** — se runtime-gated classificato come docs-only, azione errata | **Fallback: triage manuale orchestratore**; regola: sul dubbio, trattare come runtime-gated |
| Classifier manca gate runtime (falso negativo) | Bassa | **Critico** — gate non rilevato = azione non autorizzata | **Fallback invariante: gate check manuale sempre su runtime-gated** — mai auto-proceed su operazioni con gate |
| Latenza > 30 secondi | Media | Basso — solo delay | Skip classifier; triage manuale come baseline |
| Modello 14B non entra in VRAM (RTX 3060) | Media | Basso — solo limitazione modello | Usare 7B come fallback; non blocca operatività |
| Ollama non disponibile (down, crash) | Bassa | Basso — fallback immediato | Triage manuale orchestratore; Fase A come baseline sempre disponibile |
| Output strutturalmente malformato | Media | Medio — retry necessario | Retry con temperatura ridotta o fallback manuale |
| Wiki stale → output stale | Media | Medio — classificazione basata su stato obsoleto | Protocollo aggiornamento wiki obbligatorio a ogni task; canonici vincono sempre |

**Fallback invariante assoluto:** se il classifier fallisce per qualsiasi motivo (down, latenza, output errato, confidence low), il loop torna alla modalità manuale-supervisionata (Fase A) **senza perdita di stato**. GitHub è fonte di verità — tutto è recuperabile. Il classifier è un'ottimizzazione, non un requisito.

---

## 7. Gate Prima dell'Installazione

Prima di qualsiasi installazione Ollama, download modelli, o test runtime, **tutti** i seguenti gate devono essere superati:

### Gate 1 — Qualità

- Test su dataset sintetico (20–30 task storici) con criteri minimi soddisfatti
- Precision ≥ 80% e recall ≥ 95% per gate_identification
- Accuratezza tipo task ≥ 90%
- Latenza ≤ 10s su MacBook Pro M2
- **Verifica:** script di benchmark automatico, risultati documentati in sessione dedicata

### Gate 2 — Sicurezza

- Conferma che Ollama locale non ha accesso a:
  - Credenziali, token, API key
  - Dati app Alina (Google Sheet, email, dati personali)
  - Sessioni GitHub o OAuth material
- L'input del classifier contiene solo: stato progetto generico (LLMS.md), snapshot task (wiki/current-state.md), file task pubblico
- **Verifica:** review manuale dei system prompt e dell'input fornito al modello

### Gate 3 — Hardware

- Verifica che il modello scelto giri su MacBook Pro M2 entro parametri accettabili
- RAM consumata ≤ 8 GB con modello caricato (margine per sistema operativo e altre applicazioni)
- Latenza misurata ≤ 10s per classificazione singola
- **Verifica:** test manuale misurando RAM e tempo di risposta prima del benchmark formale

### Gate 4 — Policy

- Conferma esplicita che l'output del classifier è trattato come **suggerimento**, non come autorizzazione
- Documentazione della regola nel runbook e nel protocollo operativo
- Tutti i gate permanenti esistenti (deploy, tag, rollback, VPS, n8n runtime, API key, login, GitHub Actions, runner automatico, dati personali) **restano invariati e manuali**
- **Verifica:** aggiornamento `docs/automation/permissions.md` e `docs/automation/runbook.md` con regola policy

### Gate 5 — Isolamento

- Ollama configurato per operare offline durante inferenza (nessuna chiamata di rete durante classificazione)
- Nessun dato del progetto trasmesso a servizi esterni
- Modello scaricato localmente e operante solo su rete locale o loopback
- **Verifica:** test con rete disabilitata — Ollama deve funzionare in locale puro

### Gate 6 — Supervisione

- Prima attivazione obbligatoriamente in modalità **dry-run**: output classifier loggato, nessuna azione automatica
- Revisione di almeno 10 classificazioni reali (non sintetiche) da parte dell'orchestratore prima di qualsiasi uso operativo
- Documentazione delle revisioni in sessione dedicata
- **Verifica:** sessione dry-run con almeno 10 task reali classificati e rivisti

### Gate 7 — Conferma Utente Manuale

- Conferma manuale esplicita dell'utente prima di qualsiasi runtime Ollama
- La conferma deve avvenire con Decision Packet dedicato (kind: `automation`) che documenta: macchina target, modello scelto, risultati benchmark, rischi residui
- **Verifica:** Decision Packet emesso e risposta utente documentata in INBOX.md (quando creata)

---

## 8. Relazione con LLMS.md e docs/wiki/

### Il wiki come abilitatore del classifier

Il completamento di task 0132 (LLM Wiki) è il prerequisito diretto che rende il classifier Ollama post-wiki significativamente più fattibile rispetto alla versione pre-wiki:

| Aspetto | Pre-wiki | Post-wiki |
|---------|----------|-----------|
| Input standard classifier | PROJECT_STATE.md (~47k chars) | LLMS.md + wiki/current-state.md (~5–6k chars) |
| Token per classificazione | ~12k–15k tokens | ~1.5k–2k tokens |
| Modelli adatti | 13B+ per qualità accettabile | 7B sufficiente per qualità accettabile |
| Hardware minimo | GPU 12GB+ o CPU lenta | MacBook Pro M2 (RAM unificata 16GB) |
| Latenza attesa | 30–60s con 7B | 5–15s con 7B |

### Dipendenza operativa

- Il classifier legge `docs/LLMS.md` come **contesto di sistema**: stato progetto, workstream, gate aperti, implementatori disponibili
- Il classifier legge `docs/wiki/current-state.md` per lo **snapshot corrente**: task attivo, debiti tecnici, stato VPS/n8n
- Il classifier **non legge** `docs/PROJECT_STATE.md` come input standard — solo come fallback esplicito

### Rischio wiki stale

Se il wiki non viene aggiornato a ogni task completion, il classifier opera su stato obsoleto e può produrre classificazioni errate. La regola di aggiornamento wiki (task 0132: stessa cadenza di PROJECT_STATE) è un **prerequisito operativo** del classifier, non un'ottimizzazione opzionale.

**Regola di degradazione graceful:** se wiki stale è rilevato (divergenza con canonical docs), il classifier deve produrre `confidence: low` o `needs_human: true` per tutti i task che dipendono dallo stato più recente, anziché classificare su basi obsolete.

---

## 9. Relazione con n8n e il Low-Touch Loop

### Posizione nell'architettura

```
GitHub → n8n queue reader → [Ollama classifier] → n8n prompt generator → implementatore
                                    ↑
                         (LLMS.md + wiki/current-state.md + task file)
```

Il classifier si inserisce come **componente intermedio opzionale** tra il queue reader e il prompt generator. Non sostituisce nessuno dei componenti esistenti — li augmenta.

### Flusso atteso (Fase C futura)

1. n8n rileva nuovo task in queue (polling 5 min, già operativo)
2. n8n invia a Ollama: `docs/LLMS.md` + `docs/wiki/current-state.md` + file task
3. Ollama restituisce classificazione strutturata (9 campi)
4. n8n valuta output:
   - Se `can_auto_proceed: true` + `risk_level: low` + `confidence: high` → n8n genera prompt automaticamente
   - Se `needs_decision_packet: true` o `risk_level: medium/high` → n8n genera Decision Packet per INBOX
   - Se `confidence: low` o `needs_human: true` → triage manuale orchestratore
5. Utente risponde al Decision Packet solo se necessario

### Componente n8n necessario (futuro runtime-gated)

Per integrare il classifier nel flusso n8n, sarà necessario un nodo `HTTP Request` che chiama l'API Ollama locale:

```
POST http://localhost:11434/api/generate
{
  "model": "qwen2.5:7b",
  "prompt": "[system prompt] + [LLMS.md content] + [wiki/current-state.md content] + [task file content]",
  "stream": false,
  "format": "json"
}
```

Questo nodo è **fuori scope ora** — richiede task runtime-gated separato dopo il preflight.

### Nessuna modifica n8n runtime ora

L'integrazione n8n del classifier è documentata come design futuro. Non viene implementata in questo task. Il queue reader esistente (già operativo con polling 5-min) non viene modificato.

---

## 10. Raccomandazione Finale

### Raccomandazione: PROCEDERE

**Procedere** con un futuro task preflight runtime-gated: **"0134 Ollama Local Preflight Install"** (o numerazione equivalente nella roadmap).

**Motivazione:**

1. **Fattibilità hardware confermata:** MacBook Pro M2 (16 GB RAM unificata) è adeguato per modelli 7B/8B con Ollama. Nessun acquisto hardware richiesto.
2. **Input significativamente ridotto post-wiki:** ~6–10k caratteri vs 47k+ del pre-wiki. Un modello 7B può gestire questo contesto con qualità accettabile per classificazione strutturata.
3. **Use case ben delimitato:** il classifier non deve ragionare su codice, non deve comprendere dominio complesso, deve solo classificare task su base di metadata e parole chiave strutturate. Questo è un use case dove i modelli 7B eccellono.
4. **Fallback always-available:** la modalità Fase A (triage manuale orchestratore) resta sempre disponibile. Il classifier non è un punto di fallimento — è un'ottimizzazione opzionale.
5. **Micro-interazioni eliminate:** il triage manuale di un task standard richiede ~2–5 minuti di attenzione orchestratore. Il classifier lo riduce a ~15 secondi di latenza + revisione rapida. Per 3–5 task/settimana = ~10–20 minuti/settimana di recupero.
6. **Zero costo API:** Ollama locale zero-API elimina completamente il costo per classificazione rispetto a soluzioni cloud.

### Parametri del preflight raccomandato

| Parametro | Valore consigliato | Alternativa |
|-----------|-------------------|-------------|
| Macchina | MacBook Pro M2 | Workstation RTX 3060 (solo per modelli 14B) |
| Modello iniziale | Qwen 2.5 7B | Llama 3.1 8B |
| Quantizzazione | 4-bit (Q4_K_M) | 5-bit se RAM permette |
| Task benchmark | 20–30 task storici 0100–0132 | Minimo 15 task |
| Script test | Python con chiamata API Ollama localhost | Shell con `curl` + `jq` |
| Soglia pass/fail | recall gates ≥ 95%, tipo task ≥ 90% | Non negoziabile |
| Dry-run review | 10 task reali prima di uso operativo | Non negoziabile |

### Task da aprire come step successivo

**"0134 Ollama Local Preflight Install"** — tipo: `runtime-gated` — Gate 7 (conferma utente manuale) richiesto prima dell'apertura.

Scope del preflight:
1. Installazione Ollama su MacBook Pro M2 (solo con gate 7 superato)
2. Download modello Qwen 2.5 7B (~4.7 GB)
3. Verifica RAM e latenza (gate 3)
4. Verifica isolamento rete (gate 5)
5. Esecuzione benchmark sintetico (20 task storici, gate 1)
6. Dry-run 10 task reali (gate 6)
7. Documentazione risultati

### Decision Packet

La raccomandazione in questa feasibility è **univocamente determinata** dai vincoli: hardware disponibile adeguato, input compatto grazie al wiki, use case ben delimitato, fallback sempre disponibile, costo zero. Non emergono ≥2 opzioni architetturali reali equivalenti tra cui l'utente deve scegliere.

**Decision Packet non emesso.** La scelta è: aprire il task preflight runtime-gated solo dopo conferma manuale utente esplicita (gate 7).

---

## Appendice: Confronto Pre-Wiki vs Post-Wiki

| Dimensione | Pre-wiki | Post-wiki | Delta |
|------------|----------|-----------|-------|
| Input totale classifier | ~47k chars | ~6–10k chars | -80% |
| Token LLM per classificazione | ~12k–15k | ~1.5k–2.5k | -83% |
| Modello minimo per qualità accettabile | 13B+ | 7B | -46% parametri |
| RAM necessaria | 12 GB VRAM (13B 4-bit) | 5–6 GB RAM unificata (7B 4-bit) | -50% |
| Macchina candidata | RTX 3060 12GB (limite) | MacBook Pro M2 (comfortable) | più hardware disponibile |
| Latenza attesa (7B) | 30–60s (contesto lungo) | 5–15s (contesto compatto) | -75% |
| Qualità attesa (7B, contesto lungo) | Media–Bassa (contesto > limite ottimale) | Media–Alta (contesto compatto nel range ottimale) | migliorata |

Il wiki layer è il prerequisito che rende il classifier Ollama post-wiki sensibilmente più fattibile rispetto alla versione pre-wiki. La decisione di completare task 0132 prima di 0133 era corretta.

---

**Documento chiuso — Raccomandazione: PROCEDERE al preflight runtime-gated (gate 7 richiesto prima dell'apertura del task).**

---

## 11. Post-Feasibility User Decision (2026-05-12)

### Decisione utente

Dopo il completamento della feasibility (task 0133), l'utente ha comunicato esplicitamente:

> "ora non voglio usare il mac, continuo ad usare windows con ollama"

**Il target iniziale per il futuro preflight Ollama locale non è più MacBook Pro M2.**

**Il target iniziale diventa la workstation Windows già in uso dall'utente.**

### Nuovo target hardware

| Campo | Valore |
|-------|--------|
| OS | Windows (in uso corrente) |
| CPU | AMD Ryzen 9 3900X |
| RAM | 32 GB |
| GPU | NVIDIA RTX 3060 12 GB VRAM |

### Aggiornamento raccomandazione hardware

| Macchina | Ruolo aggiornato |
|----------|-----------------|
| **Workstation Windows (Ryzen 9 3900X / RTX 3060 12 GB)** | ⭐ **Primo test e target iniziale** — GPU dedicata 12 GB VRAM; Ollama con CUDA; 32 GB RAM |
| **MacBook Pro M2** | Opzione futura / seconda fase — non target iniziale |
| **VPS IONOS** | Invariato — solo n8n; non per LLM locali |

### Aggiornamento raccomandazione modello

| Modello | Parametri | VRAM stimata (4-bit) | Target hardware | Ruolo aggiornato |
|---------|-----------|---------------------|-----------------|-----------------|
| **Qwen 2.5 7B** | 7B | ~5–6 GB | RTX 3060 12 GB | ⭐ **Prima scelta** — entra in VRAM con margine abbondante |
| **Qwen 3 8B** | 8B | ~5–6 GB | RTX 3060 12 GB | Alternativa aggiornata — da valutare nel preflight |
| **Llama 3.1 8B** | 8B | ~5–6 GB | RTX 3060 12 GB | Fallback valido |
| **Qwen 2.5 14B** | 14B | ~9–10 GB | RTX 3060 12 GB | **Da valutare nella seconda fase** — entra in 12 GB VRAM solo se quantizzazione efficiente; da verificare nel preflight |

**Nota modello 14B:** su RTX 3060 12 GB la fattibilità di un 14B 4-bit (~9–10 GB VRAM) dipende dal margine residuo dopo l'overhead del driver CUDA. Il preflight deve verificare questo esplicitamente. Il primo test resta con Qwen 2.5 7B o Qwen 3 8B.

### Cosa non cambia

- I 7 gate pre-installazione restano invariati e obbligatori
- Il fallback invariante (Fase A, triage manuale orchestratore) resta sempre disponibile
- Gate 7 (conferma manuale utente + Decision Packet) è ancora richiesto prima di aprire il task preflight
- Nessuna installazione Ollama, nessun download modello, nessun runtime eseguito in questo task
- Il documento di feasibility originale (sezioni 1–10) conserva validità: cambiano solo il target hardware e il contesto di deployment

### Impatto sul futuro task 0134

Il futuro task **"0134 Ollama Local Preflight Install"** deve essere riformulato come:

**"0134 Windows Ollama Local Preflight Install"** (tipo: `runtime-gated`)

Scope aggiornato del preflight:
1. Installazione Ollama su Windows con backend CUDA (solo con gate 7 superato)
2. Download modello Qwen 2.5 7B (~4.7 GB) o Qwen 3 8B
3. Verifica VRAM consumata e latenza (gate 3 — soglie invariate: ≤10s, modello caricato entro limite VRAM)
4. Verifica isolamento rete (gate 5)
5. Esecuzione benchmark sintetico (20 task storici, gate 1)
6. Dry-run 10 task reali (gate 6)
7. Documentazione risultati
8. Valutazione opzionale Qwen 2.5 14B se 7B passa i criteri minimi

**Sessione di registrazione decisione:** `docs/sessions/2026-05-12-ollama-target-windows-decision.md`

---

## 12. Language Policy for Classifier Prompts (2026-05-12)

**Added post-feasibility — docs-only, no runtime.**

### Rule

Local 7B/8B classifier prompts must use **technical English by default**.

| Context | Language |
|---------|----------|
| System prompt for classifier/planner | Technical English |
| Structured output fields (task_type, risk_level, gates_required, etc.) | Technical English |
| Prompt skeleton generated by n8n for implementer | Technical English |
| Final orchestrator response to user | Italian |
| User-visible Decision Packet | Italian |

### Empirical Basis

User observation (2026-05-12): qwen3:8b via Ollama operates in Italian but is more verbose and less precise on technical classification concepts. Technical English produces more structured, predictable output from the same model.

This supports the gate 1 benchmark: when designing the test dataset (20–30 historical tasks), the system prompt and output format schema must be written in technical English.

### What This Does Not Authorize

- No runtime execution
- No Ollama installation
- No model download
- No n8n runtime modification

Gate 7 (manual user confirmation + Decision Packet) is still required before any Ollama runtime action.

→ Full language policy: `docs/AI_RULES.md` — "Language policy for agents"
