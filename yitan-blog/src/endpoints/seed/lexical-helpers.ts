type TextNode = {
  type: 'text'
  detail: 0
  format: 0
  mode: 'normal'
  style: ''
  text: string
  version: 1
}

type BlockNode = {
  type: 'block'
  fields: {
    blockName: string
    blockType: 'mediaBlock'
    id: string
    media: number | string
  }
  format: ''
  version: 2
}

type ContentNode =
  | ReturnType<typeof heading>
  | ReturnType<typeof paragraph>
  | ReturnType<typeof table>
  | BlockNode

export const text = (value: string): TextNode => ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text: value,
  version: 1,
})

export const heading = (tag: 'h1' | 'h2' | 'h3' | 'h4', value: string) => ({
  type: 'heading' as const,
  children: [text(value)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  tag,
  version: 1,
})

export const paragraph = (...children: Array<TextNode | ReturnType<typeof link>>) => ({
  type: 'paragraph' as const,
  children,
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  textStyle: '',
  version: 1,
})

export const link = (label: string, url: string, newTab = false) => ({
  type: 'link' as const,
  children: [text(label)],
  direction: 'ltr' as const,
  fields: {
    linkType: 'custom' as const,
    newTab,
    url,
  },
  format: '' as const,
  indent: 0,
  version: 3 as const,
})

export const tableCell = (value: string, headerState = 0) => ({
  type: 'tablecell' as const,
  children: [paragraph(text(value))],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  headerState,
  version: 1,
})

export const tableRow = (...cells: ReturnType<typeof tableCell>[]) => ({
  type: 'tablerow' as const,
  children: cells,
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  version: 1,
})

export const table = (...rows: ReturnType<typeof tableRow>[]) => ({
  type: 'table' as const,
  children: rows,
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  version: 1,
})

export const mediaBlock = (mediaId: number | string, blockName = 'Inline Image'): BlockNode => ({
  type: 'block',
  fields: {
    blockName,
    blockType: 'mediaBlock',
    id: `media-block-${String(mediaId)}-${blockName.replace(/\s+/g, '-').toLowerCase()}`,
    media: mediaId,
  },
  format: '',
  version: 2,
})

export const richTextRoot = (...children: ContentNode[]) => ({
  root: {
    type: 'root' as const,
    children,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})
