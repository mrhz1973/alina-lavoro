# Dual CLI / Orchestrator-Lite Design Gate

**Date:** 2026-05-15
**Task:** 0288-dual-cli-orchestrator-lite-design-gate
**Type:** docs-only design gate
**Status:** completed (design-only; runtime remains LATER/GATED)
**Docs ROI:** reduces ambiguity between CLI-based path and Cursor/n8n dual-agent path (task 0140); answers 11 boundary questions in one compact file.

---

## 1. What this doc covers

The CLI-based orchestrator-lite model: supervised implementer CLIs (Claude Code, Windsurf) coordinated via GitHub queue, short prompts, and explicit user gates. This is a simpler, lower-infrastructure path than the Cursor/n8n dual-agent loop (task 0140).

**Relationship to task 0140:** task 0140 uses n8n + Ollama + Cursor CLI force-mode. This doc covers the manual/supervised variant that is already operational and defines what could be incrementally automated from it.

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

## 11. What is explicitly not authorized now

- Creating any runner, script, scheduler, or n8n workflow for autonomous task dispatch
- Activating any GitHub Action or VPS cron for task processing
- Installing new CLIs or tools for this workstream
- Giving orchestrator-lite write access to any system other than GitHub docs paths
- Removing human gate requirement from any sensitive action
- Merging or deploying without explicit user confirmation

Dual CLI remains **LATER/GATED** until the user explicitly opens runtime implementation after this design gate.
