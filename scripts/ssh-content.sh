#!/bin/bash
set -euo pipefail
export PATH="/opt/homebrew/opt/node@24/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

case "${1:-}" in
    production) port=8080 ;;
    staging) port=8081 ;;
    *) printf 'A fixed content environment is required\n' >&2; exit 2 ;;
esac
if [[ "${SSH_ORIGINAL_COMMAND:-}" != content ]]; then
    printf 'Only the content command is allowed\n' >&2
    exit 2
fi

directory=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
exec node "$directory/content-snapshot.mjs" "$port"
