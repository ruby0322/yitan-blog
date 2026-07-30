import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

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

  await db.execute(sql`
    ALTER TABLE "pages_blocks_quote_block" ADD COLUMN IF NOT EXISTS "cover_image_id" integer;
    ALTER TABLE "_pages_v_blocks_quote_block" ADD COLUMN IF NOT EXISTS "cover_image_id" integer;
  `)

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

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "pages_blocks_book_sales_block_order_idx"
      ON "pages_blocks_book_sales_block" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_book_sales_block_parent_id_idx"
      ON "pages_blocks_book_sales_block" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_book_sales_block_path_idx"
      ON "pages_blocks_book_sales_block" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "pages_blocks_book_sales_block_cover_image_idx"
      ON "pages_blocks_book_sales_block" USING btree ("cover_image_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_book_sales_block_order_idx"
      ON "_pages_v_blocks_book_sales_block" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_book_sales_block_parent_id_idx"
      ON "_pages_v_blocks_book_sales_block" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_book_sales_block_path_idx"
      ON "_pages_v_blocks_book_sales_block" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_book_sales_block_cover_image_idx"
      ON "_pages_v_blocks_book_sales_block" USING btree ("cover_image_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_quote_block_cover_image_idx"
      ON "pages_blocks_quote_block" USING btree ("cover_image_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_quote_block_cover_image_idx"
      ON "_pages_v_blocks_quote_block" USING btree ("cover_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_quote_block" DROP CONSTRAINT IF EXISTS "pages_blocks_quote_block_cover_image_id_media_id_fk";
    ALTER TABLE "_pages_v_blocks_quote_block" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_quote_block_cover_image_id_media_id_fk";
    ALTER TABLE "pages_blocks_quote_block" DROP COLUMN IF EXISTS "cover_image_id";
    ALTER TABLE "_pages_v_blocks_quote_block" DROP COLUMN IF EXISTS "cover_image_id";

    DROP TABLE IF EXISTS "_pages_v_blocks_book_sales_block" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_book_sales_block" CASCADE;

    DROP TYPE IF EXISTS "enum__pages_v_blocks_book_sales_block_buy_link_type";
    DROP TYPE IF EXISTS "enum_pages_blocks_book_sales_block_buy_link_type";
  `)
}
