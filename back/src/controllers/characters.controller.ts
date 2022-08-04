import { Router, Request, Response } from 'express';
import { checkPermissions } from '../middlewares/permission.middleware';
import { prisma } from '../db';

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
      return res.status(500).send(err);
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
        include: {
          account: true,
        },
      });
      if (!character) {
        return res.status(400).send({ message: 'Personnage non trouvé.' });
      }

      return res.status(200).send(character);
    } catch (err) {
      return res.status(500).send(err);
    }
  },
);

charactersRouter.post(
  '/',
  checkPermissions('write:characters'),
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
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
      return res.status(500).send(err);
    }
  },
);

charactersRouter.delete(
  '/:characterId',
  checkPermissions('delete:characters'),
  async (req: Request, res: Response) => {
    try {
      const characterId = req.params.characterId;
      if (!characterId) {
        return res.status(400).send({ message: 'Character ID manquant.' });
      }

      await prisma.character.delete({
        where: {
          id: Number(characterId),
        },
      });
      return res.status(200).send();
    } catch (err) {
      return res.status(500).send(err);
    }
  },
);

charactersRouter.put(
  '/:characterId',
  checkPermissions('write:characters'),
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const characterId = Number(req.params.characterId);
      if (
        !body.hasOwnProperty('name') ||
        !body.hasOwnProperty('class') ||
        !body.hasOwnProperty('rank') ||
        !body.hasOwnProperty('accountId') ||
        !body.hasOwnProperty('recruitmentDate')
      )
        return res.status(400).send({ message: 'Propriété manquante.' });

      const characters = await prisma.character.findMany({
        where: {
          name: req.body.name,
        },
      });

      if (characters.some((character) => character.id !== characterId))
        return res.status(400).send({ message: 'Ce personnage existe déjà.' });

      await prisma.character.update({
        where: {
          id: characterId,
        },
        data: {
          name: body.name,
          class: body.class,
          rank: body.rank,
          accountId: req.body.accountId,
          recruitmentDate: req.body.recruitmentDate,
        },
      });
      return res.status(200).send();
    } catch (err) {
      return res.status(500).send(err);
    }
  },
);

export { charactersRouter };
