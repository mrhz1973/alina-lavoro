# Alina Lavoro — Roadmap

## Stato attuale

**V1.9.2** — release **2026-05-10** su **`main`** (**Dettaglio mese** più **visivo**: riepilogo **metriche**, **card** giorno, **barre proporzionali** ore; solo frontend); **in produzione** Apps Script **`@24`** (`package.json` / `APP_VERSION` **1.9.2**); tag **`v1.9.2-stable`**; snapshot **`gas-current/`**; sessione `docs/sessions/2026-05-10-v192-month-detail-visual-refresh-deploy.md`. **Test manuale utente su `/exec` @24:** **OK** (2026-05-10; incluso **Redmi 9C NFC**). Include **V1.9.1** (**Stipendio** nascosto sul mese corrente in **Mesi**, deploy **`@23`**, test **OK**) e **V1.9.0** (Dettaglio mese MVP, **`@22`**). **Nota uso:** sul telefono va il link Web App **`/exec`**; il Google Sheet è solo database/amministrazione. **Limitazione nota:** il banner Google «Questa applicazione è stata creata da un utente di Google Apps Script» è **esterno** all’app (piattaforma GAS), non bug UI — chiudibile con X ma può riapparire; vedi sessione. **Nota roadmap:** ottimizzazioni future Mesi/Home/Note restano evolutive. **Precedente V1.9.1:** deploy **`@23`**, tag **`v1.9.1-stable`**. **Precedente V1.9.0:** deploy **`@22`**, tag **`v1.9.0-stable`**. Workflow: **`main` operativo**, **`dev` legacy** — `docs/sessions/2026-05-03-main-only-workflow.md`. Tag storici: **`v1.9.1-stable`**, **`v1.9.0-stable`**, **`v1.8.10-stable`**, … **`v1.5-stable`**.

App personale per registrazione ore di lavoro di Alina.

Stack:
- Google Apps Script come backend.
- Google Sheet come database.
- HTML/CSS/JavaScript come frontend.
- GitHub per versionamento.
- Cursor come ambiente di sviluppo.
- clasp per sincronizzazione con Google Apps Script (deploy/push quando previsto dal workflow).

## Automation / Orchestrator Hub (trasversale, non applicativo)

