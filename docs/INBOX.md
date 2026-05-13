# INBOX — Human Decision Inbox

**Design:** `docs/automation/human-decision-inbox-design.md` (task 0129)
**Format:** `docs/automation/decision-packet-format.md` (task 0127)
**Created:** 2026-05-13 (task 0141)

---

## Purpose

INBOX contains **only real human decisions** that require a response.

**INBOX is NOT:**
- a status log
- a task completion feed
- a session automation archive
- a "all green" notification board

**INBOX IS:**
- the single place to find all pending decisions
- compatible with Decision Packet Format (13 canonical fields)
- readable immediately by ChatGPT (LLMS-first) and future n8n
- the archive of decided/deferred/superseded decisions

**INBOX does not bypass gates.** Writing a response here does NOT authorize:
- deploy, tag, rollback
- runtime changes (VPS, n8n, Ollama)
- app source modifications (`src/**`)
- API key creation or provider billing
- GitHub Actions
- physical tests on Alina's phone

Sensitive gates remain manual and require explicit separate authorization.

---

## Response Convention

Reply in chat or commit message using the short form:

| Form | Meaning |
|------|---------|
| `D-NNNN-X = 1` | Choose option 1 |
| `D-NNNN-X = 2` | Choose option 2 |
| `D-NNNN-X = defer` | Explicitly defer (move to Deferred) |
| `D-NNNN-X = skip` | No response (rare; signals disinterest) |
| `D-NNNN-X = retry` | Reformulate — options are insufficient |

ChatGPT records the response by moving the block from Pending to Decided and updating `response` and `decided_at`.

---

## Pending

_No pending decisions._

---

## Decided

### D-0167-A — Open Telegram node addition gate

**inbox_status:** decided
**created_at:** 2026-05-13
**source_task:** 0167-record-telegram-node-addition-gate-decision
**source_document:** docs/automation/telegram-mode-a-completion-notification-mvp.md
**response:** 1
**decided_at:** 2026-05-13
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-0167-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

Task 0161 created docs-only MVP scaffolding. Task 0162 created the credential prerequisite guide. Task 0163 recorded `D-0163-A = 1`. Task 0164 recorded user-reported credential prerequisite completion. Task 0165 recorded `D-0165-A = 1`, opening the workflow creation gate only. Task 0166 recorded user-reported workflow skeleton creation: `TEST - Alina task completion Telegram notifier` (Manual Trigger → List done files → Pick latest done file → Get done file → Build notification payload), no Telegram node.

## Perché serve decisione

Adding a Telegram node is an n8n workflow modification. Even without sending a message, it introduces Telegram send capability and must remain explicitly gated per project policy.

## Opzioni

1. **Open only Telegram node addition gate** — authorize future step-by-step user-supervised addition of a Telegram node after `Build notification payload`; credential by name only; no test message; no Execute/Test; no Schedule Trigger.
2. **Defer Telegram node addition** — keep workflow at skeleton-only state; return to this gate later.
3. **Cancel Telegram Mode A path** — block Telegram implementation entirely until explicit future reconsideration.

## Raccomandazione orchestratore

Option 1. The skeleton is in place. Adding only the Telegram node (without executing it) is the narrowest safe next step. No test message is sent. No schedule is enabled. The scope is narrow and reversible.

## Rischio principale

Scope creep toward executing/testing the Telegram node without a separate gate. The node addition must not trigger any send.

## Impatto

- App Alina: no impact.
- GitHub docs: this task records the decision only.
- Runtime: no runtime performed by this task; node addition is a future manual user step.
- n8n: no workflow modification by this task.
- INBOX: remains source of truth; Telegram must not answer it.
- Gate 7: no impact; remains closed.
- Provider API LLM: no impact; still forbidden by default.
- Billing: no new LLM billing.

## Micro-interazioni umane eliminate

0 immediately. After node addition and future test/schedule gates, Telegram Mode A may reduce manual checking burden.

## Scelta richiesta

`D-0167-A = 1` per aprire solo il gate aggiunta nodo Telegram.
`D-0167-A = 2` per rimandare.
`D-0167-A = 3` per annullare il percorso Telegram.

## Cosa succede dopo la scelta

If `D-0167-A = 1`, user may proceed step-by-step in n8n UI to add one Telegram node. No test message until a separate future gate.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- sending any Telegram test message;
- executing/testing the workflow;
- enabling Schedule Trigger;
- making the workflow active/published for automatic notifications;
- modifying the existing queue reader workflow;
- deleting any existing workflow;
- exporting/importing workflow JSON with secrets;
- committing secrets;
- using provider API LLM;
- introducing new billing;
- modifying the app;
- deploy/tag/rollback;
- Browser Bridge real project-chat;
- Ollama runtime;
- Cursor CLI/headless runner.

## Decision outcome

