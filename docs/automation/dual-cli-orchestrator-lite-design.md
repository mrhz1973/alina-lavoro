# Dual CLI / Orchestrator-Lite Design Gate

**Date:** 2026-05-15
**Task:** 0288-dual-cli-orchestrator-lite-design-gate
**Type:** docs-only design gate
**Status:** completed (design-only; runtime remains LATER/GATED)
**Docs ROI:** reduces ambiguity between CLI-based path and Cursor/n8n dual-agent path (task 0140); answers 11 boundary questions in one compact file.

---

## 1. What this doc covers

The CLI-based orchestrator-lite model: supervised implementer CLIs (Claude Code, Windsurf, Antigravity, Cursor) coordinated via GitHub queue, short prompts, and explicit user gates. This is a simpler, lower-infrastructure path than the fully automated n8n + Ollama dual-agent loop.

**Relationship to task 0140:** task 0140 uses n8n + Ollama + Cursor CLI force-mode. This doc covers the manual/supervised variant that is already operational and defines what could be incrementally automated from it.

---

## 1a. Target architecture (full intended pipeline)

When the design is fully implemented, the intended pipeline is:

```
n8n supervised queue/scheduler
  → local Ollama / Qwen (router · classifier · risk scorer · prompt compressor)
  → orchestrator-lite CLI
  → implementer CLI  (tool-agnostic — see §1b)
  → GitHub session/done epilogue
  → ChatGPT web verification via aggio
  → user gate (real decisions and sensitive actions only)
```

Each stage is a gate or transform; no stage is bypassed. The pipeline is incremental: the supervised manual loop (orchestrator-lite = ChatGPT-web, implementer = Claude Code supervised) is already the current baseline. Automation layers are added from left to right only as each upstream stage is stable.

**This doc designs the full intended shape; runtime implementation of each stage remains LATER/GATED until the user explicitly opens it.**

---

## 1b. Tool-agnostic implementer layer

The implementer CLI slot is tool-agnostic. Any of the following may fill it in a given run, depending on what the user has available and authorized:

| Implementer | Supervised status | CLI capability (verified 2026-05-15) | Allowed current role | Next verification needed |
|---|---|---|---|---|
| Claude Code | Principal supervised implementer (current) | **Confirmed** — `claude` binary, version output, non-interactive batch execution validated | Docs-only and allowed-path tasks; runtime gated | None — baseline confirmed |
| Windsurf / Cascade | Backup supervised implementer | **CLI present / no agent mode** — binary v1.110.1 found; subcommands: `serve-web`, `tunnel`; Cascade AI is GUI-only, no standalone CLI | Supervised GUI use only; not for unattended runtime | Headless/no-GUI execution experiment (runtime-gated) |
| Antigravity | Supervised implementer (installed 2026-05-14) | **Partially confirmed** — binary v1.107.0; `chat` subcommand with `--mode agent/ask/edit`; stdin support; headless execution not yet verified | Supervised GUI use; `chat` CLI promising but unverified headless | Supervised `chat --mode agent` headless test (runtime-gated) |
| Cursor / Agent | Suspended; future option (see §1c) | **Interactive-only** — binary v3.3.30; `agent` subcommand present but interactive terminal only; no headless/batch mode | Not in active use (suspended) | Headless/batch mode experiment when Cursor unsuspended (runtime-gated) |

The task file format, commit/push protocol, and stop conditions (§7) are the same for all implementers. Implementer-specific prompt length rules remain (see `docs/ORCHESTRATOR_RULES.md` — Regola lunghezza prompt).

**Capability guard:** the tool-agnostic framing does not mean every listed implementer can be used for runtime automation today. Before any implementer other than Claude Code is placed in the runtime implementer slot, its CLI interface must be verified on the user's machine and an explicit user gate obtained. Do not assume CLI availability from supervised-implementer status alone.

**Matrix source:** tasks 0291 (Cursor), 0292 (Windsurf/Cascade), 0293 (Antigravity), consolidated in task 0294. All probes were `--help`/`--version` only; no autonomous agent task was launched.

---

## 1c. Cursor dual-agent option (one possible future implementation)

One valid future implementation of the orchestrator-lite + implementer split using Cursor:

- **Cursor / Agent 1** = implementer (executes task, commits, pushes, writes epilogue)
- **Cursor / Agent 2** = orchestrator-lite / reviewer (reads queue, produces prompt for Agent 1, checks done marker)

This option is **not the only path** and is not authorized now. It is recorded here so the design remains coherent when the user decides to evaluate it. The tool-agnostic framing in §1b takes precedence: any pairing of supported implementers may be used.

---

## 2. Role boundaries

### Orchestrator-lite (future CLI or ChatGPT-web)

