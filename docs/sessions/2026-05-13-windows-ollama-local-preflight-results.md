# Windows Ollama Local Preflight Results

**Date:** 2026-05-13  
**Task:** 0134 — Windows Ollama Local Preflight  
**Type:** runtime-gated-preflight (manual validation)  
**Status:** completed (manual runtime validation documented)  
**Implementer:** Windsurf / Cascade

---

## Purpose

Document and close the manually executed Windows Ollama Local Preflight results for task 0134. This is a docs-only closeout of runtime results already executed manually by the user.

---

## User-Executed Commands and Results

### 1. Ollama Version Check

Command executed by user:
```
ollama --version
```

Output:
```
ollama version is 0.23.2
```

**Result:** Ollama 0.23.2 confirmed on Windows.

### 2. Ollama Model List

Command executed by user:
```
ollama list
```

Output:
```
NAME         ID              SIZE      MODIFIED
qwen3:14b    bdbd181c33f2    9.3 GB    About an hour ago
```

**Result:** qwen3:14b is present (9.3 GB). No other models installed.

### 3. GPU / Driver / CUDA Check

Command executed by user:
```
nvidia-smi
```

Relevant output:
- NVIDIA-SMI 591.86
- Driver Version: 591.86
- CUDA Version: 13.1
- GPU: NVIDIA GeForce RTX 3060
- VRAM: 12288 MiB
- Runtime baseline before tests showed around 1992 MiB used
- Ollama processes were visible while the model was active

**Result:** RTX 3060 12 GB with driver 591.86 and CUDA 13.1 confirmed.

### 4. First CLI Test (JSON Classification)

Command used:
```
ollama run qwen3:14b "You are a local routing classifier. Reply only with valid JSON. Classify this task: 'Update a Markdown roadmap file only, no runtime, no deploy'. Use fields: task_type, risk_level, needs_runtime_gate, recommended_implementer."
```

Result:
- Model responded
- It printed a "Thinking..." section
- Final JSON content was semantically correct
- Elapsed seconds: 24.94
- **Conclusion:** Not suitable for strict JSON automation because thinking text appears in CLI output

### 5. CLI Test with --think=false

Command used:
```
ollama run qwen3:14b --think=false "You are a local routing classifier. Reply only with valid minified JSON, no markdown, no explanation. Classify this task: 'Update a Markdown roadmap file only, no runtime, no deploy'. Fields: task_type, risk_level, needs_runtime_gate, recommended_implementer."
```

Result:
- Fast: 1.44 seconds
- Output semantically correct but malformed/duplicated JSON
- Captured output failed ConvertFrom-Json validation
- Error example: `INVALID JSON Expected ':' or '}'`
- **Conclusion:** Do not use `ollama run` CLI for JSON strict automation

### 6. PowerShell Captured CLI Validation

Result:
- qwen3:14b --think=false
- Elapsed seconds: 1.34
- JSON invalid because output duplicated/interrupted: `{"task_type":"file_update","risk_level":"low","needs_runtime_gate":false,"r{"task_type":"file_update",...`
- VRAM around 11472 MiB used
- GPU utilization around 96%
- Temperature around 62C

**Conclusion:** CLI output is unreliable for strict JSON automation.

### 7. Local Ollama HTTP API JSON Test

Endpoint:
```
http://localhost:11434/api/generate
```

Parameters:
- model = qwen3:14b
- stream = false
- think = false
- format = json

Result:
- Valid JSON
- Elapsed seconds: 3.92
- Output:
  ```json
  {
    "task_type": "documentation_update",
    "risk_level": "low",
    "needs_runtime_gate": false,
    "recommended_implementer": "developer"
  }
  ```
- VRAM around 11429 MiB used
- GPU utilization after test around 9%
- Temperature around 53C

**Conclusion:** Local HTTP API with format=json is the correct path for future classifier use.

### 8. Project-Aware Docs-Only Classifier Test

Task classified:
```
Create docs/INBOX.md for future Decision Packets. Docs-only. No n8n runtime. No app changes. No deploy. No API.
```

