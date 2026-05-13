# Local Classifier Wrapper and Qwen-Alina Profile Design Session

**Date:** 2026-05-13  
**Task:** 0136 — Local Classifier Wrapper and Qwen-Alina Profile Design  
**Type:** low-touch-loop-docs-only  
**Status:** completed (docs-only design)  
**Implementer:** Windsurf / Cascade

---

## Purpose

Document the completion of the docs-only architecture design for the local classifier wrapper and optional future qwen-alina profile (task 0136). This design builds on task 0134 (Windows Ollama Local Preflight) and task 0135 (Cursor CLI Force-Mode Implementer Bridge Design).

---

## Why This Design Was Created

The user requested a docs-only design for the local classifier wrapper and optional future qwen-alina profile to formalize the component that will sit between GitHub/n8n/local script and the Cursor force-mode bridge. This design is a natural continuation of the low-touch/no-api/local-first architecture direction established in tasks 0134 and 0135.

---

## Files Created/Modified

### Created
- `docs/automation/local-classifier-wrapper-qwen-alina-profile-design.md` — Canonical design document
- `docs/tasks/done/0136-local-classifier-wrapper-qwen-alina-profile-design.md` — Done marker
- `docs/sessions/2026-05-13-local-classifier-wrapper-qwen-alina-profile-design.md` — This session report

### Modified
- `docs/roadmap.md` — Added compact entry under Automation / Orchestrator Hub
- `docs/LLMS.md` — Updated task state
- `docs/wiki/current-state.md` — Updated task state
- `docs/wiki/token-efficiency.md` — Added navigation line

---

## Key Decisions

### Wrapper Position
- Wrapper sits between GitHub/n8n/local script and Cursor force-mode bridge
- Input: LLMS.md + wiki/current-state.md + token-efficiency.md + task file (≤6–10k chars)
- Output: validated JSON classification + compressed prompt for Cursor
- Consumer: Cursor force-mode bridge (from 0135)

### Wrapper Responsibilities
- Allowed: assemble compact input, call local Ollama HTTP API, validate JSON, enforce schema, retry once, return classification
- Forbidden: modify repo files, execute shell, start Cursor directly, deploy/tag/rollback, call provider APIs, use API keys, read PROJECT_STATE.md by default, send data outside localhost

### Local API Call Shape
- Endpoint: POST http://localhost:11434/api/generate
- Parameters: model = qwen3:14b, stream = false, think = false, format = json
- Local-only, no provider API
- CLI ollama run is NOT suitable for JSON strict automation (validated in 0134)

### JSON Schema v1
- Strict schema compatible with 0135 Cursor bridge
- Fields: schema_version, task_id, slug, task_title, task_class, risk_level, needs_human_gate, gates_required, can_force_execute, allowed_paths, forbidden_paths, branch_name, recommended_implementer, recommended_cursor_model, cursor_mode, needs_decision_packet, confidence, reason_short, prompt_for_cursor
- Enum-like values: task_class (A/B/C/D/E), risk_level (low/medium/high/blocked), recommended_implementer (cursor_force/claude_code/windsurf/human_gate/none), recommended_cursor_model (light/medium/strong/none), cursor_mode (force/propose/stop), confidence (high/medium/low)

### Task Class Mapping
- A. Routine docs-only: force candidate, branch required, low risk, light model
- B. Medium docs/workflow/wiki/routing: force candidate, branch required, medium model
- C. Delicate architecture: force candidate with human review before merge, strong model
- D. App code: STOP / human gate
- E. Runtime/deploy/tag/rollback/API/security: STOP / human gate

### Prompt Template Strategy
- System prompt: technical English, ZERO API policy, gate detection
- Compact context block: LLMS.md + current-state.md + token-efficiency.md excerpts
- Task block: task file content + metadata
- Rules block: classification rules, risk levels, implementer mapping
- Output schema block: JSON schema definition

