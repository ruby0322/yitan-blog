import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import type { File } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
