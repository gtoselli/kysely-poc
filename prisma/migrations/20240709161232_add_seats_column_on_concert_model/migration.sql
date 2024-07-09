/*
  Warnings:

  - Added the required column `seats` to the `concerts` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_concerts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "seats" TEXT NOT NULL
);
INSERT INTO "new_concerts" ("id", "title") SELECT "id", "title" FROM "concerts";
DROP TABLE "concerts";
ALTER TABLE "new_concerts" RENAME TO "concerts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
