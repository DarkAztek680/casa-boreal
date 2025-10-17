/*
  Warnings:

  - You are about to drop the column `planType` on the `Membership` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Membership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userEmail" TEXT NOT NULL,
    "planId" TEXT,
    "creditsLeft" INTEGER,
    "endDate" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    CONSTRAINT "Membership_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Membership_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Membership" ("creditsLeft", "endDate", "id", "isActive", "userEmail") SELECT "creditsLeft", "endDate", "id", "isActive", "userEmail" FROM "Membership";
DROP TABLE "Membership";
ALTER TABLE "new_Membership" RENAME TO "Membership";
CREATE UNIQUE INDEX "Membership_userEmail_key" ON "Membership"("userEmail");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
