# Local Classifier Wrapper Script Design

**Date:** 2026-05-13  
**Task:** 0137-local-classifier-wrapper-script-design  
**Type:** low-touch-loop-docs-only  
**Status:** completed (docs-only design)

---

## A. Executive Summary

This is the **canonical docs-only design** for the future local classifier wrapper script. This script will operationalize the wrapper concept designed in task 0136.

**Key principles:**
- This is a **docs-only design** — no script is created or executed now
- The future wrapper script will call local Ollama HTTP API only
- The future script will return validated JSON compatible with 0135 Cursor bridge
- No provider API, no API key, no billing, no recurring cost
- ZERO API policy remains intact

The future script will:
- Read compact LLMS-first context
- Read a single task file
- Assemble a compact prompt
- Call local Ollama HTTP API
- Request strict JSON output
- Validate JSON schema
- Normalize enums
- Retry once if invalid
- Classify task class/risk/gates
- Produce a structured classifier result
- Optionally feed the Cursor force-mode bridge from task 0135

---

## B. Architecture Position

```
GitHub queue
→ local classifier wrapper script
→ Ollama qwen3:14b / future qwen-alina:14b
→ validated classifier result JSON
→ Cursor force-mode bridge
→ dedicated branch
→ ChatGPT web post-check
→ human merge decision
```

**Clarifications:**
- n8n can call the script in the future, but this task does not integrate n8n
- local script can also be used manually in future dry-runs
- wrapper is advisory, not authoritative
- GitHub is source of truth, not the wrapper

---

## C. Future Script Scope

### Allowed

The future script may:
- Read docs/LLMS.md
- Read docs/wiki/current-state.md
- Read docs/wiki/token-efficiency.md
- Read one assigned task file
- Assemble compact prompt
- Call http://localhost:11434/api/generate
- Force model, stream=false, think=false, format=json
- Parse JSON
- Validate JSON schema v1
- Retry once on invalid JSON
- Return JSON to stdout
- Optionally write classifier result to processing folder in future file-output mode

### Forbidden

The future script must NOT:
- Read PROJECT_STATE.md by default
- Read CHECKPOINT.md by default
- Modify app files
- Deploy/tag/rollback
- Execute Cursor
- Create branches
- Commit
- Push
- Call provider APIs
- Use API keys
- Send data outside localhost
- Become source of truth

---

## D. Candidate Future File Location and Language

### Recommended Location

**tools/local-classifier/alina_classifier.py**

### Alternative

**tools/local-classifier/classify_task.ps1** only if PowerShell is chosen later

### Recommendation

Python script is preferred for:
- Portability across platforms
- Built-in JSON validation
- Schema checking libraries
- Future n8n/script integration
- Easier maintenance

PowerShell snippets may be useful for Windows local testing but should not become the primary portable wrapper unless decided later.

**Important:** This task does NOT create the actual script. This is design only.

---

## E. Future CLI Shape

### Conceptual CLI Usage

```bash
python tools/local-classifier/alina_classifier.py \
  --task docs/tasks/queue/0137-example.md \
  --model qwen3:14b \
  --output stdout
```

### Possible Options

| Option | Purpose | Default |
|--------|---------|---------|
| --task | Path to task file | Required |
| --model | Ollama model name | qwen3:14b |
| --output | Output mode: stdout|file | stdout |
| --schema-version | JSON schema version | 1 |
| --max-context-chars | Input size cap | 10000 |
| --dry-run | Validate without calling Ollama | false |
| --no-write | Skip file writing | true |
| --timeout-seconds | Ollama request timeout | 30 |
| --retry-on-invalid | Retry once on invalid JSON | true |

**Clarifications:**
- CLI shape is design only
- No script is created now
- No command is executed now

---

## F. Input Assembly Design

### Input Assembly Steps

1. **LLMS.md compact excerpt** — ≤1k characters
2. **current-state.md compact excerpt** — ≤1k characters
3. **token-efficiency.md relevant rules** — ≤500 characters
4. **Task file content** — ≤2k characters
5. **Allowed paths / forbidden paths** extracted from task if present
6. **Gate keywords extracted from task** — runtime, deploy, API key, etc.

