const port = process.argv[2]
if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
  throw new Error('A valid local API port is required')
}

async function get(path) {
  const response = await fetch(`http://127.0.0.1:${port}${path}`, { signal: AbortSignal.timeout(15000) })
  if (!response.ok) throw new Error(`Content API returned ${response.status} for ${path}`)
  return response.json()
}

const [articles, work] = await Promise.all([get('/api/v1/articles'), get('/api/v1/work')])
process.stdout.write(JSON.stringify({ articles, work }))
