# Task 0386 — V2.2.0 Direct Start Frontend

- Project: Alina Lavoro
- Type: frontend
- Priority: high
- Deploy: no

## Objective

Implement no-login direct start in Index.html.

## Changes

- Removed `loginView` div (code screen)
- Removed `hidden` from `appView` and `nav`
- Rewrote DOMContentLoaded: shows app immediately via `showApp()`
- Removed `login()`, `tryQuickResumeFromCache_`, `loginBackground_`
- Added `initBackground_()`: loads server data without code param
- Removed `!state.accessCode` guard from `flushQueue`
- APP_VERSION bumped to 2.2.0

## Done status

- Completed by: Claude Code (Sonnet 4.6)
- Completion date: 2026-05-16
- Completion commit: f997190
- Session: docs/sessions/2026-05-16-v220-no-login-release.md
