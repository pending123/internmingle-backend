/*
  Warnings:

  - You are about to drop the `_HobbyToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TraitToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_HobbyToUser" DROP CONSTRAINT "_HobbyToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_HobbyToUser" DROP CONSTRAINT "_HobbyToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_TraitToUser" DROP CONSTRAINT "_TraitToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_TraitToUser" DROP CONSTRAINT "_TraitToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileCompleted" BOOLEAN DEFAULT false,
ADD COLUMN     "workCity" TEXT,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "university" DROP NOT NULL,
ALTER COLUMN "company" DROP NOT NULL,
ALTER COLUMN "workPosition" DROP NOT NULL,
ALTER COLUMN "workZipcode" DROP NOT NULL,
ALTER COLUMN "internshipStartDate" DROP NOT NULL,
ALTER COLUMN "internshipEndDate" DROP NOT NULL,
ALTER COLUMN "schoolMajor" DROP NOT NULL,
ALTER COLUMN "isLookingForHousing" DROP NOT NULL;

-- DropTable
DROP TABLE "_HobbyToUser";

-- DropTable
DROP TABLE "_TraitToUser";

-- CreateTable
CREATE TABLE "UserTrait" (
    "userId" INTEGER NOT NULL,
    "traitId" INTEGER NOT NULL,

    CONSTRAINT "UserTrait_pkey" PRIMARY KEY ("userId","traitId")
);

-- CreateTable
CREATE TABLE "UserHobby" (
    "userId" INTEGER NOT NULL,
    "hobbyId" INTEGER NOT NULL,

    CONSTRAINT "UserHobby_pkey" PRIMARY KEY ("userId","hobbyId")
);

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "User_workCity_idx" ON "User"("workCity");

-- CreateIndex
CREATE INDEX "User_isLookingForHousing_idx" ON "User"("isLookingForHousing");

-- AddForeignKey
ALTER TABLE "UserTrait" ADD CONSTRAINT "UserTrait_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrait" ADD CONSTRAINT "UserTrait_traitId_fkey" FOREIGN KEY ("traitId") REFERENCES "Trait"("traitId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHobby" ADD CONSTRAINT "UserHobby_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHobby" ADD CONSTRAINT "UserHobby_hobbyId_fkey" FOREIGN KEY ("hobbyId") REFERENCES "Hobby"("hobbyId") ON DELETE CASCADE ON UPDATE CASCADE;
