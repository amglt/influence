import { Router, Request, Response } from 'express';
import { checkPermissions } from '../middlewares/permission.middleware';
import { prisma } from '../db';
import { getManagementClient } from '../shared/utils';

const charactersRouter = Router();

charactersRouter.get(
  '/',
  checkPermissions('read:characters'),
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

      const account = await prisma.account.findFirst({
        where: {
          id: Number(character.accountId),
        },
      });

      return res.status(200).send({ ...character, account: { ...account } });
    } catch (err) {
      return res.status(500).send();
    }
  },
);

charactersRouter.post(
  '/',
  checkPermissions('write:characters'),
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      console.log(body);
      if (
        !body.hasOwnProperty('name') ||
        !body.hasOwnProperty('class') ||
        !body.hasOwnProperty('rank') ||
        !body.hasOwnProperty('accountId') ||
        !body.hasOwnProperty('recruitmentDate')
      )
        return res.status(400).send({ message: 'Propriété manquante.' });

      const character = await prisma.character.findFirst({
        where: {
          name: req.body.name,
        },
      });
      if (character)
        return res.status(400).send({ message: 'Ce personnage existe déjà.' });

      const newCharacter = await prisma.character.create({
        data: {
          name: req.body.name,
          class: req.body.class,
          rank: req.body.rank,
          accountId: req.body.accountId,
          recruitmentDate: req.body.recruitmentDate,
        },
      });
      return res.status(200).send(newCharacter);
    } catch (err) {
      return res.status(500).send();
    }
  },
);

export { charactersRouter };
