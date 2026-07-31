import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import type { File } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export async function fetchLocalSeedFile(relativePath: string): Promise<File> {
  const absolutePath = path.resolve(dirname, '../../../public/seed-media', relativePath)
  const data = await readFile(absolutePath)
  const uniqueName = relativePath.replace(/\//g, '-')
  const extension = path.extname(relativePath).toLowerCase()
  const mimetype =
    extension === '.jpg' || extension === '.jpeg'
      ? 'image/jpeg'
      : extension === '.png'
        ? 'image/png'
        : 'image/webp'

  return {
    name: uniqueName,
    data,
    mimetype,
    size: data.byteLength,
  }
}

export async function fetchMaterialsFile(folder: string, relativePath: string): Promise<File> {
  const absolutePath = path.resolve(dirname, '../../../materials/posts', folder, relativePath)
  const data = await readFile(absolutePath)
  const safeName = `${folder}-${relativePath}`.replace(/[^\w.-]+/g, '-')
  const extension = path.extname(relativePath).toLowerCase()
  const mimetype =
    extension === '.jpg' || extension === '.jpeg'
      ? 'image/jpeg'
      : extension === '.png'
        ? 'image/png'
        : 'image/webp'

  return {
    name: safeName,
    data,
    mimetype,
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
