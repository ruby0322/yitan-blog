import type { Media } from '@/payload-types'

export const image1: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: '醫學檢驗與胰臟相關知識示意圖',
}