### Rules

- Hard cap around 6–10k characters total
- Do not read PROJECT_STATE/CHECKPOINT by default
- If input too large, summarize/truncate deterministic sections
- Never include credentials/tokens/API keys/OAuth material
- Never include Google Sheet data
- Never include sensitive raw URLs

### Truncation Strategy (Future Implementation)

If input exceeds max-context-chars:
1. Keep task file content intact (highest priority)
2. Keep LLMS.md current state (≤500 chars)
3. Truncate token-efficiency.md rules to essential only
4. Summarize current-state.md to most recent changes only

---

## G. Prompt Construction Design

### Prompt Sections

1. **System prompt** — technical English, ZERO API policy, gate detection
2. **Compact project context** — LLMS.md + current-state.md excerpts
3. **Task content** — task file + metadata
4. **Classification rules** — A/B/C/D/E classes, risk levels
5. **Gate rules** — sensitive gates list
6. **JSON schema v1** — full schema definition
7. **Output JSON only instruction** — no prose, no markdown

### Language Policy

- Technical English for classifier prompts (per AI_RULES.md)
- No bilingual duplication
- No prose in model output
- `think=false` must be used because qwen3 thinking output is not wanted for JSON strict flow

### Example Prompt Structure

```
You are a local routing classifier for the Alina Lavoro project. Output ONLY valid JSON. No prose. ZERO API policy.

Current state from docs/LLMS.md:
[compact excerpt, ≤1k chars]

Current state from docs/wiki/current-state.md:
[compact excerpt, ≤1k chars]

Navigation rules from docs/wiki/token-efficiency.md:
[compact excerpt, ≤500 chars]

Task to classify:
[task file content, ≤2k chars]

Task metadata:
- task_id: [task_id]
- slug: [slug]
- allowed_paths: [list]
- forbidden_paths: [list]

Classification rules:
- A. Routine docs-only: force candidate, branch required, low risk, light model
- B. Medium docs/workflow/wiki/routing: force candidate, branch required, medium model
- C. Delicate architecture: force candidate with human review before merge, strong model
- D. App code: STOP / human gate
- E. Runtime/deploy/tag/rollback/API/security: STOP / human gate

Gate detection:
runtime, VPS runtime, n8n runtime, app source changes, deploy Apps Script, tag, rollback, API key, provider API, hosted AI calls, login, GitHub Actions, new recurring costs, automatic runner, sensitive data/credentials/OAuth, physical test.

Output JSON schema v1:
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

Output ONLY valid JSON. No prose. No markdown. No explanation.
```

---

## H. Local Ollama API Request Design

### Future Request

```
POST http://localhost:11434/api/generate
Content-Type: application/json

{
  "model": "qwen3:14b",
  "stream": false,
  "think": false,
  "format": "json",
  "prompt": "..."
}
```

### Clarifications

- Local-only — localhost:11434 only
- Zero provider API
- Do not use CLI `ollama run` for strict JSON automation (validated in 0134)
- Timeout should be conservative (default 30 seconds)
- If Ollama not available, fallback to human triage
- qwen3:14b should be used in short bursts because it is VRAM-heavy (validated in 0134)

### Error Handling (Future Implementation)

- Connection refused → fallback to human triage
- Timeout → fallback to human triage
- HTTP error → fallback to human triage
- Non-JSON response → retry once with stricter prompt, then fallback

---

## I. JSON Schema Validation Design

### Schema v1 (Reuse from 0136)

**Required fields:**
- schema_version
- task_id
- slug
- task_title
- task_class
- risk_level
- needs_human_gate
- gates_required
- can_force_execute
- allowed_paths
- forbidden_paths
- branch_name
- recommended_implementer
- recommended_cursor_model
- cursor_mode
- needs_decision_packet
- confidence
- reason_short
- prompt_for_cursor

### Enum Validation

| Field | Allowed Values |
|-------|---------------|
| task_class | A | B | C | D | E |
| risk_level | low | medium | high | blocked |
| recommended_implementer | cursor_force | claude_code | windsurf | human_gate | none |
| recommended_cursor_model | light | medium | strong | none |
| cursor_mode | force | propose | stop |
| confidence | high | medium | low |

