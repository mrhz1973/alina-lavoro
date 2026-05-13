# Auto-Aggio Prompt-Generation Handshake Design Session

**Date:** 2026-05-13  
**Task:** 0139 — Auto-Aggio Prompt-Generation Handshake Design  
**Type:** low-touch-loop-docs-only  
**Status:** completed (docs-only design)  
**Implementer:** Windsurf / Cascade

---

## Purpose

Document the completion of the docs-only design for Auto-Aggio as a prompt-generation handshake (task 0139). This design clarifies that "aggio" is not only a status refresh, but serves as the trigger for obtaining real state, post-check, decision identification, and next implementer prompt generation.

---

## Why This Design Was Created

The user requested a docs-only design to formalize that "aggio" is not only a status refresh. The updated meaning is:
1. the implementer probably finished
2. ChatGPT web must realign to GitHub
3. ChatGPT must perform post-check
4. ChatGPT must identify whether real human decisions exist
5. if no decisions exist, ChatGPT must immediately generate the next implementer prompt
6. if decisions exist, ChatGPT must stop, ask the user, and generate the next prompt only after the user decides

This clarification is fundamental to the project's low-touch loop architecture and must be documented as part of the Auto-Aggio workstream.

---

## Files Created/Modified

### Created
- `docs/automation/auto-aggio-prompt-generation-handshake-design.md` — Canonical design document
- `docs/tasks/queue/0139-auto-aggio-prompt-generation-handshake-design.md` — Task queue file
- `docs/sessions/2026-05-13-auto-aggio-prompt-generation-handshake-design.md` — This session report

### Modified
- `docs/LLMS.md` — Updated task state
- `docs/wiki/current-state.md` — Updated task state
- `docs/roadmap.md` — Added compact entry

---

## Relationship to Task 0130 (Auto-Aggio Design)

Task 0130 (Auto-Aggio Design) focused on:
- State detection mechanisms
- Notification systems
- Decision Packet detection
- Anti-false-positive filters
- Failure modes
- Fallback manual

Task 0139 (this task) extends 0130 by adding:
- Prompt-generation handshake concept
- Explicit flow distinction (with/without decisions)
- Activation channels (manual, mobile, future bridge)
- Host strategy (Windows/Mac always-on, VPS, browser bridge)
- Ollama role in context compression
- Clarification that success is NOT just "ChatGPT checked GitHub"

The two tasks are complementary, not contradictory. Task 0130 defines the mechanism for detecting state and triggering notifications. Task 0139 defines what happens after the trigger: post-check, decision identification, and prompt generation.

---

## Key Decisions

### 1. Separate Design File
Decision: Created a new design file (`docs/automation/auto-aggio-prompt-generation-handshake-design.md`) instead of updating the existing `docs/automation/auto-aggio-design.md`.

Reason: The existing auto-aggio-design.md (task 0130) is already 418 lines. Adding a substantial new section about prompt-generation handshake would make it longer and potentially confusing. A separate file allows focused treatment of the prompt-generation handshake concept while maintaining connection to the broader Auto-Aggio workstream.

### 2. Prompt-Generation Handshake Definition
Decision: Defined "aggio" as prompt-generation handshake, not only status refresh.

Key principle: The success of Auto-Aggio is NOT simply "ChatGPT has checked GitHub". The success is:
- state verified
- any decisions identified
- if no decisions: next implementer prompt generated immediately
- if decisions exist: Decision Packet or decision request produced without proceeding further

### 3. Flow Distinction
Decision: Explicitly defined two flows:
- Normal flow without decisions: implementer finishes → GitHub changes → notification → ChatGPT post-check → immediate prompt generation
- Flow with decisions: implementer finishes → ChatGPT post-check → decision found → stop → user decides → prompt generation after decision

### 4. Activation Channels
Decision: Defined three activation channels:
- Manual (current primary): user writes "aggio" in ChatGPT web
- Mobile with Telegram: Telegram notifies → user opens ChatGPT from phone → writes "aggio"
- Future local browser bridge: bridge writes only hardcoded "aggio" → presses Enter

### 5. Hybrid Architecture
Decision: Accepted hybrid architecture:
- Primary pragmatic path: Telegram + manual "aggio" from phone/PC
- Future more automatic path: Local browser bridge writes only "aggio"
- Host strategy: Windows workstation always-on (current), future Mac M2 Pro (secondary), VPS only for n8n/listener/notifier
- Browser bridge preferably on local machine, not remote VPS

