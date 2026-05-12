# Decision Packet Format — Low-Touch Loop

**Data:** 2026-05-12  
**Task:** 0127-decision-packet-format  
**Tipo:** low-touch-loop-docs-only  
**Stato:** completato

---

## Executive Summary

Il Decision Packet è il formato canonico per presentare decisioni informate all'utente nel low-touch loop. È leggibile in meno di 2 minuti, contiene massimo 3–5 opzioni, e include sempre il criterio "quante micro-interazioni umane elimina?". Il campo `kind` (alina-feature/automation/infra/meta) è un indicatore strutturale di equilibrio roadmap, non una domanda all'utente.

---

## Scopo

Definire il formato standard per i pacchetti decisionali che l'orchestratore/loop deve presentare all'utente quando serve una scelta informata. Obiettivo: ridurre micro-interazioni meccaniche (copiare/incollare prompt, avviare implementatori, scrivere "aggio", tradurre tra orchestratore e implementatore) e trasformare l'interazione dell'utente in poche decisioni leggibili al giorno.

---

## Principi

1. **Leggibilità in < 2 minuti** — l'utente deve poter scansionare rapidamente
2. **Massimo 3–5 opzioni** — troppe opzioni paralizzano
3. **Scelta breve** — numero o parola corta (es. "1", "2", "skip", "defer")
4. **Nessuna domanda inutile** — ogni campo ha un purpose chiaro
5. **Nessun prompt implementatore** — il Decision Packet è per decisione umana
6. **Separazione netta** — decisione umana ≠ lavoro meccanico
7. **Compatibilità INBOX** — utilizzabile in futura `INBOX.md`
8. **Compatibilità n8n** — parsabile da queue reader
9. **Compatibilità auto-aggio** — utilizzabile da sistema automatico
10. **Gate permanenti** — preserva gate manuali per app, deploy, tag, rollback, VPS, n8n, runtime, API key, GitHub Actions

---

## Template Canonico Markdown

```markdown
# Decision Packet — [titolo breve]

**Decision ID:** [ID]  
**Kind:** alina-feature / automation / infra / meta  
**Data:** [YYYY-MM-DD]

## Contesto

[contesto minimo essenziale per capire perché serve decisione]

## Perché serve decisione

[cosa è cambiato / perché ora serve una scelta]

## Opzioni

1. **[opzione 1]** — [descrizione breve]
2. **[opzione 2]** — [descrizione breve]
3. **[opzione 3]** — [descrizione breve]

## Raccomandazione orchestratore

[opzione consigliata con ragione breve]

## Rischio principale

[rischio chiave dell'opzione consigliata]

## Impatto

Su app Alina / automazione / infra / roadmap: [descrizione]

## Micro-interazioni umane eliminate

[quante micro-interazioni elimina questa opzione?]

## Scelta richiesta

Scrivi: [1 / 2 / 3 / skip / defer / parola corta]

## Cosa succede dopo la scelta

[prossimo passo immediato]

## Cosa NON verrà fatto senza ulteriore gate

[limiti espliciti]
```

---

## Campi Obbligatori (ordine fisso)

| # | Campo | Descrizione |
|---|-------|-------------|
| 1 | Decision ID | Identificativo univoco (es. "D001", o task ID) |
| 2 | **kind** | Valore obbligatorio: `alina-feature` / `automation` / `infra` / `meta` — indicatore strutturale, sempre in posizione 2, non domanda all'utente |
| 3 | Titolo breve | Descrizione concisa (< 20 parole) |
| 4 | Contesto | Contesto essenziale per capire perché serve decisione |
| 5 | Perché serve decisione | Delta rispetto allo stato precedente |
| 6 | Opzioni numerate | Massimo 3–5 opzioni, ciascuna con titolo + descrizione breve |
| 7 | Raccomandazione orchestratore | Opzione consigliata con ragione breve |
| 8 | Rischio principale | Rischio chiave dell'opzione consigliata |
| 9 | Impatto | Su app Alina / automazione / infra / roadmap |
| 10 | Micro-interazioni umane eliminate | Criterio permanente: quante micro-interazioni elimina? |
| 11 | Scelta richiesta | Numero o parola corta (es. "1", "2", "skip", "defer") |
| 12 | Cosa succede dopo la scelta | Prossimo passo immediato |
| 13 | Cosa NON verrà fatto senza ulteriore gate | Limiti espliciti |

