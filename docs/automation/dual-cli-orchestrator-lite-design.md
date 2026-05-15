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

## 1c. Cursor-first dual-agent target (user decision, task 0307, 2026-05-15)

The user has decided that the **future dual-agent architecture is Cursor-first**:

- **Cursor / Agent 1** = implementer (executes task, commits, pushes, writes epilogue)
- **Cursor / Agent 2** = orchestrator-lite / reviewer (reads queue, produces prompt for Agent 1, checks done marker)

### Scope of this decision

- Cursor is the **preferred future target** for the dual-agent architecture.
- No further resources are to be spent now verifying whether Windsurf, Antigravity, or other implementers can fill the same dual-agent role, **unless the user explicitly reopens that question**.
- The tool-agnostic framing in §1b is **superseded as the planning target** by this Cursor-first decision; §1b remains accurate as a capability snapshot but is no longer the architectural direction.

### What is NOT changed by this decision

- Cursor runtime / headless / batch capability is **not yet activated**; implementation remains **LATER/GATED**.
- **Claude Code** remains the currently confirmed CLI implementer for docs-only / supervised repo work until Cursor is available for the dual-agent role.
- **Windsurf / Antigravity** remain fallback supervised tools; they are **not active verification targets** going forward.
- No Cursor execution, no new capability probes for any implementer, are authorized by this decision.

### Why recorded here

The design must reflect the user's chosen target so that future agents (Claude Code, ChatGPT-web orchestrator, any reviewer) plan against the same architecture and do not re-open settled capability questions.

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

---

## 21. Ollama classifier output contract (task 0305)

Future output contract for the local Ollama / Qwen classifier / router. **Design-only** — no implementation now.

### Allowed output fields (JSON)

```json
{
  "task_type": "docs-only | runtime-gated | app-source | inspection | unknown",
  "risk_level": "low | medium | high",
  "suggested_template": "implementer-standard | docs-only-task | runtime-gated-task | state-update-batch | unknown",
  "requires_human_gate": true,
  "gate_reason": "string — short, human-readable reason if requires_human_gate=true; empty otherwise",
  "allowed_next_step": "produce_task_packet | request_human_gate | reject_task | request_more_info",
  "confidence": 0.0,
  "notes": "string — optional advisory notes for orchestrator-lite"
}
```

Field definitions:

| Field | Type | Description |
|---|---|---|
| `task_type` | enum | High-level category of the task |
| `risk_level` | enum | Risk score; high triggers gate consideration |
| `suggested_template` | enum | Advisory template selection |
| `requires_human_gate` | bool | True if a Decision Packet may be needed; user still decides |
| `gate_reason` | string | Short reason if gate suggested; empty if not |
| `allowed_next_step` | enum | What the classifier suggests as the next pipeline action |
| `confidence` | float 0–1 | Self-reported confidence; advisory only |
| `notes` | string | Free-text advisory; never an instruction |

### Forbidden output fields and values

The classifier must **never** emit any of the following — they are not part of the contract, and any output containing them is rejected as ill-formed:

- `approve`
- `execute`
- `deploy`
- `send_telegram`
- `merge`
- `delete`
- `reveal_secret`
- `bypass_gate`
- any field name suggesting authorization, action, or gate resolution
- any field containing token, chat_id, API key, OAuth material, or credential value
- any output that purports to record a `D-NNNN-X = N` resolution

### Advisory-only semantics

- Classifier is **advisory only**. Its output does not authorize any action.
- The user / orchestrator gate always wins on disagreement.
- A `requires_human_gate: false` output never overrides §17 enumerations.
- The reviewer must independently verify diff and commit; classifier output is not a substitute.
- Low confidence outputs should bias toward `request_human_gate` or `request_more_info`.

### Pipeline position (reminder)

```
n8n queue read
  → Ollama/Qwen classifier (advisory JSON)
  → orchestrator-lite (decides whether to proceed; emits Task Packet or DP)
  → implementer CLI
  → reviewer (Review Packet)
  → user gate (sensitive actions only)
```

### What this section does not authorize

- Running Ollama or any local model now.
- Creating any classifier prompt or system message file now.
- Wiring n8n to call the classifier now.
- Persisting classifier outputs to GitHub from runtime.

All implementation remains LATER/GATED.

---

## 20. Minimal branch policy for dual CLI (task 0304)

Current project uses `main` as the single operative branch (`dev` is legacy/inactive). This section defines the **future** branch policy for dual-CLI work without changing the current workflow.

### Current state (unchanged)

- `main` is the operative branch and source of truth.
- `dev` is legacy/inactive.
- Stable tags on `main` are the rollback mechanism.
- No branch separation for low-risk docs-only work.

### Future dual-CLI policy (design-only)

