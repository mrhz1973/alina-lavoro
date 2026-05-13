# Auto-Aggio as Prompt-Generation Handshake Design

**Date:** 2026-05-13  
**Task:** 0139-auto-aggio-prompt-generation-handshake-design  
**Type:** low-touch-loop-docs-only  
**Status:** completed (docs-only design)

---

## Executive Summary

This document clarifies that **"aggio" is not only a status refresh mechanism**. "aggio" serves as the trigger for obtaining:
- real state
- post-check
- decision identification
- next implementer prompt (if no decisions)

The success of Auto-Aggio is NOT simply "ChatGPT has checked GitHub". The success is:
- state verified
- any decisions identified
- if no decisions: next implementer prompt generated immediately
- if decisions exist: Decision Packet or decision request produced without proceeding further

This design extends the existing Auto-Aggio design (task 0130) by emphasizing the prompt-generation aspect. Auto-Aggio Notifier, Local Browser Bridge, and Prompt-Generation Handshake remain connected as one workstream.

---

## Updated Definition of "aggio"

**"aggio"** = trigger for post-check and prompt-generation handshake.

When triggered (manually by user writing "aggio", or automatically by future bridge), ChatGPT:
1. reads GitHub to reconstruct real state
2. performs post-check (completion indicators, risks, validation)
3. identifies if any real decisions are required (Decision Packet, manual gate)
4. if NO decisions: generates the next implementer prompt immediately
5. if decisions exist: stops, produces Decision Packet or decision request, waits for user decision before generating next prompt

---

## Difference Between Status Refresh, Post-Check, Prompt-Generation Handshake, and Decision Packet

| Aspect | Status Refresh Only | Post-Check | Prompt-Generation Handshake | Decision Packet |
|--------|-------------------|------------|----------------------------|----------------|
| Purpose | Inform user of state | Verify completion indicators | Obtain state AND generate next prompt | Request user decision between alternatives |
| Output | State summary | Validation result | State summary + next implementer prompt (if no decisions) | Structured decision request with options |
| Decision handling | May or may not stop | May or may not stop | Always stops for decisions | Always stops for decision |
| Prompt generation | Not guaranteed | Not guaranteed | Guaranteed if no decisions | Not applicable (decision first, then prompt) |
| User action | User must request next prompt | User must request next prompt | Next prompt ready to paste | User chooses option/number/word |
| When used | Manual status check | After task completion | After task completion | When real choice exists |

---

## Normal Flow Without Decisions

1. **Implementer finishes task** → commits and pushes to main
2. **GitHub changes** (done marker + session + commit)
3. **n8n/Telegram or future bridge signals user**
   - Current: Telegram notifies user
   - Future: Local Browser Bridge writes only "aggio"
4. **User opens ChatGPT from phone/PC** and writes "aggio" (or future bridge writes "aggio" automatically)
5. **ChatGPT performs post-check:**
   - reads GitHub
   - verifies done marker + session + commit
   - checks for Decision Packet patterns
   - checks for manual gates
6. **ChatGPT identifies NO real decisions required**
7. **ChatGPT generates next implementer prompt immediately**
8. **User pastes prompt into Cursor/Claude/Windsurf**
9. **Loop continues**

---

## Flow With Decisions

1. **Implementer finishes task** → commits and pushes to main
2. **GitHub changes**
3. **n8n/Telegram or future bridge signals user**
4. **User opens ChatGPT and writes "aggio"** (or future bridge writes "aggio" automatically)
5. **ChatGPT performs post-check**
6. **ChatGPT identifies a real decision required:**
   - Decision Packet pattern found
   - OR manual gate detected (deploy, tag, rollback, runtime, app changes, API key, login, GitHub Actions)
7. **ChatGPT STOPS the flow**
8. **ChatGPT produces Decision Packet or decision request**
9. **User makes decision**
10. **After user decision, ChatGPT generates next implementer prompt**
11. **User pastes prompt into implementer**
12. **Loop continues**

---

## Activation Channels

### 1. Manual (Current Primary)
- User writes "aggio" in ChatGPT web
- User opens ChatGPT from PC/phone
- User triggers post-check explicitly

### 2. Mobile with Telegram
- Telegram notifies user when task completes
- User opens ChatGPT from phone
- User writes "aggio" from phone
- ChatGPT performs post-check and generates prompt

### 3. Future: Local Browser Bridge
- n8n calls Windows/Mac always-on machine
- Bridge (AutoHotkey/Playwright/Selenium/DesktopCtl/OpenClaw) controlled
- Bridge opens/focuses ChatGPT web in browser
- Bridge writes ONLY the hardcoded string "aggio"
- Bridge presses Enter
- ChatGPT performs post-check and generates prompt
- Bridge is "automatic finger", NOT decision agent