### Qwen-Alina:14b Optional Future Profile
- Purpose: reduce repeated system prompt tokens, bake in stable Alina classifier rules, lower temperature, enforce JSON/classifier behavior
- Possible future Modelfile concept documented (illustrative only)
- Not created in this task
- Future profile creation requires separate explicit task
- Future profile must remain local-only and zero provider API

### Validation and Retry Rules
- Parse JSON, validate schema, validate enum values, validate paths, validate branch name, validate gate detection
- If JSON invalid: one retry with stricter prompt
- If still invalid: fallback to human triage
- If confidence low: fallback to human triage
- Never auto-authorize deploy/tag/rollback/runtime

### Integration with Cursor Force-Mode Bridge
- Wrapper output feeds 0135 Cursor bridge
- If can_force_execute = true and task_class = A/B/C within gate rules: Cursor bridge prepares branch and prompt
- If task_class = D/E or gates_required: stop and require Decision Packet/human gate
- Branch name must follow ai/<task-id>-<slug>
- No automatic merge ever

---

## Relationship with 0134 and 0135

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

### Task 0136 (This Task)
- Designs the local classifier wrapper that implements the Ollama qwen3:14b JSON router from 0135
- Designs the JSON schema compatible with 0135 Cursor bridge
- Designs the prompt template strategy
- Designs the optional future qwen-alina:14b profile
- Builds on the local HTTP API validation from 0134

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
| Wrapper writes stale classifier result | Timestamp check; overwrite only with explicit decision |

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

---

## Future Gates

### Before Wrapper Script Execution
- Optional wrapper script design (docs-only)
- Runtime-gated wrapper dry-run on saved task examples
- Runtime-gated n8n/local script integration

### Before Qwen-Alina Profile Creation
- Optional qwen-alina Modelfile design (docs-only)
- Runtime-gated qwen-alina local profile creation

### Before Cursor Bridge Integration
- Runtime-gated Cursor CLI force-mode feasibility (from 0135)

---

## No Runtime / No API / No Integration Confirmation

This design task is docs-only. No runtime was executed:

- No Ollama executed
- No Modelfile created
- No qwen-alina profile created
- No wrapper scripts executed
- No n8n runtime modified
- No provider API / API key / billing introduced
- No app source changes
- No deploy/tag/rollback
- No embeddings/vector DB created
- ZERO API policy remains intact

---

## Roadmap Stages

1. **Docs-only wrapper/profile design now** (this task 0136) — ✅ Completed
2. **Optional wrapper script design, docs-only** (future task)
3. **Optional qwen-alina Modelfile design, docs-only** (future task)
4. **Runtime-gated qwen-alina local profile creation** (future task)
5. **Runtime-gated wrapper dry-run on saved task examples** (future task)
6. **Runtime-gated n8n/local script integration** (future task)
7. **Integration with Cursor bridge after Cursor CLI feasibility** (future task, depends on 0135)
8. **No automatic merge until separately authorized** (permanent rule)

---

## Conclusion

The local classifier wrapper and qwen-alina profile design is now documented as the canonical design for the future local component that will sit between GitHub/n8n/local script and the Cursor force-mode bridge. The key design principles are:

- Wrapper is a future local component that calls Ollama locally and returns validated JSON
- qwen-alina:14b is an optional future local profile, not created now
- Wrapper does not implement tasks, does not modify files, and does not replace Cursor/Claude/Windsurf
- No n8n integration is performed now
- Local HTTP API with format=json, stream=false, think=false is the validated path from 0134
- CLI ollama run is NOT suitable for JSON strict automation
- ZERO API policy remains intact

**Prossimo passo raccomandato:** optional docs-only wrapper script design (stage 2), or optional docs-only qwen-alina Modelfile design (stage 3), or runtime-gated Cursor CLI force-mode feasibility (from 0135), depending on user preference.

---

**Session completed — docs-only design documented, no runtime executed, no integration authorized**
