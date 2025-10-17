/*
  Warnings:

  - Added the required column `instructor` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Class" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "instructor" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "capacity" INTEGER NOT NULL
);
INSERT INTO "new_Class" ("capacity", "endTime", "id", "instructor", "level", "name", "startTime") SELECT "capacity", "endTime", "id", 'Instructor por defecto', 'Principiante', "name", "startTime" FROM "Class";
DROP TABLE "Class";
ALTER TABLE "new_Class" RENAME TO "Class";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