Result:
- Valid JSON
- Elapsed seconds: 2.6
- Output:
  ```json
  {
    "task_type": "docs-only",
    "risk_level": "low",
    "needs_runtime_gate": false,
    "recommended_implementer": "any",
    "reason_short": "Docs-only change with no runtime, app, deploy, or API involvement."
  }
  ```
- VRAM around 11434 MiB used
- GPU utilization around 94%
- Temperature around 65C

**Conclusion:** qwen3:14b understands project docs-only/no-gate logic.

### 9. Sensitive Gate Classifier Test

Task classified:
```
Modify the n8n workflow to call OpenAI API from Telegram messages and deploy the workflow automatically.
```

Result:
- Valid JSON
- Elapsed seconds: 2.97
- Output:
  ```json
  {
    "task_type": "modify n8n workflow and deploy",
    "risk_level": "high",
    "needs_runtime_gate": true,
    "recommended_implementer": "senior developer",
    "reason_short": "Involves API keys, external API calls, and deployment automation which require runtime/sensitive gate approval."
  }
  ```

**Conclusion:** qwen3:14b correctly identifies provider API + n8n runtime + deploy automation as high-risk and runtime-gated.

### 10. Model Unload / Cleanup

Commands executed by user:
```
ollama stop qwen3:14b
ollama ps
```

Result:
- `ollama ps` returned empty table (no processes)
- qwen3:14b no longer loaded

### 11. Final GPU Idle State

Command:
```
nvidia-smi --query-gpu=name,memory.total,memory.used,utilization.gpu,temperature.gpu --format=csv
```

Output:
```
name, memory.total [MiB], memory.used [MiB], utilization.gpu [%], temperature.gpu
NVIDIA GeForce RTX 3060, 12288 MiB, 1971 MiB, 2 %, 52
```

**Conclusion:** GPU returned to idle/baseline after stopping qwen3:14b. No persistent heavy Ollama load remained.

---

## Classifier Test Results

**JSON validity findings:**
- CLI `ollama run` is unreliable for strict JSON automation (thinking text, duplicated/malformed JSON)
- Local HTTP API with format=json, stream=false, think=false is reliable for strict JSON
- All HTTP API tests produced valid JSON

**Hardware/VRAM findings:**
- qwen3:14b uses around 11.4 GB VRAM while active
- GPU utilization around 94-96% during inference
- Temperature around 53-65C during tests
- GPU returns to idle (1971 MiB, 2%, 52C) after model unload
- qwen3:14b should be used in short bursts, not as a continuous worker

**Classifier capability findings:**
- qwen3:14b correctly classifies docs-only low-risk tasks
- qwen3:14b correctly flags OpenAI API / provider API / n8n runtime / deploy automation as high-risk and runtime-gated
- Latency: 2.6-3.92 seconds for classification via HTTP API
- Output quality acceptable for classification task

---

## Stop/Cleanup Confirmation

- Model unloaded with `ollama stop qwen3:14b`
- `ollama ps` confirmed no processes running
- GPU returned to idle/baseline state
- No persistent heavy Ollama load remained

---

## Final Conclusion

**Windows Ollama Local Preflight manually validated successfully.**

- Ollama 0.23.2 works on Windows
- qwen3:14b is installed/present (9.3 GB)
- RTX 3060 12 GB supports qwen3:14b for short local classification tests
- Local HTTP API with format=json is the correct path for future classifier use
- qwen3:14b correctly classifies docs-only low-risk tasks
- qwen3:14b correctly flags provider API / n8n runtime / deploy automation as high-risk and runtime-gated
- No n8n/Ollama automation was created
- No custom Modelfile/profile was created
- No embeddings pipeline was created
- No vector DB was created
- No provider API was used or authorized
- No API key was created
- No billing or recurring cost was created
- ZERO API policy remains intact

**qwen3:14b may be considered suitable as local:**
- token-efficiency assistant
- router/classifier
- prompt compressor
- task risk scorer
- Decision Packet draft helper
- LLMS/wiki summarizer

**qwen3:14b must NOT be treated as:**
- autonomous main implementer
- Claude Code/Cursor/Windsurf replacement
- deploy tool
- app modifier
- unsupervised runner

**No integration has been authorized.** This preflight only validated local feasibility. Any future n8n/Ollama integration requires a separate explicit manual gate.

---

## No-Runtime-by-Implementer Note

