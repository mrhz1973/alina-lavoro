# Session — Task 0143 Telegram + Browser Bridge Trigger Coordination Design

**Date:** 2026-05-13
**Task ID:** 0143
**Type:** low-touch-loop-docs-only
**Implementer:** Claude Code (supervised, local)
**Branch:** main
**Status:** completed

---

## Why trigger coordination is needed now

Tasks 0139 (Auto-Aggio Prompt-Generation Handshake) and 0142 (Local Browser Bridge Preflight) both described future scenarios where Telegram notification and the Local Browser Bridge may fire for the same task completion event. Task 0142 Section 12 explicitly deferred the coordination design to a dedicated future task.

Without a defined coordination model, two problems arise even at the design level:
1. **Ambiguity:** When designing future n8n workflows, it is unclear whether Telegram and bridge should fire concurrently, sequentially, or conditionally.
2. **Duplication risk:** Without idempotency keys and trigger rules, future implementation could send multiple Telegram messages or write "aggio" multiple times per task completion, spamming the user and the ChatGPT session.

Designing coordination now — as a docs-only task — establishes the rules before any runtime implementation begins, ensuring future runtime-gated tasks build on a consistent foundation.

---

## How it prevents duplicate "aggio" and duplicate Telegram messages

The coordination model prevents duplicates through two mechanisms:

**Idempotency key:** The pair `(task_id, commit_hash)` serves as the unique key for each trigger event. Both Telegram and bridge record the last triggered key in a persistent state (local file or n8n variable). If the same key appears again, the trigger is a no-op.

**Rate limit (bridge):** The bridge already has a rate limit of 4 executions per hour (from 0142). This serves as a secondary protection against rapid-fire triggers even if the idempotency state is lost.

**Bridge delay (Mode B):** In Mode B (Telegram + Bridge), the bridge fires after a configurable delay (e.g., 30 seconds) after Telegram. This reduces the chance of a race condition where both the user (responding to Telegram) and the bridge write "aggio" simultaneously in ChatGPT web. If the user writes "aggio" first, the bridge may detect idle state or simply accept that a second "aggio" from the bridge is harmless (ChatGPT handles duplicate "aggio" idempotently if state has not changed).

---

## Why Telegram and bridge have separate roles

The role separation is by design, not convention:

- **Telegram** is a human-visible channel. Its job is to inform the user that something happened. The user may or may not need to act. Telegram is phone-based and reaches the user wherever they are.
- **Bridge** is a local UI automation tool. Its job is to inject "aggio" into ChatGPT web on the always-on workstation. It requires a running browser, a logged-in ChatGPT session, and a local machine that is awake. It has no human-facing output.

If Telegram also wrote "aggio" (via some future API-based approach), it would require provider API access, which is out of scope by the ZERO API policy. If the bridge also sent Telegram messages, it would need credentials for the Telegram bot, creating unnecessary coupling.

Keeping the roles separate means either channel can fail independently without the other breaking: if the bridge fails, Telegram still notifies the user; if Telegram fails, the bridge still writes "aggio" and ChatGPT still receives the post-check trigger.

---

## How it interacts with INBOX

The INBOX interaction rule is simple: **the bridge is unaware of INBOX; Telegram may inform of INBOX pending items; ChatGPT reads INBOX after "aggio" and surfaces Decision Packets to the user.**

This separation is intentional:
- If the bridge read INBOX and decided whether to write "aggio", it would become a decision agent — violating its fundamental constraint (it writes only "aggio").
- If Telegram resolved Decision Packets (by including response codes in the message), it would bypass the intentional human gate that makes Decision Packets meaningful.
- ChatGPT is the layer that synthesizes state: GitHub done markers, INBOX pending items, task history. It is the only actor that can correctly identify what the user needs to act on.

The INBOX-aware Telegram message template is informational only: "pending decision D-NNNN-X" tells the user to check their ChatGPT chat. The user still manually responds with `D-NNNN-X = N`.

---

## What remains future / runtime-gated

The following are explicitly deferred to future tasks with separate runtime gates:

1. **Telegram notifier runtime setup** — configure Telegram bot, chat ID, n8n Telegram node on VPS.
2. **n8n Telegram notification node** — add to n8n done-detection workflow.
3. **Bridge Phase 2/3** (from 0142) — implement bridge in sandbox, then project chat.
4. **n8n-to-local-bridge trigger** — configure n8n to call local bridge after Telegram.
5. **Trigger coordination runtime dry-run** — first end-to-end Mode B test with a real task completion.
6. **INBOX-aware Telegram classifier** — n8n reads INBOX and builds INBOX-aware message.
7. **Mode C classification** — requires Ollama wrapper maturity; deferred.

None of these is authorized by task 0143. This design document provides the rules and architecture. Execution requires explicit separate manual gates.

---

## Why no runtime was executed

This is a docs-only task. The design defines rules, operating modes, trigger conditions, and failure modes — all of which can be documented without activating any system.

At this stage:
- No Telegram bot exists for this project.
- No bridge implementation exists (0142 only designed it; Phase 2/3 not authorized).
- No n8n changes were made.
- The coordination rules are conceptual — they define how future runtime components must behave, not how they currently behave.

Executing runtime components prematurely (before coordination rules are established) would create systems that may need to be reconfigured later. Designing first, implementing after explicit gates, is the correct low-risk path.

---

## Files produced

| File | Role |
|---|---|
| `docs/automation/telegram-browser-bridge-trigger-coordination-design.md` | Main design document (19 sections) |
| `docs/tasks/done/0143-telegram-browser-bridge-trigger-coordination-design.md` | Done marker |
| `docs/sessions/2026-05-13-telegram-browser-bridge-trigger-coordination-design.md` | This session report |
| `docs/LLMS.md` | Updated: last completed 0143, Low-Touch Stack updated |
| `docs/wiki/current-state.md` | Updated: last completed 0143 |
| `docs/roadmap.md` | Updated: 0143 entry added |
| `docs/wiki/token-efficiency.md` | Updated: navigation pointer added |

---

## Confirmations

- No runtime executed
- No browser automation executed
- No n8n executed
- No Telegram configured
- No Cursor executed
- No Ollama executed
- No app source modified
- No deploy / tag / rollback
- No API key
- No provider API
- No billing
- No merge

**Commit hash:** aa3a28d
