#!/usr/bin/env bash
# Solo lettura: stato git e presenza documentazione operativa.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "== Branch corrente =="
git branch --show-current

echo "== git status --short =="
git status --short

echo "== Ultimi 5 commit =="
git log --oneline -5

echo "== Tag v* =="
git tag --list "v*" 2>/dev/null || true

echo "== HEAD (abbrev) =="
git rev-parse --short HEAD

echo "== Documentazione operativa =="
for f in \
  docs/PROJECT_STATE.md \
  docs/CHECKPOINT.md \
  docs/AI_RULES.md \
  docs/WORKFLOW.md \
  docs/COMMANDS.md
do
  if [[ -f "$ROOT/$f" ]]; then
    echo "  OK   $f"
  else
    echo "  MISS $f"
  fi
done

if [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
  echo "== git diff --stat (working tree non pulito) =="
  git diff --stat
else
  echo "== git diff --stat =="
  echo "(nessuna modifica locale)"
fi

echo "== Fine aggio =="
