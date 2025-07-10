-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "clerkId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthday" TIMESTAMP(3),
    "bio" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "workPosition" TEXT NOT NULL,
    "workZipcode" TEXT NOT NULL,
    "internshipStartDate" TIMESTAMP(3) NOT NULL,
    "internshipEndDate" TIMESTAMP(3) NOT NULL,
    "schoolMajor" TEXT NOT NULL,
    "isLookingForHousing" BOOLEAN NOT NULL,
    "sleepSchedule" TEXT,
    "numOfRoomates" INTEGER,
    "noiseLevel" TEXT,
    "budgetRange" INTEGER,
    "instagram" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "facebook" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Forum" (
    "forumId" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "textContent" TEXT NOT NULL,
    "imgUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upvotes" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Forum_pkey" PRIMARY KEY ("forumId")
);

-- CreateTable
CREATE TABLE "Event" (
    "eventId" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "imgUrl" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "Trait" (
    "traitId" SERIAL NOT NULL,
    "trait" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Trait_pkey" PRIMARY KEY ("traitId")
);

-- CreateTable
CREATE TABLE "Hobby" (
    "hobbyId" SERIAL NOT NULL,
    "hobby" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Hobby_pkey" PRIMARY KEY ("hobbyId")
);

-- CreateTable
CREATE TABLE "_TraitToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TraitToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_HobbyToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_HobbyToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "_TraitToUser_B_index" ON "_TraitToUser"("B");

-- CreateIndex
CREATE INDEX "_HobbyToUser_B_index" ON "_HobbyToUser"("B");

-- AddForeignKey
ALTER TABLE "Forum" ADD CONSTRAINT "Forum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TraitToUser" ADD CONSTRAINT "_TraitToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Trait"("traitId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TraitToUser" ADD CONSTRAINT "_TraitToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HobbyToUser" ADD CONSTRAINT "_HobbyToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Hobby"("hobbyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HobbyToUser" ADD CONSTRAINT "_HobbyToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
