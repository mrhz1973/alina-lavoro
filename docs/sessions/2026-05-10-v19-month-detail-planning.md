# Decisione prodotto — **V1.9 Dettaglio mese** (MVP lista)

**Data:** 2026-05-10

## Contesto

- Produzione corrente: **V1.8.10**, Apps Script **`@21`**, tag **`v1.8.10-stable`**.
- La roadmap **V2** include già vista calendario, report, grafici, riepilogo annuale.
- Richiesta: vedere in dettaglio cosa si è fatto nel mese (giorni, ore, quanto si è guadagnato), senza necessità immediata di un calendario grafico completo.

## Decisione

1. **Non** implementare subito una griglia calendario **7 colonne**.
2. Realizzare prima una release **V1.9** con MVP **«Dettaglio mese»** come **lista giorni** (vista leggera).
3. Implementazione prevista: **solo frontend** (`src/frontend/Index.html`), dati da **`state.shifts`**; **nessun** cambio backend o Sheet nella pianificazione base.
4. **Nessuna libreria**, **nessun grafico** in MVP; compatibilità **Xiaomi Redmi 9C NFC** come vincolo di peso UI/DOM.

## Requisiti MVP (sintesi)

| Area | Contenuto |
|------|-------------|
| Ingresso | Preferito da pagina **Mesi** (riga mese e/o pulsante «Dettaglio»). Opzionale dopo: link in **Home** per mese corrente. |
| Vista | Mese selezionato; elenco giorni; per giorno: data, ore lavorate, **stima** euro giornaliera (etichetta chiara **«stimato»**); totali ore e stimato mese; stipendio reale mensile solo come riepilogo se presente. |
| Calcolo | Aggregazione minuti per `data` da `state.shifts`; stima euro allineata alla logica già usata per gli stimati nell’app. |
| UX | Mobile first, lista compatta; **no** quinta tab navbar in prima fase; **no** calendario grafico in V1.9 MVP. |

## V2 successivo (non parte di V1.9 MVP)

- Calendario 7 colonne, report testuali, grafici, riepilogo annuale.
- Ripartizione giornaliera dello stipendio reale mensile, solo se richiesta e con copy non ambiguo.

## Riferimenti

- Roadmap: [docs/roadmap.md](../roadmap.md) — sezione **V1.9 — Dettaglio mese (MVP lista)**.