Recorded by task 0167 on 2026-05-13: user response `D-0167-A = 1`.
This opens only the Telegram node addition gate.
It authorizes future user-supervised step-by-step n8n UI addition of one Telegram node after `Build notification payload`, with credential referenced by name only (`telegram_alina_notifier`), chat id used only in n8n UI/runtime by the user (never in repo/docs/AI chat), and workflow kept manual-safe.
No runtime was performed by this task. No Telegram node was created by this task.
Test message requires a separate future explicit gate. Schedule activation requires a separate future explicit gate.
No token or chat id stored in repo. No provider API LLM. No new billing. No app/deploy/tag/rollback.

**Follow-up status (task 0168, 2026-05-13):** The user reported adding and saving the Telegram node. Workflow name: `TEST - Alina task completion Telegram notifier`. Node chain: Manual Trigger → List done files → Pick latest done file → Get done file → Build notification payload → Telegram. Credential by name only: `telegram_alina_notifier`. Text expression: `{{ $json.telegram_message }}`. Chat id was entered in n8n UI by the user and is not recorded in the repository. No Telegram test message was sent. No Execute/Test was performed. No Schedule Trigger was added or enabled. No workflow JSON was exported. No token or chat id is stored in the repository. Test message and schedule activation remain separately gated.

---

### D-0165-A — Open n8n Telegram notifier workflow creation gate

**inbox_status:** decided
**created_at:** 2026-05-13
**source_task:** 0165-record-n8n-telegram-notifier-workflow-creation-gate-decision
**source_document:** docs/automation/telegram-mode-a-completion-notification-mvp.md
**response:** 1
**decided_at:** 2026-05-13
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-0165-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

Task 0161 created docs-only MVP scaffolding for Telegram Mode A completion notification.
Task 0162 created the credential prerequisite guide.
Task 0163 recorded `D-0163-A = 1` (manual credential prerequisite gate open).
Task 0164 recorded user-reported completion: bot exists, `telegram_alina_notifier` credential in n8n tested OK, chat id saved privately; no token/chat id in repo.

The next step — creating the n8n notifier workflow — is an n8n runtime modification. Runtime gates require explicit human decision per project policy.

## Perché serve decisione

Workflow creation is an n8n runtime modification. Even a manual user-supervised UI creation requires an explicit gate before any runtime step begins.

## Opzioni

1. **Open only workflow creation gate** — authorize future step-by-step user-supervised n8n UI creation of `TEST - Alina task completion Telegram notifier`; credential referenced by name only; workflow kept manual-safe; no test message; no Schedule Trigger.
2. **Defer workflow creation** — keep Telegram at credential-only state; no n8n workflow created; return to this gate later.
3. **Cancel Telegram Mode A path** — block Telegram implementation entirely until explicit future reconsideration.

## Raccomandazione orchestratore

Option 1. The credential is in place. Workflow creation is the narrowest safe next step: supervised n8n UI only, no test message, no schedule. Scope is narrow and reversible (workflow can be deleted from n8n UI at any time).

## Rischio principale

Scope creep from workflow creation toward test message or schedule activation without separate gates. Each must remain separately gated.

## Impatto

- App Alina: no impact.
- GitHub docs: this task records the decision only.
- Runtime: no runtime performed by this task; workflow creation is a future manual user step.
- n8n: no workflow created by this task.
- INBOX: remains source of truth; Telegram must not answer it.
- Gate 7: no impact; remains closed.
- Provider API LLM: no impact; still forbidden by default.
- Billing: no new LLM billing.

## Micro-interazioni umane eliminate

0 immediately. After workflow creation and future test/schedule gates, Telegram Mode A may reduce manual checking burden.

## Scelta richiesta

`D-0165-A = 1` per aprire solo il gate creazione workflow n8n notifier.
`D-0165-A = 2` per rimandare.
`D-0165-A = 3` per annullare il percorso Telegram.

## Cosa succede dopo la scelta

If `D-0165-A = 1`, user may proceed with step-by-step supervised n8n UI workflow creation. Test message requires a separate future gate.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- sending any Telegram test message;
- enabling Schedule Trigger;
- making the workflow active/published for automatic notifications;
- modifying the existing queue reader workflow;
- deleting any existing workflow;
- exporting/importing workflow JSON with secrets;
- committing secrets;
- using provider API LLM;
- introducing new billing;
- modifying the app;
- deploy/tag/rollback;
- Browser Bridge real project-chat;
- Ollama runtime;
- Cursor CLI/headless runner.

## Decision outcome

Recorded by task 0165 on 2026-05-13: user response `D-0165-A = 1`.
This opens only the n8n Telegram notifier workflow creation gate.
It authorizes future user-supervised step-by-step n8n UI creation of `TEST - Alina task completion Telegram notifier`, with credential referenced by name only (`telegram_alina_notifier`), workflow kept manual-safe and not automatically active.
No runtime was performed by this task. No workflow was created by this task.
Test message requires a separate future explicit gate. Schedule activation requires a separate future explicit gate.
No token or chat id stored in repo. No provider API LLM. No new billing. No app/deploy/tag/rollback.

