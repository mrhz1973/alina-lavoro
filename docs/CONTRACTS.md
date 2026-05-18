# Contracts — interfacce JSON stabili

**Data:** 18 maggio 2026  
**Versione:** v1.0  
**Stato:** approved  
**Decisione finale:** utente  
**Revisori:** ChatGPT, Claude

## Principio

I contratti JSON sono stabili tra le fasi. In Fase 1 vengono usati con mock manuali via Telegram. In Fase 2 vengono attivati i veri endpoint. Il passaggio da mock a endpoint reale non deve richiedere refactoring del workflow n8n.

Ogni contratto deve essere versionato. Campi nuovi devono essere backward-compatible. Campi esistenti non devono cambiare significato senza nuova versione.

## Convenzioni comuni

Ogni risposta automatica deve essere JSON valido, senza Markdown esterno, salvo log umani separati.

Campi comuni raccomandati:

```json
{
  "schema_version": "1.0",
  "request_id": "string",
  "timestamp": "2026-05-18T12:00:00+02:00"
}
```

## Contratto Ollama classifier — POST /classify

### Input

```json
{
  "event_type": "push|pull_request|task_queue|manual",
  "context": "string",
  "diff": "string",
  "repo_state": "string",
  "classifier_provider": "primary_ryzen|fallback_dell|unavailable",
  "degraded_mode": false
}
```

### Output

```json
{
  "risk": "low|medium|high",
  "task_type": "docs|app|n8n|deploy|security|unknown",
  "needs_human_gate": true,
  "recommended_executor": "cursor_cli|codex|manual|none",
  "confidence": "low|medium|high",
  "reason": "string",
  "classifier_provider": "primary_ryzen|fallback_dell|unavailable",
  "degraded_mode": false
}
```

### Esempio rischio low

Input:

```json
{
  "event_type": "task_queue",
  "context": "Update docs typo in docs/COMMANDS.md",
  "diff": "",
  "repo_state": "main clean, no pending deploy",
  "classifier_provider": "primary_ryzen",
  "degraded_mode": false
}
```

Output:

```json
{
  "risk": "low",
  "task_type": "docs",
  "needs_human_gate": false,
  "recommended_executor": "cursor_cli",
  "confidence": "high",
  "reason": "Docs-only change in allowed path, no deploy or runtime impact.",
  "classifier_provider": "primary_ryzen",
  "degraded_mode": false
}
```

### Esempio rischio medium

```json
{
  "risk": "medium",
  "task_type": "app",
  "needs_human_gate": false,
  "recommended_executor": "codex",
  "confidence": "medium",
  "reason": "Application change requires planning before Cursor CLI implementation, but no deploy is authorized.",
  "classifier_provider": "primary_ryzen",
  "degraded_mode": false
}
```

### Esempio rischio high

```json
{
  "risk": "high",
  "task_type": "deploy",
  "needs_human_gate": true,
  "recommended_executor": "manual",
  "confidence": "high",
  "reason": "Deploy, tag or rollback requires explicit user gate.",
  "classifier_provider": "fallback_dell",
  "degraded_mode": true
}
```

## Contratto OpenClaw bridge — POST /codex-consult

### Input

```json
{
  "context": "string",
  "question": "string",
  "expected_schema": "string",
  "risk": "medium"
}
```

### Output

```json
{
  "decision": "string",
  "prompt_for_implementer": "string",
  "confidence": "low|medium|high",
  "rationale": "string"
}
```

### Esempio

Input:

```json
{
  "context": "Task touches n8n routing docs and Cursor CLI prompt template. No runtime deploy.",
  "question": "Produce a bounded implementer prompt and identify gates.",
  "expected_schema": "decision,prompt_for_implementer,confidence,rationale",
  "risk": "medium"
}
```

Output:

```json
{
  "decision": "Proceed with docs-only implementation. Do not touch runtime files.",
  "prompt_for_implementer": "@docs/roadmap.md\n\nMODALITÀ: IMPLEMENTER...",
  "confidence": "high",
  "rationale": "The task is medium because it changes automation policy, but it is bounded to documentation."
}
```

## Contratto Cursor CLI job

### Input

```json
{
  "job_id": "string",
  "branch": "iter/0001",
  "repo": "mrhz1973/alina-lavoro",
  "prompt": "string",
  "allowed_paths": ["docs/**"],
  "forbidden_paths": ["src/**", "gas-current/**", ".gas/**"],
  "max_runtime_minutes": 30
}
```

