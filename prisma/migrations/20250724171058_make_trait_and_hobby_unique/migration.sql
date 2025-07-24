/*
  Warnings:

  - A unique constraint covering the columns `[hobby]` on the table `Hobby` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[trait]` on the table `Trait` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Hobby_hobby_key" ON "Hobby"("hobby");

-- CreateIndex
CREATE UNIQUE INDEX "Trait_trait_key" ON "Trait"("trait");
