# Alina Lavoro — Permanent rules for AI / Cursor

These rules complement the repository constraints and reduce operational ambiguity.

## Implementer rule — No unnecessary confirmations

Canonical reference: `docs/ORCHESTRATOR_RULES.md` — **PRIORITY 0A**.

The implementer (Cursor, Windsurf/Cascade, Claude Code, Agent) must:

- **not ask the user for unnecessary confirmations** for already-assigned **docs-only** tasks;
- **not turn into a decision** what is already decided by the roadmap, queue task, or orchestrator prompt;
- if the task is **docs-only** and the **allowed paths** are clear, **execute**;
- **stop only for**:
  - scope drift (changes go outside the allowed paths);
  - forbidden paths touched;
  - Git conflicts not autonomously resolvable;
  - unresolvable technical errors (e.g. corrupted files, missing dependencies);
  - **sensitive gates** (runtime, VPS runtime, n8n runtime, Alina app changes, deploy, tag, rollback, API key, login, GitHub Actions, new recurring costs, automatic runner, sensitive data, real physical test).
- in the **final report**, indicate if any **real gates** or residual risks remain, but **do not ask «shall I proceed?»** if there is no real choice.

For **determined docs-only tasks**, the absence of a real choice equals **operational consent to proceed**: execute and close according to workflow with selective commit and push.

## Operational roles

- **Orchestrator**: the coordination chat. **Does not read the local filesystem**: reconstructs state from **GitHub** (and from what the user pastes in chat).
- **Implementer**: Cursor / Agent. Executes changes, checks, commits, pushes, and updates documents on GitHub.
- **GitHub**: **source of truth for the orchestrator** and shared memory with the implementer.
- **Terminal**: normally used by the implementer. The user must not be forced to run manual commands except in exceptional cases.

## Before acting

0. **Sync with GitHub** before starting a new work block on the operational branch (**`main`**):

   ```bash
   git checkout main
   git pull origin main
   npm run aggio
   ```

1. **Do not invent state** of the project, deploy, or branch: verify with `git status`, `git branch`, docs in `docs/`, and if useful, `npm run aggio`.
2. **Read** `docs/roadmap.md`, `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md`, `docs/STREAMLINED_WORKFLOW.md` when relevant to the task.
3. **Operational branch:** work on **`main`**. **`dev`** is **legacy/inactive** — do not use it for new development.
4. **`gas-current/`** is **read-only**: never modify, never use as a source for patches.
5. **Application changes** only under **`src/`** (backend `src/backend/`, frontend `src/frontend/`), unless workflow/documentation/tools are explicitly requested.

## Mandatory rule: GitHub always updated

The implementer must always keep GitHub updated at the **end of every operational block or session**, even when the user does **not** explicitly write `finito`.

Reason: the orchestrator does **not** read the local workspace; if GitHub is not updated, the orchestrator is out of the loop.

At the end of a block, the implementer must **always**, in order:

1. **Check real state** (local, before documenting and committing):

   ```bash
   git status
   git branch --show-current
   git log --oneline -5
   ```

2. **Update documentation** if state has changed: `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md`, and if useful a file in `docs/sessions/YYYY-MM-DD-*.md` (or `npm run checkpoint` if using that schema).

3. **Run the minimum checks** relevant to the block. If `src/frontend/Index.html` is modified, the implementer must run the **standard frontend checks** defined in `docs/COMMANDS.md`, without asking the user to launch them manually.

4. **Selective commit** — never `git add .`; explicit file list or `npm run finito -- "msg" file1 file2 …`.

5. **Push to GitHub** (`git push origin main`).

6. **Final report** in reply to the user with:
   - files changed;
   - tests/checks executed;
   - errors or residual risks;
   - **commit hash**;
   - **`git status --short`** output;
   - **explicit confirmation**: workspace **clean** or **not clean** (and why).

Exception: during an intermediate phase not yet considered complete, the implementer may leave local changes **only** if explicitly stated in the report and the block is not presented as closed.

## Standard checks

