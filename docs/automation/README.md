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

## Disciplina esecuzione manuale n8n / VPS (`n8n manual run discipline`)

Allineata a **`docs/ORCHESTRATOR_RULES.md`** (**PRIORITÀ 0 — passo passo**), `docs/WORKFLOW.md` e `docs/AI_RULES.md`:

- Durante modifiche a **workflow n8n reali**, l’operatore (o l’orchestratore che guida l’operatore) completa e **conferma un nodo / un test alla volta**; **non** proporre il passo successivo mentre il run corrente è ancora aperto, ambiguo o in verifica.
- **Non esportare** il workflow (JSON o equivalente) e **non** considerare il lavoro chiuso finché:
  - nodi **diagnostici temporanei** non sono **rimossi** o ripristinati;
  - i nodi aggiunti non sono in stato **pulito** (naming, parametri, niente debug lasciato per sbaglio);
  - l’**output atteso** dell’esecuzione è **verificato** dall’operatore;
  - il workflow è in stato **finale**, non solo “diagnostico”.
- **Non modificare** workflow già **validati** se non sono il **target esplicito** del micro-step corrente.
- **Esempio vincolante:** mentre si lavora allo skip `done` del queue reader (`TEST - GitHub list Alina task queue`), **non** toccare il workflow **`TEST - Mark Alina task done copy-only generalized`** (già validato su 0004).
- **Primo caso pratico documentato (2026-05-11):** skip **`done`** sul queue reader — la disciplina **passo passo** ha evitato di lasciare **diagnostica temporanea** nel workflow finale (diagnostica usata in test, poi **rimossa** prima della chiusura). Dettagli: [`docs/sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md`](../sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md).

Sessione motivante: [`docs/sessions/2026-05-11-operational-step-by-step-hard-rule.md`](../sessions/2026-05-11-operational-step-by-step-hard-rule.md).
