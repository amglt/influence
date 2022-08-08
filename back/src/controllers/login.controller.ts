import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';

const loginRouter = Router();

loginRouter.post('/', async (req: Request, res: Response) => {
  try {
    const userInfo = req.body;
    if (!userInfo.username || !userInfo.id)
      return res.status(400).send({ message: 'Information manquantes' });

    console.log(userInfo);

    let user = await prisma.user.findFirst({
      where: {
        id: Number(userInfo.id),
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!user)
      user = await prisma.user.create({
        data: {
          picture: '',
          created_at: new Date(),
          nickname: userInfo.displayName ?? userInfo.username,
          updated_at: new Date(),
          username: userInfo.username,
          id: Number(userInfo.id),
        },
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
      });

    if (user.blocked)
      return res.status(400).send({ message: 'Utilisateur bloqué' });

    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret) {
      const userToReturn = {
        permissions: user.role?.permissions?.map((perm) => perm.name) ?? [],
        id: user.id.toString(),
        nickname: user.nickname,
        username: user.username,
      };
      const token = jwt.sign(userToReturn, jwtSecret, { expiresIn: '24h' });
      return res.status(200).send({
        accessToken: token,
        user: {
          ...userToReturn,
          id: userToReturn.id.toString(),
        },
      });
    }
    return res.status(500).send({ message: 'JWT Secret inconnu' });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
});

export { loginRouter };
