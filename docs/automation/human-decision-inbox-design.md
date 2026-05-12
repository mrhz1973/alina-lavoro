# Human Decision Inbox Design — Low-Touch Loop

**Data:** 2026-05-12  
**Task:** 0129-human-decision-inbox-design  
**Tipo:** low-touch-loop-docs-only  
**Stato:** completato

---

## Executive Summary

La **Human Decision Inbox** (INBOX) è il luogo unico file-based dove il progetto Alina Lavoro accoda **solo** le decisioni vere che richiedono intervento dell'utente. È il complemento di Auto-Aggio: Auto-Aggio decide **quando** notificare; INBOX definisce **dove vive** la decisione pendente.

Obiettivo principale: eliminare la micro-interazione "cercare cosa devo decidere" che oggi costringe l'utente a leggere chat, GitHub, sessioni, prompt e n8n per ricostruire lo stato decisionale.

**Struttura raccomandata (MVP):** **Opzione A** — singolo file `docs/INBOX.md` con sezioni Pending / Decided / Deferred / Superseded. È la scelta a più alto rapporto micro-interazioni eliminate / complessità implementativa, e non richiede infrastruttura runtime.

**Decision Packet:** non emesso. La raccomandazione è univoca dato il contesto (progetto piccolo, decisioni rare, lettura ChatGPT immediata, n8n futuro come componente runtime-gated). Se in futuro il volume di decisioni cresce significativamente, la migrazione a Opzione B può essere proposta tramite Decision Packet dedicato.

**Criterio applicato:** "Quante micro-interazioni umane elimina?" Per INBOX MVP: ricerca decisioni pendenti, rilettura chat vecchie, scansione sessioni, formulazione risposta lunga.

---

## Definizione di Human Decision Inbox

La **Human Decision Inbox** è un artefatto file-based del repository che contiene **esclusivamente** decisioni che richiedono risposta umana, in formato standardizzato basato su Decision Packet Format. Ogni elemento è un blocco strutturato con metadati (`inbox_status`, `created_at`, `source_task`, `source_document`, `response`, `decided_at`, `superseded_by`, `archive_policy`) e contenuto del Decision Packet originale.

INBOX **non è**:
- un log generico
- un canale di status update
- un riepilogo di sessioni automation
- un elenco di task completati
- una bacheca di messaggi "tutto verde"

INBOX **è**:
- la coda visibile delle decisioni richieste all'utente
- la fonte unica di verità su "cosa devo decidere?"
- l'archivio strutturato delle decisioni passate (con risposta utente)
- compatibile con lettura ChatGPT immediata e n8n futuro

---

## Differenza tra INBOX e Log Generico

| Aspetto | INBOX | Log generico (sessioni, commit, automation) |
|---|---|---|
| Contenuto | Solo decisioni vere | Tutto: progress, status, task standard, errori, automation |
| Scopo | Azione utente richiesta | Audit trail, traccia operativa |
| Frequenza scrittura | Bassa (decisioni rare) | Alta (eventi continui) |
| Frequenza lettura utente | Alta (cerco cosa decidere) | Bassa (consultazione su richiesta) |
| Stato | `pending` / `decided` / `deferred` / `superseded` | Cronologico, immutabile |
| Risposta utente | Sì (numero o parola corta) | No |
| Auto-Aggio rileva | Sì, accoda DP | Sì, ma per stato task, non per decisione |

---

## Perimetro

**Rientra in INBOX:**
- Decision Packet emessi da task completati (es. D-0128-A)
- Scelte architetturali che richiedono utente
- Gate manuali permanenti che richiedono conferma esplicita (runtime, app, deploy, tag, rollback, VPS, n8n runtime, API key, login, GitHub Actions, costi nuovi)
- Decisioni rimandate (`deferred`) che richiedono follow-up

**NON rientra in INBOX:**
- Task standard completati (Auto-Aggio gestisce silenzioso)
- Sessioni automation n8n (file dedicati in `docs/sessions/automation-*`)
- Sessioni manuali di implementazione (file dedicati in `docs/sessions/`)
- Status passivo del sistema (eventualmente futuro `docs/STATUS.md`)
- Commenti, draft, idee non strutturate
- Notifiche di "tutto OK"

---

## Architettura File-Based Proposta

### Struttura raccomandata (Opzione A — MVP)

