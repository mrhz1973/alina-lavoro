# Telegram Mode A — Credential Prerequisite Guide

**Task:** 0162
**Date:** 2026-05-13
**Type:** docs-only / user-guided prerequisite
**Depends on:** `docs/automation/telegram-mode-a-completion-notification-mvp.md` (task 0161)

---

## 1. Purpose

This document is a prerequisite guide for a future human operator who will set up the Telegram bot and n8n credential required by the Telegram Mode A completion notification MVP (designed in task 0161).

This guide does not execute anything. It does not create a bot. It does not contact Telegram or BotFather. It does not obtain, store, or transmit any token or chat id. It does not configure n8n runtime. No runtime is activated by this document.

The goal is to ensure that when the future runtime implementation task begins, the operator knows exactly what preparation is needed, how to handle secrets safely, and where the hard stop conditions are.

---

## 2. Non-goals / hard boundaries

The implementer (Claude Code, Cursor, Windsurf, or any agent) must not:

- create a Telegram bot
- contact BotFather or the Telegram Bot API
- generate or retrieve a bot token
- collect or store a chat id
- configure n8n runtime
- create or modify n8n workflows
- export or import n8n workflow JSON
- send Telegram messages
- write token or chat id into any repo file (docs, session files, task files, INBOX entries, commit messages, workflow exports, screenshots, README, or any other tracked file)
- write secrets into shell history, console logs, AI chat, sticky notes, or clipboard beyond the time needed to enter the credential into n8n vault
- use Browser Bridge, Ollama, Cursor CLI, or provider APIs
- deploy, tag, roll back, or modify app source

This guide is documentation only. All runtime steps require a separate explicit manual gate (see §9).

---

## 3. Credential and secret boundary

| Rule | Detail |
|------|--------|
| Storage location | Telegram bot token and chat id must exist **only** in the human-controlled n8n credential vault on the VPS |
| Never in repo | Token and chat id must never be committed — not in docs, session files, INBOX entries, task files, commit messages, exported workflow JSON, screenshots, or any other tracked file |
| No console log | Token and chat id must never appear in n8n node `console.log`, sticky notes, or debug output |
| No AI chat paste | Do not paste the token or chat id into any AI chat (including Claude Code, ChatGPT, or Cursor) — not even "just to check" |
| No shell history | Avoid shell commands that embed the token inline; if used temporarily, rotate afterward |
| Clipboard hygiene | Clear clipboard after pasting token/chat id into n8n vault |
| Accidental exposure | If a token or chat id is accidentally exposed anywhere (repo, AI chat, shell history, screenshot), treat it as compromised: revoke it via BotFather immediately before any further work |
| Redaction gate | Any n8n workflow JSON export produced for documentation purposes must be fully redacted (replace all credential values with `<REDACTED>`) before committing; never commit a real token value |

**Placeholders in this and related docs:** when this guide uses `<TELEGRAM_BOT_TOKEN>` or `<TELEGRAM_CHAT_ID>`, these are literal placeholder strings only. They must never be replaced with real values inside any repository file.

---

## 4. BotFather user-guided prerequisite

This section describes future manual steps for the human operator only. The implementer does not execute these steps.

**Conceptual sequence (future manual, human only):**

1. Open Telegram on your device.
2. Start a conversation with `@BotFather`.
3. Send `/newbot` and follow the prompts to choose a name and username for the bot.
4. BotFather will display a bot token in the format `<numeric_id>:<alphanumeric_string>`. This is your bot token.
5. Copy the token into a secure, temporary, human-controlled location **only long enough to enter it into the n8n credential vault** (see §6).
6. After entering the token into the n8n vault, clear it from your clipboard and from any temporary note.
7. Do not paste the token anywhere else — not in this guide, not in any repo file, not in any AI chat.

**Important:**
- Do not share the token with anyone.
- Do not include the token in commit messages, session files, or task notes.
- The token is permanent until you revoke it via BotFather. If you suspect it was exposed, send `/revoke` to BotFather immediately.

---

## 5. Chat id user-guided prerequisite

The Telegram chat id identifies the private chat or group to which the notifier will send messages. It is also sensitive configuration and must not be committed.

**Conceptual sequence for identifying the chat id (future manual, human only):**

1. After the bot exists, send a message to the bot from the Telegram account you want to receive notifications.
2. Retrieve the chat id using one of these approaches — all require using the Telegram API temporarily and privately:
   - Use a Telegram client or bot tool that displays the chat id directly.
   - Or: access `https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getUpdates` in a browser after sending the message, and read the `chat.id` value from the JSON response. Note: do this privately; do not share the URL (it contains the real token) with anyone and do not commit it.
3. Note the chat id in a secure, temporary, human-controlled location only long enough to enter it into the n8n credential vault.
4. After entering it into the n8n vault, clear it from your clipboard and temporary notes.

**Important:**
- The chat id is not a secret in the same class as the token, but it identifies your target notification target — keep it out of the repo.
- If placeholders are needed in documentation: use `<TELEGRAM_CHAT_ID>` only.
- Never replace `<TELEGRAM_CHAT_ID>` with a real value inside any repository file.

---

## 6. n8n credential vault prerequisite

**Credential name (pinned):** `telegram_alina_notifier`

**Type:** n8n native Telegram credential (or "Generic Credential" if native Telegram type is unavailable).

**Fields to store:**
- Bot token: the value from BotFather (§4). Field name in n8n: `Access Token` or `Token` depending on credential type.
- Chat id: the value from §5. Store as a separate credential field or as a second Generic Credential entry if needed.

