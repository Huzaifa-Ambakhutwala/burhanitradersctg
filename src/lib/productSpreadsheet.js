import { slugify } from './slugify'

/** Column keys used in export / import (row objects). */
export const PRODUCT_COLUMNS = [
  'productCode',
  'name',
  'slug',
  'categoryId',
  'categorySlug',
  'categoryName',
  'brand',
  'description',
  'price',
  'showPrice',
  'featured',
  'topSeller',
  'new',
]

function normalizeHeaderKey(h) {
  const s = String(h ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, '')
  const map = {
    productcode: 'productCode',
    code: 'productCode',
    sku: 'productCode',
    name: 'name',
    slug: 'slug',
    urlslug: 'slug',
    categoryid: 'categoryId',
    categoryslug: 'categorySlug',
    categoryname: 'categoryName',
    brand: 'brand',
    description: 'description',
    desc: 'description',
    details: 'description',
    price: 'price',
    showprice: 'showPrice',
    featured: 'featured',
    topseller: 'topSeller',
    topsellers: 'topSeller',
    new: 'new',
    isnew: 'new',
    newproduct: 'new',
  }
  return map[s] || null
}

export function normalizeImportRow(raw) {
  const out = {}
  for (const [k, v] of Object.entries(raw)) {
    const nk = normalizeHeaderKey(k)
    if (!nk) continue
    let val = v
    if (val != null && typeof val === 'number' && nk === 'price') {
      val = val
    } else if (val != null && typeof val !== 'string' && nk !== 'price') {
      val = String(val)
    }
    if (typeof val === 'string') val = val.trim()
    out[nk] = val
  }
  return out
}

export function parseBoolCell(v) {
  if (v === true || v === 1) return true
  if (v === false || v === 0) return false
  if (v == null || v === '') return false
  const s = String(v).trim().toLowerCase()
  return s === 'true' || s === 'yes' || s === 'y' || s === '1'
}

export function parsePriceCell(v) {
  if (v === '' || v == null) return null
  if (typeof v === 'number') {
    return Number.isFinite(v) ? v : NaN
  }
  const s = String(v).replace(/,/g, '').trim()
  if (s === '') return null
  const n = Number(s)
  return Number.isNaN(n) ? NaN : n
}

function productRowForExport(p, catById) {
  const cat = p.categoryId ? catById.get(p.categoryId) : null
  const bool = (x) => (x ? 'yes' : 'no')
  return {
    productCode: p.id,
    name: p.name || '',
    slug: p.slug || '',
    categoryId: p.categoryId || '',
    categorySlug: cat?.slug || p.categorySlug || '',
    categoryName: cat?.name || p.categoryName || '',
    brand: p.brand || '',
    description: p.description || '',
    price: p.price != null && p.price !== '' ? p.price : '',
    showPrice: bool(p.showPrice),
    featured: bool(p.featured),
    topSeller: bool(p.topSeller),
    new: bool(p.new),
  }
}

export function buildExportRows(products, categories) {
  const catById = new Map(categories.map((c) => [c.id, c]))
  return products.map((p) => productRowForExport(p, catById))
}

export function buildCategoryReferenceRows(categories) {
  return categories.map((c) => ({
    categoryId: c.id,
    name: c.name,
    slug: c.slug || '',
  }))
}

/**
 * @param {import('xlsx')} XLSX
 */
export function writeProductsWorkbook(XLSX, products, categories) {
  const productRows = buildExportRows(products, categories)
  const emptyTemplate = Object.fromEntries(PRODUCT_COLUMNS.map((k) => [k, '']))
  const sheetData = productRows.length ? productRows : [emptyTemplate]

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(sheetData, { header: PRODUCT_COLUMNS })
  XLSX.utils.book_append_sheet(wb, ws, 'Products')

  const catRows = buildCategoryReferenceRows(categories)
  const catEmpty = { categoryId: '', name: '', slug: '' }
  const ws2 = XLSX.utils.json_to_sheet(catRows.length ? catRows : [catEmpty], {
    header: ['categoryId', 'name', 'slug'],
  })
  XLSX.utils.book_append_sheet(wb, ws2, 'Categories')

  return wb
}

/**
 * @param {import('xlsx')} XLSX
 * @param {ArrayBuffer} data
 */
