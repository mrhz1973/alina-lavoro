#!/usr/bin/env python3
"""
Browser Bridge - Dry-Run Mode

Local dry-run only. No browser. No network. No ChatGPT / Claude.ai write.
Writes only to .local/browser-bridge-dry-run/dry-run-output.jsonl.

Allowed message: exactly 'aggio'.
Rejects: messages containing 'D-' or '=', or longer than 20 chars.
Idempotency: skips duplicate (task_id, commit_hash, message) triplets.
Rate limit: max 4 successful writes per rolling hour.
"""
import argparse
import datetime
import json
import os
import sys

_HERE = os.path.dirname(os.path.abspath(__file__))
_REPO_ROOT = os.path.dirname(os.path.dirname(_HERE))
OUTPUT_DIR = os.path.join(_REPO_ROOT, ".local", "browser-bridge-dry-run")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "dry-run-output.jsonl")

ALLOWED_MESSAGES = {"aggio"}
MAX_MESSAGE_LEN = 20
RATE_LIMIT_MAX = 4
RATE_LIMIT_WINDOW_SECONDS = 3600


def validate_message(message: str) -> None:
    if len(message) > MAX_MESSAGE_LEN:
        raise ValueError(f"Message too long: max {MAX_MESSAGE_LEN} chars, got {len(message)}")
    if "D-" in message:
        raise ValueError("Message must not contain 'D-' (DP-like messages are rejected)")
    if "=" in message:
        raise ValueError("Message must not contain '=' (DP response syntax is rejected)")
    if message not in ALLOWED_MESSAGES:
        raise ValueError(
            f"Message not in allowlist: '{message}'. Allowed: {sorted(ALLOWED_MESSAGES)}"
        )


def make_idempotency_key(task_id: str, commit_hash: str, message: str) -> str:
    return f"{task_id}|{commit_hash}|{message}"


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
                pass
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
        if r.get("mode") != "dry_run":
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


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Browser Bridge - Dry-Run Mode. "
            "Local only. No browser. No network. No ChatGPT / Claude.ai write. "
            "Writes to .local/browser-bridge-dry-run/dry-run-output.jsonl. "
            "Allowed message: exactly 'aggio'. "
            "Rejects DP-like messages (containing 'D-' or '='). "
            "Idempotency: skips duplicate (task_id, commit_hash, message). "
            "Rate limit: max 4 writes per rolling hour."
        )
    )
    parser.add_argument("--task-id", required=True, help="Task ID (e.g. 0150)")
    parser.add_argument("--commit-hash", required=True, help="Commit hash or dry-run label")
    parser.add_argument(
        "--message", required=True, help="Message to send. Only 'aggio' is allowed."
    )
    args = parser.parse_args()

    try:
        validate_message(args.message)
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    idempotency_key = make_idempotency_key(args.task_id, args.commit_hash, args.message)
    records = read_records()

    if is_duplicate(records, idempotency_key):
        print(f"SKIP: duplicate record (idempotency_key={idempotency_key})")
        return 0

    if is_rate_limited(records):
        print(
            f"ERROR: rate limit exceeded (max {RATE_LIMIT_MAX} writes per hour)",
            file=sys.stderr,
        )
        return 1

    now = datetime.datetime.now(datetime.timezone.utc)
    record = {
        "timestamp_utc": now.isoformat(),
        "task_id": args.task_id,
        "commit_hash": args.commit_hash,
        "message": args.message,
        "idempotency_key": idempotency_key,
        "mode": "dry_run",
        "target": "local_file_only",
        "browser_used": False,
        "inbox_read": False,
        "inbox_answered": False,
        "network_used": False,
    }

    write_record(record)
    print(f"OK: record written to {os.path.relpath(OUTPUT_FILE)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