### Validation Steps (Future Implementation)

1. Parse JSON
2. Check all required fields exist
3. Validate schema_version == "1"
4. Validate enum values match allowed set
5. Validate branch_name follows pattern ai/<task-id>-<slug>
6. Validate allowed_paths and forbidden_paths are arrays
7. Validate can_force_execute is boolean
8. Validate confidence is valid enum

---

## J. Normalization Rules

### Deterministic Post-Processing (Future Implementation)

| Rule | Behavior |
|------|----------|
| Normalize docs-only/docs_only | Map to task_class A only if task metadata agrees |
| Normalize risk values | Convert to lowercase enum (LOW → low) |
| Normalize recommended implementer | Map to known enum (cursor → cursor_force) |
| Reject unknown cursor_mode | Fallback to human triage |
| Derive branch_name if missing | Derive only when task_id and slug are reliable: ai/<task-id>-<slug> |
| Never normalize provider API/billing | If provider API/billing mentioned → blocked, never normalize to safe |
| Sensitive gate escalation | If any sensitive gate keyword appears → escalate to D/E or blocked |
| Metadata contradiction | If output contradicts metadata → fallback to human triage |

### Gate Keyword Detection

Sensitive gate keywords (case-insensitive):
- runtime
- vps runtime
- n8n runtime
- app source
- deploy
- tag
- rollback
- api key
- provider api
- hosted ai
- openai api
- anthropic api
- login
- github actions
- recurring cost
- automatic runner
- credential
- secret
- oauth
- physical test

---

## K. Gate Detection Rules

### Sensitive Gates

| Gate | Classification |
|------|---------------|
| provider API / API key / billing | blocked |
| app source changes | D / human gate |
| deploy/tag/rollback/runtime | E / human gate |
| docs-only with no runtime | A/B depending complexity |
| architecture docs | C if delicate |

### Detection Logic (Future Implementation)

```python
# Pseudocode
if any_keyword_in(["provider api", "api key", "billing", "openai api", "anthropic api"]):
    return blocked
elif any_keyword_in(["app source", "src/", "gas-current/", ".gas/"]):
    return D, human_gate
elif any_keyword_in(["deploy", "tag", "rollback", "runtime"]):
    return E, human_gate
elif is_docs_only and no_runtime:
    if is_delicate_architecture:
        return C
    else:
        return A or B based on complexity
```

---

## L. Retry/Fallback Design

### Future Behavior

1. Call Ollama once
2. Parse JSON
3. If invalid JSON:
   - Retry once with stricter JSON-only prompt
   - Add emphasis: "Output ONLY valid JSON. No prose. No markdown."
4. If still invalid:
   - Return fallback result:
     - confidence: low
     - can_force_execute: false
     - recommended_implementer: human_gate
5. If confidence low:
   - Fallback to human triage
6. If sensitive gate found:
   - Human gate
7. If Ollama unavailable:
   - Human triage
8. If qwen3:14b too slow or unavailable:
   - No automatic fallback to provider APIs

### Retry Prompt (Stricter)

```
You are a local routing classifier. Output ONLY valid JSON. No prose. No markdown. No explanation.

[context and task]

Output JSON schema v1:
[schema]

Output ONLY valid JSON. Repeat: ONLY JSON.
```

---

## M. Output Modes

### Future Output Modes

1. **stdout JSON only** — default mode, print JSON to stdout
2. **Write file** — write to `docs/tasks/processing/<task-id>-classifier-result.json`
3. **Append to session** — append classifier summary to automation session
4. **Feed Cursor bridge** — feed JSON directly to Cursor force-mode bridge (future integration)

### File-Write Mode (Future, Gated)

If file-write mode is implemented in a future task:
- Write to `docs/tasks/processing/<task-id>-classifier-result.json`
- Include timestamp, schema_version, model used, confidence, elapsed_seconds
- Do not overwrite existing results without explicit decision
- Clean up processing files after task completion

