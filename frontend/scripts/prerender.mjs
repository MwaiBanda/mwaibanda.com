import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { gzipSync } from 'node:zlib'
import { build } from 'vite'
import react from '@vitejs/plugin-react'
import { parse, parseFragment, serialize } from 'parse5'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const output = resolve(root, 'dist')
const renderer = resolve(root, 'node_modules/.prerender')
await build({
  root,
  configFile: false,
  plugins: [react()],
  ssr: { noExternal: true, external: ['react', 'react/jsx-runtime', 'react-dom/server'] },
  build: { ssr: 'src/prerender.tsx', outDir: renderer, emptyOutDir: true, rollupOptions: { output: { entryFileNames: 'entry.mjs' } } },
})
const { parseArticlesResponse, parseWorkResponse, articlePath, siteOrigin, renderArticle, renderMetadata, renderHome, renderSitemap } = await import(pathToFileURL(resolve(renderer, 'entry.mjs')).href)
const apiOrigin = new URL(process.env.CONTENT_API_URL || siteOrigin)
if (!['http:', 'https:'].includes(apiOrigin.protocol)) throw new Error('CONTENT_API_URL must use HTTP or HTTPS')

async function fetchContent(path) {
  const response = await fetch(new URL(path, apiOrigin), { signal: AbortSignal.timeout(15000) })
  if (!response.ok) throw new Error(`Content API returned ${response.status} for ${path}`)
  return response.json()
}

const [rawArticles, rawWork] = await Promise.all([fetchContent('/api/v1/articles'), fetchContent('/api/v1/work')])
const articles = parseArticlesResponse(rawArticles)
const work = parseWorkResponse(rawWork)
const template = await readFile(resolve(output, 'index.html'), 'utf8')
const assets = JSON.parse(await readFile(resolve(output, '.vite/manifest.json'), 'utf8'))
async function checkBudget(asset, limit) {
  if (!asset) throw new Error('Missing bundle entry')
  const bytes = gzipSync(await readFile(resolve(output, asset.file))).byteLength
  if (bytes > limit) throw new Error(`${asset.file}: ${bytes} gzipped bytes exceeds budget ${limit}`)
  console.log(`${asset.file}: ${bytes} gzipped bytes (budget ${limit})`)
}
await checkBudget(Object.values(assets).find(asset => asset.isEntry), 190000)
await checkBudget(assets['src/interfaces/presentation/pages/blog/blog.tsx'], 150000)
const blogStyles = assets['src/interfaces/presentation/pages/blog/blog.tsx']?.css
if (!blogStyles?.length) throw new Error('Blog stylesheet missing from build manifest')
const snapshot = JSON.stringify({ articles: rawArticles, work: rawWork }).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026')

function find(node, predicate) {
  if (predicate(node)) return node
  for (const child of node.childNodes || []) {
    const match = find(child, predicate)
    if (match) return match
  }
}

function append(parent, html) {
  for (const child of parseFragment(html).childNodes) {
    child.parentNode = parent
    parent.childNodes.push(child)
  }
}

function documentFor(markup, metadata, articlePage = false) {
  const document = parse(template)
  const head = find(document, node => node.tagName === 'head')
  const body = find(document, node => node.tagName === 'body')
  const container = find(document, node => node.attrs?.some(attribute => attribute.name === 'id' && attribute.value === 'root'))
  if (!head || !body || !container) throw new Error('Invalid application HTML template')
  container.childNodes = []
  append(container, markup)
  if (metadata) {
    head.childNodes = head.childNodes.filter(node => node.tagName !== 'title' && !node.attrs?.some(attribute =>
      (attribute.name === 'name' && (attribute.value === 'description' || attribute.value.startsWith('twitter:'))) ||
      (attribute.name === 'property' && attribute.value.startsWith('og:')) ||
      (node.tagName === 'link' && attribute.name === 'rel' && attribute.value === 'canonical')))
    append(head, metadata)
  }
  if (articlePage) for (const file of blogStyles) append(head, `<link rel="stylesheet" href="/${file}">`)
  append(body, `<script type="application/json" id="prerender-content">${snapshot}</script>`)
  return serialize(document)
}

const manifest = []
const names = new Set()
for (const article of articles) {
  const name = article.name.toLowerCase()
  if (names.has(name)) throw new Error(`Duplicate article URL: ${name}`)
  names.add(name)
  const path = articlePath(article.name)
  const file = `${path.slice(1)}/index.html`
  await mkdir(dirname(resolve(output, file)), { recursive: true })
  await writeFile(resolve(output, file), documentFor(renderArticle(article), renderMetadata(article), true))
  manifest.push({ name, path, file })
}
await writeFile(resolve(output, 'index.html'), documentFor(renderHome(articles, work)))
await writeFile(resolve(output, '404.html'), documentFor('<main class="mx-auto max-w-[680px] px-6 py-12"><h1>Page not found</h1><a href="/">Back to home</a></main>', '<title>Page not found | Mwai Banda</title><meta name="robots" content="noindex">'))
await writeFile(resolve(output, 'prerender-manifest.json'), JSON.stringify(manifest, null, 2))
await writeFile(resolve(output, 'sitemap.xml'), renderSitemap([siteOrigin + '/', ...manifest.map(page => siteOrigin + page.path)]))
await writeFile(resolve(output, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\nSitemap: ${siteOrigin}/sitemap.xml\n`)
console.log(`Prerendered home and ${manifest.length} articles from ${apiOrigin.origin}`)