Iniziativa **documentale** per preparare il repo come **pilota** di orchestrazione esterna: **`docs/tasks/`** (code task queue + template), **`docs/automation/`** (visione piattaforma, permessi, runbook). Obiettivo futuro: **ChatGPT** → task su **GitHub** → **n8n** (VPS) → **Cursor CLI** → commit/push → session report → **aggio**. Non sostituisce il workflow manuale finché le fasi del runbook non sono implementate; **nessun effetto** sulle release app (es. **V1.9.2**) finché non compare un task operativo esplicito in `docs/tasks/queue/`. Dettaglio: `docs/sessions/2026-05-10-automation-task-framework.md`. **Stato n8n (2026-05-11):** workflow **`TEST - GitHub list Alina task queue`** con skip **`processing`** + **`done`** validato manualmente in interfaccia — `docs/sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md`. **LLM Wiki / Token Efficiency (task 0132, 2026-05-12):** strato memoria derivata AI-friendly attivo — `docs/LLMS.md` (entry point agenti), `docs/wiki/` (current-state, token-efficiency, README); gerarchia 4 livelli; wiki è derivata, canonici vincono; risparmio token ~40–80% per sessione agente. **Ollama Classifier/Planner Feasibility (task 0133, 2026-05-12):** feasibility completata in `docs/automation/ollama-classifier-planner-feasibility-post-wiki.md`; raccomandazione PROCEDERE con preflight runtime-gated; Qwen 2.5 7B come modello iniziale; input compatto post-wiki (~6–10k chars); 7 gate espliciti pre-installazione. **Decisione post-0133 (2026-05-12):** target iniziale aggiornato da MacBook Pro M2 a **workstation Windows** (Ryzen 9 3900X / 32 GB RAM / RTX 3060 12 GB); Mac M2 opzione secondaria; task 0134 Windows Ollama Local Preflight completed (manual runtime validation, 2026-05-13) — Ollama 0.23.2 + qwen3:14b validated locally; JSON strict works via local API format=json, not CLI; no n8n integration yet; ZERO API intact; sessione decisione: `docs/sessions/2026-05-12-ollama-target-windows-decision.md`. **Auto-Aggio Prompt-Generation Handshake Design (task 0139, 2026-05-13):** docs-only design in queue; clarifies that "aggio" is not only status refresh but prompt-generation handshake; defines flows with/without decisions; activation channels (manual, mobile, future bridge); hybrid architecture (Telegram/INBOX, Windows/Mac always-on, VPS, browser bridge); Ollama role (classify, compress, help identify DP needed, never decide); security rules (human decisions remain human, no provider API, bridge may only write hardcoded "aggio"); design in `docs/automation/auto-aggio-prompt-generation-handshake-design.md`. **Language policy (2026-05-12):** regola agent language introdotta (docs-only) — inglese tecnico per reasoning interno, prompt, classifier/planner, wiki AI-facing; italiano per output finale all'utente; base empirica: qwen3:8b; regola canonica: `docs/AI_RULES.md`. **Cursor CLI Force-Mode Implementer Bridge Design (task 0135, 2026-05-13):** design completato in `docs/automation/cursor-cli-force-mode-implementer-bridge-design.md`; architettura target: GitHub queue → n8n/local script → Ollama qwen3:14b JSON router → Cursor force-mode → branch → ChatGPT web post-check → human merge; no runtime executed; future Cursor CLI force-mode preflight è runtime-gated. **Local Classifier Wrapper / Qwen-Alina Profile Design (task 0136, 2026-05-13):** design completato in `docs/automation/local-classifier-wrapper-qwen-alina-profile-design.md`; costruisce su 0134 qwen3:14b validation e 0135 Cursor bridge; qwen-alina è opzionale/futuro; nessun Modelfile/profile creato ora; nessuna integrazione runtime; future wrapper/profile creation è runtime-gated. **Local Classifier Wrapper Script Design (task 0137, 2026-05-13):** design completato in `docs/automation/local-classifier-wrapper-script-design.md`; operationalizza il concetto wrapper 0136 ma non crea codice eseguibile; Python raccomandato per portabilità; CLI shape definita; future implementation/dry-run è runtime-gated. **Qwen-Alina Modelfile Design (task 0138, 2026-05-13):** design completato in `docs/automation/qwen-alina-modelfile-design.md`; definisce profilo opzionale futuro su qwen3:14b; riduce token SYSTEM prompt e stabilizza comportamento classifier; nessun Modelfile/profile creato; future profile creation/validation è runtime-gated. **Auto-Aggio prompt-generation handshake design (task 0139, 2026-05-13):** design completato in `docs/automation/auto-aggio-prompt-generation-handshake-design.md`; definisce handshake tra ChatGPT e Ollama per generazione di prompt di Auto-Aggio; integrazione con Cursor CLI Force-Mode Implementer Bridge; future implementazione è runtime-gated. **Local Cursor Dual-Agent Loop Design (task 0140, 2026-05-13):** design completato in `docs/automation/local-cursor-dual-agent-loop-design.md`; formalizza architettura dual-agent Cursor (Agent 1: Implementer su branch dedicato, Agent 2: Reviewer/Orchestrator-Lite); fallback ~10 giorni Claude Code principale + Windsurf backup; branch policy `ai/<task-id>-<slug>`; anti-loop guards (terminal states: done/failed/decision_required/blocked); Decision Packet schema integration; no-API/no-billing policy; collega 0139 (aggio handshake) + 0135 (Cursor CLI bridge) + 0128 (autonomous loop) in architettura coerente; nessun runtime, nessun Cursor, nessun n8n, nessun Telegram, nessun deploy/tag/rollback. **Decision Inbox MVP File Creation (task 0141, 2026-05-13):** `docs/INBOX.md` creato come artefatto repository; sezioni Pending/Decided/Deferred/Superseded; convenzione risposta `D-NNNN-X = N`; template DP con 13 campi canonici; nessun DP pending al momento della creazione; closes open technical debt da task 0129; zero runtime, zero n8n, zero Telegram. **Local Browser Bridge Preflight Design (task 0142, 2026-05-13):** design completato in `docs/automation/local-browser-bridge-preflight-design.md`; definisce il bridge locale futuro ("dito automatico") che scrive solo `aggio` in ChatGPT web e preme Enter; tecnologie candidate (AutoHotkey/Playwright/Selenium/DesktopCtl/manual); controlli di sicurezza (kill switch, browser visibile, rate limit 4/ora, fail closed, no headless, log locale); percorso MVP in 3 fasi (dry-run manuale → sandbox → project chat); nessun runtime eseguito; nessuna automazione browser attivata; comportamenti vietati espliciti (no lettura contenuto, no risposta DP, no selezione opzioni, no API, no credenziali); integrazione INBOX (bridge scrive sempre solo "aggio" indipendentemente da DP pending); integrazione Telegram e n8n come future task runtime-gated; fallback manuale sempre disponibile. **Telegram + Browser Bridge Trigger Coordination Design (task 0143, 2026-05-13):** design completato in `docs/automation/telegram-browser-bridge-trigger-coordination-design.md`; definisce il modello di coordinamento tra futura notifica Telegram e Local Browser Bridge per lo stesso evento di completamento task; tre modalità operative: Mode A (Telegram-only, primario corrente), Mode B (Telegram+Bridge, MVP futuro preferito dopo bridge Phase 3), Mode C (Bridge-only per task routine, deferred); trigger rules: solo dopo done marker confermato, idempotency key `(task_id, commit_hash)`, no trigger su stato intermedio; duplicate prevention: last-trigger state, rate limit, task ID lock; INBOX interaction: Telegram informa di DP pending, bridge scrive "aggio" indipendente da INBOX, ChatGPT legge INBOX dopo post-check; template messaggi Telegram concettuali (success / decision-required / failure, nessun token o chat ID); 15 failure modes; future task runtime-gated: Telegram notifier runtime, n8n Telegram node, bridge Phase 2/3, n8n-to-local-bridge trigger, dry-run, INBOX-aware classifier; fallback manuale sempre disponibile.

