# LLM Wiki / Token Efficiency Design — Local AI Level 2

**Data:** 2026-05-12  
**Task:** 0132-llm-wiki-token-efficiency-design  
**Tipo:** low-touch-loop-docs-only  
**Stato:** completato

---

## Executive Summary

This document defines the "LLM Wiki / Local AI Level 2" layer: a derived, AI-friendly memory structure that reduces token consumption and repeated reads for all agents operating on the Alina Lavoro project (ChatGPT orchestrator, Claude Code, Cursor, Windsurf, future n8n agents).

**Core principle:** GitHub and canonical documents remain the source of truth. `docs/LLMS.md` and `docs/wiki/` are derived memory. If wiki and canonicals diverge, canonicals always win.

**Estimated impact:** 40–80% token reduction per session depending on agent type and query, with zero runtime required.

**Decision Packet:** not emitted. The architecture is uniquely determined by the constraints (docs-only, zero runtime, compatibility with existing low-touch stack). No real choice between equivalent alternatives exists.

---

## 1. Context and Problem

### Why this is the priority before Ollama

The bottleneck in the current low-touch loop is not the absence of a classifier/planner — it is the **context width** that every agent must load at each session start.

Current cost per agent session:

| Document | Approx size | Necessity |
|----------|------------|-----------|
| `docs/PROJECT_STATE.md` | 47k+ chars (warning active) | State context |
| `docs/CHECKPOINT.md` | 15k+ chars | Restart context |
| `docs/ORCHESTRATOR_RULES.md` | 10k+ chars | Rules |
| `docs/AI_RULES.md` | 5k+ chars | Implementer rules |
| `docs/WORKFLOW.md` | 5k+ chars | Workflow |
| `docs/COMMANDS.md` | 5k+ chars | Commands |

Every agent, every task, every state read = full reload of this stack. This is the most frequent and costly micro-interaction in the system, occurring more often than even the "aggio" write.

A synthetic derived layer solves this without any installation.

### Relation to PROJECT_STATE compaction debt

Two complementary but distinct approaches:

| Approach | What it solves | When |
|----------|---------------|------|
| Wiki (this task) | Reduces the *need* to read PROJECT_STATE frequently | Now — docs-only |
| Compaction of PROJECT_STATE | Reduces the *size* of PROJECT_STATE when it is read | Future docs-only task |

The wiki can and should be created before compaction. It reduces the problem immediately. Compaction eliminates the residual cost when the full state is genuinely needed.

---

## 2. Memory Hierarchy

The project's knowledge is organized in four levels:

| Level | Files | Authority | Purpose |
|-------|-------|-----------|---------|
| **0 — Rules** | `docs/ORCHESTRATOR_RULES.md`<br>`docs/AI_RULES.md`<br>`docs/WORKFLOW.md`<br>`docs/COMMANDS.md` | Canonical — permanent rules | Defines how the system works |
| **1 — State** | `docs/PROJECT_STATE.md`<br>`docs/CHECKPOINT.md` | Canonical — authoritative state | Defines what the system is doing |
| **2 — Wiki** | `docs/LLMS.md`<br>`docs/wiki/` | Derived — token-efficient | Fast access layer |
| **3 — Future** | Local index / embeddings / Ollama | Runtime-gated — not yet | Semantic search, zero-API classifier |

**Conflict rule (absolute):** if Level 2 (wiki) conflicts with Level 0 or Level 1 (canonicals), the canonicals are correct. Update the wiki to match, never the reverse.

**Update rule:** Level 2 is updated at the same frequency as Level 1 — every completed task. Not more, not less.

---

## 3. Definition of `docs/LLMS.md`

`docs/LLMS.md` is the **single entry point** for all agents at session start.

### Format requirements

- Maximum 200 lines.
- Contains: current app version, operational branch, active workstream, last completed task, next planned task, VPS status, open technical debts, open gates, and a navigation table.
- Points to canonical docs for all details.
- Does not contain inline history.
- Does not duplicate rules from `docs/ORCHESTRATOR_RULES.md`.
- Updatable without reading the full PROJECT_STATE — updated from the new task's summary alone.

### Reading protocol

