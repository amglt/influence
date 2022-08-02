/*
  Warnings:

  - You are about to drop the column `userOnPeriodId` on the `PvpGame` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PvpGame" DROP CONSTRAINT "PvpGame_userOnPeriodId_fkey";

-- AlterTable
ALTER TABLE "PvpGame" DROP COLUMN "userOnPeriodId";

-- CreateTable
CREATE TABLE "_PvpGameToUsersOnPeriods" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PvpGameToUsersOnPeriods_AB_unique" ON "_PvpGameToUsersOnPeriods"("A", "B");

-- CreateIndex
CREATE INDEX "_PvpGameToUsersOnPeriods_B_index" ON "_PvpGameToUsersOnPeriods"("B");

-- AddForeignKey
ALTER TABLE "_PvpGameToUsersOnPeriods" ADD CONSTRAINT "_PvpGameToUsersOnPeriods_A_fkey" FOREIGN KEY ("A") REFERENCES "PvpGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PvpGameToUsersOnPeriods" ADD CONSTRAINT "_PvpGameToUsersOnPeriods_B_fkey" FOREIGN KEY ("B") REFERENCES "UsersOnPeriods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
