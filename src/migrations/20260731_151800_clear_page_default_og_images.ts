import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "pages"
    SET "meta_image_id" = NULL
    WHERE "slug" IN ('home', 'about');

    UPDATE "_pages_v"
    SET "version_meta_image_id" = NULL
    WHERE "version_slug" IN ('home', 'about');
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Cannot restore previous meta images without knowing their media IDs.
}
