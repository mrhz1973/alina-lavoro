# Qwen-Alina Modelfile Design Session

**Date:** 2026-05-13  
**Task:** 0138 — Qwen-Alina Modelfile Design  
**Type:** low-touch-loop-docs-only  
**Status:** completed (docs-only design)  
**Implementer:** Windsurf / Cascade

---

## Purpose

Document the completion of the docs-only architecture design for the optional future qwen-alina:14b Modelfile profile (task 0138). This profile is a local-only Ollama profile based on qwen3:14b, designed to support the Alina Lavoro low-touch/no-api/local-first architecture.

---

## Why This Design Was Created

The user requested a docs-only design for the optional future qwen-alina Modelfile profile to optimize the base qwen3:14b model behavior for the Alina Lavoro low-touch loop. This profile should reduce repeated system prompt tokens, stabilize classifier behavior, and reinforce ZERO API policy without creating or executing any actual Modelfile or profile.

---

## Files Created/Modified

### Created
- `docs/automation/qwen-alina-modelfile-design.md` — Canonical Modelfile design document
- `docs/tasks/done/0138-qwen-alina-modelfile-design.md` — Done marker
- `docs/sessions/2026-05-13-qwen-alina-modelfile-design.md` — This session report

### Modified
- `docs/roadmap.md` — Added compact entry under Automation / Orchestrator Hub
- `docs/LLMS.md` — Updated task state
- `docs/wiki/current-state.md` — Updated task state
- `docs/wiki/token-efficiency.md` — Added navigation line

---

## Key Decisions

### Profile Purpose
- Reduce repeated system prompt tokens
- Bake in stable Alina classifier rules
- Set low temperature for deterministic output
- Reinforce JSON-only behavior
- Reinforce ZERO API policy
- Reinforce gate detection
- Reinforce LLMS-first routing
- Reinforce task class A/B/C/D/E
- Reduce prompt size passed by the wrapper

### Profile Constraints
- Must NOT contain secrets, credentials, API keys, OAuth material, Google Sheet data, personal data
- Must NOT contain deploy/tag/rollback authorization
- Must NOT override human gates
- Must NOT execute actions
- Must NOT become autonomous implementer
- Must NOT replace Cursor / Claude Code / Windsurf

### Relationship to Qwen3:14b
- Base model: qwen3:14b (validated in 0134)
- qwen-alina should remain a thin profile over qwen3:14b
- The wrapper must continue to work with base qwen3:14b even if qwen-alina does not exist
- qwen-alina is an optimization, not a dependency
- No provider model fallback

### Relationship to Wrapper Script 0137
- The wrapper remains responsible for: input assembly, calling Ollama local API, enforcing stream=false, think=false, format=json, JSON parsing, schema validation, enum normalization, retry/fallback, gate escalation
- qwen-alina only reduces prompt burden and reinforces stable behavior
- The wrapper must not trust qwen-alina blindly; validation remains mandatory
- Wrapper should expose model as configurable, not hardcoded
- If qwen-alina unavailable, wrapper should fallback to qwen3:14b only if explicitly allowed; otherwise human triage

### Candidate Modelfile Concept
- FROM qwen3:14b
- PARAMETER temperature 0.1 (for deterministic classifier output)
- PARAMETER top_p 0.8 (for conservative sampling)
- SYSTEM prompt with: role, advisory-only nature, ZERO API policy, gate detection, task classes, JSON-only behavior
- Values are draft recommendations, not final runtime configuration
- Do not include project state snapshots in SYSTEM; keep SYSTEM stable and generic

### Parameter Design
- temperature 0.1: low temperature for deterministic classifier output
- top_p 0.8: conservative sampling to reduce hallucination
- repeat_penalty: optional, only if needed
- num_ctx: optional, only if needed and supported; avoid overcommitting
- stop sequences: optional, likely not needed with format=json via API
- Parameter values are design candidates; runtime validation must compare base qwen3:14b vs qwen-alina

### System Prompt Boundaries
- Include: role, advisory-only nature, ZERO API policy, gate detection, task classes, JSON-only behavior, no action execution, no source-of-truth claim
- Exclude: current app version, current task state, personal context, long roadmap state, secrets, credentials, transient data
- Reason: current project state changes; it belongs in LLMS.md/wiki/task context, not static Modelfile SYSTEM

