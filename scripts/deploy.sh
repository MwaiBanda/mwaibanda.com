#!/bin/bash
set -euo pipefail
umask 077
export PATH="/opt/homebrew/opt/node@24/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

check_only=0
if [[ "${1:-}" == --check ]]; then check_only=1; shift; fi
if [[ $# -ne 2 ]]; then
    printf 'Usage: deploy.sh [--check] production|staging ghcr.io/mwaibanda/mwaibanda.com:branch-COMMIT_SHA\n' >&2
    exit 2
fi
environment=$1
image=$2
case "$environment" in
    production) service=mwaibanda-prod; container=mwaibanda-io; branch=main; port=8080; image_variable=PRODUCTION_IMAGE ;;
    staging) service=mwaibanda-staging; container=mwaibanda-staging; branch=staging; port=8081; image_variable=STAGING_IMAGE ;;
    *) printf 'Unsupported environment\n' >&2; exit 2 ;;
esac
if [[ ! "$image" =~ ^ghcr\.io/mwaibanda/mwaibanda\.com:${branch}-[0-9a-f]{40}$ ]]; then
    printf 'Expected an immutable image tag from the matching branch\n' >&2
    exit 2
fi
script_directory=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
deployment_directory=$(cd "$script_directory/.." && pwd)
config_directory=${MWAIBANDA_CONFIG_DIR:-"$HOME/.config/mwaibanda"}
export MWAIBANDA_CONFIG_DIR="$config_directory"
node - "$environment" "$config_directory" <<'NODE'
const { readFileSync, statSync } = require('node:fs')
const { resolve } = require('node:path')
const { parseEnv } = require('node:util')
const [environment, directory] = process.argv.slice(2)
function load(name) {
    const filename = resolve(directory, `${name}.env`)
    const stat = statSync(filename)
    if ((stat.mode & 0o077) !== 0) throw new Error(`${name}.env must not be accessible to other users`)
    const values = parseEnv(readFileSync(filename, 'utf8'))
    for (const key of ['TURSO_DATABASE_URL', 'TURSO_AUTH_TOKEN']) {
        if (!values[key] || values[key].includes('replace-with')) throw new Error(`${name}.env requires ${key}`)
    }
    let database
    try { database = new URL(values.TURSO_DATABASE_URL) } catch { throw new Error(`${name}.env contains an invalid database URL`) }
    if (!database.hostname || !['libsql:', 'https:'].includes(database.protocol)) throw new Error(`${name}.env requires a remote Turso database URL`)
    return database.hostname.toLowerCase()
}
const production = load('production')
if (environment === 'staging' && load('staging') === production) throw new Error('Staging must use a different Turso database from production')
NODE
if [[ "$check_only" == 1 ]]; then printf 'Preflight passed for %s\n' "$environment"; exit 0; fi
mkdir -p "$config_directory/releases"
lock="$config_directory/releases/$environment.lock"
if ! mkdir "$lock" 2>/dev/null; then printf 'Another deployment is active; inspect %s\n' "$lock" >&2; exit 1; fi
compose=(docker compose --profile staging --project-directory "$deployment_directory" -f "$deployment_directory/docker-compose.yaml")
previous_image=$(docker inspect --format '{{.Image}}' "$container" 2>/dev/null || true)
legacy_container=''
rollback_needed=0
cleanup() {
    exit_code=$?
    trap - EXIT
    if [[ "$exit_code" -ne 0 && "$rollback_needed" == 1 ]]; then
        printf 'Deployment failed; restoring %s\n' "$environment" >&2
        if [[ -n "$legacy_container" ]]; then
            if [[ "$(docker inspect --format '{{index .Config.Labels "com.docker.compose.service"}}' "$container" 2>/dev/null || true)" == "$service" ]]; then
                docker rm -f "$container" >/dev/null || true
            fi
            docker rename "$legacy_container" "$container" && docker start "$container" >/dev/null || printf 'Automatic rollback failed; restore the legacy container manually\n' >&2
        elif [[ -n "$previous_image" ]]; then
            export "$image_variable=$previous_image"
            "${compose[@]}" up -d --no-deps --no-build --pull never "$service" || printf 'Automatic rollback failed\n' >&2
        else
            "${compose[@]}" rm -sf "$service" || true
        fi
    fi
    rm -f "$lock/health.headers"
    rmdir "$lock" 2>/dev/null || true
    exit "$exit_code"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
docker info >/dev/null
"${compose[@]}" config --quiet
docker pull "$image"
if [[ -n "$previous_image" ]]; then
    current_service=$(docker inspect --format '{{index .Config.Labels "com.docker.compose.service"}}' "$container")
    current_project=$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project"}}' "$container")
    if [[ "$current_project" != mwaibandacom ]]; then printf 'Refusing to replace a container owned by another project\n' >&2; exit 1; fi
    if [[ "$current_service" != "$service" ]]; then
        if [[ "$environment" != production || "$current_service" != web ]]; then printf 'Unexpected existing container service\n' >&2; exit 1; fi
        legacy_container="$container-legacy-$(date +%s)"
        docker rename "$container" "$legacy_container"
        rollback_needed=1
        docker stop "$legacy_container" >/dev/null
    fi
fi
rollback_needed=1
export "$image_variable=$image"
"${compose[@]}" up -d --no-deps --no-build --pull never "$service"
for endpoint in /api/v1/work /api/v1/articles; do
    curl --fail --silent --show-error --retry 10 --retry-connrefused --retry-all-errors --retry-delay 1 --retry-max-time 45 --max-time 5 --dump-header "$lock/health.headers" --output /dev/null "http://127.0.0.1:$port$endpoint"
    actual_revision=$(awk 'tolower($1) == "x-release-sha:" { revision=$2 } END { gsub("\r", "", revision); print revision }' "$lock/health.headers")
    if [[ "$actual_revision" != "${image##*-}" ]]; then printf 'Health endpoint does not match the expected release\n' >&2; exit 1; fi
done
if [[ -n "$previous_image" ]]; then
    printf '%s\n' "$previous_image" > "$config_directory/releases/$environment.previous-image"
fi
printf '%s\n' "$image" > "$config_directory/releases/$environment.image"
rollback_needed=0
if [[ -n "$legacy_container" ]]; then docker rm "$legacy_container" >/dev/null; fi
printf 'Deployed %s using %s\n' "$environment" "$image"