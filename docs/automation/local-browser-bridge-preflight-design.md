# Local Browser Bridge Preflight Design

**Date:** 2026-05-13
**Task:** 0142-local-browser-bridge-preflight-design
**Type:** low-touch-loop-docs-only
**Status:** completed (docs-only design)

---

## 1. Executive Summary

The **Local Browser Bridge** is a future local component on Windows workstation (or Mac M2) that acts as an "automatic finger": it opens or focuses ChatGPT web in a browser, writes only the hardcoded string `aggio`, and presses Enter.

It is not a decision agent. It does not read content. It does not answer Decision Packets. It does not approve merges. It does not deploy. It does not call APIs. Its entire responsibility is to simulate the user typing "aggio" and pressing Enter — nothing more.

This document is a **preflight design**: it defines architecture, constraints, safety controls, candidate technologies, failure modes, and the recommended MVP path. No browser automation is implemented here. No runtime is activated. No API key is created. No billing is introduced.

The bridge is part of the activation chain for Auto-Aggio:

```
n8n / Telegram detects task completed
  → triggers local bridge (future)
    → bridge writes "aggio" in ChatGPT web
      → ChatGPT performs post-check (0139 handshake)
        → ChatGPT generates next implementer prompt
          → user pastes prompt into Claude Code / Cursor / Windsurf
```

---

## 2. Relationship to Task 0139 — Auto-Aggio Prompt-Generation Handshake

Task 0139 (`docs/automation/auto-aggio-prompt-generation-handshake-design.md`) defined:

- "aggio" is not only a status refresh but a **prompt-generation handshake**.
- When ChatGPT receives "aggio", it performs post-check, identifies decisions, and generates the next implementer prompt immediately (if no decisions) or issues a Decision Packet (if decisions exist).
- One of the activation channels listed in 0139 is the **Local Browser Bridge**: a future local component that writes only "aggio" automatically.

**This task (0142) is the preflight design for that bridge.** It translates the channel described in 0139 into a concrete architecture document with safety controls, failure modes, and an MVP path.

The relationship is:

| 0139 Defines | 0142 Adds |
|---|---|
| Bridge writes only "aggio" | Candidate technologies (AutoHotkey/Playwright/Selenium/DesktopCtl) |
| Bridge presses Enter | Safety controls (kill switch, rate limit, visible browser) |
| Bridge may verify correct chat | Context verification approach |
| Bridge must log | Local log format, no sensitive content |
| Bridge has kill switch | Kill switch design |
| Bridge has rate limit | Per-hour rate limit |
| No provider API | No-API / no-billing policy explicit |
| Manual "aggio" always available | Fallback section |

---

## 3. Relationship to Task 0140 — Local Cursor Dual-Agent Loop

Task 0140 (`docs/automation/local-cursor-dual-agent-loop-design.md`) formalized:

- The target automation architecture: `GitHub queue → n8n → Ollama → Agent 1 → Agent 2 → Telegram/bridge → ChatGPT → user`
- The "return path" of the dual-agent loop goes through the Auto-Aggio handshake (0139).
- The bridge is one activation mechanism for this return path.

Specifically, Section 5.8 of 0140 (Telegram Human Gate) notes that the bridge may complement or partially replace Telegram notification in the future:

- **Current primary:** Telegram notifies user → user writes "aggio" manually from phone
- **Future more automatic:** n8n triggers local bridge → bridge writes "aggio" automatically

**This task (0142) designs the bridge that fits into the 0140 architecture.** The bridge is positioned between the n8n trigger and ChatGPT web, as one automation option for the "aggio" injection step.

The bridge does not replace Telegram. It complements it: Telegram may still notify the user visually while the bridge simultaneously (or conditionally) writes "aggio" into ChatGPT web.

---

## 4. Relationship to Task 0141 — INBOX

Task 0141 created `docs/INBOX.md` as the single file-based human decision inbox. The INBOX contains real decision packets that require explicit user response.

The bridge's relationship to INBOX is simple and bounded:

- **If INBOX `## Pending` has items**: the bridge still only writes "aggio". It does not read INBOX. It does not respond to Decision Packets. It does not select options.
- **After "aggio" is written**: ChatGPT performs post-check, reads INBOX if relevant, and surfaces the pending Decision Packet to the user. The user responds manually.
- **The bridge never interacts with INBOX content.** It has no awareness of INBOX entries.

