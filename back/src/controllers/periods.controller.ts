import { Router, Request, Response } from 'express';
import { checkPermissions } from '../middlewares/permission.middleware';
import { prisma } from '../db';

const periodRouter = Router();

periodRouter.get(
  '/',
  checkPermissions('read:periods'),
  async (req: Request, res: Response) => {
    try {
      const periods = await prisma.period.findMany();
      return res
        .status(200)
        .send(
          periods.sort(
            (a, b) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
          ),
        );
    } catch (e) {
      return res.status(500).send(e);
    }
  },
);

periodRouter.get(
  '/active',
  checkPermissions('read:periods'),
  async (req: Request, res: Response) => {
    try {
      const period = await prisma.period.findFirst({
        where: {
          endDate: null,
        },
      });
      return res.status(200).send(period);
    } catch (e) {
      return res.status(500).send(e);
    }
  },
);

periodRouter.post(
  '/',
  checkPermissions('write:periods'),
  async (req: Request, res: Response) => {
    try {
      const openPeriod = await prisma.period.findFirst({
        where: {
          endDate: null,
        },
      });
      if (openPeriod) {
        await prisma.period.update({
          where: {
            id: openPeriod.id,
          },
          data: {
            endDate: new Date(),
          },
        });
      }

      const newPeriod = await prisma.period.create({
        data: {
          startDate: new Date(),
        },
      });

      return res.status(200).send(newPeriod);
    } catch (e) {
      return res.status(500).send(e);
    }
  },
);

periodRouter.put(
  `/:periodId/close`,
  checkPermissions('write:periods'),
  async (req: Request, res: Response) => {
    try {
      const periodId = req.params.periodId;
      if (!periodId)
        return res.status(400).send({ message: `Periode id manquant` });

      const period = await prisma.period.findFirst({
        where: {
          id: Number(periodId),
        },
      });
      if (!period)
        return res
          .status(400)
          .send({ message: `Aucune période avec cette id n'a été trouvée` });

      await prisma.period.update({
        where: {
          id: Number(periodId),
        },
        data: {
          endDate: new Date(),
        },
      });

      return res.status(200).send();
    } catch (e) {
      return res.status(500).send(e);
    }
  },
);

periodRouter.delete(
  '/:periodId',
  checkPermissions('delete:periods'),
  async (req: Request, res: Response) => {
    try {
      const periodId = req.params.periodId;
      if (!periodId)
        return res.status(400).send({ message: `Periode id manquant` });

      await prisma.period.delete({
        where: {
          id: Number(periodId),
        },
      });

      return res.status(200).send();
    } catch (e) {
      return res.status(500).send(e);
    }
  },
);

export { periodRouter };
