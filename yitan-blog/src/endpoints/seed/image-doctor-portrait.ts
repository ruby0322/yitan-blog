import type { Media } from '@/payload-types'

export const imageDoctorPortraitMeta: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: '章醫師專業形象照',
}