### Stdout Mode (Default)

```json
{
  "schema_version": "1",
  "task_id": "0137",
  ...
}
```

---

## N. Example Outputs

### Example 1: Routine Docs-Only Task

```json
{
  "schema_version": "1",
  "task_id": "0137",
  "slug": "local-classifier-wrapper-script-design",
  "task_title": "Local classifier wrapper script design",
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
  "branch_name": "ai/0137-local-classifier-wrapper-script-design",
  "recommended_implementer": "cursor_force",
  "recommended_cursor_model": "light",
  "cursor_mode": "force",
  "needs_decision_packet": false,
  "confidence": "high",
  "reason_short": "Docs-only architecture design, no runtime, no app changes, no deploy, no API.",
  "prompt_for_cursor": "Create docs/automation/local-classifier-wrapper-script-design.md with sections A through T..."
}
```

### Example 2: Architecture Docs Task

```json
{
  "schema_version": "1",
  "task_id": "0135",
  "slug": "cursor-cli-force-mode-implementer-bridge-design",
  "task_title": "Cursor CLI force-mode implementer bridge design",
  "task_class": "C",
  "risk_level": "medium",
  "needs_human_gate": true,
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
  "branch_name": "ai/0135-cursor-cli-force-mode-implementer-bridge-design",
  "recommended_implementer": "cursor_force",
  "recommended_cursor_model": "strong",
  "cursor_mode": "force",
  "needs_decision_packet": false,
  "confidence": "high",
  "reason_short": "Delicate architecture design, requires human review before merge.",
  "prompt_for_cursor": "Create docs/automation/cursor-cli-force-mode-implementer-bridge-design.md..."
}
```

### Example 3: App Source Change Task

```json
{
  "schema_version": "1",
  "task_id": "example",
  "slug": "app-source-change",
  "task_title": "Modify app source",
  "task_class": "D",
  "risk_level": "high",
  "needs_human_gate": true,
  "gates_required": ["app source changes"],
  "can_force_execute": false,
  "allowed_paths": [],
  "forbidden_paths": [],
  "branch_name": "ai/example-app-source-change",
  "recommended_implementer": "human_gate",
  "recommended_cursor_model": "none",
  "cursor_mode": "stop",
  "needs_decision_packet": true,
  "confidence": "high",
  "reason_short": "App source changes require explicit human gate.",
  "prompt_for_cursor": ""
}
```

### Example 4: Provider API / N8N Deploy Task

```json
{
  "schema_version": "1",
  "task_id": "example",
  "slug": "provider-api-n8n-deploy",
  "task_title": "Integrate OpenAI API and deploy n8n workflow",
  "task_class": "E",
  "risk_level": "blocked",
  "needs_human_gate": true,
  "gates_required": ["provider API", "n8n runtime", "deploy"],
  "can_force_execute": false,
  "allowed_paths": [],
  "forbidden_paths": [],
  "branch_name": "",
  "recommended_implementer": "human_gate",
  "recommended_cursor_model": "none",
  "cursor_mode": "stop",
  "needs_decision_packet": true,
  "confidence": "high",
  "reason_short": "Provider API, n8n runtime, and deploy automation are blocked by ZERO API policy.",
  "prompt_for_cursor": ""
}
```

**Note:** These examples are illustrative and not generated by runtime.

---

## O. Test Strategy for Future Implementation

### Unit Tests (Future)

- Schema validation: all required fields present
- Enum validation: all enum values match allowed set
- Normalization: risk values, implementer names
- Gate detection: sensitive gate keywords
- Input assembly: size cap enforcement
- JSON parsing: valid vs invalid JSON

### Fixture Tasks (Future)

Create fixture task files for:
- A. Routine docs-only (safe)
- B. Medium docs/workflow/wiki (safe)
- C. Delicate architecture (needs human review)
- D. App source change (human gate)
- E. Provider API / n8n deploy (blocked)

### Invalid JSON Fixtures (Future)

- Duplicated JSON (CLI-like artifact from 0134)
- Malformed JSON (missing braces, trailing commas)
- Missing required fields
- Wrong enum values
- Hallucinated fields

