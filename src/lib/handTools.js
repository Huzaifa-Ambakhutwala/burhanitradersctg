import handToolsCategories from '../data/handToolsCategories.json'

export function getHandToolsCategories() {
  return handToolsCategories
}

export function getHandToolsCategoryIdForProduct(product) {
  const text = `${product?.name || ''} ${product?.description || ''}`.toLowerCase()

  for (const category of handToolsCategories) {
    if (!category.keywords || category.keywords.length === 0 || category.id === 'other-hand-tools') {
      continue
    }

    for (const keyword of category.keywords) {
      if (keyword && text.includes(keyword.toLowerCase())) {
        return category.id
      }
    }
  }

  return 'other-hand-tools'
}

export function getHandToolsProductsByCategoryId(products, categoryId) {
  return products.filter((product) => {
    if (product.categoryId !== 'hand-tools') return false
    const matchedCategoryId = getHandToolsCategoryIdForProduct(product)
    return matchedCategoryId === categoryId
  })
}

