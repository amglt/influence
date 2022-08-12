/*
  Warnings:

  - The primary key for the `PlayerPeriod` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PlayerPeriod` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlayerPeriod" DROP CONSTRAINT "PlayerPeriod_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "PlayerPeriod_pkey" PRIMARY KEY ("playerId", "periodId");
