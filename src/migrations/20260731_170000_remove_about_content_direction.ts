import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "pages_blocks_content"
    WHERE "block_name" = 'Content Direction'
      AND "_parent_id" IN (SELECT "id" FROM "pages" WHERE "slug" = 'about');

    DELETE FROM "_pages_v_blocks_content"
    WHERE "block_name" = 'Content Direction'
      AND "_parent_id" IN (SELECT "id" FROM "_pages_v" WHERE "version_slug" = 'about');
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Cannot restore deleted content blocks without re-seeding.
}
