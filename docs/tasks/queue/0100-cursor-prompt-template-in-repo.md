# Task — Introduce Cursor prompt template in repo

## Metadata

- ID: 0100-cursor-prompt-template-in-repo
- Project: Alina Lavoro
- Type: docs-only
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no

## Context

Oggi il template del prompt Cursor è generato dentro il nodo Code
"Build Cursor prompt" del workflow n8n
"TEST - GitHub list Alina task queue". Il template non è versionato,
non è reviewabile via PR, e modificarlo richiede di entrare in n8n.

Questo task introduce la **prima versione documentale** del template
come file Markdown in repo, **senza modificare n8n**. Il task n8n
collegato, cioè la lettura del template dal repo, sarà un task successivo.

## Objective

Creare il file:
- docs/tasks/templates/cursor-prompt-default.md

con il contenuto attuale del template generato dal nodo
"Build Cursor prompt", in forma di Markdown con segnaposto chiari
per le variabili sostituibili da n8n in futuro.

## Files allowed

- docs/tasks/templates/cursor-prompt-default.md (nuovo)
- docs/sessions/2026-05-11-task-0100-cursor-prompt-template.md (nuovo)
- docs/PROJECT_STATE.md (eventuale riga sintetica sul nuovo template)
- docs/CHECKPOINT.md (aggiornamento se cambia stato)

## Files forbidden

- src/**, gas-current/**, appsscript.json, package.json
- altri file in docs/automation/n8n-workflows/* (saranno aggiornati
  in un task n8n successivo, non in questo)

## Requirements

- Il template deve essere un Markdown leggibile da solo.
- Deve usare segnaposto espliciti per le variabili attuali, es:
  {{task_source_path}}, {{project}}, {{type}}, {{priority}},
  {{deploy_policy}}, {{objective}}, {{requirements}},
  {{expected_output}}
- Deve includere la sezione "Mandatory constraints" come oggi.
- Deve includere la sezione "Final response required" come oggi.
- Deve includere la riga di riferimenti @docs/* come oggi.

## Constraints

- Nessuna modifica al workflow n8n in questo task.
- Nessuna modifica a docs/automation/n8n-workflows/* in questo task.
- Commit selettivo, no git add .
- Lavoro su branch main.

## Checks

- git diff --check
- Lettura visiva del template per verificare coerenza con il prompt
  generato oggi da n8n per i task 0001-0005.

## Deploy policy

none

## Expected output

- 1 file template Markdown in docs/tasks/templates/
- 1 file sessione in docs/sessions/
- Eventuali aggiornamenti minimi a CHECKPOINT.md e/o PROJECT_STATE.md
- Commit selettivo + push su main
- Riepilogo finale standard (hash, git status, rischi residui)

## Manual test gate

not required (è un task documentale puro)
