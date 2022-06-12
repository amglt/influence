import { Router, Request, Response } from 'express';
import { checkPermissions } from '../middlewares/permission.middleware';
import { prisma } from '../db';
import { getManagementClient } from '../shared/utils';

const charactersRouter = Router();

charactersRouter.get(
  '/',
  /*checkPermissions('read:characters'), */
  async (_: Request, res: Response) => {
    try {
      const characters = await prisma.character.findMany({
        include: {
          account: true,
        },
      });
      return res.status(200).send(characters);
    } catch (err) {
      return res.status(500).send();
    }
  },
);

charactersRouter.get(
  '/:characterId',
  checkPermissions('read:characters'),
  async (req: Request, res: Response) => {
    try {
      const characterId = req.params.characterId;
      if (!characterId) {
        return res.status(400).send({ message: 'Character ID manquant.' });
      }

      const character = await prisma.character.findFirst({
        where: {
          id: Number(characterId),
        },
      });

      if (!character) {
        return res.status(400).send({ message: 'Personnage non trouvé.' });
      }
    } catch (err) {
      return res.status(500).send();
    }
  },
);

export { charactersRouter };
