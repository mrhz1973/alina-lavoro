# Auto-Aggio Design — Low-Touch Loop

**Data:** 2026-05-12  
**Task:** 0130-auto-aggio-design  
**Tipo:** low-touch-loop-docs-only  
**Stato:** completato

---

## Executive Summary

**Auto-Aggio** è il meccanismo che sostituisce progressivamente la richiesta manuale "aggio" con rilevamento automatico dello stato del task da GitHub e n8n, quando il completamento è già verificabile da indicatori espliciti (done marker + sessione + commit). L'obiettivo è eliminare la micro-interazione più frequente del flusso attuale (5–10 "aggio" al giorno) per task standard, **preservando i gate manuali permanenti** per operazioni rischiose e mantenendo l'"aggio" manuale come fallback affidabile.

Auto-Aggio non sostituisce il Decision Packet: lo affianca, segnalandolo all'utente quando emerge una scelta reale. Per task standard senza decisione, Auto-Aggio chiude il ciclo silenziosamente con un riepilogo conciso.

**Criterio applicato:** quante micro-interazioni umane elimina ciascuna soluzione? Per Auto-Aggio MVP: ~5–10 "aggio" al giorno per task standard.

---

## Definizione di Auto-Aggio

**Auto-Aggio** = rilevamento automatico, da parte del sistema (ChatGPT orchestratore + n8n), che un task è stato completato/fallito/richiede attenzione, **senza** che l'utente debba scrivere manualmente "aggio" per attivare la rilettura dello stato.

**No provider APIs:** Auto-Aggio immediate means ChatGPT web/on-demand reads GitHub when the user interacts; it does not mean automatic OpenAI API calls. Auto-Aggio runtime future must prefer n8n + GitHub + file-based workflow + Ollama/local models; provider APIs are out of scope by default.

Il termine "aggio" nel contesto del progetto è la formula breve con cui l'utente segnala a ChatGPT: "guarda GitHub, lo stato è cambiato, riallineati". Auto-Aggio sposta questa funzione su trigger oggettivi (commit, file presenti, marker espliciti) anziché su un comando esplicito dell'utente.

---

## Differenza tra Aggio Manuale e Auto-Aggio

| Aspetto | Aggio Manuale | Auto-Aggio |
|---|---|---|
| Trigger | Utente scrive "aggio" | Sistema rileva indicatori GitHub/n8n |
| Frequenza intervento utente | Ogni task standard (5–10/giorno) | Solo quando serve decisione vera |
| Affidabilità | 100% (intenzione esplicita) | ~95% (dipende da regole anti-falso positivo) |
| Latenza | Immediata (utente decide quando) | Polling/webhook con delay variabile |
| Scope | Tutto | Task standard con segnali chiari; fallback per ambigui |
| Gate manuali | Sempre rispettati | Sempre rispettati (Auto-Aggio non bypassa) |

---

## Perimetro

**Rientra in Auto-Aggio:**
- Task docs-only standard con done marker visibile
- Task automation con sessione automation n8n + done marker
- Task con commit/push convenzionali su `main`
- Task il cui esito è già scritto in `docs/tasks/done/` o `docs/tasks/failed/`

**NON rientra in Auto-Aggio (resta manuale o gate esplicito):**
- Task runtime (modifica VPS, n8n runtime, app Alina, deploy, tag, rollback)
- Task con introduzione API key / login / GitHub Actions
- Task con costi ricorrenti nuovi
- Task con scope drift, file vietati toccati, o ambiguità
- Decisioni strategiche (sempre via Decision Packet)
- Test fisici reali (Alina su telefono)

---

## Architettura Target

```
┌──────────────────────────────────────────────────────────────────┐
│  GITHUB (fonte di verità)                                         │
│  - docs/tasks/queue/     → task in attesa                        │
│  - docs/tasks/processing/ → task in esecuzione                   │
│  - docs/tasks/done/      → task completati (DONE MARKER)         │
│  - docs/tasks/failed/    → task falliti                          │
│  - docs/sessions/        → log sessioni manuali e automation     │
│  - commit log su main    → segnale temporale                     │
└────────────────────┬─────────────────────────────────────────────┘
                     │ polling (n8n) / lettura on-demand (ChatGPT)
┌────────────────────▼─────────────────────────────────────────────┐
│  AUTO-AGGIO ENGINE (logico, distribuito su ChatGPT + n8n)         │
│                                                                    │
│  1. State scanner: confronta stato precedente vs corrente         │
│  2. Indicator validator: done marker + sessione + commit          │
│  3. Anti-false-positive filter: regole di esclusione              │
│  4. State classifier: completato/fallito/incompleto/ambiguo/...   │
│  5. Decision Packet detector: rileva DP nei documenti prodotti    │
│  6. Gate guard: identifica task con gate manuale permanente       │
│  7. Summary generator: riepilogo conciso per utente               │
│  8. Notifier: notifica solo se serve decisione/azione utente      │
└────────────────────┬─────────────────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────────────────┐
│  UTENTE                                                            │
│  - Riepilogo passivo per task standard completati (no notifica)   │
│  - Notifica attiva solo per: DP, errore, ambiguità, gate manuale  │
└───────────────────────────────────────────────────────────────────┘
```