This ensures that Decision Packet responses remain intentional human actions even when bridge automation is active.

---

## 5. Scope

| In scope | Out of scope |
|---|---|
| Architecture design of local browser bridge | Actual bridge implementation |
| Candidate technology comparison | Running Playwright/Selenium/AutoHotkey/DesktopCtl |
| Safety controls definition | n8n runtime integration |
| Kill switch design | Telegram configuration |
| Rate limit policy | Cursor execution |
| Failure mode catalogue | Ollama execution |
| MVP preflight path | Modelfile creation |
| INBOX integration rules | API key creation |
| No-API / no-billing policy | Provider billing |
| Future runtime-gated tasks list | Any runtime changes |

This is a **docs-only** design task. No browser automation is executed. No runtime is activated. No app source is touched.

---

## 6. Bridge Definition

The Local Browser Bridge is an "automatic finger" local component with a strictly bounded role:

| Responsibility | Details |
|---|---|
| **Open / focus ChatGPT web** | Opens a browser window (non-headless) to ChatGPT, or focuses existing tab |
| **Verify browser/chat context** | Checks page title or URL contains expected ChatGPT identifier if possible |
| **Write only "aggio"** | Types the hardcoded literal string `aggio` into the ChatGPT input field |
| **Press Enter** | Submits the message |
| **Log event locally** | Writes timestamp and outcome to a local log file (no sensitive content) |
| **Kill switch** | A local flag file or ENV var that, when present, prevents bridge from running |
| **Rate limit** | Maximum N executions per hour (configurable, default: 4/hour) |

The bridge is stateless between runs. It does not remember prior conversations. It does not parse ChatGPT responses. It does not make any decisions.

---

## 7. Strict Forbidden Behavior

The bridge **must never**:

| Forbidden Action | Reason |
|---|---|
| Write anything except `aggio` | Bridge is a single-purpose injector; any variation breaks the contract |
| Answer Decision Packets | Decision responses require human judgment |
| Select options (1/2/3/defer/skip) | User authority; bridge has no decision capability |
| Approve merge | Human-only gate |
| Authorize runtime | Human-only gate |
| Deploy / tag / rollback | Human-only gate |
| Create API keys | Human-only gate |
| Use provider APIs (OpenAI, Anthropic, OpenRouter) | ZERO API policy |
| Modify repository files | Implementer role only |
| Read credentials or session tokens | Security: no credential access |
| Scrape private conversation content | Privacy: no content reading beyond minimum UI verification |
| Run in headless mode (initially) | Safety: visible browser required for human oversight |
| Trigger more than N times per hour | Rate limit: prevents spam |

---

## 8. Candidate Implementation Technologies

### 8.1 AutoHotkey (Windows)

| Aspect | Details |
|---|---|
| Platform | Windows only |
| Approach | Script-driven keyboard/mouse simulation; UI automation via window titles |
| Pros | Lightweight, no browser dependency, simple scripting, no Node.js required |
| Cons | Windows-only; brittle if ChatGPT UI layout changes; limited context verification |
| Kill switch | File/ENV check at script start |
| Rate limit | Simple counter in script state or timestamp file |
| Maturity | Proven for local desktop automation; widely used |
| Headless | No (always visible window) |
| **Recommendation** | Simplest path for Windows-only scenario; good MVP candidate |

### 8.2 Playwright

| Aspect | Details |
|---|---|
| Platform | Windows, Mac, Linux |
| Approach | Browser automation framework; controls Chromium/Firefox/WebKit via CDP |
| Pros | Cross-platform; can verify URL/title; more reliable element targeting; modern |
| Cons | Heavier dependency (Node.js + browser install); headless possible (requires disabling) |
| Kill switch | File/ENV check before script execution |
| Rate limit | Lock file or timestamp check at script start |
| Maturity | Active project; widely used for web testing |
| Headless | Must be explicitly disabled for safety (use `headless: false`) |
| **Recommendation** | Best balance of reliability and cross-platform support for MVP |

### 8.3 Selenium

