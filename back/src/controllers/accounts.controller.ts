import { Router, Request, Response } from 'express';
import { checkPermissions } from '../middlewares/permission.middleware';
import { prisma } from '../db';

const accountsRouter = Router();

accountsRouter.get(
  '/',
  checkPermissions('read:accounts'),
  async (_: Request, res: Response) => {
    try {
      const accounts = await prisma.account.findMany();
      return res
        .status(200)
        .send(accounts.map((acc) => ({ ...acc, userId: Number(acc.userId) })));
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
);

accountsRouter.get(
  '/:accountId',
  checkPermissions('read:accounts'),
  async (req: Request, res: Response) => {
    try {
      const accountId = req.params.accountId;
      if (!accountId) {
        return res.status(400).send({ message: `Account ID manquant` });
      }

      const account = await prisma.account.findFirst({
        where: {
          id: Number(accountId),
        },
        include: {
          user: true,
        },
      });

      if (!account) {
        return res.status(400).send({ message: `Compte non trouvé` });
      }

      return res.status(200).send(account);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
);

accountsRouter.get(
  '/user/:userId',
  checkPermissions('read:accounts'),
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).send({ message: `User ID manquant` });
      }

      const accounts = await prisma.account.findMany({
        where: {
          userId: Number(userId),
        },
      });

      return res
        .status(200)
        .send(accounts.map((acc) => ({ ...acc, userId: acc.userId })));
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
);

accountsRouter.post(
  '/',
  checkPermissions('write:accounts'),
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      if (!body.hasOwnProperty('userId'))
        return res.status(400).send({ message: 'Username manquant.' });

      if (!body.hasOwnProperty('name'))
        return res
          .status(400)
          .send({ message: 'Nom de compte Dofus manquant.' });

      const accounts = await prisma.account.findMany();

      if (accounts.some((account) => account.name === req.body.name))
        return res
          .status(400)
          .send({ message: 'Ce nom de compte Dofus existe déjà.' });

      const newAccount = await prisma.account.create({
        data: {
          userId: Number(req.body.userId),
          name: req.body.name,
        },
      });
      return res
        .status(200)
        .send({ ...newAccount, userId: Number(newAccount.userId) });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
);

accountsRouter.put(
  '/:accountId',
  checkPermissions('write:accounts'),
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const accountId = Number(req.params.accountId);
      if (!body.hasOwnProperty('userId'))
        return res.status(400).send({ message: 'UserId manquant.' });

      if (!body.hasOwnProperty('name'))
        return res
          .status(400)
          .send({ message: 'Nom de compte Dofus manquant.' });

      const accounts = await prisma.account.findMany();

      if (
        accounts.some(
          (account) => account.id !== accountId && account.name === body.name,
        )
      )
        return res
          .status(400)
          .send({ message: 'Ce nom de compte Dofus existe déjà.' });

      await prisma.account.update({
        where: {
          id: accountId,
        },
        data: {
          name: body.name,
          userId: body.userId,
        },
      });

      return res.status(200).send();
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
);

accountsRouter.delete(
  '/:accountId',
  checkPermissions('delete:accounts'),
  async (req: Request, res: Response) => {
    try {
      const accountId = req.params.accountId;
      if (!accountId) {
        return res.status(400).send({ message: `Account ID manquant` });
      }

      await prisma.account.delete({
        where: {
          id: Number(accountId),
        },
      });
      return res.status(200).send();
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
);

export { accountsRouter };
