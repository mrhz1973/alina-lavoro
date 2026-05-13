# Local Classifier Wrapper and Qwen-Alina Profile Design

**Date:** 2026-05-13  
**Task:** 0136-local-classifier-wrapper-qwen-alina-profile-design  
**Type:** low-touch-loop-docs-only  
**Status:** completed (docs-only design)

---

## A. Executive Summary

This is the **canonical docs-only design** for the future local classifier wrapper and optional qwen-alina:14b profile. This design builds on:

- **Task 0134** — Windows Ollama Local Preflight: Ollama 0.23.2 + qwen3:14b validated locally; JSON strict works via local HTTP API with format=json, stream=false, think=false; CLI `ollama run` is NOT reliable for JSON strict automation; qwen3:14b is VRAM-heavy and must be used in short bursts; no n8n integration yet; ZERO API intact
- **Task 0135** — Cursor CLI Force-Mode Implementer Bridge Design: architecture target is GitHub queue → n8n/local script → Ollama qwen3:14b JSON router → Cursor force-mode → dedicated branch → ChatGPT web post-check → human merge; Cursor force-mode is target; branch pattern ai/<task-id>-<slug>; no automatic merge; ChatGPT web post-check is on-demand and no-API

**Key design principles:**
- This is a **docs-only design** — no runtime execution in this task
- The wrapper is a **future local component** that calls Ollama locally and returns validated JSON
- qwen-alina:14b is an **optional future local profile**, not created now
- The wrapper does **not implement tasks**, does **not modify files**, and does **not replace Cursor/Claude/Windsurf**
- No n8n integration is performed now
- No provider API, no API keys, no billing, no recurring costs
- ZERO API policy remains intact

---

## B. Architecture Position

The wrapper sits between GitHub/n8n/local script and the Cursor force-mode bridge:

```
GitHub queue
→ n8n or local script
→ local classifier wrapper
→ Ollama qwen3:14b or future qwen-alina:14b
→ validated JSON routing decision
→ Cursor force-mode bridge
→ dedicated branch (ai/<task-id>-<slug>)
→ checks
→ commit/push branch
→ ChatGPT web post-check (on-demand, no-API)
→ human merge decision
```

**Wrapper position in the stack:**
- Input: LLMS.md + wiki/current-state.md + token-efficiency.md + task file
- Processing: compact input assembly → Ollama local HTTP API call → JSON validation → schema enforcement
- Output: validated JSON classification + compressed prompt for Cursor
- Consumer: Cursor force-mode bridge (from 0135)

---

## C. Wrapper Responsibilities

### Allowed

The wrapper may:
- Assemble compact input from LLMS.md + current-state.md + token-efficiency.md + task file
- Sanitize/compact task input to ≤6–10k characters
- Call local Ollama HTTP API (localhost:11434/api/generate)
- Force stream=false, think=false, format=json
- Validate JSON output
- Enforce schema with enum-like values
- Normalize enum values
- Reject malformed output
- Retry once with stricter prompt if output invalid
- Write or return a classification result
- Never authorize sensitive gates by itself

### Forbidden

The wrapper must NOT:
- Modify repo files directly unless a future task explicitly designs a file-output mode
- Execute shell actions
- Start Cursor directly in this design
- Deploy/tag/rollback
- Call provider APIs
- Use API keys
- Read PROJECT_STATE.md by default
- Send data outside localhost
- Become source of truth
- Replace Cursor/Claude/Windsurf as implementer
- Implement tasks autonomously

---

## D. Recommended Local API Call Shape

### Future Conceptual Call

```
POST http://localhost:11434/api/generate
Content-Type: application/json

{
  "model": "qwen3:14b",
  "stream": false,
  "think": false,
  "format": "json",
  "prompt": "compact system + LLMS/wiki/task context"
}
```

### Clarifications

- This is **local-only** — localhost:11434 only
- This is **not OpenAI API**, not Anthropic API, not OpenRouter, not any provider API
- It must remain localhost/local network only unless a future explicit gate says otherwise
- CLI `ollama run` must **not** be used for strict JSON automation because task 0134 found malformed/duplicated JSON via CLI
- Local HTTP API with format=json, stream=false, think=false is the validated path from 0134

