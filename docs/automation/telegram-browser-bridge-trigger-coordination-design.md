# Telegram + Browser Bridge Trigger Coordination Design

**Date:** 2026-05-13
**Task:** 0143-telegram-browser-bridge-trigger-coordination-design
**Type:** low-touch-loop-docs-only
**Status:** completed (docs-only design)

---

## 1. Executive Summary

When a low-touch task completes, two future channels may signal the user or trigger an "aggio": **Telegram notification** (human-visible, phone-based) and the **Local Browser Bridge** (automatic "aggio" injector on Windows workstation). This document defines how these two channels coordinate to prevent duplicated notifications, duplicated "aggio" injections, race conditions, and unclear responsibility.

The coordination model is simple and bounded:
- **Telegram** = human-visible notification channel; may fire independently.
- **Browser Bridge** = optional "aggio" injector; fires on the same workstation where ChatGPT web runs.
- **ChatGPT** = post-check and decision layer; reads GitHub after "aggio".
- **INBOX** = pending decision source of truth; surfaced by ChatGPT, not by bridge or Telegram.
- **User** = final decision authority; always retains manual override.

The coordination is achieved through trigger rules, idempotency keys, rate limits, and clear role separation. No runtime is activated by this design.

---

## 2. Relationship to Task 0139 — Auto-Aggio Prompt-Generation Handshake

Task 0139 (`docs/automation/auto-aggio-prompt-generation-handshake-design.md`) defined:
- "aggio" is not only a status refresh but a **prompt-generation handshake**.
- When ChatGPT receives "aggio", it performs post-check, identifies decisions, and generates the next implementer prompt (if no decisions) or issues a Decision Packet (if decisions exist).
- Activation channels for "aggio" are: (1) manual, (2) mobile with Telegram, (3) future Local Browser Bridge.

**This task (0143) designs how channels 2 and 3 coordinate** when both may fire for the same task completion event. It answers: should Telegram notify AND bridge write "aggio", or only one? In what order? How to prevent duplicates?

| 0139 Defines | 0143 Adds |
|---|---|
| Three activation channels | Coordination between Telegram and bridge for the same event |
| Bridge writes only "aggio" | Trigger rules: when bridge fires, when it does not |
| Manual "aggio" always available | Fallback hierarchy under coordination model |
| No provider APIs | No-API / no-billing policy in coordination context |
| Hybrid architecture (Telegram + bridge) | Mode A / Mode B / Mode C operating modes |

---

## 3. Relationship to Task 0141 — INBOX

Task 0141 created `docs/INBOX.md` as the single file-based human decision inbox.

The coordination model's interaction with INBOX is bounded:

- **If INBOX `## Pending` has items:** Telegram message should indicate that a pending decision exists. The bridge still only writes "aggio". Neither Telegram nor bridge answers INBOX entries.
- **After "aggio" is written:** ChatGPT performs post-check, reads INBOX, and surfaces the pending Decision Packet to the user.
- **Bridge never interacts with INBOX content.** It has no awareness of INBOX state.
- **Telegram does not resolve INBOX entries.** It may reference their existence in the notification message, but the user must respond separately.

This separation ensures Decision Packet responses remain intentional human actions.

---

## 4. Relationship to Task 0142 — Local Browser Bridge Preflight

Task 0142 (`docs/automation/local-browser-bridge-preflight-design.md`) defined:
- The bridge architecture: "automatic finger" that writes only `aggio` in ChatGPT web.
- Safety controls: kill switch, visible browser, rate limit (4/hour), fail closed, local log.
- MVP path: Phase 1 manual dry-run → Phase 2 sandbox → Phase 3 project chat.
- Section 12 of 0142 explicitly states that **trigger coordination between Telegram and bridge will be designed in a dedicated task** — this is that task.

**This document (0143) completes the design started in 0142 Section 12** by defining:
- Operating modes for concurrent Telegram + bridge use.
- Trigger rules: who fires, when, and how duplicates are prevented.
- INBOX-aware Telegram message templates.
- Rate limit and idempotency key for coordination.

The bridge architecture itself (kill switch, Phase 2/3 implementation) is not repeated here. This document adds only the coordination layer above the bridge.

---

## 5. Scope

