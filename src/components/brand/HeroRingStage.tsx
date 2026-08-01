import Image from 'next/image'
import React from 'react'

import { cn } from '@/utilities/ui'

type HeroRingStageProps = {
  animated?: boolean
  className?: string
}

/** Hero organ visual — client trial: pancreas vector PNG. */
export const HeroRingStage: React.FC<HeroRingStageProps> = ({ animated = true, className }) => {
  return (
    <div className={cn('relative aspect-[3/2] w-full overflow-visible', className)}>
      <Image
        alt=""
        aria-hidden
        className={cn('size-full object-contain', animated && 'organ-ring-mark--animated')}
        height={1024}
        priority
        src="/vector-pancreas.png"
        width={1536}
      />
    </div>
  )
}
