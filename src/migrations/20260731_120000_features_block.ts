import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_features_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "section_number" varchar DEFAULT '01',
      "heading" varchar DEFAULT '四大特色',
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_features_block_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "description" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_features_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "section_number" varchar DEFAULT '01',
      "heading" varchar DEFAULT '四大特色',
      "_uuid" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_features_block_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar,
      "description" varchar,
      "_uuid" varchar
    );
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_features_block"
        ADD CONSTRAINT "pages_blocks_features_block_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_features_block_items"
        ADD CONSTRAINT "pages_blocks_features_block_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features_block"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_features_block"
        ADD CONSTRAINT "_pages_v_blocks_features_block_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_features_block_items"
        ADD CONSTRAINT "_pages_v_blocks_features_block_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features_block"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "pages_blocks_features_block_order_idx"
      ON "pages_blocks_features_block" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_features_block_parent_id_idx"
      ON "pages_blocks_features_block" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_features_block_path_idx"
      ON "pages_blocks_features_block" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "pages_blocks_features_block_items_order_idx"
      ON "pages_blocks_features_block_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_features_block_items_parent_id_idx"
      ON "pages_blocks_features_block_items" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_features_block_order_idx"
      ON "_pages_v_blocks_features_block" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_features_block_parent_id_idx"
      ON "_pages_v_blocks_features_block" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_features_block_path_idx"
      ON "_pages_v_blocks_features_block" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_features_block_items_order_idx"
      ON "_pages_v_blocks_features_block_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_features_block_items_parent_id_idx"
      ON "_pages_v_blocks_features_block_items" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_pages_v_blocks_features_block_items" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_features_block" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_features_block_items" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_features_block" CASCADE;
  `)
}
