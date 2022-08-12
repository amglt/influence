/*
  Warnings:

  - Added the required column `screenshotUrl` to the `PvpGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PvpGame" ADD COLUMN     "screenshotUrl" TEXT NOT NULL;
