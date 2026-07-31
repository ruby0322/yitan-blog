import { NextResponse } from 'next/server'

import { querySearchPosts } from '@/utilities/querySearch'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() ?? ''
  const category = searchParams.get('category')
  const limitParam = searchParams.get('limit')
  const limit = limitParam ? Number(limitParam) : 8

  if (!q) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 })
  }

  if (!Number.isFinite(limit) || limit < 1 || limit > 24) {
    return NextResponse.json({ error: 'Invalid limit' }, { status: 400 })
  }

  const { notFound, posts } = await querySearchPosts({
    categorySlug: category,
    limit,
    page: 1,
    q,
  })

  if (notFound || !posts) {
    return NextResponse.json({ docs: [], totalDocs: 0 })
  }

  return NextResponse.json({
    docs: posts.docs,
    totalDocs: posts.totalDocs,
  })
}
