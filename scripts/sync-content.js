/* Build-time content sync for the isolated redesign.
 * Usage:
 *   CRM_SYNC_TOKEN=... node scripts/sync-content.js
 *   node scripts/sync-content.js --local
 *
 * The script never runs during a browser visit and never deploys files.
 */
const fs = require('node:fs/promises')
const path = require('node:path')

const ROOT = path.resolve(__dirname, '..')
const REDESIGN_DATA = path.join(ROOT, 'redesign', 'data')
const API_BASE = process.env.CRM_API_BASE || 'https://d5d01eb689qn07cv0ocu.sax5b7yq.apigw.yandexcloud.net/api'
const token = process.env.CRM_SYNC_TOKEN
const localOnly = process.argv.includes('--local')

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'))
}

async function fetchResource(resource) {
  if (localOnly) return readJson(path.join(REDESIGN_DATA, `${resource}.json`))
  if (!token) throw new Error('CRM_SYNC_TOKEN is required for remote sync. Use --local for a local validation run.')
  const response = await fetch(`${API_BASE}/${resource}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  })
  if (!response.ok) throw new Error(`${resource} API returned ${response.status}`)
  return response.json()
}

function normalizeCatalog(items) {
  if (!Array.isArray(items)) throw new Error('Catalog response must be an array')
  return items.map((item) => ({
    id: String(item.id),
    name: String(item.name || '').trim(),
    category: String(item.category || 'Прочее').trim(),
    price: String(item.price || '').trim(),
    unit: String(item.unit || 'шт').trim(),
    description: String(item.description || '').trim(),
    direction: item.direction === 'otdelka' ? 'otdelka' : 'metall',
  })).filter((item) => item.name && item.price)
}

function normalizePortfolio(items) {
  if (!Array.isArray(items)) throw new Error('Portfolio response must be an array')
  return items.map((item) => ({
    id: String(item.id),
    title: String(item.title || item.name || '').trim(),
    category: String(item.category || 'Прочее').trim(),
    direction: item.direction === 'otdelka' ? 'otdelka' : 'metall',
    description: String(item.description || '').trim(),
    images: (Array.isArray(item.images) ? item.images : item.image ? [item.image] : []).filter(Boolean).slice(0, 10),
    date: item.date || '',
    featured: Boolean(item.featured),
  })).filter((item) => item.title && item.images.length)
}

async function writeJson(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

async function main() {
  const catalog = normalizeCatalog(await fetchResource('catalog'))
  const portfolio = normalizePortfolio(await fetchResource('portfolio'))
  await writeJson(path.join(REDESIGN_DATA, 'catalog.json'), catalog)
  await writeJson(path.join(REDESIGN_DATA, 'portfolio.json'), portfolio)
  console.log(`Catalog synced: ${catalog.length} items`)
  console.log(`Portfolio synced: ${portfolio.length} projects`)
  console.log('No deployment performed.')
}

main().catch((error) => {
  console.error(`Sync failed: ${error.message}`)
  process.exitCode = 1
})
