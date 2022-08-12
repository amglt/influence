-- AlterTable
ALTER TABLE "PvpGame" ADD COLUMN     "userOnPeriodId" INTEGER;

-- AddForeignKey
ALTER TABLE "PvpGame" ADD CONSTRAINT "PvpGame_userOnPeriodId_fkey" FOREIGN KEY ("userOnPeriodId") REFERENCES "UsersOnPeriods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
