#!/bin/bash
set -euo pipefail
allowed_environment=${1:-}
case "$allowed_environment" in
    production|staging) ;;
    *) printf 'A fixed deployment environment is required\n' >&2; exit 2 ;;
esac
IFS=' ' read -r operation environment image extra <<< "${SSH_ORIGINAL_COMMAND:-}"
if [[ "${operation:-}" != deploy || -n "${extra:-}" || -z "${environment:-}" || -z "${image:-}" ]]; then
    printf 'Only deploy ENVIRONMENT IMAGE commands are allowed\n' >&2
    exit 2
fi
if [[ "$environment" != "$allowed_environment" ]]; then
    printf 'This key cannot deploy another environment\n' >&2
    exit 2
fi
unset MWAIBANDA_CONFIG_DIR
directory=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
exec /bin/bash "$directory/deploy.sh" "$environment" "$image"