---

## Regole di Uso

### Quando Decision Packet è OBBLIGATORIO

- Serve una scelta strategica
- Si cambia workflow
- Si introduce runtime
- Si tocca app Alina
- Si tocca VPS/n8n/GitHub Actions
- Si introduce API key, login, costo, provider esterno o automazione nuova
- Si decide fra più opzioni equivalenti
- Si richiede test fisico utente

### Quando Decision Packet NON È NECESSARIO

- Task docs-only già autorizzato e non ambiguo
- Correzione typo/link
- Cleanup documentale senza decisione
- Aggiornamento meccanico previsto da regola già approvata
- Completamento di task già autorizzato entro scope chiaro

### Regole Operative

- Il campo `kind` deve stare sempre nella stessa posizione (campo 2)
- Il campo `kind` non va spiegato ogni volta all'utente — è indicatore strutturale
- La raccomandazione dell'orchestratore deve essere esplicita
- La scelta richiesta deve essere breve: "1", "2", "3", "skip", "defer", o parola corta equivalente
- Non chiedere all'utente cose già decidibili dal sistema
- Se l'utente non deve decidere, non creare Decision Packet
- Il criterio "micro-interazioni umane eliminate" è sempre presente

---

## Esempi

### Esempio — kind: automation

```markdown
# Decision Packet — Introduzione Ollama locale come planner zero-API

**Decision ID:** D001  
**Kind:** automation  
**Data:** 2026-05-12

## Contesto

Il task 0126 ha identificato Ollama locale come primo candidato per test zero-API su metadata sintetici (architettura E1). Attualmente il progetto opera in modalità manuale-supervisionata (0124 confermata da 0126).

## Perché serve decisione

L'utente ha tempo limitato e vuole ridurre micro-interazioni. Introdurre Ollama locale come planner per classificazione metadata potrebbe eliminare alcune micro-azioni, ma richiede installazione e test runtime.

## Opzioni

1. **Attivare test Ollama locale ora** — installare Ollama, scaricare modello piccolo (es. Qwen 1.5B), testare su 5–10 metadata sintetici, valutare qualità/latenza
2. **Differire a dopo reset Cursor** — rimandare Ollama a dopo Cursor CLI preflight, priorità a implementatore principale
3. **Non procedere con Ollama** — restare su manuale-supervisionata consolidata, consolidare runbook

## Raccomandazione orchestratore

Opzione 2 — differire a dopo reset Cursor. Il reset Cursor è tra ~10 giorni e definisce l'implementatore principale. Testare Ollama prima non è critico e introduce runtime extra prima di avere implementatore primario chiaro.

## Rischio principale

Opzione 1: overhead di installazione/test senza chiaro beneficio se Cursor CLI diventa implementatore principale e Ollama diventa secondario.

## Impatto

Su automazione: introduce self-hosted LLM locale per planning zero-API. Su app Alina: nessun impatto. Su infra: richiede installazione locale (non VPS). Su roadmap: passo verso architettura E1.

## Micro-interazioni umane eliminate

Opzione 1: elimina classificazione manuale metadata (se Ollama funziona bene). Opzione 2/3: nessuna eliminazione immediata.

## Scelta richiesta

Scrivi: 1 / 2 / 3

## Cosa succede dopo la scelta

Se 1: creare task runtime-gated per Ollama feasibility. Se 2: attendere reset Cursor, poi valutare Ollama. Se 3: consolidare runbook manuale.

## Cosa NON verrà fatto senza ulteriore gate

Nessuna installazione Ollama su VPS senza gate separato. Nessun uso Ollama per codice reale senza gate separato. Nessun deploy automatico.
```

---

### Esempio — kind: infra

