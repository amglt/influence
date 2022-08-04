/*
  Warnings:

  - You are about to drop the `RegressiveRate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsersOnPeriods` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PvpGameToUsersOnPeriods` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `requester` to the `PvpGame` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UsersOnPeriods" DROP CONSTRAINT "UsersOnPeriods_periodId_fkey";

-- DropForeignKey
ALTER TABLE "_PvpGameToUsersOnPeriods" DROP CONSTRAINT "_PvpGameToUsersOnPeriods_A_fkey";

-- DropForeignKey
ALTER TABLE "_PvpGameToUsersOnPeriods" DROP CONSTRAINT "_PvpGameToUsersOnPeriods_B_fkey";

-- AlterTable
ALTER TABLE "PvpGame" ADD COLUMN     "requester" TEXT NOT NULL;

-- DropTable
DROP TABLE "RegressiveRate";

-- DropTable
DROP TABLE "UsersOnPeriods";

-- DropTable
DROP TABLE "_PvpGameToUsersOnPeriods";