---

## Flusso Step-by-Step

1. **Implementatore conclude task** → committa e pusha su `main` (es. `docs: complete task NNNN ...`)
2. **n8n queue reader / polling** rileva nuovo commit o nuovo file in `docs/tasks/done/`
3. **State scanner** confronta lo stato attuale con il precedente:
   - File aggiunti/modificati
   - Marker presenti (queue → processing → done/failed)
   - Sessioni create
4. **Indicator validator** verifica triade: done marker + sessione manuale + commit coerente
5. **Anti-false-positive filter** applica le regole (sezione dedicata)
6. **State classifier** assegna stato: completato / fallito / incompleto / ambiguo / DP / gate / docs-only-standard / runtime-gated
7. **Decision Packet detector** legge i documenti prodotti e cerca pattern Decision Packet (es. sezione `# Decision Packet — ...`)
8. **Gate guard** verifica se il task tocca paths o operazioni con gate manuale permanente
9. **Summary generator** produce riepilogo conciso (formato in sezione dedicata)
10. **Notifier** decide: notifica attiva (DP / errore / gate / ambiguità) o passiva (riepilogo silenzioso)
11. **ChatGPT orchestratore** riallinea il proprio contesto senza che l'utente abbia scritto "aggio"
12. **Loop avanza** al task successivo o aspetta decisione utente

---

## Fonti di Verità GitHub da Leggere

| Fonte | Cosa indica | Affidabilità |
|---|---|---|
| `docs/tasks/queue/` | Task in attesa | Alta |
| `docs/tasks/processing/` | Task in esecuzione (prompt n8n) | Media (può essere stale) |
| `docs/tasks/done/` | **Done marker** — task completato | Massima |
| `docs/tasks/failed/` | Task fallito | Massima |
| `docs/sessions/2026-*-{slug}.md` | Sessione manuale di esecuzione | Alta |
| `docs/sessions/automation-{NNNN}-*.md` | Sessione automation n8n | Media (evidenza, non completamento) |
| `docs/automation/{topic}.md` | Documento prodotto dal task | Alta (se referenziato dal done) |
| Commit log su `main` | Segnale temporale + tipo cambio | Alta |
| Eventuali Decision Packet nei documenti | Decisioni emesse | Massima |

**Regola di priorità:** done marker > sessione manuale > commit > sessione automation > processing.

---

## Eventi GitHub Rilevanti

- **Push su `main`** con messaggio convenzionale (`docs:`, `feat:`, `fix:`, `chore:`)
- **Aggiunta file** in `docs/tasks/done/NNNN-*.md`
- **Aggiunta file** in `docs/tasks/failed/NNNN-*.md`
- **Aggiunta sessione manuale** `docs/sessions/2026-*-*.md`
- **Aggiunta sessione automation** `docs/sessions/automation-*-*.md`
- **Spostamento da queue → processing** (n8n)
- **Nessun cambio per N minuti dopo done marker** (segnale di chiusura stabile)

---

## Stati Possibili — Tabella Obbligatoria

| Stato | Indicatori | Azione Auto-Aggio | Notifica utente | Fallback |
|---|---|---|---|---|
| **Completato** | Done marker + sessione manuale + commit `complete task NNNN` | Genera riepilogo passivo, riallinea ChatGPT | Nessuna (silenzioso) | Aggio manuale se sospetto |
| **Fallito** | Failed marker + sessione errore | Genera riepilogo + DP recovery | **Attiva** | Aggio manuale obbligatorio |
| **Incompleto** | Processing senza done dopo timeout configurabile | Genera segnale "in attesa" | **Attiva (timeout)** | Aggio manuale + check |
| **Ambiguo** | Commit/file modificati ma nessun marker, OR done senza sessione, OR sessione senza commit | NON dichiarare chiuso, segnala stato | **Attiva** | Aggio manuale obbligatorio |
| **Task con Decision Packet** | Pattern `# Decision Packet — ...` o sezione equivalente nel documento prodotto | Estrai DP, presenta opzioni | **Attiva** | — |
| **Task con gate manuale** | Allowed paths includono runtime/app/deploy/tag/VPS/n8n runtime/API key/login/GitHub Actions | NON auto-procedere, mostra gate | **Attiva** | Conferma utente esplicita |
| **Task docs-only standard** | Done marker + sessione + commit, nessun DP, nessun gate | Riepilogo passivo, loop avanza | Nessuna | — |
| **Task runtime-gated** | Marker o documento dichiara `runtime: yes` o tocca paths runtime | NON auto-procedere | **Attiva** | Gate manuale esplicito |

