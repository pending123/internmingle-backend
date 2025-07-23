/*
  Warnings:

  - You are about to drop the column `numOfRoomates` on the `User` table. All the data in the column will be lost.
  - Added the required column `profileCompleted` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `firstName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `university` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `company` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `workPosition` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `workZipcode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `internshipStartDate` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `internshipEndDate` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `schoolMajor` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isLookingForHousing` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `workCity` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "numOfRoomates",
ADD COLUMN     "numOfRoommates" INTEGER,
ADD COLUMN     "profileCompleted" BOOLEAN NOT NULL,
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "university" SET NOT NULL,
ALTER COLUMN "company" SET NOT NULL,
ALTER COLUMN "workPosition" SET NOT NULL,
DROP COLUMN "workZipcode",
ADD COLUMN     "workZipcode" INTEGER NOT NULL,
ALTER COLUMN "internshipStartDate" SET NOT NULL,
ALTER COLUMN "internshipEndDate" SET NOT NULL,
ALTER COLUMN "schoolMajor" SET NOT NULL,
ALTER COLUMN "isLookingForHousing" SET NOT NULL,
ALTER COLUMN "workCity" SET NOT NULL,
ALTER COLUMN "workCity" SET DATA TYPE TEXT;