| Aspect | Details |
|---|---|
| Platform | Windows, Mac, Linux |
| Approach | Browser automation via WebDriver protocol |
| Pros | Cross-platform; mature; well-documented |
| Cons | Slower startup; requires WebDriver binary matching browser version; more setup |
| Kill switch | File/ENV check |
| Rate limit | Lock file or timestamp file |
| Maturity | Mature but older than Playwright for modern use cases |
| Headless | Must be explicitly disabled |
| **Recommendation** | Valid but Playwright preferred for new projects |

### 8.4 DesktopCtl / OpenClaw-style desktop automation

| Aspect | Details |
|---|---|
| Platform | Windows, Mac |
| Approach | Desktop-level UI automation (not browser-specific); simulates OS-level keyboard/mouse |
| Pros | Browser-agnostic; works at OS level |
| Cons | Less reliable for web UI; brittle to layout changes; limited community |
| Kill switch | File/ENV check |
| Rate limit | Simple counter |
| Maturity | Varies by tool; less standard than Playwright/Selenium |
| **Recommendation** | Lower priority; prefer browser-specific tools |

### 8.5 Manual Fallback

The user writes "aggio" manually in ChatGPT web. Always available. Zero dependencies. Zero risk of automation errors.

**Manual fallback is permanent and always valid.**

### Comparison Summary

| Technology | Platform | Reliability | Setup effort | Recommended for MVP |
|---|---|---|---|---|
| AutoHotkey | Windows only | Medium | Low | ✅ Windows-only scenario |
| Playwright | All | High | Medium | ✅ Cross-platform MVP |
| Selenium | All | High | Medium-High | Acceptable |
| DesktopCtl/OpenClaw | Windows/Mac | Low-Medium | Medium | Lower priority |
| Manual | All | Maximum | Zero | Always available |

---

## 9. Recommended MVP Preflight Path

### Phase 1 — Manual Dry-Run Checklist (no runtime)

Before any script, perform a manual dry-run:

1. Open ChatGPT web in non-headless browser.
2. Verify URL matches expected ChatGPT project URL.
3. Click on the ChatGPT input field manually.
4. Type `aggio` manually.
5. Verify "aggio" appears exactly in the input field with no extra characters.
6. Press Enter.
7. Observe ChatGPT response.
8. Confirm that the handshake works correctly (ChatGPT reads GitHub, generates prompt or issues DP).
9. Document the result.

This phase has zero runtime risk and validates the end-to-end behavior before any automation.

### Phase 2 — Sandbox Test Script (separate future runtime-gated task)

In a dedicated future task (runtime-gated, separate manual gate required):

1. Implement a minimal script (Playwright recommended, or AutoHotkey on Windows).
2. Target a test/sandbox ChatGPT conversation, NOT the project chat.
3. Script writes `aggio` into the sandbox chat only.
4. Verify kill switch works (create flag file → bridge does not run).
5. Verify rate limit works (trigger more than N times → bridge refuses after limit).
6. Verify local log is written correctly.
7. Review log for absence of sensitive content.
8. Do not target the project chat in this phase.

### Phase 3 — Guarded Use in Project Chat (separate future runtime-gated task)

After Phase 2 passes:

1. Configure bridge to target the specific project ChatGPT conversation URL/title.
2. Add URL verification step.
3. Run bridge once manually supervised.
4. Verify "aggio" is sent correctly to the correct chat.
5. Verify ChatGPT post-check fires correctly.
6. Enable bridge for supervised use in project workflow.

**Each phase is a separate future task with its own runtime gate.** This design document does not authorize any phase beyond the manual dry-run checklist.

---

## 10. Safety Controls

