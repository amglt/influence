import { Router, Request, Response } from 'express';
import { checkPermissions } from '../middlewares/permission.middleware';
import jwt_decode from 'jwt-decode';
import { DecodedToken } from '../models/root.models';
import { prisma } from '../db';

const usersRouter = Router();

usersRouter.get(
  '/',
  checkPermissions('read:users'),
  async (_: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany();
      return res
        .status(200)
        .send(users.map((u) => ({ ...u, id: Number(u.id) })));
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: err });
    }
  },
);

usersRouter.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decodedToken = jwt_decode(token) as DecodedToken;
      const user = await prisma.user.findFirst({
        where: {
          id: Number(decodedToken.id),
        },
        include: {
          role: true,
        },
      });
      return res.status(200).send(user);
    }
    return res.status(400).send({ message: 'Token manquant' });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
});

usersRouter.get(
  '/:userId',
  checkPermissions('read:users'),
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      if (!userId) return res.status(400).send({ message: 'User ID manquant' });

      const userWithRole = await prisma.user.findFirst({
        where: {
          id: Number(userId),
        },
        include: {
          role: true,
        },
      });
      if (!userWithRole)
        return res.status(400).send({ message: 'User introuvable' });

      return res
        .status(200)
        .send({ ...userWithRole, id: Number(userWithRole.id) });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
);

usersRouter.post(
  '/:userId',
  checkPermissions('write:users'),
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      if (!body.hasOwnProperty('roleId'))
        return res.status(400).send({ message: 'Role manquant' });

      const userId = req.params.userId;
      if (!userId) return res.status(400).send({ message: 'User ID manquant' });

      await prisma.user.update({
        where: {
          id: Number(userId),
        },
        data: {
          roleId: Number(body.roleId),
        },
      });
      return res.status(200).send({});
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
);

usersRouter.put(
  '/check',
  checkPermissions('write:users'),
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      if (!body.hasOwnProperty('members'))
        return res.status(400).send({ message: 'Members manquant' });

      for (const member of body.members) {
        await prisma.user.upsert({
          where: {
            id: member.id,
          },
          update: {
            username: member.name,
            nickname: member.nickname,
            guild: member.guild,
            updated_at: new Date(),
            picture: member.picture,
          },
          create: {
            id: member.id,
            username: member.name,
            nickname: member.nickname,
            guild: member.guild,
            updated_at: new Date(),
            created_at: new Date(),
            picture: member.picture,
          },
        });
      }

      return res.status(200).send({});
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
);

usersRouter.put(
  '/:userId/role',
  checkPermissions('write:users'),
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      if (!userId) return res.status(400).send({ message: 'User ID manquant' });

      const role = req.body.role;
      if (role?.id) {
        await prisma.user.update({
          where: { id: Number(userId) },
          data: { roleId: role.id },
        });
      }

      return res.status(200).send({});
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
);

usersRouter.patch(
  '/:userId/block',
  checkPermissions('delete:users'),
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      if (!body.hasOwnProperty('blocked'))
        return res.status(400).send({ message: 'Propriété manquante' });

      const userId = req.params.userId;
      if (!userId) return res.status(400).send({ message: 'User ID manquant' });

      await prisma.user.update({
        where: { id: Number(userId) },
        data: { blocked: body.blocked },
      });
      return res.status(200).send({});
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
);

usersRouter.delete(
  '/:userId',
  checkPermissions('delete:users'),
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      if (!userId) return res.status(400).send({ message: 'User ID manquant' });

      await prisma.user.delete({ where: { id: Number(userId) } });
      return res.status(200).send();
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
);

export { usersRouter };
