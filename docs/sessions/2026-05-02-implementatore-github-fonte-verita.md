# Sessione — Implementatore / GitHub come fonte di verità

**Data:** 2026-05-02  

## Cosa è cambiato

- Allineati `docs/AI_RULES.md` e `docs/WORKFLOW.md` al comportamento richiesto: orchestratore **non** legge il filesystem locale; **sempre** push a fine blocco; checklist esplicita (stato git, doc, check, commit selettivo, push, riepilogo con hash e workspace pulito/non pulito).
- Aggiunto avvio blocco: `git pull` + `npm run aggio`.
- Aggiornati `docs/PROJECT_STATE.md` (regole operative), `docs/CHECKPOINT.md` (comandi rapidi con `git pull`).

## Riferimenti

- Dettaglio regole: `docs/AI_RULES.md`, `docs/WORKFLOW.md`.
