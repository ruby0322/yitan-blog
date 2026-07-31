import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import type { File } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function fileFromBuffer(relativePath: string, data: Buffer): File {
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

/** Read committed assets from public/seed-media (e.g. book cover JPGs). */
export async function fetchLocalSeedFile(relativePath: string): Promise<File> {
  const absolutePath = path.resolve(dirname, '../../../public/seed-media', relativePath)
  const data = await readFile(absolutePath)
  return fileFromBuffer(relativePath, data)
}

export async function fetchMaterialsFile(folder: string, relativePath: string): Promise<File> {
  const absolutePath = path.resolve(dirname, '../../../materials/posts', folder, relativePath)
  const data = await readFile(absolutePath)
  const safeName = `${folder}-${relativePath}`.replace(/[^\w.-]+/g, '-')
  return fileFromBuffer(safeName, data)
}
