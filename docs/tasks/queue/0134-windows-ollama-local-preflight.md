# Windows Ollama Local Preflight

**Task ID:** 0134  
**Slug:** windows-ollama-local-preflight  
**Type:** runtime-gated-preflight  
**Scope:** local-ai / low-touch / no-api  
**Runtime:** future explicit gate required  
**Status:** queued (docs-only preparation)

---

## User-Reported Local State Update — 2026-05-13

**This task remains runtime-gated.** The starting assumption has changed from "install Ollama from zero" to "validate/document existing local state."

**User-reported local state (unverified-by-repo but user-confirmed):**
- Ollama is already installed on Windows
- `ollama --version` responded correctly
- Version reported by user: Ollama 0.23.2
- `qwen3:8b` was downloaded and initially tested, then removed
- `nomic-embed-text` was downloaded, then removed
- `qwen3:14b` was then installed/downloaded
- No custom profile like `qwen-alina:14b` has been created yet
- No definitive `Modelfile` has been created yet
- No n8n/Ollama automation has been integrated
- No embeddings pipeline has been created
- No vector DB has been created
- Ollama has not been automatically connected to the repo
- No provider API has been authorized
- ZERO API policy remains active

**Future gate starting point:**
When the runtime gate opens, the preflight should start with validation/documentation of the existing state, not initial installation:
- `ollama --version` (confirm reported version 0.23.2)
- `ollama list` (confirm qwen3:14b is present)
- Run minimal response test with qwen3:14b
- Run light benchmark (latency, RAM/VRAM usage)
- Verify no provider API calls
- Verify no n8n automation integration
- Verify no embeddings/vector DB
- Verify no custom profile/Modelfile yet

**Future direction (not to implement now):**
- Use qwen3:14b as the main local model for real tests
- First evaluate it pure, without custom Modelfile
- Later, optionally create a custom profile such as `qwen-alina:14b`
- The future custom profile may act only as: token-efficiency assistant, router/classifier, prompt compressor, task risk scorer, Decision Packet draft helper, LLMS/wiki summarizer
- It must NOT become: main autonomous implementer, replacement for Claude Code/Cursor/Windsurf, deploy tool, app modifier, automatic unsupervised runner

**Technical note (future option, not executed now):**
Ollama supports custom models through `Modelfile` with instructions such as `FROM`, `PARAMETER`, and `SYSTEM`. In the future, a local custom model may be created from qwen3:14b, for example with low temperature and project-specific rules. Do not create that Modelfile now. Record this as a future option, not as an executed implementation.

---

## Metadata

- **Default architecture:** no provider APIs
- **Target machine:** Windows workstation
  - OS: Windows
  - CPU: AMD Ryzen 9 3900X
  - RAM: 32 GB
  - GPU: NVIDIA RTX 3060 12 GB VRAM
- **Purpose:** Prepare runtime-gated preflight for Ollama local AI on Windows workstation
- **This task:** docs-only preparation only — does NOT authorize runtime execution
- **Future runtime task:** separate explicit gate required before any validation or execution

---

## No-API Default Architecture Policy

**No provider APIs are part of the default architecture.** ChatGPT means ChatGPT web/on-demand orchestration, not OpenAI API. Claude Code means supervised Claude Code usage, not Anthropic API. Local AI means Ollama/local models. Any provider API, API key, hosted AI call, billing setup, or recurring cost requires an explicit future manual gate and is out of scope by default.

This preflight task is for Ollama local models only — no OpenAI API, no Anthropic API, no OpenRouter, no hosted provider AI, no cloud model calls, no API keys, no billing setup, no recurring costs.

---

## Objective

Prepare a clean, explicit, runtime-gated preflight task for Ollama on the Windows workstation. This task is docs-only preparation only and does not authorize any runtime execution. The future runtime task must verify whether the workstation can safely run a small local model for:

- n8n command classification
- task metadata triage
- planner/classifier support
- low-touch loop assistance

Constraints:
- no sensitive data in prompts
- no provider APIs
- no cloud model calls
- zero billing
- zero recurring costs

---

## Non-Goals

