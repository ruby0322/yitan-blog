import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  ArticleCard,
  BodyText,
  Caption,
  DisplayHeading,
  EmphasisText,
  NewsletterForm,
  NumberedHeading,
  QuoteBlock,
  ReadMoreLink,
  Section,
  SectionHeading,
  SectionNumber,
} from '@/components/theme'
import { notFound } from 'next/navigation'
import React from 'react'

const brandColors = [
  { name: 'warm-white', token: '--brand-warm-white', hex: '#FAF8F5', label: '暖白' },
  { name: 'card', token: '--brand-card', hex: '#F5F3EF', label: '米白' },
  { name: 'heading', token: '--brand-heading', hex: '#4A5248', label: '深灰' },
  { name: 'body', token: '--brand-body', hex: '#6E756B', label: '中灰' },
  { name: 'subtitle', token: '--brand-subtitle', hex: '#607D8B', label: '灰藍' },
  { name: 'sage', token: '--brand-sage', hex: '#8DAA91', label: '鼠尾草綠' },
  { name: 'border', token: '--brand-border', hex: '#D9D6D2', label: '淺灰' },
  { name: 'cta', token: '--brand-cta', hex: '#6F8D7A', label: '深綠 CTA' },
  { name: 'hover', token: '--brand-hover', hex: '#E6EFE8', label: '淺鼠尾草' },
  { name: 'inverse-bg', token: '--brand-inverse-bg', hex: '#6F8D7A', label: 'Inverse 背景' },
  { name: 'inverse-fg', token: '--brand-inverse-fg', hex: '#FAF8F5', label: 'Inverse 文字' },
]

export default function ThemePreviewPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound()
  }

  return (
    <main className="pb-20">
      <Section spacing="lg" variant="default">
        <div className="container">
          <Caption>整合設計參考 v1.1 · Integrated Design Spec v1.1</Caption>
          <DisplayHeading className="mt-2">Theme Preview</DisplayHeading>
          <BodyText className="mt-4 max-w-2xl">
            開發用驗證頁面，展示 v1.1 所有 token 與元件。Production 環境不可見。
          </BodyText>
        </div>
      </Section>

      {/* Colors */}
      <Section spacing="default" variant="muted">
        <div className="container">
          <SectionHeading>Color Tokens</SectionHeading>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {brandColors.map((color) => (
              <div className="rounded-md border border-brand-border bg-brand-warm-white" key={color.name}>
                <div className="h-20" style={{ backgroundColor: color.hex }} />
                <div className="space-y-1 p-3 text-sm">
                  <p className="font-medium text-brand-heading">{color.label}</p>
                  <p className="font-mono text-xs text-brand-sage">{color.hex}</p>
                  <p className="text-xs text-brand-body">{color.token}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Typography */}
      <Section spacing="default" variant="default">
        <div className="container max-w-3xl">
          <SectionHeading>Typography</SectionHeading>
          <div className="mt-8 space-y-6">
            <DisplayHeading>看懂胰臟，從理解開始。</DisplayHeading>
            <SectionHeading>本期精選文章</SectionHeading>
            <SectionNumber>01</SectionNumber>
            <BodyText>
              胰臟雖然只是身體裡一個小小的器官，卻與我們的消化、代謝息息相關。
              <EmphasisText> 突然出現的糖尿病、不明原因的體重減輕、加上家族史</EmphasisText>
              ，都是需要提高警覺的警訊。
            </BodyText>
            <NumberedHeading number={1} title="真實故事（badge）" />
            <NumberedHeading title="如何察覺胰臟的求救訊號？" variant="bar" />
            <Caption>2026/01/15 · 胰臟知識</Caption>
          </div>
        </div>
      </Section>

      {/* Buttons & Inputs */}
      <Section spacing="default" variant="muted">
        <div className="container">
          <SectionHeading>Buttons & Inputs</SectionHeading>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button variant="default">Default / CTA</Button>
            <Button variant="cta">CTA 訂閱</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="readMore">Read More</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="mt-8 grid max-w-lg gap-6">
            <Input placeholder="Default input" />
            <Input placeholder="Underline input" variant="underline" />
          </div>
        </div>
      </Section>

      {/* Cards */}
      <Section spacing="default" variant="default">
        <div className="container">
          <SectionHeading>Cards</SectionHeading>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Shadcn Card</CardTitle>
              </CardHeader>
              <CardContent>
                <BodyText>Flat, no shadow, serif title, rounded-md.</BodyText>
              </CardContent>
            </Card>
            <ArticleCard
              doc={{
                slug: 'preview-post',
                title: '認識胰臟：身體裡被低估的器官',
                publishedAt: new Date().toISOString(),
                meta: {
                  description: '胰臟同時負責內分泌與外分泌功能，是維持代謝平衡的重要角色。',
                },
                categories: [],
              }}
            />
          </div>
        </div>
      </Section>

      {/* Theme components */}
      <Section spacing="default" variant="muted">
        <div className="container max-w-3xl">
          <SectionHeading>Theme Components</SectionHeading>
          <div className="mt-8 space-y-10">
            <QuoteBlock attribution="章醫師">
              理解胰臟，不是為了變成醫生，而是為了更懂得如何照顧自己的身體。
            </QuoteBlock>
            <ReadMoreLink href="/posts" />
            <NewsletterForm />
          </div>
        </div>
      </Section>

      {/* Section variants */}
      <Section spacing="none" variant="default">
        <div className="container py-8">
          <SectionHeading>Section Variants</SectionHeading>
        </div>
      </Section>
      <Section spacing="sm" variant="default">
        <div className="container text-center">
          <p className="font-medium text-brand-heading">Default — 暖白背景</p>
        </div>
      </Section>
      <Section spacing="sm" variant="muted">
        <div className="container text-center">
          <p className="font-medium text-brand-heading">Muted — 米白背景</p>
        </div>
      </Section>
      <Section spacing="sm" variant="inverse">
        <div className="container text-center">
          <p className="font-medium">Inverse — 深綠背景</p>
          <Button className="mt-4" variant="cta">
            Inverse CTA
          </Button>
        </div>
      </Section>
    </main>
  )
}
