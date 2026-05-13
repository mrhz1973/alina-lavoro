# Local Classifier Wrapper Script Design Session

**Date:** 2026-05-13  
**Task:** 0137 — Local Classifier Wrapper Script Design  
**Type:** low-touch-loop-docs-only  
**Status:** completed (docs-only design)  
**Implementer:** Windsurf / Cascade

---

## Purpose

Document the completion of the docs-only architecture design for the future local classifier wrapper script (task 0137). This script will operationalize the wrapper concept designed in task 0136.

---

## Why This Design Was Created

The user requested a docs-only design for the future local classifier wrapper script to operationalize the wrapper concept from task 0136. This design specifies the script's expected inputs/outputs, modules/functions, pseudocode, validation rules, CLI shape, file-output mode, and test strategy without creating or executing the actual script.

---

## Files Created/Modified

### Created
- `docs/automation/local-classifier-wrapper-script-design.md` — Canonical script design document
- `docs/tasks/done/0137-local-classifier-wrapper-script-design.md` — Done marker
- `docs/sessions/2026-05-13-local-classifier-wrapper-script-design.md` — This session report

### Modified
- `docs/roadmap.md` — Added compact entry under Automation / Orchestrator Hub
- `docs/LLMS.md` — Updated task state
- `docs/wiki/current-state.md` — Updated task state
- `docs/wiki/token-efficiency.md` — Added navigation line

---

## Key Decisions

### Script Scope
- Read LLMS.md + current-state.md + token-efficiency.md + task file
- Assemble compact prompt (≤6–10k characters)
- Call local Ollama HTTP API (localhost:11434/api/generate)
- Force stream=false, think=false, format=json
- Validate JSON schema v1
- Normalize enums
- Retry once if invalid
- Return JSON to stdout
- Optionally write classifier result to processing folder in future file-output mode

### Forbidden Operations
- Do not read PROJECT_STATE.md by default
- Do not read CHECKPOINT.md by default
- Do not modify app files
- Do not deploy/tag/rollback
- Do not execute Cursor
- Do not create branches
- Do not commit/push
- Do not call provider APIs
- Do not use API keys
- Do not send data outside localhost
- Do not become source of truth

### File Location and Language
- Recommended: tools/local-classifier/alina_classifier.py
- Python preferred for portability, JSON validation, schema checks, and future n8n/script integration
- PowerShell snippets may be useful for Windows local testing but should not become the primary portable wrapper

### CLI Shape
- --task (required)
- --model (default: qwen3:14b)
- --output (stdout|file)
- --schema-version (default: 1)
- --max-context-chars (default: 10000)
- --dry-run
- --no-write
- --timeout-seconds (default: 30)
- --retry-on-invalid

### Input Assembly
- LLMS.md compact excerpt (≤1k chars)
- current-state.md compact excerpt (≤1k chars)
- token-efficiency.md relevant rules (≤500 chars)
- Task file content (≤2k chars)
- Allowed paths / forbidden paths extracted from task
- Gate keywords extracted from task
- Hard cap around 6–10k characters total

### Prompt Construction
- System prompt: technical English, ZERO API policy, gate detection
- Compact project context: LLMS.md + current-state.md excerpts
- Task content: task file + metadata
- Classification rules: A/B/C/D/E classes, risk levels
- Gate rules: sensitive gates list
- JSON schema v1: full schema definition
- Output JSON only instruction: no prose, no markdown
- think=false must be used because qwen3 thinking output is not wanted for JSON strict flow

### Local Ollama API Request
- POST http://localhost:11434/api/generate
- Parameters: model = qwen3:14b, stream = false, think = false, format = json
- Local-only, zero provider API
- Do not use CLI ollama run for strict JSON automation (validated in 0134)
- Timeout conservative (default 30 seconds)
- qwen3:14b used in short bursts because it is VRAM-heavy (validated in 0134)