**Telegram Mode A — stato corrente (batch 0227–0231, 2026-05-14):** **Schedule Trigger activation succeeded.** Cleanup eseguito dall'utente in n8n UI (task 0227): `Build notification payload` scope_note aggiornato a wording neutro corrente; `Store notification state` short_hash mapping aggiornato a `{{ $('Build notification payload').first().json.short_hash }}`; nessun Execute durante il cleanup; nessun nuovo rischio trovato. Intent condizionato di follow-on activation (registrato con D-0221-A = 3) applicato. Schedule Trigger aggiunto e configurato su `TEST - Alina task completion Telegram notifier` (ogni 5 minuti; Schedule Trigger → List done files; Manual Trigger mantenuto); workflow attivato. Primo tick schedulato: **success / Telegram arrived**. **Telegram Mode A è ora active scheduled notification-only automation.** Telegram **non** risponde a INBOX. D-0221-A = 3 resta decided (cleanup-first + conditional activation intent applied). Duplicate-skip resta **conclusively validated** sull'harness fully-pinned (D-0209-A). D-0217-A/D-0213-A/D-0209-A/D-0206-A restano decided. D-0202-A resta superseded. Queue reader non toccato. No app/deploy/tag/rollback. No provider API. No secrets registrati. **Monitoring:** `docs/automation/telegram-mode-a-post-activation-monitoring-checklist.md`. **Prossimo step:** monitorare Telegram Mode A attivo; disabilitare/segnalare in caso di anomalia; nessuna decisione immediata pending.

**AGENTS.md Pointer-Only + 6–8 Docs-Only Batch Priority (batch 0259–0266, 2026-05-14):** D-0259-A = 1 applied; `AGENTS.md` replaced with pointer-only version (~38 lines) pointing to LLMS.md read order, V3.1 routing docs, template pack; 6–8 docs-only batch priority propagated project-wide (ORCHESTRATOR_RULES.md, AI_RULES.md, WORKFLOW.md, multi-step-batch-planning-rules.md, v31-next-task-selection-rubric.md, v31-enforcement-checklist.md, compact-task-creation-workflow.md); AGENTS.md pointer note + Example 7 added to V3.1 routing/cookbook; safety contracts recorded; INBOX: 0 pending, 21 decided; no runtime; no secrets. Compact batch use: `docs/wiki/examples/v31-compact-workflow-cookbook.md` Example 7.

**V3.1 Enforcement + Prompt Size Guard + Future Optimization Backlog (batch 0254–0258, 2026-05-14):** V3.1 Enforcement Checklist created — `docs/wiki/v31-enforcement-checklist.md`; Prompt Size Guard (~80–100 line threshold) added; V3.1 routing docs updated (prompt-routing, context-budget-policy, template-pack-index, compact-implementer-prompt-workflow, compact-task-creation-workflow, token-efficiency); CLI Printing Press recorded as future/low-priority idea — `docs/automation/future-cli-printing-press-idea.md`; AGENTS.md deferred (pointer-only rules recorded); repo hygiene scanner deferred; no runtime; no secrets; INBOX: 0 pending, 20 decided.

**Telegram Mode A Post-Fix Scheduled Validation (batch 0251–0253, 2026-05-14):** first scheduled tick after reactivation sent Telegram for task 0250 (new latest done created by docs batch 0246–0250, committed between manual run and first tick); second scheduled tick duplicate-skipped task 0250; **Telegram Mode A declared stable-after-fix**; routine-check posture active; INBOX: 0 pending, 20 decided; no implementer runtime; no secrets.

**Telegram Mode A Latest-Done Selection Fix (batch 0246–0250, 2026-05-14):** `Pick latest done file` bug diagnosed: order-dependent selection (`files[files.length - 1]`) was returning stale task 0232 instead of latest 0245; fix applied in n8n UI (numeric sort descending by task ID); manual validation succeeded (Telegram 0245 arrived); stabilization plan and monitoring checklist updated with latest-done selection diagnostics; `docs/automation/telegram-mode-a-latest-done-selection-fix.md` created; **first scheduled tick post-fix pending observation** — Telegram Mode A not declared stable-after-fix yet; INBOX: 0 pending, 20 decided; no implementer runtime; no secrets.

**Next Low-Touch Runtime Gate Backlog (batch 0241–0245, 2026-05-14):** post-Telegram Mode A planning — `docs/automation/telegram-mode-a-post-activation-stabilization-plan.md` (observation window, anomaly conditions, stable posture), `docs/automation/next-low-touch-runtime-gate-backlog.md` (6-group candidate backlog: Mode A monitoring, Browser Bridge, Ollama, n8n improvements, implementer alternatives, out-of-scope), `docs/wiki/v31-next-task-selection-rubric.md` (7-step task selection decision tree); candidate-gate-backlog.md refreshed; monitoring checklist pointer added. Telegram Mode A remains active scheduled notification-only. Nessun runtime; nessun secret; nessun gate autorizzato.

