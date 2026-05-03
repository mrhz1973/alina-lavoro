# Alina Lavoro — Roadmap

## Stato attuale

**V1.8.1 (2026-05-03):** micro-release su `main` e `dev` (issue **#3** versione in Impostazioni); `package.json` / `APP_VERSION` **1.8.1**; tag Git **`v1.8.1-stable`**; **deploy Apps Script ufficiale** clasp **`@9`** (`docs/sessions/2026-05-03-v181-versione-ui-release.md`). Precedente: **V1.8.0** tag **`v1.8.0-stable`**, deploy **`@8`**. Tag storici: **`v1.6.2-stable`**, **`v1.5-stable`**.

App personale per registrazione ore di lavoro di Alina.

Stack:
- Google Apps Script come backend.
- Google Sheet come database.
- HTML/CSS/JavaScript come frontend.
- GitHub per versionamento.
- Cursor come ambiente di sviluppo.
- clasp per sincronizzazione futura con Google Apps Script.

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

1. Lavorare sempre su `dev`.
2. Usare Cursor in Plan Mode per analisi e piano.
3. Passare ad Agent Mode solo dopo approvazione.
4. Controllare il diff prima di commit.
5. Fare commit e push su GitHub.
6. Usare `npm run push` solo dopo verifica locale.
7. Aggiornare il deployment Apps Script solo dopo test.
8. Fare merge `dev -> main` solo quando la versione e stabile.

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
- **Produzione (2026-05-03):** merge `dev` → `main`, `npm run deploy` → clasp **`@9`**, tag **`v1.8.1-stable`** — `docs/sessions/2026-05-03-v181-versione-ui-release.md`.

### Evoluzioni possibili (V1.8B+)

- Virtualizzazione o “finestra” di mesi visibili + espansione progressiva.
- Riduzione ulteriore di re-render se i dati non cambiano.

## V2 — Rinviato

Nuove funzionalita:
- vista calendario;
- report testuali;
- grafici ore/giorni/stipendi;
- riepilogo annuale;
- miglioramento UI avanzato.
