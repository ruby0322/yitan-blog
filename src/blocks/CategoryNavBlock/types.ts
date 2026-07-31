export type CategoryTopicPostPreview = {
  publishedAt?: string | null
  slug: string
  title: string
}

export type CategoryTopicSlide = {
  description: string
  href: string
  posts: CategoryTopicPostPreview[]
  title: string
}