When a Cursor prompt concerns `src/frontend/Index.html`, the orchestrator does not need to rewrite all shell commands every time. Use this formula instead:

> Run the standard frontend checks from `docs/COMMANDS.md`.

The implementer must interpret this as the obligation to run the canonical block in `docs/COMMANDS.md`, i.e. at least:

- `git diff --check`;
- inline script extraction from `src/frontend/Index.html`;
- `node --check` on the extracted script;
- grep for modern operators to avoid on old WebViews;
- verification of `data-page` tabs in the navbar.

If a command is not available in the environment, the implementer must use an equivalent and declare it in the final report.

## Step-by-step and operational blocks (Cursor / Agent)

- In **operational tasks**, work in **small blocks**; **do not** anticipate subsequent phases not requested by the prompt or current task.
- If the task includes **manual procedures** or **n8n** (or anything outside the repo), document at closing **which steps are complete** and **which remain open** for the user.
- **Temporary diagnostic code** (e.g. debug Code nodes, noisy logs, workarounds "just to test"): either **remove before closing** the block, or declare it **explicitly temporary** in the report and **do not** present the block as final until it is cleaned and confirmed.
- In the **mandatory final report**, indicate whether any **manual steps** remain incomplete (yes/no and which ones).

Orchestrator alignment: `docs/ORCHESTRATOR_RULES.md` (**PRIORITY 0**). n8n discipline: `docs/automation/README.md` (**n8n manual run discipline**).

## Working mode

- For **significant or ambiguous** changes: **Plan** before **Agent**, with plan approved by the user.
- **Deploy** Apps Script / deployment update only when the block requires it (`docs/STREAMLINED_WORKFLOW.md` + instructions in the prompt); no accidental deploys out of context.
- **No `git add .`**: use explicit file list or `npm run finito` with explicit list.
- **Small, targeted commits**; commit messages in English (consistent with repo history).

## Quality and output

- Prefer **small, reviewable** blocks of changes.
- **Final output** (end of turn or end of task / block) aligned to point 6 above: files changed, tests/checks, errors/risks, commit hash, `git status --short`, workspace clean or not, **next step** (one line).

## Language policy for agents

**Rule:** use technical English for internal reasoning and structured outputs; use Italian for final user-facing summaries.

| Context | Language | Reason |
|---------|----------|--------|
| Internal prompts, system prompts, JSON/YAML fields | Technical English | Lower token count, higher technical precision, better stability in local 7B/8B models |
| Structured classifier/planner output fields | Technical English | Machine-readable consistency |
| Wiki agent-facing content (`docs/LLMS.md`, `docs/wiki/`) | Technical English preferred | Compact, reduces token cost for local AI |
| n8n AI layer, future Ollama classifier/planner prompts | Technical English | Local 7B/8B models (e.g. qwen3:8b) are more precise and less verbose in English |
| Final summaries to the user | Italian | User expects Italian; orchestrator (ChatGPT) responds in Italian |
| Canonical project docs (`PROJECT_STATE.md`, `roadmap.md`, etc.) | Italian (keep as-is) | Do not translate retroactively |
| Commit messages | English (already standard) | Consistent with repo history |

**Applicability:** Claude Code, Cursor, Windsurf/Cascade, local AI (Ollama), future n8n AI layer, n8n prompt generator.

**Do not:**
- translate existing canonical docs retroactively;
- create duplicated bilingual blocks (one language per context, not both);
- write internal JSON/YAML values in Italian if the field is machine-readable.

Empirical basis: user observed that qwen3:8b via Ollama produces more verbose and less precise output in Italian for technical classification tasks. Technical English is the default for internal agent reasoning from this point forward.

Canonical reference: `docs/AI_RULES.md` (this section). Other files reference this section for the full rule; they do not duplicate it.

## Sensitive commands and gates

- **`npm run push`** / **`clasp push`**: only after local verification and user consent on state.
- **Rollback**: primary mechanism = **stable tags** on `main` (e.g. `v1.8.1-stable`, `v1.8.0-stable`, …; historical `v1.5-stable`); do not execute destructive reset/merge without explicit order.
