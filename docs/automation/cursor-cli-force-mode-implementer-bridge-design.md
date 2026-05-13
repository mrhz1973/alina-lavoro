# Cursor CLI Force-Mode Implementer Bridge Design

**Data:** 2026-05-13  
**Task:** 0135-cursor-cli-force-mode-implementer-bridge-design  
**Tipo:** low-touch-loop-docs-only  
**Stato:** completato

---

## A. Executive Summary

This is the **canonical design** for the future low-touch/no-api/local-first implementer bridge architecture. The target architecture is:

```
GitHub queue → n8n or local script → Ollama qwen3:14b JSON router/classifier/risk scorer/prompt compressor → Cursor CLI / Cursor Agent in FORCE MODE → mandatory dedicated branch → checks → commit + push branch → ChatGPT web post-checks GitHub on demand → user approves merge / rejects / asks cleanup
```

**Key architectural decisions:**
- **Cursor force-mode is the target execution mode** — Cursor must modify files directly, not only propose patches
- **Propose-only is not the target** — it is acceptable only for debug/fallback
- **Dedicated branch is mandatory** — pattern: `ai/<task-id>-<slug>`
- **No automatic merge to main** — merge to main remains human decision
- **ChatGPT web post-check is explicitly on-demand and no-API** — ChatGPT reads GitHub on demand, no OpenAI API
- **Ollama qwen3:14b is classifier/router/compressor only, not implementer** — it does not modify files, does not execute shell, does not deploy
- **Cursor CLI API-key/billing requirement is a future gate** — if Cursor CLI/headless force mode requires CURSOR_API_KEY, separate API key, new billing, provider API, or recurring cost, STOP the workflow

This architecture is fundamental for the project. It is not a generic idea or side note. It must become an explicit architecture workstream under automation / watcher / runner / low-touch.

---

## B. Architecture Decision

The architecture decision is to formalize the low-touch/no-api/local-first direction chosen by the user:

| Component | Role |
|-----------|------|
| **GitHub queue** | Source of task truth |
| **n8n or local script** | Reads queue, LLMS/wiki/task, prepares compact Ollama input, routes |
| **Ollama qwen3:14b** | Router/classifier/risk scorer/prompt compressor/model recommender, JSON output only |
| **Cursor CLI / Cursor Agent** | Operational implementer, modifies files, checks, commits, pushes branch |
| **ChatGPT web** | Post-checks GitHub on demand, no API |
| **User** | Merge/reject/cleanup/gate decisions |

**Flow:**
1. Task appears in GitHub queue (`docs/tasks/queue/`)
2. n8n or local script reads task + LLMS/wiki + compact context
3. Ollama qwen3:14b produces JSON classification + compressed prompt for Cursor
4. Cursor CLI force-mode executes on dedicated branch
5. Cursor modifies files, runs checks, commits, pushes branch
6. ChatGPT web reads GitHub on demand, post-checks branch
7. User approves merge to main, rejects, or asks cleanup

**No provider APIs by default:** ChatGPT = web/on-demand, Claude Code = supervised usage, Local AI = Ollama/local models. Any provider API / hosted AI call / API key / billing / recurring cost requires explicit future manual gate and is out of scope by default.

---

## C. Roles

### GitHub Queue
- Source of task truth
- Task files in `docs/tasks/queue/`
- Task metadata: task ID, slug, allowed paths, forbidden paths, gates required

### n8n / Local Script
- Reads queue
- Reads LLMS.md, wiki/current-state.md, task file
- Prepares compact Ollama input (≤6–10k characters)
- Routes Ollama output to appropriate implementer
- Optional: triggers Cursor CLI when authorized

### Ollama qwen3:14b
- Router: determines task type, risk level, required gates
- Classifier: assigns task class (A/B/C/D/E)
- Risk scorer: estimates risk level (low/medium/high/blocked)
- Prompt compressor: produces compact prompt for Cursor
- Model recommender: suggests Cursor model level
- Decision Packet draft helper: assists in generating Decision Packets
- LLMS/wiki summarizer: summarizes state for context
- **JSON output only** — no shell execution, no file modification, no deploy

### Cursor CLI / Cursor Agent
- Operational implementer
- Modifies files directly (force-mode)
- Runs checks
- Commits to dedicated branch
- Pushes branch
- Does NOT merge to main
- Does NOT deploy, tag, or rollback unless gate explicitly authorizes

### ChatGPT Web
- Post-checks GitHub on demand
- Reads branch, commits, diff, forbidden paths, scope, tests, risks
- Generates Decision Packet if merge/cleanup/reject decision is needed
- Uses no API — web/on-demand orchestration only

