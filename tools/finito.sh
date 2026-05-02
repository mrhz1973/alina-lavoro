#!/usr/bin/env bash
# Chiusura blocco: controlli, git add selettivo, commit, push (no clasp/deploy).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

usage() {
  echo "Uso: npm run finito -- \"Messaggio commit\" file1 [file2 ...]" >&2
  echo "Esempio: npm run finito -- \"docs: workflow\" README.md docs/WORKFLOW.md" >&2
  exit 1
}

if [[ $# -lt 2 ]]; then
  usage
fi

MSG="$1"
shift
FILES=("$@")

if [[ -z "$MSG" ]]; then
  echo "Errore: messaggio commit vuoto." >&2
  usage
fi

for f in "${FILES[@]}"; do
  if [[ ! -e "$ROOT/$f" ]]; then
    echo "Errore: file non trovato: $f" >&2
    exit 1
  fi
done

echo "== git diff --check =="
git diff --check

HAS_INDEX=0
for f in "${FILES[@]}"; do
  if [[ "$f" == "src/frontend/Index.html" ]]; then
    HAS_INDEX=1
    break
  fi
done

if [[ "$HAS_INDEX" -eq 1 ]]; then
  echo "== Controlli src/frontend/Index.html =="
  TMP_JS="$(mktemp "${TMPDIR:-/tmp}/alina-finito.XXXXXX")"
  python3 - "$ROOT/src/frontend/Index.html" "$TMP_JS" <<'PY'
import re, sys
path, out = sys.argv[1], sys.argv[2]
s = open(path).read()
m = re.search(r"<script>\s*(.*)\s*</script>", s, re.S)
if not m:
    sys.exit("ERRORE: blocco <script> non trovato")
open(out, "w").write(m.group(1))
PY
  node --check "$TMP_JS"
  rm -f "$TMP_JS"
  if grep -qE '\?\?|\|\|=|\?\.[^/]' src/frontend/Index.html; then
    echo "ATTENZIONE: trovati operatori ?. / ?? / ||= in Index.html (grep)." >&2
    exit 1
  fi
  echo "-- data-page nav --"
  grep -o 'data-page="[^"]*"' src/frontend/Index.html | sort -u
  NAV_COUNT="$(grep -o 'data-page="[^"]*"' src/frontend/Index.html | sort -u | wc -l | tr -d ' ')"
  if [[ "$NAV_COUNT" != "4" ]]; then
    echo "ERRORE: attesi esattamente 4 data-page univoci sulla nav, trovati: $NAV_COUNT" >&2
    exit 1
  fi
  for p in home months notes settings; do
    if ! grep -q "data-page=\"${p}\"" src/frontend/Index.html; then
      echo "ERRORE: manca data-page=\"${p}\" nella nav." >&2
      exit 1
    fi
  done
  echo "OK controlli Index.html"
fi

echo "== git diff --stat =="
git diff --stat

echo "== git add (selettivo) =="
for f in "${FILES[@]}"; do
  echo "  + $f"
  git add -- "$f"
done

echo "== git commit =="
git commit -m "$MSG"

echo "== git push =="
git push

HASH="$(git rev-parse HEAD)"
echo "== Commit hash =="
echo "$HASH"

echo "== git status --short (finale) =="
git status --short

echo "== finito (nessun clasp/deploy) =="
