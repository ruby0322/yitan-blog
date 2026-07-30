import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_category_nav_block_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_about_teaser_block_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_category_nav_block_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_about_teaser_block_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"attribution" varchar,
  	"side_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_featured_posts_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_number" varchar DEFAULT '01',
  	"heading" varchar DEFAULT '本期精選',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_category_nav_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"title" varchar,
  	"link_type" "enum_pages_blocks_category_nav_block_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "pages_blocks_category_nav_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_number" varchar DEFAULT '02',
  	"heading" varchar DEFAULT '從這裡開始',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_about_teaser_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" jsonb,
  	"image_id" integer,
  	"link_type" "enum_pages_blocks_about_teaser_block_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_newsletter_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT '每月一封，陪您看懂胰臟。',
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"attribution" varchar,
  	"side_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_featured_posts_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_number" varchar DEFAULT '01',
  	"heading" varchar DEFAULT '本期精選',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_category_nav_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"title" varchar,
  	"link_type" "enum__pages_v_blocks_category_nav_block_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_category_nav_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_number" varchar DEFAULT '02',
  	"heading" varchar DEFAULT '從這裡開始',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_teaser_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" jsonb,
  	"image_id" integer,
  	"link_type" "enum__pages_v_blocks_about_teaser_block_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_newsletter_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT '每月一封，陪您看懂胰臟。',
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "media" DROP CONSTRAINT "media_folder_id_payload_folders_id_fk";
  
  ALTER TABLE "payload_folders_folder_type" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_folders_folder_type";
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('folders');
  ALTER TABLE "payload_folders_folder_type" ALTER COLUMN "value" SET DATA TYPE "public"."enum_payload_folders_folder_type" USING "value"::"public"."enum_payload_folders_folder_type";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "folders_id" integer;
  ALTER TABLE "folders" ADD CONSTRAINT "folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_quote_block" ADD CONSTRAINT "pages_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_posts_block" ADD CONSTRAINT "pages_blocks_featured_posts_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_nav_block_items" ADD CONSTRAINT "pages_blocks_category_nav_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_category_nav_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_nav_block" ADD CONSTRAINT "pages_blocks_category_nav_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_teaser_block" ADD CONSTRAINT "pages_blocks_about_teaser_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_teaser_block" ADD CONSTRAINT "pages_blocks_about_teaser_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_newsletter_block" ADD CONSTRAINT "pages_blocks_newsletter_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_quote_block" ADD CONSTRAINT "_pages_v_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_posts_block" ADD CONSTRAINT "_pages_v_blocks_featured_posts_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_nav_block_items" ADD CONSTRAINT "_pages_v_blocks_category_nav_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_category_nav_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_nav_block" ADD CONSTRAINT "_pages_v_blocks_category_nav_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_teaser_block" ADD CONSTRAINT "_pages_v_blocks_about_teaser_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_teaser_block" ADD CONSTRAINT "_pages_v_blocks_about_teaser_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_newsletter_block" ADD CONSTRAINT "_pages_v_blocks_newsletter_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "folders_folder_idx" ON "folders" USING btree ("folder_id");
  CREATE INDEX "folders_updated_at_idx" ON "folders" USING btree ("updated_at");
  CREATE INDEX "folders_created_at_idx" ON "folders" USING btree ("created_at");
  CREATE INDEX "pages_blocks_quote_block_order_idx" ON "pages_blocks_quote_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_quote_block_parent_id_idx" ON "pages_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_quote_block_path_idx" ON "pages_blocks_quote_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_featured_posts_block_order_idx" ON "pages_blocks_featured_posts_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_featured_posts_block_parent_id_idx" ON "pages_blocks_featured_posts_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featured_posts_block_path_idx" ON "pages_blocks_featured_posts_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_category_nav_block_items_order_idx" ON "pages_blocks_category_nav_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_category_nav_block_items_parent_id_idx" ON "pages_blocks_category_nav_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_category_nav_block_order_idx" ON "pages_blocks_category_nav_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_category_nav_block_parent_id_idx" ON "pages_blocks_category_nav_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_category_nav_block_path_idx" ON "pages_blocks_category_nav_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_about_teaser_block_order_idx" ON "pages_blocks_about_teaser_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_teaser_block_parent_id_idx" ON "pages_blocks_about_teaser_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_teaser_block_path_idx" ON "pages_blocks_about_teaser_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_about_teaser_block_image_idx" ON "pages_blocks_about_teaser_block" USING btree ("image_id");
  CREATE INDEX "pages_blocks_newsletter_block_order_idx" ON "pages_blocks_newsletter_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_newsletter_block_parent_id_idx" ON "pages_blocks_newsletter_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_newsletter_block_path_idx" ON "pages_blocks_newsletter_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_quote_block_order_idx" ON "_pages_v_blocks_quote_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_quote_block_parent_id_idx" ON "_pages_v_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_quote_block_path_idx" ON "_pages_v_blocks_quote_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_featured_posts_block_order_idx" ON "_pages_v_blocks_featured_posts_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_featured_posts_block_parent_id_idx" ON "_pages_v_blocks_featured_posts_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_featured_posts_block_path_idx" ON "_pages_v_blocks_featured_posts_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_category_nav_block_items_order_idx" ON "_pages_v_blocks_category_nav_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_category_nav_block_items_parent_id_idx" ON "_pages_v_blocks_category_nav_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_category_nav_block_order_idx" ON "_pages_v_blocks_category_nav_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_category_nav_block_parent_id_idx" ON "_pages_v_blocks_category_nav_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_category_nav_block_path_idx" ON "_pages_v_blocks_category_nav_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_about_teaser_block_order_idx" ON "_pages_v_blocks_about_teaser_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_teaser_block_parent_id_idx" ON "_pages_v_blocks_about_teaser_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_teaser_block_path_idx" ON "_pages_v_blocks_about_teaser_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_about_teaser_block_image_idx" ON "_pages_v_blocks_about_teaser_block" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_newsletter_block_order_idx" ON "_pages_v_blocks_newsletter_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_newsletter_block_parent_id_idx" ON "_pages_v_blocks_newsletter_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_newsletter_block_path_idx" ON "_pages_v_blocks_newsletter_block" USING btree ("_path");
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_folders_fk" FOREIGN KEY ("folders_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("folders_id");
  ALTER TABLE "pages" DROP COLUMN "generate_slug";
  ALTER TABLE "_pages_v" DROP COLUMN "version_generate_slug";
  ALTER TABLE "posts" DROP COLUMN "generate_slug";
  ALTER TABLE "_posts_v" DROP COLUMN "version_generate_slug";
  ALTER TABLE "categories" DROP COLUMN "generate_slug";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "folders" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_quote_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_featured_posts_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_category_nav_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_category_nav_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_about_teaser_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_newsletter_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_quote_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_featured_posts_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_category_nav_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_category_nav_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_about_teaser_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_newsletter_block" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "folders" CASCADE;
  DROP TABLE "pages_blocks_quote_block" CASCADE;
  DROP TABLE "pages_blocks_featured_posts_block" CASCADE;
  DROP TABLE "pages_blocks_category_nav_block_items" CASCADE;
  DROP TABLE "pages_blocks_category_nav_block" CASCADE;
  DROP TABLE "pages_blocks_about_teaser_block" CASCADE;
  DROP TABLE "pages_blocks_newsletter_block" CASCADE;
  DROP TABLE "_pages_v_blocks_quote_block" CASCADE;
  DROP TABLE "_pages_v_blocks_featured_posts_block" CASCADE;
  DROP TABLE "_pages_v_blocks_category_nav_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_category_nav_block" CASCADE;
  DROP TABLE "_pages_v_blocks_about_teaser_block" CASCADE;
  DROP TABLE "_pages_v_blocks_newsletter_block" CASCADE;
  ALTER TABLE "media" DROP CONSTRAINT "media_folder_id_folders_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_folders_fk";
  
  ALTER TABLE "payload_folders_folder_type" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_folders_folder_type";
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  ALTER TABLE "payload_folders_folder_type" ALTER COLUMN "value" SET DATA TYPE "public"."enum_payload_folders_folder_type" USING "value"::"public"."enum_payload_folders_folder_type";
  DROP INDEX "payload_locked_documents_rels_folders_id_idx";
  ALTER TABLE "pages" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "_pages_v" ADD COLUMN "version_generate_slug" boolean DEFAULT true;
  ALTER TABLE "posts" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "_posts_v" ADD COLUMN "version_generate_slug" boolean DEFAULT true;
  ALTER TABLE "categories" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "folders_id";
  DROP TYPE "public"."enum_pages_blocks_category_nav_block_items_link_type";
  DROP TYPE "public"."enum_pages_blocks_about_teaser_block_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_category_nav_block_items_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_about_teaser_block_link_type";`)
}
