/*
  Warnings:

  - You are about to alter the column `totalPoints` on the `PlayerPeriod` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `gamePoints` on the `PvpGame` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `percoNDPoints` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `prismNDPoints` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `bigPercoNDPoints` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `bigPrismNDPoints` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `avaWin` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `avaLoose` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `bigPercoAttackLoosePoints` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `bigPercoAttackWinPoints` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `bigPercoDefLoosePoints` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `bigPercoDefWinPoints` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `bigPrismAttackLoosePoints` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `bigPrismAttackWinPoints` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `bigPrismDefLoosePoints` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `bigPrismDefWinPoints` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `percoAttackLoosePoints` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `percoAttackWinPoints` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `percoDefLoosePoints` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `percoDefWinPoints` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `prismAttackLoosePoints` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `prismAttackWinPoints` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `prismDefLoosePoints` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.
  - You are about to alter the column `prismDefWinPoints` on the `Scale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(29,2)`.

*/
-- AlterTable
ALTER TABLE "PlayerPeriod" ALTER COLUMN "totalPoints" SET DATA TYPE DECIMAL(29,2);

-- AlterTable
ALTER TABLE "PvpGame" ALTER COLUMN "gamePoints" SET DATA TYPE DECIMAL(29,2);

-- AlterTable
ALTER TABLE "Scale" ALTER COLUMN "percoNDPoints" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "prismNDPoints" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "bigPercoNDPoints" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "bigPrismNDPoints" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "avaWin" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "avaLoose" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "bigPercoAttackLoosePoints" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "bigPercoAttackWinPoints" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "bigPercoDefLoosePoints" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "bigPercoDefWinPoints" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "bigPrismAttackLoosePoints" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "bigPrismAttackWinPoints" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "bigPrismDefLoosePoints" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "bigPrismDefWinPoints" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "percoAttackLoosePoints" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "percoAttackWinPoints" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "percoDefLoosePoints" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "percoDefWinPoints" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "prismAttackLoosePoints" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "prismAttackWinPoints" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "prismDefLoosePoints" SET DATA TYPE DECIMAL(29,2),
ALTER COLUMN "prismDefWinPoints" SET DATA TYPE DECIMAL(29,2);