| In scope | Out of scope |
|---|---|
| Coordination model design between Telegram and bridge | Telegram runtime configuration |
| Operating modes (A, B, C) | n8n runtime changes |
| Trigger rules and idempotency key | Bridge implementation (Phase 2/3) |
| INBOX-aware message templates (conceptual) | Playwright/Selenium/AutoHotkey execution |
| Duplicate prevention rules | Cursor execution |
| Failure mode catalogue | Ollama execution |
| Future runtime-gated tasks list | API key creation |
| No-API / no-billing policy | Provider billing |
| Safety and privacy rules | Any runtime changes |

This is a **docs-only** design task. No browser automation is executed. No n8n is modified. No Telegram is configured. No app source is touched.

---

## 6. The Coordination Problem

When a low-touch task completes, the following events may occur in the future automation stack:

```
Task implementer pushes done marker to main
  → n8n queue reader / polling detects new done file
    → n8n may trigger:
        (a) Telegram notification to user
        (b) Local browser bridge call → bridge writes "aggio"
    → ChatGPT receives "aggio"
      → ChatGPT performs post-check
        → ChatGPT reads GitHub state + INBOX
          → ChatGPT generates next prompt OR surfaces Decision Packet
```

**The coordination problem arises from concurrent or independent triggering:**

| Problem | Description |
|---|---|
| **Duplicated "aggio"** | Bridge writes "aggio"; user also writes "aggio" from Telegram notification; ChatGPT receives two "aggio" messages in rapid succession |
| **Duplicated Telegram** | n8n fires Telegram twice for the same done marker (duplicate detection failure) |
| **Race condition** | Telegram notifies user while bridge writes "aggio" simultaneously; user writes "aggio" while bridge is mid-write |
| **Unclear responsibility** | Both Telegram and bridge trigger for the same event; one is redundant but system does not know which |
| **Wrong task ID** | n8n detects a stale or previously-seen done marker; fires duplicate trigger |
| **INBOX pending but bridge fires** | Bridge writes "aggio" automatically; ChatGPT surfaces DP; user was not notified by Telegram first |
| **Bridge fires on intermediate state** | n8n detects a processing file, not a done file; bridge fires prematurely |

---

## 7. Recommended Coordination Principle

**Each channel has a distinct, non-overlapping role:**

| Channel | Role | Writes "aggio"? | Reads INBOX? | Answers DP? |
|---|---|---|---|---|
| **Telegram** | Human-visible notification: "task N completed" | No | No (informs of pending) | No |
| **Browser Bridge** | Automatic "aggio" injector on always-on workstation | Yes (only "aggio") | No | No |
| **ChatGPT** | Post-check, decision identification, next prompt generation | N/A | Yes | Surfaces DP to user |
| **INBOX** | Pending decision source of truth | N/A | N/A | Archive of all pending DPs |
| **User** | Final decision authority; manual override always valid | Yes (manually) | Yes | Yes |

**Coordination principle:**
- Telegram and bridge are complementary, not exclusive.
- In Mode B (both active), Telegram fires first for human awareness; bridge fires after a configurable short delay to allow "aggio" injection.
- Bridge must not fire more than once per `(task_id, commit_hash)` pair (idempotency key).
- Telegram must not fire more than once per `(task_id, commit_hash)` pair (idempotency key).
- If bridge fires successfully, there is no need for the user to manually write "aggio" — but the user always may.
- If INBOX has pending decisions, Telegram message explicitly mentions them; bridge behavior is unchanged.

---

## 8. Three Future Operating Modes

### Mode A — Telegram-Only (Current Primary)

```
n8n detects done marker
  → Telegram sends notification to user
    → User reads notification on phone
      → User opens ChatGPT web
        → User writes "aggio" manually
          → ChatGPT performs post-check
```

| Aspect | Details |
|---|---|
| User manual action required | Yes: write "aggio" |
| Bridge active | No |
| Telegram active | Yes |
| INBOX-aware message | Yes: Telegram message mentions pending decisions if any |
| Duplicate prevention | Telegram idempotency key per (task_id, commit_hash) |
| Failure if user offline | Task waits; no automation; user writes "aggio" when available |
| Status | **Current primary; always valid fallback** |

### Mode B — Telegram + Bridge (Future Preferred MVP)

