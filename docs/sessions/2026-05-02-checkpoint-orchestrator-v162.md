# Checkpoint orchestratore — V1.6.2

Data: 2026-05-02

## Stato rilevato da GitHub

- Branch operativo: `dev`.
- Branch stabile: `main`.
- Tag rollback: `v1.5-stable`.
- `dev` risulta avanti rispetto a `main`.
- `dev` risulta avanti rispetto a `v1.5-stable`.
- V1.6, V1.6.1 e V1.6.2 sono presenti su `dev`.

## Stato applicazione

- V1.6.2 caricata in Apps Script.
- Deployment ufficiale V1.6.2 aggiornato dall'utente.
- URL di test V1.6.2 confermato OK.
- URL ufficiale `/exec` V1.6.2 confermato OK dall'utente.
- Layout mobile verticale corretto dopo fix `HtmlService.addMetaTag` in `doGet()`.

## Stato workflow

- Workflow orchestratore/implementatore formalizzato.
- Orchestratore: questa chat, legge GitHub quando l'utente scrive `aggio`.
- Implementatore: Cursor/Agent, esegue modifiche, test, commit e push.
- GitHub: fonte di verita condivisa.
- Regola fondamentale: Cursor deve aggiornare GitHub a fine blocco/sessione anche senza comando esplicito `finito`, altrimenti l'orchestratore resta fuori dal loop.

## Documenti aggiornati rilevanti

- `docs/PROJECT_STATE.md`
- `docs/CHECKPOINT.md`
- `docs/AI_RULES.md`
- `docs/WORKFLOW.md`
- `docs/COMMANDS.md`

## Rischi aperti

- Pagina Mesi usa ancora rendering tramite `innerHTML` completo; se lenta su telefoni vecchi, affrontare in V1.8.
- Test Android vecchio reale ancora da verificare quando disponibile.
- Merge `dev -> main` da valutare solo dopo ulteriore stabilita.

## Prossimo passo raccomandato

- Lasciare V1.6.2 in osservazione.
- Usare `aggio` in orchestratore per ricostruire stato da GitHub.
- Se si avvia un nuovo blocco, Cursor deve aggiornare GitHub a fine lavoro.