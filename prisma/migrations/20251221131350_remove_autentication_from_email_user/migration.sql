-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deletion_scheduled_at" TIMESTAMP(3),
ADD COLUMN     "is_disabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_login_at" TIMESTAMP(3),
ALTER COLUMN "name" SET DEFAULT 'Owner',
ALTER COLUMN "email" SET DEFAULT 'owner@local';

-- CreateIndex
CREATE INDEX "users_deletion_scheduled_at_idx" ON "users"("deletion_scheduled_at");
