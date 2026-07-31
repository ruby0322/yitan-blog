import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "footer_link_groups_items"
    WHERE "_parent_id" IN (
      SELECT "id" FROM "footer_link_groups" WHERE "label" = '章明珠醫師'
    );

    DELETE FROM "footer_link_groups"
    WHERE "label" = '章明珠醫師';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Cannot restore deleted footer link group without re-seeding.
}
