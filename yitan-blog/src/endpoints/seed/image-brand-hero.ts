import type { Media } from '@/payload-types'

export const imageBrandHero: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: '醫療照護與健康守護的意象照片',
}