### User
- Merge to main decision
- Reject decision
- Cleanup decision
- Gate decisions for sensitive operations
- Physical tests

---

## D. Ollama qwen3:14b Role

### Allowed
- Router
- Classifier
- Prompt compressor
- Task risk scorer
- Model recommendation
- Decision Packet draft helper
- LLMS/wiki summarizer

### Forbidden
- Shell execution
- File modification
- Deploy
- Replacing Cursor/Claude/Windsurf
- Autonomous main implementer
- Unsupervised runner
- Source of truth

**Principle:** Ollama qwen3:14b is advisory, not authoritative. If Ollama output is wrong or uncertain, fallback is manual triage. GitHub is source of truth, not Ollama.

---

## E. Expected Ollama JSON Schema

Strict schema with enum-like values where possible:

```json
{
  "task_id": "0135",
  "slug": "cursor-cli-force-mode-implementer-bridge-design",
  "task_class": "A",
  "risk_level": "low",
  "needs_human_gate": false,
  "gates_required": [],
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
  "cursor_mode": "force",
  "recommended_cursor_model": "light",
  "can_force_execute": true,
  "prompt_for_cursor": "Compact prompt for Cursor...",
  "confidence": "high",
  "reason_short": "Docs-only architecture design, no runtime, no app changes, no deploy, no API."
}
```

### Field Definitions

| Field | Type | Enum/Values | Description |
|-------|------|-------------|-------------|
| `task_id` | string | — | Task ID from queue |
| `slug` | string | — | Task slug |
| `task_class` | enum | A / B / C / D / E | Task class (see section F) |
| `risk_level` | enum | low / medium / high / blocked | Risk level |
| `needs_human_gate` | bool | true / false | Whether human gate is required |
| `gates_required` | list | — | List of gate names required |
| `allowed_paths` | list | — | Paths allowed to modify |
| `forbidden_paths` | list | — | Paths forbidden to modify |
| `branch_name` | string | — | Dedicated branch name (pattern: `ai/<task-id>-<slug>`) |
| `cursor_mode` | enum | force / propose | Cursor execution mode (force is target) |
| `recommended_cursor_model` | enum | light / medium / strong | Cursor model level |
| `can_force_execute` | bool | true / false | Whether force-mode execution is allowed |
| `prompt_for_cursor` | string | — | Compressed prompt for Cursor |
| `confidence` | enum | high / medium / low | Confidence in classification |
| `reason_short` | string | — | Short reason for classification |

---

## F. Task Classes A/B/C/D/E

### A. Routine Docs-Only
- **Can force execute?** Yes
- **Required branch?** Yes
- **Allowed implementer:** Cursor CLI force-mode, Claude Code, Windsurf
- **Model level:** light/Auto
- **Gate requirement:** None
- **Examples:** Documentation updates, wiki updates, roadmap updates, task queue management

### B. Medium Docs / Workflow / Wiki / Routing
- **Can force execute?** Yes
- **Required branch?** Yes
- **Allowed implementer:** Cursor CLI force-mode, Claude Code, Windsurf
- **Model level:** medium
- **Gate requirement:** None
- **Examples:** Workflow design updates, automation design docs, n8n workflow design (not runtime), permission updates

### C. Delicate Architecture
- **Can force execute?** Yes, with human review
- **Required branch?** Yes
- **Allowed implementer:** Cursor CLI force-mode (strong model), Claude Code (Opus)
- **Model level:** strong
- **Gate requirement:** Human review before merge
- **Examples:** Major architecture decisions, significant refactoring design, new automation components

### D. App Code
- **Can force execute?** No — STOP unless explicitly authorized
- **Required branch?** Yes
- **Allowed implementer:** Manual only (unless explicitly authorized)
- **Model level:** N/A
- **Gate requirement:** Explicit human gate required
- **Examples:** Alina app source changes, frontend/backend modifications

### E. Runtime / Deploy / Tag / Rollback / API / Security
- **Can force execute?** No — STOP
- **Required branch?** Yes
- **Allowed implementer:** Manual only
- **Model level:** N/A
- **Gate requirement:** Explicit human gate required
- **Examples:** Deploy Apps Script, tag git, rollback, VPS runtime changes, n8n runtime changes, API key creation, security changes

---

## G. Mapping Task → Cursor Model

