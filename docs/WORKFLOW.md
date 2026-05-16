# Alina Lavoro — Operational workflow (orchestrator / implementer)

Goal: reduce manual copy-paste and always keep GitHub as the shared source of truth.

## Aggressive autonomy policy (task 0405, 2026-05-16)

**User decision:** recoverable mistakes are explicitly preferable to project abandonment caused by repeated confirmation prompts.

Operational workflow note:
- Do **not** convert prompt-authorized steps into extra user confirmations. The user decided through the orchestrator prompt. That is sufficient.
- Normal task closure includes: validation checks, selective commit, push — all **without further approval** when already authorized by the current prompt.
- If a recoverable error occurs (e.g. environment issue, encoding mismatch, rebase needed), fix it and continue. Report in the final output — do not interrupt the user.
- **Non-recoverable actions remain fully gated** (see `docs/AI_RULES.md` and `docs/COMMANDS.md` for the full list).
- **Deploy gate:** deploy is still an orchestrator-level gate, but if the current task prompt explicitly authorizes it, run deploy commands without asking again.

Full policy reference: `docs/COMMANDS.md` — "Aggressive autonomy policy" section · `docs/AI_RULES.md` — "Aggressive autonomy" section.

---

## No unnecessary confirmations (global rule)

Canonical reference: `docs/ORCHESTRATOR_RULES.md` — **PRIORITY 0A** · **Aggressive autonomy policy** (section above).

- **Determined tasks with clear allowed paths** do not require new user authorization.
- If the task is already in the roadmap or is a direct consequence of the previous task, the orchestrator **generates the implementer prompt directly** without asking «vuoi?», «procedo?», «autorizzi?».
- The implementer must **execute and close** according to the workflow (sections below), without asking the user for additional confirmations.
- **Manual gate** is mandatory **only** for: runtime, VPS runtime, n8n runtime, Alina app changes, Apps Script deploy (without prompt authorization), tag, rollback, API key, login, GitHub Actions, new recurring costs, automatic runner, sensitive data/credentials, real physical test.
- **GitHub** remains the source of truth.
- The cycle closes with **commit/push** and subsequent **`aggio`** or auto-aggio for verification, **not** with «shall I proceed?» requests.
- Step-by-step mode (PRIORITY 0) is mandatory only when the user is manually operating n8n/VPS/browser/terminal/Apps Script.

## n8n template-first workflow (batch 0204–0208, 2026-05-14)

Canonical reference: `docs/ORCHESTRATOR_RULES.md` — **PRIORITY 0B** · `docs/AI_RULES.md` — **n8n template-first**.

When the next step involves an n8n workflow or test:

1. **Docs-first template creation.** Produce a complete importable JSON template plus a companion `.md` in `docs/automation/n8n-workflows/templates/`. Template ships with `active: false`, no real secrets, credential names/placeholders only. This is a docs-only batch step — no runtime.
2. **Gate import/inspection.** Open a Decision Packet (e.g. D-NNNN-A) authorizing import of the template into the local supervised n8n instance and inspection of node expressions. No Execute is authorized by this gate. The user binds the real Telegram credential and real chat_id **inside n8n only** (never in repo/chat).
3. **Gate Execute (separate, future).** A successful import/inspection is the prerequisite for a separate future Decision Packet that may authorize **exactly one** Execute run with success/failure criteria documented in the companion `.md`.
4. **Gate schedule activation (separate, future).** A successful Execute with duplicate-skip confirmed is the prerequisite for any schedule-activation gate.

Manual node-by-node setup is fallback only, used when import is not feasible.

## Batch size policy (task 0175, 2026-05-13)

Canonical reference: `docs/ORCHESTRATOR_RULES.md` — **Batch size policy** and `docs/AI_RULES.md` — **Batch size policy**.

| Batch type | Max sub-tasks |
|------------|--------------|
| docs-only pure | **8** (prefer 6–8; lower when fewer meaningful units exist) |
| docs + Decision Packet | 5 |
| docs + small technical design | 4 |
| runtime / n8n UI / credentials / Telegram / Schedule / app / deploy / tag / rollback | **1 step only** |

- Limits are maximums, not targets. Split if ambiguous.
- Docs-only coherent work: prefer batches of 6–8 sub-tasks when safe and meaningful. Do not invent tasks to fill a batch.
- Runtime or secrets in any sub-task → that portion is single-step and separately gated.
- Selective staging and path allowlists remain mandatory.
- Do not invent user decisions to fill a batch.
- Pending Decision Packets stay pending until explicit user response.

## Docs ROI Gate (batch 0267–0272, 2026-05-14)

Before creating a new document: at least one must apply — reduces token usage, user time, ambiguity, repeated errors, or future manual work. If none apply, do not create the document. A new doc that only adds another file to read is a regression. Full gate: `docs/wiki/v31-enforcement-checklist.md` § F.

## Roles

