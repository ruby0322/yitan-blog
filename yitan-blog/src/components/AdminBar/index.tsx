'use client'

import type { PayloadAdminBarProps, PayloadMeUser } from '@payloadcms/admin-bar'

import { useSelectedLayoutSegments } from 'next/navigation'
import { PayloadAdminBar } from '@payloadcms/admin-bar'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import './index.css'

import { getClientSideURL } from '@/utilities/getURL'

const collectionLabels = {
  pages: {
    plural: 'Pages',
    singular: 'Page',
  },
  posts: {
    plural: 'Posts',
    singular: 'Post',
  },
  projects: {
    plural: 'Projects',
    singular: 'Project',
  },
}

const Title: React.FC = () => <span>Dashboard</span>

export const AdminBar: React.FC<{
  adminBarProps?: PayloadAdminBarProps
}> = (props) => {
  const { adminBarProps } = props || {}
  const segments = useSelectedLayoutSegments()
  const [show, setShow] = useState(false)
  const collection = (
    collectionLabels[segments?.[1] as keyof typeof collectionLabels] ? segments[1] : 'pages'
  ) as keyof typeof collectionLabels
  const router = useRouter()

  const onAuthChange = React.useCallback((user: PayloadMeUser) => {
    setShow(Boolean(user?.id))
  }, [])

  useEffect(() => {
    document.body.classList.toggle('admin-bar-visible', show)

    if (!show) {
      document.body.style.removeProperty('--admin-bar-height')
      return () => {
        document.body.classList.remove('admin-bar-visible')
      }
    }

    const syncAdminBarHeight = () => {
      const bar = document.getElementById('payload-admin-bar')
      if (bar) {
        document.body.style.setProperty('--admin-bar-height', `${bar.offsetHeight}px`)
      }
    }

    syncAdminBarHeight()
    const frame = requestAnimationFrame(syncAdminBarHeight)

    const bar = document.getElementById('payload-admin-bar')
    const resizeObserver = bar ? new ResizeObserver(syncAdminBarHeight) : null
    resizeObserver?.observe(bar!)

    window.addEventListener('resize', syncAdminBarHeight)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      window.removeEventListener('resize', syncAdminBarHeight)
      document.body.classList.remove('admin-bar-visible')
      document.body.style.removeProperty('--admin-bar-height')
    }
  }, [show])

  return (
    <PayloadAdminBar
      {...adminBarProps}
      className="text-white"
      classNames={{
        controls: 'font-medium text-white',
        logo: 'text-white',
        user: 'text-white',
      }}
      cmsURL={getClientSideURL()}
      collectionSlug={collection}
      collectionLabels={{
        plural: collectionLabels[collection]?.plural || 'Pages',
        singular: collectionLabels[collection]?.singular || 'Page',
      }}
      logo={<Title />}
      onAuthChange={onAuthChange}
      onPreviewExit={() => {
        fetch('/next/exit-preview').then(() => {
          router.push('/')
          router.refresh()
        })
      }}
    />
  )
}