```
n8n detects done marker
  → Telegram sends notification to user (visual awareness)
  → n8n triggers local bridge (after configurable delay, e.g. 30s)
    → Bridge writes "aggio" in ChatGPT web
      → ChatGPT performs post-check
  → If user already wrote "aggio" before bridge fired:
    → Bridge may detect idle state or rate limit prevents duplicate
```

| Aspect | Details |
|---|---|
| User manual action required | No for "aggio"; yes for Decision Packet response |
| Bridge active | Yes |
| Telegram active | Yes (for human awareness and DP notification) |
| INBOX-aware message | Yes: Telegram says "task complete; pending decision: D-NNNN-X" if applicable |
| Duplicate prevention | Bridge idempotency key per (task_id, commit_hash) + rate limit (4/hour) |
| Bridge fires if user offline | Yes: bridge runs on always-on workstation |
| Failure if bridge fails | Telegram fallback; user writes "aggio" manually |
| Status | **Future preferred MVP; requires bridge Phase 3 + Telegram runtime gate** |

### Mode C — Bridge-Only for Routine Tasks, Telegram Only on Failures/Decisions

```
For standard routine docs-only tasks with no Decision Packet:
  n8n detects done marker
    → Bridge writes "aggio" (no Telegram for routine tasks)
    → ChatGPT performs post-check silently
    → No user interaction required if no decisions

For failures / tasks with Decision Packet:
  n8n detects failed marker or DP pattern
    → Telegram sends notification with DP details
    → User responds
```

| Aspect | Details |
|---|---|
| User manual action required | No for routine tasks; yes for DPs and failures |
| Bridge active | Yes for all tasks |
| Telegram active | Only for failures, DPs, ambiguous states |
| INBOX-aware message | Telegram carries full DP context when it fires |
| Duplicate prevention | Bridge idempotency; Telegram filtered by task outcome |
| Failure if bridge fails | User misses routine completion; must be detected by polling |
| Status | **Deferred; requires mature failure detection and DP-aware n8n classifier** |

---

## 9. Recommended MVP Mode

| Phase | Mode | Status |
|---|---|---|
| Current | **Mode A** — Telegram-only, user writes "aggio" manually | Active primary |
| Near future | **Mode B** — Telegram + Bridge | Future MVP after bridge Phase 3 passes |
| Later | **Mode C** — Bridge-only for routine, Telegram for DPs | Deferred; requires classification maturity |

**Mode A remains the primary for all phases until bridge Phase 3 is explicitly authorized via a separate runtime gate.**

Mode B is the future preferred MVP because:
- It eliminates the most frequent micro-interaction (user writing "aggio" from phone).
- Telegram still notifies the user visually (important when a Decision Packet exists).
- Bridge provides "aggio" automatically without user action on the workstation.
- If bridge fails, Telegram notification + manual "aggio" is the immediate fallback.

Mode C is deferred because:
- It requires n8n to classify task outcomes with high accuracy (DP vs. no-DP).
- Missing a Telegram notification for a routine task is acceptable; missing one for a DP or failure is not.
- Classification maturity requires Ollama wrapper validation (future runtime-gated tasks).

---

## 10. Trigger Rules

All future triggers (Telegram and bridge) must respect these rules:

| Rule | Description |
|---|---|
| **Trigger only on confirmed done** | Trigger only after a done marker file exists in `docs/tasks/done/{task}.md`; not on processing, queue, or partial commits |
| **No intermediate state trigger** | Do not trigger if only `docs/tasks/processing/{task}-cursor-prompt.md` exists without a corresponding done or failed file |
| **No trigger on already-done tasks** | If (task_id, commit_hash) was already triggered, do not re-trigger |
| **No trigger on failed tasks** | Failed tasks trigger Telegram only (Mode B/C), not the bridge; Mode A: user receives failure notification |
| **No trigger on decision_required state** | If done marker contains a Decision Packet pattern, Telegram fires with DP context; bridge behavior follows mode rules |
| **No trigger on blocked state** | If task is known blocked (documented in session), suppress both channels until unblocked |
| **Idempotency key** | `(task_id, commit_hash)` — both task ID and commit hash must match; prevents stale re-trigger if same task is re-committed |
| **Trigger after stable window** | After done marker appears, wait for a configurable stable window (e.g., 60 seconds) before triggering to allow commit propagation |