This implementer task did NOT execute any Ollama commands, nvidia-smi, or runtime operations. All validation was executed manually by the user in PowerShell. This implementer task only documented those pasted results in the repo.

---

## No Provider API Note

No provider API was used or authorized. ZERO API policy remains intact. Local AI means Ollama/local models only.

---

## No Automation Integration Note

No n8n/Ollama automation was created. No custom Modelfile/profile was created. No embeddings pipeline was created. No vector DB was created. This preflight only validated local feasibility.

---

## Files Modified

- `docs/tasks/queue/0134-windows-ollama-local-preflight.md` — Added Manual Runtime Validation Results section; updated status
- `docs/tasks/done/0134-windows-ollama-local-preflight.md` — Created done marker
- `docs/sessions/2026-05-13-windows-ollama-local-preflight-results.md` — This session report
- `docs/LLMS.md` — Updated task state
- `docs/wiki/current-state.md` — Updated task state
- `docs/roadmap.md` — Updated (if needed)

---

**Session completed — manual runtime validation documented, no integration authorized**

---

## Additional Repeatability Test — JSON API Schema Prompt

**User-executed additional repeatability test (later manual test, not part of initial preflight).**

**Method:** Local Ollama HTTP API through PowerShell with enum-constrained schema prompt
- model = qwen3:14b
- stream = false
- think = false
- format = json
- Enum-like allowed values:
  - task_type = docs_only | app_source | n8n_runtime | infra | mixed | unknown
  - risk_level = low | medium | high | blocked
  - recommended_implementer = claude_code | windsurf | cursor | human_gate | none

**Task classified:**
```
Create docs/INBOX.md for future Decision Packets. Docs-only. No n8n runtime. No app changes. No deploy. No API.
```

**Results:**
- RUN 1: VALID JSON, elapsed 9.38 s
  ```json
  {
    "task_type": "docs_only",
    "risk_level": "low",
    "needs_runtime_gate": false,
    "recommended_implementer": "none",
    "reason_short": "Docs-only change with no runtime, app, or API involvement."
  }
  ```
- RUN 2: VALID JSON, elapsed 2.10 s
  ```json
  {
    "task_type": "docs_only",
    "risk_level": "low",
    "needs_runtime_gate": false,
    "recommended_implementer": "none",
    "reason_short": "Docs-only change with no runtime or app impact."
  }
  ```
- RUN 3: VALID JSON, elapsed 2.13 s
  ```json
  {
    "task_type": "docs_only",
    "risk_level": "low",
    "needs_runtime_gate": false,
    "recommended_implementer": "none",
    "reason_short": "Docs-only change with no runtime or app impact."
  }
  ```

**Repeatability conclusion:**
- 3/3 valid JSON
- Decisional fields stable across all runs: task_type = docs_only, risk_level = low, needs_runtime_gate = false, recommended_implementer = none
- Only reason_short varied slightly (acceptable)
- This supports using qwen3:14b as a local classifier candidate with schema/enum-constrained prompts
- recommended_implementer = none is acceptable for a purely docs-only candidate task; future wrapper design may choose to map repo tasks to windsurf/claude_code if an implementer is required

**GPU state after repeatability test:**
- NVIDIA GeForce RTX 3060
- memory.total: 12288 MiB
- memory.used: 11389 MiB
- utilization.gpu: 30%
- temperature.gpu: 53C

**Post-repeatability unload confirmation:**
- User ran: ollama stop qwen3:14b, ollama ps, nvidia-smi
- `ollama ps` returned empty table
- First post-stop GPU state: 2040 MiB used, 3% utilization, 54C
- User ran second redundant stop/check: ollama stop qwen3:14b, ollama ps, nvidia-smi
- `ollama ps` again returned empty table
- Final GPU state: 2015 MiB used, 28% utilization, 52C
- Interpretation: Post-repeatability unload confirmed; VRAM returned near idle around ~2.0 GB; final 28% GPU utilization is not evidence of Ollama model activity because `ollama ps` was empty and VRAM remained near idle

**Conclusion:** Local API + format=json + think=false + stream=false is suitable for future classifier wrapper design. qwen3:14b remains VRAM-heavy and should be used in short bursts.

---
