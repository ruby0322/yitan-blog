import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

async function addColumnIfMissing(
  db: MigrateUpArgs['db'],
  table: string,
  column: string,
  definition: string,
): Promise<void> {
  await db.execute(
    sql.raw(`ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "${column}" ${definition};`),
  )
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of ['pages_blocks_book_sales_block', '_pages_v_blocks_book_sales_block']) {
    await addColumnIfMissing(db, table, 'book_subtitle', 'varchar')
    await addColumnIfMissing(db, table, 'highlight_line', 'varchar')
    await addColumnIfMissing(db, table, 'author_line', 'varchar')
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`SELECT 1`)
}
