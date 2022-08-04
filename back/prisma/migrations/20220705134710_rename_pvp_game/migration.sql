/*
  Warnings:

  - You are about to drop the `PVPGame` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PVPGame" DROP CONSTRAINT "PVPGame_periodId_fkey";

-- DropTable
DROP TABLE "PVPGame";

-- CreateTable
CREATE TABLE "PvpGame" (
    "id" SERIAL NOT NULL,
    "result" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "player1" TEXT NOT NULL,
    "player2" TEXT,
    "player3" TEXT,
    "player4" TEXT,
    "player5" TEXT,
    "periodId" INTEGER NOT NULL,

    CONSTRAINT "PvpGame_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PvpGame" ADD CONSTRAINT "PvpGame_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
