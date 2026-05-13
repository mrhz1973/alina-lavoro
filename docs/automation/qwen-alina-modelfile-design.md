# Qwen-Alina Modelfile Design

**Date:** 2026-05-13  
**Task:** 0138-qwen-alina-modelfile-design  
**Type:** low-touch-loop-docs-only  
**Status:** completed (docs-only design)

---

## A. Executive Summary

This is the **canonical docs-only design** for the optional future qwen-alina:14b Modelfile profile. This profile is a local-only Ollama profile based on qwen3:14b, designed to support the Alina Lavoro low-touch/no-api/local-first architecture.

**Key principles:**
- This is a **docs-only design** — no actual Modelfile is created
- No `ollama create` is executed
- qwen-alina:14b is optional/future
- The profile should reduce repeated system prompt tokens and stabilize classifier behavior
- It must remain local-only and ZERO API
- It does not replace the wrapper script from 0137; it only optimizes the base model behavior

The profile is designed for:
- Local routing classifier
- Task risk scorer
- Prompt compressor
- Decision Packet draft helper
- LLMS/wiki summarizer
- Cursor bridge helper

The profile must NOT become:
- Autonomous implementer
- Replacement for Cursor / Claude Code / Windsurf
- Shell executor
- Deploy tool
- App modifier
- Unsupervised runner
- Source of truth

---

## B. Architecture Position

```
GitHub queue
→ local classifier wrapper script
→ Ollama model:
   - base: qwen3:14b
   - optional future profile: qwen-alina:14b
→ validated classifier JSON
→ Cursor force-mode bridge
→ dedicated branch
→ ChatGPT web post-check
→ human merge decision
```

**Clarifications:**
- qwen-alina is used by the wrapper only after explicit future gate
- qwen-alina is not an implementer
- qwen-alina does not execute shell, does not modify files, does not authorize gates
- GitHub is source of truth, not the profile

---

## C. Profile Purpose

### Allowed

The profile may:
- Reduce repeated system prompt tokens
- Bake in stable Alina classifier rules
- Set low temperature for deterministic output
- Reinforce JSON-only behavior
- Reinforce ZERO API policy
- Reinforce gate detection
- Reinforce LLMS-first routing
- Reinforce task class A/B/C/D/E
- Reduce prompt size passed by the wrapper

### Forbidden

The profile must NOT:
- Contain secrets
- Contain credentials
- Contain API keys
- Contain OAuth material
- Contain Google Sheet data
- Contain personal data
- Contain deploy/tag/rollback authorization
- Override human gates
- Execute actions

---

## D. Relationship to Qwen3:14b

### Base Model

- Base model: qwen3:14b
- qwen3:14b was validated in 0134
- qwen3:14b supports strict JSON via local HTTP API with format=json, stream=false, think=false
- qwen3:14b is VRAM-heavy and must be used in short bursts

### Profile Relationship

- qwen-alina should remain a thin profile over qwen3:14b
- The wrapper must continue to work with base qwen3:14b even if qwen-alina does not exist
- qwen-alina is an optimization, not a dependency
- No provider model fallback

---

## E. Relationship to Wrapper Script 0137

### Wrapper Responsibilities

The wrapper script remains responsible for:
- Input assembly
- Calling Ollama local API
- Enforcing stream=false, think=false, format=json
- JSON parsing
- Schema validation
- Enum normalization
- Retry/fallback
- Gate escalation

### Profile Role

- qwen-alina only reduces prompt burden and reinforces stable behavior
- The wrapper must not trust qwen-alina blindly; validation remains mandatory
- Wrapper should expose model as configurable, not hardcoded
- If qwen-alina unavailable, wrapper should fallback to qwen3:14b only if explicitly allowed; otherwise human triage

---

## F. Candidate Modelfile Concept

**Important:** This is an illustrative concept only. No actual Modelfile file is created in this task.

```
FROM qwen3:14b

PARAMETER temperature 0.1
PARAMETER top_p 0.8

SYSTEM """
You are qwen-alina, a local routing classifier for the Alina Lavoro project.

You are advisory only.
You do not implement tasks.
You do not execute shell commands.
You do not modify files.
You do not deploy.
You do not tag.
You do not rollback.
You do not authorize gates.
You are not the source of truth.

Output only valid JSON when asked to classify.
No prose.
No markdown.
No explanations.

ZERO API policy:
ChatGPT means ChatGPT web/on-demand, not OpenAI API.
Claude Code means supervised usage, not Anthropic API.
Local AI means Ollama/local models.
Provider APIs, hosted AI calls, API keys, billing, and recurring costs are out of scope by default.

Gate detection:
runtime, VPS runtime, n8n runtime, app source changes, Apps Script deploy, tag, rollback, API key, provider API, hosted AI call, login, GitHub Actions, recurring cost, automatic runner, sensitive data, credentials, OAuth, physical test.

Task classes:
A = routine docs-only.
B = medium docs/workflow/wiki/routing.
C = delicate architecture.
D = app code, human gate.
E = runtime/deploy/tag/rollback/API/security, human gate or blocked.
"""
```