**Follow-up status (task 0166, 2026-05-13):** The user reported creating and saving the n8n workflow skeleton. Workflow name: `TEST - Alina task completion Telegram notifier`. Node chain: Manual Trigger → List done files → Pick latest done file → Get done file → Build notification payload. No Telegram node was added. No Telegram test message was sent. No Schedule Trigger was added or enabled. No workflow JSON was exported. No token or chat id is stored in the repository. Test message and schedule activation remain separately gated.

---

### D-0163-A — Open Telegram credential prerequisite manual gate

**inbox_status:** decided
**created_at:** 2026-05-13
**source_task:** 0163-record-telegram-credential-prerequisite-gate-decision
**source_document:** docs/automation/telegram-mode-a-credential-prerequisite-guide.md
**response:** 1
**decided_at:** 2026-05-13
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-0163-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

Task 0161 (commit 25aff57) created docs-only scaffolding for the Telegram Mode A completion notification MVP, pinning scope, message template, trigger model, idempotency key, credential boundary, test ladder, and stop conditions.

Task 0162 (commit 073e9b6) created a docs-only user-guided prerequisite guide documenting how a future human operator will create a Telegram bot via BotFather, obtain the token privately, identify the chat id privately, and store both only in the n8n credential vault (`telegram_alina_notifier`).

Credentials and an n8n credential vault are sensitive configuration. Even a manual human-guided prerequisite phase requires an explicit human gate before the operator begins collecting or storing secrets.

## Perché serve decisione

The credential prerequisite guide (task 0162) describes manual user steps that involve creating a real Telegram bot and handling a real token. Without an explicit gate, the project cannot confirm the user intentionally chooses to proceed with this credential phase. Without the credential in place, no future n8n workflow can be tested.

## Opzioni

1. **Open only the manual Telegram credential prerequisite gate** — authorize only the human-guided prerequisite phase: user may create bot via BotFather, obtain token privately, identify chat id privately, and store token/chat id only in n8n credential vault as `telegram_alina_notifier`. Does not authorize workflow creation, test messages, Schedule Trigger, workflow JSON export/import, app/deploy/tag/rollback, provider API LLM, or new billing.
2. **Defer credential prerequisite** — keep all Telegram steps docs-only; no credential creation authorized; return to this gate later.
3. **Cancel Telegram Mode A path** — block Telegram implementation entirely until explicit future reconsideration.

## Raccomandazione orchestratore

Option 1.
The credential prerequisite is the narrowest possible manual step: it only authorizes the human operator to create a bot and store credentials privately in n8n vault. No runtime workflow is created. No message is sent. The scope is narrow and the step is fully reversible (revoke bot via BotFather if needed).

## Rischio principale

Credential leakage into the repo: if the operator inadvertently commits the bot token or chat id, the credential must be treated as compromised. The prerequisite guide (task 0162) already documents clipboard hygiene, redaction rules, and the git grep check for leaked token shapes.

## Impatto

- App Alina: no impact.
- GitHub docs: this task records the decision only.
- Runtime: no runtime in this task; credential creation is a future manual user step.
- n8n: no workflow creation in this task.
- INBOX: remains source of truth; Telegram must not answer it.
- Browser Bridge: no change; remains sandbox-only.
- Gate 7: no impact; remains closed.
- Provider API LLM: no impact; still forbidden by default.
- Billing: no new LLM billing.

## Micro-interazioni umane eliminate

0 immediately. After credential and future n8n workflow are in place, Telegram Mode A may reduce the user's manual checking burden. This decision alone does not eliminate micro-interactions.

## Scelta richiesta

Scrivi: `D-0163-A = 1` per aprire solo il gate prerequisito credenziali Telegram.
Scrivi: `D-0163-A = 2` per rimandare.
Scrivi: `D-0163-A = 3` per annullare il percorso Telegram.

## Cosa succede dopo la scelta

If `D-0163-A = 1` is recorded, the user may proceed with the manual credential prerequisite steps described in `docs/automation/telegram-mode-a-credential-prerequisite-guide.md`. A separate future gated task is required before any n8n workflow creation or test message.
If `D-0163-A = 2` or `defer`, no credential creation proceeds; Telegram remains docs-only.
If `D-0163-A = 3` or `skip`, the Telegram path remains blocked until explicitly reconsidered.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- creating or modifying an n8n workflow;
- sending any Telegram message;
- enabling any Schedule Trigger;
- exporting/importing workflow JSON;
- committing secrets;
- using provider API LLM;
- introducing new billing;
- modifying the app;
- deploy/tag/rollback;
- Browser Bridge real project-chat;
- Ollama runtime;
- Cursor CLI/headless runner.

## Decision outcome

Recorded by task 0163 on 2026-05-13: user response `D-0163-A = 1`.
This opens only the manual Telegram credential prerequisite gate.
It authorizes the human operator to: create a Telegram bot via BotFather, obtain the bot token privately, identify the target chat id privately, and store both only in the n8n credential vault as `telegram_alina_notifier`.
It does not authorize n8n workflow creation, test messages, Schedule Trigger activation, workflow JSON export/import, app/deploy/tag/rollback, provider API LLM, or new billing.
No runtime was performed by this task.
A separate future gated task is required before any n8n workflow creation or test message.

