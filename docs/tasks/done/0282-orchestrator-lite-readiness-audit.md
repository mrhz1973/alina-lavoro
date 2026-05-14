# Task 0282 — Orchestrator-Lite Readiness Audit

**Date:** 2026-05-15
**Type:** docs-only
**Status:** done
**Branch:** main

## Goal

Assess whether the current GitHub instruction set is ready for a future local orchestrator-lite / dual CLI loop, without implementing it. Docs-only readiness audit; no scripts, no CLIs, no runners, no runtime.

## Audit criteria

A future orchestrator-lite (when explicitly gated and opened) would need to:

1. read state;
2. choose next task ID;
3. select template;
4. apply local preflight;
5. enforce gates;
6. require epilogue on GitHub;
7. stop on dirty tree or runtime gates.

## Findings

| Criterion | Source | Status |
|---|---|---|
| Read state | `docs/LLMS.md` mandatory read order; `docs/wiki/current-state.md` snapshot | Sufficient |
| Choose next task ID | `docs/wiki/task-id-preflight.md` — mandatory preflight, stop conditions | Sufficient |
| Select template | `docs/wiki/prompt-routing.md` router table; `docs/wiki/template-pack-index.md` | Sufficient |
| Apply local preflight | `docs/COMMANDS.md` § "Mandatory local preflight"; `docs/tasks/templates/implementer-standard.md` § "Local clone preflight" | Sufficient |
| Enforce gates | `docs/LLMS.md` § "Open Gates"; `docs/ORCHESTRATOR_RULES.md` sensitive-gate matrix | Sufficient |
| Require epilogue on GitHub | `docs/tasks/templates/implementer-standard.md` § "Final report persistence"; `docs/tasks/templates/final-report-contract.md` | Sufficient |
| Stop on dirty tree | `docs/COMMANDS.md`: "If dirty tree: do not pull, reset, stash, or delete"; `implementer-standard.md` echoes | Sufficient |
| Stop on runtime gates | `docs/wiki/task-id-preflight.md` stop conditions; `ORCHESTRATOR_RULES.md` PRIORITY 0/0A | Sufficient |

## Pointer gaps

None requiring file edits. The V3.1 routing map already exposes every artifact a future orchestrator-lite would need to consume in read-only mode.

## Roadmap status

`docs/roadmap.md` Post-cleanup roadmap keeps the dual-agent loop as **LATER | Future only | Runtime gate**. `docs/LLMS.md` § "Future / Low Priority — Not Active Workstreams" lists `dual-agent loop`. `docs/wiki/current-state.md` § "Future / Not Active" mirrors. No expansion needed for 0282; further roadmap compression handled by 0286.

## What is explicitly not authorized now

- no orchestrator-lite implementation;
- no dual CLI loop runtime;
- no GitHub Actions automation;
- no autonomous runner;
- no browser bridge;
- no provider API;
- no n8n autonomous decision making;
- no app changes from any future orchestrator-lite.

## Conclusion

**Current GitHub instructions are sufficient** for a future orchestrator-lite to be opened later under a runtime gate. No new design doc was created. No existing file needed a pointer fix beyond the standard Last completed state-doc bumps.

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