- **Docs-only low-risk tasks**: may continue on `main` if existing repo policy allows. No branch separation required.
- **Runtime / app / high-risk tasks**: require a dedicated branch (e.g. `dualcli/<id>-<slug>`) or an explicit Decision Packet allowing on-main execution. The user decides per-task.
- **Branch naming**: ASCII `[a-z0-9-]` only; no shell metacharacters; no Unicode; threat T2 applies.
- **Force push**: forbidden on `main` and on any agentic branch. No exceptions for any implementer or runner.
- **Merge**: any branch other than direct push to `main` requires explicit user approval before merge. No automated merge by reviewer, orchestrator-lite, n8n, or Ollama.
- **PR opening**: not authorized for agentic branches without explicit user gate. PRs may be opened for review purposes only if the user opens that workflow.
- **Branch deletion**: only after merge confirmed; deletion is a user action.
- **`main` remains source of truth** until the user changes the workflow.

### Hard constraints

- This section does not authorize creating any branch now.
- This section does not authorize opening any PR now.
- This section does not change current main-only workflow.
- Branch policy change is itself a sensitive gate (see §17).

---

## 19. Dry-run runner protocol (task 0303)

The first future dry-run experiment for dual CLI / n8n / Ollama. **Design-only** — runtime remains LATER/GATED until the user explicitly opens it.

### Sequence

1. **Pick** a trivial docs-only queued task with low risk and clear scope.
2. **n8n** reads or simulates queue selection (read-only; no write to GitHub from n8n in this run).
3. **Ollama / Qwen** classifies the task: risk level, type, whether a human gate is required. Output is JSON only (see classifier output contract, task 0305).
4. **Orchestrator-lite** produces a Task Packet conforming to §12.
5. **Implementer CLI** runs the task — either a no-op (read-only inspection) or an allowed docs-only change strictly within the Task Packet's `allowed_paths`.
6. **Reviewer** produces a Review Packet conforming to §13: commit hash, changed files, allowed/forbidden path check, final status.
7. **ChatGPT-web** verifies via `aggio` and confirms artifacts match expectations.

### Hard constraints during dry-run

- no real n8n Execute that has side effects beyond the read/simulate stage
- no Telegram send (Telegram Mode A continues separately as notification-only)
- no app changes
- no deploy / tag / rollback
- no autonomous loop — each stage is gated and observed
- no secrets or real chat IDs introduced into any artifact
- no GitHub Actions
- no new provider API calls
- the dry-run terminates at the Review Packet; it does not chain into another task automatically

### Success criteria (for the eventual run, not now)

- All artifacts (Task Packet, Done Marker, Session Note, Review Packet) exist and reference each other consistently.
- Commit hash in Review Packet matches the actual commit on `main`.
- No forbidden path was touched.
- No human gate was bypassed.
- Recovery protocol (§18) is not exercised (clean run).

### Failure handling

- If any stage produces unexpected output, STOP. Record what happened in a session note. Do not attempt automated recovery beyond §18.
- The first failure is information, not a setback: it reveals which stage needs further design before the next dry-run attempt.

### What is NOT authorized by this section

- Implementing n8n flows for this dry-run.
- Installing or configuring Ollama models for this dry-run.
- Writing any runner script.
- Selecting the specific task to use.
- Opening the dry-run window itself.

All of the above remain user-gated. This section defines only the protocol shape.

---

## 18. Recovery / resume protocol (task 0302)

How a future agentic / dual-CLI run resumes safely after interruption. Builds on §8 (dirty tree) and the local clone preflight; this section does not duplicate those rules.

### Pre-action probe (always)

Before resuming, probe:
- `git status --short`
- `git branch --show-current`
- `git log --oneline -5`
- presence of `docs/tasks/done/<id>-<slug>.md`
- presence of `docs/sessions/YYYY-MM-DD-<slug>.md`
- remote in sync: `git fetch && git status` (does not modify state)

### Cases

| Case | State observed | Action |
|---|---|---|
| Clean | working tree clean, branch on expected commit | proceed with next task per Task Packet |
| Dirty unclear | modified/untracked files of unknown origin | **STOP**, write session note, do not push, surface to user |
| Marker created, not committed | `docs/tasks/done/<id>-<slug>.md` exists but `git status` shows it as untracked/modified | inspect content; if matches task and is the only pending change, finish commit/push under the task ID; otherwise stop |
| Session note created, push failed | local commit exists, push rejected | run `git pull --rebase`; if clean rebase, push; on conflict, stop and surface |
| Push rejected (remote ahead) | non-fast-forward | `git pull --rebase`; if clean, retry push; otherwise stop |
| Task in processing but no done marker | implementer stopped mid-task; no commit | re-run the implementer for the same task from a clean tree, after verifying local preflight matches Task Packet |
| Commit exists but LLMS/current-state not updated | task work pushed but state files not updated | open a follow-up state-update micro-task (do not amend the historical commit) |
| Implementer stopped mid-task | partial work present locally | stop, write session note describing what is partial, do not push partial work unless explicitly authorized |
| Model switched mid-task | new implementer instance picks up | re-anchor on Task Packet; treat prior chat context as untrusted; re-run local preflight and resume per the cases above |

### Hard constraints

