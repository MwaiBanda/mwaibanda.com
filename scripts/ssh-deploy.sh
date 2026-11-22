#!/bin/bash
set -euo pipefail
allowed_environment=${1:-}
case "$allowed_environment" in
    production|staging) ;;
    *) printf 'A fixed deployment environment is required\n' >&2; exit 2 ;;
esac
IFS=' ' read -r operation environment image release_sha extra <<< "${SSH_ORIGINAL_COMMAND:-}"
if [[ "${operation:-}" != deploy || -n "${extra:-}" || -z "${environment:-}" || -z "${image:-}" ]]; then
    printf 'Only deploy ENVIRONMENT IMAGE [COMMIT_SHA] commands are allowed\n' >&2
    exit 2
fi
if [[ "$environment" != "$allowed_environment" ]]; then
    printf 'This key cannot deploy another environment\n' >&2
    exit 2
fi
args=("$environment" "$image")
if [[ ! "${release_sha:-}" =~ ^[0-9a-f]{40}$ ]]; then
    printf 'Deploys require a commit SHA\n' >&2
    exit 2
fi
args+=("$release_sha")
unset MWAIBANDA_CONFIG_DIR
directory=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
exec /bin/bash "$directory/deploy.sh" "${args[@]}"