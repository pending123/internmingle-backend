/*
  Warnings:

  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerkId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workCity` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "gender",
ADD COLUMN     "workCity" INTEGER NOT NULL,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "User_workCity_idx" ON "User"("workCity");

-- CreateIndex
CREATE INDEX "User_isLookingForHousing_idx" ON "User"("isLookingForHousing");
