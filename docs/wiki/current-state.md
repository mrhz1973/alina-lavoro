# Wiki — Current State Snapshot

**Derived memory (Level 2) — last updated: 2026-05-15 (task 0278)**
**Keep below ~100 lines. Move history to `docs/history/` or `docs/sessions/`. This is a snapshot, not a log.**
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

## Task State

| Item | Value |
|---|---|
| Last completed | **0278 — Post-Cleanup Pointer and Template Drift Check** (2026-05-15): docs-only; re-attributed `AGENTS.md` Docs ROI Gate pointer to token-efficiency.md; trimmed duplicate New-doc gate bullets in prompt-routing.md; removed stale NOW row from post-cleanup roadmap; no new doc; no runtime. |
| Previous | **0277 — Guidance Redundancy Cleanup and Roadmap** (2026-05-15): docs-only; trimmed duplicated guidance, removed stale Measurement Snapshot, merged New-doc gate in token-efficiency.md, added compact roadmap; no new doc; no runtime. |
| Queue | `docs/tasks/queue/` |

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