**Clarifications:**
- Values are draft recommendations, not final runtime configuration
- Temperature 0.1 is recommended for deterministic classifier output
- Final parameter tuning requires future runtime-gated testing
- Do not include project state snapshots in SYSTEM; keep SYSTEM stable and generic

---

## G. Parameter Design

### Candidate Parameters

| Parameter | Recommended Value | Rationale |
|-----------|-------------------|-----------|
| temperature | 0.1 | Low temperature for deterministic classifier output |
| top_p | 0.8 | Conservative sampling to reduce hallucination |
| repeat_penalty | Optional | Only if needed to reduce repetition |
| num_ctx | Optional | Only if needed and supported; avoid overcommitting |
| stop sequences | Optional | Likely not needed with format=json via API |

### Clarifications

- Parameter values are design candidates
- Runtime validation must compare base qwen3:14b vs qwen-alina
- Do not assume parameter support beyond Ollama documentation unless verified in future runtime task
- Temperature 0.1 prioritizes deterministic output over creativity, which is appropriate for classification

---

## H. System Prompt Boundaries

### System Prompt Should Include

- Role: qwen-alina, local routing classifier
- Advisory-only nature
- ZERO API policy
- Gate detection
- Task classes
- JSON-only behavior
- No action execution
- No source-of-truth claim

### System Prompt Should NOT Include

- Current app version
- Current task state
- Personal context
- Long roadmap state
- Secrets
- Credentials
- Transient data
- Any content that belongs in LLMS/wiki/task input

### Reason

Current project state changes; it belongs in LLMS.md/wiki/task context, not static Modelfile SYSTEM. The SYSTEM prompt should remain stable and generic to avoid profile staleness.

---

## I. JSON Behavior Expectations

### API Call Configuration

- The profile should still be called through local HTTP API with:
  - stream=false
  - think=false
  - format=json
- The wrapper remains responsible for schema validation
- qwen-alina should not be called through CLI `ollama run` for automation
- JSON strict reliability must be re-tested after profile creation

### Behavior

- format=json via API is the primary JSON enforcement mechanism
- SYSTEM prompt reinforces JSON-only behavior
- Temperature 0.1 reduces variability in JSON output
- No prose, no markdown, no explanations in output

---

## J. Validation Plan for Future Qwen-Alina Creation

### Future Runtime-Gated Validation

Future validation should compare:
1. Base qwen3:14b
2. qwen-alina:14b

### Metrics

| Metric | Description |
|--------|-------------|
| Valid JSON rate | Percentage of valid JSON outputs on test set |
| Schema compliance | Percentage of outputs matching schema v1 |
| Enum stability | Consistency of enum values across runs |
| Gate detection recall | Ability to detect sensitive gates |
| Provider API blocking | Correct blocking of provider API tasks |
| Docs-only classification consistency | Consistency of A/B classification |
| Latency | Time to complete classification |
| VRAM use | Memory consumption during inference |
| Unload behavior | Ability to unload model after use |

### Minimum Acceptance

- JSON valid on repeated test set (≥95%)
- No missed provider API / API key / billing gates
- No missed deploy/tag/rollback/runtime gates
- No unsafe recommendation for D/E tasks
- Comparable or better behavior than base qwen3:14b

---

## K. Test Fixtures for Future Validation

### Fixture Categories

Design fixture categories:

1. **A routine docs-only task** — Safe, force candidate
2. **B medium workflow/wiki task** — Safe, force candidate
3. **C delicate architecture task** — Needs human review
4. **D app source task** — Human gate
5. **E provider API/n8n deploy task** — Blocked
6. **Invalid/malformed task metadata** — Fallback to human triage
7. **Prompt injection attempt** — Should not execute actions
8. **Task with contradictory allowed/forbidden paths** — Fallback to human triage
9. **Task mentioning API only to forbid it** — Should classify as blocked
10. **Task mentioning local Ollama API** — Should classify as safe (local-only)

**Note:** Do not create actual fixture files now unless they are documented as examples inside the design document only.

---

## L. Runtime Gate for Actual Profile Creation

### Before Creating Qwen-Alina

- Explicit user gate required
- Command must be reviewed before execution
- Actual Modelfile path must be defined
- Output profile name must be confirmed
- Base model qwen3:14b must be present
- No provider API
- No API key
- No billing
- No n8n integration
- No script execution beyond profile creation task scope

