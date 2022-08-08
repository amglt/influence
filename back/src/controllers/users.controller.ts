import { Router, Request, Response } from 'express';
import { checkPermissions } from '../middlewares/permission.middleware';
import { getManagementClient } from '../shared/utils';
import jwt_decode from 'jwt-decode';
import { DecodedToken } from '../models/root.models';

const usersRouter = Router();

usersRouter.get(
  '/',
  checkPermissions('read:users'),
  async (_: Request, res: Response) => {
    try {
      const client = getManagementClient('read:users read:user_idp_tokens');
      const users = await client.getUsers();
      return res.status(200).send(users);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
);

usersRouter.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decodedToken = jwt_decode(token) as DecodedToken;
      const client = getManagementClient('read:users read:user_idp_tokens');
      const user = await client.getUser({ id: decodedToken.sub });
      const userRoles = await client.getUserRoles({ id: decodedToken.sub });
      const userWithRole =
        userRoles.length > 0 ? { ...user, role: userRoles[0] } : { ...user };
      return res.status(200).send(userWithRole);
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

      const client = getManagementClient('read:users read:user_idp_tokens');
      const user = await client.getUser({ id: userId });
      const userRoles = await client.getUserRoles({ id: userId });
      const userWithRole =
        userRoles.length > 0 ? { ...user, role: userRoles[0] } : { ...user };
      return res.status(200).send(userWithRole);
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
      if (!body.hasOwnProperty('roleIds'))
        return res.status(400).send({ message: 'Liste des roles manquante' });

      const userId = req.params.userId;
      if (!userId) return res.status(400).send({ message: 'User ID manquant' });

      const client = getManagementClient(
        'read:roles update:user create:role_members',
      );
      await client.assignRolestoUser({ id: userId }, { roles: body.roleIds });
      return res.status(200).send();
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
);

usersRouter.put(
  '/:userId',
  checkPermissions('write:users'),
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      if (!userId) return res.status(400).send({ message: 'User ID manquant' });

      const client = getManagementClient('update:users');
      const actualRoles = await client.getUserRoles({ id: userId });
      if (actualRoles.length > 0)
        await client.removeRolesFromUser(
          { id: userId },
          { roles: actualRoles.filter((r) => r.id).map((r) => r.id!) },
        );

      const role = req.body.role;
      if (role?.id) {
        await client.assignRolestoUser({ id: userId }, { roles: [role.id] });
      }

      return res.status(200).send();
    } catch (err) {
      console.log(err);
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

      const client = getManagementClient(
        'update:users update:users_app_metadata',
      );
      await client.updateUser({ id: userId }, { blocked: body.blocked });
      return res.status(200).send({});
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: err });
    }
  },
);

usersRouter.put(
  '/:userId/nickname',
  checkPermissions('write:users'),
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      if (!body.hasOwnProperty('nickname'))
        return res.status(400).send({ message: 'Nickname manquant' });

      const userId = req.params.userId;
      if (!userId) return res.status(400).send({ message: 'User ID manquant' });

      const client = getManagementClient(
        'read:users update:users update:users_app_metadata',
      );
      const members = await client.getUsers();

      if (members.find((m) => m.user_id === userId)) {
        await client.updateUser({ id: userId }, { nickname: body.nickname });
      }

      return res.status(200).send({});
    } catch (err) {
      console.log(err);
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

      const client = getManagementClient('delete:users');
      await client.deleteUser({ id: userId });
      return res.status(200).send();
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
);

export { usersRouter };
