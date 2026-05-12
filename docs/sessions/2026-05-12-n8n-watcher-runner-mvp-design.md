# Sessione — Task 0111 n8n watcher runner MVP design

**Data:** 2026-05-12
**Task:** 0111-n8n-watcher-runner-mvp-design
**Tipo:** n8n-runner-design (docs-only)
**Eseguito da:** Claude Code (documentazione design)
**Stato:** completato

## Obiettivo

Produrre il documento di design MVP per watcher n8n e runner documentale, allineato a `docs/automation/runbook.md` (Fase 2 + Fase 3) e `docs/automation/permissions.md`.

## Output prodotto

`docs/automation/n8n-watcher-runner-mvp-design.md`

## Contenuto del documento

Il documento copre:

1. **Ruoli e componenti MVP** — matrice responsabilità con owner, tool e gate umano per ogni componente
2. **Trigger MVP** — scelta motivata: polling timer n8n (preferito rispetto a webhook perché porta 5678 non pubblica)
3. **Runner documentale** — due opzioni: Opzione B (Anthropic API via n8n HTTP node, raccomandata per MVP) e Opzione A (Claude Code CLI, preferibile a lungo termine)
4. **Gate manuali obbligatori** — tabella esplicita di tutto ciò che il runner non può fare senza conferma umana
5. **Scope MVP** — solo task docs-only con `Deploy: no` e `Allowed paths` limitati a `docs/**`
6. **Notifiche e supervisione** — modalità supervisionata per MVP, no fire-and-forget
7. **Rischi e mitigazioni** — tabella con 8 rischi principali e relative mitigazioni attive
8. **Sequenza di implementazione** — task futuri 0112/0113/0114 (watcher, runner, test E2E)
9. **Allineamento runbook** — tabella stato per le 6 fasi del runbook

## Decisioni chiave

- **Trigger:** polling timer n8n (non webhook — porta non pubblica)
- **Runner MVP:** Anthropic API via n8n HTTP node (nessuna dipendenza aggiuntiva VPS)
- **Runner futuro:** Claude Code CLI sul VPS (per task più complessi)
- **Supervisione:** ogni ciclo tracciato con done/failed marker e sessione aggiornata
- **Scope:** solo docs-only per MVP; estensione frontend in Fase 4 runbook

## Esclusioni

- Nessuna modifica n8n runtime
- Nessuna modifica app Alina
- Nessun deploy/tag/rollback
- Nessuna connessione VPS
- Nessun export JSON n8n
- Nessuna credenziale documentata

---
**Sessione completata — n8n watcher runner MVP design**