**Follow-up status (task 0164, 2026-05-13):** The user reported completing the manual credential prerequisite phase. Telegram bot exists. n8n credential `telegram_alina_notifier` exists and connection test succeeded. Chat id saved privately by user. No token or chat id is stored in the repository. No n8n workflow was created. No Telegram message was sent. Workflow creation / test message / schedule activation remain separately gated.

---

### D-0157-A — Open Telegram Mode A completion notification MVP gate

**inbox_status:** decided
**created_at:** 2026-05-13
**source_task:** 0157-telegram-mode-a-completion-notification-decision-packet
**source_document:** docs/automation/telegram-browser-bridge-trigger-coordination-design.md
**response:** 1
**decided_at:** 2026-05-13
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-0157-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

The Browser Bridge project-chat path is deferred by `D-0154-A = 2`, and Browser Bridge remains sandbox-only.
The low-touch workflow still needs a safe way to notify the user when a supervised implementer task appears to be complete and ready for ChatGPT post-check.

Telegram Mode A is the notification-only path: Telegram informs the user; it does not orchestrate, decide, answer INBOX, or execute project actions.
ChatGPT remains the orchestrator. GitHub and `docs/INBOX.md` remain the source of truth.

## Perché serve decisione

Telegram Mode A would introduce an external notification channel and likely a Telegram bot/token in a future implementation task.
Even if the MVP is notification-only, it still involves credentials and runtime configuration, so it requires an explicit human gate before implementation.

Without this decision, no Telegram runtime implementation prompt may be generated.

## Opzioni

1. **Open Telegram Mode A completion notification MVP gate only** — authorize a future implementation task for Telegram-only task completion notifications. The future MVP may notify the user with task id/slug, commit hash, optional INBOX pending count, and the instruction "scrivi aggio per post-check". It must not answer INBOX, must not create decisions, must not execute actions, must not use Browser Bridge, must not use Ollama, must not use Cursor, must not touch app/deploy/tag/rollback, must not use provider API LLM, and must not introduce new LLM billing.
2. **Defer Telegram Mode A MVP** — keep Telegram design-only; continue with docs-only hardening, local tooling, or another candidate gate later.
3. **Reject Telegram path for now** — keep all Telegram automation blocked until explicit future reconsideration.

## Raccomandazione orchestratore

Option 1.
Telegram Mode A completion notification is the safest useful low-touch step after Browser Bridge was stopped at sandbox-only.
It does not write into the real ChatGPT / Claude.ai chat, does not answer INBOX, does not decide anything, and can reduce the user's manual checking burden by telling the user when to run the post-check manually.

The future implementation must remain extremely narrow:
- notification-only;
- task id / slug;
- commit hash;
- optional INBOX pending count;
- fixed instruction: "scrivi aggio per post-check";
- no INBOX answer;
- no automatic decision;
- no Browser Bridge;
- no Ollama;
- no Cursor;
- no app/deploy/tag/rollback;
- no provider API LLM;
- no new LLM billing.

## Rischio principale

The main risk is notification-channel creep: Telegram could slowly become a control plane instead of a notification channel.
The implementation must therefore keep Telegram Mode A notification-only, with no authority to answer decisions, write INBOX responses, or execute project actions.

Credential handling is also a risk. Any future Telegram token must be handled only through an explicitly approved secure mechanism and must never be committed to the repository.

## Impatto

- App Alina: no impact.
- GitHub docs: this task records the user decision only.
- Runtime: no runtime in this task; Telegram runtime requires a separate future implementation task.
- INBOX: remains the source of truth; Telegram must not answer it.
- Browser Bridge: no change; remains sandbox-only.
- n8n: no change in this task.
- Ollama / Gate 7: no impact.
- Cursor CLI / Gate 7: no impact.
- Provider API LLM: no impact; still forbidden by default.
- Billing: no new LLM billing.

## Micro-interazioni umane eliminate

0 immediately.
If later implemented, Telegram Mode A may reduce the need for the user to manually check GitHub/INBOX after implementer completion. It may send a completion notification that tells the user to write `aggio` for ChatGPT post-check. This decision alone does not eliminate micro-interactions.

## Scelta richiesta

Scrivi: `D-0157-A = 1` per aprire solo il gate Telegram Mode A completion notification MVP.
Scrivi: `D-0157-A = 2` per rimandare.
Scrivi: `D-0157-A = 3` per respingere per ora il percorso Telegram.
In alternativa: `D-0157-A = defer`, `D-0157-A = skip`, oppure `D-0157-A = retry`.

## Cosa succede dopo la scelta

