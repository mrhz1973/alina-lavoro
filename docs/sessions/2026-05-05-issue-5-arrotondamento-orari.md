# Issue **#5** — Arrotondamento orari Inizio / Fine (5 minuti)

**Data:** 2026-05-05

## Problema affrontato

Alla pressione di **INIZIO LAVORO** o **FINE LAVORO** l’orario veniva salvato con il minuto “grezzo” del dispositivo (`currentTime()`), difficile da allineare a intervalli di 5 minuti senza passare da **Modifica orari**.

## Comportamento implementato

- L’orario rilevato resta **solo informativo** nella modale (etichetta localizzata + valore `HH:MM`).
- Se i **minuti totali dall’inizio giornata** non sono multipli di **5**, si apre una modale con:
  - titolo **«Scegli orario di Inizio»** / **«Scegli orario di Fine»** (IT; RU in `I18N`);
  - riga **Rilevato:** / **Зафиксировано:** e sotto l’orario rilevato in evidenza;
  - **due pulsanti grandi** che mostrano **solo** gli orari arrotondati (nessuna etichetta tipo «Avanti/Indietro»).
- Alla scelta, si salva **solo** l’orario selezionato (stesso schema di prima: stringhe `HH:MM` su `inizio` / `fine`).
- Se l’orario è **già** su multiplo di 5 minuti: **nessuna modale** — salvataggio immediato come in V1.8.1 (meno attrito).

## File modificati

- `src/frontend/Index.html` — logica `startWork` / `endWork`, helper tempo, CSS `.time-choice-row` / `.time-choice-btn`, chiavi `I18N` IT/RU.
- `docs/roadmap.md`, `docs/CHECKPOINT.md`, `docs/PROJECT_STATE.md` — stato issue e riferimenti.
- `docs/sessions/2026-05-05-issue-5-arrotondamento-orari.md` — questa nota.

**Non modificati:** `src/backend/Code.gs`, `gas-current/`, `package.json`.

## Calcolo dei due orari

1. `hhmmToMinutes("HH:MM")` → minuti da mezzanotte (0–1439 tipici).
2. `lo = floor(minuti/5)*5`, `hi = ceil(minuti/5)*5`.
3. `minutesToHHMM(t)`: se `t >= 1440` si normalizza a **00:00** (caso “slot dopo mezzanotte”, es. 23:58 → 23:55 e **00:00**), coerente con `computeMinutes` che gestisce fine &lt; inizio aggiungendo 1440.

Esempi verificati in Node (stessa logica del file):

| Rilevato | Pulsante sinistro | Pulsante destro |
|----------|-------------------|-----------------|
| 08:02 | 08:00 | 08:05 |
| 08:07 | 08:05 | 08:10 |
| 17:58 | 17:55 | 18:00 |
| 08:58 | 08:55 | 09:00 |
| 23:58 | 23:55 | 00:00 |

## Orario già multiplo di 5

`isHHMMOnFiveStep` → salvataggio **diretto** senza modale (comportamento precedente).

## Controlli eseguiti

- `git diff --check` (nessun problema).
- `node --check` sullo script inline estratto da `Index.html`.
- `grep` su `??`, `||=`, `?.` in `Index.html` (nessun match nuovo).
- Verifica logica arrotondamento con snippet Node (tabella sopra).

## Limiti

- **Terza opzione** «Usa HH:MM rilevato» non implementata (come da scelta di semplicità se non richiesta obbligatoriamente).
- **Git Bash / PATH:** in ambiente Windows senza `bash`, usare `npm.cmd run aggio:win` (`docs/COMMANDS.md`).
- **Issue GitHub #5:** chiusura manuale su GitHub se `gh` non autenticato in locale (vedi sotto).

## Chiusura issue GitHub

Se il comando `gh issue close 5` non è disponibile o non autenticato: **chiudere manualmente** la issue **#5** come *completed*, con commento che rimanda a questo file e al commit su `main`.

## Prossimo passo consigliato

- Test manuale su Web App / dispositivo Alina (Inizio/Fine con minuti non multipli di 5).
- Quando il workflow lo prevede: **deploy** Apps Script, aggiornare doc release / eventuale snapshot `gas-current/`, allineare `APP_VERSION` / `package.json` se micro-release dedicata.