**V3.1 Operational Workflow (batch 0236–0240, 2026-05-14):** LLM Wiki V3.1 workflow layer operationalized — compact task creation workflow (`docs/wiki/compact-task-creation-workflow.md`), compact implementer prompt workflow (`docs/wiki/compact-implementer-prompt-workflow.md`), multi-step batch planning rules (`docs/wiki/multi-step-batch-planning-rules.md`), compact workflow cookbook (`docs/wiki/examples/v31-compact-workflow-cookbook.md`). Future docs-only work uses coherent batches when no real decision is pending; runtime/manual UI remains one step at a time. Nessun runtime; nessun secret.

**Delta-based prompt example V3.1 (task 0235, 2026-05-14):** creato `docs/wiki/examples/delta-based-prompt-example.md` — primo esempio canonico di prompt corto in stile V3.1; confronto old-style vs V3.1; esempi completi docs-only e state-update-batch; promemoria task-ID guard; navigazione aggiunta a token-efficiency.md. Nessun runtime; nessun secret.

**Template Pack V3.1 completo (task 0234, 2026-05-14):** creati 5 template mancanti: `docs-only-task.md`, `runtime-gated-task.md`, `inbox-decision-recording.md`, `n8n-ui-supervised-cleanup.md`, `state-update-batch.md`. Pack V3.1 ora completo con 8 template (`docs/tasks/templates/`). Nessun runtime; nessun secret.

**LLM Wiki V3.1 / n8n JSON-First (task 0232, 2026-05-14):** patch diretta GitHub (nessun implementatore). Creati: `docs/wiki/task-id-preflight.md` (task-ID guard), `docs/wiki/prompt-routing.md` (context router), `docs/wiki/context-budget-policy.md` (budget policy), `docs/wiki/template-pack-index.md` (template pack index); template implementatori: `docs/tasks/templates/implementer-standard.md`, `n8n-template-first-task.md`, `final-report-contract.md`. Formalizzano policy **n8n TEMPLATE-FIRST / JSON-FIRST** e delta-prompt. **Consolidamento stato (task 0233, 2026-05-14):** LLMS.md / wiki aggiornati a Last completed = 0233; navigazione wiki V3.1 aggiunta a token-efficiency.md; menzione compatta in ORCHESTRATOR_RULES.md, AI_RULES.md, WORKFLOW.md. Nessun runtime; nessun secret.

**Telegram Mode A — stato precedente (batch 0211–0214, 2026-05-14):** **D-0209-A = 1 decided/applied/completed** con risultato `fully pinned duplicate skip succeeded` (user report 2026-05-14): exactly one manual Execute run dell'harness fully-pinned importato; `Load notification state` ha trovato la riga esistente; ramo FALSE seguito; nessun Telegram inviato; `Store notification state` non ha scritto nuova riga. **Duplicate-skip conclusively validated** sull'harness fully-pinned. Principio validato: `same idempotency_key already present in alina_telegram_notifier_state => skip path, no Telegram, no new row`. Il Telegram notifier production-like resta **manual-only / inactive**; nessun Schedule Trigger attivato; nessuna notifica Telegram automatica attiva. **D-0213-A pending** per autorizzare gate controllato di attivazione Schedule Trigger per Telegram Mode A (notification-only): Option 1 attiva schedule controllato, Option 2 mantiene manual-only, Option 3 rinvia per design template-first più sicuro; raccomandazione orchestratore = Option 3 se serve ulteriore design, Option 1 solo se workflow chiaro e idempotency presente. **D-0206-A** rimane decided/completed; **D-0202-A** rimane superseded. Queue reader non toccato. No app/deploy/tag/rollback. No provider API. **Prossimo step:** decisione utente su D-0213-A.