### Gate Detection Fixtures (Future)

- Provider API mention
- API key mention
- Billing mention
- App source change mention
- Deploy mention
- Runtime mention

### Latency Recording (Future)

- Record elapsed_seconds for each call
- Warn if latency exceeds threshold (e.g., 10 seconds)
- qwen3:14b should complete in 2–5 seconds for classification (validated in 0134)

### No Network Provider Check (Future)

- Verify script never calls external APIs
- Verify script only calls localhost:11434
- Verify no outbound network traffic except Ollama

**Note:** Tests are not implemented in this docs-only task.

---

## P. Relationship to Qwen-Alina Profile

### Initial Implementation

- Wrapper should work first with base qwen3:14b
- No profile required for initial wrapper design
- System prompt baked in script initially

### Optional Optimization

- qwen-alina profile is optional optimization
- Profile can reduce repeated prompt tokens
- Profile can bake in stable Alina classifier rules
- Profile can lower temperature for more deterministic output

### Profile Creation

- Profile creation is separate runtime-gated task
- Profile must not be required for initial wrapper design
- Profile must remain local-only and zero provider API

---

## Q. Relationship to N8N

### Future Integration

- n8n can eventually call the wrapper script
- n8n passes task file path as argument
- n8n receives JSON output via stdout or file
- n8n routes output to Cursor bridge

### This Task

- n8n runtime integration is not part of this task
- No n8n workflow modifications
- No n8n runtime changes

### Future Gate

- n8n integration requires explicit manual gate
- n8n must not call provider AI APIs
- n8n must only call local Ollama via wrapper script

---

## R. Relationship to Cursor Force-Mode Bridge

### Wrapper Output Feeds 0135 Bridge

| Wrapper Output | Bridge Behavior |
|----------------|-----------------|
| can_force_execute = true, task_class = A/B/C, no gates | Bridge may prepare branch/prompt in future |
| can_force_execute = true, task_class = C, needs_human_gate = true | Bridge prepares branch/prompt, requires human review before merge |
| can_force_execute = false, task_class = D/E | STOP, create Decision Packet/human gate |
| gates_required non-empty | STOP, create Decision Packet/human gate |
| risk_level = blocked | STOP, create Decision Packet/human gate |

### No Automatic Merge

- No automatic merge ever (permanent rule from 0135)
- Merge to main remains human decision
- Human merge decision only after ChatGPT web post-check

---

## S. Security and Privacy

### No Provider API

- No provider APIs
- No API keys
- No credentials
- No OAuth
- No sensitive raw URLs
- No Google Sheet data
- No personal data

### Local-Only Inference

- Localhost only
- No data sent outside localhost
- No hosted AI calls
- ZERO API policy remains intact

### No Sensitive Data by Default

- No PROJECT_STATE.md by default
- No CHECKPOINT.md by default
- No app data
- No credentials/tokens/API keys/OAuth material in input

---

## T. Future Roadmap

### Stages

1. **Docs-only script design now** (this task 0137) — ✅ Completed
2. **Docs-only qwen-alina Modelfile design** (future task)
3. **Runtime-gated wrapper implementation** (future task)
4. **Runtime-gated wrapper dry-run using saved fixtures** (future task)
5. **Runtime-gated qwen-alina profile creation** (future task)
6. **Runtime-gated n8n/local script integration** (future task)
7. **Integration with Cursor bridge only after Cursor CLI feasibility** (future task, depends on 0135)
8. **No automatic merge ever** (permanent rule)

### Dependencies

- Stage 2: docs-only, can proceed independently
- Stage 3: requires explicit manual gate before runtime execution
- Stage 4: requires stage 3 completion
- Stage 5: requires explicit manual gate before runtime execution
- Stage 6: requires stage 5 completion
- Stage 7: requires 0135 Cursor CLI feasibility gate completion
- Stage 8: permanent rule, never changes

---

## Conclusione

This design formalizes the future local classifier wrapper script that will operationalize the wrapper concept from task 0136. The key design principles are:

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

**Local Classifier Wrapper Script Design completato — task 0137 docs-only**
