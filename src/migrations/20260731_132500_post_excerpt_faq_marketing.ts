import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "excerpt" varchar;
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "marketing_notes_cover_design_notes" varchar;
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "marketing_notes_youtube_title" varchar;
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "marketing_notes_youtube_description" varchar;
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "marketing_notes_social_post" varchar;
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "marketing_notes_newsletter_summary" varchar;

    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_excerpt" varchar;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_marketing_notes_cover_design_notes" varchar;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_marketing_notes_youtube_title" varchar;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_marketing_notes_youtube_description" varchar;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_marketing_notes_social_post" varchar;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_marketing_notes_newsletter_summary" varchar;

    CREATE TABLE IF NOT EXISTS "posts_faq" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "question" varchar,
      "answer" varchar
    );

    CREATE TABLE IF NOT EXISTS "_posts_v_version_faq" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "question" varchar,
      "answer" varchar,
      "_uuid" varchar
    );
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "posts_faq"
        ADD CONSTRAINT "posts_faq_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_posts_v_version_faq"
        ADD CONSTRAINT "_posts_v_version_faq_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "posts_faq_order_idx" ON "posts_faq" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "posts_faq_parent_id_idx" ON "posts_faq" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_posts_v_version_faq_order_idx" ON "_posts_v_version_faq" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_posts_v_version_faq_parent_id_idx" ON "_posts_v_version_faq" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_posts_v_version_faq" CASCADE;
    DROP TABLE IF EXISTS "posts_faq" CASCADE;

    ALTER TABLE "posts" DROP COLUMN IF EXISTS "excerpt";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "marketing_notes_cover_design_notes";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "marketing_notes_youtube_title";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "marketing_notes_youtube_description";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "marketing_notes_social_post";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "marketing_notes_newsletter_summary";

    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_excerpt";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_marketing_notes_cover_design_notes";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_marketing_notes_youtube_title";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_marketing_notes_youtube_description";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_marketing_notes_social_post";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_marketing_notes_newsletter_summary";
  `)
}