If `D-0157-A = 1` is recorded in `docs/INBOX.md`, the orchestrator may generate a future implementer prompt for a narrow Telegram Mode A MVP implementation task. That future task must be notification-only and must not answer INBOX, make decisions, execute project actions, use Browser Bridge, use Ollama, use Cursor, modify the app, deploy, tag, rollback, use provider API LLM, or introduce new LLM billing.
If `D-0157-A = 2` or `defer`, Telegram remains design-only and no Telegram runtime prompt is generated.
If `D-0157-A = 3` or `skip`, the Telegram path remains blocked until explicitly reconsidered.
If `D-0157-A = retry`, the orchestrator reformulates the Decision Packet.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- Telegram bot creation;
- Telegram token creation or storage;
- n8n runtime modification;
- answering INBOX;
- reading INBOX from a bridge;
- writing any `D-NNNN-X = N` response;
- Browser Bridge project-chat;
- Ollama install or model pull;
- Cursor CLI/headless execution;
- Gate 7;
- provider API LLM;
- new LLM billing;
- app source modification;
- Apps Script deploy;
- tag;
- rollback.

## Decision outcome

Recorded by task 0159 on 2026-05-13: user response `D-0157-A = 1`.
This opens the Telegram Mode A completion notification MVP gate only.
It authorizes only a future narrow implementation task.
It does not implement Telegram.
It does not create a bot.
It does not create or store a Telegram token.
It does not configure n8n runtime.
It does not send Telegram messages.
It does not answer INBOX.
It does not create decisions.
It does not use Browser Bridge.
It does not use Ollama.
It does not use Cursor.
It does not touch app/deploy/tag/rollback.
It does not use provider API LLM.
It does not introduce new LLM billing.
A separate future task/prompt is required to implement the MVP.
Credential handling must be explicitly secured in the future implementation task and no secret may be committed.

---

### D-0154-A — Open Browser Bridge project-chat write gate

**inbox_status:** decided
**created_at:** 2026-05-13
**source_task:** 0154-browser-bridge-project-chat-gate-decision-packet
**source_document:** docs/automation/candidate-gate-backlog.md
**response:** 2
**decided_at:** 2026-05-13
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-0154-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

Task 0150 implemented the Browser Bridge dry-run.
Task 0153 implemented the Browser Bridge sandbox with local `file://` sandbox only, `aggio` allowlist, idempotency, rate-limit, invalid-message rejection, and safety flags confirming no project chat, no ChatGPT / Claude.ai, no INBOX, and no external network.

The remaining Browser Bridge phase is **project-chat write**: a future bridge that could write only the literal message `aggio` into the real ChatGPT / Claude.ai orchestration chat after an implementer task completes.

This is the highest-risk Browser Bridge phase because it touches the real orchestration chat.

## Perché serve decisione

Project-chat write would move from local/sandbox validation to the real assistant conversation.
Even if the bridge is limited to `aggio`, it could affect project orchestration if mis-scoped, duplicated, triggered at the wrong time, or pointed at the wrong browser context.

Project rules require a separate explicit human gate before any automation writes to the real ChatGPT / Claude.ai project chat.

Without this decision, no project-chat implementation prompt may be generated.

## Opzioni

1. **Open project-chat write gate only** — authorize a future narrow implementation task that may write only the literal message `aggio` to the real ChatGPT / Claude.ai orchestration chat, with strict safeguards: user-controlled target, no INBOX read/answer, no `D-NNNN-X`, no arbitrary text, idempotency, rate-limit, visible logging, fail-closed behavior, and no n8n/Telegram/Ollama/Cursor/API/billing/app/deploy/tag/rollback.
2. **Defer project-chat write** — keep Browser Bridge at sandbox-only state for now; optionally do more hardening/docs/manual validation before any real chat write.
3. **Stop Browser Bridge at sandbox for now** — treat dry-run and sandbox as sufficient for the current low-touch phase; keep project-chat automation blocked until a future explicit reconsideration.

## Raccomandazione orchestratore

Option 2.
The sandbox implementation is complete, but the optional real browser-open path was intentionally skipped in task 0153. Before touching the real project chat, the safer sequence is to defer project-chat write and, if needed, perform a separate manual/local verification or hardening step first.

If the user prefers faster automation, Option 1 can be chosen, but the future implementation must be extremely narrow: `aggio` only, user-controlled visible browser context only, no INBOX, no decision responses, no hidden background action, no arbitrary text, no external provider API, and fail closed if the target chat is not explicitly recognized as the intended project chat.

## Rischio principale

The main risk is that automation writes into the wrong conversation, writes at the wrong time, writes more than `aggio`, or becomes a path for silently answering INBOX or triggering orchestration without human awareness.
The implementation must therefore be designed as a visible, user-supervised bridge, not an autonomous chat controller.

## Impatto

- App Alina: no impact.
- GitHub docs: only the INBOX decision is added now.
- Runtime: no runtime in this task; possible real project-chat write runtime only if Option 1 is later recorded as decided and a separate implementation task is generated.
- Browser Bridge: dry-run and sandbox remain implemented; project-chat remains unimplemented until a future task.
- INBOX: no bridge read/answer is authorized.
- n8n: no impact.
- Telegram: no impact.
- Ollama / Gate 7: no impact.
- Cursor CLI / Gate 7: no impact.

## Micro-interazioni umane eliminate

