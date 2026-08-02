export type CategoryOrderFields = {
  sortOrder?: number | null
  title?: string | null
}

export function sortCategoriesByOrder<T extends CategoryOrderFields>(categories: T[]): T[] {
  return [...categories].sort((a, b) => {
    const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER
    const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER

    if (aOrder !== bOrder) {
      return aOrder - bOrder
    }

    return (a.title ?? '').localeCompare(b.title ?? '', 'zh-Hant')
  })
}

export function formatCategoryTitles<T extends CategoryOrderFields>(
  categories: T[],
  separator = '、',
): string {
  return sortCategoriesByOrder(categories)
    .map((category) => category.title)
    .filter((title): title is string => Boolean(title))
    .join(separator)
}

export function getPopulatedCategories<T extends CategoryOrderFields>(
  categories: Array<T | number | null | undefined> | null | undefined,
): T[] {
  if (!categories || !Array.isArray(categories)) {
    return []
  }

  return categories.filter(
    (category): category is T => typeof category === 'object' && category !== null,
  )
}
