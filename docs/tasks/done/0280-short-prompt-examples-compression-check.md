# Task 0280 — Short Prompt Examples Compression Check

**Date:** 2026-05-15
**Type:** docs-only
**Status:** done
**Branch:** main

## Goal

Verify that the canonical short-prompt examples (`docs/wiki/prompt-routing.md` and `docs/wiki/examples/delta-based-prompt-example.md`) carry the required fields without bloating into a parallel guide. Keep one canonical example file. Compress only when needed.

## Inspection result

- `docs/wiki/prompt-routing.md` — already includes `@AGENTS.md` in the canonical prompt shape and lists required delta fields (Verified Last completed, Task ID, Goal, Allowed paths, Forbidden paths, Runtime, Expected result). Size/subtraction rule present. No changes required.
- `docs/wiki/examples/delta-based-prompt-example.md` — the three example blocks (V3.1 style, full docs-only, full state-update batch) were missing `@AGENTS.md`. The docs-only example lacked an explicit Forbidden paths block and an explicit Runtime line. The old/new comparison section was tight enough; no compression needed.
- `docs/tasks/templates/implementer-standard.md`, `docs-only-task.md`, `final-report-contract.md` — already covered git, security, final-report, and forbidden actions. No duplication added.

## Changes applied

- `docs/wiki/examples/delta-based-prompt-example.md`:
  - added `@AGENTS.md` to all three example prompt blocks (V3.1 style, full docs-only, state-update batch);
  - added explicit `Forbidden paths` block and `Runtime: forbidden.` line to the full docs-only example so it carries every field listed in `prompt-routing.md`;
  - trimmed the "Why this is better" bullets from five to four without losing meaning.

No new doc created. One canonical example file kept.

## Checks

- `git status` before edits: clean on `main`, up to date with `origin/main`.
- `git pull origin main`: already up to date.
- Edits limited to allowed paths.
- No `src/**`, `gas-current/**`, `appsscript.json`, `package.json` touched.

## Safety contract

- no runtime;
- no n8n UI;
- no workflow Execute;
- no Telegram send;
- no Schedule activation;
- no app source changes;
- no deploy/tag/rollback;
- no provider API LLM;
- no new billing;
- no token / chat_id / credential / OAuth material / tokenized URL recorded.

## Outcome

Single canonical short-prompt example continues to exist with `AGENTS.md` first-pointer, TASK DELTA, expected previous state, allowed paths, forbidden paths, runtime/gate status, and final-report-contract pointer.
