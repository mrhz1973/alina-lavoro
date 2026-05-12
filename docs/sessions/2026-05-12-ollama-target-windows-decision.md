# Session — Ollama Target: Windows Decision

**Data:** 2026-05-12  
**Tipo:** docs-only (post-feasibility user decision)  
**Stato:** completato

---

## Contesto

Task 0133 (completato il 2026-05-12) ha prodotto la feasibility del Classifier/Planner Ollama post-wiki e ha raccomandato:

- **Macchina candidata per il primo test:** MacBook Pro M2 (16 GB RAM unificata, always-on)
- **Modello iniziale:** Qwen 2.5 7B
- **Workstation RTX 3060:** valutata come opzione secondaria per modelli 14B o embedding generation
- **Gate 7** (conferma manuale utente) richiesto prima di aprire il task preflight runtime-gated

## Decisione Utente

Dopo il completamento della feasibility, l'utente ha comunicato:

> "ora non voglio usare il mac, continuo ad usare windows con ollama"

**Il target iniziale per il futuro preflight Ollama locale non è più MacBook Pro M2.**

## Perché Questa Decisione Modifica la Raccomandazione di Task 0133

La raccomandazione di task 0133 basava la scelta del MacBook Pro M2 su:
1. Always-on (compatibile con integrazione n8n futura)
2. RAM unificata 16 GB (no limite VRAM separato per modelli 7B)
3. Apple Silicon con ottimizzazioni Ollama native
4. Non blocca la workstation per lavoro quotidiano

L'utente preferisce la workstation Windows per il primo test. Questa è una scelta operativa valida:
- La workstation Windows è già in uso e disponibile
- RTX 3060 12 GB VRAM è superiore alla RAM unificata M2 per modelli con GPU dedicata CUDA
- Qwen 2.5 7B su RTX 3060 entra in VRAM con margine abbondante (~5–6 GB su 12 GB disponibili)
- La latenza di inferenza su GPU NVIDIA con CUDA è competitiva con Apple Silicon
- L'aspetto "always-on" del Mac è meno rilevante nella fase di preflight/testing manuale

La fattibilità complessiva dell'approccio Ollama non cambia — il documento di feasibility (sezioni 1–10) rimane valido. Cambia solo il target hardware e il contesto di deployment.

## Nuovo Target Hardware

| Campo | Valore |
|-------|--------|
| OS | Windows (in uso corrente) |
| CPU | AMD Ryzen 9 3900X |
| RAM | 32 GB |
| GPU | NVIDIA RTX 3060 12 GB VRAM |
| Backend Ollama | CUDA |

## Aggiornamento Raccomandazione Modello

Su RTX 3060 12 GB VRAM:

| Modello | VRAM stimata (4-bit) | Fattibilità |
|---------|---------------------|-------------|
| Qwen 2.5 7B | ~5–6 GB | ✅ Prima scelta — ampio margine |
| Qwen 3 8B | ~5–6 GB | ✅ Alternativa — da valutare nel preflight |
| Llama 3.1 8B | ~5–6 GB | ✅ Fallback |
| Qwen 2.5 14B | ~9–10 GB | ⚠️ Da verificare — overhead CUDA può portare al limite; seconda fase |

Il primo test resta con Qwen 2.5 7B o Qwen 3 8B.

## Cosa Non È Stato Fatto

- Nessuna installazione Ollama
- Nessun download di modelli
- Nessun avvio di servizi locali
- Nessun test runtime
- Nessuna modifica al runtime n8n
- Nessuna modifica all'app Alina (V1.9.2 stabile, non toccata)
- Nessun deploy, tag, rollback

## Gate Futuri (Invariati)

I 7 gate pre-installazione definiti in task 0133 restano obbligatori e invariati:

1. **Gate 1 — Qualità:** benchmark sintetico 20 task storici, criteri minimi soddisfatti
2. **Gate 2 — Sicurezza:** nessuna credenziale/dato sensibile nell'input del classifier
3. **Gate 3 — Hardware:** RAM/VRAM e latenza verificate entro parametri (≤10s, VRAM entro limite)
4. **Gate 4 — Policy:** output classifier = suggerimento, non autorizzazione; gate permanenti invariati
5. **Gate 5 — Isolamento:** Ollama operante offline durante inferenza
6. **Gate 6 — Supervisione:** dry-run obbligatorio, revisione ≥10 classificazioni reali prima di uso operativo
7. **Gate 7 — Conferma Utente:** Decision Packet dedicato + conferma manuale esplicita prima di qualsiasi runtime

**Gate 7 è ancora richiesto prima di aprire il task preflight runtime-gated.**

## Prossimo Step Consigliato

**Gate 7 → task 0134 Windows Ollama Local Preflight Install (runtime-gated)**

Il futuro task 0134 deve essere creato come:
- **Tipo:** `runtime-gated`
- **Target:** Windows workstation (Ryzen 9 3900X / RTX 3060 12 GB)
- **Modello iniziale:** Qwen 2.5 7B
- **Backend:** Ollama con CUDA
- **Prerequisito:** Gate 7 superato (Decision Packet + conferma manuale utente)

## Documenti Aggiornati in Questa Sessione

- `docs/automation/ollama-classifier-planner-feasibility-post-wiki.md` — sezione 11 aggiunta
- `docs/LLMS.md` — Task State e Low-Touch Stack aggiornati
- `docs/wiki/current-state.md` — Task State aggiornato
- `docs/CHECKPOINT.md` — sintesi decisione preposta
- `docs/PROJECT_STATE.md` — sintesi decisione preposta
- `docs/roadmap.md` — prossimo step aggiornato
- `docs/sessions/2026-05-12-ollama-target-windows-decision.md` — questo file