0 immediately.
If later implemented and validated, project-chat write may reduce the need for the user to manually type `aggio` after task completion. This decision alone does not eliminate micro-interactions.

## Scelta richiesta

Scrivi: `D-0154-A = 1` per aprire solo il gate Browser Bridge project-chat write.
Scrivi: `D-0154-A = 2` per rimandare.
Scrivi: `D-0154-A = 3` per fermare per ora il Browser Bridge allo stato sandbox-only.
In alternativa: `D-0154-A = defer`, `D-0154-A = skip`, oppure `D-0154-A = retry`.

## Cosa succede dopo la scelta

If `D-0154-A = 1` is recorded in `docs/INBOX.md`, the orchestrator may generate a future implementer prompt for a narrow project-chat implementation task. That future task must write only `aggio`, must be visibly user-supervised, must not answer INBOX, must not write any `D-NNNN-X = N` response, must not send arbitrary text, and must fail closed if the target context is not explicitly safe.
If `D-0154-A = 2` or `defer`, Browser Bridge remains sandbox-only and no project-chat runtime prompt is generated.
If `D-0154-A = 3` or `skip`, the project-chat write path remains blocked until explicitly reconsidered.
If `D-0154-A = retry`, the orchestrator reformulates the Decision Packet.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- answering INBOX;
- reading INBOX from the bridge;
- writing any `D-NNNN-X = N` response;
- arbitrary text entry;
- hidden background chat control;
- n8n runtime modification;
- Telegram configuration;
- Ollama install or model pull;
- Cursor CLI/headless execution;
- Gate 7;
- provider API;
- API key creation;
- billing;
- app source modification;
- Apps Script deploy;
- tag;
- rollback.

Even if Option 1 is approved, any future expansion beyond writing literal `aggio` remains a separate future gate.

## Decision outcome

Recorded by task 0155 on 2026-05-13: user response `D-0154-A = 2`.
This defers Browser Bridge project-chat write.
Browser Bridge remains sandbox-only for now.
Project-chat gate is not open.
No project-chat implementation is authorized.
No automation may write to the real ChatGPT / Claude.ai project chat.
No INBOX read or answer is authorized from any bridge.
No `D-NNNN-X = N` response writing is authorized.
Future reconsideration requires a new or reopened Decision Packet and an explicit user response.
Dry-run (task 0150) and sandbox (task 0153) remain implemented.
Gate 7 remains closed.

---

### D-0151-A — Open Browser Bridge sandbox gate

**inbox_status:** decided
**created_at:** 2026-05-13
**source_task:** 0151-browser-bridge-sandbox-gate-decision-packet
**source_document:** docs/automation/candidate-gate-backlog.md
**response:** 1
**decided_at:** 2026-05-13
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-0151-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

Task 0150 completed the Browser Bridge dry-run implementation.
The dry-run is local-file-only: it writes `aggio` to `.local/browser-bridge-dry-run/dry-run-output.jsonl`, rejects DP-like messages, uses idempotency and rate-limit controls, and does not use browser, network, ChatGPT / Claude.ai, or INBOX.
The next candidate in the phased Browser Bridge path is the **sandbox** phase: testing browser automation only against a throwaway/sandbox browser context, not the real project chat.

## Perché serve decisione

Sandbox introduces actual browser automation.
Even if it targets only a throwaway/sandbox browser context, it is a higher-risk runtime step than dry-run because it may open or control a browser.
Project rules require an explicit human gate before any browser automation or sandbox execution.

Without this decision, no Browser Bridge sandbox implementation prompt may be generated.

## Opzioni

1. **Open Browser Bridge sandbox gate only** — authorize a future implementation task for a sandbox-only browser automation test. The future task may target only a throwaway/sandbox browser context and may attempt to send only `aggio` there. It does not authorize the real project chat, INBOX reading, INBOX answering, n8n runtime changes, Telegram, Ollama, Cursor CLI, API keys, billing, app source, deploy, tag, or rollback.
2. **Defer Browser Bridge sandbox** — keep Browser Bridge at dry-run-only state; continue with docs-only planning, hardening, or another candidate gate later.
3. **Reject browser automation path for now** — keep dry-run as the terminal Browser Bridge implementation for now; sandbox and project-chat remain blocked until future explicit reconsideration.

## Raccomandazione orchestratore

Option 1, but only with narrow scope.
The dry-run has already validated message allowlist, idempotency, duplicate skip, invalid-message rejection, and local output evidence. Sandbox is the next logical validation step, but it must remain isolated from the real orchestration chat.
The future implementation prompt must require a throwaway/sandbox browser context, must forbid project-chat access, and must preserve the rule that Browser Bridge may only write `aggio` and must never read or answer INBOX.

## Rischio principale

The main risk is scope creep from sandbox browser automation toward real project-chat automation.
A sandbox test could be accidentally expanded to the actual ChatGPT / Claude.ai project chat if boundaries are not enforced.
The future implementation prompt must therefore explicitly separate sandbox from project-chat and must fail closed if no sandbox/throwaway context is available.

## Impatto

