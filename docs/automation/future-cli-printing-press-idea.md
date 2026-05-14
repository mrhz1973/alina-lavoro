# Future Idea — CLI Printing Press (Low Priority)

**Task:** 0256/0257 (recorded)
**Date:** 2026-05-14
**Type:** future / low-priority idea — NOT implemented
**Status:** idea only — no code, no runtime, no implementation authorized

---

## Status warning

**DO NOT implement this now.**

This document records the CLI Printing Press only as a future/low-priority optimization idea. No code, no runtime, no tool implementation is authorized by this document. All mandatory constraints below must be respected before any future gate is considered.

---

## Concept

CLI Printing Press = a small internal read-only CLI generator that "prints" standardized artifacts from LLM Wiki V3.1 and `docs/tasks/templates/`.

It would not decide, orchestrate, or interpret project state. It would only assemble approved templates + TASK DELTA into standardized output.

---

## Scope (future / gated)

If implemented in a future explicit task under a gate:

- generate delta-based implementer prompts
- generate skeleton task done files
- generate skeleton session notes
- generate skeleton GitHub Web Patch Packs
- generate checklist/final report contract snippets

Goal: reduce monolithic prompts, task-ID errors, and repeated boilerplate.

---

## Priority and recommended order

**Do not implement now.** Recommended order when/if proceeding:

1. V3.1 Enforcement + Prompt Size Guard first (task 0254 — completed).
2. Optional AGENTS.md pointer-only — only if explicitly decided later.
3. Then: CLI Printing Press design docs-only (no code).
4. Then, only under explicit later gate: CLI Printing Press MVP read-only.

---

## Future desired shape (docs-only sketch)

```
tools/printing-press/
  README.md
  alina_print.py
  templates-map.json
```

## Future possible commands (docs-only sketch)

```
alina_print prompt --type docs-only --task XXXX --goal "..."
alina_print prompt --type n8n-template-first --task XXXX --goal "..."
alina_print patch-pack --task XXXX --files ...
alina_print session --task XXXX --slug ...
```

Output allowed in a future gated MVP:
- stdout only
- optionally `.local/outbox/` ignored by Git

---

## Mandatory constraints (permanent — apply before any future gate)

The CLI must:
- be read-only by default
- never write to Git automatically
- never commit or push
- never tag or deploy
- never call n8n UI, n8n import, Execute, or Schedule change
- never send Telegram messages
- never call any provider API
- never introduce billing, secrets, real chat_id, or tokens
- never behave as an autonomous agent
- never decide, orchestrate, or interpret project state beyond read-only preflight

---

## What this document is NOT

- It is NOT a task in `docs/tasks/queue/`.
- It is NOT a Decision Packet.
- It is NOT authorization to implement the tool.
- It is NOT a runtime gate.
- It does NOT open any INBOX entry.

---

## Related documents

- `docs/wiki/v31-enforcement-checklist.md` — V3.1 Prompt Size Guard (the prerequisite that must exist first)
- `docs/wiki/template-pack-index.md` — current template pack
- `docs/automation/next-low-touch-runtime-gate-backlog.md` — broader future gate backlog
