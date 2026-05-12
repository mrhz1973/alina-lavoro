# Session — Enforce LLMS-first routing

**Date:** 2026-05-12  
**Type:** docs-only  
**Task:** Enforce LLMS-first agent routing — remove PROJECT_STATE.md and CHECKPOINT.md from default session start reads

---

## Context

The LLM Wiki / Token Efficiency layer was introduced in task 0132:
- `docs/LLMS.md` — compact agent entry point (≤200 lines)
- `docs/wiki/current-state.md` — state snapshot (≤100 lines)
- `docs/wiki/token-efficiency.md` — navigation rules

However, `CLAUDE.md` still instructed Claude Code to read the full list including `PROJECT_STATE.md` and `CHECKPOINT.md` at every session start, defeating the token efficiency goal.

---

## Problem

`CLAUDE.md` "Required reading at session start" listed:
- `@docs/ORCHESTRATOR_RULES.md`
- `@docs/PROJECT_STATE.md` ← **default startup read, large file**
- `@docs/CHECKPOINT.md` ← **default startup read, large file**
- `@docs/WORKFLOW.md`
- `@docs/AI_RULES.md`
- `@docs/COMMANDS.md`
- `@docs/roadmap.md`

`PROJECT_STATE.md` is >47k chars. Reading it by default at every session start consumed significant context, canceling the benefits of the wiki layer.

---

## Decision

Enforce LLMS-first routing as a mandatory protocol:
1. `docs/LLMS.md` first
2. `docs/wiki/current-state.md` second
3. `docs/wiki/token-efficiency.md` third
4. Assigned task file
5. Only task-specific canonical docs
6. `docs/PROJECT_STATE.md` — fallback/audit only; must justify if opened
7. `docs/CHECKPOINT.md` — restart context only; must justify if opened

---

## Exact routing rule

```
Mandatory read order:
1. docs/LLMS.md         — always first, every session
2. docs/wiki/current-state.md  — always second
3. docs/wiki/token-efficiency.md — always third
4. assigned task file   — if any
5. task-specific canonicals only (e.g. COMMANDS.md for frontend, automation docs for automation tasks)

Fallback/audit (open only when needed, justify in report):
- docs/PROJECT_STATE.md — full historical state, large file
- docs/CHECKPOINT.md    — restart context

Always read (compact, hard rules):
- docs/ORCHESTRATOR_RULES.md
- docs/AI_RULES.md
- docs/WORKFLOW.md
```

---

## Files modified

| File | Change |
|------|--------|
| `CLAUDE.md` | "Required reading at session start" section replaced with LLMS-first protocol; PROJECT_STATE.md and CHECKPOINT.md removed from default list; warning disclaimer added |
| `docs/ORCHESTRATOR_RULES.md` | "LLMS-first routing rule" added to the Agent-facing operational summary |
| `docs/AI_RULES.md` | New step 0a added to "Before acting": LLMS-first orientation with PROJECT_STATE/CHECKPOINT as fallback |
| `docs/WORKFLOW.md` | "LLMS-first orientation" block added to "Before working (implementer)" section |
| `docs/LLMS.md` | Mandatory read order and fallback disclaimer added at the top |
| `docs/wiki/token-efficiency.md` | Minimum Read Protocol header strengthened; Token Efficiency Rules list updated with explicit fallback rules |
| `docs/wiki/current-state.md` | Footer updated: PROJECT_STATE and CHECKPOINT described as fallback/restart only |
| `docs/tasks/templates/cursor-prompt-default.md` | Reference list updated (LLMS.md + wiki instead of PROJECT_STATE + CHECKPOINT); LLMS-first constraint added to Mandatory constraints; final report now requires justification if large files opened |
| `docs/PROJECT_STATE.md` | Short completion note prepended |
| `docs/CHECKPOINT.md` | Short completion note prepended |

---

## Where PROJECT_STATE / CHECKPOINT default reads were replaced

| Location | Before | After |
|----------|--------|-------|
| `CLAUDE.md` required reading | Included by default in session start list | Removed; described as fallback/audit only |
| `docs/tasks/templates/cursor-prompt-default.md` references | `@docs/PROJECT_STATE.md`, `@docs/CHECKPOINT.md` | Replaced with `@docs/LLMS.md`, `@docs/wiki/current-state.md`, `@docs/wiki/token-efficiency.md` |
| `docs/AI_RULES.md` "Before acting" step 2 | "Read `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md`..." | "Do NOT read by default; fallback/audit only; justify in report" |
| `docs/WORKFLOW.md` "Before working" | "read the relevant documents (PROJECT_STATE, CHECKPOINT...)" | LLMS-first numbered protocol with explicit fallback note |
| `docs/wiki/token-efficiency.md` rules | PROJECT_STATE.md: "Only read for full historical context" | Explicit: "do NOT read by default; fallback/audit; justify" |

---

## Claude Code large-file warning disclaimer

Claude Code may continue showing yellow large-file warnings for `docs/PROJECT_STATE.md` and `docs/CHECKPOINT.md` because:
- the warnings are triggered by the physical size of the files loaded as project memory / context
- this routing task changes the **read instructions** for agents but does not physically compress those files

The warnings will reduce or disappear only after:
- the future physical compression task that splits PROJECT_STATE.md into current-state + history log
- and/or the creation of `docs/history/PROJECT_LOG.md` as the audit-only archive

This task reduces **real context consumption** independently of those warnings.

---

## Future work (not done in this task)

| Item | Status |
|------|--------|
| Physical compression of `PROJECT_STATE.md` | Future docs-only task (flexible timing) |
| Split into current-state + `docs/history/PROJECT_LOG.md` | Future docs-only task |
| `docs/INBOX.md` creation | Future mixed/runtime-gated task |
| Ollama classifier runtime (task 0134) | Runtime-gated, Gate 7 required |
| Auto-Aggio runtime integration | Runtime-gated, future |
| Embeddings / vector store | Runtime-gated, future |

---

## Confirmation

- No runtime executed
- No Ollama install, no model download, no embeddings
- No app changes (`src/**` untouched)
- No deploy, tag, rollback
- No VPS changes
- No n8n runtime changes
- No API key, login, GitHub Actions
- No automatic runner activated
- `gas-current/**` untouched
- `package.json`, `appsscript.json` untouched
- PROJECT_STATE.md and CHECKPOINT.md were read only because this task migrates the routing policy (temporary exception as specified)
- No bilingual duplicate blocks created
- No sessions or history files translated
