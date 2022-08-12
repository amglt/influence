/*
  Warnings:

  - You are about to drop the column `bigPercoLoosePoints` on the `Scale` table. All the data in the column will be lost.
  - You are about to drop the column `bigPercoWinPoints` on the `Scale` table. All the data in the column will be lost.
  - You are about to drop the column `bigPrismLoosePoints` on the `Scale` table. All the data in the column will be lost.
  - You are about to drop the column `bigPrismWinPoints` on the `Scale` table. All the data in the column will be lost.
  - You are about to drop the column `percoLoosePoints` on the `Scale` table. All the data in the column will be lost.
  - You are about to drop the column `percoWinPoints` on the `Scale` table. All the data in the column will be lost.
  - You are about to drop the column `prismLoosePoints` on the `Scale` table. All the data in the column will be lost.
  - You are about to drop the column `prismWinPoints` on the `Scale` table. All the data in the column will be lost.
  - Added the required column `bigPercoAttackLoosePoints` to the `Scale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bigPercoAttackWinPoints` to the `Scale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bigPercoDefLoosePoints` to the `Scale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bigPercoDefWinPoints` to the `Scale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bigPrismAttackLoosePoints` to the `Scale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bigPrismAttackWinPoints` to the `Scale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bigPrismDefLoosePoints` to the `Scale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bigPrismDefWinPoints` to the `Scale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percoAttackLoosePoints` to the `Scale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percoAttackWinPoints` to the `Scale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percoDefLoosePoints` to the `Scale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percoDefWinPoints` to the `Scale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prismAttackLoosePoints` to the `Scale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prismAttackWinPoints` to the `Scale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prismDefLoosePoints` to the `Scale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prismDefWinPoints` to the `Scale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Scale" DROP COLUMN "bigPercoLoosePoints",
DROP COLUMN "bigPercoWinPoints",
DROP COLUMN "bigPrismLoosePoints",
DROP COLUMN "bigPrismWinPoints",
DROP COLUMN "percoLoosePoints",
DROP COLUMN "percoWinPoints",
DROP COLUMN "prismLoosePoints",
DROP COLUMN "prismWinPoints",
ADD COLUMN     "bigPercoAttackLoosePoints" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "bigPercoAttackWinPoints" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "bigPercoDefLoosePoints" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "bigPercoDefWinPoints" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "bigPrismAttackLoosePoints" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "bigPrismAttackWinPoints" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "bigPrismDefLoosePoints" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "bigPrismDefWinPoints" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "percoAttackLoosePoints" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "percoAttackWinPoints" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "percoDefLoosePoints" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "percoDefWinPoints" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "prismAttackLoosePoints" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "prismAttackWinPoints" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "prismDefLoosePoints" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "prismDefWinPoints" DOUBLE PRECISION NOT NULL;
