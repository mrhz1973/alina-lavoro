# Next Low-Touch Runtime Gate Backlog

**Task:** 0242 (introduced)
**Date:** 2026-05-14
**Type:** docs-only / planning reference
**Status:** active planning document — no gate authorized

---

## 1. Purpose

Compact backlog of possible next runtime gates after Telegram Mode A successful activation. This document does not authorize runtime. Every candidate listed here remains subject to the explicit manual gate process (Decision Packet → INBOX → user decision).

**This document:**
- does **not** open any gate
- does **not** create any Decision Packet
- does **not** add any pending entry to `docs/INBOX.md`
- does **not** authorize any runtime, app, deploy, tag, rollback, API, billing, or key action

---

## 2. Current operational posture

Telegram Mode A is **active** as of 2026-05-14:
- Workflow: `TEST - Alina task completion Telegram notifier`
- Schedule: every 5 minutes
- First tick: success / Telegram arrived
- Status: stable monitoring posture (see `docs/automation/telegram-mode-a-post-activation-stabilization-plan.md`)
- No immediate next runtime gate pending

---

## 3. Candidate groups

### Group 1 — Telegram Mode A monitoring / stabilization

| Candidate | Status | Notes |
|-----------|--------|-------|
| Telegram Mode A observation window | **Operational** | Monitor for 2–3 full cycles; check for duplicates and errors |
| Telegram Mode A incident response | **Ready if needed** | Disable procedure defined; docs-only for now |
| Telegram Mode B (Telegram + Browser Bridge trigger) | **Future candidate** | Requires Browser Bridge project-chat (Group 2) to be in place first |

No new gate required from this group in the immediate term.

---

### Group 2 — Browser Bridge project-chat path

| Candidate | Status | Notes |
|-----------|--------|-------|
| Browser Bridge dry-run | **✅ Implemented** (task 0150) | `tools/browser-bridge-dry-run/`; local-only; no browser |
| Browser Bridge sandbox | **✅ Implemented** (task 0153) | `tools/browser-bridge-sandbox/`; local `file://` only |
| Browser Bridge project-chat write | **Deferred** — `D-0154-A = 2` decided | Cannot proceed without new DP and explicit user response |

Next step in this group: future DP to reconsider project-chat write phase. Not authorized now. Not requested now.

---

### Group 3 — Ollama / local classifier preflight

| Candidate | Status | Notes |
|-----------|--------|-------|
| Ollama install on Windows workstation | **Candidate** (Gate 7 sub-gate) | Reversible, local-only, no billing; requires Gate 7 opening |
| Ollama model pull (e.g. qwen3:14b) | **Deferred** | Cannot proceed until Ollama install gate is open |
| Local classifier wrapper script | **Designed** (task 0137) | Python design in `docs/automation/local-classifier-wrapper-script-design.md`; no code created |
| qwen-alina Modelfile profile | **Designed** (task 0138) | Optional future; no Modelfile created |

Next step in this group: future Gate 7 opening (Ollama install + Cursor CLI). Not authorized now.

---

### Group 4 — n8n template-first improvements

| Candidate | Status | Notes |
|-----------|--------|-------|
| n8n Decision Packet Generator runtime | **Candidate** | Design exists (`docs/automation/n8n-decision-packet-generator-design.md`); runtime gated |
| New n8n workflow or node | **Candidate** | Each change is a separate gate per playbook (task 0146) |
| n8n queue reader modifications | **Candidate** | Only if queue reader behavior needs updating; gated |

Next step: no specific next gate from this group identified at this time.

---

### Group 5 — Implementer alternatives / future sandbox (deferred)

| Candidate | Status | Notes |
|-----------|--------|-------|
| Antigravity, Gemini, or other implementer CLI evaluation | **Future candidate** | Sandbox only; docs-only evaluation first; no runtime authorized; no new billing by default |
| Cursor dual-agent loop | **Deferred** | Held by Cursor limitation window; design in `docs/automation/local-cursor-dual-agent-loop-design.md` |
| Cursor CLI / headless pilot | **Deferred** | Part of Gate 7 (Cursor side); held by Cursor limitation window |

Next step: none authorized. Monitor Cursor limitation period for change.

---

### Group 6 — Out of scope (always)

| Candidate | Status |
|-----------|--------|
| App source modifications (`src/**`) | Out of scope — app Alina V1.9.2 is stable and not in this workstream |
| Apps Script deploy / tag / rollback | Out of scope |
| Provider API / API key / billing (OpenAI, Anthropic, OpenRouter, etc.) | Permanently forbidden by default |

---

## 4. Candidate order guidance

When no active incident and no pending DP, the preferred candidate priority order is:

1. Telegram Mode A stabilization monitoring (currently active, no gate needed).
2. LLM Wiki / docs-only workflow improvements (no gate needed; coherent batch).
3. Browser Bridge project-chat (Group 2) — requires future DP, currently deferred.
4. Ollama local preflight (Group 3) — requires Gate 7 opening, future DP.
5. n8n improvements (Group 4) — as needed, per playbook.
6. Implementer alternatives (Group 5) — docs/design only first; runtime gated.

Rationale: lower-risk, higher-documentation-value candidates before runtime candidates. Do not skip levels.

---

## 5. Rules

- No candidate from this list moves to runtime without an explicit Decision Packet and user response.
- Future runtime requires explicit gate/Decision Packet (see `docs/automation/runtime-gate-decision-packet-playbook.md`).
- Candidate order should favor low-risk docs/design before runtime.
- Do not open a DP unless the user has expressed intent to proceed with a specific candidate.
- Do not create INBOX entries speculatively.

---

## 6. References

- `docs/automation/candidate-gate-backlog.md` — full gate candidate table with anti-creep rules
- `docs/automation/runtime-gate-checklist-readiness-matrix.md` — component status matrix
- `docs/automation/runtime-gate-decision-packet-playbook.md` — gate request process
- `docs/automation/telegram-mode-a-post-activation-stabilization-plan.md` — Mode A monitoring
- `docs/wiki/v31-next-task-selection-rubric.md` — how to choose the next task
