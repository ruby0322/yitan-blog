'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { toast } from '@payloadcms/ui'

import './index.css'

const SuccessMessage: React.FC = () => (
  <div>
    示範內容已建立！您現在可以{' '}
    <a target="_blank" href="/">
      前往網站
    </a>
  </div>
)

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (seeded) {
        toast.info('示範內容已建立過。')
        return
      }
      if (loading) {
        toast.info('正在建立示範內容，請稍候。')
        return
      }
      if (error) {
        toast.error(`發生錯誤，請重新整理後再試一次。`)
        return
      }

      setLoading(true)

      try {
        toast.promise(
          new Promise((resolve, reject) => {
            try {
              fetch('/next/seed', { method: 'POST', credentials: 'include' })
                .then((res) => {
                  if (res.ok) {
                    resolve(true)
                    setSeeded(true)
                  } else {
                    reject('建立示範內容時發生錯誤。')
                  }
                })
                .catch((error) => {
                  reject(error)
                })
            } catch (error) {
              reject(error)
            }
          }),
          {
            loading: '正在建立示範內容...',
            success: <SuccessMessage />,
            error: '建立示範內容時發生錯誤。',
          },
        )
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err)
        setError(error)
      }
    },
    [loading, seeded, error],
  )

  let message = ''
  if (loading) message = '（建立中...）'
  if (seeded) message = '（完成）'
  if (error) message = `（錯誤：${error}）`

  return (
    <Fragment>
      <button className="seedButton" onClick={handleClick}>
        建立示範內容
      </button>
      {message}
    </Fragment>
  )
}
