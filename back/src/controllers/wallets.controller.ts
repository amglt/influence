import { Request, Response, Router } from 'express';
import { checkPermissions } from '../middlewares/permission.middleware';
import { prisma } from '../db';
import { Wallet } from '@prisma/client';

const walletsRouter = Router();

walletsRouter.get(
  '/',
  checkPermissions('read:wallets'),
  async (req: Request, res: Response) => {
    try {
      const wallets = await prisma.wallet.findMany({
        include: {
          user: true,
        },
      });
      return res.status(200).send(wallets);
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  },
);

walletsRouter.get(
  '/transactions',
  checkPermissions('read:wallets'),
  async (req: Request, res: Response) => {
    try {
      const transactions = await prisma.walletTransaction.findMany({
        include: {
          requester: true,
          walletFrom: {
            include: {
              user: true,
            },
          },
          walletTo: {
            include: {
              user: true,
            },
          },
        },
      });
      return res.status(200).send(transactions);
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  },
);

walletsRouter.post(
  '/transaction',
  checkPermissions('write:wallets'),
  async (req: Request, res: Response) => {
    try {
      const { walletFromId, walletToId, amount, requesterId } = req.body;
      if (!walletFromId && !walletToId)
        return res
          .status(400)
          .send({ message: 'Un moins un porte-feuille doit être renseigné' });
      if (!amount)
        return res
          .status(400)
          .send({ message: 'Un montant doit être renseigné' });
      if (!requesterId)
        return res
          .status(400)
          .send({ message: 'Un requester doit être renseigné' });

      let walletFrom: Wallet | null = null;
      if (walletFromId)
        walletFrom = await prisma.wallet.findFirst({
          where: {
            id: Number(walletFromId),
          },
        });
      let walletTo: Wallet | null = null;
      if (walletToId)
        walletTo = await prisma.wallet.findFirst({
          where: {
            id: Number(walletToId),
          },
        });

      if (walletFrom && walletTo) {
        if (walletFrom.balance < amount)
          return res
            .status(400)
            .send({ message: `Vous n'avez pas les fonds suffisants` });

        await prisma.wallet.update({
          where: { id: Number(walletFromId) },
          data: {
            balance: {
              decrement: amount,
            },
          },
        });
        await prisma.wallet.update({
          where: { id: Number(walletToId) },
          data: {
            balance: {
              increment: amount,
            },
          },
        });
        await prisma.walletTransaction.create({
          data: {
            walletFromId: Number(walletFromId),
            walletToId: Number(walletToId),
            amount: Number(amount),
            requesterId: Number(requesterId),
            createdAt: new Date(),
          },
        });
      } else if (!walletFrom) {
        await prisma.wallet.update({
          where: { id: walletToId },
          data: { balance: { increment: amount } },
        });
        await prisma.walletTransaction.create({
          data: {
            walletFromId: null,
            walletToId: Number(walletToId),
            amount: Number(amount),
            requesterId: Number(requesterId),
            createdAt: new Date(),
          },
        });
      } else {
        if (walletFrom.balance < amount)
          return res
            .status(400)
            .send({ message: `Vous n'avez pas les fonds suffisants` });

        await prisma.wallet.update({
          where: { id: Number(walletFromId) },
          data: {
            balance: {
              decrement: amount,
            },
          },
        });
        await prisma.walletTransaction.create({
          data: {
            walletFromId: Number(walletFromId),
            walletToId: null,
            amount: Number(amount),
            requesterId: Number(requesterId),
            createdAt: new Date(),
          },
        });
      }
      return res.status(200).send({});
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  },
);

export { walletsRouter };
