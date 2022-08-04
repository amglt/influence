/*
  Warnings:

  - You are about to drop the column `earnedPoints` on the `PVPGame` table. All the data in the column will be lost.
  - You are about to drop the column `opponentId` on the `PVPGame` table. All the data in the column will be lost.
  - You are about to drop the `Opponent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PVPGame" DROP CONSTRAINT "PVPGame_opponentId_fkey";

-- AlterTable
ALTER TABLE "PVPGame" DROP COLUMN "earnedPoints",
DROP COLUMN "opponentId";

-- DropTable
DROP TABLE "Opponent";

-- CreateTable
CREATE TABLE "UsersOnPeriods" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "periodId" INTEGER NOT NULL,
    "totalPoints" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "UsersOnPeriods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scale" (
    "id" SERIAL NOT NULL,
    "percoWinPoints" INTEGER NOT NULL,
    "percoNDPoints" INTEGER NOT NULL,
    "percoLoosePoints" INTEGER NOT NULL,
    "prismWinPoints" INTEGER NOT NULL,
    "prismNDPoints" INTEGER NOT NULL,
    "prismLoosePoints" INTEGER NOT NULL,
    "bigPercoWinPoints" INTEGER NOT NULL,
    "bigPercoNDPoints" INTEGER NOT NULL,
    "bigPercoLoosePoints" INTEGER NOT NULL,
    "bigPrismWinPoints" INTEGER NOT NULL,
    "bigPrismNDPoints" INTEGER NOT NULL,
    "bigPrismLoosePoints" INTEGER NOT NULL,
    "avaWin" INTEGER NOT NULL,
    "avaLoose" INTEGER NOT NULL,

    CONSTRAINT "Scale_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UsersOnPeriods" ADD CONSTRAINT "UsersOnPeriods_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
