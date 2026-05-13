# Local Classifier Wrapper Script Design — Done

**Task ID:** 0137  
**Slug:** local-classifier-wrapper-script-design  
**Type:** low-touch-loop-docs-only  
**Scope:** automation / watcher / runner / low-touch  
**Status:** completed (docs-only design)  
**Completion date:** 2026-05-13

---

## Summary

Task 0137 completed as a docs-only architecture design for the future local classifier wrapper script. This script will operationalize the wrapper concept designed in task 0136.

---

## Completion Details

**Task completed as docs-only design.**

- No script created
- No script executed
- No Ollama executed
- No localhost call
- No Modelfile/qwen-alina created
- No n8n runtime modified
- No provider API / API key / billing introduced
- No app source changes
- No deploy/tag/rollback
- No embeddings/vector DB created
- ZERO API policy remains intact

---

## Design Document Created

**docs/automation/local-classifier-wrapper-script-design.md**

This document is the canonical design for the future wrapper script:
- Script scope: read LLMS-first context, read task file, assemble compact prompt, call local Ollama HTTP API, validate JSON schema, normalize enums, retry once, classify task class/risk/gates
- Candidate file location: tools/local-classifier/alina_classifier.py (Python recommended for portability)
- CLI shape design: --task, --model, --output, --schema-version, --max-context-chars, --dry-run, --no-write, --timeout-seconds, --retry-on-invalid
- Input assembly design: LLMS.md + current-state.md + token-efficiency.md + task file, hard cap 6–10k characters
- Prompt construction design: system prompt, compact project context, task content, classification rules, gate rules, JSON schema v1, output JSON only
- Local Ollama API request design: POST http://localhost:11434/api/generate with stream=false, think=false, format=json
- JSON schema validation design: reuse 0136 schema v1, enum validation for task_class, risk_level, recommended_implementer, recommended_cursor_model, cursor_mode, confidence
- Normalization rules: deterministic post-processing, gate keyword detection, metadata contradiction handling
- Gate detection rules: sensitive gates list, classification logic
- Retry/fallback design: retry once with stricter prompt, fallback to human triage
- Output modes: stdout JSON only, write file, append to session, feed Cursor bridge (future)
- Example outputs: routine docs-only, architecture docs, app source change, provider API/n8n deploy
- Test strategy: unit tests, fixture tasks, invalid JSON fixtures, gate detection fixtures, latency recording
- Relationship to qwen-alina profile: wrapper works first with base qwen3:14b, profile is optional optimization
- Relationship to n8n: n8n can eventually call the wrapper, but integration is not part of this task
- Relationship to Cursor force-mode bridge: wrapper output feeds 0135 bridge
- Security and privacy: no provider API, no API keys, localhost only, no PROJECT_STATE/CHECKPOINT by default
- Future roadmap: 8 stages from docs-only design to integration with Cursor bridge

---

## Future Gates

Before any wrapper script implementation, a separate explicit task is required:
- Runtime-gated wrapper implementation
- Runtime-gated wrapper dry-run using saved fixtures
- Runtime-gated qwen-alina profile creation (optional)
- Runtime-gated n8n/local script integration

---

## What Remains Human

- Merge to main
- Deploy
- Tag
- Rollback
- Runtime
- App source changes
- Provider/API/billing decisions
- Sensitive gates
- Physical tests
- Wrapper script execution
- qwen-alina profile creation
- n8n integration

---

## No Integration Authorized

This design only documents the script architecture. Any future wrapper script execution or n8n/Ollama integration requires a separate explicit manual gate.

---

**Task completed — docs-only script design documented, no script created, no runtime executed, no integration authorized**
