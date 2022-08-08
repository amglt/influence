/*
  Warnings:

  - You are about to drop the column `playerGuild` on the `PlayerPeriod` table. All the data in the column will be lost.
  - You are about to drop the column `playerName` on the `PlayerPeriod` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlayerPeriod" DROP COLUMN "playerGuild",
DROP COLUMN "playerName";
