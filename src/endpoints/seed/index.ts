import type { CollectionSlug, Payload, PayloadRequest } from 'payload'

import { about } from './about'
import { home } from './home'
import { imageBookFlatMeta } from './image-book'
import { featuredPostIdsFromClientPosts, seedClientPosts } from './seed-client-posts'
import { TOPIC_CATEGORY_DATA } from '@/constants/categories'

import { clearMediaCollection, clearOrphanedVercelBlobs } from './clear-media-storage'
import { fetchLocalSeedFile } from './seed-media'

const collections: CollectionSlug[] = ['categories', 'media', 'pages', 'posts', 'search']

const LEGACY_SEED_ADMIN_EMAIL = 'demo-author@example.com'

function getSeedAdminCredentials(): { email: string; name: string; password: string } {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  const name = process.env.SEED_ADMIN_NAME ?? '章醫師'

  if (!email || !password) {
    throw new Error(
      'SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in the environment before seeding.',
    )
  }

  return { email, name, password }
}

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  payload.logger.info(`— Clearing collections and globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [],
      },
      depth: 0,
      context: {
        disableRevalidate: true,
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        linkGroups: [],
      },
      depth: 0,
      context: {
        disableRevalidate: true,
      },
    }),
  ])

  payload.logger.info(`— Clearing media storage...`)

  await clearMediaCollection({ payload, req })

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  if (blobToken) {
    await clearOrphanedVercelBlobs(blobToken)
  }

  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
  }

  for (const collection of collections.filter((item) => Boolean(payload.collections[item].config.versions))) {
    await payload.db.deleteVersions({ collection, req, where: {} })
  }

  payload.logger.info(`— Seeding author...`)

  const seedAdmin = getSeedAdminCredentials()

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        in: [LEGACY_SEED_ADMIN_EMAIL, seedAdmin.email],
      },
    },
  })

  const bookFlatBuffer = await fetchLocalSeedFile('book-flat.JPG')

  const demoAuthor = await payload.create({
    collection: 'users',
    data: {
      name: seedAdmin.name,
      email: seedAdmin.email,
      password: seedAdmin.password,
    },
  })

  const categoryDocs = await Promise.all(
    TOPIC_CATEGORY_DATA.map(({ title, description, sortOrder }) =>
      payload.create({
        collection: 'categories',
        data: {
          title,
          description,
          slug: title,
          sortOrder,
        },
      }),
    ),
  )

  const categoryByTitle = Object.fromEntries(categoryDocs.map((doc) => [doc.title, doc]))

  payload.logger.info(`— Seeding book cover media...`)

  const bookFlatDoc = await payload.create({
    collection: 'media',
    data: imageBookFlatMeta,
    file: bookFlatBuffer,
  })

  payload.logger.info(`— Seeding client posts...`)

  const clientPosts = await seedClientPosts({
    author: demoAuthor,
    categoryByTitle,
    payload,
  })

  payload.logger.info(`— Seeding pages...`)

  await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      context: { disableRevalidate: true },
      data: home({
        bookFlatImage: bookFlatDoc,
        categoryByTitle,
        featuredPostIds: featuredPostIdsFromClientPosts(clientPosts),
      }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      context: { disableRevalidate: true },
      data: about(),
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
        linkGroups: [
          {
            label: '網站導覽',
            items: [
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
          {
            label: '《攔截胰臟癌》',
            items: [
              {
                link: {
                  type: 'custom',
                  label: '新書介紹',
                  url: '/#book-sales',
                },
              },
              {
                link: {
                  type: 'custom',
                  label: '博客來選購',
                  url: 'https://reurl.cc/27ZMn6',
                  newTab: true,
                },
              },
              {
                link: {
                  type: 'custom',
                  label: '天下網路書店',
                  url: 'https://www.cwbook.com.tw/products/search?keyword=9786267916070',
                  newTab: true,
                },
              },
              {
                link: {
                  type: 'custom',
                  label: '天下雜誌出版',
                  url: 'https://www.cw.com.tw/',
                  newTab: true,
                },
              },
            ],
          },
        ],
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}
