# 0206 — Create template import/inspection Decision Packet (D-0206-A) and supersede D-0202-A

- Project: Alina Lavoro
- Type: docs-only / Decision Packet
- Status: done
- Priority: normal
- Deploy: no
- Date: 2026-05-14

## Scope

Create a new pending Decision Packet `D-0206-A` in `docs/INBOX.md` authorizing **import and inspection only** (no Execute) of the fully-pinned n8n template produced by task 0205.

Simultaneously, supersede the previously pending `D-0202-A` (controlled inspection/repair of the duplicate TEST-only pinned workflow). The user's priority shift toward time-and-results and the new template-first policy (task 0204) make the inspection/repair path slower and inferior to importing a clean fully-pinned template. D-0202-A is moved from `Pending` to `Superseded` in `docs/INBOX.md` with a clear reason and a forward pointer to D-0206-A.

## D-0206-A summary

- **Decision ID:** D-0206-A
- **Kind:** automation
- **Status:** pending
- **Options:**
  1. Authorize import and inspection of the fully-pinned TEST-only n8n harness template into n8n UI, with no Execute. Scope: import JSON, bind existing Telegram credential, bind real chat_id inside n8n only, verify Data Table = `alina_telegram_notifier_state`, verify `active=false`, verify no active Schedule Trigger, verify all expressions use `$json.*` only.
  2. Do not import now; keep notifier manual-only and continue docs/design.
  3. Defer and refine template/design further.
- **Recommendation:** Option 1. Next safe fast step is import/inspection of a fully pinned TEST-only template with no Execute. A future separate Decision Packet would be required for any Execute.

## D-0202-A supersession

- D-0202-A moves from `Pending` to `Superseded` in `docs/INBOX.md`.
- Reason: the project adopted the n8n template-first policy (task 0204). Inspection/repair of an existing duplicate workflow is slower than importing a clean fully-pinned template, and risks reintroducing dynamic-reference leakage. D-0206-A replaces it.
- No silent decision is recorded for D-0202-A; the supersession is itself the closure mechanism and is documented inline in INBOX with `response: superseded`.

## Done status

- Completed by: Claude Code (implementer)
- Completion commit: this batch
- Evidence:
  - INBOX update: D-0202-A → Superseded, D-0206-A → Pending in `docs/INBOX.md`.
  - This file documents the supersession reason and the new DP shape.
- No runtime. No n8n UI. No Execute. D-0206-A is created as **Pending** only; ChatGPT/implementer must not auto-select any option.