An agent reading `docs/LLMS.md` should be able to answer these questions without reading any other file:

1. What version is the app? Is it in scope for active work?
2. What is the active workstream?
3. What was the last completed task? What is the next one?
4. Are there open gates that block the next action?
5. Where do I find the specific canonical doc for my area?

If any of these cannot be answered from LLMS.md alone, the file needs updating.

---

## 4. Structure of `docs/wiki/`

Three files define the wiki layer:

### `docs/wiki/current-state.md`

- Maximum 100 lines.
- Synthetic snapshot: app version, branch, deploy, active workstream, current task, open debts.
- Derived from PROJECT_STATE; no inline history.
- Does not copy paragraphs from PROJECT_STATE — only extracts key facts.

### `docs/wiki/token-efficiency.md`

- Navigation guide for agents.
- Answers: "What should I read for question X?"
- Maps common agent questions to the minimum set of files needed.
- Includes "what NOT to read" for each scenario.
- Includes the update protocol for wiki files.

### `docs/wiki/README.md`

- Index of the wiki with pointers and navigation notes.
- Describes the memory hierarchy.
- States the conflict resolution rule (canonicals win).

### Rules for all wiki pages

1. Brief: ≤ 150 lines per page.
2. Agent-oriented, not human-oriented.
3. Always links back to canonical docs for detail.
4. No copied blocks from PROJECT_STATE.md.
5. No inline history.
6. No personal data, credentials, tokens, API keys, OAuth material.
7. No raw URLs with sensitive parameters.
8. No deploy IDs — these belong in canonical docs only.

---

## 5. Navigation Map

Standard mapping from agent question to minimum read:

| Question | Primary read | Secondary (if needed) |
|----------|-------------|----------------------|
| Current app version and status | `docs/LLMS.md` | `docs/PROJECT_STATE.md` |
| Active workstream | `docs/LLMS.md` | `docs/CHECKPOINT.md` |
| App rollback references | `docs/LLMS.md` | `docs/PROJECT_STATE.md` |
| Orchestrator rules | `docs/ORCHESTRATOR_RULES.md` | — (always read in full) |
| Implementer rules and workflow | `docs/AI_RULES.md` | `docs/WORKFLOW.md` |
| Commands and controls | `docs/COMMANDS.md` | — |
| Task queue | listing of `docs/tasks/queue/` | specific task file |
| Open technical debts | `docs/wiki/current-state.md` | `docs/PROJECT_STATE.md` |
| Restart context | `docs/CHECKPOINT.md` | `docs/PROJECT_STATE.md` |
| n8n queue reader behavior | `docs/automation/n8n-workflows/queue-reader.md` | — |
| Decision Packet format | `docs/automation/decision-packet-format.md` | — |
| Low-touch loop architecture | `docs/automation/autonomous-low-touch-loop-design.md` | — |
| Task lifecycle ownership | `docs/automation/n8n-workflows/lifecycle-ownership.md` | — |
| Roadmap | `docs/roadmap.md` | — |

---

## 6. Update Protocol

| File | When to update | Who updates | How |
|------|---------------|-------------|-----|
| `docs/LLMS.md` | Every task completion | Implementer | Update together with PROJECT_STATE |
| `docs/wiki/current-state.md` | Every relevant task completion | Implementer | Rewrite state section; keep ≤ 100 lines |
| `docs/wiki/token-efficiency.md` | When navigation rules change | Implementer (explicit task) | Targeted edit |
| `docs/wiki/README.md` | When wiki structure changes | Implementer (explicit task) | Targeted edit |

**Conflict resolution:**
If wiki content contradicts canonical docs, the canonical docs are correct. The implementer updates the wiki to match during the next task that touches the area. No separate task needed for minor corrections.

**Anti-duplication rule:**
Each wiki page contains at most 3 lines of content per area — a fact, a pointer, and a note. The detail lives in the canonical doc. When in doubt, replace detail with a pointer.

---

## 7. Token Savings Estimate

Qualitative estimates (order of magnitude, not precise measurements):