```markdown
# Decision Packet — Aggiornamento Node.js su VPS per supporto Ollama futuro

**Decision ID:** D002  
**Kind:** infra  
**Data:** 2026-05-12

## Contesto

VPS attuale ha Node.js v18.19.1. Ollama richiede Node.js v20+ per alcune feature. Il task 0126 ha identificato Ollama locale come candidato futuro, ma non immediato.

## Perché serve decisione

Aggiornare Node.js su VPS è un'operazione di infrastruttura con rischio di downtime. Va deciso se farlo ora (in vista di futuro Ollama) o differire.

## Opzioni

1. **Aggiornare Node.js a v20 ora** — upgrade npm/node su VPS, test compatibilità n8n, rischio downtime breve
2. **Differire a quando Ollama è confermato** — aggiornare solo se Ollama viene effettivamente attivato
3. **Non aggiornare** — restare su v18.19.1, valutare alternative se Ollama richiede v20

## Raccomandazione orchestratore

Opzione 2 — differire. Ollama non è ancora confermato come priorità. Aggiornare Node.js senza bisogno immediato introduce rischio senza beneficio chiaro.

## Rischio principale

Opzione 1: possibile incompatibilità con n8n o altri servizi, downtime non pianificato.

## Impatto

Su infra: upgrade Node.js v18 → v20 su VPS. Su automazione: potenziale supporto Ollama futuro. Su app Alina: nessun impatto. Su roadmap: passo verso infra compatibile con Ollama.

## Micro-interazioni umane eliminate

Nessuna eliminazione immediata. Eventuale eliminazione se Ollama viene attivato e Node.js v20 è già pronto.

## Scelta richiesta

Scrivi: 1 / 2 / 3

## Cosa succede dopo la scelta

Se 1: pianificare upgrade Node.js con backup, eseguire in finestra manutenzione. Se 2: rimandare a quando Ollama è confermato. Se 3: restare su v18.

## Cosa NON verrà fatto senza ulteriore gate

Nessun upgrade Node.js senza backup e finestra manutenzione. Nessun rollback automatico senza gate.
```

---

### Esempio — kind: meta

```markdown
# Decision Packet — Introduzione regola lifecycle per aggiornamento PROJECT_STATE/CHECKPOINT

**Decision ID:** D003  
**Kind:** meta  
**Data:** 2026-05-12

## Contesto

Attualmente PROJECT_STATE.md e CHECKPOINT.md vengono aggiornati sia alla creazione task che al completamento. Questo crea micro-interazioni extra e incoerenza se il task in queue viene modificato/cancellato.

## Perché serve decisione

Introdurre una regola lifecycle chiara riduce micro-interazioni e mantiene coerenza: aggiornare PROJECT_STATE/CHECKPOINT solo al completamento, non alla creazione.

## Opzioni

1. **Adottare regola lifecycle** — creazione task = queue + sessione; PROJECT_STATE/CHECKPOINT solo al completamento; eccezione per regole strategiche permanenti in ORCHESTRATOR_RULES
2. **Mantenere stato attuale** — aggiornare PROJECT_STATE/CHECKPOINT sia alla creazione che al completamento
3. **Adottare regola parziale** — aggiornare solo CHECKPOINT alla creazione, PROJECT_STATE solo al completamento

## Raccomandazione orchestratore

Opzione 1 — adottare regola lifecycle. Riduce micro-interazioni (un solo aggiornamento invece di due) e mantiene coerenza: PROJECT_STATE riflette stato reale dei task completati, non delle intenzioni.

## Rischio principale

Nessun rischio significativo. PROJECT_STATE potrebbe sembrare "in ritardo" rispetto a task in queue, ma questa è la semantica corretta: riflette stato, non intenzioni.

## Impatto

Su meta: introduce regola lifecycle per documenti di stato. Su app/automazione/infra: nessun impatto. Su roadmap: passo verso coerenza documentale.

## Micro-interazioni umane eliminate

Elimina un aggiornamento PROJECT_STATE/CHECKPOINT per ogni task creato. Se vengono creati 10 task, elimina 10 aggiornamenti.

## Scelta richiesta

Scrivi: 1 / 2 / 3

## Cosa succede dopo la scelta

Se 1: aggiungere regola a ORCHESTRATOR_RULES.md. Se 2: mantenere stato attuale. Se 3: definire regola parziale.

## Cosa NON verrà fatto senza ulteriore gate

Nessuna modifica retroattiva a task già creati. Nessuna modifica a ORCHESTRATOR_RULES senza approvazione esplicita.
```

