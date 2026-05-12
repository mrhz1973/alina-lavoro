# Wiki — Current State Snapshot

**Derived memory (Level 2) — last updated: 2026-05-12 (task 0133)**
**Canonical source:** `docs/PROJECT_STATE.md`

---

## App

| Field | Value |
|-------|-------|
| Version | **V1.9.2** |
| Tag | `v1.9.2-stable` |
| Branch | **main** |
| Apps Script | **@24** |
| Last test | OK 2026-05-10 (Redmi 9C NFC) |
| Scope | Stable — not touched during automation workstream |

---

## Active Workstream

**automation / watcher / runner / low-touch**  
Constraint: do not return to Alina app work until this workstream is closed.

---

## Task State

| Item | Value |
|------|-------|
| Last completed | 0133 — Ollama Classifier/Planner Feasibility Post-Wiki |
| Next planned | Gate 7 → task 0134 Ollama Local Preflight Install (runtime-gated) |
| Queue | `docs/tasks/queue/` |

---

## n8n Runtime

- Schedule polling: **active** (5 min, Europe/Berlin)
- Queue reader: validated — skip done / processing / failed
- `has_task:true` path: validated end-to-end (task 0116)

---

## VPS

Ubuntu 24.04.4 LTS | Docker/n8n at `127.0.0.1:5678` (hardened)  
Node.js 18.19.1 | Claude Code CLI 2.1.139 | login blocked | no runner

---

## Open Technical Debts

| Debt | Status | Task |
|------|--------|------|
| `PROJECT_STATE.md` > 47k chars | Pending | Future docs-only (flexible timing) |
| `docs/INBOX.md` not created | Pending | Future mixed/runtime-gated task |

---

## Rollback References

| Version | Tag | Deploy |
|---------|-----|--------|
| V1.9.1 | `v1.9.1-stable` | @23 |
| V1.9.0 | `v1.9.0-stable` | @22 |
| V1.8.10 | `v1.8.10-stable` | @21 |

Full deploy history → `docs/PROJECT_STATE.md`

---
→ Entry point: `docs/LLMS.md`  
→ Full state: `docs/PROJECT_STATE.md`
