/**
 * @param {Array} products
 * @param {Array<{ id: string, name: string, slug: string, sortOrder?: number }>} categoriesOrdered
 */
export function groupProductsByCategory(products, categoriesOrdered) {
  const orderMap = Object.fromEntries(
    categoriesOrdered.map((c, i) => [c.id, c.sortOrder ?? i])
  )
  const slugById = Object.fromEntries(categoriesOrdered.map((c) => [c.id, c.slug]))

  const map = new Map()
  for (const p of products) {
    const id = p.categoryId || '_other'
    const name = p.categoryName || 'Uncategorized'
    if (!map.has(id)) {
      map.set(id, {
        categoryId: id,
        categoryName: name,
        slug: slugById[id] || null,
        products: [],
      })
    }
    map.get(id).products.push(p)
  }
  const groups = Array.from(map.values())
  groups.sort((a, b) => {
    const ia = orderMap[a.categoryId] ?? 9999
    const ib = orderMap[b.categoryId] ?? 9999
    if (ia !== ib) return ia - ib
    return a.categoryName.localeCompare(b.categoryName)
  })
  for (const g of groups) {
    g.products.sort((x, y) =>
      (x.name || '').localeCompare(y.name || '', undefined, { sensitivity: 'base' })
    )
  }
  return groups
}
