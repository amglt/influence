import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';
import axios from 'axios';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';

const loginRouter = Router();

loginRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).send({ message: 'Code manquant' });

    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const origin = process.env.ORIGIN;
    if (!clientId || !clientSecret || !origin)
      return res.status(500).send({ message: 'Problème de configuration' });

    const resToken = await axios.post(
      `https://discord.com/api/v10/oauth2/token`,
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${origin}/login`,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    const { access_token } = resToken.data;
    const discordRes = await axios.get(
      'https://discord.com/api/v10/oauth2/@me',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    const { id, username } = discordRes.data.user;

    let user = await prisma.user.findFirst({
      where: {
        id: Number(id),
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
          nickname: username,
          updated_at: new Date(),
          username: username,
          id: Number(id),
          wallet: {
            create: {
              balance: 0,
            },
          },
        },
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
          wallet: true,
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
  } catch (err) {
    return res.status(500).send({ message: err });
  }
});

loginRouter.post(
  '/logout',
  authenticationMiddleware,
  async (req: Request, res: Response) => {
    try {
      const clientId = process.env.DISCORD_CLIENT_ID;
      const clientSecret = process.env.DISCORD_CLIENT_SECRET;
      if (!clientId || !clientSecret)
        return res.status(500).send({ message: 'Problème de configuration' });

      await axios.post(
        `https://discord.com/api/oauth2/token/revoke`,
        new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
        }),
      );
      return res.status(200).send({});
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
);

export { loginRouter };