| Control | Implementation |
|---|---|
| **Kill switch** | Local flag file (e.g., `~/.alina-bridge-disabled` or `BRIDGE_DISABLED=true` ENV var); checked at every execution start |
| **Visible browser** | `headless: false` mandatory for initial phases; no invisible automation |
| **No headless mode** | Enforced in Phase 2 and Phase 3; user can always see what bridge is doing |
| **Rate limit** | Maximum 4 executions per hour by default (configurable via local config); uses timestamp file |
| **URL / title verification** | Bridge checks that browser is on ChatGPT URL and (if possible) correct project chat title |
| **No credential storage** | Bridge uses existing browser session (logged-in browser); bridge itself stores no credentials, cookies, or tokens |
| **Local logs** | Each execution logs: timestamp, action taken, outcome (sent/skipped/error); no conversation content, no tokens, no credentials |
| **Fail closed** | If bridge cannot verify context (wrong URL, wrong tab, ChatGPT not logged in), it aborts and logs; it does not attempt to write in uncertain context |
| **Single string only** | Hard-coded `aggio` literal; no parameter substitution, no template, no variable injection |
| **No background service** | Bridge runs as a triggered script, not a persistent daemon; invoked by n8n or user manually |

---

## 11. Integration with INBOX

When `docs/INBOX.md` `## Pending` contains decision packets:

| Step | Actor | Action |
|---|---|---|
| 1 | n8n or user | Triggers bridge |
| 2 | Bridge | Writes only `aggio`; does NOT read INBOX |
| 3 | ChatGPT | Receives "aggio"; performs post-check |
| 4 | ChatGPT | Reads INBOX if needed; surfaces pending Decision Packet to user |
| 5 | User | Responds to Decision Packet manually (`D-NNNN-X = N`) |
| 6 | ChatGPT | Records decision; proceeds to next prompt if no more pending decisions |

**The bridge has no awareness of INBOX state.** It writes "aggio" unconditionally (subject to kill switch and rate limit). ChatGPT decides whether to surface a Decision Packet based on GitHub state and INBOX content.

This design ensures INBOX decisions remain human-initiated even when bridge automation is active.

---

## 12. Integration with Telegram

Current notification path:

```
n8n detects task complete → Telegram notifies user → user opens ChatGPT → user writes "aggio"
```

Future path with bridge:

```
n8n detects task complete → Telegram notifies user (visual) + triggers local bridge → bridge writes "aggio"
```

Key rules for Telegram/bridge integration:

- Telegram and bridge are **complementary**, not exclusive.
- Telegram may still notify the user visually while the bridge writes "aggio" automatically.
- The bridge may be triggered by n8n only after an explicit runtime gate authorizes it.
- **This task does not configure Telegram.** Telegram integration remains a separate future runtime-gated task.
- Trigger coordination (Telegram vs. bridge) will be designed in a dedicated task.

---

## 13. Integration with n8n

Future integration path:

```
n8n workflow detects done marker / task completion
  → n8n makes HTTP call to local bridge endpoint (or invokes local script via SSH/tunnel)
    → bridge runs on Windows workstation
      → bridge writes "aggio" in ChatGPT web
```

Key rules for n8n/bridge integration:

- n8n integration requires a separate future runtime-gated task.
- **This task does not modify n8n runtime.**
- The bridge must be locally triggered (not exposed publicly).
- Any n8n-to-local-bridge communication must not expose credentials or ChatGPT session tokens.
- The bridge endpoint (if any) must be local-only or on a secure network.

---

## 14. Failure Modes

| Failure Mode | Risk | Mitigation |
|---|---|---|
| **Wrong tab is focused** | Bridge writes "aggio" into wrong app | URL/title verification; abort if context uncertain |
| **Wrong chat (different ChatGPT conversation)** | Bridge writes "aggio" into unrelated chat | Project chat URL/title verification; fail closed if mismatch |
| **ChatGPT not logged in** | Input field not found or login prompt shown | Bridge detects login state; aborts and logs if not logged in |
| **Duplicate "aggio" spam** | Multiple rapid triggers send multiple "aggio" | Rate limit (max 4/hour); kill switch; idempotency check (last sent timestamp) |
| **Bridge writes wrong text** | Script bug causes wrong string injection | String literal hard-coded; no variable substitution; log confirms string before submit |
| **ChatGPT UI changed** | Element selectors break | Playwright recommended (more resilient selectors); fail closed on selector error |
| **Network unavailable** | ChatGPT page fails to load | Timeout; bridge logs failure; manual "aggio" fallback |
| **Decision Packet present** | Bridge writes "aggio" while user has pending DP | Bridge always writes "aggio" regardless; ChatGPT surfaces DP after post-check; no bridge awareness needed |
| **User is actively typing** | Bridge interrupts user mid-message | Future: detect active typing state (Playwright can check); for MVP: bridge only triggers during expected idle windows |
| **Browser locked / screen sleeping** | Browser not accessible | Bridge detects window state; aborts and logs if browser not focused |

