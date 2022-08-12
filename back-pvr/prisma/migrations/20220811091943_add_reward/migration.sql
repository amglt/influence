-- AlterTable
ALTER TABLE "Period" ADD COLUMN     "reward" DECIMAL(29,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PlayerPeriod" ADD COLUMN     "rewarded" BOOLEAN NOT NULL DEFAULT false;
