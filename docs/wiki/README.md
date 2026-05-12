# Wiki — Alina Lavoro AI Memory Layer

**Purpose:** derived memory layer (Level 2) for token-efficient agent access.  
**Rule:** wiki is derived. Canonical docs always win.  
→ Entry point: `docs/LLMS.md`

---

## Files

| File | Max lines | Purpose |
|------|-----------|---------|
| `docs/LLMS.md` | 200 | Entry point — read first, always |
| `docs/wiki/current-state.md` | 100 | State snapshot — app, workstream, debts |
| `docs/wiki/token-efficiency.md` | — | Navigation guide — what to read for X |
| `docs/wiki/README.md` | — | This index |

---

## Memory Hierarchy

| Level | Files | Authority | When to read |
|-------|-------|-----------|--------------|
| **0 — Rules** | `ORCHESTRATOR_RULES.md`, `AI_RULES.md`, `WORKFLOW.md`, `COMMANDS.md` | Canonical — permanent | Always |
| **1 — State** | `PROJECT_STATE.md`, `CHECKPOINT.md` | Canonical — authoritative | When full detail needed |
| **2 — Wiki** | `LLMS.md`, `docs/wiki/` | Derived — fast access | First, at session start |
| **3 — Future** | Ollama / embeddings index | Runtime-gated | Not yet |

---

## Update Frequency

Same as `docs/PROJECT_STATE.md`: every completed task.  
Wiki files are updated by the implementer at task close, together with PROJECT_STATE.

## Conflict Resolution

If wiki content contradicts canonical docs (Level 0 or 1):  
**canonical docs are correct** — update the wiki to match, never the reverse.

---
→ Start here: `docs/LLMS.md`  
→ Design document: `docs/automation/local-llm-wiki-token-efficiency-design.md`
