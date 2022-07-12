-- CreateTable
CREATE TABLE "WalletRecord" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "walletIdFrom" INTEGER,
    "walletIdTo" INTEGER,

    CONSTRAINT "WalletRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "influcoinBalance" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WalletRecord" ADD CONSTRAINT "WalletRecord_walletIdFrom_fkey" FOREIGN KEY ("walletIdFrom") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletRecord" ADD CONSTRAINT "WalletRecord_walletIdTo_fkey" FOREIGN KEY ("walletIdTo") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
