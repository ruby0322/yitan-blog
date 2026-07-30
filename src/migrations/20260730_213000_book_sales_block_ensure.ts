import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Idempotent safety pass for book sales block + quote cover image.
 * Safe to run even if 20260730_212500_book_sales_block partially applied.
 */
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
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_book_sales_block_buy_link_type" AS ENUM('reference', 'custom');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_book_sales_block_buy_link_type" AS ENUM('reference', 'custom');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_book_sales_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "section_number" varchar DEFAULT '05',
      "heading" varchar DEFAULT '把胰臟健康帶回家',
      "description" varchar,
      "cover_image_id" integer,
      "buy_link_type" "enum_pages_blocks_book_sales_block_buy_link_type" DEFAULT 'custom',
      "buy_link_new_tab" boolean,
      "buy_link_url" varchar,
      "buy_link_label" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_book_sales_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "section_number" varchar DEFAULT '05',
      "heading" varchar DEFAULT '把胰臟健康帶回家',
      "description" varchar,
      "cover_image_id" integer,
      "buy_link_type" "enum__pages_v_blocks_book_sales_block_buy_link_type" DEFAULT 'custom',
      "buy_link_new_tab" boolean,
      "buy_link_url" varchar,
      "buy_link_label" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );
  `)

  await addColumnIfMissing(db, 'pages_blocks_quote_block', 'cover_image_id', 'integer')
  await addColumnIfMissing(db, '_pages_v_blocks_quote_block', 'cover_image_id', 'integer')

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_book_sales_block"
        ADD CONSTRAINT "pages_blocks_book_sales_block_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_book_sales_block"
        ADD CONSTRAINT "pages_blocks_book_sales_block_cover_image_id_media_id_fk"
        FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_book_sales_block"
        ADD CONSTRAINT "_pages_v_blocks_book_sales_block_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_book_sales_block"
        ADD CONSTRAINT "_pages_v_blocks_book_sales_block_cover_image_id_media_id_fk"
        FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_quote_block"
        ADD CONSTRAINT "pages_blocks_quote_block_cover_image_id_media_id_fk"
        FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_quote_block"
        ADD CONSTRAINT "_pages_v_blocks_quote_block_cover_image_id_media_id_fk"
        FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`SELECT 1`)
}
