import { Router, Request, Response } from 'express';
import { checkPermissions } from '../middlewares/permission.middleware';
import { prisma } from '../db';
import { getManagementClient } from '../shared/utils';

const walletsRouter = Router();

walletsRouter.get(
  '/',
  // checkPermissions('read:wallets'),
  async (_: Request, res: Response) => {
    try {
      const wallets = await prisma.wallet.findMany();
      return res.status(200).send(wallets);
    } catch (err) {
      return res.status(500).send();
    }
  },
);

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

      return res.status(200).send({ ...wallet, user: { ...user } });
    } catch (err) {
      return res.status(500).send();
    }
  },
);

walletsRouter.post(
  '/',
  //checkPermissions('write:wallets'),
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      if (!body.hasOwnProperty('userId'))
        return res.status(400).send({ message: 'UserId manquant.' });

      if (!body.hasOwnProperty('balance'))
        return res.status(400).send({ message: 'Balance manquant' });

      const wallets = await prisma.wallet.findMany();

      if (wallets.some((wallet) => wallet.userId === req.body.userId))
        return res
          .status(400)
          .send({ message: 'Cet utilisateur possède déjà un wallet.' });

      const newWallet = await prisma.wallet.create({
        data: {
          userId: req.body.userId,
          balance: req.body.balance,
        },
      });
      return res.status(200).send(newWallet);
    } catch (err) {
      return res.status(500).send();
    }
  },
);

/* TODO - POST plutot que PUT
 * créer le record
 * post sur /transaction
 */
walletsRouter.put(
  '/:walletId',
  //checkPermissions('write:accounts'),
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const walletIdFrom = Number(req.params.walletIdFrom);
      const walletIdTo = Number(req.params.walletIdTo);
      if (!body.hasOwnProperty('amount'))
        return res.status(400).send({ message: 'Montant manquant.' });

      if (!body.hasOwnProperty('walletIdFrom'))
        return res.status(400).send({ message: 'Emetteur manquant.' });

      if (!body.hasOwnProperty('walletIdTo'))
        return res.status(400).send({ message: 'Destinataire manquant.' });

      // update wallets
      await prisma.wallet.update({
        where: {
          id: walletIdFrom,
        },
        data: {
          balance: {
            increment: -body.amount,
          },
        },
      });

      await prisma.wallet.update({
        where: {
          id: walletIdTo,
        },
        data: {
          balance: {
            increment: body.amount,
          },
        },
      });

      return res.status(200).send();
    } catch (err) {
      return res.status(500).send();
    }
  },
);

// walletsRouter.delete(
//   '/:walletId',
//   // checkPermissions('delete:wallets'),
//   async (req: Request, res: Response) => {
//     try {
//       const walletId = req.params.walletId;
//       if (!walletId) {
//         return res.status(400).send({ message: `Wallet ID manquant` });
//       }

//       await prisma.wallet.delete({
//         where: {
//           id: Number(walletId),
//         },
//       });
//       return res.status(200).send();
//     } catch (err) {
//       return res.status(500).send();
//     }
//   },
// );

export { walletsRouter };
