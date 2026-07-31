type BuildPostsPagePathArgs = {
  categorySlug?: string | null
  page?: number
  q?: string | null
}

export function buildPostsPagePath({
  categorySlug,
  page = 1,
  q,
}: BuildPostsPagePathArgs): string {
  const basePath = page <= 1 ? '/posts' : `/posts/page/${page}`
  const params = new URLSearchParams()

  if (categorySlug) {
    params.set('category', categorySlug)
  }

  if (q?.trim()) {
    params.set('q', q.trim())
  }

  const queryString = params.toString()
  return queryString ? `${basePath}?${queryString}` : basePath
}
