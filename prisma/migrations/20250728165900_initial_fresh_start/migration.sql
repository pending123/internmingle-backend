-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "clerkId" TEXT NOT NULL,
    "profileCompleted" BOOLEAN DEFAULT false,
    "firstName" TEXT,
    "lastName" TEXT,
    "birthday" TIMESTAMP(3),
    "bio" TEXT,
    "gender" TEXT,
    "university" TEXT,
    "company" TEXT,
    "workPosition" TEXT,
    "workZipcode" TEXT,
    "workCity" TEXT,
    "internshipStartDate" TIMESTAMP(3),
    "internshipEndDate" TIMESTAMP(3),
    "schoolMajor" TEXT,
    "isLookingForHousing" BOOLEAN,
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
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "placeId" TEXT,
    "placeName" TEXT,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "imgUrl" TEXT,
    "userId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "Trait" (
    "traitId" SERIAL NOT NULL,
    "trait" TEXT NOT NULL,

    CONSTRAINT "Trait_pkey" PRIMARY KEY ("traitId")
);

-- CreateTable
CREATE TABLE "Hobby" (
    "hobbyId" SERIAL NOT NULL,
    "hobby" TEXT NOT NULL,

    CONSTRAINT "Hobby_pkey" PRIMARY KEY ("hobbyId")
);

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
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "User_workCity_idx" ON "User"("workCity");

-- CreateIndex
CREATE INDEX "User_isLookingForHousing_idx" ON "User"("isLookingForHousing");

-- CreateIndex
CREATE UNIQUE INDEX "Trait_trait_key" ON "Trait"("trait");

-- CreateIndex
CREATE UNIQUE INDEX "Hobby_hobby_key" ON "Hobby"("hobby");

-- AddForeignKey
ALTER TABLE "Forum" ADD CONSTRAINT "Forum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrait" ADD CONSTRAINT "UserTrait_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrait" ADD CONSTRAINT "UserTrait_traitId_fkey" FOREIGN KEY ("traitId") REFERENCES "Trait"("traitId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHobby" ADD CONSTRAINT "UserHobby_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHobby" ADD CONSTRAINT "UserHobby_hobbyId_fkey" FOREIGN KEY ("hobbyId") REFERENCES "Hobby"("hobbyId") ON DELETE CASCADE ON UPDATE CASCADE;