| Scenario | Before | After | Estimated saving |
|----------|--------|-------|-----------------|
| Agent reads state for new task | PROJECT_STATE (47k+) + CHECKPOINT + rules | LLMS.md (≤200 lines) + wiki/current-state.md | ~70–80% |
| ChatGPT reconstructs state after `aggio` | Full PROJECT_STATE + canonicals | LLMS.md + diff canonicals if needed | ~50–60% |
| Claude Code session start | PROJECT_STATE + CHECKPOINT + AI_RULES + WORKFLOW | LLMS.md + AI_RULES (unchanged) | ~40–50% |
| n8n generates prompt from template | Template + full context | LLMS.md as minimal context | ~30–40% |
| Future Ollama classifier reads task | Full project context | LLMS.md + specific task file | ~60–70% |

**Cumulative impact:** if 10 agent sessions per day each read 50k tokens in context, and the wiki reduces this by 60% on average, the daily token saving is ~300k tokens. Over a month: ~9M tokens. This is the highest-impact zero-runtime optimization available in the project.

---

## 8. Future Plan: Ollama and Local AI (Non-Runtime)

This section documents the future direction without activating anything now.

### Hardware available

| Machine | Specs | Ollama suitability |
|---------|-------|--------------------|
| **MacBook Pro M2** | Apple Silicon, unified memory | ✅ Always-on lightweight orchestrator; 7B/8B sustainable; low latency for classifier/planner |
| **Workstation RTX 3060 12GB** | NVIDIA, 12GB VRAM | ✅ Greater local AI capacity; models up to 14B possible; suitable for heavier tasks (embeddings, light fine-tuning) |
| **VPS IONOS** | CPU-only, economical | ❌ Not suitable for LLM inference; keep for n8n runtime only |

### Target models for Phase C (future)

| Use case | Models | Hardware |
|----------|--------|----------|
| Classifier / planner (default) | Llama 3.1 8B, Mistral 7B, Qwen2.5 7B | MacBook Pro M2 |
| Heavy analysis | Qwen2.5 14B, Mistral 12B | RTX 3060 (only if 12GB VRAM is sufficient) |
| Local embeddings | nomic-embed-text, all-minilm | Either machine |

### Activation prerequisites (all runtime-gated, not now)

1. Task: Ollama local preflight (feasibility + quality test on synthetic tasks, not Alina app data).
2. Task: embeddings design (model selection, vector store, query interface).
3. Explicit manual gate before any installation.
4. Cost/benefit analysis of local vs API (both should be measured, not assumed).

### Why wiki before Ollama

The wiki creates the compact context layer that Ollama will consume. Running Ollama without a compact context means the classifier reads the full PROJECT_STATE — the same problem as today, now shifted to a local model. The wiki solves the problem at the source.

---

## 9. Wiki Security Rules

All wiki files are public (same visibility as the rest of the repository). Apply:

- No personal data (names, addresses, contacts beyond what is already public).
- No credentials, tokens, API keys, OAuth material.
- No raw URLs with sensitive query parameters.
- No Apps Script deployment IDs in wiki files — these belong in canonical docs only.
- No session tokens, VPS passwords, or login information.
- No information that would allow unauthorized access to any system.

---

## 10. Relation to PROJECT_STATE Compaction Debt

| Aspect | Wiki (this task) | Compaction (future task) |
|--------|-----------------|------------------------|
| Goal | Reduce frequency of reading PROJECT_STATE | Reduce size of PROJECT_STATE |
| Timing | Now | When workstream is stable |
| Risk | Low — additive, no changes to canonicals | Medium — modifies a core file |
| Dependency | None | None (independent) |
| Combined effect | Reduces need × reduces size = maximum token savings | — |

**Sequencing:** create wiki now, schedule compaction task independently when the watcher/runner workstream reaches a stable checkpoint.

---

## 11. Roadmap Preservation

Confirmed order after task 0132:

| Task | Title | Status |
|------|-------|--------|
| 0131 | n8n Decision Packet Generator Design | ✅ Completed |
| **0132** | LLM Wiki / Token Efficiency Design | ✅ Completed (this task) |
| Next | Ollama Classifier/Planner Feasibility (reworked post-wiki) | Planned |
| After | Implementer Bridge Design | Planned |
| Debt | PROJECT_STATE Compaction | Flexible timing |

