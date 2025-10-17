/*
  Warnings:

  - Made the column `planId` on table `Membership` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Membership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userEmail" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "creditsLeft" INTEGER,
    "endDate" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    CONSTRAINT "Membership_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Membership_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Membership" ("creditsLeft", "endDate", "id", "isActive", "planId", "userEmail") SELECT "creditsLeft", "endDate", "id", "isActive", "planId", "userEmail" FROM "Membership";
DROP TABLE "Membership";
ALTER TABLE "new_Membership" RENAME TO "Membership";
CREATE UNIQUE INDEX "Membership_userEmail_key" ON "Membership"("userEmail");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
