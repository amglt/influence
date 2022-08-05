-- AlterTable
ALTER TABLE "PvpGame" ADD COLUMN     "player1Name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "player2Name" TEXT,
ADD COLUMN     "player3Name" TEXT,
ADD COLUMN     "player4Name" TEXT,
ADD COLUMN     "player5Name" TEXT;