export function readWorkbookFirstSheetJson(XLSX, data) {
  const wb = XLSX.read(data, { type: 'array' })
  const name = wb.SheetNames.includes('Products') ? 'Products' : wb.SheetNames[0]
  if (!name) return { rows: [], sheetName: null }
  const sheet = wb.Sheets[name]
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: true })
  return { rows, sheetName: name }
}

function isBlankRow(r) {
  const code = String(r.productCode ?? '').trim()
  const name = String(r.name ?? '').trim()
  return !code && !name
}

function resolveCategory(row, categories) {
  const byId = new Map(categories.map((c) => [c.id, c]))
  const bySlug = new Map(
    categories.filter((c) => c.slug).map((c) => [String(c.slug).trim().toLowerCase(), c])
  )
  const byName = new Map(
    categories.map((c) => [String(c.name || '').trim().toLowerCase(), c])
  )

  const id = String(row.categoryId ?? '').trim()
  if (id && byId.has(id)) return byId.get(id)

  const slug = String(row.categorySlug ?? '').trim().toLowerCase()
  if (slug && bySlug.has(slug)) return bySlug.get(slug)

  const cn = String(row.categoryName ?? '').trim().toLowerCase()
  if (cn && byName.has(cn)) return byName.get(cn)

  return null
}

const ID_RE = /^[a-zA-Z0-9_-]{1,80}$/

/**
 * @returns {{ items: Array<{ line: number, docId: string, payload: object }>, errors: Array<{ line: number, message: string }> }}
 */
export function buildBulkImportPlan(rawRows, categories, existingProducts) {
  const existingIds = new Set(existingProducts.map((p) => p.id))
  const existingSlugs = new Set(existingProducts.map((p) => p.slug).filter(Boolean))
  const batchSlugs = new Set()
  const batchIds = new Set()

  const items = []
  const errors = []

  rawRows.forEach((raw, i) => {
    const line = i + 2
    const row = normalizeImportRow(raw)
    if (isBlankRow(row)) return

    const docId = String(row.productCode ?? '').trim().replace(/\s+/g, '-')
    const name = String(row.name ?? '').trim()

    if (!docId) {
      errors.push({ line, message: 'Missing product code.' })
      return
    }
    if (!name) {
      errors.push({ line, message: 'Missing name.' })
      return
    }
    if (!ID_RE.test(docId)) {
      errors.push({
        line,
        message: 'Invalid product code: use letters, numbers, dashes or underscores (max 80).',
      })
      return
    }
    if (docId.toLowerCase() === 'new') {
      errors.push({ line, message: 'Product code cannot be "new" (reserved).' })
      return
    }
    if (existingIds.has(docId)) {
      errors.push({ line, message: `Product code "${docId}" already exists — remove this row or use a new code.` })
      return
    }
    if (batchIds.has(docId)) {
      errors.push({ line, message: `Duplicate product code "${docId}" in this file.` })
      return
    }

    const cat = resolveCategory(row, categories)
    if (!cat) {
      errors.push({
        line,
        message: 'Unknown category: set categoryId, categorySlug, or categoryName (see Categories sheet).',
      })
      return
    }

    let slug = String(row.slug ?? '').trim()
    if (!slug) slug = slugify(name)
    else slug = slugify(slug)
    if (!slug) {
      errors.push({ line, message: 'Could not derive URL slug from name.' })
      return
    }

    if (existingSlugs.has(slug) || batchSlugs.has(slug)) {
      errors.push({
        line,
        message: `URL slug "${slug}" is already used — change name/slug.`,
      })
      return
    }

    const priceNum = parsePriceCell(row.price)
    if (row.price !== '' && row.price != null && String(row.price).trim() !== '' && Number.isNaN(priceNum)) {
      errors.push({ line, message: 'Invalid price (use a number).' })
      return
    }

    batchSlugs.add(slug)
    batchIds.add(docId)

    const payload = {
      name,
      slug,
      categoryId: cat.id,
      categoryName: cat.name || '',
      categorySlug: cat.slug || '',
      brand: String(row.brand ?? '').trim(),
      description: String(row.description ?? '').trim(),
      price: priceNum,
      showPrice: parseBoolCell(row.showPrice),
      featured: parseBoolCell(row.featured),
      topSeller: parseBoolCell(row.topSeller),
      new: parseBoolCell(row.new),
      image: null,
    }

    items.push({ line, docId, payload })
  })

  return { items, errors }
}
