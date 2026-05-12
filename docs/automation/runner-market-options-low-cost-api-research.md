# Runner Market Options & Low-Cost API Research — Fase 3A

**Data:** 2026-05-12  
**Task:** 0126-runner-market-options-low-cost-api-research  
**Tipo:** runner-market-research-docs-only  
**Eseguito da:** Windsurf/Cascade (implementatore di riserva/supervisionato)  
**Stato:** completato

---

## 1. Executive Summary

La ricerca documentale conferma la decisione di 0124 nel breve termine (modalità manuale-supervisionata), ma identifica tre direzioni concrete da esplorare nel medio termine con task runtime-gated separati:

1. **Cursor CLI post-reset** (tra ~10 giorni) — implementatore principale più probabile
2. **Self-hosted Ollama locale** — utile come planner/classifier zero-API per metadata non sensibili
3. **Architettura ibrida planner low-cost + executor sicuro** — se in futuro si accetta uso limitato di API con provider che offre deployment EU/Singapore (es. Qwen via Alibaba Cloud Model Studio) per sola classificazione/boilerplate, mantenendo executor supervisionato locale

**Nessuna API cinese/non occidentale raccomandata nel breve termine** per il progetto Alina Lavoro, anche per dati non sensibili, perché:

- Alibaba Cloud Model Studio offre solo deployment in Cina continentale per DeepSeek/Kimi/GLM (endpoint e archiviazione dati in Beijing) — vincolo privacy
- Qwen via Alibaba Cloud Model Studio ha deployment EU/Singapore, ma introduce comunque dipendenza contrattuale
- Il vantaggio economico (input < $0.30/1M token) non giustifica i rischi privacy/lock-in senza una reale pressione operativa

**Raccomandazione breve termine:** restare su modalità manuale-supervisionata, consolidare runbook, attendere reset Cursor. Prima prova tecnica proponibile: Ollama locale docs-only su metadata sintetici, con task 0127 separato runtime-gated.

---

## 2. Contesto

- **Task 0124 completato:** decisione Fase 3A no-API — manuale-supervisionata come baseline
- **Task 0125 completato:** Codex CLI non raccomandato per runner VPS headless no-API-key
- **n8n:** resta queue reader/prompt generator/session tracker — NON runner
- **Runner automatico:** non attivo; non autorizzato
- **VPS:** Claude Code CLI installata ma non autenticata
- **App Alina V1.9.2:** stabile e fuori scope
- **Presupposto operativo:** no API key manuali (requisito utente)

---

## 3. Fonti Ufficiali Consultate

Tutte consultate il **2026-05-12**. Nessun URL con token, query string sensibile o OAuth material documentato.

| # | Fonte | URL (pubblico) | Ambito | Note |
|---|-------|---------------|--------|------|
| 1 | Anthropic Claude Code | `claude.com/product/claude-code` | Claude Code CLI (già valutato in 0124) | |
| 2 | OpenAI Codex CLI — Auth | `developers.openai.com/codex/auth` | Autenticazione, headless, device code (già valutato in 0125) | |
| 3 | OpenAI Codex CLI — CLI | `developers.openai.com/codex/cli` | CLI setup, exec command, approval modes (già valutato in 0125) | |
| 4 | GitHub Actions — Billing | `docs.github.com/billing/managing-billing-for-github-actions/about-billing-for-github-actions` | Billing/quote repo privati | |
| 5 | GitHub Actions — Usage | `docs.github.com/en/actions/concepts/billing-and-usage` | Usage charges, self-hosted runners | |
| 6 | Ollama Docs | `docs.ollama.com/` | Documentazione ufficiale Ollama | |
| 7 | Ollama Quickstart | `docs.ollama.com/quickstart` | macOS/Windows/Linux installation | |
| 8 | Ollama FAQ | `docs.ollama.com/faq` | Docker, hardware, CPU/GPU | |
| 9 | DeepSeek API — Pricing | `api-docs.deepseek.com/quick_start/pricing` | Pricing DeepSeek ufficiale | Da verificare: data esatta e stabilità versioni |
| 10 | Alibaba Cloud Model Studio | `alibabacloud.com/help/en/model-studio/model-pricing` | Pricing Qwen/DeepSeek/Kimi/GLM via Alibaba | Deployment region EU disponibile per Qwen |
| 11 | Alibaba Cloud Model Studio — Models | `alibabacloud.com/help/en/model-studio/models` | Supported models, regioni deployment | |
| 12 | Moonshot/Kimi Platform | `platform.moonshot.ai/` | Kimi API pubblica | |
| 13 | ZhipuAI OpenPlatform | `bigmodel.cn/pricing`, `docs.bigmodel.cn/cn/guide/models/text/glm-5.1` | GLM pricing/docs | Documentazione principale in cinese — da verificare disponibilità completa in inglese |
| 14 | n8n docs | `docs.n8n.io` | n8n HTTP Request, Execute Command, Code nodes | Non riletta in questa sessione: già utilizzata in task precedenti |