### Parameters

| Parameter | Value | Reason |
|-----------|-------|--------|
| model | qwen3:14b (initially) | Validated in 0134; future qwen-alina:14b optional |
| stream | false | Prevents streaming artifacts; ensures single JSON response |
| think | false | Prevents thinking text in output; ensures clean JSON |
| format | json | Forces JSON output; validated in 0134 |
| prompt | compact system + context | ≤6–10k characters; LLMS-first routing |

---

## E. JSON Schema v1

### Strict Schema Compatible with 0135 Cursor Bridge

```json
{
  "schema_version": "1",
  "task_id": "0136",
  "slug": "local-classifier-wrapper-qwen-alina-profile-design",
  "task_title": "Local classifier wrapper and qwen-alina profile design",
  "task_class": "A",
  "risk_level": "low",
  "needs_human_gate": false,
  "gates_required": [],
  "can_force_execute": true,
  "allowed_paths": [
    "docs/automation/",
    "docs/tasks/done/",
    "docs/sessions/",
    "docs/roadmap.md",
    "docs/LLMS.md",
    "docs/wiki/current-state.md"
  ],
  "forbidden_paths": [
    "src/**",
    "gas-current/**",
    ".gas/**",
    "appsscript.json",
    "package.json"
  ],
  "branch_name": "ai/0136-local-classifier-wrapper-qwen-alina-profile-design",
  "recommended_implementer": "cursor_force",
  "recommended_cursor_model": "light",
  "cursor_mode": "force",
  "needs_decision_packet": false,
  "confidence": "high",
  "reason_short": "Docs-only architecture design, no runtime, no app changes, no deploy, no API.",
  "prompt_for_cursor": "Compact prompt for Cursor..."
}
```

### Field Definitions with Enum-Like Values

| Field | Type | Enum/Values | Description |
|-------|------|-------------|-------------|
| schema_version | string | "1" | Schema version identifier |
| task_id | string | — | Task ID from queue |
| slug | string | — | Task slug |
| task_title | string | — | Task title |
| task_class | enum | A | B | C | D | E | Task class (see section F) |
| risk_level | enum | low | medium | high | blocked | Risk level |
| needs_human_gate | bool | true | false | Whether human gate is required |
| gates_required | list | — | List of gate names required |
| can_force_execute | bool | true | false | Whether force-mode execution is allowed |
| allowed_paths | list | — | Paths allowed to modify |
| forbidden_paths | list | — | Paths forbidden to modify |
| branch_name | string | — | Dedicated branch name (pattern: ai/<task-id>-<slug>) |
| recommended_implementer | enum | cursor_force | claude_code | windsurf | human_gate | none | Recommended implementer |
| recommended_cursor_model | enum | light | medium | strong | none | Cursor model level |
| cursor_mode | enum | force | propose | stop | Cursor execution mode |
| needs_decision_packet | bool | true | false | Whether Decision Packet is needed |
| confidence | enum | high | medium | low | Confidence in classification |
| reason_short | string | — | Short reason for classification |
| prompt_for_cursor | string | — | Compressed prompt for Cursor |

---

## F. Task Class Mapping

Reuse 0135 classes with wrapper behavior:

| Class | Description | Wrapper Behavior |
|-------|-------------|------------------|
| **A. Routine docs-only** | Simple documentation tasks, low complexity | Force candidate, branch required, low risk, light model, no human gate |
| **B. Medium docs / workflow / wiki / routing** | Moderate complexity, requires understanding of automation patterns | Force candidate, branch required, medium model, no human gate |
| **C. Delicate architecture** | High complexity, requires deep reasoning and architectural judgment | Force candidate only with human review before merge, strong model, human gate before merge |
| **D. App code** | Alina app source changes | STOP / human gate, no force execution |
| **E. Runtime / deploy / tag / rollback / API / security** | Sensitive operations | STOP / human gate, no force execution |

### Wrapper Decision Logic

