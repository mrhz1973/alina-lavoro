# Orchestrator Rule — Claude Code Usage Budget

Status: canonical rule
Date: 2026-05-12
Project: Alina Lavoro

## Purpose

Avoid wasting Claude Code usage limits, especially when the current session is close to exhaustion or has accumulated too much context.

This rule applies while Claude Code is the temporary local implementer and remains useful when Cursor returns.

## Core rule

Use Claude Code in short, isolated sessions.

**One Claude Code session = one task.**

After a task is completed with commit, push, and clean workspace, do not continue with a new task in the same Claude Code session. Return to the orchestrator, run `aggio`, then start a fresh Claude Code session only if another task is needed.

## Usage thresholds

### Above 80 percent session usage

Claude Code may finish the current task, but must not start a new task.

### Above 90 percent session usage

Claude Code should only close the current task:

- finish checks;
- commit selectively;
- push;
- report final status;
- stop.

No new analysis, no new planning, no new file creation outside the current task.

### Above 95 percent session usage

Claude Code must do closure only or stop:

- commit/push if the current work is ready;
- report dirty workspace if not ready;
- do not read large files;
- do not generate long summaries;
- do not start another task.

### Around 99 percent session usage

Do not use Claude Code for new work.

If the workspace is already clean and pushed, stop using Claude Code until reset.

If local changes exist, use the remaining margin only for the smallest possible safe closure:

```text
Controlla git status --short. Se il workspace è pulito, dimmi solo: workspace pulito. Se ci sono modifiche non committate, dimmi solo i file modificati e non fare altro.
```

## Compacting rule

Repeated `Conversation compacted` events are a signal that the session is too long.

If Claude Code compacts repeatedly before finishing a task, do not start another task in that session. Once the current task is closed, open a new Claude Code session from the repository root.

## New terminal / new session rule

Starting a new terminal does not reset account usage limits.

A new terminal is useful for context hygiene only, not for bypassing usage limits.

If current usage is around 99 percent, do not open a new Claude Code session just to continue work. Wait for reset unless an emergency closure is needed.

## Recommended workflow

For the next task after a reset:

1. open a fresh terminal;
2. enter the repository root;
3. sync with GitHub;
4. run local `aggio`;
5. start Claude Code;
6. execute only the current task from `docs/tasks/queue/`.

Example Windows flow:

```powershell
git checkout main
git pull --rebase origin main
npm.cmd run aggio:win
claude
```

## Prompt discipline

### Regola principale per lunghezza prompt

La lunghezza del prompt dipende dall'implementatore destinatario.

| Implementatore | Stile prompt |
|----------------|-------------|
| **Claude Code** | Breve — referenzia task e documenti già su GitHub |
| **Cursor** | Completo — blocco operativo autosufficiente |
| **Windsurf / Cascade** | Completo — blocco operativo autosufficiente |

### Claude Code — prompt brevi

Claude Code legge GitHub e i documenti canonici in autonomia. Prompt lunghi sprecano contesto e token di sessione.

Se il task esiste già in `docs/tasks/queue/`, usare questa struttura minima:

```text
Esegui il task docs/tasks/queue/<task>.md.
Applica CLAUDE.md, docs/ORCHESTRATOR_RULES.md, docs/AI_RULES.md, docs/WORKFLOW.md e docs/COMMANDS.md.
Chiudi secondo workflow con commit selettivo e push.
```

Se il task non esiste ancora: creare prima il task con prompt breve, lasciando che Claude Code legga i documenti già in repo.

Usare prompt più lungo con Claude Code **solo** quando i dati necessari non sono ancora su GitHub — per esempio output appena raccolto in chat che non è stato ancora committato.

### Cursor / Windsurf / Cascade — prompt più estesi

Cursor e Windsurf/Cascade preferiscono blocchi operativi più autosufficienti. Non accorciare i prompt per questi implementatori. Il blocco deve contenere tutto il contesto operativo necessario, secondo la **Regola output prompt Cursor** in `docs/ORCHESTRATOR_RULES.md`.

### Regola modello per Claude Code

Per Claude Code, preferire:

- **Sonnet**: esecuzione operativa ordinaria, task piccoli, docs-only, chiusure documentali, commit e push.
- **Opus**: solo per pianificazione complessa, analisi difficile o decisioni architetturali.

Non usare Opus per task che Sonnet può completare correttamente.

## Rationale

Long Claude Code sessions consume more usage because they carry large context, cached writes, repeated summaries, and compaction overhead.

Short task-scoped sessions reduce:

- compacting frequency;
- token waste;
- stale context;
- accidental prompt drift;
- risk of continuing from an obsolete state.

## Current policy for Alina Lavoro

Automation remains the default workstream unless the user explicitly redirects to the app Alina.

However, usage-budget gates still apply: automation must not continue inside an exhausted Claude Code session.