---

## Failure Modes

| Failure | Probabilità | Impatto | Mitigazione |
|---|---|---|---|
| n8n polling fallisce | Media | Alto | Fallback aggio manuale; alert n8n down |
| Done marker creato ma sessione mancante | Bassa | Medio | Stato "ambiguo" → notifica attiva |
| Commit di automation confuso con commit di completamento | Media | Medio | Regola: messaggio commit `complete task` esplicito |
| Sessione manuale senza commit | Bassa | Basso | Stato "ambiguo" → check |
| Done marker senza riferimento a documento prodotto | Bassa | Medio | Indicator validator richiede triade |
| Falso positivo: task fallito classificato completato | Bassa | Alto | Failed marker ha priorità; check con failed scan |
| Decision Packet non rilevato | Media | Medio | Pattern matching `# Decision Packet` + ID |
| Task con gate manuale auto-proseguito | Bassa | Critico | Gate guard con whitelist allowed-paths esplicita |
| Scope drift (file vietati toccati) | Bassa | Critico | Forbidden paths scan obbligatorio prima di chiusura |
| Stato GitHub vs stato n8n disallineati | Media | Medio | GitHub è fonte di verità unica |

---

## Fallback Manuale

L'aggio manuale resta sempre disponibile e necessario nei seguenti casi:

1. **Polling n8n down** o webhook fallito
2. **Lavoro in Plan Mode** o draft non committato
3. **Task con scope ambiguo** o non standard
4. **Recovery post-failure** quando Auto-Aggio non riesce a classificare
5. **Emissione Decision Packet** se Auto-Aggio non lo rileva
6. **Sospetto falso positivo** dell'utente

**Principio:** Auto-Aggio è additivo, non sostitutivo. L'utente può sempre forzare riallineamento scrivendo "aggio" anche se non strettamente necessario.

---

## Regole Anti-Falso Positivo

1. **Non basta un commit generico**: serve done marker o failed marker esplicito.
2. **Triade preferita**: done marker + sessione manuale + commit coerente.
3. **Distinzione commit automation vs completamento**: i commit di n8n (`docs: create cursor prompt`, `docs: create automation session`) non chiudono task; solo `docs: complete task NNNN` o equivalente con done marker.
4. **Processing senza done = task aperto**: non dichiarare chiuso.
5. **Done marker senza documento prodotto referenziato = ambiguo**.
6. **Sessione manuale senza commit = ambiguo**.
7. **Allowed paths con gate manuale = stop, non auto-procedere**.
8. **File vietati o scope drift = stop e segnala**, indipendentemente da done marker.
9. **Failed marker ha priorità su done marker** in caso di conflitto.
10. **Soglia di silenzio**: dopo N minuti dall'ultimo commit, lo stato è considerato stabile (configurabile).

---

## Riepilogo Automatico Post-Task

**Formato standardizzato (Markdown breve):**

```markdown
## Auto-Aggio — Task NNNN [stato]

- **Task ID:** NNNN-slug
- **Stato:** completato | fallito | ambiguo | DP | gate
- **File prodotti:**
  - docs/automation/...
  - docs/sessions/2026-*-...
- **Hash commit:** abc1234
- **Done marker:** docs/tasks/done/NNNN-*.md ✓
- **Sessione manuale:** docs/sessions/2026-*-*.md ✓
- **Sessione automation:** docs/sessions/automation-NNNN-*.md ✓
- **Decision Packet emesso:** D-NNNN-X (se presente) | nessuno
- **Prossimo micro-step:** [task NNNN+1 / risposta DP / nessuno]
- **Rischio residuo:** [breve nota o "nessuno"]
```

Questo riepilogo viene incluso (logicamente):
- Nel canale di notifica utente (se notifica attiva)
- Come blocco interno per ChatGPT (riallineamento contesto)
- Eventualmente in `docs/STATUS.md` o INBOX.md (componenti futuri)

---

## Notifiche All'Utente

**Nessuna notifica rumorosa** per task standard completati senza decisione.