**Note "da verificare":**
- Prezzi DeepSeek v4-pro indicati come "sconto 75% fino a 2026-05-31" nella pagina ufficiale — da verificare su pagina pricing al momento dell'uso effettivo
- Le date di rilascio dei modelli DeepSeek v4 citate sono recenti; versioni esatte vanno sempre riverificate su fonte ufficiale al momento dell'uso
- GitHub Actions: menzione di "nuovo $0.002 per-minute Actions cloud platform charge" su pagina marketing — dettagli finali da verificare su `docs.github.com/billing` al momento dell'uso effettivo

---

## 4. Valutazione per Categoria

### 4.1 Zero-API / Massima Sicurezza

#### Claude Code locale supervisionato
- **Fattibilità:** ✅ già operativo
- **API key:** no (subscription Claude Pro/Team)
- **Headless:** ❌ richiede login browser
- **Dati a esterni:** prompt + codice via Anthropic (subscription)
- **Rischio modifiche:** basso (supervisionato)
- **Esito:** ✅ Raccomandato — già baseline

#### Windsurf/Cascade supervisionato
- **Fattibilità:** ✅ già operativo (questa sessione)
- **API key:** no (subscription)
- **Headless:** ❌
- **Dati a esterni:** contesto workspace via Windsurf
- **Esito:** ✅ Raccomandato come riserva

#### Cursor CLI post-reset
- **Fattibilità:** ⚠️ da verificare al reset (~10 giorni)
- **API key:** no (subscription Pro/Team)
- **Headless:** parziale (documentato in Cursor docs)
- **Esito:** ⚠️ Da verificare — preflight al reset con task separato

#### Codex CLI locale
- **Fattibilità:** ⚠️ possibile, non prioritario
- Già valutato in 0125 — non prioritario rispetto a Claude Code/Windsurf
- **Esito:** ⚠️ Non prioritario

#### Modalità manuale-supervisionata consolidata
- **Fattibilità:** ✅ baseline attuale
- **Esito:** ✅ Raccomandato — consolidare runbook

---

### 4.2 VPS con CLI Autenticata

| Soluzione | API key | Headless | Esito |
|-----------|---------|----------|-------|
| Claude Code CLI VPS | no (subscription) | ❌ login interattivo non compatibile | ❌ Sconsigliato (da 0123) |
| Codex CLI VPS (subscription) | no | ⚠️ device code beta + auth.json copy | ❌ Sconsigliato nel breve termine (da 0125) |
| Cursor CLI VPS | no | ⚠️ da verificare al reset | ⚠️ Da verificare |

**Nota:** tutte le opzioni VPS CLI autenticata richiedono gestione di token/auth.json in chiaro su VPS non presidiato — rischio privacy/security.

---

### 4.3 VPS con API Key

| Soluzione | Costo ordine di grandezza | Esito |
|-----------|--------------------------|-------|
| Claude API (Anthropic) | ~$3–$15/1M tokens input per Sonnet/Opus classe | ⚠️ Viola presupposto no-API-key |
| OpenAI API | ~$0.15–$10/1M input a seconda del modello | ⚠️ Viola presupposto no-API-key |
| Gemini API (Google) | tiers incluso free limitato | ⚠️ Viola presupposto no-API-key |

**Esito categoria:** ❌ Sconsigliato nel breve termine — tutte violano presupposto no-API-key. Menzionate solo per completezza.

---

### 4.4 GitHub Actions

**Fonte:** `docs.github.com/billing/managing-billing-for-github-actions/about-billing-for-github-actions` (2026-05-12).

