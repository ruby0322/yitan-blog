import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "description" varchar;

    ALTER TABLE "pages_blocks_category_nav_block_items"
      ADD COLUMN IF NOT EXISTS "category_id" integer;

    ALTER TABLE "_pages_v_blocks_category_nav_block_items"
      ADD COLUMN IF NOT EXISTS "category_id" integer;

    ALTER TABLE "pages_blocks_category_nav_block_items"
      DROP COLUMN IF EXISTS "number";

    ALTER TABLE "_pages_v_blocks_category_nav_block_items"
      DROP COLUMN IF EXISTS "number";
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_category_nav_block_items"
        ADD CONSTRAINT "pages_blocks_category_nav_block_items_category_id_categories_id_fk"
        FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_category_nav_block_items"
        ADD CONSTRAINT "_pages_v_blocks_category_nav_block_items_category_id_categories_id_fk"
        FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "pages_blocks_category_nav_block_items_category_idx"
      ON "pages_blocks_category_nav_block_items" USING btree ("category_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_category_nav_block_items_category_idx"
      ON "_pages_v_blocks_category_nav_block_items" USING btree ("category_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_category_nav_block_items" DROP CONSTRAINT IF EXISTS "pages_blocks_category_nav_block_items_category_id_categories_id_fk";
    ALTER TABLE "_pages_v_blocks_category_nav_block_items" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_category_nav_block_items_category_id_categories_id_fk";

    DROP INDEX IF EXISTS "pages_blocks_category_nav_block_items_category_idx";
    DROP INDEX IF EXISTS "_pages_v_blocks_category_nav_block_items_category_idx";

    ALTER TABLE "pages_blocks_category_nav_block_items" DROP COLUMN IF EXISTS "category_id";
    ALTER TABLE "_pages_v_blocks_category_nav_block_items" DROP COLUMN IF EXISTS "category_id";

    ALTER TABLE "pages_blocks_category_nav_block_items" ADD COLUMN IF NOT EXISTS "number" varchar;
    ALTER TABLE "_pages_v_blocks_category_nav_block_items" ADD COLUMN IF NOT EXISTS "number" varchar;

    ALTER TABLE "categories" DROP COLUMN IF EXISTS "description";
  `)
}
