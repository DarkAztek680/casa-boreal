/*
  Warnings:

  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Membership` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `creditsLeft` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `Membership` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Membership` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to drop the column `birthdate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Plan";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Membership" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL DEFAULT 1,
    "plan" TEXT NOT NULL DEFAULT 'Barre Básico',
    "expiresAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Membership" ("id", "userId", "plan", "expiresAt", "createdAt")
SELECT "id", 1, 'Barre Básico', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM "Membership";
DROP TABLE "Membership";
ALTER TABLE "new_Membership" RENAME TO "Membership";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "role" TEXT NOT NULL DEFAULT 'CLIENTE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password", "updatedAt")
SELECT "createdAt", "email", "id", "name", "password", CURRENT_TIMESTAMP FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
