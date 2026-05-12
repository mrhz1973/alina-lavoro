# Task — Auto-Aggio Design

## Metadata

- ID: 0130-auto-aggio-design
- Project: Alina Lavoro
- Type: low-touch-loop-docs-only
- Priority: high
- Status: **done**
- Created by: Orchestrator
- Completed by: Windsurf/Cascade (implementatore di riserva/supervisionato)
- Modalità: AGENT / IMPLEMENTAZIONE
- Deploy: no
- Runtime: no

## Riferimenti

- **Task queue:** `docs/tasks/queue/0130-auto-aggio-design.md`
- **Sessione automation n8n (evidenza):** `docs/sessions/automation-0130-auto-aggio-design.md`
- **Prompt n8n (evidenza automation, incompleto):** `docs/tasks/processing/0130-auto-aggio-design-cursor-prompt.md`
- **Documento design:** `docs/automation/auto-aggio-design.md`
- **Sessione manuale:** `docs/sessions/2026-05-12-auto-aggio-design.md`
- **Prerequisiti:**
  - `docs/tasks/done/0127-decision-packet-format.md`
  - `docs/tasks/done/0128-autonomous-low-touch-loop-design.md`
- **Decisione di origine:** D-0128-A = 2 (Auto-Aggio prima)

## Sintesi Risultato

**Auto-Aggio** progettato come meccanismo a due livelli per ridurre/eliminare la scrittura manuale "aggio" quando il completamento del task è già verificabile da GitHub/n8n:

- **Livello immediato (zero runtime):** disciplina di lettura GitHub da ChatGPT — applica regole Auto-Aggio in autonomia, riallinea contesto senza che l'utente scriva "aggio"; riduzione stimata ~50–60%.
- **Livello automatizzato (runtime-gated futuro):** workflow n8n con polling/webhook + notifica + integrazione INBOX; riduzione stimata ~70–80%.

**Componenti documentati:**
- Architettura logica con 8 step (state scanner → notifier)
- 8 stati possibili con tabella obbligatoria (indicatori, azione, notifica, fallback)
- 10 failure modes con mitigazioni
- 10 regole anti-falso positivo
- Formato standardizzato riepilogo automatico post-task
- Regole notifiche (silenzioso per standard, attivo solo per DP/errore/ambiguità/gate)
- Compatibilità con Decision Packet Format e INBOX.md futura
- Gate manuali permanenti preservati

## MVP Raccomandato

**Livello immediato attivabile subito, senza alcuna modifica runtime:**
- ChatGPT applica regole Auto-Aggio come disciplina di lettura GitHub
- L'utente smette di scrivere "aggio" per task standard chiari
- Fallback manuale sempre disponibile per ambiguità/recovery
- Riduzione stimata: ~50–60% delle scritture "aggio" attuali

**Livello automatizzato:** richiede task runtime-gated successivi (n8n polling/webhook, canale notifica, INBOX).

## Decision Packet

**Non emesso.** Raccomandazione chiara, nessuna scelta reale tra alternative architetturali in questo step. Eventuali scelte specifiche (canale notifica, soglia silenzio, formato INBOX) emergeranno nei task successivi con DP dedicati.

## Ordine Roadmap Successivo (confermato)

1. **0129** — Human Decision Inbox Design
2. **0131** — n8n Decision Packet Generator Design
3. **0132** — Ollama Classifier/Planner Feasibility
4. **0133** — Cursor/Implementer Bridge Design

**Disciplina:** eventuali cambi d'ordine solo via Decision Packet (kind: `meta` o `automation`), non commenti liberi.

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
- ✅ **docs/ORCHESTRATOR_RULES.md non modificato**
- ✅ **Task in queue non modificato**
- ✅ **Prompt in processing non modificato**

---
**Task 0130 completato — Auto-Aggio Design definitivo; primo componente MVP low-touch loop documentato**
