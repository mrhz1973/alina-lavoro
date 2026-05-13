# Session — Task 0142 Local Browser Bridge Preflight Design

**Date:** 2026-05-13
**Task:** 0142-local-browser-bridge-preflight-design
**Type:** low-touch-loop-docs-only
**Status:** completed

---

## Why This Design Is Needed Now

Task 0139 (Auto-Aggio Prompt-Generation Handshake) identified the Local Browser Bridge as one of the three activation channels for "aggio":

1. Manual: user writes "aggio" directly
2. Mobile with Telegram: Telegram notifies user → user writes "aggio" from phone
3. **Future Local Browser Bridge**: n8n triggers local bridge → bridge writes "aggio" automatically

Without the bridge, the "aggio" step remains a manual micro-interaction that happens 5–10 times per day. The bridge is the automation component that eliminates this specific micro-interaction for the most common case (task completed with no decisions required).

Task 0140 (Local Cursor Dual-Agent Loop) confirmed that the bridge is part of the return path for the dual-agent loop: after Agent 1 and Agent 2 complete their work, the loop returns to ChatGPT via "aggio". The bridge automates that injection step.

Designing the bridge now (docs-only, no runtime) ensures that when the implementation task is opened, the architectural decisions are already made, the safety controls are already defined, and the team does not need to design under time pressure.

---

## How the Bridge Supports Auto-Aggio

Auto-Aggio (task 0130) defined the mechanism for detecting task completion and generating a summary or Decision Packet automatically. Auto-Aggio Prompt-Generation Handshake (task 0139) extended this: "aggio" is not only a status refresh but a trigger that:

1. Causes ChatGPT to read GitHub
2. Identifies decisions required (or not)
3. If no decisions: generates the next implementer prompt immediately
4. If decisions: produces a Decision Packet and stops

The bridge supports this by writing "aggio" automatically, without requiring the user to type it. The result:

- After a task completes, n8n triggers the bridge.
- The bridge writes "aggio" in ChatGPT web.
- ChatGPT performs the post-check handshake.
- If no decisions: the next implementer prompt is ready when the user looks at their screen.
- The user just pastes the prompt into Claude Code / Cursor / Windsurf.

The bridge's role is the single step: typing "aggio" + pressing Enter. It does not do anything else.

---

## Why the Bridge Is Only an "Automatic Finger"

The term "automatic finger" captures the scope precisely:

- A human finger that types "aggio" and presses Enter does not decide anything.
- A human finger does not read the conversation.
- A human finger does not answer Decision Packets.
- A human finger does not approve merges.

The bridge is a software simulation of that single physical action. Nothing more.

The reason for this strict scope is trust and safety:

1. **Trust**: if the bridge had any additional capability (read content, select options, respond to decisions), it would require a much higher level of trust and review. A "type-only" bridge is trivially auditable: its entire behavior is one string + one key press.

2. **Safety**: any bridge that could write arbitrary content would be a potential attack surface. A bridge that can only write the literal string "aggio" has a very small attack surface.

3. **Architecture clarity**: the decision intelligence lives in ChatGPT (web, on-demand, no API). The implementation intelligence lives in the implementer (Claude Code / Cursor / Windsurf). The bridge has no intelligence and needs none.

---

## How the Bridge Avoids Taking Decisions

The bridge avoids decisions by design:

| Design choice | How it prevents decisions |
|---|---|
| Hardcoded string "aggio" | Bridge cannot write anything that could influence ChatGPT's behavior beyond triggering post-check |
| No content reading | Bridge cannot be "aware" of Decision Packets or conversation state |
| No selector interaction except the input field | Bridge cannot click buttons, links, or options |
| Fail closed | If context is uncertain, bridge aborts without writing anything |
| Kill switch | If bridge behavior is wrong, the user stops it without disabling any functionality |

The bridge's "intelligence" is: find the input field, type "aggio", press Enter. If it cannot do that safely, it does nothing.

---

## How the Bridge Interacts with INBOX

The bridge does not interact with INBOX at all. It has no awareness of INBOX content or state. This is intentional:

- The bridge writes "aggio" regardless of whether INBOX has pending decisions.
- ChatGPT is the component that reads INBOX after receiving "aggio".
- ChatGPT surfaces pending Decision Packets to the user.
- The user responds to the Decision Packet manually.

This design ensures INBOX decision responses remain intentional human actions. The bridge cannot accidentally "decide" anything by writing "aggio" — because "aggio" only triggers a read+post-check, not a decision.

---

## What Remains Future / Runtime-Gated

The following remain strictly future and require explicit manual gates:

- Bridge implementation (Playwright or AutoHotkey script)
- Phase 2 sandbox test (writing "aggio" into a test ChatGPT conversation)
- Phase 3 guarded use in project chat
- n8n-to-local-bridge trigger configuration
- Telegram + bridge trigger coordination
- Bridge monitoring / logging guard setup

Only the **manual dry-run checklist** (Phase 1) is authorized by this design. Everything else requires a separate future task with its own runtime gate.

---

## Why No Runtime Was Executed

This is a docs-only design task. The rationale for not executing runtime in this step:

1. **The design must be documented and reviewed before any script is run.** Running automation before the design is complete creates audit gaps.

2. **The bridge touches ChatGPT web**, which is an external service. Any interaction with external services requires higher scrutiny than local docs work.

3. **The design includes sensitive safety controls** (kill switch, rate limit, fail closed). These must be defined before implementation, not after.

4. **The no-API / no-billing policy must be explicitly confirmed** in the design before any implementation attempts. This is now documented.

5. **The fallback (manual "aggio") remains fully operational.** There is no urgency to implement the bridge before the design is solid.

6. **The implementation is blocked behind a runtime gate** per project policy. This is a deliberate architectural decision: automation of an external service (ChatGPT web) requires explicit human authorization before execution.

---

## Next Steps

The natural next step after this design would be either:

- **Phase 1 manual dry-run checklist**: user manually follows the checklist in Section 9 of the design document. Zero runtime required. Validates the end-to-end "aggio" handshake manually before any automation.
- **Telegram notifier design** (docs-only task): design the n8n-to-Telegram notification workflow for task completion.
- **n8n-to-local-bridge trigger design** (docs-only task): design how n8n will trigger the local bridge.

All are docs-only. Runtime-gated implementation tasks follow only after docs-only designs are approved.

---

## Files Produced

| File | Role |
|------|------|
| `docs/automation/local-browser-bridge-preflight-design.md` | Main design document |
| `docs/tasks/done/0142-local-browser-bridge-preflight-design.md` | Done marker |
| `docs/sessions/2026-05-13-local-browser-bridge-preflight-design.md` | This session report |
| `docs/LLMS.md` | Updated (last completed → 0142) |
| `docs/wiki/current-state.md` | Updated (last completed → 0142) |
| `docs/roadmap.md` | Updated (0142 entry added) |
| `docs/wiki/token-efficiency.md` | Updated (navigation pointer added) |
