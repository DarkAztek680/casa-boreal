-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userEmail" TEXT NOT NULL,
    "planType" TEXT NOT NULL,
    "creditsLeft" INTEGER,
    "endDate" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    CONSTRAINT "Membership_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userEmail_key" ON "Membership"("userEmail");
