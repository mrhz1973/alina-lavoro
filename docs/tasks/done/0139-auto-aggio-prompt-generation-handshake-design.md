# Task 0139 — Auto-Aggio Prompt-Generation Handshake Design

**Type:** docs-only  
**Workstream:** automation / watcher / runner / low-touch  
**Status:** completed (docs-only design)

---

## Summary

Docs-only design completed. Clarified that "aggio" is not only a status refresh, but serves as a prompt-generation handshake. The design formalizes that:
1. "aggio" means the implementer probably finished
2. ChatGPT web must realign to GitHub
3. ChatGPT must perform post-check
4. ChatGPT must identify whether real human decisions exist
5. If no decisions exist, ChatGPT must immediately generate the next implementer prompt
6. If decisions exist, ChatGPT must stop, ask the user, and generate the next prompt only after the user decides

---

## Deliverables

1. **Design document:** `docs/automation/auto-aggio-prompt-generation-handshake-design.md` — Created
   - Executive summary
   - Updated definition of "aggio"
   - Difference between: status refresh, post-check, prompt-generation handshake, Decision Packet
   - Normal flow without decisions
   - Flow with decisions
   - Activation channels (manual, mobile, future bridge)
   - Hybrid architecture (Telegram/INBOX, Windows/Mac always-on, VPS, browser bridge)
   - Ollama role (classify, compress, help identify DP needed, never decide)
   - Security rules (human decisions remain human, no provider API, bridge may only write hardcoded "aggio")
   - Roadmap (docs-only now, Telegram notifier MVP, Auto-Aggio discipline, local bridge preflight, future bridge, Cursor integration)

2. **Session report:** `docs/sessions/2026-05-13-auto-aggio-prompt-generation-handshake-design.md` — Created
   - Why this clarification was needed
   - Files created/modified
   - Relationship to 0130
   - Key decisions
   - No runtime/no API/no integration confirmation

3. **Updates:**
   - `docs/LLMS.md` — Updated task state
   - `docs/wiki/current-state.md` — Updated task state
   - `docs/roadmap.md` — Added compact entry

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

## Commit

Commit hash: `4cad5cf`  
Commit message: `docs: define auto-aggio prompt generation handshake`

---

## Push

Successfully pushed to origin main.

---

**Task 0139 completed — Auto-Aggio Prompt-Generation Handshake Design (docs-only)**
