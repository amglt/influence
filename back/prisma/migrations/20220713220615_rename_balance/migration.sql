/*
  Warnings:

  - You are about to drop the column `influcoinBalance` on the `Wallet` table. All the data in the column will be lost.
  - Added the required column `balance` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "influcoinBalance",
ADD COLUMN     "balance" INTEGER NOT NULL;
