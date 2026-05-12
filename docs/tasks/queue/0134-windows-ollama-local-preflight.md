# Windows Ollama Local Preflight

**Task ID:** 0134  
**Slug:** windows-ollama-local-preflight  
**Type:** runtime-gated-preflight  
**Scope:** local-ai / low-touch / no-api  
**Runtime:** future explicit gate required  
**Status:** queued (docs-only preparation)

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
- **Future runtime task:** separate explicit gate required before any installation or execution

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

1. **Confirm Windows workstation specs**
   - Verify CPU: AMD Ryzen 9 3900X
   - Verify RAM: 32 GB
   - Verify GPU: NVIDIA RTX 3060 12 GB VRAM
   - Document actual specs if different

2. **Confirm NVIDIA driver / CUDA availability**
   - Check NVIDIA driver version
   - Verify CUDA toolkit availability
   - Verify CUDA compatibility with RTX 3060
   - Document driver/CUDA state

3. **Confirm Ollama not installed or installed state**
   - Check if Ollama is already installed
   - If installed, document version and state
   - If not installed, note clean state

4. **Install Ollama only after explicit manual gate**
   - Download Ollama for Windows
   - Install Ollama
   - Verify Ollama service status
   - Verify Ollama CLI availability
   - This step requires explicit manual gate before execution

5. **Pull one small local model only after explicit manual gate**
   - Preferred initial model family: Qwen local model via Ollama
   - Suggested candidates:
     - qwen2.5:7b or equivalent current local 7B class model
     - qwen3:8b only if already considered appropriate by existing docs
   - Pull model with Ollama
   - Verify model download completed
   - This step requires explicit manual gate before execution

6. **Run a tiny local classification prompt**
   - Design a minimal test prompt for classification
   - Run prompt through Ollama local model
   - Measure latency
   - Measure RAM/VRAM usage
   - Verify output quality

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

10. **Verify no sensitive data in prompt**
    - Review test prompt for sensitive data
    - Confirm no credentials, tokens, API keys, OAuth material
    - Confirm no personal data from Alina app
    - Confirm no Google Sheet data
    - Confirm no email data

11. **Document hardware/latency/quality result**
    - Document RAM usage with model loaded
    - Document VRAM usage with model loaded
    - Document latency for classification
    - Document output quality (subjective assessment)
    - Document any errors or issues

12. **Stop if performance, safety, or quality is poor**
    - Define thresholds for acceptable performance
    - Define thresholds for acceptable quality
    - Stop preflight if thresholds not met
    - Document failure reason
    - Recommend alternative approach or abort

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
