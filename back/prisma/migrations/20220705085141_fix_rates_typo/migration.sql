/*
  Warnings:

  - You are about to drop the column `gameAmount` on the `RegressiveRate` table. All the data in the column will be lost.
  - Added the required column `gamesAmount` to the `RegressiveRate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RegressiveRate" DROP COLUMN "gameAmount",
ADD COLUMN     "gamesAmount" INTEGER NOT NULL;
