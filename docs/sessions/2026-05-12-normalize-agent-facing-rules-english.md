# Session — Normalize agent-facing rules in English

**Date:** 2026-05-12  
**Type:** docs-only  
**Task:** Normalize agent-facing operational rules toward technical English

---

## Context

The language policy for agents was introduced in task 0133 (commit `b4decf5`) and formalized in:
- `docs/AI_RULES.md` — "Language policy for agents" section
- `docs/LLMS.md` — "Agent Language" section
- `docs/wiki/token-efficiency.md` — "Language Efficiency" table
- `docs/automation/local-llm-wiki-token-efficiency-design.md` — section 14
- `docs/automation/ollama-classifier-planner-feasibility-post-wiki.md` — section 12

**Rule established:** technical English for internal agent reasoning, prompts, JSON/YAML, classifier/planner, wiki agent-facing content. Italian for final user-facing summaries and orchestrator output.

---

## Problem

Despite the policy being defined, the key agent-facing operational rule files remained in Italian:
- `docs/AI_RULES.md` — all operational sections were in Italian except the Language policy table
- `docs/WORKFLOW.md` — entirely in Italian
- `docs/ORCHESTRATOR_RULES.md` — no English-accessible summary for new agents/implementers
- `docs/tasks/templates/cursor-prompt-default.md` — header documentation in Italian

This created linguistic fragmentation: the policy said "use English" but the rules telling agents what to do were in Italian. This is especially costly for local 7B/8B models (Ollama), future classifier/planner, and new sessions with cold context.

---

## Decision

Normalize agent-facing operational rules to technical English without:
- translating historical canonical docs retroactively
- translating user-facing project state (PROJECT_STATE.md, CHECKPOINT.md) in full
- creating bilingual duplicate blocks
- translating sessions or history files

---

## Files modified

| File | Change |
|------|--------|
| `docs/AI_RULES.md` | Full conversion to technical English. Content unchanged; language normalized. Language policy table remains as canonical English reference. |
| `docs/WORKFLOW.md` | Full conversion to technical English. Same structure and content. |
| `docs/ORCHESTRATOR_RULES.md` | New "Agent-facing operational summary (English)" section added after the intro paragraph, before PRIORITÀ 0A. Historical Italian content untouched. |
| `docs/LLMS.md` | One line added to "Agent Language" section: "Agent-facing operational rules (`docs/AI_RULES.md`, `docs/WORKFLOW.md`) are normalized in technical English." |
| `docs/tasks/templates/cursor-prompt-default.md` | Header documentation section converted from Italian to English. Operative prompt block (already English) unchanged. |
| `docs/PROJECT_STATE.md` | Brief synthesis prepended to "Ultimo aggiornamento" paragraph. |
| `docs/CHECKPOINT.md` | Brief synthesis prepended to "Ultimo aggiornamento" paragraph. |

---

## What was normalized

- Implementer rule: no unnecessary confirmations
- Operational roles definitions
- Before acting checklist (sync with GitHub, branch, read-only constraints)
- Mandatory rule: GitHub always updated
- End-of-block checklist (status, docs, checks, commit, push, final report)
- Standard frontend checks formula
- Step-by-step and operational blocks rules
- Working mode rules (Plan before Agent, no git add ., targeted commits)
- Quality and output rules
- Sensitive commands and gates list
- Workflow roles and responsibilities
- Workflow conversational commands table
- aggio / checkpoint / finito behavior descriptions
- Branch and release relationship rules
- Cursor prompt template documentation header

---

## What was NOT translated

- `docs/PROJECT_STATE.md` body — historical state, Italian kept
- `docs/CHECKPOINT.md` body — restart context, Italian kept
- `docs/roadmap.md` — product history, Italian kept
- `docs/COMMANDS.md` — technical commands, already clear as-is
- `docs/sessions/*` — all historical sessions, untouched
- `docs/automation/*.md` — existing automation design docs, untouched
- Italian content of `docs/ORCHESTRATOR_RULES.md` — left intact; only added English summary section
- App Alina user-facing text — untouched

---

## Risks mitigated

- **Fragmentation:** key rule files now coherent with language policy
- **Token cost:** implementers (especially local models) now read English rules without language-switching overhead
- **Ambiguity:** no more bilingual duplication; one language per context
- **Retroactive translation risk:** avoided by leaving historical docs untouched

---

## Confirmation

- No runtime executed
- No Ollama install, no model download
- No app changes (`src/**` untouched)
- No deploy, tag, rollback
- No VPS changes
- No n8n runtime changes
- No API key, login, GitHub Actions
- No automatic runner activated
- `gas-current/**` untouched
- `package.json`, `appsscript.json` untouched
- No bilingual duplicate blocks created
- No sessions or history files translated