- **Quota gratuita repo privati:** ogni account GitHub riceve minuti gratuiti (varia per piano: Free/Pro/Team/Enterprise). Reset mensile.
- **Oltre quota:** addebito al metodo di pagamento / spending limit.
- **Runner self-hosted:** gratuiti (ma richiedono infrastruttura propria = VPS).
- **Repo pubblici:** GitHub-hosted runners gratuiti.
- **Segreti:** GitHub Secrets supporta token/API key crittografate — ma ogni secret va creato manualmente.
- **Rischi specifici per Alina Lavoro:**
  - Repo privato: ogni run consuma minuti
  - Eventuale API key in GitHub Secrets = API key configurata (viola presupposto)
  - Modifiche indesiderate su `main` se workflow ha `contents: write`
  - Rischio accidentale con `push` su workflow

**Esito:**
- ❌ Come orchestratore automatico: sconsigliato (richiede API key o CLI auth — entrambe violano presupposti; rischio commit automatici)
- ⚠️ Come CI docs-only (es. lint markdown, dead-link check): possibile in futuro con task separato, ma fuori scope attuale

---

### 4.5 n8n + LLM API

**Contesto:** n8n già in produzione come queue reader/prompt generator/session tracker.

**Ipotesi architetturali:**
- Nodo HTTP Request verso API LLM esterna per classificazione/metadata
- Code node per parsing output
- Budget token controllato tramite prompt engineering

**Token stimati ordine di grandezza (task docs-only tipico Alina):**
- Metadata task (ID, tipo, priority, flags): 500–2'000 input, 200–500 output
- Classificazione boilerplate: 1'000–3'000 input, 300–800 output
- Riformattazione prompt: 2'000–5'000 input, 500–1'500 output

**Cost cap proponibile (se mai attivato con task separato):**
- Tetto giornaliero: X USD
- Tetto per task: Y USD
- Alert automatico a Z% del tetto

**Esito:**
- ❌ Nel breve termine: sconsigliato (richiede API key = viola presupposto)
- ⚠️ Come architettura futura: fattibile solo come "planner economico" per metadata non sensibili (vedi sezione 5)

---

### 4.6 Self-Hosted Open-Source Models

**Fonte:** `docs.ollama.com/quickstart`, `docs.ollama.com/faq` (2026-05-12).

**Ollama:**
- Installazione: macOS/Windows/Linux; disponibile anche Docker
- Hardware: CPU supportata per modelli piccoli; GPU (NVIDIA/AMD) raccomandata per modelli 7B+
- API locale: `http://localhost:11434`
- Modelli popolari: Llama, Mistral, Qwen (open-source), DeepSeek-R1 distill, Phi, Gemma
- Dati esterni: **zero** — tutto locale

**Uso su VPS CPU (stima qualitativa):**
- Modelli 1.5B–3B: possibili su CPU con pazienza (secondi–decine di secondi per risposta breve)
- Modelli 7B+: non raccomandati su VPS CPU tipica senza GPU
- VPS Alina attuale: Ubuntu 24.04.4 LTS, risorse RAM/disco OK (da preflight 0120) — GPU non verificata

**Qualità attesa per docs-only:**
- Classificazione metadata: ottima anche con modelli 1.5B–3B
- Generazione boilerplate: buona con 7B+
- Reasoning complesso: limitata senza GPU

**Rischio privacy:** ✅ **nessun dato esce dal VPS o dalla macchina locale**

**Esito:**
- ✅ **Raccomandato per primo esperimento runtime-gated** — Ollama locale su macchina utente per classificazione metadata sintetici, come primo test di "planner zero-API"
- ⚠️ Su VPS: valutare hardware prima di provare

---

### 4.7 Servizi Cloud Agentici

| Servizio | Note | Esito |
|----------|------|-------|
| OpenAI Responses API / Assistants | Richiede API key | ❌ Viola presupposto |
| Anthropic API (Claude) | Richiede API key | ❌ Viola presupposto |
| Devin | Servizio a pagamento (abbonamento); accesso cloud al codebase | ❌ Lock-in + dati a esterno + costo elevato |
| SWE-agent / OpenHands / altri open-source agenti | Self-hosted possibile; spesso richiedono API LLM | ⚠️ Fuori scope breve termine |

**Esito categoria:** ❌ Nessuno raccomandato nel breve termine.

---

### 4.8 API Economiche / Low-Cost

#### Provider Non Occidentali (Cina)

**Fonti:** `api-docs.deepseek.com/quick_start/pricing`, `alibabacloud.com/help/en/model-studio/model-pricing`, `platform.moonshot.ai/`, `bigmodel.cn/pricing` (2026-05-12).

