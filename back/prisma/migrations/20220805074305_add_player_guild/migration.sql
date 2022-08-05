-- AlterTable
ALTER TABLE "PlayerPeriod" ADD COLUMN     "playerGuild" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "playerName" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "PvpGame" ADD COLUMN     "player1Guild" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "player2Guild" TEXT,
ADD COLUMN     "player3Guild" TEXT,
ADD COLUMN     "player4Guild" TEXT,
ADD COLUMN     "player5Guild" TEXT;
