# Session — Decision Inbox MVP File Creation

**Date:** 2026-05-13
**Task:** 0141-decision-inbox-mvp-file-creation
**Type:** low-touch-loop-docs-only
**Implementer:** Claude Code (supervised)

---

## Why docs/INBOX.md was created now

`docs/INBOX.md` was identified as an open technical debt since task 0129 (Human Decision Inbox Design, 2026-05-12). The 0129 design deliberately deferred the actual file creation to a separate task because task 0129 was a pure design doc and creating INBOX involved a new repository artifact that affects the orchestration layer.

With task 0140 (Local Cursor Dual-Agent Loop Design) completed, the dual-agent architecture is now defined and INBOX is a required component — Agent 2 (Reviewer) needs a place to surface Decision Packets, and the auto-aggio handshake (0139) needs INBOX to route decisions when they exist.

Creating INBOX now closes the last open technical debt documented in `docs/wiki/current-state.md` and `docs/LLMS.md`.

---

## How it implements the 0129 Human Decision Inbox design

Task 0129 recommended **Opzione A**: a single `docs/INBOX.md` file with four sections:

| Section | Purpose |
|---------|---------|
| `## Pending` | Decisions requiring user response |
| `## Decided` | Decisions with user response recorded |
| `## Deferred` | Decisions explicitly deferred with note |
| `## Superseded` | Decisions replaced by a later DP |

The MVP file implements this structure exactly. It starts with no pending decisions because no unresolved Decision Packet was found in the required canonical sources. D-0128-A (from the autonomous-low-touch-loop-design.md) was effectively resolved by proceeding with all three MVP components (0129, 0130, 0131) and does not require migration.

The file also includes:
- Purpose statement (INBOX vs log distinction)
- Response convention (`D-NNNN-X = N`)
- Full template block preserving the 13 canonical Decision Packet fields
- Archive policy table
- Anti-noise rules
- Explicit gate disclaimer (INBOX does not bypass sensitive gates)

---

## How it integrates with Decision Packet Format

`docs/INBOX.md` uses the canonical Decision Packet Format (task 0127):
- All 13 fields present in the template, in canonical order
- `kind` remains in position 2 (structural indicator, not a user question)
- 8 INBOX-specific header fields added above the DP block: `inbox_status`, `created_at`, `source_task`, `source_document`, `response`, `decided_at`, `superseded_by`, `archive_policy`
- These header fields are additive, not substitutive — the 13 DP fields are unchanged

---

## How it supports Auto-Aggio and the future dual-agent loop

**Auto-Aggio (task 0139):**
- ChatGPT performing a post-check will now read INBOX as part of orientation
- If `## Pending` is non-empty, ChatGPT stops the flow and presents the Decision Packet to the user
- If `## Pending` is empty, ChatGPT proceeds to generate the next implementer prompt
- INBOX empty = no decisions = loop continues

**Dual-Agent Loop (task 0140):**
- Agent 2 (Reviewer / Orchestrator-Lite) detects `fail` or `issues_found` → a Decision Packet is created and added to INBOX `## Pending`
- ChatGPT post-check reads INBOX, finds the Decision Packet, surfaces it to user
- User responds with `D-NNNN-X = N`
- ChatGPT records response, moves block to `## Decided`, generates next prompt

**n8n (future):**
- n8n can read INBOX periodically to detect pending decisions
- n8n can append Decision Packets to INBOX when tasks produce them
- n8n can read responses via commit message pattern `inbox: D-NNNN-X = N`
- All of this is future runtime-gated; no n8n changes in this task

---

## Why it remains docs-only and zero-runtime

INBOX is a Markdown file in the repository. Creating it requires no:
- runtime system activation
- n8n workflow modification
- API calls
- credentials

ChatGPT can read and write it immediately via GitHub (LLMS-first) or via a simple commit. The human decision workflow works from day 1 without automation:

1. Decision arises (from task output or ChatGPT post-check)
2. ChatGPT adds Decision Packet block to `## Pending`
3. User writes `D-NNNN-X = N` in ChatGPT chat
4. ChatGPT moves block to `## Decided` and commits
5. Loop continues

No n8n modifications needed for this base workflow.

---

## What remains future / runtime-gated

| Feature | Status |
|---------|--------|
| n8n reading INBOX periodically | Future runtime-gated — requires n8n workflow modification gate |
| n8n writing Decision Packets to INBOX automatically | Future runtime-gated |
| Telegram notification when `## Pending` has new items | Future runtime-gated |
| Browser bridge automatic DP ingestion | Future runtime-gated |
| Response parsing by automation (via commit message) | Future runtime-gated |
| INBOX-ARCHIVE.md rotation | Future docs-only — only when file grows excessively |

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
- D-0128-A not migrated: effectively resolved by completion of 0129/0130/0131; no unresolved pending DP found in canonical sources
