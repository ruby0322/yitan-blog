import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "footer_link_groups_items"
    WHERE "link_label" = '著作權與使用條款'
      AND "link_url" = '/terms';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Cannot restore deleted footer link without re-seeding.
}