**Pricing ordine di grandezza (1M token, 2026-05-12, da riverificare):**

| Modello | Input | Output | Deployment regione |
|---------|-------|--------|-------------------|
| DeepSeek-v3.2 (via DeepSeek API o Alibaba) | ~$0.29 | ~$0.43 | Cina/Beijing (via Alibaba Model Studio) |
| DeepSeek-r1 | ~$0.57 | ~$2.29 | Cina/Beijing |
| DeepSeek-r1-distill-qwen-7b (via Alibaba) | ~$0.07 | ~$0.14 | Cina/Beijing |
| Kimi-k2.5 / k2-thinking | ~$0.57 | ~$2.29–$3.01 | Cina/Beijing |
| GLM-4.6/4.7 | ~$0.43 | ~$2.00 | Cina/Beijing |
| Qwen-Flash / Qwen-Turbo | basso costo | basso costo | **EU/Singapore/Chinese Mainland** (regioni multiple disponibili) |

**Osservazioni critiche dalla documentazione ufficiale Alibaba Cloud:**
- **DeepSeek/Kimi/GLM via Alibaba Cloud Model Studio:** solo deployment Chinese Mainland (endpoint e archiviazione dati in Beijing)
- **Qwen via Alibaba Cloud Model Studio:** disponibile anche deployment **EU e Singapore** (tramite "International deployment mode") — dati restano fuori dalla Cina
- **Implicazione privacy:** se in futuro si valutasse l'uso di LLM economico, Qwen in regione EU/Singapore è l'unica opzione tra quelle esaminate che offre deployment fuori dalla Cina con pricing basso

**Limiti privacy/contratto (tutti i provider cinesi valutati):**
- Policy dati variabile per regione
- Rischio contrattuale: accesso da parte autorità locali dove risiede il deployment
- Lock-in commerciale limitato (API compatibili OpenAI-style)

**Task ammessi (se mai attivati con gate separato):**
- ✅ Metadata task non sensibili (ID, tipo, stato, priorità, categoria)
- ✅ Classificazione (topic, tipo task)
- ✅ Parsing campi strutturati
- ✅ Boilerplate documentale generico
- ✅ Trasformazione prompt (riformattazione)
- ✅ Sintesi non sensibile

**Task vietati:**
- ❌ Codice completo del progetto o frammenti proprietari
- ❌ Repository completo
- ❌ Credenziali, token, chiavi, API key
- ❌ Dati personali (qualsiasi tipo)
- ❌ Log sensibili o output di esecuzione
- ❌ Contesto operativo completo del progetto
- ❌ Dati soggetti a GDPR o riservatezza

**Output sempre revisionato manualmente prima di qualsiasi esecuzione.**

**Esito categoria:**
- ❌ Nel breve termine: **sconsigliato per Alina Lavoro**, anche per dati non sensibili
- ⚠️ Solo Qwen su deployment EU/Singapore sarebbe valutabile in un eventuale scenario futuro come "planner economico" strettamente limitato a metadata sintetici, ma al momento il guadagno non giustifica il rischio

---

### 4.9 Architetture Ibride

Coperte estensivamente nella sezione 5 (Architetture A–F).

---

## 5. Architetture

### Architettura A — Zero API / Massima Sicurezza

**Flusso:**
1. n8n legge queue task da repo GitHub
2. n8n prepara prompt template
3. Utente copia prompt in Claude Code locale (o Windsurf/Cursor) supervisionato
4. Implementatore locale esegue task docs-only
5. Revisione umana
6. Commit selettivo + push

**Componenti:** Claude Code/Windsurf/Cursor locali; n8n (queue reader); GitHub
**VPS:** solo n8n queue reader, nessuna CLI autenticata
**Locale:** implementatore principale
**n8n:** queue reader + prompt generator + session tracker
**GitHub:** repository (no Actions)
**Gate manuali:** ogni task prima dell'esecuzione; revisione prima del commit
**Dati a esterni:** prompt/codice via subscription dell'implementatore scelto (Anthropic/Windsurf)
**Costo:** solo subscription mensile già attiva
**Rischio modifiche:** molto basso (supervisione continua)

**✅ Raccomandato come baseline attuale.** È l'architettura in uso.

---

### Architettura B — API Minima e Dati Non Sensibili