---

## 11. Duplicate Prevention

| Mechanism | Applies to | Description |
|---|---|---|
| **Idempotency key** | Telegram + Bridge | `(task_id, commit_hash)` stored in local state (file or n8n variable); if already triggered, skip |
| **Last-trigger file/state** | Bridge | Local file (e.g., `~/.alina-last-bridge-trigger`) stores last `(task_id, commit_hash)`; bridge checks before firing |
| **Rate limit** | Bridge | Maximum 4 executions per hour (from 0142 preflight design); prevents rapid-fire scenarios |
| **Task ID lock** | Telegram + Bridge | Once a task_id is triggered, lock it; do not re-trigger until next task_id appears |
| **No repeated Telegram spam** | Telegram | Telegram message for task_id sent once; if user does not respond, no automatic re-send; only manual resend is allowed |
| **No repeated bridge "aggio"** | Bridge | If bridge already fired for this (task_id, commit_hash), next bridge call for same key is a no-op |
| **Bridge delay** | Bridge (Mode B) | In Mode B, bridge fires after Telegram + configurable delay (e.g., 30 seconds) to avoid race with user manually writing "aggio" after reading Telegram notification |

---

## 12. INBOX Interaction

When `docs/INBOX.md` `## Pending` section contains decision packets:

| Condition | Telegram behavior | Bridge behavior | ChatGPT behavior |
|---|---|---|---|
| INBOX empty, task completed normally | Send success message (no DP mention) | Write "aggio" (Mode B/C) | Generate next implementer prompt |
| INBOX has pending DP | Send decision-required message with DP ID | Write "aggio" normally | Read INBOX; surface Decision Packet to user |
| Multiple pending DPs | List all pending DP IDs in Telegram message | Write "aggio" normally | Surface all pending DPs |
| Task itself produced a new DP | Telegram carries new DP context | Write "aggio" normally | Extract and surface new DP |

**Rules:**
- Bridge **always** writes only `aggio`, regardless of INBOX state.
- Bridge **never** reads INBOX content.
- Bridge **never** answers INBOX entries.
- Telegram **informs** of INBOX pending items but **never resolves** them.
- ChatGPT **surfaces** Decision Packets after post-check.
- User **responds** to Decision Packets manually.

This separation ensures INBOX decisions remain intentional human actions even when automation (Telegram + bridge) is fully active.

---

## 13. Message Templates (Conceptual)

These are conceptual templates. Do not include real bot tokens, real chat IDs, or real webhook URLs.

### 13.1 Telegram — Success / No Decision Message

```
✅ Task {task_id} completed
{task_slug}

Commit: {commit_hash_short}
Time: {completed_at}

No pending decisions.
Next: write "aggio" in ChatGPT to get next prompt.
[In Mode B: bridge will write "aggio" automatically.]
```

### 13.2 Telegram — Decision Required Message

```
⚠️ Task {task_id} completed — decision required
{task_slug}

Commit: {commit_hash_short}
Time: {completed_at}

Pending: {dp_id_list}

Write "aggio" in ChatGPT to surface the Decision Packet.
[In Mode B: bridge has already written "aggio".]
Then respond: D-NNNN-X = N
```

### 13.3 Telegram — Failure / Blocked Message

```
❌ Task {task_id} failed / blocked
{task_slug}

Failure reason: {failure_reason_summary}
Time: {failed_at}

Check: docs/tasks/failed/{task}.md
Write "aggio" in ChatGPT for context.
Manual intervention required.
```

**Rules for all templates:**
- No secrets or credentials in any field.
- No raw URLs with tokens.
- No personal data beyond task slug and commit hash.
- No ChatGPT conversation content.
- Bridge trigger confirmation (if Mode B) is informational only.
- All times in UTC or configured timezone (no ambiguous local time).

---

## 14. n8n Integration Concept

The future n8n coordination workflow (not implemented here):