**Notifica attiva** solo per:
- **Decision Packet** nuovo emesso
- **Errore / failure** del task
- **Ambiguità** non risolvibile automaticamente
- **Gate manuale** richiesto (deploy, tag, rollback, VPS, n8n runtime, app, API key, login, GitHub Actions)
- **Runtime richiesto** per il prossimo step
- **Scope drift** o file vietati toccati

**Canale notifica futuro (da progettare):** INBOX.md (task 0129) raccoglie Decision Packet pendenti; per altri tipi di notifica si valuterà file dedicato `docs/STATUS.md` o canale esterno.

---

## Compatibilità con Decision Packet Format

- **Auto-Aggio NON sostituisce il Decision Packet.** Sono livelli diversi: Auto-Aggio è meccanismo di rilevamento stato; Decision Packet è formato di richiesta decisione.
- **Quando un task produce un Decision Packet**, Auto-Aggio lo rileva (pattern matching su `# Decision Packet — ...` o blocchi con ID `D-NNNN-X`) e lo segnala come notifica attiva.
- **Quando NON c'è decisione**, Auto-Aggio chiude silenziosamente: nessuna domanda inutile all'utente.
- **Decision ID** continua ad essere riferimento canonico (vedi `docs/automation/decision-packet-format.md`).
- **Risposta utente** al Decision Packet resta gate intentionale: l'utente sceglie con numero/parola corta, sempre.

---

## Compatibilità Futura con INBOX.md

- INBOX.md è componente del task **0129** (Human Decision Inbox Design), non di questo task.
- Auto-Aggio è progettato per integrarsi con INBOX.md quando sarà disponibile:
  - Decision Packet rilevati → accodati in INBOX.md
  - Riepiloghi con notifica attiva → eventualmente referenziati in INBOX.md
- Se INBOX.md non esiste ancora, Auto-Aggio funziona comunque tramite riepilogo + notifica diretta.

---

## Gate Manuali Permanenti

Auto-Aggio **non bypassa mai** i seguenti gate, anche se i commit/marker sono presenti:

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
- Test fisico reale
- Dati personali / credenziali

Per questi, anche con done marker visibile, Auto-Aggio classifica come **gate manuale** e attiva notifica esplicita per conferma utente prima di proseguire.

---

## Micro-Interazioni Eliminate

| Interazione | Frequenza attuale | Eliminata da Auto-Aggio MVP |
|---|---|---|
| Scrittura "aggio" per task docs-only standard | 5–10 / giorno | ✅ Sì |
| Scrittura "aggio" per task automation con marker chiaro | 1–3 / giorno | ✅ Sì |
| Scrittura "aggio" per task con DP | 1–2 / giorno | ❌ No (DP richiede notifica e risposta) |
| Scrittura "aggio" per task ambigui | Variabile | ❌ No (fallback manuale necessario) |
| Scrittura "aggio" per task con gate manuale | 1 / settimana | ❌ No (gate richiede conferma esplicita) |
| Scrittura "aggio" per recovery post-failure | Raro | ❌ No (recovery richiede attenzione) |

**Stima riduzione:** ~70–80% delle scritture "aggio" attualmente fatte dall'utente.

---

## Proposta MVP

**MVP design-first, senza modifiche runtime n8n in questo step.**

### Cosa è già possibile con sola lettura GitHub da ChatGPT (subito)

1. ChatGPT, quando legge GitHub (anche senza "aggio" esplicito), può applicare le regole di Auto-Aggio in autonomia:
   - Cercare done/failed marker recenti
   - Verificare triade (marker + sessione + commit)
   - Classificare lo stato
   - Generare riepilogo conciso
2. Questo è realizzabile **subito**, senza alcuna modifica runtime, semplicemente come **disciplina di lettura** dell'orchestratore.
3. L'utente può smettere di scrivere "aggio" per task standard chiari, e ChatGPT riallinea da solo alla prima interazione successiva.

**Micro-interazioni eliminate subito:** ~50–60% degli "aggio" attuali.

### Cosa richiede n8n runtime futuro (task runtime-gated successivo)

1. **Polling automatico done/failed**: n8n controlla periodicamente `docs/tasks/done/` e `docs/tasks/failed/` e genera riepilogo
2. **Notifica attiva**: n8n invia segnale quando emerge DP, failure, ambiguità, gate
3. **Trigger su commit**: webhook GitHub (richiede configurazione VPS/n8n runtime) per latenza ridotta
4. **Aggiornamento INBOX.md**: n8n aggiunge DP rilevati a INBOX.md

Questi richiederanno task runtime-gated separato, con gate manuale esplicito.

