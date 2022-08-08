/*
  Warnings:

  - The primary key for the `PlayerPeriod` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `player1` on the `PvpGame` table. All the data in the column will be lost.
  - You are about to drop the column `player1Guild` on the `PvpGame` table. All the data in the column will be lost.
  - You are about to drop the column `player1Name` on the `PvpGame` table. All the data in the column will be lost.
  - You are about to drop the column `player2` on the `PvpGame` table. All the data in the column will be lost.
  - You are about to drop the column `player2Guild` on the `PvpGame` table. All the data in the column will be lost.
  - You are about to drop the column `player2Name` on the `PvpGame` table. All the data in the column will be lost.
  - You are about to drop the column `player3` on the `PvpGame` table. All the data in the column will be lost.
  - You are about to drop the column `player3Guild` on the `PvpGame` table. All the data in the column will be lost.
  - You are about to drop the column `player3Name` on the `PvpGame` table. All the data in the column will be lost.
  - You are about to drop the column `player4` on the `PvpGame` table. All the data in the column will be lost.
  - You are about to drop the column `player4Guild` on the `PvpGame` table. All the data in the column will be lost.
  - You are about to drop the column `player4Name` on the `PvpGame` table. All the data in the column will be lost.
  - You are about to drop the column `player5` on the `PvpGame` table. All the data in the column will be lost.
  - You are about to drop the column `player5Guild` on the `PvpGame` table. All the data in the column will be lost.
  - You are about to drop the column `player5Name` on the `PvpGame` table. All the data in the column will be lost.
  - Changed the type of `userId` on the `Account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `playerId` on the `PlayerPeriod` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `player1Id` to the `PvpGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "userId",
ADD COLUMN     "userId" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "PlayerPeriod" DROP CONSTRAINT "PlayerPeriod_pkey",
DROP COLUMN "playerId",
ADD COLUMN     "playerId" BIGINT NOT NULL,
ADD CONSTRAINT "PlayerPeriod_pkey" PRIMARY KEY ("playerId", "periodId");

-- AlterTable
ALTER TABLE "PvpGame" DROP COLUMN "player1",
DROP COLUMN "player1Guild",
DROP COLUMN "player1Name",
DROP COLUMN "player2",
DROP COLUMN "player2Guild",
DROP COLUMN "player2Name",
DROP COLUMN "player3",
DROP COLUMN "player3Guild",
DROP COLUMN "player3Name",
DROP COLUMN "player4",
DROP COLUMN "player4Guild",
DROP COLUMN "player4Name",
DROP COLUMN "player5",
DROP COLUMN "player5Guild",
DROP COLUMN "player5Name",
ADD COLUMN     "player1Id" BIGINT NOT NULL,
ADD COLUMN     "player2Id" BIGINT,
ADD COLUMN     "player3Id" BIGINT,
ADD COLUMN     "player4Id" BIGINT,
ADD COLUMN     "player5Id" BIGINT;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PvpGame" ADD CONSTRAINT "PvpGame_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PvpGame" ADD CONSTRAINT "PvpGame_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PvpGame" ADD CONSTRAINT "PvpGame_player3Id_fkey" FOREIGN KEY ("player3Id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PvpGame" ADD CONSTRAINT "PvpGame_player4Id_fkey" FOREIGN KEY ("player4Id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PvpGame" ADD CONSTRAINT "PvpGame_player5Id_fkey" FOREIGN KEY ("player5Id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerPeriod" ADD CONSTRAINT "PlayerPeriod_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
