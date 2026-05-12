# Alina Lavoro — Regole permanenti per AI / Cursor

Queste regole integrano i vincoli del repository e riducono ambiguita operative.

## Regola implementatori — Niente conferme superflue

Riferimento canonico: `docs/ORCHESTRATOR_RULES.md` — **PRIORITÀ 0A**.

L'implementatore (Cursor, Windsurf/Cascade, Claude Code, Agent) deve:

- **non chiedere all'utente conferme superflue** per task **docs-only** già assegnati;
- **non trasformare in decisione** ciò che è già deciso da roadmap, task in queue o prompt orchestratore;
- se il task è **docs-only** e gli **allowed paths** sono chiari, **eseguire**;
- **fermarsi** solo per:
  - scope drift (i cambiamenti escono dagli allowed paths);
  - path vietati toccati;
  - conflitti Git non risolvibili autonomamente;
  - errori tecnici non risolvibili (es. file corrotti, dipendenze mancanti);
  - **gate sensibili** (runtime, VPS runtime, n8n runtime, modifiche app Alina, deploy, tag, rollback, API key, login, GitHub Actions, costi nuovi, runner automatico, dati sensibili, test fisico reale).
- nel **riepilogo finale** indicare se sono rimasti **gate reali** o rischi residui, ma **non** chiedere «procedo?» se non c'è scelta.

Per task **docs-only determinati** l'assenza di scelta equivale a **consenso operativo a proseguire**: eseguire e chiudere secondo workflow con commit selettivo e push.

## Ruoli operativi

- **Orchestratore**: la chat di coordinamento. **Non legge il filesystem locale di Cursor**: ricostruisce lo stato da **GitHub** (e da quanto l’utente incolla in chat).
- **Implementatore**: Cursor / Agent. Esegue modifiche, controlli, commit, push e aggiornamento documenti su GitHub.
- **GitHub**: **fonte di verita per l’orchestratore** e memoria condivisa con l’implementatore.
- **Terminale**: normalmente usato dall'implementatore. L'utente non deve essere costretto a eseguire comandi manuali salvo casi eccezionali.

## Prima di agire

0. **Sincronizzarsi con GitHub** prima di un nuovo blocco di lavoro sul branch operativo (**`main`**):

   ```bash
   git checkout main
   git pull origin main
   npm run aggio
   ```

1. **Non inventare stato** del progetto, del deploy o del branch: verificare con `git status`, `git branch`, documenti in `docs/` e, se utile, `npm run aggio`.
2. **Leggere** `docs/roadmap.md`, `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md`, `docs/STREAMLINED_WORKFLOW.md` quando pertinenti al task.
3. **Branch operativo:** lavorare su **`main`**. **`dev`** è **legacy/inattivo** — non usarlo per nuovi sviluppi.
4. **`gas-current/`** e **solo lettura**: mai modificare, mai usarlo come sorgente di patch.
5. **Modifiche applicative** solo sotto **`src/`** (backend `src/backend/`, frontend `src/frontend/`), salvo workflow/documentazione/tool esplicitamente richiesti.

## Regola obbligatoria: GitHub sempre aggiornato

L'implementatore deve sempre mantenere GitHub aggiornato a **fine blocco operativo o sessione**, anche quando l'utente **non** scrive esplicitamente `finito`.

Motivo: l'orchestratore **non** legge il workspace locale; se GitHub non è aggiornato, l'orchestratore resta fuori dal loop.

A fine blocco l'implementatore deve **sempre**, in ordine:

1. **Controllare lo stato reale** (locale, prima di documentare e committare):

   ```bash
   git status
   git branch --show-current
   git log --oneline -5
   ```

2. **Aggiornare la documentazione** se lo stato è cambiato: `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md`, e se utile un file in `docs/sessions/YYYY-MM-DD-*.md` (o `npm run checkpoint` se si usa quello schema).

3. **Eseguire i controlli minimi** pertinenti al blocco. Se viene modificato `src/frontend/Index.html`, l'implementatore deve eseguire i **controlli frontend standard** definiti in `docs/COMMANDS.md`, senza chiedere all'utente di lanciarli manualmente.

4. **Commit selettivo** — mai `git add .`; elenco file esplicito o `npm run finito -- "msg" file1 file2 …`.

5. **Push su GitHub** (`git push origin main`).

6. **Riepilogo finale** in risposta all'utente con:
   - file modificati;
   - test/check eseguiti;
   - errori o rischi residui;
   - **hash** del commit;
   - output di **`git status --short`** finale;
   - **conferma esplicita**: workspace **pulito** oppure **non pulito** (e perche).

Eccezione: durante una fase intermedia non ancora considerata conclusa, l'implementatore può lasciare modifiche locali **solo** se lo dichiara esplicitamente nel riepilogo e non presenta il blocco come chiuso.