### Output

```json
{
  "job_id": "string",
  "status": "done|done-unverified|failed|blocked",
  "branch": "iter/0001",
  "commit_sha": "string|null",
  "changed_files": ["string"],
  "checks_run": ["string"],
  "evidence_pack_path": "string|null",
  "summary": "string"
}
```

## Contratto evidence pack

```json
{
  "task_id": "string",
  "status": "done|done-unverified|failed|blocked",
  "commit_sha": "string|null",
  "branch": "string",
  "changed_files": ["string"],
  "diff_summary": "string",
  "checks": [
    {
      "name": "string",
      "status": "pass|fail|not_run",
      "output": "string"
    }
  ],
  "runtime_evidence": {
    "url": "string|null",
    "marker": "string|null",
    "browser_tested": false,
    "browser_test_note": "non testato in browser reale"
  },
  "limitations": ["string"]
}
```

## Contratto mock/manual Telegram bridge — Fase 1

Il mock manuale deve esporre a n8n lo stesso contratto logico del futuro `/codex-consult`.

### Messaggio Telegram

```json
{
  "type": "codex_consult_mock",
  "risk": "medium",
  "context": "string",
  "question": "string",
  "expected_schema": "decision,prompt_for_implementer,confidence,rationale",
  "actions": ["approve_manual_answer", "block", "ask_chatgpt_manually"]
}
```

### Risposta manuale normalizzata

```json
{
  "decision": "string",
  "prompt_for_implementer": "string",
  "confidence": "low|medium|high",
  "rationale": "manual mock response from Telegram"
}
```

## Soglie di routing n8n

| Risk | Condizione | Azione standard | Azione degraded fallback |
|---|---|---|---|
| low | docs-only, allowed paths, high confidence | Cursor CLI | Cursor CLI solo se confidence high; altrimenti medium |
| medium | app/n8n/policy, bounded, no manual gate | `/codex-consult` | `/codex-consult` o Telegram se bridge down |
| high | deploy/tag/rollback/security/secrets/destructive | Telegram gate | Telegram gate |
| unknown | output invalido o confidence low | Telegram gate | Telegram gate |

In modalità fallback Dell, le soglie sono conservative. Il fallback può aumentare escalation, ma non può aumentare autorità automatica.

## Error response format

Ogni endpoint deve restituire errori normalizzati:

```json
{
  "error": true,
  "error_code": "TIMEOUT|INVALID_JSON|MODEL_UNAVAILABLE|UNAUTHORIZED|INTERNAL_ERROR",
  "message": "string",
  "retryable": true,
  "degraded_mode": true
}
```

## Timeout e retry

| Servizio | Timeout iniziale | Retry | Fallback |
|---|---:|---:|---|
| Ollama primario | 20s | 1 | Dell fallback |
| Ollama fallback | 30s | 1 | Telegram gate |
| `/codex-consult` | 90s | 1 | Telegram manual mock |
| Cursor CLI job | task-defined | 0 automatici salvo policy | failed/blocked |
| Telegram | 30s | 1 | blocked |

## Hard cap iterazioni autonome

Il sistema può eseguire massimo 5 iterazioni consecutive senza intervento utente. Al raggiungimento del cap:

1. n8n sospende nuove iterazioni automatiche;
2. invia notifica Telegram;
3. allega evidence pack sintetico;
4. richiede decisione utente per ripresa, tuning o stop.

## Cleanup branch iter/*

Il cron n8n cancella branch `iter/*` chiusi dopo 7 giorni o dopo 20 iterazioni totali, solo se:

- PR merged o rejected;
- evidence pack salvato;
- nessun task attivo punta al branch;
- nessun gate manuale pendente.

## Compatibilità Fase 1/Fase 2

Fase 1 manual mock e Fase 2 OpenClaw bridge devono esporre lo stesso contratto logico verso n8n. Il workflow n8n deve cambiare solo endpoint/adapter, non forma dei dati, nomi dei campi o semantica del routing.

## Riferimenti correlati

- `docs/ARCHITECTURE.md`
- `docs/ARCHITECTURE-DELL-NODE.md`
- `docs/DOD.md`
- `docs/ROADMAP-EXECUTION.md`

## Changelog

| Versione | Data | Stato | Modifica |
|---|---|---|---|
| v1.0 | 2026-05-18 | approved | Contratti JSON per classifier, bridge Codex, Cursor CLI, evidence pack e mock Telegram |