| Task Class | Cursor Model | Rationale |
|------------|--------------|-----------|
| **A. Routine docs-only** | light/Auto | Simple documentation tasks, low complexity |
| **B. Medium docs/workflow/wiki** | medium | Moderate complexity, requires understanding of automation patterns |
| **C. Delicate architecture** | strong | High complexity, requires deep reasoning and architectural judgment |
| **D. App code** | STOP — manual only | App changes require explicit human gate, not automatic |
| **E. Runtime/deploy/tag/rollback/API/security** | STOP — manual only | Sensitive operations require explicit human gate, not automatic |

**Note:** Do not name paid/API provider paths as required. Keep this compatible with the user's current Cursor subscription/UI/CLI setup. The mapping above uses generic model levels (light/medium/strong) that map to Cursor's available models without assuming specific provider APIs.

---

## H. Branching Model

### Mandatory Branch Pattern
- Pattern: `ai/<task-id>-<slug>`
- Example: `ai/0135-cursor-cli-force-mode-implementer-bridge-design`

### Branch Rules
- **No long-running automatic work directly on main**
- **main remains stable operational branch**
- **Automatic/aggressive experiments only on dedicated branch**
- **No automatic merge**
- **Human merge decision only after ChatGPT web post-check**

### Branch Lifecycle
1. n8n or local script creates branch from main
2. Cursor CLI force-mode executes on branch
3. Cursor commits and pushes branch
4. ChatGPT web post-checks branch on demand
5. User approves merge to main, rejects, or asks cleanup
6. If approved: merge branch to main, delete branch
7. If rejected: delete branch, no merge
8. If cleanup needed: user requests cleanup, implementer cleans up branch

---

## I. Cursor CLI Force Mode

### Target Command Shape (Conceptual)
```
cursor-agent -p --force "..."
```

### Force Mode Requirements
- **Force mode is the target** — Cursor must modify files directly, not only propose patches
- **Cursor must not ask continuous operational confirmations** — it should execute autonomously within the defined scope
- **Prompt must include:**
  - Branch name
  - Allowed paths
  - Forbidden paths
  - Checks to run
  - Commit/push branch instruction
  - Final report format
- **No runtime/app/deploy/tag/rollback unless gate explicitly authorizes**

### Prompt Template (Conceptual)
```
You are Cursor Agent in force mode.
Branch: ai/<task-id>-<slug>
Allowed paths: [list]
Forbidden paths: [list]
Task: [compressed prompt from Ollama]
Checks: [standard checks relevant to task]
Commit message: [suggested commit message]
Push branch after completion.
Do NOT merge to main.
Do NOT deploy, tag, or rollback unless explicitly authorized.
Final report: [format]
```

---

## J. Cursor CLI Feasibility Gate

**Important:** Do not assume Cursor CLI/headless can run without separate API key.

### Gate Condition
- If Cursor CLI/headless force mode requires **CURSOR_API_KEY**, separate API key, new billing, provider API, or recurring cost, **STOP** the workflow.
- If Cursor CLI can work with existing local login/subscription without new API key/billing, it remains a candidate.

### Verification Required
This must be verified in a **future runtime-gated Cursor CLI preflight task**, not in this docs-only task.

### Preflight Scope (Future Task)
- Verify Cursor CLI force-mode works with existing local login
- Verify no CURSOR_API_KEY is required
- Verify no new billing is introduced
- Verify no provider API is required
- Test force-mode execution on a harmless docs-only task
- Confirm branch creation, modification, commit, push works

---

## K. GitHub Post-Check

### ChatGPT Web Role
- ChatGPT web reads GitHub on demand
- Uses LLMS-first routing
- Checks:
  - Branch name follows pattern
  - Commits are on branch, not main
  - Diff respects allowed/forbidden paths
  - Scope matches task definition
  - Tests/checks passed
  - No forbidden files touched
  - No deploy/tag/rollback unless gate authorized
- Generates Decision Packet if merge/cleanup/reject decision is needed
- Uses no API

### Post-Check Trigger
- On-demand by user
- Or triggered by n8n when branch is pushed (future automation)

### Decision Packet Generation
If post-check finds issues or requires decision, ChatGPT generates Decision Packet:
- Kind: `automation` or `meta`
- Options: approve merge / reject / cleanup / request changes
- Recommendation based on diff analysis

---

## L. Failure Modes

