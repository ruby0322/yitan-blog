import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "sort_order" numeric;

    UPDATE "categories" SET "sort_order" = 1 WHERE "title" = '胰臟水泡';
    UPDATE "categories" SET "sort_order" = 2 WHERE "title" = '胰臟發炎';
    UPDATE "categories" SET "sort_order" = 3 WHERE "title" = '胰臟癌';
    UPDATE "categories" SET "sort_order" = 4 WHERE "title" = '胰臟癌篩檢';
    UPDATE "categories" SET "sort_order" = 5 WHERE "title" = '胰臟健康';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "categories" DROP COLUMN IF EXISTS "sort_order";
  `)
}