---

## 15. Fallback

**Manual "aggio" is always available.**

- The user can write "aggio" in ChatGPT web at any time.
- The bridge is an optional automation layer, not a required dependency.
- If the bridge fails, the user falls back to manual "aggio" immediately.
- No feature of the system depends on the bridge being operational.

**Fallback hierarchy:**

1. Bridge writes "aggio" automatically (future, runtime-gated).
2. User writes "aggio" manually from phone (Telegram-assisted, current primary).
3. User writes "aggio" manually from PC (always available).

---

## 16. No-API / No-Billing Policy

This is a hard architectural constraint for the bridge:

| Policy | Applies to |
|---|---|
| ZERO OpenAI API calls | Bridge component |
| ZERO Anthropic API calls | Bridge component |
| ZERO OpenRouter calls | Bridge component |
| ZERO other provider LLM API calls | Bridge component |
| ZERO new LLM API keys | Bridge component |
| ZERO recurring LLM billing | Bridge component |
| Bridge uses local browser session only | No API authentication; uses existing user login in browser |
| No credential storage in bridge code | No tokens, no cookies stored by bridge |

The bridge interacts with ChatGPT web exclusively through the browser UI. It does not make API calls. It does not use the OpenAI API. It does not require any API key. It is not billed.

---

## 17. Future Runtime-Gated Tasks

The following tasks are identified as future work, each requiring an explicit manual gate before execution:

| Task | Gate | Description |
|---|---|---|
| Local browser bridge implementation | Local machine runtime gate | Implement Playwright or AutoHotkey bridge script; Phase 2 sandbox test |
| Test-only bridge dry run | Local machine runtime gate | Phase 2: sandbox ChatGPT conversation test only; no project chat |
| Project chat bridge trial | Local machine runtime gate | Phase 3: guarded use in project ChatGPT chat |
| n8n-to-local-bridge trigger | VPS / n8n runtime gate | Configure n8n to trigger local bridge on task completion |
| Telegram trigger integration | VPS / n8n runtime gate + Telegram gate | Coordinate Telegram notification with bridge trigger |
| Bridge monitoring / logging guard | Local machine runtime gate | Structured local log rotation, alert on rate limit hit |

None of these tasks is authorized by this design document. Each requires a separate explicit manual gate.

---

## Micro-Interactions Eliminated

| Interaction | Current | Eliminated by Bridge |
|---|---|---|
| User must write "aggio" manually after task completion | Every task | ✅ Bridge writes "aggio" automatically |
| User must be at PC/phone when task completes | Every task | ✅ Bridge handles "aggio" injection on always-on workstation |
| User must notice Telegram notification to send "aggio" | Every task | ✅ Bridge acts without requiring user to notice immediately |

**Gate residui intentionali (non eliminabili):**
- User responds to Decision Packet (human authority)
- User approves merge (human authority)
- User authorizes runtime changes (human authority)
- User performs physical tests on Alina's phone (physical gate)

---

## Decision Packet

**Not emitted.**

This is a docs-only design task. No runtime is involved. The design direction is clear and consistent with 0139 and 0140. No choice between real alternatives is required at this stage. Future runtime-gated tasks for bridge implementation will produce Decision Packets if architectural choices need user input.

---

## Conclusione

The Local Browser Bridge Preflight Design defines the architecture, safety controls, and MVP path for a future bridge component that writes only "aggio" in ChatGPT web. Key principles:

- The bridge is an "automatic finger", not an agent.
- It writes only the hardcoded string `aggio`.
- It never decides, approves, reads content, or uses APIs.
- Safety controls (kill switch, visible browser, rate limit, fail closed) are mandatory from Phase 2.
- Manual "aggio" remains the permanent fallback.
- Future implementation is runtime-gated; this document only authorizes the manual dry-run checklist.

This design connects with 0139 (activation channel), 0140 (return path of dual-agent loop), and 0141 (INBOX non-interference), completing the preflight documentation workstream for the low-touch loop.

**Task 0142 docs-only — completed 2026-05-13**
