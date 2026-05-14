# n8n Template-First / JSON-First Task Template

**Task:** 0232
**Status:** active template

## Rule

For n8n, the default is **TEMPLATE-FIRST / JSON-FIRST** whenever a workflow is structurally known, already validated in a previous variant, replicable as JSON, or made of predictable nodes and wiring.

## Required deliverable

Prefer an importable n8n JSON template plus companion documentation before asking the user to rebuild nodes manually.

## Template safety requirements

Every n8n template committed to the repo must satisfy:

- `active=false`;
- no active Schedule Trigger by default;
- no real Telegram bot token;
- no real Telegram Chat ID;
- no credential secret export;
- no OAuth material;
- no password;
- no provider API key;
- no URL containing `token=`;
- no node that answers INBOX;
- no Browser Bridge project-chat write;
- no queue reader modification unless explicitly scoped;
- no app source modification;
- no deploy/tag/rollback.

## Manual UI fallback

Manual n8n UI is allowed only for credential binding, Data Table selection, active=false inspection, confirming absence of Schedule Trigger, a single explicitly gated test, or a real UI-only condition that a JSON template cannot represent.

## Runtime gates

Import, Execute, Telegram send, Schedule activation, and workflow activation are runtime/UI gates and require explicit user authorization.