**Flusso:**
1. n8n legge queue task
2. n8n invia **solo metadata** (ID, tipo, priorità, categoria) a LLM low-cost con deployment EU/non-CN
3. LLM classifica e produce bozza prompt boilerplate
4. n8n salva output come evidenza automation
5. Utente riceve bozza, supervisiona, integra con contesto operativo completo in locale
6. Implementatore locale (Claude Code/Windsurf/Cursor) esegue task
7. Revisione + commit selettivo + push

**VPS:** n8n + HTTP Request verso API LLM; nessuna CLI autenticata
**Locale:** implementatore principale (pipeline sensibile)
**n8n:** classificatore low-cost + queue reader + session tracker
**GitHub:** repository
**Gate:** cost cap giornaliero; approvazione manuale per ogni task
**Dati esterni:** **solo metadata** non sensibili — mai codice, credenziali, log

**Candidato tecnico:** Qwen-Flash/Turbo via Alibaba Cloud Model Studio EU deployment (se mai attivato con gate separato)

**⚠️ Valutabile solo in task 0127+ runtime-gated. Non prioritario.**

---

### Architettura C — Runner VPS Semi-Automatico con Gate Umano

**Flusso:**
1. n8n watcher rileva nuovo task in queue
2. n8n invia notifica a utente + salva prompt pronto
3. **Gate manuale:** utente approva esplicitamente (click/comando)
4. n8n avvia CLI autenticata su VPS (Claude/Cursor/Codex) con prompt
5. Output salvato come evidenza
6. Utente revisiona output
7. **Gate manuale:** utente approva commit
8. n8n esegue commit selettivo + push

**Requisiti attuali mancanti:**
- CLI autenticata su VPS (bloccato da 0123 per Claude; non validato per Cursor; complesso per Codex)
- Nodo Execute Command in n8n (non autorizzato)

**Rischi:**
- Token/auth.json su VPS (rischio privacy)
- Commit automatici potenzialmente scorretti
- Dipendenza da disponibilità CLI

**⚠️ Architettura di riferimento per futuro, ma ogni passo richiede gate separati progressivi.**

---

### Architettura D — Runner Automatico Futuro Protetto

**Flusso:** identico a C ma senza gate manuali intermedi, sostituiti da:
- Cost cap hard
- Token budget per task
- Whitelist di path modificabili
- Sandbox / approval mode CLI (`suggest` o equivalente)
- Test automatici post-commit che se falliscono triggerano rollback
- Notifica utente con possibilità di annullare run

**Complessità alta. Nessun gate manuale run-per-run ma gate architetturali stringenti.**

**❌ Fuori scope breve termine. Raggiungibile solo dopo serie di test progressivi A→B→C→D.**

---

### Architettura E — Planner Economico Low-Cost + Executor Sicuro Supervisionato

**Flusso:**
1. n8n watcher rileva task in queue
2. **Planner** (LLM low-cost, es. Qwen EU o Ollama locale): riceve solo metadata, produce bozza prompt strutturato
3. n8n salva bozza come evidenza
4. Utente integra bozza con contesto operativo completo
5. **Executor** (Claude Code/Windsurf/Cursor locale supervisionato): esegue con contesto completo
6. Revisione + commit + push

**Separazione esplicita pipeline:**
- Pipeline non sensibile (planner): metadata → LLM economico → bozza
- Pipeline sensibile (executor): bozza + contesto → implementatore locale → codice

**Varianti concrete:**
- **E1 (zero-API):** Ollama locale come planner + Claude Code locale come executor
- **E2 (low-cost):** Qwen-Flash EU come planner + Claude Code locale come executor
- **E3 (hybrid):** LLM cloud per classificazione + Ollama per boilerplate + Claude locale per esecuzione

**✅ Architettura più promettente a medio termine.** E1 è la variante prioritaria (zero-API). E2/E3 richiedono cambio di presupposto.

---

### Architettura F — Modalità Manuale-Supervisionata Consolidata

**Flusso:** identico ad A, ma con:
- Runbook dettagliato e aggiornato per ogni tipo di task
- Template prompt riutilizzabili
- Checklist pre-commit e post-commit
- Metriche di tempo per task (manuale)
- Playbook per Claude/Windsurf/Cursor

**✅ Raccomandato come complemento di A.** Non è un'architettura alternativa ma un upgrade organizzativo di A.

---

## 6. Matrice Sintetica

