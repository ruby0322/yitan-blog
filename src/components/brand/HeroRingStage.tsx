import React from 'react'

import { cn } from '@/utilities/ui'

import { OrganRingMark } from './OrganRingMark'

type HeroRingStageProps = {
  animated?: boolean
  className?: string
}

/** Hero organ ring visual. */
export const HeroRingStage: React.FC<HeroRingStageProps> = ({ animated = true, className }) => {
  return (
    <div className={cn('relative aspect-square w-full overflow-visible', className)}>
      <OrganRingMark animated={animated} className="size-full" />
    </div>
  )
}
