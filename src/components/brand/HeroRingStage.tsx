import Image from 'next/image'
import React from 'react'

import { cn } from '@/utilities/ui'

type HeroRingStageProps = {
  className?: string
}

/** Vertical hero layout uses viewport width; horizontal layout uses fixed px (see HighImpactHero). */
const HERO_ILLUSTRATION_SIZES = '(max-width: 1023px) 75vw, 1058px'

/** Hero illustration on the home page. */
export const HeroRingStage: React.FC<HeroRingStageProps> = ({ className }) => {
  return (
    <div className={cn('relative aspect-71/48 w-full', className)}>
      <Image
        alt="胰臟插畫"
        className="object-contain object-center"
        fill
        priority
        sizes={HERO_ILLUSTRATION_SIZES}
        src="/elegant-pancreas.PNG"
      />
    </div>
  )
}
