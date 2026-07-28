import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import type { File } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const STOCK_IMAGE_URLS = {
  post1: 'https://images.unsplash.com/photo-1532187863486-abf9db3751a8?w=1200&q=80&auto=format&fit=crop',
  post2: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80&auto=format&fit=crop',
  post3: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80&auto=format&fit=crop',
  post4: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80&auto=format&fit=crop',
  post5: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80&auto=format&fit=crop',
  post6: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=80&auto=format&fit=crop',
  inlineDiet: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80&auto=format&fit=crop',
} as const

export async function fetchLocalSeedFile(relativePath: string): Promise<File> {
  const absolutePath = path.resolve(dirname, '../../../public/seed-media', relativePath)
  const data = await readFile(absolutePath)
  const uniqueName = relativePath.replace(/\//g, '-')

  return {
    name: uniqueName,
    data,
    mimetype: 'image/webp',
    size: data.byteLength,
  }
}

export async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()
  const extension = url.includes('format=webp') ? 'webp' : 'jpg'

  return {
    name: url.split('/').pop()?.split('?')[0] || `file-${Date.now()}.${extension}`,
    data: Buffer.from(data),
    mimetype: `image/${extension}`,
    size: data.byteLength,
  }
}