- If task_class = A/B and risk_level = low/medium and no gates_required: can_force_execute = true
- If task_class = C: can_force_execute = true but needs_human_gate = true (review before merge)
- If task_class = D/E: can_force_execute = false, needs_human_gate = true, recommended_implementer = human_gate
- If risk_level = blocked: can_force_execute = false, needs_human_gate = true, recommended_implementer = human_gate
- If gates_required is non-empty: needs_human_gate = true

---

## G. Prompt Template Strategy

### System Prompt

```
You are a local routing classifier for the Alina Lavoro project. Your role is to classify tasks and recommend implementers. You do NOT implement tasks, do NOT modify files, and do NOT replace Cursor/Claude/Windsurf.

Output ONLY valid JSON. No prose. No markdown. No explanation.

ZERO API policy: ChatGPT = web/on-demand, Claude Code = supervised usage, Local AI = Ollama/local models. Provider APIs / hosted AI calls / API keys / billing / recurring costs are out of scope by default.

Gate detection: runtime, VPS runtime, n8n runtime, Alina app changes, Apps Script deploy, tag, rollback, API key, login, GitHub Actions, new recurring costs, automatic runner, sensitive data/credentials, real physical test.
```

### Compact Context Block

```
Current state from docs/LLMS.md:
[compact LLMS.md excerpt, ≤1k chars]

Current state from docs/wiki/current-state.md:
[compact current-state.md excerpt, ≤1k chars]

Navigation rules from docs/wiki/token-efficiency.md:
[compact token-efficiency.md excerpt, ≤500 chars]
```

### Task Block

```
Task to classify:
[task file content, ≤2k chars]

Task metadata:
- task_id: [task_id]
- slug: [slug]
- allowed_paths: [list]
- forbidden_paths: [list]
- gates_required: [list]
```

### Rules Block

```
Classification rules:
- A. Routine docs-only: force candidate, branch required, low risk, light model
- B. Medium docs/workflow/wiki/routing: force candidate, branch required, medium model
- C. Delicate architecture: force candidate with human review before merge, strong model
- D. App code: STOP / human gate
- E. Runtime/deploy/tag/rollback/API/security: STOP / human gate

Risk levels:
- low: docs-only, no runtime, no app changes, no deploy, no API
- medium: workflow/wiki/routing, no runtime, no app changes, no deploy, no API
- high: architecture decisions, requires human review
- blocked: provider API, API key, billing, n8n runtime, deploy automation

Implementer mapping:
- cursor_force: Cursor CLI force-mode (target for A/B/C)
- claude_code: Claude Code supervised usage
- windsurf: Windsurf/Cascade supervised usage
- human_gate: requires human decision
- none: no implementer needed (pure docs-only candidate)
```

### Output Schema Block

```
Output JSON schema:
{
  "schema_version": "1",
  "task_id": "...",
  "slug": "...",
  "task_title": "...",
  "task_class": "A|B|C|D|E",
  "risk_level": "low|medium|high|blocked",
  "needs_human_gate": true|false,
  "gates_required": [],
  "can_force_execute": true|false,
  "allowed_paths": [],
  "forbidden_paths": [],
  "branch_name": "ai/<task-id>-<slug>",
  "recommended_implementer": "cursor_force|claude_code|windsurf|human_gate|none",
  "recommended_cursor_model": "light|medium|strong|none",
  "cursor_mode": "force|propose|stop",
  "needs_decision_packet": true|false,
  "confidence": "high|medium|low",
  "reason_short": "...",
  "prompt_for_cursor": "..."
}
```

### Language Policy

- Internal classifier prompts use **technical English** (per AI_RULES.md)
- Final user-facing output remains Italian
- Avoid duplicated bilingual blocks
- No PROJECT_STATE/CHECKPOINT by default

---

## H. Qwen-Alina:14b Optional Future Profile

### Profile Purpose (Future, Not Created Now)

The qwen-alina:14b profile is an **optional future local profile** designed to:
- Reduce repeated system prompt tokens
- Bake in stable Alina classifier rules
- Lower temperature for more deterministic output
- Enforce JSON/classifier behavior
- Keep qwen3:14b as base model

### Possible Future Modelfile Concept (Illustrative Only)

This is **documentation only**. Do NOT create the actual Modelfile in this task.