### Future Command Shape

```bash
ollama create qwen-alina:14b -f <Modelfile path>
```

**Clarifications:**
- Not executed now
- Only valid in future runtime-gated task
- Must be followed by validation tests
- Must be followed by unload confirmation if model is loaded

---

## M. Future Command Shape

### Conceptual Future Command

```bash
ollama create qwen-alina:14b -f <Modelfile path>
```

### Follow-Up Steps (Future Runtime-Gated)

1. Validate profile creation succeeded
2. Run fixture tests against qwen-alina:14b
3. Compare results with base qwen3:14b
4. If qwen-alina passes, update wrapper default model
5. If qwen-alina fails, delete profile and return to base qwen3:14b
6. Unload model if loaded to free VRAM

---

## N. Integration with Local Classifier Wrapper

### Wrapper Model Configuration

- Future wrapper may default to qwen3:14b first
- Future wrapper may accept `--model qwen-alina:14b`
- Wrapper should expose model as configurable, not hardcoded
- If qwen-alina unavailable, wrapper should fallback to qwen3:14b only if explicitly allowed; otherwise human triage
- No provider model fallback

### Wrapper Behavior

- Input assembly unchanged
- Ollama API call unchanged (stream=false, think=false, format=json)
- JSON validation unchanged
- Schema enforcement unchanged
- Enum normalization unchanged
- Retry/fallback unchanged
- Gate escalation unchanged

---

## O. Integration with N8N

### Future Integration

- n8n may eventually call wrapper with model qwen-alina:14b
- n8n integration remains future runtime-gated
- n8n must not call provider AI APIs
- qwen-alina does not change n8n security model

### This Task

- n8n runtime integration is not part of this task
- No n8n workflow modifications
- No n8n runtime changes

---

## P. Integration with Cursor Force-Mode Bridge

### Bridge Behavior

- qwen-alina may improve classification and prompt compression for Cursor bridge
- qwen-alina must not directly call Cursor
- Cursor execution remains controlled by bridge rules from 0135
- Branch, checks, commit/push branch, and human merge remain unchanged

### No Automatic Merge

- No automatic merge ever (permanent rule from 0135)
- Merge to main remains human decision
- Human merge decision only after ChatGPT web post-check

---

## Q. Security and Privacy

### Local-Only Inference

- Localhost only
- No data sent outside localhost
- No hosted AI calls
- ZERO API policy remains intact

### No Sensitive Data

- No provider API
- No API keys
- No credentials
- No OAuth
- No sensitive raw URLs
- No Google Sheet data
- No personal data
- No app data
- No PROJECT_STATE/CHECKPOINT baked into Modelfile
- No secrets in SYSTEM prompt

---

## R. Failure Modes

### Identified Failure Modes

| Failure Mode | Mitigation |
|--------------|------------|
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

---

## S. Fallbacks

### Fallback Options

- Use base qwen3:14b
- Manual ChatGPT triage
- Claude Code manual prompt
- Windsurf manual prompt
- Cursor UI manual execution
- No force execution
- No merge
- Delete broken profile in future runtime task if needed
- Return to current manual-supervised flow

### Fallback Triggers

- qwen-alina validation fails
- qwen-alina produces worse results than base qwen3:14b
- qwen-alina misses critical gates
- qwen-alina produces unsafe recommendations
- qwen-alina profile creation fails
- qwen-alina profile becomes corrupted

---

## T. Future Roadmap

### Stages

1. **Docs-only Modelfile design now** (this task 0138) — ✅ Completed
2. **Runtime-gated creation of actual Modelfile/profile** (future task)
3. **Runtime-gated validation against fixture tasks** (future task)
4. **Compare qwen3:14b vs qwen-alina:14b** (future task)
5. **Update wrapper default model only if qwen-alina passes** (future task)
6. **Optional n8n/local script integration** (future task)
7. **Cursor bridge integration only after Cursor CLI feasibility** (future task, depends on 0135)
8. **No automatic merge ever** (permanent rule)

### Dependencies

- Stage 2: requires explicit manual gate before runtime execution
- Stage 3: requires stage 2 completion
- Stage 4: requires stage 3 completion
- Stage 5: requires stage 4 completion and qwen-alina validation passing
- Stage 6: requires stage 5 completion
- Stage 7: requires 0135 Cursor CLI feasibility gate completion
- Stage 8: permanent rule, never changes

---

## Conclusione

This design formalizes the optional future qwen-alina:14b Modelfile profile. The key design principles are:

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

**Qwen-Alina Modelfile Design completato — task 0138 docs-only**
