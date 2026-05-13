#!/usr/bin/env python3
"""
Browser Bridge - Sandbox Mode

Local sandbox only. No real ChatGPT / Claude.ai. No external network.
Target is exclusively the local file tools/browser-bridge-sandbox/sandbox.html
opened (optionally) as a file:// URL in the system default browser as a
throwaway local context.

Writes only to:
  .local/browser-bridge-sandbox/sandbox-output.jsonl
  .local/browser-bridge-sandbox/sandbox-page-state.json

Allowed message: exactly 'aggio'.
Rejects: messages containing 'D-' or '=', or longer than 20 chars.
Idempotency: skips duplicate (task_id, commit_hash, message, mode) keys.
Rate limit: max 4 successful sandbox records per rolling hour.

Authorization: D-0151-A = 1 (recorded task 0152). Opens sandbox phase only.
Project-chat phase remains a separate future gate.
"""
import argparse
import datetime
import json
import os
import sys
import webbrowser

_HERE = os.path.dirname(os.path.abspath(__file__))
_REPO_ROOT = os.path.dirname(os.path.dirname(_HERE))

SANDBOX_HTML = os.path.join(_HERE, "sandbox.html")

OUTPUT_DIR = os.path.join(_REPO_ROOT, ".local", "browser-bridge-sandbox")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "sandbox-output.jsonl")
STATE_FILE = os.path.join(OUTPUT_DIR, "sandbox-page-state.json")

ALLOWED_MESSAGES = {"aggio"}
MAX_MESSAGE_LEN = 20
RATE_LIMIT_MAX = 4
RATE_LIMIT_WINDOW_SECONDS = 3600
MODE = "sandbox"
TARGET_LABEL = "local_sandbox_file_only"
BROWSER_CONTEXT = "throwaway_local_file"

FORBIDDEN_TARGET_STRINGS = (
    "chatgpt.com",
    "chat.openai.com",
    "claude.ai",
    "openai.com",
    "anthropic.com",
)


def validate_message(message: str) -> None:
    if len(message) > MAX_MESSAGE_LEN:
        raise ValueError(
            f"Message too long: max {MAX_MESSAGE_LEN} chars, got {len(message)}"
        )
    if "D-" in message:
        raise ValueError("Message must not contain 'D-' (DP-like messages are rejected)")
    if "=" in message:
        raise ValueError("Message must not contain '=' (DP response syntax is rejected)")
    if message not in ALLOWED_MESSAGES:
        raise ValueError(
            f"Message not in allowlist: '{message}'. Allowed: {sorted(ALLOWED_MESSAGES)}"
        )


def validate_target(sandbox_file: str) -> None:
    if os.path.abspath(sandbox_file) != os.path.abspath(SANDBOX_HTML):
        raise ValueError(
            "Sandbox target must be tools/browser-bridge-sandbox/sandbox.html only"
        )
    if not os.path.isfile(sandbox_file):
        raise ValueError(f"Sandbox file not found: {sandbox_file}")
    lowered = sandbox_file.lower()
    for needle in FORBIDDEN_TARGET_STRINGS:
        if needle in lowered:
            raise ValueError(f"Forbidden target string detected: {needle}")


def make_file_url(path: str) -> str:
    abs_path = os.path.abspath(path)
    normalized = abs_path.replace("\\", "/")
    if not normalized.startswith("/"):
        normalized = "/" + normalized
    url = "file://" + normalized
    lowered = url.lower()
    for needle in FORBIDDEN_TARGET_STRINGS:
        if needle in lowered:
            raise ValueError(f"Forbidden URL string detected: {needle}")
    if not url.lower().startswith("file://"):
        raise ValueError("Only file:// scheme is allowed for sandbox target")
    return url


def make_idempotency_key(task_id: str, commit_hash: str, message: str, mode: str) -> str:
    return f"{task_id}|{commit_hash}|{message}|{mode}"


def read_records() -> list:
    if not os.path.exists(OUTPUT_FILE):
        return []
    records = []
    with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                records.append(json.loads(line))
            except json.JSONDecodeError:
                print(
                    f"WARNING: skipping malformed JSONL line in {OUTPUT_FILE}",
                    file=sys.stderr,
                )
    return records


def is_duplicate(records: list, idempotency_key: str) -> bool:
    for r in records:
        if r.get("idempotency_key") == idempotency_key:
            return True
    return False