**Rules:**
- Store token and chat id only in the n8n vault on the existing VPS n8n instance.
- Do not export a workflow JSON that contains these values. If you must export for documentation: redact all credential values with `<REDACTED>` before committing.
- Verify that the credential appears in the n8n UI by name only — never log it, never display it in a node output or sticky note.
- Use n8n's built-in "test connection" feature to verify the credential works; the test does not send a message to the real chat.

---

## 7. Pre-runtime checklist

Before any future runtime task (workflow creation, test send) begins, the following must all be true:

- [ ] Telegram bot exists (created by operator via BotFather)
- [ ] Bot token stored in n8n credential vault as `telegram_alina_notifier` — not in repo
- [ ] Chat id stored in n8n credential vault or equivalent private runtime setting — not in repo
- [ ] `git status --short` shows no staged or unstaged secrets files
- [ ] `git diff --check` passes with no errors
- [ ] Repository grep search confirms no Telegram-token-shaped string in tracked files:

  ```
  git grep -E "[0-9]{8,}:[A-Za-z0-9_-]{30,}"
  ```

  Expected result: no match. If any match is found, stop and treat the exposure as a credential leak.

- [ ] No exported n8n workflow JSON contains real credentials
- [ ] No screenshots with token or chat id committed
- [ ] `docs/INBOX.md` has 0 pending decisions (or any pending decisions have been reviewed and are not a blocker)
- [ ] The operator is ready to proceed step-by-step under PRIORITÀ 0 for every n8n UI action

---

## 8. Leak-prevention verification

Run these checks locally before any commit related to Telegram runtime work:

```bash
# Check branch
git branch --show-current
# Expected: main

# Check workspace
git status --short
# Expected: only .obsidian/ untracked (local personal notes)

# Check whitespace
git diff --check

# Check staged diff for token-like strings
git diff --cached | grep -E "[0-9]{8,}:[A-Za-z0-9_-]{30,}" || true
# Expected: no output (no match)

# Check entire repo for token-like strings (conservative; adjust if false positives appear)
git grep -E "[0-9]{8,}:[A-Za-z0-9_-]{30,}" || true
# Expected: no match (except this guide's placeholder examples, which contain no real token)

# Review what is staged
git diff --cached --stat
```

These checks do not require installing new tools — they use Git only. Do not run network commands or curl the Telegram API from Claude Code or any implementer session.

---

## 9. Future gate required

**Gate status (updated task 0163, 2026-05-13):** `D-0163-A = 1` recorded. This opens only the manual credential prerequisite gate described in this guide. The user may proceed with BotFather bot creation and n8n credential vault setup (§4–§6). A separate future explicit manual gate is still required before any n8n workflow creation or test message.

**Completion status (updated task 0164, 2026-05-13):** The user reported completing the manual credential prerequisite phase:
- Telegram bot exists (created via BotFather).
- n8n credential `telegram_alina_notifier` exists; connection test succeeded.
- Chat id saved privately by the user.
- No token or chat id is stored in the repository.
- No n8n workflow was created.
- No Telegram message was sent.
- Workflow creation / test message / schedule activation remain separately gated.

**Workflow creation gate (updated task 0165, 2026-05-13):** `D-0165-A = 1` recorded. This opens only the future n8n workflow creation gate. The credential guide remains the secret-handling boundary. No secrets in repo. Test message requires a separate future explicit gate. Schedule activation requires a separate future explicit gate.

**Workflow skeleton creation (updated task 0166, 2026-05-13):** The user reported creating and saving the workflow skeleton `TEST - Alina task completion Telegram notifier` in n8n. Node chain: Manual Trigger → List done files → Pick latest done file → Get done file → Build notification payload. No Telegram node was added. No test message was sent. No Schedule Trigger was added. No token or chat id is stored in the repository. This credential guide remains the secret-handling boundary. Test message requires a separate future explicit gate.

**Telegram node addition gate (updated task 0167, 2026-05-13):** `D-0167-A = 1` recorded. This opens only the future Telegram node addition gate. Chat id must be used only in n8n UI/runtime configuration by the user — never in repo/docs/AI chat. This credential guide remains the secret-handling boundary. No secrets in repo. Test message requires a separate future explicit gate.

After completing the manual prerequisite steps (§4, §5, §6), a future explicit manual gate is required before any runtime configuration or test message. This guide does not authorize any of the following:

- Creating the n8n notifier workflow (`TEST - Alina task completion Telegram notifier`)
- Adding any Telegram node to n8n
- Firing a test message
- Enabling a Schedule Trigger

The likely next step after the credential is in place would be a user-supervised n8n workflow creation task (indicative task 0163 from the MVP phase plan in `docs/automation/telegram-mode-a-completion-notification-mvp.md` §13), executed step-by-step under PRIORITÀ 0. That task will require explicit user consent before each n8n UI action.

No implementer or agent may proceed to runtime steps based on this guide alone.

---

## 10. Stop conditions

Any future implementer working on Telegram runtime must stop immediately and report if:

- A bot token appears or would appear in any tracked repository file
- A chat id appears or would appear in any tracked repository file
- An n8n workflow JSON export contains real credential values
- Any instruction requires the implementer to contact Telegram or BotFather directly
- Any runtime execution (n8n workflow creation, test send, schedule activation) is initiated without explicit per-step user approval
- Any modification to `src/**`, `gas-current/**`, `appsscript.json`, `package.json`, `.github/workflows/**`, or `tools/**` is requested
- Any provider API key, hosted LLM call, or new billing surface is introduced
- Any deploy, tag, or rollback is triggered
- The user has not explicitly approved the current n8n UI step (PRIORITÀ 0)

---

*This document is docs-only. No runtime was activated. No bot was created. No token was obtained. No chat id was stored. No n8n workflow was created or modified. Authorization basis: D-0157-A = 1 (task 0159); MVP scaffolding: task 0161; this guide: task 0162.*
