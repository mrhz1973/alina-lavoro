# Wiki — Current State Snapshot

**Derived memory (Level 2) — last updated: 2026-05-14 (task 0273)**
**Canonical sources win on conflict.**

---

## App

| Field | Value |
|---|---|
| Version | **V1.9.2** |
| Tag | `v1.9.2-stable` |
| Branch | **main** |
| Apps Script | **@24** |
| Last test | OK 2026-05-10 (`/exec @24`, Redmi 9C NFC) |
| Scope | Stable — not touched during automation workstream |

---

## Active Workstream

**automation / watcher / runner / low-touch**

Current posture: **stable monitoring + subtraction**. Do not open new automation branches unless they remove proven user friction.

---

## Task State

| Item | Value |
|---|---|
| Last completed | **0275 — AGENTS.md Compact Routing Pointer Cleanup** (2026-05-14): docs-only; replaced `v31-enforcement-checklist.md` pointer with `prompt-routing.md`; added local clone preflight pointer; AGENTS.md remains pointer-only; no new doc; no runtime. |
| Previous | **0274 — Local Clone Preflight Standardization**: added mandatory local clone preflight to `implementer-standard.md` and `docs/COMMANDS.md`. |
| Queue | `docs/tasks/queue/` |

---

## Measurement Snapshot — 0273

Approximate line-count proxy from fetched GitHub contents; no local tokenizer was available through the connector.

| Area | Before | After |
|---|---:|---:|
| Mandatory cold-start (`LLMS.md`, `current-state.md`, `token-efficiency.md`) | ~420 lines | ~290 lines |
| Core V3.1 routing files (`prompt-routing`, `context-budget`, `template-pack-index`, `task-id-preflight`) | ~210 lines | ~145 lines |
| Template pack (`docs/tasks/templates/*`) | ~345 lines | ~330 lines |
| Total measured guidance set | ~975 lines | ~765 lines |

Consolidated duplication:
- repeated long history in `LLMS.md` and `current-state.md`;
- Prompt Size Guard references that required opening the enforcement checklist;
- Decision Packet rules that could accidentally include routine runtime outcomes;
- Docs ROI Gate references that pointed to a separate checklist instead of the active routing guide.

---

## Telegram Mode A / INBOX

| Item | State |
|---|---|
| Telegram workflow | Active Schedule Trigger every 5 minutes; notification-only |
| Stability | **stable-after-fix** after latest-done numeric sort fix and duplicate-skip validation |
| INBOX pending | **0** |
| INBOX decided | 21 |
| INBOX superseded | 1 (`D-0202-A → D-0206-A`) |
| Telegram scope | Must not answer INBOX or record decisions |

Routine posture: monitor passively. Check logs only when Telegram arrives unexpectedly, duplicates, or anomaly appears.

---

## Automation Done Criteria

Automation is considered sufficiently stable when:
- Telegram Mode A is active and monitored;
- INBOX pending count is manageable;
- template-first policy is stable;
- no new runtime is required.

Any new automation workstream must show which repeated manual interaction it removes.

---

## Current Constraints

- No app work unless explicitly requested.
- No runtime/n8n UI/Execute/Schedule/Telegram send without explicit gate.
- No deploy/tag/rollback.
- No provider API or new billing.
- No secrets, real chat IDs, tokenized URLs, OAuth material, or credential exports.
- `AGENTS.md` stays pointer-only.
- LLMS.md stays compact; it is not a history file.
- Future ideas remain future unless explicitly opened.

---

## Future / Not Active

CLI Printing Press, repo hygiene scanner, local AI router, browser bridge, dual-agent loop, VPS backup plan, n8n health check, INBOX auto-read, GitHub write automation.

---

## Rollback References

| Version | Tag | Deploy |
|---|---|---|
| V1.9.1 | `v1.9.1-stable` | @23 |
| V1.9.0 | `v1.9.0-stable` | @22 |
| V1.8.10 | `v1.8.10-stable` | @21 |

Full deploy history → `docs/PROJECT_STATE.md` (fallback/audit only)
