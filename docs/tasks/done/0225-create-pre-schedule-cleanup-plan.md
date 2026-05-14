# Task 0225 — Create Pre-Schedule Cleanup Plan

- **Project:** Alina Lavoro
- **Type:** docs-only
- **Status:** done
- **Priority:** normal
- **Deploy policy:** no

---

## Objective

Create the cleanup-first path document that defines what must be cleaned in the Telegram Mode A notifier workflow before Schedule Trigger activation.

---

## Done status

**Completed by:** Claude Code (supervised implementer)
**Completion date:** 2026-05-14
**Completion commit:** see batch 0224–0226 commit

### Document created

`docs/automation/telegram-mode-a-pre-schedule-cleanup-plan.md`

### Summary

- **Docs-only:** no runtime; no n8n UI action by this document.
- **Cleanup candidates defined (2):**
  1. Stale `D-0165-A` scope_note wording in `Build notification payload` — replacement intent recorded.
  2. `short_hash` empty mapping in `Store notification state` — inspection plan recorded; safe-source mapping or documented "empty is acceptable" outcome.
- **Activation sequencing preserved:** after successful cleanup with no new risk, proceed toward controlled Schedule Trigger activation per the supervision checklist, without asking the same strategic choice again.
- **User conditional activation intent recorded** in the plan (Section D).
- **Next manual work** is supervised n8n cleanup, not Schedule activation yet.

### Runtime safety preserved

- No Schedule Trigger activation by this document.
- No Execute.
- No Telegram send.
- No workflow import/export.
- No queue reader modification.
- No app/deploy/tag/rollback.
- No real Chat ID, token, OAuth material, or credential export recorded.
- Future n8n UI cleanup must be supervised step-by-step.
