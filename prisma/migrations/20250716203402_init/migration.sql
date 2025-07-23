/*
  Warnings:

  - You are about to drop the column `userId` on the `Hobby` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Trait` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Hobby" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Trait" DROP COLUMN "userId";
