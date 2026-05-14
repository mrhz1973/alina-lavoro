# Task 0224 — Record D-0221-A Cleanup-First Conditional Activation Intent

- **Project:** Alina Lavoro
- **Type:** docs-only
- **Status:** done
- **Priority:** normal
- **Deploy policy:** no

---

## Objective

Record D-0221-A = 3 (cleanup-first path) and the user's conditional follow-on intent toward Schedule Trigger activation after cleanup succeeds.

---

## Done status

**Completed by:** Claude Code (supervised implementer)
**Completion date:** 2026-05-14
**Completion commit:** see batch 0224–0226 commit

### User statement

The user explicitly stated in chat:

> "allora te lo dico già, cosi non devi aspettare e non devo aspettare.. subito D-0221-A = 3 insieme a D-0221-A = 1"

### Canonical interpretation

This is **NOT** a simultaneous double response to D-0221-A. The two values cannot coexist as the formal `response` field.

**Correct interpretation:**

1. **Formal response:** `D-0221-A = 3` — cleanup-first path before Schedule Trigger activation.
2. **Conditional follow-on intent (recorded, not authorization):** after cleanup succeeds and no new risk is found during the cleanup itself, proceed toward the controlled Schedule Trigger activation path **without asking the same strategic choice again**.
3. The conditional intent does **not** activate Schedule Trigger and does **not** authorize Execute. Runtime safety remains step-by-step and supervised.

### State after this task

- D-0221-A: Decided / response = 3.
- Cleanup-first path selected.
- Conditional follow-on activation intent recorded as supervised next phase (not immediate activation).
- Telegram Mode A remains manual-only/inactive.
- No Schedule Trigger activated.
- No automatic Telegram notification active.
- No n8n runtime action authorized by this docs-only task.

### Cleanup candidates (from D-0217-A inspection findings)

1. **Stale `D-0165-A` scope_note** in `Build notification payload`.
   - Old wording mentions "No Telegram test message authorized" (irrelevant after D-0167-A onwards).
   - Replacement intent: neutral current runtime-scope wording.

2. **`short_hash` empty mapping** in `Store notification state`.
   - Inspect whether `short_hash` should be populated from upstream node output or commit hash source.
   - If safe, map to existing meaningful field; otherwise document why empty is acceptable.

### Next work (future, supervised, step-by-step)

Future manual n8n UI cleanup of the two findings above — one step at a time, no Execute, no Schedule activation. Cleanup plan: `docs/automation/telegram-mode-a-pre-schedule-cleanup-plan.md`.

### Non-authorizations

- No Execute.
- No Schedule Trigger activation.
- No Telegram send.
- No workflow import/export.
- No queue reader modification.
- No app/deploy/tag/rollback.
- No provider API LLM.
- No real Chat ID, token, OAuth material, or credential export recorded.
