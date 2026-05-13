# Task 0139 — Auto-Aggio Prompt-Generation Handshake Design

**Type:** docs-only  
**Workstream:** automation / watcher / runner / low-touch  
**Status:** queue

---

## Objective

Create a docs-only design document that clarifies that "aggio" is not only a status refresh, but serves as a prompt-generation handshake. The design must formalize that:

1. "aggio" means the implementer probably finished
2. ChatGPT web must realign to GitHub
3. ChatGPT must perform post-check
4. ChatGPT must identify whether real human decisions exist
5. If no decisions exist, ChatGPT must immediately generate the next implementer prompt
6. If decisions exist, ChatGPT must stop, ask the user, and generate the next prompt only after the user decides

---

## Context

- Task 0130 (Auto-Aggio Design) completed — focuses on state detection and notification
- Task 0138 (Qwen-Alina Modelfile Design) completed — qwen-alina profile design
- The user has clarified that Auto-Aggio serves as prompt-generation handshake, not just status refresh
- This clarification must be formalized in the project documentation

---

## Required Deliverables

1. **Design document:** `docs/automation/auto-aggio-prompt-generation-handshake-design.md`
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

2. **Session report:** `docs/sessions/2026-05-13-auto-aggio-prompt-generation-handshake-design.md`
   - Why this clarification was needed
   - Files created/modified
   - Relationship to 0130
   - Key decisions
   - No runtime/no API/no integration confirmation

3. **Updates:**
   - `docs/LLMS.md` — task state
   - `docs/wiki/current-state.md` — task state
   - `docs/roadmap.md` — compact entry

---

## Document Consolidation Rule

Before creating a new design file, check whether this file already exists:

`docs/automation/auto-aggio-notifier-and-local-browser-bridge-design.md`

If it exists and is not too large/confusing, prefer updating it with a section:

"Auto-Aggio as Prompt-Generation Handshake"

If it does not exist, or if adding the section would make it confusing, create:

`docs/automation/auto-aggio-prompt-generation-handshake-design.md`

**Goal:** Do not create overlapping documentation. Auto-Aggio Notifier, Local Browser Bridge, and Prompt-Generation Handshake must remain connected as one workstream.

---

## Absolute Constraints

- Docs-only
- Do NOT execute n8n runtime
- Do NOT configure Telegram runtime
- Do NOT install OpenClaw/DesktopCtl/AutoHotkey/Playwright/Selenium
- Do NOT run Ollama
- Do NOT create Modelfile/profile
- Do NOT create browser bridge
- Do NOT open ChatGPT browser
- Do NOT modify src/**
- Do NOT modify gas-current/**
- Do NOT modify .gas/**
- Do NOT modify appsscript.json
- Do NOT modify package.json
- Do NOT deploy
- Do NOT tag
- Do NOT rollback
- Do NOT merge
- Do NOT use provider APIs
- Do NOT create API keys
- Do NOT create billing
- Do NOT use git add .

---

## Allowed Paths

- `docs/automation/auto-aggio-prompt-generation-handshake-design.md` (if new file created)
- OR `docs/automation/auto-aggio-notifier-and-local-browser-bridge-design.md` (if existing file updated)
- `docs/sessions/2026-05-13-auto-aggio-prompt-generation-handshake-design.md`
- `docs/LLMS.md`
- `docs/wiki/current-state.md`
- `docs/roadmap.md`

---

## Forbidden Paths

- src/**
- gas-current/**
- .gas/**
- appsscript.json
- package.json
- runtime n8n exports
- credentials
- secrets
- executable scripts
- tools/**
- scripts/**
- any generated runtime artifacts
- any actual Modelfile intended for execution
- Modelfile
- **/Modelfile

---

## Validation

After completion, run:
- `git diff --check`
- `git status --short`

Textual validation:
- Confirm task number is 0139, not 0137
- Confirm "aggio" is documented as prompt-generation handshake, not only status refresh
- Confirm no text suggests automated decisions
- Confirm no text suggests provider APIs
- Confirm local bridge, if mentioned, may only write hardcoded "aggio"
- Confirm Telegram/INBOX remains primary pragmatic path
- Confirm ChatGPT web remains prompt generator/post-check orchestrator, not API

---

## Commit

Use selective staging only. Do NOT use git add .

Suggested commit message:
`docs: define auto-aggio prompt generation handshake`

---

## Push

`git push origin main`

---

## Final Report

Report:
- files created/modified
- where the handshake definition was added
- whether a new design file was created or an existing one updated
- checks executed
- commit hash
- push status
- final git status --short
- confirm no runtime/app/deploy/tag/rollback/API/billing changes