```
FROM qwen3:14b
PARAMETER temperature 0.1
SYSTEM You are a local routing classifier for the Alina Lavoro project. Output ONLY valid JSON. No prose. ZERO API policy. Gate detection: runtime, VPS runtime, n8n runtime, Alina app changes, Apps Script deploy, tag, rollback, API key, login, GitHub Actions, new recurring costs, automatic runner, sensitive data/credentials, real physical test.
```

### Important Constraints

- This task must **not** create the actual Modelfile
- This task must **not** create qwen-alina:14b
- Future profile creation requires a **separate explicit task**
- Future profile must remain **local-only** and **zero provider API**
- Future profile must not introduce API keys, billing, or recurring costs

---

## I. Validation and Retry Rules

### Validation Steps

1. **Parse JSON** — attempt to parse response as JSON
2. **Validate schema** — check all required fields exist
3. **Validate enum values** — check task_class, risk_level, recommended_implementer, recommended_cursor_model, cursor_mode, confidence are valid enum values
4. **Validate paths** — check allowed_paths and forbidden_paths are reasonable
5. **Validate branch name** — check branch_name follows pattern ai/<task-id>-<slug>
6. **Validate gate detection** — check if gates_required includes sensitive gates correctly

### Retry Logic

- If JSON invalid: **one retry** with stricter prompt emphasizing JSON-only output
- If still invalid after retry: **fallback to human triage**
- If confidence = low: **fallback to human triage**
- If any forbidden gate appears (provider API, API key, billing): classify as E/blocked
- If any provider API / API key / billing appears in output: blocked
- If app source changes appear: human gate (task_class = D)
- If output contradicts task metadata: human triage
- Never auto-authorize deploy/tag/rollback/runtime

### Fallback to Human Triage

If validation fails or confidence is low:
- Return error or null classification
- Require manual ChatGPT triage
- Do not proceed with automatic routing

---

## J. Output Handling

### Possible Future Output Modes

1. **Return JSON to caller only** — simplest mode; caller decides what to do with result
2. **Write classifier result to docs/tasks/processing/<task-id>-classifier-result.json** — file-based mode for audit trail
3. **Include classifier result in automation session** — embed in session report
4. **Feed prompt_for_cursor into Cursor bridge** — direct integration with 0135 bridge

### File-Write Mode (Future, Not Implemented Now)

If file-write mode is implemented in a future task:
- Write to `docs/tasks/processing/<task-id>-classifier-result.json`
- Include timestamp, schema_version, model used, confidence
- Do not overwrite existing results without explicit decision
- Clean up processing files after task completion

### Cursor Bridge Integration

The prompt_for_cursor field is designed to feed directly into the Cursor force-mode bridge (0135):
- If can_force_execute = true and task_class = A/B/C within gate rules: Cursor bridge prepares branch and prompt
- If task_class = D/E or gates_required: stop and require Decision Packet/human gate
- branch_name must follow ai/<task-id>-<slug>
- No automatic merge ever

---

## K. Integration with Cursor Force-Mode Bridge

### Bridge Input

The wrapper output feeds the 0135 Cursor force-mode bridge:

| Wrapper Output | Bridge Behavior |
|----------------|-----------------|
| can_force_execute = true, task_class = A/B/C, no gates | Prepare branch, execute Cursor force-mode |
| can_force_execute = true, task_class = C, needs_human_gate = true | Prepare branch, execute Cursor force-mode, require human review before merge |
| can_force_execute = false, task_class = D/E | STOP, require Decision Packet/human gate |
| gates_required non-empty | STOP, require Decision Packet/human gate |
| risk_level = blocked | STOP, require Decision Packet/human gate |

### Branch Name Pattern

- Must follow: `ai/<task-id>-<slug>`
- Example: `ai/0136-local-classifier-wrapper-qwen-alina-profile-design`
- No automatic merge to main

### No Automatic Merge

- Merge to main remains human decision
- Human merge decision only after ChatGPT web post-check
- This is a permanent rule from 0135

---

## L. Failure Modes

