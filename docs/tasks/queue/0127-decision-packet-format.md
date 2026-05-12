# Task — Decision Packet Format

## Metadata

- ID: 0127-decision-packet-format
- Project: Alina Lavoro
- Type: low-touch-loop-docs-only
- Priority: high
- Status: queued
- Created by: Orchestrator
- Deploy: no
- Runtime: no
- Manual gate: required before any future runtime, installazione, login, API key, VPS, n8n, GitHub Actions, deploy, tag, rollback o runner automatico

## Contesto Strategico

L'utente ha disponibilità limitata e a finestre. L'obiettivo strategico è eliminare le micro-interazioni meccaniche dell'utente:

- ❌ Copiare prompt
- ❌ Incollare prompt
- ❌ Avviare implementatori
- ❌ Scrivere "aggio"
- ❌ Tradurre fra orchestratore e implementatore

L'utente vuole restare responsabile solo di:
- ✅ A. Scegliere fra opzioni proposte con numero o parola corta
- ✅ B. Eseguire prove fisiche realmente necessarie

**Nuovo criterio decisionale permanente del progetto:**
> "Quante micro-interazioni umane elimina?"

Questo criterio deve essere valutato per ogni nuova proposta nel workstream watcher/runner e low-touch loop.

## Scopo del Task

Definire il formato canonico dei **Decision Packet** — il pacchetto decisionale breve che l'orchestratore/loop deve presentare all'utente quando serve una decisione informata.

Obiettivo operativo: ridurre le micro-interazioni umane e trasformare l'interazione dell'utente in poche decisioni leggibili al giorno.

## Output da Produrre (solo alla futura esecuzione con gate separato)

1. **docs/automation/decision-packet-format.md** — definizione formato canonico
2. **docs/sessions/2026-05-12-decision-packet-format.md** (o sessione datata equivalente)
3. **docs/tasks/done/0127-decision-packet-format.md** — done marker
4. **docs/PROJECT_STATE.md** (aggiornamento)
5. **docs/CHECKPOINT.md** (aggiornamento)
6. **docs/ORCHESTRATOR_RULES.md** (aggiornamento se necessario)

## Campi Obbligatori del Decision Packet

Il formato deve includere almeno:

| # | Campo | Descrizione |
|---|-------|-------------|
| 1 | ID decisione / task | Identificativo univoco |
| 2 | **kind** | Valore obbligatorio a una parola, sempre nella stessa posizione: `alina-feature` / `automation` / `infra` / `meta` — indicatore strutturale, NON domanda all'utente |
| 3 | Titolo breve | Descrizione concisa (< 20 parole) |
| 4 | Contesto minimo | Contesto essenziale per capire perché serve decisione |
| 5 | Cosa è cambiato / perché serve decisione | Delta rispetto allo stato precedente |
| 6 | Opzioni numerate | Massimo 3–5 opzioni |
| 7 | Raccomandazione dell'orchestratore | Opzione consigliata con ragione breve |
| 8 | Rischio principale | Rischio chiave di ogni opzione |
| 9 | Impatto | Su app Alina / automazione / infra / roadmap |
| 10 | **Micro-interazioni umane eliminate** | Criterio permanente: quante micro-interazioni elimina questa opzione? |
| 11 | Scelta richiesta all'utente | Numero o parola corta (es. "1", "2", "3", "skip") |
| 12 | Cosa succede dopo la scelta | Prossimo passo immediato |
| 13 | Cosa NON verrà fatto senza ulteriore gate | Limiti espliciti |

## Requisiti del Formato

- **Leggibilità:** leggibile in meno di 2 minuti
- **Opzioni:** massimo 3–5 opzioni
- **Nessuna domanda inutile:** ogni campo deve avere un purpose chiaro
- **Nessun prompt implementatore:** il Decision Packet è per decisione umana, non contiene prompt per implementatori
- **Nessuna lista lunga di dettagli tecnici** se non serve alla decisione
- **Separazione:** deve separare decisione umana da lavoro meccanico
- **INBOX compatibile:** deve essere utilizzabile anche in una futura `INBOX.md`
- **n8n compatibile:** deve essere compatibile con n8n/queue reader
- **Auto-aggio compatibile:** deve essere compatibile con un futuro auto-aggio
- **Gate manuali:** deve preservare gate manuali per deploy/tag/rollback/app/VPS/n8n/runtime
- **Criterio permanente:** deve includere sempre "quante micro-interazioni umane elimina?"

## Template Markdown Canonico (da definire)

Il documento futuro deve definire un template Markdown standard con:

- Intestazione standardizzata
- Sezioni ordinate in modo fisso
- Formattazione coerente (bold per campi chiave, liste per opzioni)
- Esempio concreto per ogni kind

## Esempi Richiesti

Il documento futuro deve includere:

1. **Esempio task automation** (kind: `automation`)
2. **Esempio task infra** (kind: `infra`)
3. **Esempio task meta** (kind: `meta`)
4. **Esempio alina-feature** (kind: `alina-feature`) — senza toccare app Alina, solo esempio format

## Regole da Definire

Il documento futuro deve definire regole per:

1. **Quando un Decision Packet è obbligatorio:**
   - Per decisioni che modificano app Alina
   - Per decisioni che modificano infrastruttura (VPS, n8n, GitHub Actions)
   - Per decisioni che introducono nuovi costi ricorrenti
   - Per decisioni che modificano processi chiave (es. nuovo criterio permanente)
   - Per decisioni che richiedono gate manuali

2. **Quando NON serve Decision Packet:**
   - Per task puramente docs-only che non modificano nulla
   - Per micro-correzioni documentali (es. typo, link morto)
   - Per task già autorizzati da gate precedente con scope chiaro
   - Per task di consolidamento runbook/boilerplate

3. **Come scrivere la scelta richiesta:**
   - Numero o parola corta (es. "1", "2", "skip", "defer")
   - Nessuna frase completa richiesta
   - Nessuna giustificazione richiesta (ma accettata se fornita)

4. **Come evitare di chiedere all'utente cose già decidibili dal sistema:**
   - Se una decisione può essere presa dal sistema/orchestratore/implementatore con regole chiare, non chiedere all'utente
   - Documentare le regole decisionali automatiche
   - Chiedere all'utente solo per decisioni che richiedono giudizio umano

5. **Compatibilità con Human Decision Inbox:**
   - Il formato deve essere parsabile da un futuro sistema di INBOX
   - Deve supportare stato "pending", "deciso", "deferred"
   - Deve supportare tracking di decisioni passate

## Allowed Paths (futura esecuzione)

- docs/automation/decision-packet-format.md
- docs/sessions/2026-05-12-decision-packet-format.md
- docs/tasks/done/0127-decision-packet-format.md
- docs/PROJECT_STATE.md
- docs/CHECKPOINT.md
- docs/ORCHESTRATOR_RULES.md

## Forbidden Paths (sempre)

- src/**
- gas-current/**
- .gas/**
- appsscript.json
- package.json
- .clasp.json
- .github/workflows/**
- docs/tasks/queue/**
- docs/tasks/processing/**
- docs/tasks/failed/**
- export JSON n8n non redatti
- file con credenziali, token, chiavi, OAuth material, sessioni locali o URL raw sensibili

## Note Operative

- Nessuna azione runtime in questo step
- Nessuna modifica app Alina
- Nessuna modifica VPS/n8n/GitHub Actions
- Il campo `kind` è indicatore strutturale per equilibrio roadmap, non domanda all'utente
- Il criterio "micro-interazioni umane eliminate" è criterio permanente, non solo per questo task

---
**Task creato — Decision Packet Format in attesa di gate manuale per esecuzione**