| Soluzione | API key | Headless | Costo ord. gr. | Dati esterni | Rischio privacy | Modifiche indes. | Integr. n8n | Commit | Controllo | Doc | Lock-in | Reversibilità | Esito |
|-----------|---------|----------|----------------|--------------|-----------------|------------------|-------------|--------|-----------|-----|---------|---------------|-------|
| Claude Code locale | no | no | subscr. | prompt via Anthropic | basso | basso (supervisionato) | no (manuale) | manuale | alto | ottima | basso | alta | ✅ Raccomandato |
| Windsurf/Cascade | no | no | subscr. | workspace via Windsurf | basso | basso | no (manuale) | manuale | alto | ottima | basso | alta | ✅ Raccomandato |
| Cursor CLI post-reset | no | parziale | subscr. | prompt via Cursor | basso | medio | possibile | possibile | medio-alto | buona | basso | alta | ⚠️ Preflight al reset |
| Codex CLI locale | no/sì | ⚠️ workaround | subscr./API | prompt via OpenAI | medio | medio | possibile | possibile | medio | ottima | basso | alta | ⚠️ Non prioritario |
| Claude CLI VPS | no | ❌ | subscr. | prompt + token su VPS | alto (token) | medio | possibile | possibile | basso | ottima | basso | alta | ❌ Sconsigliato |
| Codex CLI VPS | sì raccom. | ⚠️ beta | API/subscr. | prompt + token su VPS | alto (token) | medio | possibile | possibile | basso | ottima | basso | alta | ❌ Sconsigliato |
| OpenAI/Anthropic API | sì | ✅ | $$$ | prompt completo | alto | dipende | ottima | dipende | medio | ottima | medio | alta | ❌ Viola presupposto |
| Gemini API | sì | ✅ | $$ | prompt completo | alto | dipende | ottima | dipende | medio | ottima | medio | alta | ❌ Viola presupposto |
| GitHub Actions | dipende | ✅ | minuti | dipende | dipende | alto (se write) | ottima | ottima | basso | ottima | basso | alta | ❌ Fuori scope breve |
| Ollama locale | no | ✅ | zero | **nessuno** | nullo | basso (non commit) | possibile | no | alto | buona | basso | altissima | ✅ Primo test raccomandato |
| DeepSeek API | sì | ✅ | $ (~$0.30/1M in) | prompt → Cina | alto | no (no repo access) | ottima | no | medio | buona | medio | alta | ❌ Privacy CN |
| Kimi/Moonshot | sì | ✅ | $ (~$0.57/1M in) | prompt → Cina | alto | no | ottima | no | medio | buona | medio | alta | ❌ Privacy CN |
| GLM / ZhipuAI | sì | ✅ | $ (~$0.43/1M in) | prompt → Cina | alto | no | ottima | no | medio | media (IT) | medio | alta | ❌ Privacy CN |
| Qwen via Alibaba EU | sì | ✅ | $ | prompt → EU/SG | medio | no | ottima | no | medio | buona | medio | alta | ⚠️ Solo metadata se mai |
| Devin e agentici cloud | sì | ✅ | $$$$ | repo completo | altissimo | alto | limitato | sì | basso | media | alto | media | ❌ Lock-in + costo |

---

## 7. API Low-Cost / Provider Non Occidentali — Regole Vincolanti

**Questa sezione definisce le regole vincolanti per ogni futura valutazione di API low-cost o provider non occidentali, indipendentemente dall'attivazione runtime.**

### Possono essere valutate SOLO per:

- ✅ Metadata task non sensibili (ID, tipo, stato, priorità)
- ✅ Classificazione (topic, categoria task)
- ✅ Parsing campi strutturati
- ✅ Boilerplate documentale generico
- ✅ Trasformazione prompt (riformattazione, espansione)
- ✅ Sintesi non sensibile
- ✅ Generazione bozze generiche

### VIETATE per:

- ❌ Codice completo del progetto o frammenti proprietari
- ❌ Repository completo o parti rilevanti
- ❌ Credenziali, token, chiavi, API key
- ❌ Dati personali (qualsiasi tipo)
- ❌ Log sensibili o output runtime
- ❌ Contesto operativo completo del progetto
- ❌ Dati soggetti a GDPR o riservatezza
- ❌ Path interni sensibili del repository

### Regole operative:

