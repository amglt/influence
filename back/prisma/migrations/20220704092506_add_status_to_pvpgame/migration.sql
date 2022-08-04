/*
  Warnings:

  - Added the required column `status` to the `PVPGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PVPGame" ADD COLUMN     "status" INTEGER NOT NULL;