| Failure | Detection | Mitigation |
|---------|-----------|------------|
| Malformed JSON | JSON parse fails | Retry once with stricter prompt; fallback to human triage |
| Duplicated JSON (CLI artifact) | JSON parse fails | Use local HTTP API only; do not use CLI ollama run |
| Wrong enum values | Schema validation fails | Fallback to human triage |
| Hallucinated allowed paths | Path validation fails | Fallback to human triage |
| Misses API/deploy/runtime gate | Gate detection fails | Fallback to human triage; update prompt |
| Stale LLMS/wiki context | Timestamp check | Refresh context; fallback to human triage |
| Prompt injection in task file | Input sanitization | Reject task; manual review |
| qwen3:14b VRAM load too high | nvidia-smi check | Use in short bursts only; unload after use |
| Ollama not running | HTTP connection fails | Fallback to human triage |
| Local API unavailable | HTTP connection fails | Fallback to human triage |
| n8n/script passes too much context | Input size check | Truncate to ≤6–10k characters |
| Wrapper writes stale classifier result | Timestamp check | Overwrite only with explicit decision |

---

## M. Fallbacks

### Manual Fallbacks

- Manual ChatGPT triage
- Claude Code manual prompt
- Windsurf/Cascade manual prompt
- Cursor UI manual execution
- No force execution
- No merge
- Delete branch if created by later runtime task
- Return to current manual-supervised flow

### Fallback Triggers

- Ollama not running or local API unavailable
- JSON validation fails after retry
- Confidence = low
- task_class = D/E
- gates_required non-empty
- risk_level = blocked
- Any provider API / API key / billing detected

---

## N. Security and Privacy

### No Provider API

- No provider API
- No API keys
- No credentials
- No sensitive raw URLs
- No OAuth material
- No Google Sheet data
- No user personal data unless future gate explicitly allows

### Local-Only Inference

- Local-only inference
- localhost only by default
- No data sent outside localhost
- No hosted AI calls

### ZERO API Policy

- ZERO API policy remains intact
- ChatGPT = web/on-demand orchestration, not OpenAI API
- Claude Code = supervised usage, not Anthropic API
- Local AI = Ollama/local models

---

## O. Future Roadmap

### Stages

1. **Docs-only wrapper/profile design now** (this task 0136) — ✅ Completed
2. **Optional wrapper script design, docs-only** (future task) — design the actual wrapper script structure
3. **Optional qwen-alina Modelfile design, docs-only** (future task) — design the Modelfile content
4. **Runtime-gated qwen-alina local profile creation** (future task) — create the actual profile with ollama create
5. **Runtime-gated wrapper dry-run on saved task examples** (future task) — test wrapper on historical tasks
6. **Runtime-gated n8n/local script integration** (future task) — integrate wrapper with n8n or local script
7. **Integration with Cursor bridge after Cursor CLI feasibility** (future task) — depends on 0135 Cursor CLI feasibility gate
8. **No automatic merge until separately authorized** (permanent rule)

### Dependencies

- Stage 2–3: docs-only, can proceed independently
- Stage 4: requires explicit manual gate before runtime execution
- Stage 5: requires stage 4 completion
- Stage 6: requires stage 5 completion
- Stage 7: requires 0135 Cursor CLI feasibility gate completion
- Stage 8: permanent rule, never changes

---

## Conclusione

This design formalizes the local classifier wrapper and optional qwen-alina:14b profile as future components in the low-touch/no-api/local-first architecture. The key design principles are:

- Wrapper is a future local component that calls Ollama locally and returns validated JSON
- qwen-alina:14b is an optional future local profile, not created now
- Wrapper does not implement tasks, does not modify files, and does not replace Cursor/Claude/Windsurf
- No n8n integration is performed now
- No provider API, no API keys, no billing, no recurring costs
- ZERO API policy remains intact
- Local HTTP API with format=json, stream=false, think=false is the validated path from 0134
- CLI ollama run is NOT suitable for JSON strict automation

**Prossimo passo raccomandato:** optional docs-only wrapper script design (stage 2), or optional docs-only qwen-alina Modelfile design (stage 3), or runtime-gated Cursor CLI force-mode feasibility (from 0135), depending on user preference.

---

**Local Classifier Wrapper and Qwen-Alina Profile Design completato — task 0136 docs-only**
