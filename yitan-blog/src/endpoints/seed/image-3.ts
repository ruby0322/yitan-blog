import type { Media } from '@/payload-types'

export const image3: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: '規律運動與健康生活方式',
}

export const image4: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: '胰臟炎相關醫療照護情境',
}

export const image5: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: '均衡飲食與健康餐盤',
}

export const image6: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: '醫療檢查與健康追蹤',
}

export const imageInlineDiet: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: '富含蔬菜與優質蛋白的均衡餐點',
}
