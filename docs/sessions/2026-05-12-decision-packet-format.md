# Sessione — Decision Packet Format

**Data:** 2026-05-12  
**Task:** 0127-decision-packet-format  
**Tipo:** low-touch-loop-docs-only  
**Eseguito da:** Windsurf/Cascade (implementatore di riserva/supervisionato)  
**Stato:** completato

## Gate Utente Ricevuto

> "Autorizzo l'esecuzione del task 0127 Decision Packet Format, solo docs-only, nessun runtime, nessuna installazione, nessuna esecuzione CLI, nessun login, nessuna API key, nessuna modifica VPS/n8n/app, nessuna GitHub Actions."

## Nota sul Prompt n8n

Il prompt generato da n8n in `docs/tasks/processing/0127-decision-packet-format-cursor-prompt.md` è incompleto nelle sezioni Objective/Requirements/Expected output. Utilizzato solo come evidenza automation, NON come istruzione operativa principale.

## File Creati / Modificati

1. **docs/automation/decision-packet-format.md** (nuovo)
   - Template canonico Markdown con 13 campi in ordine fisso
   - Regole di uso (obbligatorio/non necessario)
   - 4 esempi: automation, infra, meta, alina-feature (solo esempio formato)
   - Compatibilità futura con INBOX.md e auto-aggio
   - Criterio "micro-interazioni umane eliminate" integrato

2. **docs/sessions/2026-05-12-decision-packet-format.md** (questo file)

3. **docs/tasks/done/0127-decision-packet-format.md** (nuovo)

4. **docs/ORCHESTRATOR_RULES.md** (aggiornato)
   - Aggiunta regola lifecycle: creazione task = queue + sessione; PROJECT_STATE/CHECKPOINT solo al completamento

5. **docs/PROJECT_STATE.md** (aggiornato)

6. **docs/CHECKPOINT.md** (aggiornato)

## Sintesi del Formato Definito

**Template canonico Markdown** con 13 campi in ordine fisso:

1. Decision ID
2. kind (alina-feature/automation/infra/meta) — indicatore strutturale, NON domanda utente
3. Titolo breve
4. Contesto
5. Perché serve decisione
6. Opzioni numerate (max 3–5)
7. Raccomandazione orchestratore
8. Rischio principale
9. Impatto
10. Micro-interazioni umane eliminate (criterio permanente)
11. Scelta richiesta (numero o parola corta)
12. Cosa succede dopo la scelta
13. Cosa NON verrà fatto senza ulteriore gate

**Requisiti:**
- Leggibile in < 2 minuti
- Scelta breve: "1", "2", "skip", "defer"
- Nessuna domanda inutile
- Nessun prompt implementatore dentro
- Separazione decisione umana / lavoro meccanico
- Compatibile n8n/queue reader e futuro auto-aggio
- Preserva gate manuali per app, deploy, tag, rollback, VPS, n8n, runtime, API key, GitHub Actions

## Regole Principali

**Decision Packet OBBLIGATORIO quando:**
- Scelta strategica
- Cambio workflow
- Introduzione runtime
- Tocco app Alina
- Tocco VPS/n8n/GitHub Actions
- Introduzione API key/login/costo/provider esterno/automazione nuova
- Scelta fra opzioni equivalenti
- Test fisico utente richiesto

**Decision Packet NON NECESSARIO quando:**
- Task docs-only già autorizzato non ambiguo
- Correzione typo/link
- Cleanup documentale senza decisione
- Aggiornamento meccanico da regola già approvata
- Completamento task già autorizzato entro scope chiaro

**Regole operative:**
- Campo `kind` sempre in posizione 2, non spiegato ogni volta
- Raccomandazione orchestratore esplicita
- Scelta richiesta breve
- Non chiedere cose decidibili dal sistema
- Se utente non deve decidere, non creare Decision Packet

## Esempi Prodotti

1. **kind: automation** — Introduzione Ollama locale come planner zero-API (3 opzioni)
2. **kind: infra** — Aggiornamento Node.js su VPS per supporto Ollama futuro (3 opzioni)
3. **kind: meta** — Regola lifecycle PROJECT_STATE/CHECKPOINT (3 opzioni)
4. **kind: alina-feature** — Toggle modalità scura in UI Alina (solo esempio formato, 3 opzioni)

## Regola Lifecycle Aggiunta

Aggiunta a `docs/ORCHESTRATOR_RULES.md`:

- Creazione task in queue → aggiorna solo file task + sessione creazione
- NON aggiornare PROJECT_STATE/CHECKPOINT alla sola creazione
- Aggiornare PROJECT_STATE/CHECKPOINT solo al completamento (done marker)
- Eccezione: se creazione task introduce regola strategica permanente, ORCHESTRATOR_RULES può essere aggiornato subito
- Anche in eccezione, PROJECT_STATE/CHECKPOINT restano fermi fino al completamento

## Controlli Eseguiti

- `git diff --check`: OK
- `git diff --stat`: in corso
- `git status --short`: in corso

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

---
**Sessione completata — Decision Packet Format definito; regola lifecycle aggiunta; low-touch loop inaugurato**
