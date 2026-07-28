import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest } from 'payload'

import { about } from './about'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { image3, image4, image5, image6, imageInlineDiet } from './image-3'
import { imageBrandHero } from './image-brand-hero'
import { imageDoctorPortraitMeta } from './image-doctor-portrait'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'
import { post4 } from './post-4'
import { post5 } from './post-5'
import { post6 } from './post-6'
import { fetchLocalSeedFile } from './seed-media'

const collections: CollectionSlug[] = ['categories', 'media', 'pages', 'posts', 'search']

const globals = ['header', 'footer'] as const satisfies GlobalSlug[]

const categories = ['迷思破解', '飲食保健', '基礎知識'] as const

const PUBLISHED_AT = {
  post1: '2026-06-20T08:00:00.000Z',
  post2: '2026-06-28T08:00:00.000Z',
  post3: '2026-07-05T08:00:00.000Z',
  post4: '2026-07-10T08:00:00.000Z',
  post5: '2026-07-15T08:00:00.000Z',
  post6: '2026-07-20T08:00:00.000Z',
} as const

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  payload.logger.info(`— Clearing collections and globals...`)

  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: {
          navItems: [],
        },
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      }),
    ),
  )

  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
  }

  for (const collection of collections.filter((item) => Boolean(payload.collections[item].config.versions))) {
    await payload.db.deleteVersions({ collection, req, where: {} })
  }

  payload.logger.info(`— Seeding author...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  const [
    brandHeroBuffer,
    doctorPortraitBuffer,
    post1Buffer,
    post2Buffer,
    post3Buffer,
    post4Buffer,
    post5Buffer,
    post6Buffer,
    inlineDietBuffer,
  ] = await Promise.all([
    fetchLocalSeedFile('brand-hero.webp'),
    fetchLocalSeedFile('doctor-portrait.webp'),
    fetchLocalSeedFile('post-1.webp'),
    fetchLocalSeedFile('post-2.webp'),
    fetchLocalSeedFile('post-3.webp'),
    fetchLocalSeedFile('post-4.webp'),
    fetchLocalSeedFile('post-5.webp'),
    fetchLocalSeedFile('post-6.webp'),
    fetchLocalSeedFile('inline-diet.webp'),
  ])

  const demoAuthor = await payload.create({
    collection: 'users',
    data: {
      name: '章醫師',
      email: 'demo-author@example.com',
      password: 'password',
    },
  })

  const categoryDocs = await Promise.all(
    categories.map((category) =>
      payload.create({
        collection: 'categories',
        data: {
          title: category,
          slug: category,
        },
      }),
    ),
  )

  const categoryByTitle = Object.fromEntries(categoryDocs.map((doc) => [doc.title, doc]))

  const mediaCreates = [
    { data: imageBrandHero, file: brandHeroBuffer },
    { data: imageDoctorPortraitMeta, file: doctorPortraitBuffer },
    { data: image1, file: post1Buffer },
    { data: image2, file: post2Buffer },
    { data: image3, file: post3Buffer },
    { data: image4, file: post4Buffer },
    { data: image5, file: post5Buffer },
    { data: image6, file: post6Buffer },
    { data: imageInlineDiet, file: inlineDietBuffer },
  ] as const

  const mediaDocs = []

  for (const item of mediaCreates) {
    mediaDocs.push(
      await payload.create({
        collection: 'media',
        data: item.data,
        file: item.file,
      }),
    )
  }

  const [
    brandHeroDoc,
    doctorPortraitDoc,
    image1Doc,
    image2Doc,
    image3Doc,
    image4Doc,
    image5Doc,
    image6Doc,
    inlineDietDoc,
  ] = mediaDocs

  payload.logger.info(`— Seeding posts...`)

  const postArgs = {
    author: demoAuthor,
  }

  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: post1({
      ...postArgs,
      category: categoryByTitle['基礎知識'],
      heroImage: image1Doc,
      publishedAt: PUBLISHED_AT.post1,
    }),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: post2({
      ...postArgs,
      category: categoryByTitle['迷思破解'],
      heroImage: image2Doc,
      publishedAt: PUBLISHED_AT.post2,
    }),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: post3({
      ...postArgs,
      category: categoryByTitle['飲食保健'],
      heroImage: image3Doc,
      publishedAt: PUBLISHED_AT.post3,
    }),
  })

  const post4Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: post4({
      ...postArgs,
      category: categoryByTitle['基礎知識'],
      heroImage: image4Doc,
      publishedAt: PUBLISHED_AT.post4,
    }),
  })

  const post5Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: post5({
      ...postArgs,
      category: categoryByTitle['飲食保健'],
      heroImage: image5Doc,
      inlineImage: inlineDietDoc,
      publishedAt: PUBLISHED_AT.post5,
    }),
  })

  const post6Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: post6({
      ...postArgs,
      category: categoryByTitle['基礎知識'],
      heroImage: image6Doc,
      publishedAt: PUBLISHED_AT.post6,
    }),
  })

  const allPosts = [post1Doc, post2Doc, post3Doc, post4Doc, post5Doc, post6Doc]

  for (const post of allPosts) {
    await payload.update({
      id: post.id,
      collection: 'posts',
      context: { disableRevalidate: true },
      data: {
        relatedPosts: allPosts.filter((related) => related.id !== post.id).map((related) => related.id),
      },
    })
  }

  payload.logger.info(`— Seeding pages...`)

  await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      context: { disableRevalidate: true },
      data: home({ heroImage: brandHeroDoc, metaImage: doctorPortraitDoc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      context: { disableRevalidate: true },
      data: about({ doctorImage: doctorPortraitDoc, metaImage: doctorPortraitDoc }),
    }),
  ])

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      context: { disableRevalidate: true },
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: '首頁',
              url: '/',
            },
          },
          {
            link: {
              type: 'custom',
              label: '關於',
              url: '/about',
            },
          },
          {
            link: {
              type: 'custom',
              label: '部落格',
              url: '/posts',
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      context: { disableRevalidate: true },
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: '首頁',
              url: '/',
            },
          },
          {
            link: {
              type: 'custom',
              label: '關於',
              url: '/about',
            },
          },
          {
            link: {
              type: 'custom',
              label: '部落格',
              url: '/posts',
            },
          },
        ],
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}
