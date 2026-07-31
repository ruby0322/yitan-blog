import { del, list } from '@vercel/blob'
import type { Payload, PayloadRequest } from 'payload'

export async function clearMediaCollection({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> {
  while (true) {
    const result = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 100,
      page: 1,
      req,
    })

    if (result.docs.length === 0) {
      break
    }

    for (const doc of result.docs) {
      await payload.delete({
        collection: 'media',
        id: doc.id,
        req,
      })
    }
  }
}

export async function clearOrphanedVercelBlobs(token: string): Promise<void> {
  let cursor: string | undefined

  do {
    const result = await list({
      cursor,
      limit: 1000,
      token,
    })

    if (result.blobs.length > 0) {
      await del(
        result.blobs.map((blob) => blob.url),
        { token },
      )
    }

    cursor = result.hasMore ? result.cursor : undefined
  } while (cursor)
}