```
docs/
├── INBOX.md                    # file unico con sezioni
│   ├── ## Pending              # decisioni da rispondere
│   │   ├── D-NNNN-X (block)
│   │   └── D-NNNN-Y (block)
│   ├── ## Decided              # decisioni risposte (cronologico)
│   │   └── D-NNNN-Z (block + response)
│   ├── ## Deferred             # rimandate esplicitamente
│   │   └── D-NNNN-W (block + defer_note)
│   └── ## Superseded           # sostituite da DP successivo
│       └── D-NNNN-V (block + superseded_by)
```

**Motivazione struttura:**
- File unico = lettura immediata da ChatGPT senza scansione directory
- Sezioni separate = nessuna confusione pending vs storico
- Markdown puro = leggibile su GitHub, commit-friendly
- Nessuna directory = nessun rischio di file orfani o nomenclatura inconsistente

---

## Alternative Valutate

| Aspetto | Opzione A (file unico) | Opzione B (directory) | Opzione C (subdirectory automation) |
|---|---|---|---|
| **Struttura** | `docs/INBOX.md` con 4 sezioni | `docs/inbox/D-NNNN-X.md` + `docs/inbox/INDEX.md` | `docs/automation/inbox/pending/` + `docs/automation/inbox/archive/` |
| **Vantaggi** | Lettura immediata, no scansione, commit semplici, nessun rischio file orfani | Granularità per decisione, ogni DP versionabile separatamente, audit per singolo DP | Isolamento sotto automation, separazione pending/archive su filesystem |
| **Svantaggi** | File può crescere; rotazione manuale necessaria | Richiede indice, scansione directory, complessità di lifecycle | Profondità path, ChatGPT deve scansionare due dir |
| **Micro-interazioni eliminate** | ~6: cerca, rileggi chat, scansiona sessioni, chiedi "cosa decido?", distingui da log, risposta lunga | ~5 (le stesse, ma serve scansione directory) | ~5 (le stesse, ma con overhead path) |
| **Compatibilità n8n** | Alta: leggi un file, scrivi append | Media: serve listing directory + indice | Media: serve listing 2 dir |
| **Rischio** | File grande nel tempo → mitigato da archive policy + sezione Superseded | File orfani, indice fuori sync, mismatch nome | Path profondo, errori navigazione |
| **Raccomandazione** | **✅ MVP** | Migrazione futura se volume cresce | Non raccomandato (overhead senza benefici) |

**Opzione D** non emersa. Non si è identificata una struttura ibrida con vantaggi netti rispetto ad A o B nel contesto attuale.

---

## Template Markdown dell'Elemento INBOX

Ogni elemento INBOX è un blocco Markdown standardizzato. Include i **13 campi del Decision Packet Format** (in ordine canonico) più i campi INBOX-specifici.

```markdown
### D-NNNN-X — [titolo breve]

**inbox_status:** pending | decided | deferred | superseded
**created_at:** 2026-MM-DD
**source_task:** NNNN-slug
**source_document:** docs/automation/{topic}.md
**response:** [vuoto se pending; numero/parola se decided]
**decided_at:** [vuoto se non decided]
**superseded_by:** [vuoto, oppure D-MMMM-Y]
**archive_policy:** keep | rotate-after-N-days | manual

---

**Decision ID:** D-NNNN-X
**kind:** alina-feature | automation | infra | meta
**Titolo breve:** [una riga]

**Contesto minimo:** [2–4 righe]

**Perché serve decisione:** [perché il sistema non può decidere da solo]

**Opzioni:**
1. [opzione 1]
2. [opzione 2]
3. [opzione 3]

**Raccomandazione orchestratore:** [opzione N — motivo breve]

**Rischio principale:** [rischio della scelta di default o della scelta sbagliata]

**Impatto:** [chi/cosa è impattato]

**Micro-interazioni umane eliminate:** [stima/lista]

**Scelta richiesta:** rispondi con `D-NNNN-X = N` (numero opzione) oppure `D-NNNN-X = defer` / `D-NNNN-X = skip`

**Cosa succede dopo la scelta:** [azione automatica/manuale derivante]

**Cosa NON verrà fatto senza ulteriore gate:** [gate manuali permanenti rilevanti]
```