### 4. No Provider APIs
- All channels are local/web-based
- No OpenAI API
- No Anthropic API
- No OpenRouter
- No hosted provider AI calls
- No API keys
- No billing
- ZERO API policy intact

---

## Hybrid Architecture

### Primary Pragmatic Path (Current)
GitHub/n8n detects task finished → Telegram notifies user → user opens ChatGPT from phone/PC → user writes "aggio" → ChatGPT performs post-check and generates implementer prompt

### Future More Automatic Path
GitHub/n8n detects task finished → n8n calls Windows/Mac always-on machine → local browser bridge writes only "aggio" → ChatGPT performs post-check and generates implementer prompt

### Host Strategy

**Windows workstation always-on (current):**
- Ryzen 9 3900X / RTX 3060 12 GB
- Current local host for Ollama qwen3:14b
- Preferred host for future local browser bridge
- Browser bridge on local machine, not remote VPS

**Future Mac M2 Pro (possible):**
- Secondary host for lightweight orchestration
- Possible always-on host if Windows not available
- Still local, not VPS

**VPS (Ubuntu 24.04.4 LTS):**
- Only for n8n/listener/notifier
- Docker/n8n at 127.0.0.1:5678 (hardened)
- NOT for browser bridge (prefer local machine)

---

## Role of Ollama

Ollama local models (qwen3:14b, future qwen-alina:14b) may assist in:

- **Classify events** — task type, risk level, required gates
- **Compress context** — for ChatGPT post-check efficiency
- **Help identify if Decision Packet is needed** — pattern detection
- **Decision Packet draft helper** — assist in generating Decision Packets
- **LLMS/wiki summarizer** — summarize state for context

### Ollama Limitations

- **NOT decide for the user** — advisory only
- **NOT replace ChatGPT orchestrator** — ChatGPT remains strategic orchestrator
- **NOT replace Cursor implementer** — Cursor remains operational implementer
- **NOT execute shell** — no shell execution
- **NOT modify files** — no file modification
- **NOT deploy** — no deploy
- **NOT source of truth** — GitHub is source of truth

---

## Security Rules

### Decisions Remain Human

- Merge decisions remain human
- Deploy decisions remain human
- Tag decisions remain human
- Rollback decisions remain human
- Runtime decisions remain human
- App source changes remain human
- API key/billing decisions remain human
- Sensitive gate decisions remain human

### No Provider APIs

- ZERO OpenAI API
- ZERO Anthropic API
- ZERO OpenRouter
- ZERO hosted provider AI calls
- ZERO API keys
- ZERO billing
- ZERO recurring costs
- ChatGPT = web/on-demand orchestration
- Claude Code = supervised usage
- Local AI = Ollama/local models

### Local Bridge Constraints

If local browser bridge is implemented in future:
- May ONLY write hardcoded "aggio"
- May ONLY press Enter
- May optionally verify being in correct chat
- Must log the event
- Must have kill switch
- Must have rate limit
- Must be local or on secure network
- Must NOT expose public panels
- Must NOT respond to Decision Packet
- Must NOT choose between options
- Must NOT approve merge
- Must NOT authorize runtime
- Must NOT do deploy
- Must NOT do tag
- Must NOT do rollback
- Must NOT use APIs
- Must NOT create API keys
- Must NOT modify repo
- Must NOT write text other than "aggio" except for explicit test

---

## Relationship to Existing Auto-Aggio Design (Task 0130)

This design extends the existing Auto-Aggio design (task 0130) by emphasizing the prompt-generation aspect.

### Existing Auto-Aggio Design (0130) Focuses On:
- State detection
- Notification
- Decision Packet detection
- Anti-false-positive filters
- Failure modes
- Fallback manual

### This Design (0139) Adds:
- Prompt-generation handshake
- Explicit flow distinction (with/without decisions)
- Activation channels (manual, mobile, future bridge)
- Host strategy
- Ollama role in context compression
- Clarification that success is NOT just "ChatGPT checked GitHub"

### Complementary Relationship

The two sections are complementary, not contradictory. Task 0130 defines the mechanism for detecting state and triggering notifications. Task 0139 defines what happens after the trigger: post-check, decision identification, and prompt generation.

---

## Relationship to Other Automation Components

### Auto-Aggio Notifier (Future)
- Notifies user when task completes
- May use Telegram
- May use local bridge
- This design defines what happens after notification

### Local Browser Bridge (Future)
- Writes only "aggio"
- Presses Enter
- This design defines what ChatGPT does after receiving "aggio"

### Decision Packet (Task 0127)
- Format for structured decisions
- This design defines when Decision Packet is generated (after post-check)

### Cursor CLI Force-Mode Bridge (Task 0135)
- Implementer bridge architecture
- This design defines how ChatGPT generates prompt for Cursor after "aggio"

