# Task 0374 — Claude Code Permission Friction Audit

- Project: Alina Lavoro
- Type: config / audit
- Priority: normal
- Deploy policy: no
- Status: done

## Done status

- Completed by: Claude Code (batch 0372–0377, 2026-05-16)
- Audited: .claude/settings.local.json (project root)
- Finding: safe read-only commands missing from allow list — git status, git diff, git log, git branch,
  git rev-parse, git remote, grep, node --check, cp, ls were not pre-approved
- Result: these caused unnecessary permission prompts during batch execution
- Remediation: task 0375 (update settings.local.json)
