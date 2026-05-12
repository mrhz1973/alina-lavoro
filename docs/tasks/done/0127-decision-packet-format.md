# Task — Decision Packet Format

## Metadata

- ID: 0127-decision-packet-format
- Project: Alina Lavoro
- Type: low-touch-loop-docs-only
- Priority: high
- Status: **done**
- Created by: Orchestrator
- Completed by: Windsurf/Cascade (implementatore di riserva/supervisionato)
- Deploy: no
- Runtime: no

## Riferimenti

- **Task queue:** `docs/tasks/queue/0127-decision-packet-format.md`
- **Sessione automation n8n (evidenza):** `docs/sessions/automation-0127-decision-packet-format.md`
- **Prompt n8n (evidenza automation, incompleto):** `docs/tasks/processing/0127-decision-packet-format-cursor-prompt.md`
- **Documento Decision Packet Format:** `docs/automation/decision-packet-format.md`
- **Sessione manuale:** `docs/sessions/2026-05-12-decision-packet-format.md`

## Gate Ricevuto

> "Autorizzo l'esecuzione del task 0127 Decision Packet Format, solo docs-only, nessun runtime, nessuna installazione, nessuna esecuzione CLI, nessun login, nessuna API key, nessuna modifica VPS/n8n/app, nessuna GitHub Actions."

## Sintesi Risultato

**Formato Decision Packet definito** con template canonico Markdown, 13 campi in ordine fisso, regole di uso, 4 esempi (automation, infra, meta, alina-feature), e compatibilità futura con INBOX.md e auto-aggio.

**Regola lifecycle aggiunta** a docs/ORCHESTRATOR_RULES.md: creazione task = queue + sessione; PROJECT_STATE/CHECKPOINT solo al completamento (eccezione per regole strategiche permanenti).

**Criterio permanente "micro-interazioni umane eliminate"** integrato nel formato e in ORCHESTRATOR_RULES.md.

## Elementi Chiave Definiti

**Template canonico (13 campi):**
1. Decision ID
2. kind (alina-feature/automation/infra/meta) — indicatore strutturale
3. Titolo breve
4. Contesto
5. Perché serve decisione
6. Opzioni numerate (max 3–5)
7. Raccomandazione orchestratore
8. Rischio principale
9. Impatto
10. Micro-interazioni umane eliminate
11. Scelta richiesta (numero/parola corta)
12. Cosa succede dopo la scelta
13. Cosa NON verrà fatto senza ulteriore gate

**Requisiti:**
- Leggibile < 2 minuti
- Scelta breve
- Nessuna domanda inutile
- Nessun prompt implementatore dentro
- Separazione decisione umana / lavoro meccanico
- Compatibile n8n/queue reader e futuro auto-aggio
- Preserva gate manuali per app, deploy, tag, rollback, VPS, n8n, runtime, API key, GitHub Actions

**Regole:**
- Obbligatorio per: scelta strategica, cambio workflow, introduzione runtime, tocco app/VPS/n8n/GitHub Actions, introduzione API key/login/costo/provider/automazione, scelta opzioni equivalenti, test fisico
- Non necessario per: task docs-only autorizzato non ambiguo, correzione typo/link, cleanup senza decisione, aggiornamento meccanico da regola, completamento task autorizzato

## Conferme di Non-Interferenza

- ✅ **Nessun runtime eseguito**
- ✅ **Nessuna installazione**
- ✅ **Nessuna esecuzione CLI**
- ✅ **Nessun login**
- ✅ **Nessuna API key configurata**
- ✅ **Nessuna modifica VPS**
- ✅ **Nessuna modifica n8n runtime**
- ✅ **Nessuna GitHub Actions**
- ✅ **Nessun runner automatico attivato**
- ✅ **App Alina V1.9.2 non toccata**
- ✅ **Nessun deploy / tag / rollback**

---
**Task 0127 completato — Decision Packet Format definito; low-touch loop inaugurato; regola lifecycle aggiunta**
