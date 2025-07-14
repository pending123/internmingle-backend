/*
  Warnings:

  - Added the required column `description` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_clerkId_key";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "description" TEXT NOT NULL;
