#!/usr/bin/env bash
# Crea sessione in docs/sessions/ e aggiorna docs/CHECKPOINT.md (no commit/push).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

mkdir -p docs/sessions

DATE="$(date +%Y-%m-%d)"
TIME="$(date +%H%M%S)"
SESSION="$ROOT/docs/sessions/${DATE}-checkpoint.md"
if [[ -e "$SESSION" ]]; then
  SESSION="$ROOT/docs/sessions/${DATE}-checkpoint-${TIME}.md"
fi

BR="$(git branch --show-current)"
HEAD="$(git rev-parse --short HEAD 2>/dev/null || echo "?")"
LAST="$(git log -1 --oneline 2>/dev/null || echo "?")"
ST="$(git status --short 2>/dev/null || true)"
TS="$(date "+%Y-%m-%dT%H:%M:%S%z")"

{
  echo "# Session checkpoint — ${TS}"
  echo ""
  echo "- **Branch:** \`${BR}\`"
  echo "- **HEAD:** \`${HEAD}\`"
  echo "- **Ultimo commit:** ${LAST}"
  echo ""
  echo "## git status --short"
  echo ""
  echo '```'
  echo "${ST:-"(pulito)"}"
  echo '```'
} >"$SESSION"

CHECKPOINT="$ROOT/docs/CHECKPOINT.md"
{
  echo "# Alina Lavoro — Checkpoint (ripartenza)"
  echo ""
  echo "Ultimo aggiornamento generato da \`tools/checkpoint.sh\` il **${TS}**."
  echo ""
  echo "## Sessione"
  echo ""
  echo "- File creato: \`${SESSION#"$ROOT/"}\`"
  echo ""
  echo "## Branch"
  echo ""
  echo "\`${BR}\`"
  echo ""
  echo "## HEAD"
  echo ""
  echo "\`${HEAD}\`"
  echo ""
  echo "## Ultimo commit"
  echo ""
  echo "${LAST}"
  echo ""
  echo "## Working tree (git status --short)"
  echo ""
  echo '```'
  echo "${ST:-"(pulito)"}"
  echo '```'
  echo ""
  echo "## Note operative"
  echo ""
  echo "- \`npm run aggio\` — fotografia repo."
  echo "- \`npm run finito\` — chiusura blocco con commit selettivo (vedi \`docs/WORKFLOW.md\`)."
} >"$CHECKPOINT"

echo "Checkpoint scritto:"
echo "  - ${SESSION#"${ROOT}/"}"
echo "  - docs/CHECKPOINT.md"
echo "Nessun commit o push eseguito."
