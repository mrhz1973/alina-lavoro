# Task 0286 — Dual CLI Readiness Roadmap Compression

**Date:** 2026-05-15
**Type:** docs-only
**Status:** done
**Branch:** main

## Goal

Prepare `docs/roadmap.md` for future orchestrator-lite / dual CLI work without implementing it and without expanding planning bloat. Keep LATER/GATED. Refine one row to answer:
1. what must be true before dual CLI starts;
2. what is explicitly not authorized now;
3. what the first future design-only step would be.

No design doc created. No scripts, CLIs, runners, GitHub Actions, browser bridge, local AI router, or n8n changes implemented.

## Changes applied

### Refined row

`docs/roadmap.md` Post-cleanup roadmap table:

- old: `| LATER | Dual-agent loop | Future only | Runtime gate |`
- new: `| LATER | Dual-agent loop / orchestrator-lite CLI — design-only first step; no runner, no scripts, no autonomous runtime | Explicit user request after baseline-stable implementer flow; pending DPs = 0; no current friction the manual loop fails to handle | Runtime gate (first step is a design doc, not a runner) |`

The new row answers all three required questions inside the existing table format. No new section, no new doc, no policy expansion.

### Trimmed completed NEXT rows

Three NEXT rows already satisfied by this chain were removed for compactness:

- "Verify cold-start is lighter after cleanup | After 0278" — closed by task 0283.
- "Mini-audit recent DPs: distinguish real decisions from status/debug notes | When convenient" — closed by task 0285 (boundary audit confirmed wording is consistent; INBOX has 0 pending and matches discipline rule).
- "Evaluate whether task templates remain too many; if yes, run template consolidation batch | Explicit need" — closed by task 0281 (overlay minimization applied; full consolidation deferred as not needed).

The Telegram Mode A monitoring NEXT row is kept because it is still ongoing.

## Status of dual CLI

LATER / GATED. Not NOW. Not authorized. First future step is design-only; no implementation.

## Safety contract

- no n8n runtime;
- no n8n UI;
- no workflow Execute;
- no Telegram send;
- no Schedule activation;
- no app source changes;
- no deploy/tag/rollback;
- no provider API LLM;
- no new billing;
- no token/chat_id/credential/OAuth material/tokenized URL recorded.
