# Dual CLI / Agentic Injection Threat Model

**Date:** 2026-05-15
**Task:** 0299-agentic-injection-threat-model
**Type:** docs-only design
**Status:** documented; dual CLI runtime remains LATER/GATED
**Docs ROI:** consolidates injection/poisoning risks in one compact file so future dual-CLI / n8n / Ollama / Cursor-agent work can reference a single threat surface; reduces ambiguity for orchestrator-lite + implementer + reviewer roles.

Companion: `docs/automation/dual-cli-orchestrator-lite-design.md` (role boundaries, gates, stop conditions).

---

## Scope

Future dual-CLI pipeline (n8n + Ollama + orchestrator-lite + implementer CLI + reviewer). All stages read potentially untrusted text: task files, queue items, session notes, commit messages, issue/comment text, branch names, prompts, packets. This document enumerates threats and mitigations; it does not implement scanners.

---

## Threats

### T1. Prompt injection in task files
Malicious or careless content in `docs/tasks/queue/<id>.md` could try to redirect the implementer ("ignore previous instructions", embedded role-flip, fake gate approvals).

### T2. Malicious or ambiguous branch names
Branch names interpreted as flags or shell fragments (e.g. `--force`, `;rm`, backticks) when interpolated into commands or prompts.

### T3. Injection inside issue / comment / session note text
Untrusted Markdown in issues, comments, or `docs/sessions/*` text consumed by Ollama/orchestrator-lite to derive intent.

### T4. Command injection via copied shell text
Code blocks in task files containing harmful commands if blindly executed.

### T5. Hidden Unicode / confusable characters
Zero-width chars, RTL overrides, Cyrillic look-alikes in task IDs, slugs, paths, or instructions; bypass simple grep checks.

### T6. Secrets leakage in reports
Implementer or reviewer accidentally echoing tokens, chat IDs, OAuth material, API keys into session notes, done markers, or commits.

### T7. Tool poisoning / false tool descriptions
A malicious or drifted tool description tricking an agent into invoking a destructive action under a benign label.

### T8. Untrusted queue item content
Queue items added by an external system (future n8n auto-create) containing instructions that exceed allowed paths or sensitive gates.

### T9. Artifact tampering
Done marker, session note, Review Packet, or commit altered after creation to falsify completion status.

### T10. Reviewer over-trust of implementer prose
Reviewer (ChatGPT-web or orchestrator-lite) accepting implementer's narrative claims without checking diff/commit/status.

### T11. Cross-task carryover
Stale instructions from a previous task bleeding into the next task's context if the agent does not re-anchor on the current task file.

### T12. Ollama/classifier mis-classification used as gate
Classifier output (advisory) misread as authorization for a sensitive action.

---

## Mitigations

| Threat | Mitigation |
|---|---|
| T1, T8, T11 | Artifact-only communication: implementer reads task file from `docs/tasks/queue/` and explicit prompt; ignores chat-only claims. Re-anchor on task ID at start. |
| T1, T7, T12 | Classifier and tool descriptions are advisory only; human gates (`docs/INBOX.md` Decision Packet) remain user-only. |
| T2 | Branch names are not interpolated into shell; treat as opaque strings. Main-only workflow today; future branches use fixed prefixes only. |
| T3 | Reviewer treats untrusted Markdown as data, not instruction. No agent acts on a session note instruction unless reproduced as a Task Packet. |
| T4 | Implementer does not execute shell from task body unless explicitly part of the task spec and within allowed-path/local-preflight rules. |
| T5 | Slugs and task IDs restricted to ASCII `[0-9a-z-]`. Reviewer flags any non-ASCII in IDs/paths. |
| T6 | Final-report contract: no tokens, chat IDs, OAuth material, API keys in repo. Reviewer checks diff for known secret patterns before approving. |
| T7 | Tool list and allowed actions enumerated in design doc §2 and §7; new tools require explicit user gate. |
| T9 | Commits are append-only on `main`; reviewer compares commit hash + diff against done marker. Force-push forbidden. |
| T10 | Reviewer must verify commit hash, changed files, and `git status --short` — not prose. Review Packet records `commit_hash` and `changed_files` explicitly. |
| T11 | Each task starts from local preflight; implementer's task ID is the only authoritative anchor. |
| T12 | Classifier outputs cannot include approve/execute/deploy/merge/send fields (see Ollama classifier contract). |

---

## Cross-cutting principles

- **Allow/forbid paths win over prose.** A task body that says "also edit X" but X is not in `allowed_paths` must be refused.
- **Human gates win over classifier and reviewer.** Sensitive actions stay user-only.
- **Local preflight before action.** Implementer verifies branch, clean tree, last commit before acting.
- **No secrets in docs, ever.** Templates and reports use placeholders only.
- **No runtime without explicit user gate.** Design docs do not authorize execution.
- **Reviewer reads artifacts, not narrative.** Commit + diff + status are the truth; prose summarizes.

---

## Out of scope

- Scanner implementation (regex, secret-detection, lint).
- Sandbox or container design.
- Network egress controls.
- Provider API authentication threats (no provider API in scope).

These remain LATER/GATED and would require their own design tasks.

---

## References

- `docs/automation/dual-cli-orchestrator-lite-design.md` — role boundaries, stop conditions, packet contracts.
- `docs/INBOX.md` — Decision Packet surface for human gates.
- `docs/AI_RULES.md` — implementer rules (no `git add .`, selective commit, language policy).
- `docs/ORCHESTRATOR_RULES.md` — PRIORITÀ 0 / 0A / 0B.