Allowed:
- read `docs/tasks/queue/` from GitHub to identify the next task
- read `docs/LLMS.md`, `docs/wiki/current-state.md`, `docs/wiki/token-efficiency.md` for orientation
- produce a short implementer prompt (task file already in queue → minimal prompt)
- write the done marker and session note after implementer confirms completion
- record Decision Packets in `docs/INBOX.md` when a real human gate is needed
- stop on any sensitive gate (see §5)

Not allowed without explicit gate:
- runtime execution, n8n UI, workflow Execute, Schedule change
- Telegram send, deploy, tag, rollback, app source changes
- provider API calls, billing, secrets, OAuth material

### Implementer CLI (Claude Code, Windsurf — supervised)

Allowed:
- read assigned task file
- execute docs-only or allowed-path changes per task spec
- run standard checks (COMMANDS.md)
- commit selectively (never `git add .`)
- push to `main`
- write final report to GitHub (session + done marker)

Not allowed:
- self-assign tasks not in queue
- touch forbidden paths (src/**, gas-current/**, appsscript.json, package.json without explicit task)
- deploy/tag/rollback
- proceed past a sensitive gate without user confirmation

---

## 3. What remains user-only

- All sensitive gate decisions (runtime, deploy, tag, rollback, app source, secrets, provider API)
- Merge approval for any branch not on `main` directly
- Real physical tests (Alina on phone)
- Deciding when to open a new workstream
- Interpreting ambiguous task outcomes

---

## 4. What remains ChatGPT-web-only

- High-level strategic sequencing and roadmap decisions
- Decision Packet resolution (D-NNNN-X = N)
- Composing implementer prompts when task data is not yet on GitHub
- Post-check on complex outputs requiring orchestrator-level judgment

---

## 5. GitHub as state source

- Orchestrator-lite reads GitHub (not local filesystem) to reconstruct state.
- `docs/LLMS.md` + `docs/wiki/current-state.md` are the primary orientation files.
- `docs/tasks/queue/` is the task input surface.
- `docs/tasks/done/` is the completion confirmation surface.
- `docs/INBOX.md` (pending section) is the gate surface.

---

## 6. Where final epilogues are written

- Done marker: `docs/tasks/done/<task-id>-<slug>.md`
- Session note: `docs/sessions/YYYY-MM-DD-<slug>.md`
- State update: `docs/LLMS.md` + `docs/wiki/current-state.md` (compact, no history)
- Roadmap: `docs/roadmap.md` (compact note under active workstream)

---

## 7. Stop conditions

Implementer CLI must stop and surface a gate when:
- task scope would require touching a forbidden path
- a sensitive action is required (deploy, tag, rollback, app code, secrets)
- a real human choice exists between non-equivalent options
- git state is unexpected (wrong branch, dirty tree with uncommitted changes from another agent, merge conflict)
- checks fail and the cause is not clear

---

## 8. Dirty tree handling

- Before starting: `git pull origin main`; if dirty, stop and report — do not proceed
- If implementer leaves tree dirty unexpectedly: report in final, do not push partial work
- Never force-push; never `git add .`

---

## 9. Runtime gate handling

Any action outside docs-only / allowed paths requires an explicit Decision Packet in `docs/INBOX.md`. The implementer produces the DP draft; the user resolves it. No action taken until user records `D-NNNN-X = N`.

---

## 10. First future safe experiment

When the user decides to open runtime implementation:

1. Pick one trivial docs-only task already in `queue/`.
2. Claude Code reads queue, reads task, executes, commits, pushes — supervised, no automation.
3. Observe: does the done marker appear cleanly? Does the session note look right?
4. If yes: the manual loop is confirmed working as a baseline for any future automation.

No n8n, no scripts, no scheduler — just supervised CLI + GitHub queue as designed today.

---

## 12. Task Packet contract (design-only; task 0295)

The minimum shape of a Task Packet that orchestrator-lite would hand to an implementer CLI. Actual packet files, queues, and runners remain future/gated until the user explicitly opens implementation.

| Field | Description |
|---|---|
| `task_id` | Canonical task ID (e.g. `0295`) |
| `goal` | One-sentence objective |
| `expected_previous_state` | Last completed task ID and its slug |
| `allowed_paths` | Explicit list of file/directory paths the implementer may touch |
| `forbidden_paths` | Explicit list of paths the implementer must not touch (always includes `src/**`, `gas-current/**`, `appsscript.json`, `package.json` unless overridden) |
| `runtime_gate_status` | `docs-only` / `runtime-gated` / `user-gated` |
| `required_reads` | Files the implementer must read before acting (e.g. `docs/LLMS.md`, assigned task file) |
| `stop_conditions` | List of events that must halt the implementer and surface a gate |
| `expected_outputs` | Done marker path, session note path, state update files |
| `final_report_paths` | `docs/tasks/done/<id>-<slug>.md`, `docs/sessions/YYYY-MM-DD-<slug>.md` |

**Notes:**
- The packet is always produced by the orchestrator-lite (or ChatGPT-web) and never self-assigned by the implementer.
- Forbidden paths always apply even if not listed; task-specific `allowed_paths` is an additive allowlist.
- Stop conditions include: forbidden path touched, sensitive action required, git state unexpected, checks fail unresolvably, real human choice exists.
- Actual packet files (`docs/tasks/queue/*.md`) already carry most of this shape; this contract formalizes what orchestrator-lite must verify before dispatching.

---

## 13. Review Packet contract (design-only; task 0296)

The minimum shape of a Review Packet produced by orchestrator-lite/reviewer after reading implementer output. Design-only; automation remains future/gated.

| Field | Description |
|---|---|
| `reviewed_task_id` | Task ID reviewed |
| `commit_hash` | Git commit hash of implementer's closing commit |
| `changed_files` | List of files actually modified |
| `checks_observed` | Checks the implementer ran and their outcomes |
| `allowed_path_result` | `pass` / `violation` (with details if violation) |
| `forbidden_path_result` | `pass` / `violation` |
| `final_status` | One of: `APPROVED` / `NEEDS_FIX` / `FAILED` / `HUMAN_GATE_REQUIRED` |
| `gate_status` | Whether a human gate was triggered and why |
| `reviewer_decision` | Reviewer's rationale for final_status |
| `next_action` | e.g. `merge`, `return to implementer`, `open Decision Packet`, `stop chain` |

**Status definitions:**
- `APPROVED` — all paths respected, checks passed, done marker present, session note present.
- `NEEDS_FIX` — minor issues; implementer can retry without human gate.
- `FAILED` — implementer violated constraints or checks failed unresolvably; human review required.
- `HUMAN_GATE_REQUIRED` — a sensitive action was encountered; Decision Packet must be created in `docs/INBOX.md`.

**Notes:**
- The Review Packet is artifact-based (a file), not chat-based; it persists in `docs/sessions/`.
- The reviewer role may be orchestrator-lite CLI or ChatGPT-web in the current supervised baseline.
- No automated merge or deploy is triggered by `APPROVED`; merge/deploy remains a separate user gate.

---

## 11. What is explicitly not authorized now

- Creating any runner, script, scheduler, or n8n workflow for autonomous task dispatch
- Activating any GitHub Action or VPS cron for task processing
- Installing new CLIs or tools for this workstream
- Giving orchestrator-lite write access to any system other than GitHub docs paths
- Removing human gate requirement from any sensitive action
- Merging or deploying without explicit user confirmation

Dual CLI remains **LATER/GATED** until the user explicitly opens runtime implementation after this design gate.

---

## 14. n8n and Ollama role boundaries (task 0297)

### n8n — queue / scheduler / postman / supervised coordinator

n8n is a coordination layer, not a decision-maker.

**Allowed:**
- Poll `docs/tasks/queue/` on GitHub (read-only)
- Detect new tasks and notify the user or orchestrator-lite
- Dispatch a supervised implementer prompt after explicit user gate
- Write done/session artifacts to GitHub after implementer completes
- Send Telegram notifications (notification-only; no decisions)
- Coordinate stage transitions in the pipeline (queue → processing → done/failed)

**Not allowed:**
- Approve human gates (runtime, deploy, tag, rollback, app source, secrets, provider API, billing)
- Authorize any implementer to exceed allowed paths
- Make strategic decisions about task priority or sequencing
- Execute actions with side effects beyond GitHub docs paths without explicit Decision Packet resolved by user
- Self-authorize runtime experiments

### Ollama / Qwen — router / classifier / risk scorer / prompt compressor

Ollama and local AI models are classification/compression layers, not decision-makers.

**Allowed:**
- Classify task type (docs-only, runtime-gated, etc.) from task file content
- Score risk level of a task
- Compress or reformat prompts for token efficiency
- Identify whether a Decision Packet is needed for a given task
- Suggest (not decide) the next task from the queue

**Not allowed:**
- Approve human gates of any kind
- Authorize runtime, app changes, deploy, tag, rollback, provider API, billing, secrets
- Record `D-NNNN-X = N` (only the user records Decision Packet outcomes)
- Act as orchestrator or implementer autonomously
- Write to GitHub without supervision

### Gate authority — always the user

- The user is the sole gate authority for all sensitive actions.
- ChatGPT-web is the high-level supervisor when complex sequencing or strategic decisions are needed.
- Neither n8n nor Ollama/Qwen can substitute for a human gate.
- A Decision Packet in `docs/INBOX.md` remains pending until the user explicitly records the outcome.

### Pipeline position reminder

```
n8n (queue/scheduler/postman)
  → Ollama/Qwen (router/classifier/risk scorer)
  → orchestrator-lite (produces implementer prompt)
  → implementer CLI (executes task)
  → GitHub (session/done epilogue)
  → ChatGPT-web (verification if needed)
  → USER GATE (all sensitive actions)
```

No stage in this pipeline can skip or bypass the user gate for sensitive actions.