```
n8n done detector workflow:
  Poll docs/tasks/done/ (or receive GitHub webhook)
    → Read new done file
      → Extract: task_id, commit_hash, task_slug, completed_at
      → Check INBOX state (read docs/INBOX.md ## Pending section)
      → Build Telegram message (success / decision-required / failure)
      → Idempotency check: has (task_id, commit_hash) been triggered?
        → Yes: no-op, exit
        → No: continue
      → Send Telegram notification
      → Record idempotency key in n8n state
      → If Mode B and bridge enabled:
          Wait configurable delay (e.g., 30s)
          Trigger local bridge via local endpoint or script invocation
      → Log: timestamp, task_id, channels fired, outcome
```

**Key rules for n8n integration:**
- Any n8n workflow change requires a **separate runtime gate** (not authorized here).
- Bridge endpoint must be **local-only** — not publicly exposed.
- n8n must not store or log ChatGPT session tokens or credentials.
- n8n must not store Telegram bot token in workflow code — use n8n credential store.
- Any n8n export JSON must be **redacted** of credentials before committing to repo.
- INBOX reading by n8n is **read-only** — n8n may read `docs/INBOX.md` from GitHub but never writes to it.

---

## 15. Safety and Privacy Rules

| Rule | Applies to |
|---|---|
| No secrets in Telegram messages | All message types |
| No raw URLs with tokens or query strings | Telegram messages, logs |
| No credentials in bridge code or config | Bridge (from 0142) |
| No personal data beyond task slug and commit hash | All channels |
| No ChatGPT conversation content scraping | Bridge (from 0142) |
| No provider APIs (OpenAI, Anthropic, OpenRouter) | All components |
| No new LLM API keys | All components |
| No new recurring costs | All components |
| Bridge local-only (not exposed publicly) | Bridge endpoint |
| n8n to local bridge communication via private channel | n8n + bridge |
| Telegram bot token stored in n8n credential store only | n8n |
| No logging of ChatGPT response content | Bridge |
| No logging of user conversation | Bridge + Telegram |
| Fail closed if context uncertain | Bridge (from 0142) |

---

## 16. Failure Modes

| Failure Mode | Risk | Mitigation |
|---|---|---|
| **Telegram sent but bridge failed** | User notified; "aggio" not written automatically | User writes "aggio" manually; fallback always valid |
| **Bridge sent "aggio" but Telegram failed** | "aggio" injected; user not notified visually | User may miss DP if any; ChatGPT surfaces DP when user opens chat |
| **Duplicate done detection** | Both channels fire twice for same task | Idempotency key prevents duplicate trigger |
| **Wrong task ID** | Stale done file triggers for already-processed task | Idempotency key: (task_id, commit_hash) must be fresh |
| **INBOX pending but bridge still fired** | Bridge writes "aggio"; ChatGPT surfaces DP | Expected behavior: ChatGPT reads INBOX and surfaces DP; no bridge awareness needed |
| **User offline** | User misses Telegram; bridge writes "aggio" | "aggio" still triggers post-check; if DP pending, ChatGPT waits; user sees DP when online |
| **ChatGPT not logged in** | Bridge cannot write "aggio" | Bridge detects login state; fails closed; logs failure; Telegram + manual fallback |
| **Local machine asleep** | Bridge cannot run | Bridge not invoked; Telegram still fires; user writes "aggio" manually |
| **Rate limit hit** | Bridge refuses after 4 triggers/hour | Manual "aggio" fallback; Telegram still fires |
| **n8n fires for intermediate state** | Trigger on processing file, not done file | Trigger rule: check done/{task}.md existence, not processing/ |
| **Idempotency state lost** | n8n restarts; loses trigger state | Use persistent idempotency store (file-based or n8n variable with persistence) |
| **Bridge fires in wrong Mode** | Mode A (no bridge) but bridge invoked | n8n mode flag must gate bridge call; bridge kill switch as secondary safety |
| **Both Telegram and user write "aggio" simultaneously** | ChatGPT receives two "aggio" messages | Minimal impact: ChatGPT processes both; second is idempotent if state unchanged |
| **DP sent by Telegram but user already answered in chat** | Telegram message becomes stale | Telegram is informational; ChatGPT state is authoritative; no issue |

---

## 17. Fallback

**Manual "aggio" is always available and always valid.**

Fallback hierarchy:

