export function buildPostsPagePath(page: number, categorySlug?: string | null): string {
  const basePath = page <= 1 ? '/posts' : `/posts/page/${page}`
  if (!categorySlug) return basePath

  const params = new URLSearchParams({ category: categorySlug })
  return `${basePath}?${params.toString()}`
}
