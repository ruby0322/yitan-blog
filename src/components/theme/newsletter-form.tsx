'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/utilities/ui'
import React, { useState } from 'react'

type NewsletterFormProps = {
  className?: string
  onSubmit?: (email: string) => void | Promise<void>
}

export const NewsletterForm: React.FC<NewsletterFormProps> = ({ className, onSubmit }) => {
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      await onSubmit(email)
    }
  }

  return (
    <form
      className={cn('flex max-w-md flex-col gap-3 sm:flex-row sm:items-end', className)}
      onSubmit={handleSubmit}
    >
      <Input
        className="flex-1"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="請輸入您的 Email"
        type="email"
        value={email}
        variant="underline"
      />
      <Button type="submit" variant="cta">
        訂閱電子報
      </Button>
    </form>
  )
}
