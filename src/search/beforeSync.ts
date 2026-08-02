import { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'

import { sortCategoriesByOrder } from '@/utilities/categoryOrder'

type PopulatedSearchCategory = {
  id: string | number
  sortOrder?: number | null
  title: string
}

export const beforeSyncWithSearch: BeforeSync = async ({ req, originalDoc, searchDoc }) => {
  const {
    doc: { relationTo: collection },
  } = searchDoc

  const { slug, id, categories, title, meta } = originalDoc

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    slug,
    meta: {
      ...meta,
      title: meta?.title || title,
      image: meta?.image?.id || meta?.image,
      description: meta?.description,
    },
    categories: [],
  }

  if (categories && Array.isArray(categories) && categories.length > 0) {
    const populatedCategories: PopulatedSearchCategory[] = []

    for (const category of categories) {
      if (!category) {
        continue
      }

      if (typeof category === 'object') {
        populatedCategories.push({
          id: category.id,
          sortOrder: 'sortOrder' in category ? category.sortOrder : null,
          title: category.title,
        })
        continue
      }

      const doc = await req.payload.findByID({
        collection: 'categories',
        id: category,
        disableErrors: true,
        depth: 0,
        select: { title: true, sortOrder: true },
        req,
      })

      if (doc !== null) {
        populatedCategories.push({
          id: doc.id,
          sortOrder: doc.sortOrder,
          title: doc.title,
        })
      } else {
        console.error(
          `Failed. Category not found when syncing collection '${collection}' with id: '${id}' to search.`,
        )
      }
    }

    modifiedDoc.categories = sortCategoriesByOrder(populatedCategories).map((each) => ({
      relationTo: 'categories',
      categoryID: String(each.id),
      title: each.title,
      sortOrder: each.sortOrder,
    }))
  }

  return modifiedDoc
}
