# Wiki — Token Efficiency Navigation Guide

**For AI agents:** use this guide to read only what you need.  
**Rule:** read derived wiki first, then canonical docs only when necessary.

---

## Minimum Read Protocol (mandatory — LLMS-first routing)

For any new session or task:

1. `docs/LLMS.md` (≤ 200 lines) — current state + pointers — **always first**
2. `docs/wiki/current-state.md` (≤ 100 lines) — state snapshot — **always second**
3. `docs/wiki/token-efficiency.md` — this file — **always third**
4. The assigned task file (if any)
5. Only the specific canonical doc for your task area (see map below)

**`docs/PROJECT_STATE.md` is FALLBACK/AUDIT only — do NOT read by default.**
Open only when LLMS.md + wiki cannot answer your question. If you open it, justify in your final report.

**`docs/CHECKPOINT.md` is RESTART CONTEXT only — do NOT read by default.**
Open only when restart context is explicitly required. If you open it, justify in your final report.

**Note:** Claude Code large-file warnings for PROJECT_STATE.md and CHECKPOINT.md may remain until a future physical compression task. This routing rule reduces real context consumption independently of those warnings.

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
| Cursor force-mode bridge architecture? | `docs/automation/cursor-cli-force-mode-implementer-bridge-design.md` | — |
| Local classifier wrapper / qwen-alina profile? | `docs/automation/local-classifier-wrapper-qwen-alina-profile-design.md` | — |
| Local classifier wrapper script? | `docs/automation/local-classifier-wrapper-script-design.md` | — |
| qwen-alina Modelfile design? | `docs/automation/qwen-alina-modelfile-design.md` | — |
| Task lifecycle ownership? | `docs/automation/n8n-workflows/lifecycle-ownership.md` | — |
| Pending human decisions? | `docs/INBOX.md` | — (check Pending section first) |
| Dual-agent Cursor loop + fallback plan? | `docs/automation/local-cursor-dual-agent-loop-design.md` | — |
| Local browser bridge preflight? | `docs/automation/local-browser-bridge-preflight-design.md` | — |
| Telegram/browser bridge trigger coordination? | `docs/automation/telegram-browser-bridge-trigger-coordination-design.md` | — |
| Telegram idempotency/state-store implementation design? | `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md` | — |
| Telegram idempotency implementation checklist (pre-runtime)? | `docs/automation/telegram-notifier-idempotency-implementation-checklist.md` | — |
| Telegram idempotency runtime UI handoff (D-0180-A = 1, first step inspection)? | `docs/automation/telegram-idempotency-runtime-ui-handoff.md` | D-0187-A/D-0193-A inconclusive (latest-done drift); D-0197-A not successful (partial pinning); fully-pinned harness design: `docs/automation/telegram-fully-pinned-validation-harness-design.md`; **fully-pinned importable n8n template (template-first policy):** `docs/automation/n8n-workflows/templates/telegram-fully-pinned-validation-harness.template.md` and `.template.json` (D-0202-A superseded; D-0206-A = 1 decided/applied, import/inspection ok 2026-05-14; D-0209-A = 1 decided/applied/completed, `fully pinned duplicate skip succeeded` 2026-05-14 — duplicate-skip conclusively validated; D-0213-A = 3 decided, schedule activation deferred / design-first path opened; D-0217-A = 1 decided/applied/completed, readiness inspection succeeded; D-0221-A = 3 decided — cleanup-first + conditional activation intent; **✅ Schedule activation succeeded batch 0227–0231, 2026-05-14** — Telegram Mode A active scheduled notification-only, first tick success / Telegram arrived; monitoring: `docs/automation/telegram-mode-a-post-activation-monitoring-checklist.md`) |
| Telegram Mode A schedule activation design-first path? | `docs/automation/telegram-mode-a-schedule-activation-design-first-path.md` | — |
| n8n template-first policy (priority time and results)? | `docs/ORCHESTRATOR_RULES.md` (PRIORITY 0B) | `docs/AI_RULES.md` · `docs/WORKFLOW.md` · `docs/automation/n8n-workflows/templates/` |
| Runtime gate checklist / which components are gated? | `docs/automation/runtime-gate-checklist-readiness-matrix.md` | — |
| Runtime gate Decision Packet / gate request playbook? | `docs/automation/runtime-gate-decision-packet-playbook.md` | — |
| Candidate gate backlog / which gate might be next? | `docs/automation/candidate-gate-backlog.md` | — |
| Browser Bridge dry-run tool (implemented task 0150)? | `tools/browser-bridge-dry-run/README.md` | `docs/automation/candidate-gate-backlog.md` |
| Task-ID preflight / LLM Wiki V3.1 guard? | `docs/wiki/task-id-preflight.md` | — |
| Prompt routing + context budget policy? | `docs/wiki/prompt-routing.md` | `docs/wiki/context-budget-policy.md` |
| Template pack index (implementer templates)? | `docs/wiki/template-pack-index.md` | `docs/tasks/templates/` |
| Roadmap and app history? | `docs/roadmap.md` | — |
| App rollback references? | `docs/LLMS.md` | `docs/PROJECT_STATE.md` |
| Optional personal cockpit / Obsidian note? | `docs/automation/runtime-gate-checklist-readiness-matrix.md` | — |

