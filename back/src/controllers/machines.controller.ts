import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { checkPermissions } from '../middlewares/permission.middleware';
import { prisma } from '../db';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';

const machinesRouter = Router();

function genPassword() {
  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const passwordLength = 12;
  let password = '';
  for (let i = 0; i <= passwordLength; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }
  return password;
}

const saltRounds = 10;

machinesRouter.post(
  '/',
  authenticationMiddleware,
  checkPermissions('write:machines'),
  async (_: Request, res: Response) => {
    try {
      const generatedId = Math.floor(100000 + Math.random() * 900000);
      const generatedPassword = genPassword();
      bcrypt.hash(generatedPassword, saltRounds, async function (err, hash) {
        const permissions = await prisma.permission.findMany();
        const machinePermissionNames = [
          'write:users',
          'write:pvp-games',
          'read:pvp-games',
          'delete:pvp-games',
          'write:wallets',
          'read:wallets',
        ];
        await prisma.machineToMachine.create({
          data: {
            clientId: generatedId,
            clientSecret: hash,
            permissions: {
              connect: permissions
                .filter((p) => machinePermissionNames.includes(p.name))
                .map((p) => ({ id: p.id })),
            },
          },
        });
      });

      return res
        .status(201)
        .send({ clientId: generatedId, clientSecret: generatedPassword });
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  },
);

machinesRouter.post('/token', async (req: Request, res: Response) => {
  try {
    const { clientId, clientSecret } = req.body;

    if (!clientId || !clientSecret)
      return res.status(400).send({ message: 'Client id ou secret manquant' });

    const machine = await prisma.machineToMachine.findFirst({
      where: {
        clientId: Number(clientId),
      },
      include: {
        permissions: true,
      },
    });

    if (!machine)
      return res.status(400).send({ message: 'Machine introuvable' });

    let accessToken: string | undefined = undefined;

    const match = await bcrypt.compare(clientSecret, machine.clientSecret);
    if (!match) return res.status(400).send({ message: 'Données erronées' });

    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret)
      accessToken = jwt.sign(
        {
          clientId: machine.clientId,
          permissions: machine.permissions.map((p) => p.name),
        },
        jwtSecret,
      );

    if (!accessToken)
      return res
        .status(400)
        .send({ message: 'Problème lors de la génération du token' });
    return res
      .status(200)
      .send({ access_token: accessToken, token_type: 'Bearer' });
  } catch (e) {
    return res.status(500).send({ message: e });
  }
});

export { machinesRouter };
