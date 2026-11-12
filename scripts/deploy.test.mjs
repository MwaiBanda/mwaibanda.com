import test from 'node:test'
import assert from 'node:assert/strict'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { parseEnv } from 'node:util'

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const commit = 'a'.repeat(40)
const productionImage = `ghcr.io/mwaibanda/mwaibanda.com:main-${commit}`
const stagingImage = `ghcr.io/mwaibanda/mwaibanda.com:staging-${commit}`
function fixture(context) {
  const directory = mkdtempSync(resolve(tmpdir(), 'mwaibanda-deploy-'))
  context.after(() => rmSync(directory, { recursive: true, force: true }))
  const config = resolve(directory, 'config')
  mkdirSync(config, { mode: 0o700 })
  writeFileSync(resolve(config, 'production.env'), 'TURSO_DATABASE_URL=libsql://production.example\nTURSO_AUTH_TOKEN=production-token\n', { mode: 0o600 })
  writeFileSync(resolve(config, 'staging.env'), 'TURSO_DATABASE_URL=libsql://staging.example\nTURSO_AUTH_TOKEN=staging-token\n', { mode: 0o600 })
  return { directory, config }
}
function runDeployment(config, environment, image, overrides = {}) {
  return spawnSync('/bin/bash', [resolve(repository, 'scripts/deploy.sh'), '--check', environment, image], {
    encoding: 'utf8', env: { ...process.env, MWAIBANDA_CONFIG_DIR: config, ...overrides },
  })
}
test('production and staging accept their own immutable branch images', context => {
  const { config } = fixture(context)
  assert.equal(runDeployment(config, 'production', productionImage).status, 0)
  assert.equal(runDeployment(config, 'staging', stagingImage).status, 0)
  assert.notEqual(runDeployment(config, 'production', stagingImage).status, 0)
  assert.notEqual(runDeployment(config, 'staging', productionImage).status, 0)
})
test('staging cannot use the production database', context => {
  const { config } = fixture(context)
  writeFileSync(resolve(config, 'staging.env'), 'TURSO_DATABASE_URL=libsql://production.example\nTURSO_AUTH_TOKEN=staging-token\n', { mode: 0o600 })
  const result = runDeployment(config, 'staging', stagingImage)
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /different Turso database/)
})
test('missing credentials and insecure file permissions fail preflight', context => {
  const { config } = fixture(context)
  writeFileSync(resolve(config, 'staging.env'), 'TURSO_DATABASE_URL=libsql://staging.example\nTURSO_AUTH_TOKEN=\n', { mode: 0o600 })
  assert.notEqual(runDeployment(config, 'staging', stagingImage).status, 0)
  const { chmodSync } = process.getBuiltinModule('node:fs')
  chmodSync(resolve(config, 'production.env'), 0o644)
  assert.notEqual(runDeployment(config, 'production', productionImage).status, 0)
})
test('restricted SSH rejects arbitrary commands before invoking deployment', () => {
  const result = spawnSync('/bin/bash', [resolve(repository, 'scripts/ssh-deploy.sh'), 'production'], {
    encoding: 'utf8', env: { ...process.env, SSH_ORIGINAL_COMMAND: 'deploy production image; touch /tmp/invalid' },
  })
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /Only deploy/)
})
test('a staging SSH key cannot deploy production', () => {
  const result = spawnSync('/bin/bash', [resolve(repository, 'scripts/ssh-deploy.sh'), 'staging'], {
    encoding: 'utf8', env: { ...process.env, SSH_ORIGINAL_COMMAND: `deploy production ${productionImage}` },
  })
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /cannot deploy another environment/)
})
test('server setup preserves secrets and can be rerun without the repository .env', context => {
  const { directory, config } = fixture(context)
  const temporaryRepository = resolve(directory, 'repository')
  mkdirSync(resolve(temporaryRepository, 'scripts'), { recursive: true })
  for (const filename of ['docker-compose.yaml', 'scripts/setup-home-server.mjs', 'scripts/deploy.sh', 'scripts/ssh-deploy.sh']) {
    copyFileSync(resolve(repository, filename), resolve(temporaryRepository, filename))
  }
  writeFileSync(resolve(temporaryRepository, '.env'), 'TURSO_DATABASE_URL=libsql://source.example\nTURSO_AUTH_TOKEN=source-token\nTUNNEL_TOKEN=tunnel-token\n')
  const hostKey = resolve(directory, 'host-key.pub')
  writeFileSync(hostKey, 'ssh-ed25519 AAAATESTHOSTKEY test-host\n')
  const sshDirectory = resolve(directory, 'ssh')
  const options = { encoding: 'utf8', env: { ...process.env, MWAIBANDA_CONFIG_DIR: config, MWAIBANDA_DEPLOY_DIR: resolve(directory, 'installed'), MWAIBANDA_SSH_DIR: sshDirectory, MWAIBANDA_HOST_KEY_FILE: hostKey } }
  const setup = resolve(temporaryRepository, 'scripts/setup-home-server.mjs')
  const originalProduction = readFileSync(resolve(config, 'production.env'), 'utf8')
  assert.equal(spawnSync(process.execPath, [setup], options).status, 0)
  assert.equal(readFileSync(resolve(config, 'production.env'), 'utf8'), originalProduction)
  assert.equal(parseEnv(readFileSync(resolve(config, 'tunnel.env'), 'utf8')).TUNNEL_TOKEN, 'tunnel-token')
  assert.equal(statSync(resolve(config, 'tunnel.env')).mode & 0o777, 0o600)
  assert.match(readFileSync(resolve(sshDirectory, 'authorized_keys'), 'utf8'), /restrict,command=.*production/)
  assert.equal(statSync(resolve(config, 'production-deploy.key')).mode & 0o777, 0o600)
  rmSync(resolve(temporaryRepository, '.env'))
  assert.equal(spawnSync(process.execPath, [setup], options).status, 0)
  assert.equal(readFileSync(resolve(sshDirectory, 'authorized_keys'), 'utf8').trim().split('\n').length, 2)
})
function fakeDeployment(context, failHealth = false, environment = 'staging', incorrectRevision = false) {
  const { directory, config } = fixture(context)
  const calls = resolve(directory, 'calls')
  const shell = resolve(directory, 'fake-tools.sh')
  writeFileSync(shell, `docker() {
    printf '%s | image=%s\\n' "$*" "\${PRODUCTION_IMAGE:-\${STAGING_IMAGE:-}}" >> "$CALLS"
    if [[ "$1" == compose && " $* " == *' up '* ]]; then CURRENT_SERVICE="$TARGET_SERVICE"; fi
    if [[ "$1" == inspect ]]; then
      case "$3" in
        '{{.Image}}') printf 'sha256:previous-image\\n' ;;
        *compose.service*) printf '%s\\n' "$CURRENT_SERVICE" ;;
        *compose.project*) printf 'mwaibandacom\\n' ;;
      esac
    fi
    return 0
  }
  curl() {
    if [[ "\${FAIL_HEALTH:-0}" == 1 ]]; then return 1; fi
    while [[ $# -gt 0 ]]; do
      if [[ "$1" == --dump-header ]]; then printf 'X-Release-Sha: %s\\r\\n' "$EXPECTED_SHA" > "$2"; break; fi
      shift
    done
  }
  `)
  const result = spawnSync('/bin/bash', [resolve(repository, 'scripts/deploy.sh'), environment, environment === 'staging' ? stagingImage : productionImage], {
    encoding: 'utf8', env: { ...process.env, PRODUCTION_IMAGE: '', STAGING_IMAGE: '', MWAIBANDA_CONFIG_DIR: config, BASH_ENV: shell, CALLS: calls, CURRENT_SERVICE: environment === 'staging' ? 'mwaibanda-staging' : 'web', TARGET_SERVICE: environment === 'staging' ? 'mwaibanda-staging' : 'mwaibanda-prod', EXPECTED_SHA: incorrectRevision ? 'b'.repeat(40) : commit, FAIL_HEALTH: failHealth ? '1' : '0' },
  })
  return { result, calls: readFileSync(calls, 'utf8'), config }
}
test('a staging deployment only starts staging and records its image', context => {
  const { result, calls, config } = fakeDeployment(context)
  assert.equal(result.status, 0, result.stderr)
  const updates = calls.split('\n').filter(line => line.includes(' up '))
  assert.equal(updates.length, 1)
  assert.match(updates[0], /--no-deps --no-build --pull never mwaibanda-staging/)
  assert.doesNotMatch(updates[0], /mwaibanda-prod|tunnel/)
  assert.equal(readFileSync(resolve(config, 'releases/staging.image'), 'utf8').trim(), stagingImage)
  assert.equal(existsSync(resolve(config, 'releases/staging.lock')), false)
})
test('failed health checks restore the prior staging image without touching production', context => {
  const { result, calls, config } = fakeDeployment(context, true)
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /restoring staging/)
  const updates = calls.split('\n').filter(line => line.includes(' up '))
  assert.equal(updates.length, 2)
  assert.match(updates[1], /image=sha256:previous-image/)
  assert.equal(existsSync(resolve(config, 'releases/staging.image')), false)
  assert.equal(existsSync(resolve(config, 'releases/staging.lock')), false)
})
test('a stale release header triggers rollback even when the API returns success', context => {
  const { result, calls } = fakeDeployment(context, false, 'staging', true)
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /does not match the expected release/)
  assert.match(calls, /image=sha256:previous-image/)
})
test('the first production deployment migrates only the legacy production container', context => {
  const { result, calls } = fakeDeployment(context, false, 'production')
  assert.equal(result.status, 0, result.stderr)
  assert.match(calls, /rename mwaibanda-io mwaibanda-io-legacy-/)
  assert.match(calls, /up -d --no-deps --no-build --pull never mwaibanda-prod/)
  assert.doesNotMatch(calls, /stop cloudflare-tunnel|up .*mwaibanda-staging/)
})
test('a failed legacy production migration restores the original container', context => {
  const { result, calls } = fakeDeployment(context, true, 'production')
  assert.notEqual(result.status, 0)
  assert.match(calls, /rm -f mwaibanda-io/)
  assert.match(calls, /rename mwaibanda-io-legacy-\d+ mwaibanda-io/)
  assert.match(calls, /start mwaibanda-io/)
})