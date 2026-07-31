import type { Config } from '@/payload-types'

import configPromise from '@payload-config'
import { type DataFromGlobalSlug, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(slug: T, depth = 0): Promise<DataFromGlobalSlug<T>> {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
  })

  return global
}

/**
 * Returns a cached global fetcher. In development, always reads fresh data so
 * CLI seed updates are visible without restarting the dev server.
 */
export const getCachedGlobal = <T extends Global>(slug: T, depth = 0) => {
  if (process.env.NODE_ENV === 'development') {
    return () => getGlobal<T>(slug, depth)
  }

  return unstable_cache(async () => getGlobal<T>(slug, depth), [slug, String(depth)], {
    tags: [`global_${slug}`],
  })
}