1. **Mode B active + bridge successful:** bridge writes "aggio" automatically; Telegram notifies user visually.
2. **Mode B active + bridge failed:** Telegram fires; user reads notification; user writes "aggio" manually from phone or PC.
3. **Mode A (current primary):** Telegram fires; user writes "aggio" manually.
4. **No automation (full manual):** user writes "aggio" manually at any time without any notification.

**No feature of the system depends on the bridge or Telegram being operational.** The loop always functions via manual "aggio".

---

## 18. Future Runtime-Gated Tasks

The following tasks are identified as future work, each requiring an explicit manual gate before execution:

| Task | Gate | Description |
|---|---|---|
| Telegram notifier runtime setup | VPS / n8n runtime gate + Telegram gate | Configure Telegram bot, chat ID, and n8n Telegram node on VPS |
| n8n Telegram notification node | VPS / n8n runtime gate | Add Telegram send node to n8n done-detection workflow |
| Bridge sandbox implementation | Local machine runtime gate | Phase 2 of 0142 MVP path: implement and test bridge in sandbox chat |
| n8n-to-local-bridge trigger | VPS / n8n runtime gate | Configure n8n to call local bridge endpoint after Telegram; Mode B activation |
| Trigger coordination runtime dry-run | Local machine runtime gate | First end-to-end test of Mode B: Telegram + bridge for one real task completion |
| INBOX-aware Telegram classifier | VPS / n8n runtime gate | n8n reads INBOX and builds INBOX-aware message; requires INBOX + n8n integration |
| Mode C classification | Requires Ollama wrapper (future runtime-gated) | n8n classifies task outcome to decide Telegram-only vs bridge-only |

None of these tasks is authorized by this design document. Each requires a separate explicit manual gate.

---

## 19. No-API / No-Billing Policy

| Policy | Applies to |
|---|---|
| ZERO OpenAI API calls | All coordination components |
| ZERO Anthropic API calls | All coordination components |
| ZERO OpenRouter calls | All coordination components |
| ZERO other provider LLM API calls | All coordination components |
| ZERO new LLM API keys | All coordination components |
| ZERO recurring LLM billing | All coordination components |
| Telegram = message notification only | Not a provider LLM API |
| Bridge = local browser UI automation only | Not an API; uses existing user browser session |
| n8n = workflow automation on self-hosted VPS | Not a provider LLM API |
| ChatGPT = web/on-demand orchestration | Not OpenAI API; user session only |
| Claude Code = supervised usage | Not Anthropic API |
| Local AI = Ollama/local models (future) | Not a provider API |

---

## Micro-Interactions Eliminated

| Interaction | Current | Eliminated by Mode B |
|---|---|---|
| User must read Telegram and open ChatGPT to write "aggio" | Every task completion | ✅ Bridge writes "aggio" automatically |
| User must be online at moment of task completion | Every task | ✅ Bridge acts on always-on workstation |
| User must manually navigate to ChatGPT input | Every task | ✅ Bridge handles input focus and submission |

**Gate intenzionali non eliminabili:**
- User responds to Decision Packet (human authority)
- User approves merge (human authority)
- User authorizes runtime changes (human authority)
- User performs physical tests on Alina's phone (physical gate)

---

## Decision Packet

**Not emitted.**

This is a docs-only design task. The coordination model is clear and consistent with 0139, 0141, and 0142. No real choice between alternatives is required at this stage. Future runtime-gated tasks for Telegram setup and bridge Phase 2/3 will produce Decision Packets if architectural choices need user input.

---

## Conclusione

The Telegram + Browser Bridge Trigger Coordination Design defines how two future automation channels coordinate around task completion signals without duplicating notifications, duplicating "aggio" injections, or creating race conditions.

Key principles:
- Telegram and bridge have strictly separated roles.
- Idempotency keys prevent duplicate triggers.
- INBOX awareness is carried by Telegram message; bridge remains unaware.
- Mode A (Telegram-only) is the current primary and permanent fallback.
- Mode B (Telegram + Bridge) is the future preferred MVP after bridge Phase 3 passes.
- Mode C is deferred until classification maturity.
- Manual "aggio" is always the ultimate fallback.

This design closes the coordination gap identified in 0142 Section 12 and completes the preflight documentation workstream for the low-touch loop notification and "aggio" injection architecture.

**Task 0143 docs-only — completed 2026-05-13**
