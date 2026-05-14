# Session — D-0221-A Cleanup-First Conditional Activation Intent

**Date:** 2026-05-14
**Batch:** 0224–0226
**Type:** docs-only / decision recording
**Branch:** main

---

## User statement

After D-0221-A was created as Pending in the previous batch (0219–0223), the user explicitly stated in chat:

> "allora te lo dico già, cosi non devi aspettare e non devo aspettare.. subito D-0221-A = 3 insieme a D-0221-A = 1"

---

## Why the formal response is 3 (and not also 1)

A Decision Packet has exactly one formal `response` value. The two values `3` and `1` are **mutually exclusive options** within D-0221-A:

- **Option 1** = authorize controlled Schedule Trigger activation now.
- **Option 3** = defer activation and perform cleanup first.

Recording both simultaneously would create an inconsistent decision state. The orchestrator and the implementer must interpret the user's statement carefully:

- The **strategic choice now** is cleanup-first → formal `response = 3`.
- The **conditional follow-on intent** (after cleanup succeeds and no new risk is found): proceed toward the controlled Schedule Trigger activation path without re-asking the same strategic question.

This way the user is not asked the same strategic choice again after cleanup completes. The orchestrator can move directly into the supervised activation procedure once cleanup is closed.

---

## What was recorded

- **D-0221-A = 3** in `docs/INBOX.md` (moved from Pending to Decided).
- **Conditional follow-on activation intent** recorded in:
  - `docs/tasks/done/0224-record-d0221a-cleanup-first-conditional-activation-intent.md`
  - `docs/automation/telegram-mode-a-pre-schedule-cleanup-plan.md` (Section D — Activation sequencing)
- **Cleanup plan** created: `docs/automation/telegram-mode-a-pre-schedule-cleanup-plan.md` covering the two non-blocking findings from D-0217-A inspection.

---

## What the conditional intent does NOT authorize

- It does **not** activate Schedule Trigger.
- It does **not** authorize Execute.
- It does **not** waive the supervised first-tick observation requirement.
- It does **not** waive the secrets-handling rules (no real Chat ID, token, OAuth material, credential export).
- It does **not** authorize queue reader modification.
- It does **not** authorize app/deploy/tag/rollback.
- It does **not** authorize provider API LLM, new billing, or new API keys.

The user has expressed strategic alignment, not runtime permission. Runtime permission for Schedule activation remains gated by the supervision checklist procedure executed step-by-step by the user.

---

## Next manual supervised step

When the user is ready:

1. Open the Telegram Mode A notifier workflow `TEST - Alina task completion Telegram notifier` in n8n UI.
2. Confirm workflow inactive and no Schedule Trigger present.
3. Edit the `scope_note` field in `Build notification payload` to a current neutral wording (example in cleanup plan §B.1).
4. Inspect `short_hash` mapping in `Store notification state`; either map to a safe upstream source or document why empty is acceptable.
5. Confirm no new risk introduced.
6. Report back.

Only **after** that report, the orchestrator continues with the supervised Schedule Trigger activation per the supervision checklist — without re-asking the strategic choice.

---

## Tasks completed in this batch

| Task | Description |
|------|-------------|
| 0224 | Record D-0221-A = 3 plus conditional activation intent |
| 0225 | Create pre-schedule cleanup plan |
| 0226 | Update state after D-0221-A cleanup-first decision |

Plus this session note.

---

## No runtime actions by implementer

No n8n UI action was performed by the implementer in this batch. No Execute, no Schedule Trigger, no Telegram send, no workflow import/export. Queue reader untouched. No app/deploy/tag/rollback. No real Chat ID recorded.