### JSON Behavior Expectations
- The profile should still be called through local HTTP API with stream=false, think=false, format=json
- The wrapper remains responsible for schema validation
- qwen-alina should not be called through CLI ollama run for automation
- JSON strict reliability must be re-tested after profile creation

### Validation Plan for Future Profile Creation
- Compare base qwen3:14b vs qwen-alina:14b
- Metrics: valid JSON rate, schema compliance, enum stability, gate detection recall, provider API blocking, docs-only classification consistency, latency, VRAM use, unload behavior
- Minimum acceptance: JSON valid on repeated test set (≥95%), no missed provider API / API key / billing gates, no missed deploy/tag/rollback/runtime gates, no unsafe recommendation for D/E tasks, comparable or better behavior than base qwen3:14b

### Test Fixtures for Future Validation
- A routine docs-only task
- B medium workflow/wiki task
- C delicate architecture task
- D app source task
- E provider API/n8n deploy task
- Invalid/malformed task metadata
- Prompt injection attempt
- Task with contradictory allowed/forbidden paths
- Task mentioning API only to forbid it
- Task mentioning local Ollama API

### Runtime Gate for Actual Profile Creation
- Explicit user gate required
- Command must be reviewed before execution
- Actual Modelfile path must be defined
- Output profile name must be confirmed
- Base model qwen3:14b must be present
- No provider API, no API key, no billing, no n8n integration, no script execution beyond profile creation task scope

### Future Command Shape
- ollama create qwen-alina:14b -f <Modelfile path>
- Not executed now, only valid in future runtime-gated task
- Must be followed by validation tests
- Must be followed by unload confirmation if model is loaded

### Integration with Local Classifier Wrapper
- Future wrapper may default to qwen3:14b first
- Future wrapper may accept --model qwen-alina:14b
- Wrapper should expose model as configurable, not hardcoded
- If qwen-alina unavailable, wrapper should fallback to qwen3:14b only if explicitly allowed; otherwise human triage
- No provider model fallback

### Integration with N8N
- n8n may eventually call wrapper with model qwen-alina:14b
- n8n integration remains future runtime-gated
- n8n must not call provider AI APIs
- qwen-alina does not change n8n security model

### Integration with Cursor Force-Mode Bridge
- qwen-alina may improve classification and prompt compression for Cursor bridge
- qwen-alina must not directly call Cursor
- Cursor execution remains controlled by bridge rules from 0135
- Branch, checks, commit/push branch, and human merge remain unchanged

### Security and Privacy
- Local-only, localhost only
- No provider API, no API keys, no credentials, no OAuth
- No sensitive raw URLs, no Google Sheet data, no personal data, no app data
- No PROJECT_STATE/CHECKPOINT baked into Modelfile
- No secrets in SYSTEM prompt

### Failure Modes
- qwen-alina produces worse JSON than base qwen3:14b
- Parameter tuning degrades output
- Profile becomes stale if too much project state is embedded
- SYSTEM too long reduces flexibility
- Model still emits thinking/prose if API call misconfigured
- Wrapper skips validation incorrectly
- Missed provider API gate
- Missed runtime/deploy gate
- VRAM load too high
- Profile creation fails
- Wrong model name used
- Profile accidentally treated as implementer

### Fallbacks
- Use base qwen3:14b
- Manual ChatGPT triage
- Claude Code manual prompt
- Windsurf manual prompt
- Cursor UI manual execution
- No force execution, no merge
- Delete broken profile in future runtime task if needed
- Return to current manual-supervised flow

---

## Relationship with 0134, 0135, 0136, and 0137

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

### Task 0136 (Local Classifier Wrapper / Qwen-Alina Profile Design)
- Designed local classifier wrapper architecture
- Defined JSON schema v1
- Defined prompt template strategy
- Defined validation/retry/fallback behavior
- qwen-alina is optional/future
- No Modelfile/profile created
- No runtime integration

