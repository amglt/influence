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
      const rates = await prisma.regressiveRate.findMany();

      return res.status(200).send({ ...scale, rates });
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

      let errorDescription = '';
      if (body.percoWinPoints === undefined || body.percoWinPoints === null)
        errorDescription += `Points pour perco win manquants\n`;
      if (body.percoNDPoints === undefined || body.percoNDPoints === null)
        errorDescription += `Points pour perco no def manquants\n`;
      if (body.percoLoosePoints === undefined || body.percoLoosePoints === null)
        errorDescription += `Points pour perco loose manquants\n`;
      if (
        body.bigPercoWinPoints === undefined ||
        body.bigPercoWinPoints === null
      )
        errorDescription += `Points pour big alli perco win manquants\n`;
      if (body.bigPercoNDPoints === undefined || body.bigPercoNDPoints === null)
        errorDescription += `Points pour big alli perco no def manquants\n`;
      if (
        body.bigPercoLoosePoints === undefined ||
        body.bigPercoLoosePoints === null
      )
        errorDescription += `Points pour big alli perco loose manquants\n`;
      if (body.prismWinPoints === undefined || body.prismWinPoints === null)
        errorDescription += `Points pour prism win manquants\n`;
      if (body.prismNDPoints === undefined || body.prismNDPoints === null)
        errorDescription += `Points pour prism no def manquants\n`;
      if (body.prismLoosePoints === undefined || body.prismLoosePoints === null)
        errorDescription += `Points pour prism loose manquants\n`;
      if (
        body.bigPrismWinPoints === undefined ||
        body.bigPrismWinPoints === null
      )
        errorDescription += `Points pour big alli prism win manquants\n`;
      if (body.bigPrismNDPoints === undefined || body.bigPrismNDPoints === null)
        errorDescription += `Points pour big alli prism no def manquants\n`;
      if (
        body.bigPrismLoosePoints === undefined ||
        body.bigPrismLoosePoints === null
      )
        errorDescription += `Points pour big alli prism loose manquants\n`;
      if (body.avaWin === undefined || body.avaWin === null)
        errorDescription += `Points pour ava win manquants\n`;
      if (body.avaLoose === undefined || body.avaLoose === null)
        errorDescription += `Points pour ava loose manquants\n`;
      if (errorDescription)
        return res.status(400).send({
          message: `Echec de modification du barème`,
          description: errorDescription,
        });

      await prisma.scale.update({
        where: {
          id: 1,
        },
        data: {
          avaLoose: body.avaLoose,
          avaWin: body.avaWin,
          bigPercoLoosePoints: body.bigPercoLoosePoints,
          bigPercoNDPoints: body.bigPercoNDPoints,
          bigPercoWinPoints: body.bigPercoWinPoints,
          bigPrismLoosePoints: body.bigPrismLoosePoints,
          bigPrismNDPoints: body.bigPrismNDPoints,
          bigPrismWinPoints: body.bigPrismWinPoints,
          percoLoosePoints: body.percoLoosePoints,
          percoNDPoints: body.percoNDPoints,
          percoWinPoints: body.percoWinPoints,
          prismLoosePoints: body.prismLoosePoints,
          prismNDPoints: body.prismNDPoints,
          prismWinPoints: body.prismWinPoints,
        },
      });
      if (body.rates) {
        const rates = await prisma.regressiveRate.findMany();
        if (rates.length > 0) {
          await prisma.regressiveRate.deleteMany({
            where: {
              id: {
                in: rates.map((rate) => rate.id),
              },
            },
          });
        }
        await prisma.regressiveRate.createMany({
          data: body.rates.map((r: { gamesAmount: number; rate: number }) => ({
            gamesAmount: r.gamesAmount,
            rate: r.rate,
          })),
        });
      }

      return res.status(200).send();
    } catch (e) {
      return res.status(500).send(e);
    }
  },
);

export { scaleRouter };