| Failure | Detection | Mitigation |
|---------|-----------|------------|
| Cursor touches forbidden files | Forbidden paths scan in post-check | Reject branch, cleanup, manual review |
| Cursor commits on main instead of branch | Post-check checks branch name | Reject, cleanup, manual correction |
| Cursor fails tests | Test execution in Cursor run | Retry, or reject if persistent |
| Branch diverges from main | Post-check diff analysis | Merge conflict resolution, or reject |
| Model recommends wrong model/route | Post-check task class validation | Manual override, adjust Ollama prompt |
| Prompt injection in task file | Input sanitization, post-check review | Reject task, manual review |
| Output JSON malformed | JSON validation before Cursor execution | Retry Ollama call, or fallback manual |
| Push branch fails | Error handling in script | Retry, or manual push |
| Cursor CLI requests API key/billing | Preflight gate (section J) | STOP workflow, manual review |
| n8n/script misroutes task | Task class validation | Manual correction, adjust routing logic |
| ChatGPT post-check misses file drift | Manual review by user | User override, cleanup |

---

## M. Fallbacks

| Situation | Fallback |
|-----------|----------|
| Delete branch | Manual git branch -D |
| Cleanup branch | Manual git checkout main, git branch -D |
| Manual Cursor UI | Use Cursor UI instead of CLI |
| Manual Claude Code | Use Claude Code instead of Cursor |
| Windsurf/Cascade fallback | Use Windsurf/Cascade instead of Cursor |
| Human gate | Stop automation, require manual decision |
| No merge | Delete branch, do not merge |
| Return to current manual-supervised flow | Disable automation, return to Fase A |

---

## N. What Remains Human

- **Merge to main** — always human decision
- **Deploy** — always human decision
- **Tag** — always human decision
- **Rollback** — always human decision
- **Runtime** — always human decision
- **App source changes** — always human decision
- **Provider/API/billing decisions** — always human decision
- **Sensitive gates** — always human decision
- **Physical tests** — always human decision

---

## O. Roadmap

### Stages

1. **Docs-only design now** (this task 0135)
   - Document architecture
   - Define JSON schema
   - Define task classes
   - Define branching model
   - Define Cursor CLI feasibility gate

2. **Cursor CLI force-mode feasibility check, runtime-gated** (future task)
   - Verify Cursor CLI force-mode works with existing local login
   - Verify no CURSOR_API_KEY is required
   - Verify no new billing is introduced
   - Test force-mode execution on harmless docs-only task
   - Confirm branch creation, modification, commit, push works

3. **Branch-only dry run with harmless docs-only task** (future task)
   - Execute full flow on a safe docs-only task
   - Verify end-to-end: queue → Ollama → Cursor CLI → branch → push
   - Verify post-check works
   - Verify merge decision works

4. **ChatGPT web post-check procedure** (future task)
   - Define post-check checklist
   - Define Decision Packet generation for merge/reject/cleanup
   - Test post-check on real branch

5. **Optional n8n/local script router integration** (future task, runtime-gated)
   - Integrate n8n with Ollama HTTP API
   - Integrate n8n with Cursor CLI trigger
   - Test end-to-end automation

6. **Optional qwen-alina profile / classifier wrapper design** (future task, docs-only)
   - Design custom Ollama profile for qwen3:14b
   - Design classifier wrapper script
   - Define prompt templates

7. **No automatic merge until separately authorized** (permanent rule)
   - Merge to main remains human decision
   - No automatic merge gate in this architecture

---

## Conclusione

This design formalizes the low-touch/no-api/local-first architecture direction for the Cursor CLI force-mode implementer bridge. The key architectural decisions are:

- Cursor force-mode is the target execution mode
- Dedicated branch is mandatory
- No automatic merge to main
- ChatGPT web post-check is on-demand and no-API
- Ollama qwen3:14b is classifier/router/compressor only, not implementer
- Cursor CLI API-key/billing requirement is a future gate that must stop the workflow if required

The architecture is fundamental for the project and must become an explicit architecture workstream under automation / watcher / runner / low-touch.

**Prossimo passo raccomandato:** future runtime-gated Cursor CLI force-mode feasibility check (stage 2), or docs-only classifier wrapper/qwen-alina profile design (stage 6), depending on user preference.

---

**Cursor CLI Force-Mode Implementer Bridge Design completato — task 0135 docs-only**

---

## Cross-reference: task 0140

Task 0140 (`docs/automation/local-cursor-dual-agent-loop-design.md`) extends this architecture by adding a second Cursor agent (Reviewer / Orchestrator-Lite) and formalizing the full dual-agent loop including branch policy, anti-loop guards, and Decision Packet integration. The 0135 branching model, Ollama JSON schema, and task class taxonomy (A/B/C/D/E) remain canonical.
