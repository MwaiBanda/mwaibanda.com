import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync, chmodSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseEnv } from 'node:util'
import { spawnSync } from 'node:child_process'

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const config = process.env.MWAIBANDA_CONFIG_DIR || resolve(homedir(), '.config/mwaibanda')
const deployment = process.env.MWAIBANDA_DEPLOY_DIR || resolve(homedir(), '.local/share/mwaibanda/deployment')
const missingProduction = !existsSync(resolve(config, 'production.env'))
const missingTunnel = !existsSync(resolve(config, 'tunnel.env'))
const source = missingProduction || missingTunnel ? parseEnv(readFileSync(resolve(repository, '.env'), 'utf8')) : {}
const required = [...(missingProduction ? ['TURSO_DATABASE_URL', 'TURSO_AUTH_TOKEN'] : []), ...(missingTunnel ? ['TUNNEL_TOKEN'] : [])]
for (const name of required) {
  if (!source[name]) throw new Error(`Existing .env is missing ${name}`)
}
mkdirSync(config, { recursive: true, mode: 0o700 })
chmodSync(config, 0o700)
function createEnvironment(name, values) {
  const filename = resolve(config, name)
  if (!existsSync(filename)) {
    const content = Object.entries(values).map(([key, value]) => `${key}=${JSON.stringify(value)}`).join('\n') + '\n'
    writeFileSync(filename, content, { mode: 0o600, flag: 'wx' })
  }
  chmodSync(filename, 0o600)
}
createEnvironment('production.env', {
  TURSO_DATABASE_URL: source.TURSO_DATABASE_URL,
  TURSO_AUTH_TOKEN: source.TURSO_AUTH_TOKEN,
  ENV: 'PROD',
  PORT: '8080',
})
createEnvironment('staging.env', {
  TURSO_DATABASE_URL: '',
  TURSO_AUTH_TOKEN: '',
  ENV: 'STAGING',
  PORT: '8080',
})
createEnvironment('tunnel.env', { TUNNEL_TOKEN: source.TUNNEL_TOKEN })
mkdirSync(resolve(deployment, 'scripts'), { recursive: true, mode: 0o700 })
for (const filename of ['docker-compose.yaml', 'scripts/deploy.sh', 'scripts/ssh-deploy.sh']) {
  copyFileSync(resolve(repository, filename), resolve(deployment, filename))
  chmodSync(resolve(deployment, filename), filename.endsWith('.sh') ? 0o700 : 0o600)
}
const sshDirectory = process.env.MWAIBANDA_SSH_DIR || resolve(homedir(), '.ssh')
mkdirSync(sshDirectory, { recursive: true, mode: 0o700 })
chmodSync(sshDirectory, 0o700)
const authorizedKeys = resolve(sshDirectory, 'authorized_keys')
let entries = existsSync(authorizedKeys) ? readFileSync(authorizedKeys, 'utf8').split('\n').filter(Boolean) : []
for (const environment of ['production', 'staging']) {
  const privateKey = resolve(config, `${environment}-deploy.key`)
  if (!existsSync(privateKey)) {
    const generated = spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-C', `mwaibanda-${environment}-deploy`, '-f', privateKey], { encoding: 'utf8' })
    if (generated.status !== 0) throw new Error('Could not generate a deployment SSH key')
  }
  chmodSync(privateKey, 0o600)
  const publicKey = readFileSync(`${privateKey}.pub`, 'utf8').trim()
  const identity = publicKey.split(' ')[1]
  const command = `/bin/bash "${resolve(deployment, 'scripts/ssh-deploy.sh')}" ${environment}`
  entries = entries.filter(entry => !entry.split(' ').includes(identity))
  entries.push(`restrict,command=${JSON.stringify(command)} ${publicKey}`)
}
writeFileSync(authorizedKeys, entries.join('\n') + '\n', { mode: 0o600 })
chmodSync(authorizedKeys, 0o600)
const host = process.env.MWAIBANDA_DEPLOY_HOST || 'mwais-macbook.tail27a672.ts.net'
if (!/^[a-z0-9.-]+$/i.test(host)) throw new Error('Invalid deployment hostname')
const hostKeyFile = process.env.MWAIBANDA_HOST_KEY_FILE || '/etc/ssh/ssh_host_ed25519_key.pub'
const hostKey = readFileSync(hostKeyFile, 'utf8').trim().split(' ').slice(0, 2).join(' ')
writeFileSync(resolve(config, 'deploy-known-hosts'), `${host} ${hostKey}\n`, { mode: 0o600 })
chmodSync(resolve(config, 'deploy-known-hosts'), 0o600)
console.log(`Server configuration: ${config}`)
console.log(`Deployment scripts: ${deployment}`)
console.log('Existing environment files were preserved. Configure staging.env with a separate Turso database before deploying staging.')
console.log('No running container was changed. Re-run setup after changing deployment scripts or Compose configuration.')
console.log('Environment-restricted SSH keys and a pinned host key are installed. Upload each private key only to its matching GitHub environment secret.')