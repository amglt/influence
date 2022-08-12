/*
  Warnings:

  - Changed the type of `requester` on the `PvpGame` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PvpGame" DROP COLUMN "requester",
ADD COLUMN     "requester" BIGINT NOT NULL;