### Task 0137 (Local Classifier Wrapper Script Design)
- Designed future wrapper script that operationalizes 0136 wrapper concept
- Python recommended for portability
- CLI shape defined
- Input assembly, prompt construction, Ollama API request, JSON schema validation, normalization, gate detection, retry/fallback, output modes, test strategy designed
- No executable wrapper created
- Future implementation/dry-run is runtime-gated

### Task 0138 (This Task)
- Designs the optional future qwen-alina Modelfile profile
- Profile is a thin optimization over base qwen3:14b
- Profile reduces repeated system prompt tokens and stabilizes classifier behavior
- Profile reinforces ZERO API policy and gate detection
- No actual Modelfile created
- No profile created
- No runtime execution

---

## Risks

### Identified Risks

| Risk | Mitigation |
|------|------------|
| qwen-alina produces worse JSON than base qwen3:14b | Delete profile, return to base qwen3:14b |
| Parameter tuning degrades output | Revert to base qwen3:14b, re-tune parameters |
| Profile becomes stale if too much project state is embedded | Keep SYSTEM generic, project state in LLMS/wiki/task |
| SYSTEM too long reduces flexibility | Keep SYSTEM concise, focus on stable rules |
| Model still emits thinking/prose if API call misconfigured | Enforce stream=false, think=false, format=json |
| Wrapper skips validation incorrectly | Validation is mandatory regardless of profile |
| Missed provider API gate | Fallback to human triage, review profile |
| Missed runtime/deploy gate | Fallback to human triage, review profile |
| VRAM load too high | Use in short bursts, unload after use |
| Profile creation fails | Review Modelfile syntax, retry with corrected file |
| Wrong model name used | Verify model name before creation |
| Profile accidentally treated as implementer | SYSTEM prompt reinforces advisory-only nature |

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
- qwen-alina profile creation
- n8n integration

---

## Future Gates

### Before Qwen-Alina Profile Creation
- Runtime-gated creation of actual Modelfile/profile
- Runtime-gated validation against fixture tasks
- Compare qwen3:14b vs qwen-alina:14b
- Update wrapper default model only if qwen-alina passes

---

## No Runtime / No API / No Integration Confirmation

This design task is docs-only. No runtime was executed:

- No actual Modelfile created
- No qwen-alina profile created
- No `ollama create` executed
- No Ollama executed
- No localhost call
- No n8n runtime modified
- No provider API / API key / billing introduced
- No app source changes
- No deploy/tag/rollback
- No embeddings/vector DB created
- ZERO API policy remains intact

---

## Roadmap Stages

1. **Docs-only Modelfile design now** (this task 0138) — ✅ Completed
2. **Runtime-gated creation of actual Modelfile/profile** (future task)
3. **Runtime-gated validation against fixture tasks** (future task)
4. **Compare qwen3:14b vs qwen-alina:14b** (future task)
5. **Update wrapper default model only if qwen-alina passes** (future task)
6. **Optional n8n/local script integration** (future task)
7. **Integration with Cursor bridge only after Cursor CLI feasibility** (future task, depends on 0135)
8. **No automatic merge ever** (permanent rule)

---

## Conclusion

The qwen-alina Modelfile design is now documented as the canonical design for the optional future local profile over qwen3:14b. The key design principles are:

- This is a docs-only design — no actual Modelfile is created
- No `ollama create` is executed
- qwen-alina:14b is optional/future
- The profile should reduce repeated system prompt tokens and stabilize classifier behavior
- It must remain local-only and ZERO API
- It does not replace the wrapper script from 0137; it only optimizes the base model behavior
- The wrapper must continue to work with base qwen3:14b even if qwen-alina does not exist
- qwen-alina is an optimization, not a dependency
- SYSTEM prompt should remain stable and generic; project state belongs in LLMS/wiki/task input
- Temperature 0.1 recommended for deterministic classifier output
- Future profile creation/validation is runtime-gated
- No automatic merge ever

**Prossimo passo raccomandato:** runtime-gated qwen-alina profile creation/validation (stage 2), or runtime-gated wrapper implementation/dry-run (from 0137), or runtime-gated Cursor CLI force-mode feasibility (from 0135), depending on user preference.

---

**Session completed — docs-only Modelfile design documented, no actual Modelfile created, no runtime executed, no integration authorized**