### 6. Ollama Role
Decision: Defined Ollama role as advisory only:
- Classify events
- Compress context
- Help identify if Decision Packet is needed
- NOT decide for the user
- NOT replace ChatGPT orchestrator
- NOT replace Cursor implementer

### 7. Security Rules
Decision: Enforced strict security rules:
- Human decisions remain human (merge, deploy, tag, rollback, runtime, API key/billing)
- No provider APIs (ZERO OpenAI API, ZERO Anthropic API, ZERO OpenRouter)
- Local bridge may ONLY write hardcoded "aggio" and press Enter
- Bridge must have kill switch, rate limit, logging
- Bridge must NOT respond to Decision Packet
- Bridge must NOT choose between options
- Bridge must NOT approve merge, authorize runtime, do deploy/tag/rollback

### 8. ZERO API Policy
Decision: Confirmed ZERO API policy intact:
- ChatGPT = web/on-demand orchestration, not OpenAI API
- Claude Code = supervised usage, not Anthropic API
- Local AI = Ollama/local models
- Any provider API / hosted AI call / API key / billing / recurring cost requires explicit future manual gate

---

## Future Gates

### 1. Telegram Notifier MVP (Future Task)
Design Telegram notifier for task completion. User opens ChatGPT from phone and writes "aggio". No runtime integration yet.

### 2. Auto-Aggio Prompt-Generation Discipline (Immediate)
ChatGPT applies this handshake without runtime changes. When user writes "aggio", ChatGPT performs post-check and generates prompt. No n8n changes required.

### 3. Local Browser Bridge Preflight (Future Task, Docs-Only)
Design local browser bridge architecture. Define bridge constraints (only write "aggio"). Define kill switch, rate limit, logging. No actual bridge implementation yet.

### 4. Local Browser Bridge Implementation (Future Runtime-Gated Task)
Implement actual bridge (AutoHotkey/Playwright/Selenium/DesktopCtl/OpenClaw). Test on Windows workstation. Verify bridge writes only "aggio". Runtime-gated: requires manual gate.

### 5. Integration with Cursor Force-Mode Branch Workflow (Future Task)
Integrate prompt-generation handshake with Cursor CLI bridge (task 0135). Define how ChatGPT generates Cursor prompt after "aggio". Define branch lifecycle. Depends on task 0135 completion.

---

## No Runtime / No API / No Integration

This task was strictly docs-only. No runtime was executed:
- No n8n runtime modifications
- No Telegram runtime configuration
- No OpenClaw/DesktopCtl/AutoHotkey/Playwright/Selenium installation
- No Ollama execution
- No Modelfile/profile creation
- No browser bridge creation
- No ChatGPT browser opening
- No src/** modifications
- No gas-current/** modifications
- No .gas/** modifications
- No appsscript.json modifications
- No package.json modifications
- No deploy
- No tag
- No rollback
- No merge
- No provider API usage
- No API key creation
- No billing setup
- No git add .

---

## Micro-Interactions Eliminated

Estimated reduction: ~60–70% of current mechanical micro-interactions:
- User asking "what is the next prompt?" after aggio: eliminated (prompt generated automatically)
- User manually realigning ChatGPT: eliminated (aggio does automatic realignment)
- User identifying if decision is needed: eliminated (ChatGPT identifies automatically)
- User manually generating Decision Packet: eliminated (ChatGPT generates DP if needed)

Remaining intentional gates:
- Response to Decision Packet (intentional gate)
- Manual merge (intentional gate)
- Physical tests (intentional gate)

---

## Conclusione

Task 0139 completed successfully. The design document clarifies that Auto-Aggio serves as a prompt-generation handshake, not just a status refresh. The design connects Auto-Aggio Notifier, Local Browser Bridge, and Prompt-Generation Handshake as one coherent workstream, with clear separation of concerns.

The key principle: Auto-Aggio triggers post-check and decision identification. If no decisions: next implementer prompt generated immediately. If decisions exist: stop, ask user to decide, then generate prompt.

This reduces the need to manually write "aggio" and speeds up arrival at the next prompt to paste into Cursor/Claude/Windsurf, without automating user decisions or using provider APIs.

**Commit:** `4cad5cf` — "docs: define auto-aggio prompt generation handshake"
**Push:** Successfully pushed to origin main

---

**Auto-Aggio Prompt-Generation Handshake Design completato — task 0139 docs-only**
