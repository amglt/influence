/*
  Warnings:

  - Changed the type of `result` on the `PvpGame` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `PvpGame` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PvpGame" DROP COLUMN "result",
ADD COLUMN     "result" INTEGER NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" INTEGER NOT NULL;