---

### Esempio — kind: alina-feature (solo esempio formato, senza modificare app)

```markdown
# Decision Packet — Aggiunta toggle modalità scura in UI Alina

**Decision ID:** D004  
**Kind:** alina-feature  
**Data:** 2026-05-12

## Contesto

[SOLO ESEMPIO — NON IMPLEMENTATO] L'utente ha richiesto la possibilità di passare a modalità scura in Alina. Attualmente l'UI è solo chiara.

## Perché serve decisione

[SOLO ESEMPIO] Introdurre modalità scura richiede modifiche CSS e storage preferenza utente. Va deciso se implementare ora o differire.

## Opzioni

1. **Implementare toggle modalità scura ora** — aggiungere CSS dark mode, localStorage per preferenza, test su Android/iOS
2. **Differire a V2.0** — rimandare a major release successiva
3. **Non implementare** — mantenere solo UI chiara

## Raccomandazione orchestratore

[SOLO ESEMPIO] Opzione 2 — differire a V2.0. Modalità scura è nice-to-have, non critico. Priorità attuale è automazione low-touch loop.

## Rischio principale

[SOLO ESEMPIO] Opzione 1: possibili regressi UI su dispositivi Android vecchi.

## Impatto

Su app Alina: aggiunge toggle modalità scura. Su automazione/infra: nessun impatto. Su roadmap: feature UX.

## Micro-interazioni umane eliminate

[SOLO ESEMPIO] Nessuna eliminazione. È una feature richiesta dall'utente, non una riduzione di micro-interazioni.

## Scelta richiesta

Scrivi: 1 / 2 / 3

## Cosa succede dopo la scelta

[SOLO ESEMPIO] Se 1: implementare e testare. Se 2: rimandare a V2.0. Se 3: non implementare.

## Cosa NON verrà fatto senza ulteriore gate

[SOLO ESEMPIO] Nessun deploy senza test manuale utente. Nessun rollback senza gate.
```

---

## Compatibilità Futura con INBOX.md

Il formato Decision Packet è progettato per essere utilizzabile in una futura `INBOX.md`:

- Struttura Markdown standard
- Campi in ordine fisso
- Parsabile da sistema automatico
- Supporta stati: "pending", "deciso", "deferred"
- Tracking di decisioni passate

---

## Compatibilità Futura con Auto-aggio

Il formato è compatibile con un futuro sistema di auto-aggio:

- `kind` permette bilanciamento roadmap automatico
- Campi standard consentono parsing automatico
- Scelta breve (numero/parola) facile da processare
- Micro-interazioni eliminate è metrica quantificabile

---

## Criterio Micro-Interazioni Eliminate

Questo è il criterio decisionale permanente del progetto low-touch loop.

**Ogni Decision Packet deve includere questo campo.**

Valutazione:
- Quantificare quante micro-interazioni elimina l'opzione
- Esempi: "elimina copia/incolla prompt", "elimina avvio manuale implementatore", "elimina scrittura 'aggio'", "elimina traduzione orchestratore/implementatore"
- Se non elimina micro-interazioni, dichiararlo esplicitamente

---

## Gate Permanenti da Preservare

Il Decision Packet NON elimina i gate manuali per:

- Modifiche app Alina
- Deploy
- Tag
- Rollback
- Modifiche VPS
- Modifiche n8n runtime
- Introduzione API key
- Introduzione login
- Introduzione runtime
- Introduzione GitHub Actions

Questi gate restano obbligatori anche con Decision Packet. Il Decision Packet serve a ridurre micro-interazioni, non a eliminare controlli di sicurezza.

---

## Conclusione

Il Decision Packet è il formato canonico per decisioni informate nel low-touch loop. È leggibile, compatibile con sistemi futuri, e include sempre il criterio "micro-interazioni umane eliminate". Il campo `kind` è indicatore strutturale di equilibrio roadmap, non domanda all'utente.

---
**Decision Packet Format definito — Task 0127 completato**
