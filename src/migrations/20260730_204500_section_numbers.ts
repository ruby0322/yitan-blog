import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

async function addColumnIfMissing(
  db: MigrateUpArgs['db'],
  table: string,
  column: string,
  definition: string,
): Promise<void> {
  await db.execute(
    sql.raw(
      `ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "${column}" ${definition};`,
    ),
  )
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await addColumnIfMissing(db, 'pages_blocks_quote_block', 'section_number', 'varchar')
  await addColumnIfMissing(db, '_pages_v_blocks_quote_block', 'section_number', 'varchar')

  await addColumnIfMissing(db, 'pages_blocks_archive', 'section_number', "varchar DEFAULT '03'")
  await addColumnIfMissing(db, 'pages_blocks_archive', 'heading', 'varchar')
  await addColumnIfMissing(db, '_pages_v_blocks_archive', 'section_number', "varchar DEFAULT '03'")
  await addColumnIfMissing(db, '_pages_v_blocks_archive', 'heading', 'varchar')

  await addColumnIfMissing(
    db,
    'pages_blocks_about_teaser_block',
    'section_number',
    "varchar DEFAULT '04'",
  )
  await addColumnIfMissing(
    db,
    '_pages_v_blocks_about_teaser_block',
    'section_number',
    "varchar DEFAULT '04'",
  )

  await addColumnIfMissing(
    db,
    'pages_blocks_newsletter_block',
    'section_number',
    "varchar DEFAULT '05'",
  )
  await addColumnIfMissing(
    db,
    '_pages_v_blocks_newsletter_block',
    'section_number',
    "varchar DEFAULT '05'",
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_quote_block" DROP COLUMN IF EXISTS "section_number";
    ALTER TABLE "_pages_v_blocks_quote_block" DROP COLUMN IF EXISTS "section_number";

    ALTER TABLE "pages_blocks_archive" DROP COLUMN IF EXISTS "section_number";
    ALTER TABLE "pages_blocks_archive" DROP COLUMN IF EXISTS "heading";
    ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN IF EXISTS "section_number";
    ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN IF EXISTS "heading";

    ALTER TABLE "pages_blocks_about_teaser_block" DROP COLUMN IF EXISTS "section_number";
    ALTER TABLE "_pages_v_blocks_about_teaser_block" DROP COLUMN IF EXISTS "section_number";

    ALTER TABLE "pages_blocks_newsletter_block" DROP COLUMN IF EXISTS "section_number";
    ALTER TABLE "_pages_v_blocks_newsletter_block" DROP COLUMN IF EXISTS "section_number";
  `)
}
