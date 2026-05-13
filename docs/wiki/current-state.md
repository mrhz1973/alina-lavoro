# Wiki — Current State Snapshot

**Derived memory (Level 2) — last updated: 2026-05-13 (post-state compression)**
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
| Last completed | 0139 — Auto-Aggio Prompt-Generation Handshake Design (2026-05-13) — docs-only design completed; clarifies that "aggio" is not only status refresh but prompt-generation handshake; defines flows with/without decisions; activation channels; hybrid architecture; Ollama role; security rules; no runtime/integration/API |
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
| PROJECT_STATE.md / CHECKPOINT.md physical compression | Completed 2026-05-13 | History moved to docs/history/PROJECT_LOG.md (audit-only) |
| `docs/INBOX.md` not created | Pending | Future mixed/runtime-gated task |

---

## Rollback References

| Version | Tag | Deploy |
|---------|-----|--------|
| V1.9.1 | `v1.9.1-stable` | @23 |
| V1.9.0 | `v1.9.0-stable` | @22 |
| V1.8.10 | `v1.8.10-stable` | @21 |

Full deploy history → `docs/PROJECT_STATE.md`
Full project history → `docs/history/PROJECT_LOG.md` (audit-only, not default read)

---
→ Mandatory read order: `docs/LLMS.md` → this file → `docs/wiki/token-efficiency.md` → task file → task-specific canonicals
→ Full state (fallback/audit only): `docs/PROJECT_STATE.md` — do NOT read by default
→ Restart context (fallback only): `docs/CHECKPOINT.md` — do NOT read by default