1. **Output sempre revisionato da umano** prima di qualsiasi esecuzione/commit
2. **Separazione schema:** planner economico ≠ executor sicuro (architettura E)
3. **Cost cap obbligatorio** (giornaliero + per task)
4. **Regione deployment EU/Singapore preferita** rispetto a Chinese Mainland (Qwen via Alibaba Model Studio unica opzione tra quelle esaminate)
5. **Audit log** di ogni chiamata API: timestamp, endpoint, token in/out, task ID
6. **Reversibilità:** scelta di provider solo se API compatibile OpenAI-style (facilmente sostituibile)
7. **Nessuna API key hardcoded:** solo via secret manager (se mai attivato)

---

## 8. Raccomandazione Finale

### Breve termine (questa settimana / prossima settimana)

1. **Restare su modalità manuale-supervisionata** (architettura A + F)
2. **Consolidare runbook** per Claude Code/Windsurf con template prompt e checklist
3. **Attendere reset Cursor** (~10 giorni) — non anticipare decisioni

### Prima prova tecnica proponibile

**Task 0127 proponibile (runtime-gated):** test Ollama locale docs-only su metadata sintetici.

- Scopo: validare architettura E1 (Ollama planner zero-API) come primo esperimento
- Scope: solo macchina utente, mai VPS in prima battuta; solo metadata sintetici, mai dati reali del progetto
- Gate separato richiesto: installazione Ollama + download modello piccolo (es. Qwen 1.5B o Mistral 7B) + test classificazione su 5–10 task fittizi
- Output atteso: metriche qualità/latenza/risorse, raccomandazione se proseguire

### Cosa evitare nel breve termine

- ❌ Qualsiasi API key manuale (viola presupposto)
- ❌ Login Claude/Codex CLI su VPS (da 0123/0125)
- ❌ API cinesi (anche per dati non sensibili): beneficio non giustifica rischio privacy
- ❌ GitHub Actions come orchestratore (richiederebbe secrets = API key configurata)
- ❌ Runner automatico in qualsiasi forma

### Prove tecniche solo dopo autorizzazione

- Ollama locale con modello piccolo (task 0127 runtime-gated)
- Cursor CLI preflight al reset (task separato)
- Eventualmente, in futuro remoto: test Qwen EU via Alibaba Model Studio come planner per metadata sintetici (task 0128+ con gate esplicito)

### Micro-task 0127+ proponibili (in priorità)

| # | Titolo | Tipo | Gate |
|---|--------|------|------|
| 0127 | Consolidare runbook manuale-supervisionato | docs-only | Gate manuale |
| 0128 | Cursor CLI preflight post-reset | runtime-gated (light) | Gate manuale + reset Cursor |
| 0129 | Ollama locale feasibility test docs-only | runtime-gated (locale utente) | Gate manuale esplicito |
| 0130 | Matrice token budget + cost cap design | docs-only | Gate manuale |

---

## 9. Rischi Residui

- **Reset Cursor (~10 giorni):** timing incerto, può slittare
- **Subscription Claude/Windsurf:** dipendenza da piano a pagamento attivo
- **Evoluzione pricing provider cinesi:** valori 2026-05-12 possono cambiare
- **Deprecazione modelli:** DeepSeek menziona deprecazioni future di `deepseek-chat`/`deepseek-reasoner`; verificare sempre al momento dell'uso
- **Policy dati:** provider non occidentali possono cambiare policy/giurisdizione
- **VPS hardware:** capacità Ollama su VPS non verificata (preflight 0120 non ha misurato GPU)
- **n8n runtime:** ogni estensione (nodo Execute Command, HTTP verso LLM) è un cambiamento runtime che richiede gate separato

---

## 10. Conclusione

**Task 0126 non autorizza:**
- ❌ Runtime di nessun tipo
- ❌ Installazione (nessun tool, CLI, modello)
- ❌ Esecuzione CLI
- ❌ Login a nessun servizio
- ❌ Configurazione API key
- ❌ Modifiche VPS / n8n / app
- ❌ GitHub Actions
- ❌ Runner automatico
- ❌ Deploy / tag / rollback
- ❌ Invio di codice/repo/credenziali/dati personali a provider esterni

**Decisione 0124 confermata e rafforzata:** modalità manuale-supervisionata come baseline. Ollama locale come prima prova tecnica proponibile (task 0127+ runtime-gated). API cinesi non raccomandate nel breve termine anche per dati non sensibili.

---
**Task 0126 completato — Ricerca market options & low-cost API: docs-only, raccomandazione manuale-supervisionata confermata, Ollama locale come primo candidato di test futuro runtime-gated**
