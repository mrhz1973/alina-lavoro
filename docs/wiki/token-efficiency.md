# Wiki — Token Efficiency Navigation Guide

**For AI agents:** use this guide to read only what you need.  
**Rule:** read derived wiki first, then canonical docs only when necessary.

---

## Minimum Read Protocol

For any new session or task:

1. `docs/LLMS.md` (≤ 200 lines) — current state + pointers
2. `docs/wiki/current-state.md` (≤ 100 lines) — state snapshot
3. The specific canonical doc for your task area (see map below)

**Do not read PROJECT_STATE.md unless LLMS.md + wiki cannot answer your question.**

---

## Navigation Map

| Question | Read first | Read if more detail needed |
|----------|-----------|---------------------------|
| Current app version and status? | `docs/LLMS.md` | `docs/PROJECT_STATE.md` |
| Active workstream and next task? | `docs/LLMS.md` | `docs/CHECKPOINT.md` |
| Open technical debts? | `docs/wiki/current-state.md` | `docs/PROJECT_STATE.md` |
| Orchestrator rules and priorities? | `docs/ORCHESTRATOR_RULES.md` | — (always read in full) |
| What should I do as implementer? | `docs/AI_RULES.md` | `docs/WORKFLOW.md` |
| What commands are available? | `docs/COMMANDS.md` | — |
| What tasks are in queue? | List `docs/tasks/queue/` | specific task file |
| Restart context? | `docs/CHECKPOINT.md` | `docs/PROJECT_STATE.md` |
| n8n queue reader behavior? | `docs/automation/n8n-workflows/queue-reader.md` | — |
| Decision Packet format? | `docs/automation/decision-packet-format.md` | — |
| Low-touch loop architecture? | `docs/automation/autonomous-low-touch-loop-design.md` | — |
| Task lifecycle ownership? | `docs/automation/n8n-workflows/lifecycle-ownership.md` | — |
| Roadmap and app history? | `docs/roadmap.md` | — |
| App rollback references? | `docs/LLMS.md` | `docs/PROJECT_STATE.md` |

---

## Token Efficiency Rules

1. Read `docs/LLMS.md` first — always, at every session start.
2. If LLMS.md answers your question, stop. Do not open PROJECT_STATE.md.
3. If you need state details not in LLMS.md, read `docs/wiki/current-state.md` next.
4. Only read `docs/PROJECT_STATE.md` for full historical context or audit.
5. Always read `docs/ORCHESTRATOR_RULES.md` in full — it is compact and contains hard rules.
6. Read `docs/AI_RULES.md` + `docs/WORKFLOW.md` when implementing any task.
7. Do not read `docs/sessions/` unless debugging a specific past incident.
8. Do not read all files in `docs/automation/` — read only the specific design doc needed.
9. Do not read `docs/tasks/done/` unless auditing task history.
10. Do not read `gas-current/` — it is a read-only snapshot, not a source for active work.

---

## What NOT to Read Unnecessarily

| File / Directory | When to skip |
|-----------------|--------------|
| `docs/PROJECT_STATE.md` (full) | If LLMS.md + wiki/current-state.md answer your question |
| `docs/CHECKPOINT.md` (full) | If LLMS.md gives you enough context |
| `docs/sessions/*` | Skip unless debugging a specific past event |
| `docs/automation/*.md` (all) | Read only the one design doc relevant to your task |
| `docs/tasks/done/*` | Skip unless auditing or researching task history |
| `docs/tasks/queue/*` (all files) | Read only the task file assigned to you |
| `gas-current/*` | Skip entirely for active development work |

---

## Update Protocol

| File | Trigger | Owner | Constraint |
|------|---------|-------|------------|
| `docs/LLMS.md` | Every task completion | Implementer | Update with PROJECT_STATE, same commit |
| `docs/wiki/current-state.md` | Every task completion | Implementer | Keep ≤ 100 lines; no inline history |
| `docs/wiki/token-efficiency.md` | When navigation rules change | Implementer (explicit task) | Targeted edit only |
| `docs/wiki/README.md` | When wiki structure changes | Implementer (explicit task) | Targeted edit only |
| Canonical docs (Level 0/1) | Only via explicit task | Orchestrator / Implementer | Never modified by wiki update alone |

**Conflict resolution:** if wiki content contradicts canonical docs, canonical docs are correct.  
Update the wiki to match. Never modify canonicals to match the wiki.

---
→ Entry point: `docs/LLMS.md`  
→ State snapshot: `docs/wiki/current-state.md`  
→ Wiki index: `docs/wiki/README.md`
