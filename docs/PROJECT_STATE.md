# Alina Lavoro - Project State

Ultimo aggiornamento: 2026-05-17 (task 0416) — Settings/Mesi UX fixes deployed @39 (2026-05-17). URL invariato (stesso deployment ID di @37). Phone test utente pending. Stable tag pending (0392). Session: `docs/sessions/2026-05-17-v220-settings-mesi-phone-test-fixes.md`. Body below preserved from earlier compression and is superseded by `docs/LLMS.md` + `docs/wiki/current-state.md` for current state; canonical Level-2 memory is the wiki.

## Current App State

| Field | Value |
|-------|-------|
| Source version | **V2.2.0 + patch 2026-05-16** (batch 0399–0403; deployed @33) |
| Production version | **V2.2.0 patched** (deployed 2026-05-16 @33) |
| Tag | `v2.1.1-stable` (last stable; v2.2.0-stable pending user test) |
| Branch | **main** (operational) — `dev` is legacy/inactive |
| Apps Script deploy | **@33** (V2.2.0 patched live; same deployment ID as @31) |
| Last manual test | OK 2026-05-10 (Redmi 9C NFC, /exec @24, V2.1.1); V2.2.0 patched test pending |
| App scope | **V2.2.0 · no-login direct start · patch deployed @33 · awaiting manual user test** |

**Constraint:** do not return to Alina app work until watcher/runner/low-touch workstream is closed, or user explicitly requests it.

## Active Workstream

**automation / watcher / runner / low-touch**

Building the autonomous low-touch task loop:
`GitHub → n8n → implementer → Decision Packet → user`

## Task State

| State | Info |
|-------|------|
| Last completed | **0117** — Phase 2 watcher/polling MVP completion (2026-05-12) |
| Next planned | Gate 7 → task 0134 **Windows** Ollama Local Preflight (runtime-gated) — target: Windows workstation (Ryzen 9 3900X / RTX 3060 12 GB); Mac M2 opzione secondaria |
| Queue location | `docs/tasks/queue/` |

## Low-Touch Stack

| Component | Status | Document |
|-----------|--------|----------|
| n8n queue reader | ✅ Operational (5-min schedule, Europe/Berlin) | `docs/automation/n8n-workflows/queue-reader.md` |
| n8n schedule polling | ✅ Validated end-to-end | — |
| Decision Packet Format | ✅ Canonical | `docs/automation/decision-packet-format.md` |
| Human Decision Inbox design | ✅ Designed — `docs/INBOX.md` NOT created | `docs/automation/human-decision-inbox-design.md` |
| Auto-Aggio design | ✅ Designed (zero runtime, discipline) | `docs/automation/auto-aggio-design.md` |
| n8n DP Generator design | ✅ Designed | `docs/automation/n8n-decision-packet-generator-design.md` |
| LLM Wiki (this layer) | ✅ Active | `docs/wiki/` |
| Ollama Classifier/Planner | ✅ Feasibility done — preflight runtime-gated pending Gate 7 — **target: Windows workstation** (Ryzen 9 3900X / RTX 3060 12 GB); Mac M2 opzione secondaria | `docs/automation/ollama-classifier-planner-feasibility-post-wiki.md` |

## VPS Status

Node.js v18.19.1 ✅ | npm 9.2.0 ✅ | Claude Code CLI 2.1.139 ✅
Login blocked ❌ | API key ❌ | Runner automatico ❌
n8n binding: 127.0.0.1:5678 (hardened)

## Implementers

| Implementer | Status |
|-------------|--------|
| Claude Code (local) | Principal — active |
| Windsurf/Cascade | Backup / supervised |
| Cursor | Suspended until reset |

## Open Technical Debts

- `docs/PROJECT_STATE.md` > 47k chars → **COMPLETED** (2026-05-13)
- `docs/INBOX.md` not yet created → reserved for future mixed/runtime-gated task

## Open Gates

The following require explicit manual gate before any action:

- Ollama install, embeddings runtime, VPS changes
- n8n runtime modifications
- API key, login, GitHub Actions
- deploy Apps Script, tag, rollback, runner automatico
- app Alina source modifications (`src/**`)

## App Rollback References

| Version | Tag | Deploy |
|---------|-----|--------|
| V1.9.1 | `v1.9.1-stable` | @23 |
| V1.9.0 | `v1.9.0-stable` | @22 |
| V1.8.10 | `v1.8.10-stable` | @21 |

Full history → `docs/history/PROJECT_LOG.md`

## Current Next Step

**Workstream active:** automation watcher/runner.
**Next micro-step:** Gate 7 → task 0134 Windows Ollama Local Preflight Install (runtime-gated).

**History pointer:** Long historical content moved to `docs/history/PROJECT_LOG.md` (audit-only, not default read material).
