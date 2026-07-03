/*
  Warnings:

  - You are about to drop the column `departureLocation` on the `Carpool` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Carpool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "activityId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "departureTime" DATETIME,
    CONSTRAINT "Carpool_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Carpool_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Carpool" ("activityId", "departureTime", "driverId", "id", "seats") SELECT "activityId", "departureTime", "driverId", "id", "seats" FROM "Carpool";
DROP TABLE "Carpool";
ALTER TABLE "new_Carpool" RENAME TO "Carpool";
CREATE TABLE "new_Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "activityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "paidById" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Expense_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Expense_paidById_fkey" FOREIGN KEY ("paidById") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Expense_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Expense" ("activityId", "amount", "createdAt", "id", "paidById", "title") SELECT "activityId", "amount", "createdAt", "id", "paidById", "title" FROM "Expense";
DROP TABLE "Expense";
ALTER TABLE "new_Expense" RENAME TO "Expense";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