def is_rate_limited(records: list) -> bool:
    now = datetime.datetime.now(datetime.timezone.utc)
    window_start = now - datetime.timedelta(seconds=RATE_LIMIT_WINDOW_SECONDS)
    recent_count = 0
    for r in records:
        if r.get("mode") != MODE:
            continue
        try:
            ts = datetime.datetime.fromisoformat(r["timestamp_utc"])
            if ts >= window_start:
                recent_count += 1
        except (KeyError, ValueError):
            pass
    return recent_count >= RATE_LIMIT_MAX


def write_record(record: dict) -> None:
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(OUTPUT_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, separators=(",", ":")) + "\n")


def write_state(state: dict) -> None:
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, sort_keys=True)
        f.write("\n")


def attempt_browser_open(file_url: str) -> str:
    try:
        opened = webbrowser.open(file_url, new=1, autoraise=False)
    except Exception as exc:
        print(f"WARNING: webbrowser.open raised: {exc}", file=sys.stderr)
        return "unavailable"
    return "opened" if opened else "unavailable"


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Browser Bridge - Sandbox Mode. "
            "Local sandbox only. Target is exclusively "
            "tools/browser-bridge-sandbox/sandbox.html via file:// URL. "
            "No real ChatGPT / Claude.ai. No external network. "
            "Allowed message: exactly 'aggio'. "
            "Rejects DP-like messages (containing 'D-' or '='). "
            "Idempotency: skips duplicate (task_id, commit_hash, message, mode). "
            "Rate limit: max 4 successful records per rolling hour."
        )
    )
    parser.add_argument("--task-id", required=True, help="Task ID (e.g. 0153)")
    parser.add_argument("--commit-hash", required=True, help="Commit hash or sandbox label")
    parser.add_argument(
        "--message", required=True, help="Message to send. Only 'aggio' is allowed."
    )
    parser.add_argument(
        "--no-open",
        action="store_true",
        help="Do not attempt to open the local sandbox HTML in a browser. "
        "State and JSONL evidence are still written.",
    )
    args = parser.parse_args()

    try:
        validate_message(args.message)
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    try:
        validate_target(SANDBOX_HTML)
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    try:
        file_url = make_file_url(SANDBOX_HTML)
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    idempotency_key = make_idempotency_key(
        args.task_id, args.commit_hash, args.message, MODE
    )
    records = read_records()

    if is_duplicate(records, idempotency_key):
        print(f"SKIP: duplicate record (idempotency_key={idempotency_key})")
        return 0

    if is_rate_limited(records):
        print(
            f"ERROR: rate limit exceeded (max {RATE_LIMIT_MAX} sandbox records per hour)",
            file=sys.stderr,
        )
        return 1

    browser_open_attempted = not args.no_open
    if browser_open_attempted:
        browser_open_result = attempt_browser_open(file_url)
    else:
        browser_open_result = "skipped"

    now = datetime.datetime.now(datetime.timezone.utc)
    record = {
        "timestamp_utc": now.isoformat(),
        "task_id": args.task_id,
        "commit_hash": args.commit_hash,
        "message": args.message,
        "idempotency_key": idempotency_key,
        "mode": MODE,
        "target": TARGET_LABEL,
        "sandbox_file": os.path.relpath(SANDBOX_HTML, _REPO_ROOT).replace("\\", "/"),
        "sandbox_state_file": os.path.relpath(STATE_FILE, _REPO_ROOT).replace("\\", "/"),
        "browser_open_attempted": browser_open_attempted,
        "browser_open_result": browser_open_result,
        "browser_context": BROWSER_CONTEXT,
        "project_chat_used": False,
        "chatgpt_or_claude_used": False,
        "inbox_read": False,
        "inbox_answered": False,
        "network_used": False,
        "external_url_used": False,
    }

    state = {
        "last_task_id": args.task_id,
        "last_commit_hash": args.commit_hash,
        "last_message": args.message,
        "last_mode": MODE,
        "last_target": TARGET_LABEL,
        "last_sandbox_file": record["sandbox_file"],
        "last_file_url": file_url,
        "last_browser_open_attempted": browser_open_attempted,
        "last_browser_open_result": browser_open_result,
        "last_browser_context": BROWSER_CONTEXT,
        "last_timestamp_utc": now.isoformat(),
        "project_chat_used": False,
        "chatgpt_or_claude_used": False,
        "inbox_read": False,
        "inbox_answered": False,
        "network_used": False,
        "external_url_used": False,
    }

    write_record(record)
    write_state(state)
    print(f"OK: sandbox record written to {os.path.relpath(OUTPUT_FILE)}")
    print(f"OK: sandbox state written to {os.path.relpath(STATE_FILE)}")
    print(f"INFO: browser_open_attempted={browser_open_attempted}")
    print(f"INFO: browser_open_result={browser_open_result}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
