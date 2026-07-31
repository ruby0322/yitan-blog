import type { Media } from '@/payload-types'

export const imageBookFlatMeta: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: '《胰探究竟》書籍平放封面',
}

export const imageBook3dMeta: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: '《胰探究竟》書籍 3D 封面',
}