This task does NOT:
- Install Ollama
- Download models
- Run local models
- Create embeddings
- Start services
- Change n8n runtime
- Use VPS
- Configure APIs
- Create API keys
- Use OpenAI API
- Use Anthropic API
- Use OpenRouter
- Use provider APIs
- Create billing
- Create recurring costs
- Modify the Alina app
- Modify src/**
- Modify gas-current/**
- Modify .gas/**
- Modify appsscript.json
- Modify package.json
- Deploy
- Tag
- Rollback
- Use GitHub Actions

---

## Required Preflight Checklist (Future Runtime Execution)

The future runtime preflight task must include these manual/runtime checks, but this docs-only task does NOT execute them:

**Starting point:** validation/documentation of existing local state (user-reported: Ollama 0.23.2 installed, qwen3:14b present)

1. **Confirm Ollama version and state**
   - Run `ollama --version` to confirm reported version 0.23.2
   - Document actual version if different
   - Verify Ollama service status
   - Verify Ollama CLI availability

2. **Confirm installed models**
   - Run `ollama list` to confirm qwen3:14b is present
   - Document all installed models
   - Verify model sizes

3. **Confirm Windows workstation specs**
   - Verify CPU: AMD Ryzen 9 3900X
   - Verify RAM: 32 GB
   - Verify GPU: NVIDIA RTX 3060 12 GB VRAM
   - Document actual specs if different

4. **Confirm NVIDIA driver / CUDA availability**
   - Check NVIDIA driver version
   - Verify CUDA toolkit availability
   - Verify CUDA compatibility with RTX 3060
   - Document driver/CUDA state

5. **Run minimal response test with qwen3:14b**
   - Design a minimal test prompt for classification
   - Run prompt through Ollama local model (qwen3:14b)
   - Verify model responds correctly
   - Measure latency
   - Measure RAM/VRAM usage
   - Verify output quality

6. **Run light benchmark**
   - Run a few test prompts to establish baseline performance
   - Document average latency
   - Document peak RAM usage with model loaded
   - Document peak VRAM usage with model loaded

7. **Verify no API calls**
   - Confirm Ollama is running in local-only mode
   - Verify no network calls to provider APIs
   - Verify no cloud model calls
   - Verify no billing activity

8. **Verify no cloud billing**
   - Confirm zero cloud costs incurred
   - Confirm zero recurring costs created
   - Document billing state (zero)

9. **Verify no n8n provider API node**
   - Confirm n8n workflow does not use provider AI API nodes
   - Confirm n8n uses only local Ollama via HTTP Request to localhost
   - Document n8n node configuration

10. **Verify no embeddings/vector DB**
    - Confirm no embeddings pipeline has been created
    - Confirm no vector DB has been created
    - Document state (none)

11. **Verify no custom profile/Modelfile**
    - Confirm no custom profile like qwen-alina:14b has been created
    - Confirm no definitive Modelfile has been created
    - Document state (none)

12. **Verify no sensitive data in prompt**
    - Review test prompt for sensitive data
    - Confirm no credentials, tokens, API keys, OAuth material
    - Confirm no personal data from Alina app
    - Confirm no Google Sheet data
    - Confirm no email data

13. **Document hardware/latency/quality result**
    - Document RAM usage with model loaded
    - Document VRAM usage with model loaded
    - Document latency for classification
    - Document output quality (subjective assessment)
    - Document any errors or issues

14. **Stop if performance, safety, or quality is poor**
    - Define thresholds for acceptable performance
    - Define thresholds for acceptable quality
    - Stop preflight if thresholds not met
    - Document failure reason
    - Recommend alternative approach or abort

**Fallback installation steps (only if local state differs from user report):**
- If Ollama is not installed: download and install Ollama (requires explicit manual gate)
- If qwen3:14b is not present: pull qwen3:14b (requires explicit manual gate)
- These steps are fallback only; primary path is validation of existing state

---

## Safety Gates

The future runtime preflight must respect these safety gates:

1. **No provider APIs by default** — Ollama local only, no cloud calls
2. **No sensitive data** — prompts contain only generic project state, no personal data
3. **No billing** — zero cost, zero recurring costs
4. **No n8n provider API nodes** — n8n uses only local Ollama via localhost
5. **Explicit manual gate** — installation and model download require explicit user authorization
6. **Stop on failure** — if performance, safety, or quality is poor, stop and document
7. **Fallback to manual triage** — if local model fails, fallback to ChatGPT orchestrator manual triage (no degradation)

---

## Forbidden Actions

This task and the future runtime preflight must NOT:

- Modify src/**
- Modify gas-current/**
- Modify .gas/**
- Modify appsscript.json
- Modify package.json
- Modify package-lock.json
- Modify runtime n8n exports
- Install Ollama (in this docs-only task)
- Download models (in this docs-only task)
- Run models (in this docs-only task)
- Start local services (in this docs-only task)
- Create embeddings (in this docs-only task)
- Configure APIs (in this docs-only task)
- Create API keys (in this docs-only task)
- Use provider APIs (in this docs-only task)
- Create workflows (in this docs-only task)
- Use VPS (in this docs-only task)
- Deploy (in this docs-only task)
- Tag (in this docs-only task)
- Rollback (in this docs-only task)
- Use git add .
- Document tokens, credentials, API keys, OAuth material, or sensitive raw URLs

---

## Expected Final Report for Future Runtime Execution

When the future runtime preflight is executed, the final report must include:

1. **Hardware verification**
   - Actual specs confirmed
   - NVIDIA driver version
   - CUDA availability and version

2. **Ollama installation state**
   - Installed version
   - Service status
   - CLI availability

3. **Model pulled**
   - Model name and version
   - Model size
   - Download completion status

4. **Test results**
   - Test prompt used
   - Latency measured
   - RAM usage measured
   - VRAM usage measured
   - Output quality assessment

5. **Safety verification**
   - No API calls confirmed
   - No cloud billing confirmed
   - No n8n provider API nodes confirmed
   - No sensitive data in prompt confirmed

6. **Recommendation**
   - Proceed with local AI integration OR
   - Abort due to performance/safety/quality issues OR
   - Recommend alternative approach

7. **Failure reason** (if applicable)
   - Clear explanation of why preflight failed
   - Specific thresholds not met
   - Recommended next steps

---

## Success Criteria (Future Runtime Execution)

The future runtime preflight is successful if:

1. Hardware specs confirmed adequate (Ryzen 9 3900X, 32 GB RAM, RTX 3060 12 GB VRAM)
2. NVIDIA driver and CUDA available and compatible
3. Ollama installed and running
4. One small local model (7B/8B) pulled successfully
5. Test classification prompt runs successfully
6. Latency ≤ 10 seconds for classification
7. RAM usage ≤ 8 GB with model loaded
8. VRAM usage ≤ 8 GB with model loaded (RTX 3060 12 GB has margin)
9. Output quality acceptable for classification task
10. No API calls to provider APIs
11. No cloud billing incurred
12. No n8n provider API nodes used
13. No sensitive data in prompts

---

## Failure Criteria (Future Runtime Execution)

The future runtime preflight fails if:

1. Hardware specs inadequate (insufficient RAM or VRAM)
2. NVIDIA driver or CUDA not available or incompatible
3. Ollama installation fails
4. Model download fails or incomplete
5. Test classification prompt fails
6. Latency > 30 seconds for classification
7. RAM usage > 16 GB with model loaded (no margin for OS)
8. VRAM usage > 10 GB with model loaded (insufficient margin on RTX 3060 12 GB)
9. Output quality unacceptable for classification task
10. Any API calls to provider APIs detected
11. Any cloud billing incurred
12. n8n provider API nodes detected
13. Sensitive data found in prompts
14. Any safety gate violated

---

## Rollback / Cleanup Note

If Ollama runtime is later installed and the preflight fails or is aborted:

1. Uninstall Ollama if installed
2. Delete downloaded models if any
3. Stop Ollama service if running
4. Remove Ollama from Windows startup if added
5. Document cleanup actions taken
6. Confirm system returned to pre-installation state

---

## Statement: This Queued Task Does Not Authorize Runtime Execution

**This queued task (0134) is docs-only preparation only.** It does NOT authorize:

- Ollama installation
- Model download
- Model execution
- Any runtime changes
- Any service startup
- Any n8n runtime modifications

The future runtime preflight execution requires an **explicit future manual gate** from the user. This task only prepares the documentation and checklist for that future gated execution.

---

## References

- Feasibility analysis: `docs/automation/ollama-classifier-planner-feasibility-post-wiki.md`
- Low-touch loop design: `docs/automation/autonomous-low-touch-loop-design.md`
- Auto-Aggio design: `docs/automation/auto-aggio-design.md`
- No-API default policy: `docs/ORCHESTRATOR_RULES.md`, `docs/AI_RULES.md`, `docs/LLMS.md`
- Language policy for agents: `docs/AI_RULES.md`

---

**Task queued — awaiting explicit manual gate for runtime execution**