- App Alina: no impact.
- GitHub docs: only the INBOX decision is added now.
- Runtime: no runtime in this task; possible browser sandbox runtime only if Option 1 is later recorded as decided and a separate implementation task is generated.
- Browser Bridge: dry-run remains implemented; sandbox remains unimplemented until a future task.
- n8n: no impact.
- Telegram: no impact.
- Ollama / Gate 7: no impact.
- Cursor CLI / Gate 7: no impact.

## Micro-interazioni umane eliminate

0 immediately.
If later implemented and validated, sandbox is a prerequisite toward a future project-chat bridge that may reduce the need for the user to manually type `aggio` after task completion. This decision alone does not eliminate micro-interactions.

## Scelta richiesta

Scrivi: `D-0151-A = 1` per aprire solo il gate Browser Bridge sandbox.
Scrivi: `D-0151-A = 2` per rimandare.
Scrivi: `D-0151-A = 3` per respingere per ora il percorso browser automation.
In alternativa: `D-0151-A = defer`, `D-0151-A = skip`, oppure `D-0151-A = retry`.

## Cosa succede dopo la scelta

If `D-0151-A = 1` is recorded in `docs/INBOX.md`, the orchestrator may generate a future implementer prompt for a narrow sandbox implementation task. That future task must be sandbox-only, must not touch the real project chat, and must not read or answer INBOX.
If `D-0151-A = 2` or `defer`, Browser Bridge remains dry-run-only and no sandbox runtime prompt is generated.
If `D-0151-A = 3` or `skip`, the browser automation path remains blocked until explicitly reconsidered.
If `D-0151-A = retry`, the orchestrator reformulates the Decision Packet.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- project-chat Browser Bridge phase;
- writing to the real ChatGPT / Claude.ai project chat;
- answering INBOX;
- reading INBOX from the bridge;
- writing any `D-NNNN-X = N` response;
- Telegram configuration;
- n8n runtime modification;
- Ollama install or model pull;
- Cursor CLI/headless execution;
- Gate 7;
- provider API;
- API key creation;
- billing;
- app source modification;
- Apps Script deploy;
- tag;
- rollback.

Even if Option 1 is approved, the project-chat Browser Bridge phase remains a separate future gate.

## Decision outcome

Recorded by task 0152 on 2026-05-13: user response `D-0151-A = 1`.
This opens the Browser Bridge **sandbox gate only**, authorizing a future narrow sandbox implementation task.
The future task must target only a throwaway/sandbox browser context, may attempt to send only `aggio`, and must fail closed if no sandbox context is available.
No sandbox has been implemented. No browser automation has been executed. No runtime has been activated.
This decision does not authorize:
- project-chat Browser Bridge phase or writing to the real ChatGPT / Claude.ai project chat;
- INBOX read or answer from the bridge;
- n8n runtime modification; Telegram; Ollama; Cursor CLI; Gate 7; provider API; API key; billing;
- app source modification; Apps Script deploy; tag; rollback.
A separate future task/prompt is required to implement the sandbox.
Project-chat phase remains a separate future gate.

---

### D-0148-A — Open Browser Bridge dry-run gate

**inbox_status:** decided
**created_at:** 2026-05-13
**source_task:** 0148-browser-bridge-dry-run-gate-decision-packet
**source_document:** docs/automation/candidate-gate-backlog.md
**response:** 1
**decided_at:** 2026-05-13
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-0148-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

Task 0147 created the Candidate Gate Backlog and ranked **Browser Bridge dry-run** as the recommended next gate candidate.
The Browser Bridge design defines a phased path: dry-run → sandbox → project chat.
This decision concerns only the **dry-run** phase: a local test that writes to a local test file, with no browser and no ChatGPT / Claude.ai write.

## Perché serve decisione

Even though dry-run is the safest first phase, it is still a runtime step because it would create and execute local automation logic later.
The project rules require an explicit human gate before any runtime activation.
Without this decision, no Browser Bridge dry-run implementation prompt may be generated.

## Opzioni

1. **Open Browser Bridge dry-run gate only** — authorize a future implementation task that creates a local dry-run script writing only to a local test file. No browser, no ChatGPT / Claude.ai write, no INBOX read, no INBOX response, no n8n runtime change.
2. **Defer Browser Bridge dry-run** — keep Browser Bridge fully design-only; continue with docs-only planning or another candidate gate later.
3. **Reject Browser Bridge path for now** — keep all Browser Bridge phases blocked until a future explicit reconsideration.

## Raccomandazione orchestratore

Option 1.
It is the narrowest and most reversible runtime-adjacent step: local file output only, no browser, no API key, no billing, no provider API, no app impact, and no n8n modification.
It validates the future Auto-Aggio trigger path without touching the actual ChatGPT / Claude.ai project chat.

## Rischio principale

Even a dry-run introduces a local automation surface. The risk is small but real: a future script could be expanded incorrectly if scope controls are not enforced.
The implementation prompt must therefore keep the output to a local test file only and must explicitly forbid browser automation, INBOX decisions, API keys, billing, app changes, deploy, tag, rollback, and n8n runtime changes.