### JSON Schema Validation
- Reuse 0136 schema v1
- Required fields: schema_version, task_id, slug, task_title, task_class, risk_level, needs_human_gate, gates_required, can_force_execute, allowed_paths, forbidden_paths, branch_name, recommended_implementer, recommended_cursor_model, cursor_mode, needs_decision_packet, confidence, reason_short, prompt_for_cursor
- Enum validation: task_class (A/B/C/D/E), risk_level (low/medium/high/blocked), recommended_implementer (cursor_force/claude_code/windsurf/human_gate/none), recommended_cursor_model (light/medium/strong/none), cursor_mode (force/propose/stop), confidence (high/medium/low)

### Normalization Rules
- Normalize docs-only/docs_only to task_class A only if task metadata agrees
- Normalize risk values to lowercase enum
- Normalize recommended implementer to known enum
- Reject unknown cursor_mode
- Derive branch_name if missing only when task_id and slug are reliable
- Never normalize provider API/billing task into safe class
- If any sensitive gate keyword appears, escalate to D/E or blocked
- If output contradicts metadata, fallback to human triage

### Gate Detection Rules
- Sensitive gates: runtime, VPS runtime, n8n runtime, app source changes, deploy Apps Script, tag, rollback, API key, provider API, hosted AI calls, login, GitHub Actions, new recurring costs, automatic runner, sensitive data/credentials/OAuth, physical test
- provider API / API key / billing mention → blocked
- app source changes → D / human gate
- deploy/tag/rollback/runtime → E / human gate
- docs-only with no runtime → A/B depending complexity
- architecture docs → C if delicate

### Retry/Fallback Design
- Call Ollama once
- Parse JSON
- If invalid JSON, retry once with stricter JSON-only prompt
- If still invalid, return fallback result (confidence: low, can_force_execute: false, recommended_implementer: human_gate)
- If confidence low, human triage
- If sensitive gate found, human gate
- If Ollama unavailable, human triage
- If qwen3:14b too slow or unavailable, no automatic fallback to provider APIs

### Output Modes
- stdout JSON only (default)
- Write file: docs/tasks/processing/<task-id>-classifier-result.json (future, gated)
- Append classifier summary to automation session (future)
- Feed JSON to Cursor bridge (future integration)

### Test Strategy
- Unit tests for schema validation
- Fixture tasks for A/B/C/D/E
- Invalid JSON fixture
- Duplicated JSON fixture from CLI-like output
- Provider API gate fixture
- App source gate fixture
- Docs-only safe fixture
- Latency recording
- No network-provider check conceptually

### Relationship to Qwen-Alina Profile
- Wrapper should work first with base qwen3:14b
- qwen-alina profile is optional optimization
- Profile can reduce repeated prompt tokens
- Profile must not be required for initial wrapper design
- Profile creation is separate runtime-gated task

### Relationship to N8N
- n8n can eventually call the wrapper script
- n8n runtime integration is not part of this task
- n8n must not call provider AI APIs
- future n8n integration requires explicit manual gate

### Relationship to Cursor Force-Mode Bridge
- Wrapper output feeds 0135 bridge
- If can_force_execute true and gates clean, bridge may prepare branch/prompt in future
- If D/E/blocked, stop and create Decision Packet/human gate
- No automatic merge ever

---

## Relationship with 0134, 0135, and 0136

### Task 0134 (Windows Ollama Local Preflight)
- Validated Ollama 0.23.2 + qwen3:14b locally
- Confirmed JSON strict works via local HTTP API with format=json, stream=false, think=false
- Confirmed CLI ollama run is NOT reliable for JSON strict automation
- Confirmed qwen3:14b is VRAM-heavy and must be used in short bursts
- No n8n integration yet
- ZERO API intact

### Task 0135 (Cursor CLI Force-Mode Implementer Bridge Design)
- Designed architecture: GitHub queue → n8n/local script → Ollama qwen3:14b JSON router → Cursor force-mode → dedicated branch → ChatGPT web post-check → human merge
- Cursor force-mode is target execution mode
- Branch pattern: ai/<task-id>-<slug>
- No automatic merge to main
- ChatGPT web post-check is on-demand and no-API
- Ollama qwen3:14b is classifier/router/compressor only, not implementer

