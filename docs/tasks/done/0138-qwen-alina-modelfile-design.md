# Qwen-Alina Modelfile Design — Done

**Task ID:** 0138  
**Slug:** qwen-alina-modelfile-design  
**Type:** low-touch-loop-docs-only  
**Scope:** automation / watcher / runner / low-touch  
**Status:** completed (docs-only design)  
**Completion date:** 2026-05-13

---

## Summary

Task 0138 completed as a docs-only architecture design for the optional future qwen-alina:14b Modelfile profile. This profile is a local-only Ollama profile based on qwen3:14b, designed to support the Alina Lavoro low-touch/no-api/local-first architecture.

---

## Completion Details

**Task completed as docs-only design.**

- No actual Modelfile created
- No qwen-alina profile created
- No `ollama create` executed
- No Ollama executed
- No localhost call
- No n8n runtime modified
- No provider API / API key / billing introduced
- No app source changes
- No deploy/tag/rollback
- No embeddings/vector DB created
- ZERO API policy remains intact

---

## Design Document Created

**docs/automation/qwen-alina-modelfile-design.md**

This document is the canonical design for the future qwen-alina profile:
- Profile purpose: reduce repeated system prompt tokens, bake in stable Alina classifier rules, set low temperature for deterministic output, reinforce JSON-only behavior, reinforce ZERO API policy, reinforce gate detection, reinforce LLMS-first routing, reinforce task class A/B/C/D/E
- Relationship to qwen3:14b: thin profile over base qwen3:14b, wrapper must continue to work with base qwen3:14b even if qwen-alina does not exist, qwen-alina is optimization not dependency
- Relationship to wrapper script 0137: wrapper remains responsible for input assembly, Ollama API call, JSON parsing, schema validation, enum normalization, retry/fallback, gate escalation; qwen-alina only reduces prompt burden and reinforces stable behavior
- Candidate Modelfile concept: FROM qwen3:14b, PARAMETER temperature 0.1, PARAMETER top_p 0.8, SYSTEM prompt with role, advisory-only nature, ZERO API policy, gate detection, task classes, JSON-only behavior
- Parameter design: temperature 0.1 for deterministic output, top_p 0.8 for conservative sampling, repeat_penalty optional, num_ctx optional, stop sequences optional
- System prompt boundaries: include role, advisory-only nature, ZERO API policy, gate detection, task classes, JSON-only behavior; exclude current app version, current task state, personal context, long roadmap state, secrets, credentials, transient data
- JSON behavior expectations: still called through local HTTP API with stream=false, think=false, format=json, wrapper remains responsible for schema validation, JSON strict reliability must be re-tested after profile creation
- Validation plan: compare base qwen3:14b vs qwen-alina:14b on valid JSON rate, schema compliance, enum stability, gate detection recall, provider API blocking, docs-only classification consistency, latency, VRAM use, unload behavior
- Test fixtures: A routine docs-only, B medium workflow/wiki, C delicate architecture, D app source, E provider API/n8n deploy, invalid/malformed task metadata, prompt injection attempt, contradictory allowed/forbidden paths, task mentioning API only to forbid it, task mentioning local Ollama API
- Runtime gate for actual profile creation: explicit user gate required, command must be reviewed before execution, actual Modelfile path must be defined, output profile name must be confirmed, base model qwen3:14b must be present
- Future command shape: ollama create qwen-alina:14b -f <Modelfile path>
- Integration with local classifier wrapper: wrapper may default to qwen3:14b first, may accept --model qwen-alina:14b, model should be configurable not hardcoded, if qwen-alina unavailable fallback to qwen3:14b only if explicitly allowed
- Integration with n8n: n8n may eventually call wrapper with model qwen-alina:14b, integration remains future runtime-gated, n8n must not call provider AI APIs
- Integration with Cursor force-mode bridge: qwen-alina may improve classification and prompt compression, must not directly call Cursor, Cursor execution remains controlled by bridge rules from 0135
- Security and privacy: local-only, localhost only, no provider API, no API keys, no credentials, no OAuth, no sensitive raw URLs, no Google Sheet data, no personal data, no app data, no PROJECT_STATE/CHECKPOINT baked into Modelfile
- Failure modes: qwen-alina produces worse JSON than base qwen3:14b, parameter tuning degrades output, profile becomes stale if too much project state is embedded, SYSTEM too long reduces flexibility, model still emits thinking/prose if API call misconfigured, wrapper skips validation incorrectly, missed provider API gate, missed runtime/deploy gate, VRAM load too high, profile creation fails, wrong model name used, profile accidentally treated as implementer
- Fallbacks: use base qwen3:14b, manual ChatGPT triage, Claude Code manual prompt, Windsurf manual prompt, Cursor UI manual execution, no force execution, no merge, delete broken profile in future runtime task if needed
- Future roadmap: 8 stages from docs-only design to integration with Cursor bridge

---

## Future Gates

Before any qwen-alina profile creation, a separate explicit task is required:
- Runtime-gated creation of actual Modelfile/profile
- Runtime-gated validation against fixture tasks
- Compare qwen3:14b vs qwen-alina:14b
- Update wrapper default model only if qwen-alina passes

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
- qwen-alina profile creation
- n8n integration

---

## No Integration Authorized

This design only documents the Modelfile architecture. Any future profile creation or n8n/Ollama integration requires a separate explicit manual gate.

---

**Task completed — docs-only Modelfile design documented, no actual Modelfile created, no runtime executed, no integration authorized**
