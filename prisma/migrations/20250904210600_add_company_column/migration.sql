/*
  Warnings:

  - Added the required column `companyId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Notification" ADD COLUMN     "companyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