- **User**: talks with the orchestrator and with Cursor when needed, but does not normally run terminal commands.
- **Orchestrator**: the coordination chat. When receiving `aggio`, reads GitHub and documents to reconstruct real state.
- **Implementer**: Cursor / Agent. Runs terminal commands, modifies files, updates documents, commits and pushes.
- **GitHub**: shared memory and **the only source of truth the orchestrator can read** (not Cursor's local filesystem). Must be updated by the implementer at the end of a block, even if the user does not explicitly write `finito`.

## Step-by-step and manual steps (constraint)

- **No move to the next step** (new prompt, export, closing commit, completion documentation) until the **current step** is **complete** and, if required, **confirmed** by the user.
- For **n8n**, **VPS**, **browser**, **visual tests**, or other **manual actions**: **one step** per message or block; **wait** for outcome or confirmation; then the next step.
- **GitHub** remains the source of truth for **versioned** state, but **does not replace** user confirmation when the step is **manual and visual** (e.g. n8n run result, clasp screen): the orchestrator must not treat a push as proof that the human has already validated the step in the UI, unless the user declares so.

Normative reference: `docs/ORCHESTRATOR_RULES.md` (**PRIORITY 0**), `docs/automation/README.md` (n8n discipline).

## Before working (implementer)

At the start of a block on the operational branch (**`main`**):

```bash
git checkout main
git pull origin main
npm run aggio
```

**LLMS-first orientation (mandatory):**
1. Read `docs/LLMS.md` — compact entry point (≤200 lines).
2. Read `docs/wiki/current-state.md` — state snapshot (≤100 lines).
3. Read `docs/wiki/token-efficiency.md` — navigation rules.
4. Read the assigned task file (if any).
5. Read only task-specific canonical docs.
6. **Do NOT read `docs/PROJECT_STATE.md` by default** — fallback/audit only; if you open it, justify in final report.
7. **Do NOT read `docs/CHECKPOINT.md` by default** — restart context only; if you open it, justify in final report.
8. **LLM Wiki V3.1 (task 0232):** run task-ID preflight (`docs/wiki/task-id-preflight.md`) before assigning any new task ID; use prompt-routing + context-budget policy for delta-based short prompts; implementer templates in `docs/tasks/templates/`.

Note: task completion still updates PROJECT_STATE.md and CHECKPOINT.md per lifecycle rules. This routing rule does not change the update obligation — only the default startup read path.

## Main rule

The implementer must always update GitHub when concluding an operational block or session.

This is mandatory because the orchestrator does not read the local filesystem of Cursor: it reads GitHub. If Cursor does not update GitHub, the orchestrator is out of the loop.

At the end of a block the implementer must, in order:

1. **Real state:** `git status`, `git branch --show-current`, `git log --oneline -5`.
2. **Documentation** if state has changed: `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md`, optional `docs/sessions/YYYY-MM-DD-*.md` (or `npm run checkpoint` if using that schema).
3. **Minimum checks** relevant to the block.
4. **Selective commit** — never `git add .`.
5. **Push** to GitHub.
6. **Report** with: files changed; tests/checks executed; errors or residual risks; commit hash; `git status --short` final; declaration **workspace clean** or **not clean**.

## Conversational commands

| Conversational command | Receiver | Effect |
|------------------------|----------|--------|
| `aggio` | Orchestrator | Orchestrator reads GitHub and reports real state. No local command required from user. |
| `checkpoint` | Orchestrator or Cursor | If needed, Cursor generates checkpoint, commits and pushes; orchestrator uses it for restart. |
| `finito` | Normally Cursor | Cursor closes the session/block with documents, commit, push, and clean state. |

## npm commands available for Cursor

| npm command | Use |
|-------------|-----|
| `npm run aggio` | Local read-only snapshot of the repository. |
| `npm run checkpoint` | Generates `docs/CHECKPOINT.md` and a session in `docs/sessions/`. |
| `npm run finito -- "Message" file1 file2 ...` | Selective commit and push of the listed files. |

## `aggio` for the orchestrator

When the user writes `aggio` in the orchestrator chat:

- the orchestrator does not ask for terminal;
- reads GitHub;
- reads `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md`, `docs/roadmap.md`, `docs/AI_RULES.md`, `docs/STREAMLINED_WORKFLOW.md` and `docs/WORKFLOW.md` if useful;
- verifies **`main`**, **stable tags** and (only if historical audit is needed) the legacy **`dev`** branch;
- flags any inconsistencies;
- proposes the next step.

`aggio` does not create a checkpoint automatically.

## `checkpoint`

Checkpoint is used only when:

- the context is becoming too long;
- an important phase is closing;
- you want to guarantee restart in a new chat;
- the orchestrator explicitly requests it.

If Cursor runs `checkpoint`, it must normally close it with commit and push, otherwise GitHub is not updated.

## `finito`

`finito` is the block/session closing command used mainly by Cursor.

It must (aligned to the end-of-block checklist in `docs/AI_RULES.md`):

1. verify real state (`git status`, branch, `git log --oneline -5`);
2. update `docs/PROJECT_STATE.md` and/or `docs/CHECKPOINT.md` if needed;
3. create or update a file in `docs/sessions/` if useful;
4. run minimum checks;
5. do selective commit;
6. push;
7. report commit hash, `git status --short` final, and whether the workspace is clean or not.

Must not:

- use `git add .`;
- do `clasp push` without a request consistent with the task;
- deploy without the block requiring it (`docs/STREAMLINED_WORKFLOW.md` + instructions in the prompt);
- prescribe `dev` → `main` merge in normal flow (**`dev`** is legacy/inactive).

## Relationship with branches and releases

- Single operational branch: **`main`** (development, fixes, docs, releases).
- **`dev`:** legacy, **not** used for new work; may stay on remote aligned to `main` with no operational role.
- Real production: **Apps Script** (current deployment documented in `docs/PROJECT_STATE.md` / sessions).
- **Stable tags** on `main` (e.g. **`v1.8.1-stable`**) are the primary **rollback** and release anchoring mechanism; historical tags (`v1.8.0-stable`, `v1.6.2-stable`, `v1.5-stable`) remain available.
- After a release or important micro-release: update documentation, optionally **`gas-current/`** as a deploy snapshot, create **stable tag** when the block requires it.
