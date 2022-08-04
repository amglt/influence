import { Router, Request, Response } from 'express';
import { checkPermissions } from '../middlewares/permission.middleware';
import { prisma } from '../db';

const scaleRouter = Router();

scaleRouter.get(
  '/',
  checkPermissions('read:scale'),
  async (req: Request, res: Response) => {
    try {
      const scale = await prisma.scale.findFirst({ where: { id: 1 } });

      return res.status(200).send(scale);
    } catch (e) {
      return res.status(500).send(e);
    }
  },
);

scaleRouter.put(
  '/',
  checkPermissions('write:scale'),
  async (req: Request, res: Response) => {
    try {
      const body = req.body;

      await prisma.scale.update({
        where: {
          id: 1,
        },
        data: {
          avaLoose: body.avaLoose,
          avaWin: body.avaWin,
          bigPercoAttackWinPoints: body.bigPercoAttackWinPoints,
          bigPercoNDPoints: body.bigPercoNDPoints,
          percoAttackWinPoints: body.percoAttackWinPoints,
          bigPercoAttackLoosePoints: body.bigPercoAttackLoosePoints,
          percoAttackLoosePoints: body.percoAttackLoosePoints,
          percoDefWinPoints: body.percoDefWinPoints,
          bigPercoDefLoosePoints: body.bigPercoDefLoosePoints,
          bigPrismAttackWinPoints: body.bigPrismAttackWinPoints,
          percoDefLoosePoints: body.percoDefLoosePoints,
          bigPrismDefWinPoints: body.bigPrismDefWinPoints,
          prismDefWinPoints: body.prismDefWinPoints,
          bigPrismAttackLoosePoints: body.bigPrismAttackLoosePoints,
          prismAttackLoosePoints: body.prismAttackLoosePoints,
          prismAttackWinPoints: body.prismAttackWinPoints,
          percoNDPoints: body.percoNDPoints,
          bigPrismDefLoosePoints: body.bigPrismDefLoosePoints,
          prismNDPoints: body.prismNDPoints,
          prismDefLoosePoints: body.prismDefLoosePoints,
          bigPrismNDPoints: body.bigPrismNDPoints,
          bigPercoDefWinPoints: body.bigPercoDefWinPoints,
        },
      });

      return res.status(200).send();
    } catch (e) {
      return res.status(500).send(e);
    }
  },
);

export { scaleRouter };
