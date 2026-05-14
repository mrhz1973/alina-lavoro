# Done — Task 0263

## Done status

**Task:** 0263  
**Slug:** update-v31-examples-for-batch-priority  
**Completed by:** Claude Code (local)  
**Date:** 2026-05-14  
**Batch:** 0259–0266

## Summary

Added Example 7 (Large docs-only batch 6–8 sub-tasks) to `docs/wiki/examples/v31-compact-workflow-cookbook.md`.

The new example shows:
- 8 sub-tasks batched coherently (using this current batch 0259–0266 as the concrete case)
- Why 8 is used here (natural sequence, all docs-only)
- Note: use fewer if only fewer meaningful units exist; do not pad
- Explicit note that runtime steps are NOT batched

Old example 7 (bad vs good prompt) renumbered to Example 8.

## Confirmations

- 6–8 batch example added: ✅
- Runtime not batched in example: ✅
- No runtime: ✅
- No secrets: ✅
