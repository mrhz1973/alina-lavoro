# Done — Task 0265

## Done status

**Task:** 0265  
**Slug:** record-batch-priority-safety-contract  
**Completed by:** Claude Code (local)  
**Date:** 2026-05-14  
**Batch:** 0259–0266

## 6–8 docs-only batch priority safety contract

The 6–8 batch priority is project-wide and applies under these conditions only:

**Applies when:**
- All sub-tasks are docs-only.
- No real human decision is pending between sub-tasks.
- The sub-tasks form a natural coherent sequence.
- No sub-task touches runtime, secrets, credentials, deploy, tag, or rollback.
- The batch stays within 8 sub-tasks maximum.

**Does NOT apply to:**
- Runtime / n8n UI / manual user action — these remain one step at a time.
- Telegram send, Schedule change — one step, explicit gate.
- Deploy / tag / rollback / app source changes — always single-step, explicit gate.
- Provider API / billing — permanently gated.

**Anti-creep rules:**
- Do not invent artificial tasks to reach 8.
- If only 3 meaningful docs-only units exist, use 3.
- If a gate appears mid-batch, stop and open a Decision Packet.
- If a batch becomes incoherent or risky, split it.
- Conditional user intent already given should be encoded as a sequence, not re-asked.

## Confirmations

- Safety contract recorded: ✅
- Runtime/manual UI remains one step at a time: ✅
- No runtime: ✅
- No secrets: ✅