### Ollama Classifier/Planner (Task 0133)
- Local classifier for task triage
- This design defines how Ollama may assist in context compression for ChatGPT

---

## Roadmap

### 1. Docs-Only Prompt-Generation Handshake Design (This Task 0139) — ✅ Completed
- Clarify that "aggio" is prompt-generation handshake, not only status refresh
- Define flows with/without decisions
- Define activation channels
- Define host strategy
- Define Ollama role
- No runtime changes

### 2. Telegram Notifier MVP (Future Task)
- Design Telegram notifier for task completion
- Notify user when task completes
- User opens ChatGPT from phone and writes "aggio"
- No runtime integration yet

### 3. Auto-Aggio Prompt-Generation Discipline (Immediate)
- ChatGPT applies this handshake without runtime changes
- When user writes "aggio", ChatGPT performs post-check and generates prompt
- No n8n changes required
- Can be applied immediately as ChatGPT discipline

### 4. Local Browser Bridge Preflight (Future Task, Docs-Only)
- Design local browser bridge architecture
- Define bridge constraints (only write "aggio")
- Define kill switch, rate limit, logging
- No actual bridge implementation yet

### 5. Local Browser Bridge Implementation (Future Runtime-Gated Task)
- Implement actual bridge (AutoHotkey/Playwright/Selenium/DesktopCtl/OpenClaw)
- Test on Windows workstation
- Verify bridge writes only "aggio"
- Verify ChatGPT post-check works
- Runtime-gated: requires manual gate

### 6. Integration with Cursor Force-Mode Branch Workflow (Future Task)
- Integrate prompt-generation handshake with Cursor CLI bridge (task 0135)
- Define how ChatGPT generates Cursor prompt after "aggio"
- Define branch lifecycle
- Depends on task 0135 completion

---

## Micro-Interactions Eliminated

| Interazione | Frequenza attuale | Eliminata da questo design |
|---|---|---|
| Utente deve chiedere "qual è il prossimo prompt?" dopo aggio | 5–10 / giorno | ✅ Sì — prompt generato automaticamente |
| Utente deve riallineare ChatGPT manualmente | 5–10 / giorno | ✅ Sì — aggio fa riallineamento automatico |
| Utente deve identificare se serve decisione | Variabile | ✅ Sì — ChatGPT identifica decisioni automaticamente |
| Utente deve generare Decision Packet manualmente | 1–2 / giorno | ✅ Sì — ChatGPT genera DP se serve |
| Risposta a Decision Packet | 1–2 / giorno | ❌ No — gate intentionale |
| Merge manuale | 1 / settimana | ❌ No — gate intentionale |

**Stima riduzione:** ~60–70% delle micro-interazioni meccaniche attuali.

---

## Failure Modes

| Failure | Detection | Mitigation |
|---------|-----------|------------|
| ChatGPT misses decision | Post-check validation | Manual override, user writes "aggio" again |
| ChatGPT generates wrong prompt | User review before pasting | User rejects prompt, writes "aggio" again |
| Bridge writes wrong text | Bridge logging, kill switch | Kill switch, manual "aggio" fallback |
| Bridge cannot find ChatGPT tab | Bridge verification | Manual "aggio" fallback |
| Ollama misclassifies task | Post-check validation | Manual override, ignore Ollama output |
| n8n polling fails | Fallback to manual "aggio" | Manual "aggio" always available |
| Telegram notification fails | User checks GitHub manually | Manual "aggio" fallback |
| Context too large for ChatGPT | Ollama context compression | Manual "aggio" with selective context |

---

## Fallback

Manual "aggio" always remains available:
- User can always write "aggio" in ChatGPT web
- User can always open ChatGPT from phone/PC
- No dependency on automation
- No dependency on bridge
- No dependency on n8n

**Principle:** Auto-Aggio is additive, not substitutive. The user can always force realignment by writing "aggio" even if automation fails.

---

## Conclusione

Auto-Aggio is now understood as a prompt-generation handshake, not just a status refresh. The key principle:
- Auto-Aggio triggers post-check and decision identification
- If no decisions: next implementer prompt generated immediately
- If decisions exist: stop, ask user to decide, then generate prompt

This reduces the need to manually write "aggio" and speeds up arrival at the next prompt to paste into Cursor/Claude/Windsurf, without automating user decisions or using provider APIs.

The design connects Auto-Aggio Notifier, Local Browser Bridge, and Prompt-Generation Handshake as one coherent workstream, with clear separation of concerns:
- Notifier: signals user
- Bridge: writes "aggio" (future)
- Handshake: ChatGPT post-check + prompt generation

**Auto-Aggio as Prompt-Generation Handshake completato — task 0139 docs-only**
