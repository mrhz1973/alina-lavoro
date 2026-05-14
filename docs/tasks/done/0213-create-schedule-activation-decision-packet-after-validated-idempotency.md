# 0213 — Create schedule activation Decision Packet (D-0213-A) after validated idempotency

- Project: Alina Lavoro
- Type: docs-only / Decision Packet
- Status: done
- Priority: normal
- Deploy: no
- Date: 2026-05-14

## Scope

Create a new pending Decision Packet `D-0213-A` in `docs/INBOX.md` that authorizes (or defers) a controlled Schedule Trigger activation gate for Telegram Mode A, now that duplicate-skip has been conclusively validated under D-0209-A.

D-0209-A only authorized exactly one Execute run of the fully-pinned harness. Schedule activation is a separate gate. D-0213-A is that gate.

## D-0213-A summary

- **Decision ID:** D-0213-A
- **Kind:** automation
- **Status:** pending
- **Options:**
  1. Authorize a controlled schedule activation implementation gate for Telegram Mode A (notification-only).
  2. Keep Telegram notifier manual-only for now.
  3. Defer and design a safer schedule activation template/import path before any schedule activation.
- **Recommendation:** Option 3 if schedule activation still requires more template-first design. Option 1 only if the existing workflow is clear, the idempotency path is present, and the user wants immediate schedule activation.

## Scope of Option 1

- Open the relevant Telegram notifier workflow in n8n.
- Keep the queue reader workflow untouched.
- Confirm idempotency/state-store path exists in the targeted Telegram notifier workflow.
- Confirm the D-0209-A duplicate-skip validation result is recorded.
- Add or enable a Schedule Trigger only in the intended Telegram notifier workflow.
- Choose a conservative interval, preferably aligned with existing low-touch cadence unless docs specify otherwise.
- Keep Telegram Mode A as notification-only.
- Telegram must NOT answer INBOX.
- Observe the first scheduled tick manually.
- Stop and report.

## Main risk

- Duplicate notifications if the wrong workflow is scheduled or the idempotency path is bypassed.
- Schedule running silently if the first tick is not observed.
- Wrong workflow activation (e.g. activating the harness instead of the production-like notifier).
- Telegram must remain notification-only and must not answer INBOX.

## What D-0213-A does NOT authorize

- No Schedule Trigger activation until D-0213-A is explicitly decided.
- No automatic INBOX response.
- No queue reader modification unless explicitly scoped in a future gate.
- No provider API LLM.
- No app / deploy / tag / rollback.
- No second duplicate-skip validation run.
- No workflow export with secrets.
- No token / chat id in repo / docs / chat.

## INBOX update performed by this task

- A new pending entry `D-0213-A` is added to `docs/INBOX.md` under `## Pending`.
- D-0209-A is moved from `## Pending` to `## Decided` with response `1`, `decided_at: 2026-05-14`, `result: fully pinned duplicate skip succeeded`.
- D-0206-A remains in `## Decided`.
- D-0202-A remains in `## Superseded`.

## Done status

- Completed by: Claude Code (implementer)
- Completion commit: this batch
- No runtime. No n8n UI. No Execute. D-0213-A is created as **Pending** only; ChatGPT/implementer must not auto-select any option.