### Task 0136 (Local Classifier Wrapper / Qwen-Alina Profile Design)
- Designed local classifier wrapper architecture
- Defined JSON schema v1
- Defined prompt template strategy
- Defined validation/retry/fallback behavior
- qwen-alina is optional/future
- No Modelfile/profile created
- No runtime integration

### Task 0137 (This Task)
- Designs the future wrapper script that operationalizes the 0136 wrapper concept
- Specifies script scope, CLI shape, input assembly, prompt construction, Ollama API request, JSON schema validation, normalization rules, gate detection, retry/fallback, output modes, test strategy
- No script created or executed
- No runtime integration

---

## Risks

### Identified Risks

| Risk | Mitigation |
|------|------------|
| Ollama not running or local API unavailable | Fallback to human triage |
| JSON validation fails after retry | Fallback to human triage |
| Confidence low | Fallback to human triage |
| task_class = D/E | STOP, require Decision Packet/human gate |
| gates_required non-empty | STOP, require Decision Packet/human gate |
| risk_level = blocked | STOP, require Decision Packet/human gate |
| Any provider API / API key / billing detected | STOP, require Decision Packet/human gate |
| qwen3:14b VRAM load too high | Use in short bursts only; unload after use |
| Input exceeds max-context-chars | Truncate deterministic sections |
| Output contradicts metadata | Fallback to human triage |

### What Remains Human

- Merge to main
- Deploy
- Tag
- Rollback
- Runtime
- App source changes
- Provider/API/billing decisions
- Sensitive gates
- Physical tests
- Wrapper script execution
- qwen-alina profile creation
- n8n integration

---

## Future Gates

### Before Wrapper Script Implementation
- Runtime-gated wrapper implementation
- Runtime-gated wrapper dry-run using saved fixtures
- Runtime-gated qwen-alina profile creation (optional)
- Runtime-gated n8n/local script integration

---

## No Runtime / No API / No Integration Confirmation

This design task is docs-only. No runtime was executed:

- No script created
- No script executed
- No Ollama executed
- No localhost call
- No Modelfile created
- No qwen-alina profile created
- No n8n runtime modified
- No provider API / API key / billing introduced
- No app source changes
- No deploy/tag/rollback
- No embeddings/vector DB created
- ZERO API policy remains intact

---

## Roadmap Stages

1. **Docs-only script design now** (this task 0137) — ✅ Completed
2. **Docs-only qwen-alina Modelfile design** (future task)
3. **Runtime-gated wrapper implementation** (future task)
4. **Runtime-gated wrapper dry-run using saved fixtures** (future task)
5. **Runtime-gated qwen-alina profile creation** (future task)
6. **Runtime-gated n8n/local script integration** (future task)
7. **Integration with Cursor bridge only after Cursor CLI feasibility** (future task, depends on 0135)
8. **No automatic merge ever** (permanent rule)

---

## Conclusion

The local classifier wrapper script design is now documented as the canonical design for the future script that will operationalize the wrapper concept from task 0136. The key design principles are:

- This is a docs-only design — no script is created or executed now
- The future script will call local Ollama HTTP API only
- The future script will return validated JSON compatible with 0135 Cursor bridge
- No provider API, no API key, no billing, no recurring cost
- ZERO API policy remains intact
- Local HTTP API with format=json, stream=false, think=false is the validated path from 0134
- CLI ollama run is NOT suitable for JSON strict automation
- Python script is recommended for portability and JSON validation
- Future implementation/dry-run is runtime-gated

**Prossimo passo raccomandato:** optional docs-only qwen-alina Modelfile design (stage 2), or runtime-gated wrapper implementation (stage 3), or runtime-gated Cursor CLI force-mode feasibility (from 0135), depending on user preference.

---

**Session completed — docs-only script design documented, no script created, no runtime executed, no integration authorized**
