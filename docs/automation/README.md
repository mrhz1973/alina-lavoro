# Automazione — visione d’insieme (Alina Lavoro)

Questo documento descrive una **piattaforma futura** di orchestrazione; **non** implica che n8n, VPS o Cursor CLI siano già installati o collegati a questo repository.

## Ruoli

| Componente | Ruolo |
|--------------|--------|
| **ChatGPT** | **Orchestratore**: traduce obiettivi dell’utente in task strutturati, formato file (`docs/tasks/templates/`), priorità, gate manuali. |
| **GitHub** | **Memoria autoritativa**: stato codice, storico commit, tag, issue opzionali; branch operativo **`main`**. |
| **n8n** | **Coordinatore**: workflow che reagisce a eventi (nuovo file in `docs/tasks/queue/`, issue aperta, webhook). |
| **VPS** | **Ambiente di esecuzione**: macchina sempre raggiungibile dove girano n8n e/o runner che invocano Cursor CLI. |
| **Cursor CLI / headless** | **Implementatore automatico**: esegue prompt o cartella di lavoro come farebbe Cursor in IDE, con output verso repo. |
| **Utente** | **Gate finale**: approva release sensibili, test su telefono, deploy quando richiesto dalla policy. |

## Flusso target (alto livello)

```text
ChatGPT → definizione task → GitHub (docs/tasks/queue)
       → n8n rileva → VPS runner → Cursor CLI → commit/push
       → session report / aggio snapshot → notifica utente
```

## Livelli di automazione progressivi

1. **Task solo documentali** — basso rischio; nessun deploy.
2. **Micro-task frontend** — controlli rigidi (`docs/COMMANDS.md`); nessun backend.
3. **Release** — bump, deploy clasp, tag, snapshot `gas-current/`; sempre gate manuale su `/exec`.

## Cosa fare per primi

- Usare **`docs/tasks/templates/`** per ogni nuovo tipo di lavoro ripetibile.
- Mantenere **un solo current task** concettuale per repo.
- Documentare ogni blocco in **`docs/sessions/`**.

## Cosa non automatizzare subito

- Deploy e tag senza conferma umana.
- Modifiche a **Google Sheet** o segreti.
- Nuove dipendenze, service worker, refactor massivi.

Dettaglio permessi: `docs/automation/permissions.md`. Fasi operative: `docs/automation/runbook.md`.
