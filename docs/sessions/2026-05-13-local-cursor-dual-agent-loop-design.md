# Session — Local Cursor Dual-Agent Loop Design

**Date:** 2026-05-13
**Task:** 0140-local-cursor-dual-agent-loop-design
**Type:** low-touch-loop-docs-only
**Implementer:** Claude Code (supervised)

---

## Why task 0140 was created

The low-touch automation workstream has accumulated several design documents (0135 Cursor CLI bridge, 0139 Auto-Aggio handshake) that individually address parts of the target architecture but do not yet describe how they fit together into a coherent end-to-end loop. Task 0140 was created to:

1. Formalize the target architecture: a **dual-agent Cursor loop** where one agent implements and another reviews, coordinated by Ollama (advisory) and supervised by ChatGPT web.
2. Document the **temporary fallback** because Cursor is not available for approximately 10 days, ensuring work can continue with Claude Code and Windsurf during this window.
3. Close the architectural gap between the existing designs (0135, 0139) and the full loop vision described informally in 0128 (autonomous low-touch loop design).

---

## Why Cursor is treated as future target (~10 days)

Cursor is temporarily unavailable. Key implications:

- No Cursor CLI execution is possible now.
- No dual-agent loop activation is possible now.
- All current implementation tasks use Claude Code (main) or Windsurf/Cascade (backup).
- The 0140 design is intentionally **docs-only**: prepare the architecture, branch policy, anti-loop guards, and decision integration so activation is ready when Cursor returns.
- No runtime gates were required or activated for this design task.

---

## How Claude Code / Windsurf fallback fits the project

The project's architecture has always included supervised implementers as the primary mode during Fase A (manual-supervised). Claude Code and Windsurf are not workarounds — they are the defined Fase A implementers. The dual-agent Cursor loop is Fase B/C (future semi-autonomous). The fallback is not a degradation; it is the current operational baseline:

| Phase | Mode | Implementer |
|---|---|---|
| A (current) | Manual-supervised | Claude Code (main), Windsurf (backup) |
| B (future) | MVP low-touch | Cursor Agent 1 (Implementer) + supervised review |
| C (future) | Semi-autonomous | Cursor Agent 1 + Agent 2 + Telegram + Auto-Aggio |

---

## How 0139 Auto-Aggio handshake feeds the future loop

Task 0139 defined the post-check + prompt-generation handshake triggered by "aggio":
- After implementer finishes and pushes, the user writes "aggio" (or future bridge writes it).
- ChatGPT reads GitHub, identifies decisions or not, generates the next prompt.

In the dual-agent loop:
- Agent 1 finishes → commits → pushes branch.
- Agent 2 reviews → commits review summary → pushes.
- n8n/Telegram notifies user.
- User writes "aggio" (or bridge does it).
- ChatGPT post-checks branch (reads Agent 2 review + diff) and either:
  - Issues Decision Packet (merge/fail/risk) → user decides.
  - Generates next task prompt → next loop iteration begins.

The 0139 handshake is the **closing mechanism** of each dual-agent loop iteration.

---

## How the dual-agent Cursor architecture will work

Once Cursor CLI force-mode feasibility is confirmed (runtime-gated, future task):

1. n8n reads task queue → selects first eligible task.
2. n8n calls Ollama: JSON output with task_class, risk_level, branch_name, compressed_prompt.
3. n8n (or local script) creates branch `ai/<task-id>-<slug>` from main.
4. n8n triggers **Cursor Agent 1 (Implementer)** with compressed prompt.
5. Agent 1 modifies files, runs checks, commits, pushes branch.
6. n8n detects push → triggers **Cursor Agent 2 (Reviewer / Orchestrator-Lite)**.
7. Agent 2 reads diff, runs static checks, produces review summary, commits, pushes.
8. n8n detects Agent 2 push → Telegram notifies user.
9. User writes "aggio" → ChatGPT performs post-check:
   - Reads branch + Agent 2 review summary.
   - Issues Decision Packet if merge/risk/fail needed.
   - Generates next prompt if all clear.
10. User approves merge to main (human decision) → branch merged and deleted.

**What remains human in every iteration:**
- Merge decision
- Deploy, tag, rollback
- All sensitive gate decisions
- Physical tests

---

## What remains explicitly manual / human-gated

| Action | Why manual |
|---|---|
| Merge branch to main | Human authority over main branch |
| Deploy Apps Script | Hard operational gate |
| Git tag | Version authority |
| Rollback | Destructive operation |
| Any provider API / billing | ZERO API policy |
| Cursor CLI activation | Runtime-gated preflight required first |
| Ollama model swap | Runtime-gated change |
| VPS / n8n runtime changes | Runtime gate |
| Physical test on Alina's phone | Physical gate |
| Response to Decision Packet | Human judgment gate |

---

## Confirmation

- No runtime executed
- No n8n execution or modification
- No Telegram configuration
- No Cursor execution
- No Ollama execution or model download
- No app source changes (`src/**` untouched)
- No deploy, tag, rollback
- No API key, no provider API, no billing
- No merge
- gas-current/ untouched
- package.json, appsscript.json untouched
- ZERO API policy intact
