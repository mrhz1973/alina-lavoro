# Sessione — n8n Decision Packet Generator Design (2026-05-12)

## Titolo

Task 0131 completato: n8n Decision Packet Generator Design

## Tipo sessione

Esecuzione task `low-touch-loop-docs-only` — progettazione documento design.

## Documento prodotto

`docs/automation/n8n-decision-packet-generator-design.md`

## Sommario

Il **Decision Packet Generator** è il componente logico (inizialmente documentale, futuro n8n) che connette Auto-Aggio (rilevamento stato) e INBOX (luogo delle decisioni). Valuta se un evento rilevato richiede una decisione reale dell'utente e, in caso affermativo, assembla un Decision Packet Markdown conforme al formato canonico (13 campi).

Posizione nell'architettura:
```
Auto-Aggio (rileva stato) → DP Generator (valuta + assembla) → INBOX (ospita decisione)
```

## Sezioni del documento prodotto

1. **Definizione del generatore** — perimetro, differenza emissione manuale vs automatica, relazione con Auto-Aggio e INBOX
2. **Input del generatore** — segnale implementatore, pattern Auto-Aggio, trigger manuale orchestratore, formato input attesi
3. **Trigger logici** — tabella trigger → condizione → azione generatore → tipo DP → silenzioso?
4. **Mapping verso i 13 campi canonici** — fonte → campo → logica di derivazione per ciascun campo
5. **Relazione con Auto-Aggio** — flusso Auto-Aggio → DP Generator, responsabilità distinte
6. **Relazione con INBOX** — formato output, posizione in INBOX, vincoli di fase docs-only
7. **Filtro anti-rumore** — 8 regole "NON generare DP" + schema decisionale
8. **Gate manuali permanenti** — comportamento obbligatorio, tabella gate → indicatore → tipo DP
9. **Failure modes** — 10 failure modes con probabilità, impatto, mitigazione
10. **Anti-rumore / anti-falso positivo** — 5 regole aggiuntive post-filtro
11. **Path documentali per fase** — tabella fase → path → gate richiesto
12. **Criteri di sicurezza** — 6 vincoli non negoziabili
13. **Confini docs-only vs runtime-gated** — tabella per componente
14. **MVP documentale** — cosa è realizzabile ora senza runtime; micro-interazioni eliminate immediatamente
15. **Decision Packet** — non emesso (motivazione)

## Decisioni architetturali chiave

- **Auto-Aggio NON decide da solo se serve un DP** — delega sempre al generatore, che applica regole deterministiche
- **Campo 7 (raccomandazione) è obbligatorio** — se il generatore non riesce a derivarla, fallisce esplicitamente e delega all'orchestratore
- **Campo 13 (gate permanenti) è sempre presente** — lista fissa, mai omessa
- **Filtro anti-rumore prima dell'emissione** — ≥ 2 opzioni reali, soglia temporale, deduplica per trigger/stato
- **Un solo DP attivo per stesso trigger/stato** — nessun duplicato in INBOX
- **docs/INBOX.md NON creato in questo task** — riservato a task futuro mixed/runtime-gated

## Micro-interazioni eliminate dal MVP documentale

Con sola disciplina orchestratore + template + checklist, ogni DP generato richiede ~3 minuti invece di ~15 minuti di lavoro manuale non sistematico. Riduzione stimata: ~80% del tempo di formulazione DP per casi standard.

## Decision Packet

Non emesso. L'architettura è univocamente determinata dai vincoli attuali (fase docs-only, Auto-Aggio progettato in 0130, INBOX progettata in 0129, DP Format definito in 0127). Nessuna scelta reale tra alternative equivalenti è emersa durante la progettazione.

## Ordine roadmap successivo

1. **0132** — Ollama Classifier/Planner Feasibility
2. **0133** — Cursor/Implementer Bridge Design

## Conferma scope

- Nessun runtime modificato.
- Nessuna installazione CLI esterna.
- Nessun login, API key, VPS, n8n runtime, GitHub Actions.
- Nessun runner automatico.
- Nessun deploy, tag, rollback.
- Nessuna modifica app Alina (`src/**`, `gas-current/**`).
- `docs/INBOX.md` NON creato.
- App **V1.9.2** stabile su `main`, tag `v1.9.2-stable`, deploy `@24`.

## File creati/modificati in questa sessione

| File | Tipo |
|------|------|
| `docs/automation/n8n-decision-packet-generator-design.md` | Documento prodotto (nuovo) |
| `docs/sessions/2026-05-12-n8n-decision-packet-generator-design.md` | Questa sessione (nuovo) |
| `docs/tasks/done/0131-n8n-decision-packet-generator-design.md` | Done marker (nuovo) |
| `docs/PROJECT_STATE.md` | Aggiornamento (completamento task) |
| `docs/CHECKPOINT.md` | Aggiornamento (completamento task) |