**Telegram Mode A — stato precedente (batch 0204–0208, 2026-05-14):** idempotency/state-store implementato dall'utente (task 0185). Data Table `alina_telegram_notifier_state` creato con tutte le colonne. **D-0187-A**, **D-0193-A**, **D-0197-A** tutti consumati: D-0187-A/D-0193-A inconclusive per latest-done drift; D-0197-A = 1 NOT SUCCESSFUL per partial pinning / dynamic reference leakage downstream. **Cambio priorità utente (2026-05-14): TEMPO E RISULTATI.** Adottata **policy n8n template-first**: template JSON importabile preferito; configurazione manuale nodo-per-nodo = fallback. **Template fully-pinned creato (task 0205):** `docs/automation/n8n-workflows/templates/telegram-fully-pinned-validation-harness.template.json` + companion `.md`; TEST-only; `active=false`; no Schedule Trigger; downstream nodes usano solo `$json.*`; credential reference e chat_id sono placeholder. **D-0202-A superseded da D-0206-A** (template-first rende inspection/repair manuale più lento e rischioso). **D-0206-A = 1 decided/applied** (batch 0208–0210, 2026-05-14) con risultato `import/inspection ok` (user report): il template fully-pinned è stato importato in n8n UI come `TEST - Alina Telegram notifier FULLY PINNED HARNESS ONLY` (`active=false`, Manual Trigger only, no Schedule Trigger); nessun Execute autorizzato da D-0206-A; nessun Telegram inviato. **D-0209-A pending** per autorizzare esattamente un Execute manuale dell'harness importato (no schedule activation; criterio di successo: duplicate-skip — ramo FALSE, nessun Telegram, nessuna nuova riga in Data Table). Dopo import/inspection: gate separato per Execute, poi (se successo categoria a) gate schedule activation. Workflow manual-only / inactive. No Schedule Trigger. No token/chat id in repo. No real secrets in templates. Queue reader non toccato. **Prossimo step:** decisione utente su D-0209-A (1: autorizza un singolo Execute manuale dell'harness importato; 2: non eseguire ora; 3: rinvia/raffina harness).

**Marp — formato briefing opzionale (futuro):** Marp è coerente con il progetto solo come layer facoltativo di presentazione e briefing — strumento di comunicazione verso l'utente o terzi, non nuova fonte di verità e non base della LLM Wiki. Usi previsti (opzionali): briefing tecnici, presentazioni a terzi, visual roadmap, architettura token-efficiency, briefing local AI Level 2, workflow n8n/low-touch, materiale Decision Packet, executive summary, handover, export PDF/PPTX futuro. Non sostituisce né alimenta: `docs/LLMS.md`, `docs/wiki/`, `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md`, regole operative canoniche, file task queue, stato agente, memoria operativa principale. Struttura futura possibile (non da creare ora): `docs/briefings/` con template Marp dedicati. Separazione dei layer: `docs/wiki/` = memoria AI operativa; `docs/LLMS.md` = entry point agenti; `docs/automation/` = design operativo; `docs/briefings/` = materiali presentabili/esportabili per utente o terzi.

## Struttura repository

- `gas-current/`
  - Snapshot dello script Apps Script attualmente deployato.
  - Solo lettura.
  - Non modificare.

- `src/backend/Code.gs`
  - Backend Apps Script da modificare.

- `src/frontend/Index.html`
  - Frontend app da modificare.

- `appsscript.json`
  - Manifest Apps Script.

- `docs/`
  - Documentazione di progetto.

## Regola principale

Non modificare `gas-current/`.

Tutte le modifiche devono essere fatte in `src/`.

## Workflow operativo

1. Lavorare sempre su **`main`** (`git pull origin main` all’inizio del blocco).
2. Usare Cursor in Plan Mode per analisi e piano quando serve.
3. Passare ad Agent Mode solo dopo approvazione (se il task lo richiede).
4. Controllare il diff prima di commit.
5. Commit selettivo e **`git push origin main`** a fine blocco.
6. Usare `npm run push` / `npm run deploy` solo quando il task e `docs/STREAMLINED_WORKFLOW.md` lo prevedono, dopo verifica locale.
7. Dopo release o micro-release importante: **tag stabile** su `main` e documentazione / eventuale snapshot **`gas-current/`**.
8. **Rollback:** tramite **tag stabili** precedenti, non tramite flusso `dev` → `main` ( **`dev`** non è più branch operativo ).

## V1.5 — Obiettivo

Applicare solo fix critici.

Non aggiungere:
- calendario;
- grafici;
- service worker;
- nuove funzionalita;
- refactor estetico;
- librerie esterne.

## V1.5 — Bug critici

1. Fix `newShift(date)` in `Index.html`: usare `data: date`, non shorthand `data`.
2. Fix `eliminaTurniFuturi()`: confrontare Date con Date, non stringhe.
3. Aggiungere backup automatico prima di operazioni distruttive.
4. Aggiungere protezione LockService contro doppio tap / doppio salvataggio.
5. Rimuovere vecchia funzione `importaStoricoDaFoglio1`.
6. Correggere Home che mostra "Lavoro terminato alle 00:00" per righe vuote.
7. Aggiungere funzione manuale `pulisciTurniVuoti()` con backup.

## V1.6 — Mobile vertical optimization / Android vecchio

Obiettivo: ottimizzare tutta l'app per uso verticale su smartphone, soprattutto Android vecchio, senza cambiare logica dati e senza introdurre calendario o grafici.

Aree incluse:
- tutta l'app nel browser mobile;
- schermata login;
- Home;
- pagina Mesi;
- finestra/modale "Modifica orari";
- tastiera che copre campi e pulsanti;
- Web App aperta da icona sulla schermata Home;
- uso verticale come priorita assoluta.

Problemi osservati:
- su iPhone 12 Pro Max con Edge la pagina Mesi risulta gia un po' lenta;
- su Android piu vecchio potrebbe essere sensibilmente peggiore;
- la barra/pulsanti in basso deve restare sempre visibile, attiva e cliccabile;
- non e un problema mantenere sempre i pulsanti in basso: per tornare indietro si puo usare la navigazione dell'app o del browser.

Requisiti V1.6:

1. Layout verticale automatico
   - adattare la UI alla risoluzione del cellulare;
   - evitare overflow laterale;
   - migliorare padding verticale e spaziatura;
   - evitare contenuti nascosti sotto la navbar inferiore.

2. Navbar/pulsanti in basso sempre attivi
   - sempre fixed su mobile;
   - sempre sopra ai contenuti;
   - sempre cliccabili;
   - alleggerire blur, shadow e trasparenze se impattano le performance;
   - valutare se mantenere i 4 pulsanti attuali o semplificare a 3 pulsanti principali, se migliora usabilita e performance.

3. Login
   - pienamente visibile in verticale;
   - pulsante ENTRA sempre raggiungibile;
   - evitare che la tastiera copra il pulsante.

4. Home
   - pulsanti INIZIO/FINE grandi ma non eccessivi;
   - ridurre altezza card se lo schermo e basso;
   - migliorare leggibilita verticale.

5. Pagina Mesi
   - rendere rendering piu leggero;
   - card piu compatte su mobile;
   - evitare lista troppo pesante;
   - mantenere navbar sempre accessibile;
   - non trasformare ancora in calendario: rinviato alla V2.

6. Modale "Modifica orari"
   - adattarsi all'altezza reale dello schermo;
   - restare usabile con tastiera aperta;
   - pulsante Salva sempre raggiungibile;
   - scroll interno stabile.

7. Tastiera mobile
   - input time/date/text non coperti;
   - valutare padding-bottom dinamico;
   - valutare `scroll-margin-bottom` o `scrollIntoView` sugli input.

8. Web App da icona Home
   - verificare viewport e safe-area;
   - valutare meta tag utili per uso da schermata Home;
   - priorita orientamento verticale.

9. Performance Android vecchio
   - valutare o ridurre CSS pesanti: `backdrop-filter`, `color-mix()`, ombre grandi, gradienti multipli, blur;
   - aggiungere fallback se utile;
   - mantenere estetica gradevole ma piu leggera.

10. Compatibilita JS/CSS
   - controllare optional chaining `?.`;
   - controllare nullish coalescing `??`;
   - controllare logical assignment `||=`;
   - controllare `color-mix()`.

Vincoli V1.6:
- non modificare backend salvo necessita fortemente motivata;
- non cambiare logica di salvataggio turni;
- non cambiare struttura Google Sheet;
- non aggiungere calendario;
- non aggiungere grafici;
- non introdurre librerie esterne;
- non introdurre service worker;
- non fare refactor generale;
- non rompere V1.5.

Test manuali V1.6:
- iPhone 12 Pro Max su Edge;
- Android vecchio reale di Alina;
- browser mobile normale;
- Web App avviata da icona Home;
- login con tastiera aperta;
- modale "Modifica orari" con tastiera aperta;
- pagina Mesi con molti mesi/righe.

## V1.8 — Performance pagina Mesi / smartphone (senza nuove feature)

Obiettivo: ridurre il costo di rendering della pagina **Mesi** su smartphone, in particolare **Android vecchio**, senza calendario, grafici, librerie esterne, service worker, né modifiche a struttura Sheet o logica dati.

Contesto: su V1.6.2 la lista mesi era costruita con un **unico `innerHTML`** molto grande; su WebView lente questo impatta parsing e layout.

Vincoli (uguali a V1.6 dove applicabile):
- nessun calendario, grafici, refactor generale;
- modifiche prevalentemente in `src/frontend/Index.html`;
- backend solo se emergenza dimostrata.

### V1.8A (avvio su `dev`)

- Formalizzazione roadmap e doc di stato.
- Intervento **minimo** su Mesi: costruzione della **lista mesi** tramite **DOM API** (`createElement`, `DocumentFragment`, `textContent` per i testi) al posto della stringa HTML unica per le righe; intestazione pagina anch’essa via DOM (nessun mega-template string per l’intero `#content`).
- **Validazione tecnica (implementatore / GitHub, 2026-05-02):** chiusa e documentata in `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md` e `docs/sessions/2026-05-02-v18a-validazione-tecnica-chiusa.md`. Controlli: `docs/COMMANDS.md` (frontend standard) + diff `main..dev` senza backend; **nessun** deploy, merge o tag.
- **Gate manuale utente (2026-05-02):** superato su URL `/dev` / Apps Script HEAD; utente ha comunicato `test V1.8A ok`.
- **Deploy ufficiale Apps Script (2026-05-02):** `npm run deploy` da `dev` — deployment clasp **`@8`**; dettagli in `docs/sessions/2026-05-02-v18a-deploy-ufficiale-eseguito.md`.
- **Requisito UI da mantenere:** nella pagina Mesi, le card/righe dei mesi devono occupare tutto lo spazio orizzontale disponibile e non lasciare zone vuote laterali o colonne morte.
- **Requisito UI da mantenere:** durante lo scroll della lista Mesi, i pulsanti inferiori di navigazione devono restare sempre visibili, fissi, attivi e cliccabili.
- Merge Git `dev` → `main` e tag stabile V1.8 solo a fase successiva **autorizzata** (non eseguiti con il deploy).

### Issue #3 — versione in UI

- Versione mostrata in **Impostazioni** sotto «Salva»: testo localizzato `Versione` / `Версия`, costante **`APP_VERSION`** in `src/frontend/Index.html` (allineare a `package.json` ad ogni release), suffisso «· Apps Script».
- Sessione implementazione: `docs/sessions/2026-05-03-issue-3-versione-ui.md`.
- **Produzione (2026-05-03):** codice su `main`, `npm run deploy` → clasp **`@9`**, tag **`v1.8.1-stable`** — `docs/sessions/2026-05-03-v181-versione-ui-release.md` (storico: prima del main-only era previsto merge da `dev`).

### Issue #5 — arrotondamento Inizio/Fine a 5 minuti (scelta rapida)

- **Stato:** implementata in `src/frontend/Index.html` su **`main`** (2026-05-05): alla pressione di **INIZIO LAVORO** / **FINE LAVORO**, se l’orario rilevato non è multiplo di 5 minuti, modale con **due pulsanti** che mostrano direttamente gli orari (floor/ceil a 5 min); se è già multiplo di 5, salvataggio **senza modale** (stesso flusso di prima).
- Sessione: `docs/sessions/2026-05-05-issue-5-arrotondamento-orari.md`.
- **Release Git V1.8.2:** tag **`v1.8.2-stable`**, snapshot `gas-current/` — `docs/sessions/2026-05-05-v182-arrotondamento-orari-release.md`. **Produzione storica Apps Script:** clasp **`@10`** (Windows); **test manuale utente OK**. Produzione precedente documentata: V1.8.1 **`@9`**.
- **V1.8.3 / V1.8B:** bump **1.8.3**, deploy clasp **`@12`** — `docs/sessions/2026-05-10-v183-v18b-months-rerender-deploy.md`; commit funzionale **`fc9ac43`** (firma/cache **`renderMonths`**); tag **`v1.8.3-stable`**.

### Promemoria stipendio (Home)

- **V1.8.10:** **«Più tardi»** imposta snooze **24 ore** in **localStorage** (`alina_lavoro_salary_reminder_snooze_until_v1`); **`shouldShowSalaryReminder_()`** nasconde il banner se lo snooze è valido anche quando il backend invia ancora `reminder.active`; **`dismissSalaryReminder`** aggiorna cache locale — deploy **`@21`** — `docs/sessions/2026-05-10-v1810-salary-reminder-snooze-24h-deploy.md`. **Test manuale utente su `/exec` @21:** **OK**.
- **V1.8.4:** pulsante **«Più tardi»** chiude la notifica (`dismissSalaryReminder`) — commit **`beb277a`**; deploy **`@14`** — `docs/sessions/2026-05-10-v184-fix-salary-reminder-later-deploy.md`, `docs/sessions/2026-05-10-v183-fix-salary-reminder-later.md`. **Test manuale utente su `/exec` @14: OK.**

### V1.8.5 — righe Mesi compatte (solo CSS mobile)

- Righe/card **Mesi** più compatte in **`@media (max-width: 899px)`** (`.list-item--month`); bump **1.8.5**; deploy **`@15`** — `docs/sessions/2026-05-10-v185-months-mobile-compact-deploy.md`. **Test utente su `/exec` @15:** **NON OK** — lista ancora monocolonna; navbar coperta / non sempre visibile durante scroll.

### V1.8.6 — fix griglia Mesi + navbar mobile

- Griglia **2 colonne** per `.list--months` su mobile (fallback **1 colonna** sotto ~360px); più **`padding-bottom`** su `.app`, **`z-index`** navbar e toast; classe **`list--months`** in JS — `docs/sessions/2026-05-10-v186-months-mobile-grid-navbar-fix-deploy.md`. Deploy **`@17`** (secondo push: **`modal-backdrop`** sopra navbar). **Test manuale utente su `/exec` @17: OK.**

### V1.8.7 — Mesi raggruppati per anno

- Wrapper **`months-by-year`**, **`groupMonthsByYear_`**, intestazioni anno localizzate; **`monthsDomMatches_`** aggiornata; griglia **`.list--months`** invariata — `docs/sessions/2026-05-10-v187-months-by-year-deploy.md`. Deploy **`@18`**. **Test manuale utente su `/exec` @18: OK.**

### V1.8.8 — anni Mesi collassabili (disclosure custom)

- Blocco per anno: **`months-year-toggle`** (`<button type="button">`) + **`months-year-panel`** con **`section.list.list--months`**; toggle senza `<details>`; **`monthsDomMatches_`** aggiornata — `docs/sessions/2026-05-10-v188-months-year-collapse-deploy.md`. Deploy **`@19`**. **Test manuale su `/exec` @19:** da fare.

### Evoluzioni possibili (V1.8B+)

- Virtualizzazione o “finestra” di mesi visibili + espansione progressiva.
- Ulteriore riduzione re-render oltre alla prima slice V1.8B (in produzione da **V1.8.3**, release corrente **V1.9.2**).

## V1.9 — Dettaglio mese (MVP lista)

**Stato:** **implementato** (**V1.9.0**, **2026-05-10**); deploy **`@22`**; sessione `docs/sessions/2026-05-10-v190-month-detail-mvp-deploy.md`. MVP **solo frontend** (`src/frontend/Index.html`), senza quinta tab navbar, senza calendario grafico a 7 colonne.

**Consegnato in V1.9.0:**

- Pagina interna **`monthDetail`** con **`state.detailMonth`** (`YYYY-MM`); **«Indietro»** → pagina **Mesi**; tab **Mesi** evidenziata quando si è sul dettaglio.
- Su **Mesi**, per ogni mese: pulsante dedicato **«Dettaglio»** (ghost); dalla **V1.9.1** il pulsante **«Stipendio»** compare solo sui **mesi precedenti** al mese corrente — card non interamente cliccabile per evitare conflitti.
- Lista giorni: **solo giorni con minuti > 0** (nessun elenco completo dei giorni vuoti del mese in questa versione).
- Calcolo minuti allineato a **`recomputeLocalSummaries`**: `minuti_lavorati` oppure `computeMinutes(inizio, fine, pausa)`.
- Tariffa per stime giornaliere: **`tariffa_media`** del summary del mese se presente; altrimenti **`localAverageRate`**.
- Etichettatura: importi giornalieri e totali stimati come **«stimato»**; **stipendio reale** solo in fondo come **mese** se disponibile — **nessuna ripartizione giornaliera** del reale.

**Documentazione decisionale (pre-release):** `docs/sessions/2026-05-10-v19-month-detail-planning.md`.

**Limitazione infrastruttura (non bug app):** banner Google Apps Script sopra la Web App — vedi sessione deploy.

### Feedback post-test V1.9.0 / `@22` (prossimi passi prodotto)

- **Test manuale:** **OK** (2026-05-10). Conferma: funzionalità **Dettaglio mese** corretta; **Indietro** OK; **Stipendio** in lista Mesi ancora operativo sui mesi precedenti; **MVP** considerato **adeguato** per la fase attuale.
- **Miglioramento «Stipendio solo mesi maturi»:** **implementato in V1.9.1** (`@23`) — regola MVP: niente pulsante **Stipendio** sul **mese corrente** né su mesi **futuri**; visibile solo per **mesi precedenti** (confronto `YYYY-MM` vs `currentMonth()`). Dettaglio sessione: `docs/sessions/2026-05-10-v191-hide-current-month-salary-button-deploy.md`.
- **Evoluzione UI Dettaglio mese:** **implementata in V1.9.2** (`@24`) — riepilogo **metriche** in alto (stile Home), **card** giorno più leggibili, **barre proporzionali** ore vs giorno più lungo del mese; senza calendario 7 colonne; senza librerie; sessione `docs/sessions/2026-05-10-v192-month-detail-visual-refresh-deploy.md`.

## V1.9.1 — Stipendio nascosto sul mese corrente (**Mesi**)

**Stato:** **implementato** (**2026-05-10**); deploy **`@23`**; sessione `docs/sessions/2026-05-10-v191-hide-current-month-salary-button-deploy.md`. Solo **`src/frontend/Index.html`**; backend e Sheet invariati. **Test manuale `/exec` @23:** **OK** (2026-05-10).

**Consegnato:**

- Helper **`isSalaryMonthEditable_(monthKey)`**: stipendio modificabile solo se il mese della card è **strettamente precedente** al mese calendario corrente (stringhe ISO `YYYY-MM`).
- **`buildMonthsListSection_`**: renderizza **«Stipendio»** solo se la helper è vera; **«Dettaglio»** sempre.
- **`buildMonthsViewSig_`**: include **`currentMonth()`** nella firma per invalidare la cache **`renderMonths`** quando cambia il mese solare.

## V1.9.2 — Dettaglio mese più visivo (metriche, card, barre)

**Stato:** **implementato** (**2026-05-10**); deploy **`@24`**; sessione `docs/sessions/2026-05-10-v192-month-detail-visual-refresh-deploy.md`. Solo **`src/frontend/Index.html`**; backend e Sheet invariati. **Test manuale `/exec` @24:** **OK** (2026-05-10; incluso **Redmi 9C NFC**).

**Consegnato:**

- Riepilogo superiore **`grid` / `metric`**: ore mese, totale stimato mese, stipendio reale mensile se presente nei dati (nessuna metrica «vuota» se il reale non c’è).
- Lista giorni con **card** più strutturate; stimato sempre tramite stringhe **«stimato»** esistenti.
- **Barra** orizzontale leggera per giorno: proporzione minuti vs massimo del mese tra giorni lavorati.

## V2 — Rinviato (oltre il MVP V1.9)

Funzionalità da affrontare **dopo** il MVP lista V1.9, quando deciso esplicitamente:

- **Vista calendario** (griglia settimanale / 7 colonne), se ancora desiderata dopo la lista V1.9.
- **Dettaglio mese «più bello»:** **V1.9.2** — metriche, card, barre (deploy **`@24`**); eventuali ulteriori rifiniture restano **evolutive**.
- Report testuali.
- Grafici ore/giorni/stipendi.
- Riepilogo annuale.
- Eventuale **ripartizione indicativa** dello stipendio reale mensile sui singoli giorni — solo se richiesta e con **etichettatura** molto chiara (non confondere con euro «realmente guadagnati» quel giorno).
- Miglioramento UI avanzato.
