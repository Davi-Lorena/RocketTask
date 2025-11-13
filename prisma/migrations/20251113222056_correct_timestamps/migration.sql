-- AlterTable
ALTER TABLE "public"."tasks" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."teams" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "updated_at" DROP DEFAULT;