## Impatto

- App Alina: no impact.
- GitHub docs: only the INBOX decision is added now.
- Runtime: no runtime in this task; possible runtime only if Option 1 is later recorded as decided.
- n8n: no impact.
- Telegram: no impact.
- Ollama / Gate 7: no impact.
- Cursor CLI / Gate 7: no impact.

## Micro-interazioni umane eliminate

0 immediately.
If later implemented and then advanced through sandbox/project-chat gates, the Browser Bridge path may reduce the need for the user to manually type `aggio` after future task completions. This decision alone does not eliminate micro-interactions.

## Scelta richiesta

Scrivi: `D-0148-A = 1` per aprire solo il gate Browser Bridge dry-run.
Scrivi: `D-0148-A = 2` per rimandare.
Scrivi: `D-0148-A = 3` per respingere il percorso Browser Bridge per ora.
In alternativa: `D-0148-A = defer`, `D-0148-A = skip`, oppure `D-0148-A = retry`.

## Cosa succede dopo la scelta

If `D-0148-A = 1` is recorded in `docs/INBOX.md`, the orchestrator may generate a future implementer prompt for a narrow dry-run implementation task. That future task may create a local script that writes only to a local test file and includes idempotency/rate-limit/logging checks.
If `D-0148-A = 2` or `defer`, Browser Bridge remains design-only and no runtime prompt is generated.
If `D-0148-A = 3` or `skip`, the Browser Bridge path remains blocked until explicitly reconsidered.
If `D-0148-A = retry`, the orchestrator reformulates the Decision Packet.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- browser automation;
- writing to ChatGPT / Claude.ai;
- answering INBOX;
- reading INBOX from the bridge;
- Telegram configuration;
- n8n runtime modification;
- Ollama install or model pull;
- Cursor CLI/headless execution;
- Gate 7;
- provider API;
- API key creation;
- billing;
- app source modification;
- Apps Script deploy;
- tag;
- rollback.

Even if Option 1 is approved, sandbox and project-chat Browser Bridge phases remain separate future gates.

## Decision outcome

Recorded by task 0149 on 2026-05-13: user response `D-0148-A = 1`.
This response opens the Browser Bridge **dry-run gate only**, authorizing a future narrow implementation task with the strict scope described above.
A separate future task/prompt is required to implement the dry-run. No runtime has been executed by this decision: it is a recorded authorization, not an activation.
Sandbox and project-chat Browser Bridge phases remain separate future gates. Browser Bridge still cannot answer INBOX (Hard Constraint #4 preserved). Gate 7 remains closed.

---

## Deferred

_No deferred decisions._

---

## Superseded

_No superseded decisions._

---

## Template — Future Decision Packet

Use this block when adding a new decision. Preserve field order.

```markdown
### D-NNNN-X — [short title]

**inbox_status:** pending
**created_at:** YYYY-MM-DD
**source_task:** NNNN-slug
**source_document:** docs/automation/{topic}.md
**response:**
**decided_at:**
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-NNNN-X
**Kind:** alina-feature | automation | infra | meta
**Data:** YYYY-MM-DD

## Contesto

[2–4 lines minimum context]

## Perché serve decisione

[what changed / why a choice is needed now]

## Opzioni

1. **[option 1]** — [brief description]
2. **[option 2]** — [brief description]
3. **[option 3]** — [brief description]

## Raccomandazione orchestratore

[recommended option with brief reason]

## Rischio principale

[key risk of the recommended option]

## Impatto

[who/what is impacted]

## Micro-interazioni umane eliminate

[how many micro-interactions does this option eliminate?]

## Scelta richiesta

Scrivi: `D-NNNN-X = N` (option number) or `D-NNNN-X = defer` / `D-NNNN-X = skip`

## Cosa succede dopo la scelta

[next step after user responds]

## Cosa NON verrà fatto senza ulteriore gate

[explicit permanent gates — no deploy, no runtime, no API key, etc.]
```

---

## Archive Policy

| Status | Default policy | Notes |
|--------|---------------|-------|
| `pending` | N/A — never archive | Stays until responded |
| `decided` | `keep` | Perpetual audit of resolved decisions |
| `deferred` | `manual` | Review periodically; rotate if obsolete |
| `superseded` | `keep` | Traceable history with `superseded_by` |

If `## Pending` exceeds 5 items, signal as congestion (Auto-Aggio rule).
If file grows excessively, propose rotation to `docs/INBOX-ARCHIVE.md` via dedicated Decision Packet.

---

## Anti-Noise Rules

1. Only real Decision Packets or genuine human decisions.
2. No generic logs (sessions, commits, automation events).
3. No status updates ("task completed", "all green").
4. No standard completed tasks — Auto-Aggio handles those silently.
5. No automation session files (those live in `docs/sessions/automation-*`).
6. No duplicate entries — each DP enters once; updates = state transitions.
7. If no real decision is needed, do not enqueue.
8. Never include tokens, credentials, OAuth material, sensitive personal data.
