import { revalidateTag } from 'next/cache'

const GLOBAL_TAGS = ['global_header', 'global_footer'] as const

/** Invalidate cached header/footer globals after seed or bulk CMS updates. */
export function revalidateGlobals(): void {
  for (const tag of GLOBAL_TAGS) {
    revalidateTag(tag, 'max')
  }
}
