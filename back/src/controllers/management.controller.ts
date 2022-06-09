import { Router, Request, Response } from 'express';
import { getManagementClient } from '../shared/utils';
import { Permission } from 'auth0';
import { checkPermissions } from '../middlewares/permission.middleware';

const managementRouter = Router();

managementRouter.get(
  '/users/:userId/permissions',
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      if (!userId) return res.status(400).send({ message: 'User ID manquant' });

      const client = getManagementClient(
        'read:roles read:users read:role_members',
      );
      const roles = await client.getUserRoles({ id: userId });

      const userPermissions: Permission[] = [];
      for (const role of roles) {
        if (role.id) {
          const permissions = await client.getPermissionsInRole({
            id: role.id,
          });
          userPermissions.push(...permissions);
        }
      }

      return res
        .status(200)
        .send(
          [...new Set(userPermissions)].map((perm) => perm.permission_name),
        );
    } catch (e) {
      return res.status(500).send();
    }
  },
);

managementRouter.get(
  '/roles',
  checkPermissions('read:roles'),
  async (_: Request, res: Response) => {
    try {
      const client = getManagementClient('read:roles');
      const roles = await client.getRoles();
      return res.status(200).send(roles);
    } catch (e) {
      return res.status(500).send();
    }
  },
);

managementRouter.get(
  '/roles/:roleId',
  checkPermissions('read:roles'),
  async (req: Request, res: Response) => {
    try {
      const roleId = req.params.roleId;
      if (!roleId) return res.status(400).send({ message: 'Role ID manquant' });

      const client = getManagementClient('read:roles');
      const role = await client.getRole({ id: roleId });
      const rolePermissions = await client.getPermissionsInRole({
        id: role.id!,
      });

      return res.status(200).send({
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: rolePermissions,
      });
    } catch (e) {
      return res.status(500).send();
    }
  },
);

managementRouter.patch(
  '/roles/:roleId',
  checkPermissions('read:roles'),
  async (req: Request, res: Response) => {
    try {
      const roleId = req.params.roleId;
      const body = req.body;

      if (!roleId) return res.status(400).send({ message: `Role ID manquant` });
      if (
        !body.hasOwnProperty('name') ||
        !body.hasOwnProperty('description') ||
        !body.hasOwnProperty('permissions')
      )
        return res
          .status(400)
          .send({ message: `Nom ou description manquante` });

      const client = getManagementClient('update:roles');
      await client.updateRole(
        { id: roleId },
        {
          name: body.name,
          description: body.description,
        },
      );
      await client.removePermissionsFromRole(
        { id: roleId },
        { permissions: body.permissions },
      );
      await client.addPermissionsInRole(
        { id: roleId },
        { permissions: body.permissions },
      );
      return res.status(200).send();
    } catch (e) {
      console.log(e);
      return res.status(500).send();
    }
  },
);

managementRouter.post(
  '/roles',
  checkPermissions('write:roles'),
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      if (!body.hasOwnProperty('name') || !body.hasOwnProperty('description')) {
        return res.status(400).send({ message: 'Nom ou description manquant' });
      }

      const client = getManagementClient('create:roles update:roles');
      const newRole = await client.createRole({
        name: body.name,
        description: body.description,
      });
      await client.addPermissionsInRole(
        {
          id: newRole.id!,
        },
        {
          permissions: body.permissions,
        },
      );
      return res.status(200).send();
    } catch (err) {
      return res.status(500).send();
    }
  },
);

managementRouter.delete(
  '/roles/:roleId',
  checkPermissions('delete:roles'),
  async (req: Request, res: Response) => {
    try {
      const roleId = req.params.roleId;
      if (!roleId) return res.status(400).send({ message: `Role ID manquant` });

      const client = getManagementClient('delete:roles');
      await client.deleteRole({ id: roleId });
      return res.status(200).send();
    } catch (err) {
      return res.status(500).send();
    }
  },
);

managementRouter.get(
  '/roles/:roleId/permissions',
  checkPermissions('read:roles'),
  async (req: Request, res: Response) => {
    try {
      const roleId = req.params.roleId;
      if (!roleId) return res.status(400).send({ message: 'Role ID manquant' });

      const client = getManagementClient('read:roles');
      const permissions = await client.getPermissionsInRole({ id: roleId });
      return res.status(200).send(permissions);
    } catch (e) {
      return res.status(500).send();
    }
  },
);

managementRouter.get(
  '/permissions',
  checkPermissions('read:roles'),
  async (req: Request, res: Response) => {
    try {
      if (!process.env.COUNCIL_ROLE_ID)
        return res
          .status(500)
          .send({ message: 'Env variable COUNCIL_ROLE_ID is not configured' });

      const client = getManagementClient('read:roles');
      const permissions = await client.getPermissionsInRole({
        id: process.env.COUNCIL_ROLE_ID,
      });
      return res.status(200).send(
        permissions.map((perm) => ({
          permission_name: perm.permission_name,
          resource_server_identifier: perm.resource_server_identifier,
        })),
      );
    } catch (e) {
      return res.status(500).send();
    }
  },
);

export { managementRouter };
