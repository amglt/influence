import { Router, Request, Response } from 'express';
import { checkPermissions } from '../middlewares/permission.middleware';
import { prisma } from '../db';
import { getManagementClient } from '../shared/utils';
import { Wallet } from '@prisma/client';
import { User, AppMetadata, UserMetadata } from 'auth0';

const walletsRouter = Router();
const recordsRouter = Router();

// Get all wallets
walletsRouter.get(
  '/',
  // checkPermissions('read:wallets'),
  async (_: Request, res: Response) => {
    try {
      const wallets = await prisma.wallet.findMany();

      const client = getManagementClient('read:users read:user_idp_tokens');
      const users = await client.getUsers();

      const walletsAndUsers = wallets.map((wallet) => {
        const user = users.find((u) => u.user_id === wallet.userId);
        return { ...wallet, user };
      });

      return res.status(200).send(walletsAndUsers);
    } catch (err) {
      return res.status(500).send();
    }
  },
);

// Get wallet by Id
// Route : /wallets/:walletId
walletsRouter.get(
  '/:walletId',
  // checkPermissions('read:wallets'),
  async (req: Request, res: Response) => {
    try {
      const walletId = req.params.walletId;
      if (!walletId) {
        return res.status(400).send({ message: `Wallet ID manquant` });
      }

      const wallet = await prisma.wallet.findFirst({
        where: {
          id: Number(walletId),
        },
      });

      if (!wallet) {
        return res.status(400).send({ message: `Wallet non trouvé` });
      }

      const client = getManagementClient('read:users read:user_idp_tokens');
      const user = await client.getUser({ id: wallet.userId });

      return res.status(200).send({ ...wallet, user });
    } catch (err) {
      return res.status(500).send();
    }
  },
);

// Create new user wallet
// Route : /wallets
walletsRouter.post(
  '/',
  //checkPermissions('write:wallets'),
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      if (!body.hasOwnProperty('userId'))
        return res.status(400).send({ message: 'UserId manquant.' });

      const wallet = await prisma.wallet.findFirst({
        where: {
          userId: req.body.userId,
        },
      });
      if (wallet)
        return res
          .status(400)
          .send({ message: 'Cet utilisateur possède déjà un wallet.' });

      const newWallet = await prisma.wallet.create({
        data: {
          userId: req.body.userId,
          balance: 0,
        },
      });
      return res.status(200).send(newWallet);
    } catch (err) {
      return res.status(500).send();
    }
  },
);

// Create new transaction
// Route : /records
recordsRouter.post(
  '/',
  //checkPermissions('write:records'),
  async (req: Request, res: Response) => {
    try {
      const body = req.body;

      if (!body.hasOwnProperty('amount'))
        return res.status(400).send({ message: 'Montant manquant.' });

      if (!body.hasOwnProperty('walletIdFrom'))
        return res.status(400).send({ message: 'Emetteur manquant.' });

      if (!body.hasOwnProperty('walletIdTo'))
        return res.status(400).send({ message: 'Destinataire manquant.' });

      const amount = body.amount;
      const walletIdFrom = Number(req.body.walletIdFrom);
      const walletIdTo = Number(req.body.walletIdTo);

      const walletFrom = await prisma.wallet.findUnique({
        where: {
          id: walletIdFrom,
        },
      });

      if (amount <= 0)
        return res.status(400).send({
          message:
            'Transaction impossible : Le montant de la transaction doit être positif.',
        });

      if (amount > walletFrom!.balance)
        return res.status(400).send({
          message: `Transaction impossible : L'émetteur n'a pas assez d'influtons (${
            walletFrom!.balance
          }).`,
        });

      // update wallets
      await prisma.wallet.update({
        where: {
          id: walletIdFrom,
        },
        data: {
          balance: {
            increment: -amount,
          },
        },
      });

      await prisma.wallet.update({
        where: {
          id: walletIdTo,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      const newRecord = await prisma.walletRecord.create({
        data: {
          walletIdFrom: walletIdFrom,
          walletIdTo: walletIdTo,
          amount: amount,
        },
      });

      return res.status(200).send(newRecord);
    } catch (err) {
      return res.status(500).send();
    }
  },
);

// Get all wallet records
// Route : /records
recordsRouter.get(
  '/',
  // checkPermissions('read:records')
  async (_: Request, res: Response) => {
    try {
      const walletRecords = await prisma.walletRecord.findMany();

      const client = getManagementClient('read:users read:user_idp_tokens');
      const users = await client.getUsers();
      const wallets = await prisma.wallet.findMany();

      const walletRecordsAndUsers = walletRecords.map((record) => {
        const walletFrom = wallets.find((w) => w.id === record.walletIdFrom);
        const userFrom = users.find((u) => u.user_id === walletFrom?.userId);

        const walletTo = wallets.find((w) => w.id === record.walletIdTo);
        const userTo = users.find((u) => u.user_id === walletTo?.userId);

        return { ...record, userFrom, userTo };
      });

      return res.status(200).send(walletRecordsAndUsers);
    } catch (err) {
      return res.status(500).send();
    }
  },
);

// Get a specific record, by its Id
// Route : /records/:recordId
recordsRouter.get(
  '/:recordId',
  // checkPermissions('read:records'),
  async (req: Request, res: Response) => {
    try {
      const recordId = req.params.recordId;
      if (!recordId) {
        return res.status(400).send({ message: `Record ID manquant` });
      }

      const record = await prisma.walletRecord.findFirst({
        where: {
          id: Number(recordId),
        },
      });

      if (!record) {
        return res.status(400).send({ message: `Record non trouvé` });
      }

      return res.status(200).send(record);
    } catch (err) {
      return res.status(500).send();
    }
  },
);

export { walletsRouter, recordsRouter };