**Note:**
- Il campo `kind` resta in **posizione 2** (subito dopo Decision ID), come nel Decision Packet Format canonico
- I 13 campi DP sono **invarianti** in ordine e nome
- I campi INBOX (`inbox_status`, `created_at`, ecc.) sono **header strutturati** prima del blocco DP
- Separatore `---` tra header INBOX e blocco DP

---

## Schema di Stato

| Stato | Indicatore visibile | Transizioni ammesse | Chi può cambiarlo | Quando archiviare | Fallback |
|---|---|---|---|---|---|
| **pending** | Sezione `## Pending` | → decided, → deferred, → superseded | Sistema (accoda), Utente (sposta) | Mai (resta finché c'è risposta) | Domanda diretta utente se troppo vecchio |
| **decided** | Sezione `## Decided`, campo `response` valorizzato, `decided_at` valorizzato | → superseded (raro) | Utente (risponde), Sistema (registra) | Dopo N giorni (rotate) o keep | Audit log |
| **deferred** | Sezione `## Deferred`, nota motivazione | → pending (riapertura), → decided, → superseded | Utente | Dopo N giorni → riproposta come pending | Notifica follow-up |
| **superseded** | Sezione `## Superseded`, campo `superseded_by` valorizzato | Nessuna (terminale) | Sistema (quando emette DP che sostituisce) | Mantenere per audit | Nessuno |

**Transizioni:**
```
pending ──(risposta utente)──► decided
   │
   ├──(utente rimanda)──► deferred ──(riapertura)──► pending
   │                                  └──(risposta)──► decided
   │
   └──(nuovo DP che lo sostituisce)──► superseded

decided ──(nuovo DP correlato)──► superseded (raro)
```

---

## Regole di Accodamento

1. **Chi accoda:**
   - Orchestratore (ChatGPT) durante stesura prompt o lettura GitHub
   - Auto-Aggio (livello immediato disciplina ChatGPT, livello automatizzato n8n futuro)
   - Implementatore solo se task produce esplicito DP
2. **Quando accodare:**
   - DP emerso nel documento prodotto da un task completato
   - Gate manuale permanente richiesto per prossimo passo
   - Decisione architetturale tra alternative non decidibili dal sistema
3. **Formato accodamento:**
   - Blocco completo (template sopra) — auto-contenuto, leggibile senza contesto esterno
   - `source_document` punta al documento canonico dove il DP è stato emesso (no duplicazione del contenuto del documento)
4. **Posizione:** in cima alla sezione `## Pending` (più recente primo)
5. **Limite congestione:** se `## Pending` supera 5 elementi → segnalare come congestione (auto-aggio attivo)
6. **Niente accodamento spurio:** se non c'è scelta reale, NON accodare

---

## Regole di Risposta Utente

L'utente risponde con **numero o parola corta**, mai con frase lunga.

### Convenzioni risposta

| Forma | Significato |
|---|---|
| `D-NNNN-X = 2` | Scelgo opzione 2 |
| `2` (in contesto univoco) | Scelgo opzione 2 del DP corrente in chat |
| `D-NNNN-X = defer` | Rimanda esplicitamente |
| `D-NNNN-X = skip` | Non rispondo (raro, segnale di disinteresse) |
| `D-NNNN-X = retry` | Riformulare il DP (le opzioni non bastano) |

### Dove scrivere la risposta

**Canale primario (MVP):** chat con ChatGPT. ChatGPT recepisce la risposta, aggiorna INBOX nel commit successivo (transizione pending → decided).

**Canale futuro (runtime-gated):** commit dedicato con messaggio `inbox: D-NNNN-X = N` letto da n8n.

**NON scrivere:**
- Risposte come commenti di codice
- Risposte in file ad-hoc temporanei
- Risposte multiple per stesso DP (l'ultima vince ma può creare ambiguità)

---

## Lettura Risposta da Parte del Sistema

### Livello immediato (ChatGPT, MVP)

1. ChatGPT legge la risposta utente in chat
2. ChatGPT aggiorna `docs/INBOX.md`:
   - Sposta blocco da `## Pending` a `## Decided`
   - Valorizza `response` e `decided_at`
3. ChatGPT genera prompt per task successivo (se previsto)
4. Commit messaggio: `docs: inbox D-NNNN-X = N` (descrittivo, no token sensibili)

### Livello automatizzato (n8n, runtime-gated futuro)

- n8n legge `docs/INBOX.md` periodicamente o su commit
- n8n rileva transizioni pending → decided
- n8n può accodare DP rilevati nei documenti prodotti
- Richiede task runtime-gated separato con gate esplicito

### Compatibilità con Auto-Aggio

Auto-Aggio rileva la risposta come evento di stato (transizione INBOX) e:
- Notifica passivamente che il ciclo decisione è chiuso
- Propone prossimo step se determinato dalla risposta
- NON bypassa gate manuali, anche se la risposta è univoca

---

## Regole di Archiviazione

| Stato | Archive Policy default | Note |
|---|---|---|
| `decided` | `keep` | Audit perpetuo dei DP risolti |
| `deferred` | `manual` | Rivedere periodicamente; rotate se obsoleto |
| `superseded` | `keep` | Storico tracciabile delle decisioni sostituite |
| `pending` | N/A | Non si archivia mai |

**Strategia file-unico (Opzione A):**
- Tutti gli stati restano in `docs/INBOX.md`
- Rotazione manuale: se file > soglia (es. 10000 righe), ChatGPT propone migrazione storico in `docs/INBOX-ARCHIVE.md` tramite Decision Packet
- Nessuna deletion: tutto resta tracciabile

---

## Regole Anti-Rumore

1. **Solo Decision Packet o decisioni vere** in INBOX.
2. **Niente log generici** (sessioni, commit, automation).
3. **Niente status update** ("task completato", "tutto verde").
4. **Niente task standard completati** (Auto-Aggio gestisce silenzioso).
5. **Niente sessioni automation** (file dedicati esistono già).
6. **Niente messaggi "tutto OK"** o conferme passive.
7. **Se non serve decisione, non accodare.** In dubbio: non accodare.
8. **Niente duplicazioni:** un DP entra una sola volta; aggiornamenti = transizione stato, non nuovo blocco.
9. **Niente frammenti:** ogni blocco INBOX è auto-contenuto e leggibile senza contesto.

---

## Compatibilità con Decision Packet Format

- INBOX **non sostituisce** il Decision Packet Format. È il **luogo** dove vivono i DP che richiedono risposta.
- Ogni blocco INBOX **usa e referenzia** il Decision Packet Format canonico (`docs/automation/decision-packet-format.md`).
- I **13 campi DP** sono invarianti in ordine e nome.
- Il campo **`kind`** resta in **posizione 2** (dopo Decision ID), come da format canonico.
- I campi INBOX (`inbox_status`, `created_at`, ecc.) sono **aggiuntivi**, non sostitutivi.
- DP già emessi (es. D-0128-A) possono essere migrati in INBOX al primo ciclo di adozione, mantenendo il riferimento al documento originale via `source_document`.

---

## Compatibilità con Auto-Aggio

- **Auto-Aggio rileva DP** nei documenti prodotti dai task (pattern matching su `# Decision Packet` o `Decision ID: D-NNNN-X`)
- **Se INBOX esiste** (post-creazione futura), Auto-Aggio **accoda automaticamente** il DP rilevato come `pending`
- **Se l'utente risponde**, Auto-Aggio rileva la transizione `pending → decided` e:
  - Segnala completamento ciclo decisionale
  - Propone prossimo task se determinato
- **Auto-Aggio NON bypassa gate manuali**, anche se la risposta sembra univoca
- INBOX vuota (`## Pending` senza elementi) = nessuna decisione richiesta = Auto-Aggio silenzioso

---

## Compatibilità con n8n

**In questo task: solo design documentale. Nessuna modifica runtime n8n.**

### Cosa n8n può fare in futuro (runtime-gated, task separati)

- Leggere `docs/INBOX.md` periodicamente o su push
- Rilevare transizioni stato (pending → decided)
- Accodare nuovi DP rilevati nei documenti prodotti dai task
- Notificare utente solo quando `## Pending` ha elementi nuovi
- Aggiornare INBOX su risposta utente in canale dedicato

### Cosa n8n NON fa in questo task

- Nessuna lettura/scrittura runtime di INBOX
- Nessun workflow modificato
- Nessuna API key, login, GitHub Actions
- Nessun runner automatico attivato

Ogni modifica n8n runtime richiede **task runtime-gated separato** con gate manuale esplicito.

---

## Gate Manuali Permanenti

INBOX **non bypassa mai** i seguenti gate, anche se la risposta utente è registrata:

- Modifica app Alina (V1.9.2 stabile, fuori scope)
- Deploy Apps Script
- Tag git
- Rollback
- Modifica VPS
- Modifica n8n runtime
- Introduzione API key
- Introduzione login
- Introduzione GitHub Actions
- Costi ricorrenti nuovi
- Runner automatico
- Test fisico reale (Alina su telefono)
- Dati personali / credenziali

Per questi, anche con DP in INBOX e risposta utente, serve **gate esplicito separato** prima dell'esecuzione.

---

## Storico Decisioni

- Sezione `## Decided` mantiene cronologia decisioni risposte
- Sezione `## Superseded` mantiene decisioni sostituite con riferimento `superseded_by`
- `source_document` punta al documento canonico originale (mai duplicato in INBOX)
- Retention: tutte le decisioni restano tracciabili, no deletion
- Migrazione storico (`docs/INBOX-ARCHIVE.md`) solo via Decision Packet futuro se il file principale cresce eccessivamente

---

## Sicurezza e Dati Sensibili

**Mai inserire in INBOX:**
- Token API, OAuth material, refresh token, ID token
- Credenziali (username/password)
- Sessioni locali, cookie, session ID
- URL raw con token in query string
- `download_url` con token sensibili
- Chiavi private SSH/GPG
- Numeri di telefono, dati personali identificativi
- Numeri di carta, IBAN

**Pattern accettabile per decisioni su credenziali:**
- "serve configurare credenziale X per servizio Y" ✅
- "credenziale X = abc123..." ❌

**Verifica pre-accodamento:** chi accoda (orchestratore o Auto-Aggio futuro) deve applicare scan anti-dati-sensibili prima di scrivere il blocco INBOX. Se in dubbio, **non accodare** e segnalare manualmente.

---

## Micro-Interazioni Eliminate

| Interazione | Eliminata da INBOX MVP |
|---|---|
| "Cercare cosa devo decidere" tra chat, GitHub, sessioni | ✅ Sì (un solo file) |
| Rileggere chat vecchie per ricostruire DP pendenti | ✅ Sì |
| Scansionare `docs/sessions/` cercando DP non risposti | ✅ Sì |
| Chiedere a ChatGPT "cosa devo decidere?" | ✅ Sì (lettura INBOX) |
| Distinguere decisione vera da log generico | ✅ Sì (INBOX contiene solo decisioni) |
| Rispondere con frase lunga invece di numero | ✅ Sì (convenzione `D-NNNN-X = N`) |
| Tracciare cosa è stato deciso in passato | ✅ Sì (sezione Decided) |
| Capire perché un DP è stato sostituito | ✅ Sì (sezione Superseded + `superseded_by`) |

**Stima riduzione tempo "cercare cosa decidere":** da ~30 secondi/decisione (multi-fonte) a ~5 secondi/decisione (un file).

---

## MVP Proposto

**MVP docs-first, senza runtime, attivabile in tre passi:**

1. **Ora (task 0129 — questo task):** solo design documentale. `docs/INBOX.md` NON creato.
2. **Task futuro mixed/runtime-gated separato:** creazione effettiva di `docs/INBOX.md` con template iniziale, eventualmente migrazione D-0128-A come primo elemento di esempio.
3. **Task runtime-gated successivo:** integrazione n8n (lettura/scrittura/notifica).

**Cosa è già possibile con sola lettura ChatGPT (subito dopo creazione INBOX):**
- ChatGPT legge INBOX a inizio sessione
- ChatGPT applica disciplina Auto-Aggio per accodare DP rilevati
- Utente risponde con `D-NNNN-X = N`
- ChatGPT aggiorna INBOX nel commit successivo
- Nessun runtime n8n necessario

**Cosa resta manuale:**
- Risposta a DP (sempre intenzionale)
- Gate manuali permanenti (sempre)
- Eventuale rifiuto/retry di DP mal formulati

---

## Cosa Richiede Task Futuro Mixed/Runtime-Gated

| Funzionalità | Tipo task | Gate richiesto |
|---|---|---|
| Creazione `docs/INBOX.md` con template iniziale | mixed (docs + un nuovo file leggibile dal sistema) | Gate manuale leggero |
| Migrazione D-0128-A in INBOX | docs-only (parte del precedente) | Compreso sopra |
| n8n lettura INBOX | runtime-gated | Gate manuale esplicito (modifica workflow) |
| n8n accodamento automatico DP rilevati | runtime-gated | Gate manuale esplicito |
| n8n notifica `## Pending` non vuoto | runtime-gated + scelta canale notifica | Gate manuale esplicito |
| INBOX response via commit dedicato | runtime-gated | Gate manuale esplicito |
| Rotation storico in `docs/INBOX-ARCHIVE.md` | docs-only + Decision Packet | Solo quando file cresce |

---

## Rischi e Fallback

| Rischio | Mitigazione |
|---|---|
| INBOX cresce eccessivamente | Archive policy + sezione Superseded + futura rotation via DP |
| DP duplicato (stesso D-NNNN-X accodato due volte) | Indicator: Decision ID unico; check pre-accodamento |
| Risposta utente ambigua (es. `2` in chat senza contesto DP) | ChatGPT chiede conferma `D-NNNN-X = 2` esplicito |
| Risposta non recepita (commit perso) | Lettura INBOX a ogni sessione + check pending |
| Dati sensibili accodati per errore | Scan pre-accodamento + responsabilità orchestratore |
| n8n disallineato con stato GitHub | GitHub è fonte di verità unica |
| DP `pending` dimenticato | Soglia congestione (>5 pending) + segnalazione Auto-Aggio |
| Falso `superseded` (DP sostituito quando non doveva) | `superseded_by` esplicito; reversibile via riapertura |
| INBOX accidentalmente commit-overwritten | Branch unico `main`, commit selettivo, no `git add .` |

**Fallback ultima istanza:** se INBOX risulta inutilizzabile, l'utente può sempre tornare al flusso pre-INBOX (decisioni in chat). Nessuna dipendenza forzata.

---

## Decision Packet

**Non emesso.**

**Motivazione:** la scelta tra Opzione A / B / C è univocamente determinata dai vincoli attuali del progetto:
- Volume decisioni: basso (qualche DP/settimana al massimo)
- Lettori: ChatGPT (preferisce file unico) + utente (preferisce file unico) + n8n futuro (può leggere entrambi)
- Complessità desiderata: minima
- Rischio Opzione A (file grande): mitigabile con rotation futura tramite DP
- Vantaggi Opzione B emergono solo con volumi elevati, non attualmente presenti

**Opzione A è chiaramente raccomandata.** Emettere un DP per chiedere all'utente di scegliere significherebbe creare la micro-interazione che INBOX vuole proprio eliminare.

**Se in futuro emerge necessità di migrazione (es. volume crescente, multi-utente, esigenza di versionamento per singolo DP), si emetterà un Decision Packet dedicato** secondo `docs/automation/decision-packet-format.md` (kind: `automation`).

---

## Ordine Roadmap Successivo

Dopo il completamento di 0129, l'ordine atteso resta:

1. **0131** — n8n Decision Packet Generator Design
2. **0132** — Ollama Classifier/Planner Feasibility
3. **0133** — Cursor/Implementer Bridge Design

**Disciplina:** eventuali cambi futuri di quest'ordine devono passare da **Decision Packet** (kind: `meta` o `automation`), non come commenti liberi in chat.

---

## Conclusione

La Human Decision Inbox è progettata come **file unico `docs/INBOX.md`** con quattro sezioni stato (Pending / Decided / Deferred / Superseded), template Markdown che ingloba i 13 campi del Decision Packet Format più 8 campi INBOX-specifici, e regole anti-rumore strette.

L'MVP è **docs-first, zero runtime**: ChatGPT legge e scrive INBOX, l'utente risponde con numero/parola corta in chat. n8n resta componente futuro runtime-gated.

**Prossimo passo:** in questo task NON si crea `docs/INBOX.md`. La creazione effettiva è riservata a un task successivo mixed/runtime-gated con gate manuale leggero. Procedere secondo roadmap con task **0131 n8n Decision Packet Generator Design**.

**Micro-interazione eliminata target:** "cercare cosa devo decidere" — ridotta da multi-fonte a un solo file leggibile in 5 secondi.

---
**Human Decision Inbox Design completato — task 0129 docs-only**