## Controlli standard

Quando un prompt Cursor riguarda `src/frontend/Index.html`, l'orchestratore non deve riscrivere ogni volta tutti i comandi shell. Deve invece richiamare questa formula:

> Esegui i controlli frontend standard da `docs/COMMANDS.md`.

L'implementatore deve interpretarla come obbligo di eseguire il blocco canonico in `docs/COMMANDS.md`, cioe almeno:

- `git diff --check`;
- estrazione dello script inline da `src/frontend/Index.html`;
- `node --check` sullo script estratto;
- grep degli operatori moderni da evitare su WebView vecchie;
- verifica delle tab `data-page` della navbar.

Se un comando non e disponibile nell'ambiente, l'implementatore deve usare un equivalente e dichiararlo nel riepilogo finale.

## Passo passo e blocchi operativi (Cursor / Agent)

- In task **operativi**, lavorare a **blocchi piccoli**; **non** anticipare fasi successive non richieste dal prompt o dal task corrente.
- Se il task include **procedure manuali** o **n8n** (o altro fuori dal repo), documentare in chiusura **quali passi sono completati** e **quali restano aperti** per l’utente.
- **Codice diagnostico temporaneo** (es. nodi Code di debug, log rumorosi, workaround “solo per provare”): o **rimuoverlo** prima della chiusura del blocco, o dichiararlo **esplicitamente temporaneo** nel riepilogo e **non** presentare il blocco come finale finché non è ripulito e confermato.
- Nel **riepilogo finale** obbligatorio, indicare se restano **passaggi manuali** non completati (sì/no e quali).

Allineamento orchestratore: `docs/ORCHESTRATOR_RULES.md` (**PRIORITÀ 0**). Disciplina n8n: `docs/automation/README.md` (**n8n manual run discipline**).

## Modalita di lavoro

- Per modifiche **importanti o ambigue**: **Plan** prima di **Agent**, con piano approvato dall'utente.
- **Deploy** Apps Script / aggiornamento deployment quando il blocco lo prevede (`docs/STREAMLINED_WORKFLOW.md` + istruzioni nel prompt), senza deploy «casuali» fuori contesto.
- **Niente `git add .`**: usare elenco file selettivo o `npm run finito` con lista esplicita.
- **Commit piccoli e mirati**; messaggi chiari in italiano o inglese coerente con il repo.

## Qualita e output

- Preferire **piccoli blocchi** di modifiche revisionabili.
- **Output finale** (fine turno o fine task / fine blocco) allineato al punto 6 sopra: file modificati, test/check, errori/rischi, hash commit, `git status --short`, workspace pulito o meno, **prossimo passo** (una riga).

## Language policy for agents

**Rule:** use technical English for internal reasoning and structured outputs; use Italian for final user-facing summaries.

| Context | Language | Reason |
|---------|----------|--------|
| Internal prompts, system prompts, JSON/YAML fields | Technical English | Lower token count, higher technical precision, better stability in local 7B/8B models |
| Structured classifier/planner output fields | Technical English | Machine-readable consistency |
| Wiki agent-facing content (`docs/LLMS.md`, `docs/wiki/`) | Technical English preferred | Compact, reduces token cost for local AI |
| n8n AI layer, future Ollama classifier/planner prompts | Technical English | Local 7B/8B models (e.g. qwen3:8b) are more precise and less verbose in English |
| Final summaries to the user | Italian | User expects Italian; orchestrator (ChatGPT) responds in Italian |
| Canonical project docs (`PROJECT_STATE.md`, `roadmap.md`, etc.) | Italian (keep as-is) | Do not translate retroactively |
| Commit messages | English (already standard) | Consistent with repo history |

**Applicability:** Claude Code, Cursor, Windsurf/Cascade, local AI (Ollama), future n8n AI layer, n8n prompt generator.

**Do not:**
- translate existing canonical docs retroactively;
- create duplicated bilingual blocks (one language per context, not both);
- write internal JSON/YAML values in Italian if the field is machine-readable.

Empirical basis: user observed that qwen3:8b via Ollama produces more verbose and less precise output in Italian for technical classification tasks. Technical English is the default for internal agent reasoning from this point forward.

Canonical reference: `docs/AI_RULES.md` (this section). Other files reference this section for the full rule; they do not duplicate it.

## Comandi sensibili

- **`npm run push`** / **`clasp push`**: solo dopo verifica locale e consenso utente sullo stato.
- **Rollback**: principale meccanismo = **tag stabili** su `main` (es. `v1.8.1-stable`, `v1.8.0-stable`, …; storico `v1.5-stable`); non eseguire reset/merge distruttivi senza ordine esplicito.
