# Session — Agent Language Policy for Token Efficiency

**Date:** 2026-05-12  
**Type:** docs-only  
**Status:** completed

---

## Context

After completing the Ollama Classifier/Planner Feasibility (task 0133) and deciding on Windows as the Ollama preflight target, the user tested **qwen3:8b** via Ollama locally.

The project already has a token efficiency layer (task 0132: LLM Wiki) that reduces *how much* document content agents load per session. A complementary optimization was identified: the *language* used in internal agent prompts and machine-readable outputs.

## Problem Observed

User observation (2026-05-12):

> Testing qwen3:8b via Ollama: works in Italian, but less precise and more verbose on technical concepts.

This is consistent with the general behavior of 7B/8B instruction-tuned models:
- Training data for technical/structured tasks is predominantly English
- Italian technical phrasing requires more tokens to express the same concept
- Output verbosity increases when the model "translates" technical reasoning into Italian
- JSON/YAML structured output stability is higher with English field names and English prompts

## Decision

Introduce a formal **language policy for agents** in the project documentation:

| Context | Language |
|---------|----------|
| Internal prompts, system prompts, JSON/YAML, structured outputs | **Technical English** |
| Classifier/planner prompts, prompt skeletons | **Technical English** |
| Wiki agent-facing files (LLMS.md, docs/wiki/) | **Technical English preferred** |
| n8n AI layer, Ollama, future local models | **Technical English** |
| Final output to user, orchestrator summaries, Decision Packets | **Italian** |
| Canonical docs (PROJECT_STATE, roadmap, etc.) | **Italian — no retroactive translation** |

**Canonical rule:** `docs/AI_RULES.md` — section "Language policy for agents".

## Motivation: Token Efficiency Multiplier

The language policy compounds with the wiki layer:

| Optimization | Effect |
|-------------|--------|
| Wiki layer (task 0132) | Reduces *how much* content is read per session (~70–80% reduction) |
| Language policy (this session) | Reduces *how many tokens* per line of that reduced content (~10–20% additional saving for English-facing content) |
| Combined effect | Maximum token efficiency for local AI sessions |

This is zero-cost: no new files, no new structure. Only changes how prompts are written.

## Files Modified

| File | Change |
|------|--------|
| `docs/AI_RULES.md` | New section "Language policy for agents" — canonical rule |
| `docs/ORCHESTRATOR_RULES.md` | New subsection "Language policy" (brief) under implementer model rule |
| `docs/LLMS.md` | New section "Agent Language" (3 lines) |
| `docs/wiki/token-efficiency.md` | New section "Language Efficiency" (table) |
| `docs/automation/local-llm-wiki-token-efficiency-design.md` | New section 14 "Language Policy as Token Efficiency Multiplier" |
| `docs/automation/ollama-classifier-planner-feasibility-post-wiki.md` | New section 12 — language rule for classifier prompts |
| `docs/CHECKPOINT.md` | Brief summary prepended |
| `docs/PROJECT_STATE.md` | Brief summary prepended |
| `docs/roadmap.md` | Note added in Automation section |
| `docs/sessions/2026-05-12-agent-language-policy-token-efficiency.md` | This file |

## Risks Mitigated

| Risk | Mitigation |
|------|------------|
| Inconsistent language across agents | Canonical rule in AI_RULES.md; all agents reference it |
| Retroactive translation overhead | Explicit rule: no retroactive translation of canonical docs |
| Duplicate bilingual blocks | Explicit rule: one language per context, no duplication |
| Future local models ignoring the policy | Rule documented in Ollama feasibility doc (section 12) |

## What Was NOT Done

- No Ollama installation
- No model download
- No local service started
- No n8n runtime modified
- No app Alina modified (V1.9.2 stable, not touched)
- No deploy, tag, rollback
- No VPS changes
- No API key, login, GitHub Actions
- No retroactive translation of canonical docs

## Future Gates (Unchanged)

Gate 7 (Decision Packet + manual user confirmation) is still required before opening task 0134 Windows Ollama Local Preflight (runtime-gated). This language policy session does not constitute Gate 7.

## Next Step

**Gate 7 → task 0134 Windows Ollama Local Preflight Install (runtime-gated)**

When designing the classifier system prompt and benchmark test dataset (gate 1), use technical English as established by this policy.