---

## Language Efficiency

| Context | Language | Why |
|---------|----------|-----|
| Internal prompts, system prompts | Technical English | Fewer tokens, higher precision |
| JSON/YAML structured output fields | Technical English | Machine-readable consistency |
| Local models (Ollama, 7B/8B), classifier, planner | Technical English | Better accuracy, less verbosity (empirical: qwen3:8b) |
| Wiki agent-facing content | Technical English preferred | Compact, reduces token cost |
| Final summaries to user | Italian | User-facing output |
| Canonical docs (PROJECT_STATE, roadmap, etc.) | Italian — do not change | No retroactive translation |

Avoid duplicated bilingual blocks. One language per context.

→ Full rule: `docs/AI_RULES.md` — "Language policy for agents"

---

## Token Efficiency Rules

1. Read `docs/LLMS.md` first — always, at every session start.
2. Read `docs/wiki/current-state.md` second — always.
3. Read `docs/wiki/token-efficiency.md` third — always (this file).
4. If LLMS.md + wiki answer your question, **stop**. Do not open PROJECT_STATE.md.
5. Read the assigned task file before any canonical docs.
6. Read only the canonical docs needed for your specific task.
7. **`docs/PROJECT_STATE.md` — do NOT read by default.** Fallback/audit only. If you open it, justify in final report.
8. **`docs/CHECKPOINT.md` — do NOT read by default.** Restart context only. If you open it, justify in final report.
9. Always read `docs/ORCHESTRATOR_RULES.md` in full — it is compact and contains hard rules.
10. Read `docs/AI_RULES.md` + `docs/WORKFLOW.md` when implementing any task.
11. Do not read `docs/sessions/` unless debugging a specific past incident.
12. Do not read all files in `docs/automation/` — read only the specific design doc needed.
13. Do not read `docs/tasks/done/` unless auditing task history.
14. Do not read `gas-current/` — it is a read-only snapshot, not a source for active work.
15. If an agent reads PROJECT_STATE.md or CHECKPOINT.md, it must justify why in the final report.
16. `docs/history/PROJECT_LOG.md` (audit-only) — do not read by default. Contains migrated long historical content from PROJECT_STATE.md and CHECKPOINT.md.
17. Provider APIs are not part of default architecture; Local AI means Ollama/local models; ChatGPT = web/on-demand, Claude Code = supervised usage.
18. **Batch size policy (task 0175):** docs-only pure ≤ 6; docs + DP ≤ 5; docs + design ≤ 4; runtime = 1 step only. Full rule: `docs/ORCHESTRATOR_RULES.md` and `docs/AI_RULES.md`.

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
