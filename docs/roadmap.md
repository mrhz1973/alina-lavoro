# Alina Lavoro — Roadmap

## Stato attuale

**V1.9.1** — release **2026-05-10** su **`main`** (lista **Mesi**: **«Stipendio»** nascosto sul **mese corrente** / futuri; **«Dettaglio»** sempre visibile; firma **`buildMonthsViewSig_`** con **`currentMonth()`**); **in produzione** Apps Script **`@23`** (`package.json` / `APP_VERSION` **1.9.1**); tag **`v1.9.1-stable`**; snapshot **`gas-current/`**; sessione `docs/sessions/2026-05-10-v191-hide-current-month-salary-button-deploy.md`. **Test manuale utente su `/exec` @23:** **da fare**. Include **V1.9.0** (Dettaglio mese MVP, deploy **`@22`**, test **OK**). **Nota uso:** sul telefono va il link Web App **`/exec`**; il Google Sheet è solo database/amministrazione. **Limitazione nota:** il banner Google «Questa applicazione è stata creata da un utente di Google Apps Script» è **esterno** all’app (piattaforma GAS), non bug UI — chiudibile con X ma può riapparire; vedi sessione. **Nota roadmap:** ottimizzazioni future Mesi/Home/Note restano evolutive. **Precedente V1.8.10:** deploy **`@21`**, tag **`v1.8.10-stable`**. **Precedente V1.8.9:** deploy **`@20`**, tag **`v1.8.9-stable`**. Workflow: **`main` operativo**, **`dev` legacy** — `docs/sessions/2026-05-03-main-only-workflow.md`. Tag storici: **`v1.8.10-stable`**, **`v1.8.9-stable`**, **`v1.8.8-stable`**, … **`v1.5-stable`**.

App personale per registrazione ore di lavoro di Alina.

Stack:
- Google Apps Script come backend.
- Google Sheet come database.
- HTML/CSS/JavaScript come frontend.
- GitHub per versionamento.
- Cursor come ambiente di sviluppo.
- clasp per sincronizzazione con Google Apps Script (deploy/push quando previsto dal workflow).

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
- Ulteriore riduzione re-render oltre alla prima slice V1.8B (in produzione da **V1.8.3**, release corrente **V1.9.1**).

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
- **Evoluzione futura (non difetto del MVP attuale):** rendere la vista **Dettaglio mese** più **grafica** / **visiva** / curata esteticamente rispetto alla lista compatta V1.9.0.

## V1.9.1 — Stipendio nascosto sul mese corrente (**Mesi**)

**Stato:** **implementato** (**2026-05-10**); deploy **`@23`**; sessione `docs/sessions/2026-05-10-v191-hide-current-month-salary-button-deploy.md`. Solo **`src/frontend/Index.html`**; backend e Sheet invariati.

**Consegnato:**

- Helper **`isSalaryMonthEditable_(monthKey)`**: stipendio modificabile solo se il mese della card è **strettamente precedente** al mese calendario corrente (stringhe ISO `YYYY-MM`).
- **`buildMonthsListSection_`**: renderizza **«Stipendio»** solo se la helper è vera; **«Dettaglio»** sempre.
- **`buildMonthsViewSig_`**: include **`currentMonth()`** nella firma per invalidare la cache **`renderMonths`** quando cambia il mese solare.

## V2 — Rinviato (oltre il MVP V1.9)

Funzionalità da affrontare **dopo** il MVP lista V1.9, quando deciso esplicitamente:

- **Vista calendario** (griglia settimanale / 7 colonne), se ancora desiderata dopo la lista V1.9.
- **Dettaglio mese «più bello»:** arricchimento **grafico** / **layout** della pagina **Dettaglio mese** (oltre alla lista MVP) — backlog evolutivo; non bug della V1.9.0.
- Report testuali.
- Grafici ore/giorni/stipendi.
- Riepilogo annuale.
- Eventuale **ripartizione indicativa** dello stipendio reale mensile sui singoli giorni — solo se richiesta e con **etichettatura** molto chiara (non confondere con euro «realmente guadagnati» quel giorno).
- Miglioramento UI avanzato.
