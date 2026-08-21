const fs = require('node:fs')

const catalog = JSON.parse(fs.readFileSync('redesign/data/catalog.json', 'utf8'))
const portfolio = JSON.parse(fs.readFileSync('redesign/data/portfolio.json', 'utf8'))
const units = new Set(['шт', 'м²', 'м.п.', 'точка', 'услуга', 'компл.'])
const directions = new Set(['metall', 'otdelka'])

if (!Array.isArray(catalog) || !catalog.length) throw new Error('Catalog is empty')
if (!Array.isArray(portfolio) || !portfolio.length) throw new Error('Portfolio is empty')
for (const item of catalog) {
  if (!item.id || !item.name || !item.category || !item.price || !units.has(item.unit)) throw new Error(`Invalid catalog item: ${item.id}`)
  if (!directions.has(item.direction)) throw new Error(`Invalid catalog direction: ${item.id}`)
}
for (const item of portfolio) {
  if (!item.id || !item.title || !item.category || !directions.has(item.direction) || !item.images?.length) throw new Error(`Invalid portfolio item: ${item.id}`)
}
console.log(`Content valid: ${catalog.length} catalog items, ${portfolio.length} portfolio items`)