Order changes only via Decision Packet (kind: `meta` or `automation`).

---

## 12. Boundaries: Docs-Only vs Runtime-Gated

| Component | Phase | Gate |
|-----------|-------|------|
| Wiki design (this doc) | Docs-only | No runtime gate |
| `docs/LLMS.md` creation | Docs-only | No runtime gate |
| `docs/wiki/*.md` creation | Docs-only | No runtime gate |
| Update protocol definition | Docs-only | No runtime gate |
| Ollama local installation | Runtime-gated | Explicit manual gate |
| Local embeddings | Runtime-gated | Explicit manual gate |
| Local semantic index | Runtime-gated | Explicit manual gate |
| Model fine-tuning | Runtime-gated | Explicit manual gate |
| n8n integration of wiki | Runtime-gated | Explicit manual gate |

---

## 13. MVP: What is Deliverable Now

All of the following are implemented in this task (docs-only, zero runtime):

1. ✅ `docs/LLMS.md` — compact agent entry point (≤ 200 lines)
2. ✅ `docs/wiki/current-state.md` — current state snapshot (≤ 100 lines)
3. ✅ `docs/wiki/token-efficiency.md` — navigation guide for agents
4. ✅ `docs/wiki/README.md` — wiki index
5. ✅ CLAUDE.md updated — LLMS.md added to required reading (minimal, non-redundant)
6. ✅ PROJECT_STATE, CHECKPOINT, roadmap updated with task completion

Not implemented (reserved for future runtime-gated tasks):
- Ollama installation
- Local embeddings
- Semantic index
- n8n integration for wiki updates
- `docs/INBOX.md` creation

---

## 14. Language Policy as Token Efficiency Multiplier

**Added post-task 0133 (2026-05-12) — docs-only update.**

Language choice is a direct token efficiency lever, particularly for local 7B/8B models.

### Rule

| Context | Language | Rationale |
|---------|----------|-----------|
| Internal prompts, system prompts, prompt skeletons | Technical English | Fewer tokens per concept; higher instruction-following precision in small models |
| JSON/YAML structured classifier/planner output | Technical English | Machine-readable field names; consistent parsing |
| Wiki agent-facing files (`docs/LLMS.md`, `docs/wiki/`) | Technical English preferred | Reduces token count for every agent session that reads these files |
| n8n AI layer, future Ollama classifier/planner | Technical English | Empirical basis: qwen3:8b produces less verbose, more structured output in English for technical tasks |
| Final user-facing summaries (orchestrator → user) | Italian | User expects Italian; orchestrator (ChatGPT) responds in Italian |
| Canonical project docs | Italian (keep as-is) | No retroactive translation — the cost outweighs the benefit |

### Token Impact

This policy is a **multiplicative** improvement on top of the wiki structure:

- Wiki reduces *how much* is read per session (~70–80% reduction)
- Language policy reduces *how many tokens* are needed per line of that reduced read (~10–20% additional saving for English-facing wiki content)
- Combined: maximum token efficiency for local AI sessions

### Empirical Basis

User observation (2026-05-12): qwen3:8b via Ollama operates in Italian but is more verbose and less precise on technical concepts. English technical phrasing improves instruction following stability and reduces hallucinated structure.

### Canonical reference

Full rule in `docs/AI_RULES.md` — "Language policy for agents". This section is the design rationale. Do not duplicate the full rule here.

---

## Conclusion

The LLM Wiki / Token Efficiency layer is the highest-impact zero-runtime optimization available in the Alina Lavoro project. It addresses the root cause of per-session token cost: agents loading the full historical PROJECT_STATE and canonical stack at every invocation.

By providing a compact derived layer (`docs/LLMS.md` + `docs/wiki/`), agents can answer 80% of their orientation questions from ≤ 300 lines of content instead of 80k+ characters. The canonicals remain authoritative and unchanged. The wiki is updated at the same cadence as PROJECT_STATE, adding no new maintenance burden.

**This is docs-only. No runtime was modified. No app was touched. No installations.**

---
**Design document for task 0132 — LLM Wiki / Token Efficiency Design**