### Cosa richiede INBOX.md futura (task 0129)

- Accodamento Decision Packet pendenti in formato standardizzato
- Risposta utente con numero/parola corta letta da n8n/ChatGPT
- Tracciamento decisioni storiche

### Cosa resta manuale (sempre)

- Recovery post-failure
- Task ambigui o con scope drift
- Risposta a Decision Packet
- Gate manuali permanenti
- Test fisici reali
- Conferma esplicita per modifiche app, deploy, tag, rollback, VPS, n8n runtime, API key, login, GitHub Actions

---

## Cosa Richiede Task Runtime-Gated Futuro

Per portare Auto-Aggio dalla disciplina di lettura ChatGPT (immediata) a meccanismo automatizzato n8n, servono:

1. **Task n8n auto-aggio implementation** (runtime-gated): workflow n8n che esegue polling done/failed, applica regole, genera riepilogo
2. **Task GitHub webhook setup** (runtime-gated): webhook per trigger immediato (alternativa: schedule polling N minuti)
3. **Task notifica canale** (mixed): definire canale notifica (file `docs/STATUS.md`, oppure altro)
4. **Task INBOX.md generator** (legato a 0129)
5. **Task Decision Packet detector** (legato a 0131 — n8n DP Generator Design)

Tutti questi richiedono **gate manuale esplicito** per esecuzione e modifiche n8n runtime.

---

## Rischi e Mitigazioni

| Rischio | Mitigazione |
|---|---|
| Falso positivo: task chiuso prematuramente | Triade obbligatoria; failed > done in caso conflitto |
| Falso negativo: task chiuso non rilevato | Soglia silenzio + scan periodico done/ |
| ChatGPT contesto stale | Disciplina lettura GitHub all'inizio sessione |
| n8n polling down | Fallback aggio manuale sempre disponibile |
| DP non rilevato | Pattern matching robusto + sezione canonica nei documenti |
| Gate manuale bypassato | Gate guard con whitelist esplicita allowed-paths |
| Scope drift non visto | Forbidden paths scan obbligatorio prima di chiusura |
| Notifica eccessiva | Regole strict: notifica solo per DP/errore/ambiguità/gate |
| Notifica insufficiente | Soglia conservativa: in dubbio, notificare |
| Disallineamento ChatGPT vs n8n | GitHub fonte di verità unica; sync periodico |

---

## Decision Packet

**Non emesso.**

Motivazione: la raccomandazione del documento è chiara e coerente con il design 0128 e la decisione D-0128-A. L'MVP design-first immediato (disciplina lettura ChatGPT) e la roadmap runtime-gated successiva sono determinabili senza scelta tra alternative reali. Le scelte architetturali specifiche (canale notifica, soglia silenzio, formato INBOX) emergeranno nei task successivi (0129, e relativi runtime-gated) e potranno produrre Decision Packet dedicati nel momento operativo corretto.

Se in futuro emerge necessità di scelta tra alternative architetturali per Auto-Aggio (es. polling vs webhook, soglia silenzio specifica, formato canale notifica), si emetterà un Decision Packet dedicato secondo `docs/automation/decision-packet-format.md`.

---

## Ordine Roadmap (Conferma)

Dopo 0130, l'ordine atteso resta:

1. **0129** — Human Decision Inbox Design
2. **0131** — n8n Decision Packet Generator Design
3. **0132** — Ollama Classifier/Planner Feasibility
4. **0133** — Cursor/Implementer Bridge Design

**Disciplina:** eventuali cambi futuri di quest'ordine devono passare da **Decision Packet** (kind: `meta` o `automation`), non come commenti liberi in chat.

---

## Conclusione

Auto-Aggio è progettato come meccanismo a due livelli:

- **Livello immediato (subito attivabile):** disciplina di lettura GitHub da parte di ChatGPT orchestratore. Nessuna modifica runtime, riduzione stimata ~50–60% degli "aggio" manuali.
- **Livello automatizzato (runtime-gated futuro):** workflow n8n con polling/webhook + notifica + integrazione INBOX. Riduzione stimata ~70–80% degli "aggio" manuali.

L'utente conserva sempre il fallback manuale "aggio" per recovery, ambiguità, sospetto falso positivo. I gate manuali permanenti per operazioni rischiose sono preservati in tutti i livelli.

**Prossimo passo raccomandato:** procedere con task **0129 Human Decision Inbox Design** secondo la roadmap. Auto-Aggio livello immediato può essere applicato come disciplina ChatGPT senza ulteriori task.

---
**Auto-Aggio Design completato — task 0130 docs-only**