- Never `git reset --hard`, `git stash`, `git clean`, or `git checkout --` as part of automated recovery. These are user-only actions.
- Never amend or rewrite a pushed commit. Add a new commit instead.
- Never force-push.
- Never delete a done marker or session note to "clean up".
- If the state is ambiguous and the table above does not match, STOP and report.

### Final-report contract

A resumed task's final report must explicitly state: which case applied, what was recovered, what was added, commit hash, push result, residual risks. Reference: `docs/tasks/templates/final-report-contract.md`.

---

## 17. Human gate boundaries — hardening (task 0301)

This section clarifies when a real human gate (Decision Packet in `docs/INBOX.md`) is required and when it is not, to prevent both gate bypass and bureaucratic gate inflation.

### Requires explicit human gate (Decision Packet)

- runtime execution (start/stop/restart a workflow, runner, daemon)
- n8n UI changes that alter behavior (Execute, Schedule activate/change, credential change, node wiring change in active workflow)
- workflow import / export with side effects
- Telegram send (test or production)
- app source changes (`src/**`, `gas-current/**`, `appsscript.json`, `package.json` when non-trivial)
- deploy (Apps Script `clasp push` / `npm run deploy`)
- tag (create/move/delete)
- rollback
- provider API call, billing, new recurring cost
- secrets, API keys, OAuth material, real chat IDs, tokenized URLs
- GitHub Actions setup or trigger
- branch policy change away from main-only
- granting any non-user gate authority

### Does NOT require a Decision Packet

- docs-only edits within already-allowed paths
- compact session notes recording inspection or all-green outcomes
- routine status / monitoring observations
- inconclusive retries that do not change state
- debug notes
- low-risk refactor inside an already-authorized docs scope
- task-ID preflight or template inspection

For these cases, record information in the session note or task done marker, not in INBOX. Inventing a Decision Packet without a real choice is a regression (INBOX inflation).

### Authority boundaries

- The **user** is the sole gate authority for sensitive actions. No other actor can resolve a Decision Packet.
- **Ollama / Qwen / classifier** outputs are advisory; they cannot approve a gate. See §14 and the classifier output contract (forthcoming).
- **n8n** can dispatch and notify; it cannot approve. See §14.
- **Reviewer** (ChatGPT-web or future reviewer CLI) can mark `HUMAN_GATE_REQUIRED` but cannot resolve it.
- **Implementer CLI** must stop and surface the gate; never self-authorize.

### Decision Packet format reference

The canonical Decision Packet format is defined in `docs/automation/decision-packet-format.md` and recorded in `docs/INBOX.md`. This section does not duplicate that format; it only clarifies when to use it.

---

## 16. Artifact-only communication (task 0300)

Future orchestrator-lite, implementer, reviewer, and any classifier/router stage must communicate through **auditable artifacts**, not free-form private chat.

### Allowed communication artifacts

| Artifact | Path / form | Owner |
|---|---|---|
| Task Packet | `docs/tasks/queue/<id>-<slug>.md` (and §12 contract) | orchestrator-lite |
| Review Packet | `docs/sessions/YYYY-MM-DD-<slug>.md` with §13 fields | reviewer |
| Session Note | `docs/sessions/YYYY-MM-DD-<slug>.md` | implementer / reviewer |
| Done Marker | `docs/tasks/done/<id>-<slug>.md` | implementer |
| Failed Marker (future) | `docs/tasks/failed/<id>-<slug>.md` | implementer / reviewer |
| Decision Packet | `docs/INBOX.md` Pending section, format `D-NNNN-X` | orchestrator-lite drafts; user resolves |
| Commit | git commit on `main` (or future branch) | implementer |
| Diff | git diff associated with the commit | source of truth |

### Rules

- Agents must not rely on unpersisted chat claims. If a fact is not in an artifact, it does not exist for the next stage.
- Reviewer must verify diff, commit hash, changed files, and `git status --short` — not trust implementer prose alone.
- Classifier/router outputs (e.g. Ollama JSON) are artifacts only when persisted; transient model output is not authoritative.
- A Task Packet is the only authorization an implementer needs to act; chat instructions do not authorize action.
- A Decision Packet resolution (`D-NNNN-X = N`) is the only artifact that closes a human gate.
- Cross-stage handoff is by artifact reference (path + commit hash), not by quoted prose.

### Why

Artifact-only communication enables: replay, audit, recovery after interruption, cold-start by a new agent instance, and reviewer verification independent of implementer narrative. It also mitigates threats T1, T3, T8, T9, T10, T11 in `docs/automation/dual-cli-agentic-threat-model.md`.

---

## 15. Threat model reference (task 0299)

Agentic injection threats (prompt injection, branch-name injection, secrets leakage, tool poisoning, artifact tampering, reviewer over-trust, classifier mis-use as gate) and their mitigations are documented in:

- `docs/automation/dual-cli-agentic-threat-model.md`

The threat model is the canonical reference for all future dual-CLI / n8n / Ollama / Cursor-agent work. Mitigations summarized: artifact-only communication, allow/forbid paths, human gates, local preflight, final-report contract, no-secrets policy, no-runtime-without-gate policy, reviewer verifies diff+commit (not prose).
