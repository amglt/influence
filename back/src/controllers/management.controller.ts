import { Router, Request, Response } from 'express';
import { checkPermissions } from '../middlewares/permission.middleware';
import { prisma } from '../db';

const managementRouter = Router();

managementRouter.get(
  '/roles',
  checkPermissions('read:roles'),
  async (_: Request, res: Response) => {
    try {
      const roles = await prisma.role.findMany();
      return res.status(200).send(roles);
    } catch (e) {
      return res.status(500).send({ message: e });
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

      const role = await prisma.role.findFirst({
        where: { id: Number(roleId) },
        include: { permissions: true },
      });

      if (!role) return res.status(400).send({ message: 'Role introuvable' });

      return res.status(200).send({
        id: role.id,
        name: role.name,
        permissions: role.permissions,
      });
    } catch (e) {
      return res.status(500).send({ message: e });
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
      if (!body.hasOwnProperty('name') || !body.hasOwnProperty('permissions'))
        return res.status(400).send({ message: `Nom manquant` });

      const roles = await prisma.role.findMany();
      if (
        roles.find(
          (role) => role.name === body.name && role.id !== Number(roleId),
        )
      )
        return res
          .status(400)
          .send({ message: 'Un role avec ce nom existe deja' });

      await prisma.role.update({
        where: { id: Number(roleId) },
        data: {
          name: body.name,
          permissions: {
            connect: body.permissions.map((p: number) => ({
              id: p,
            })),
          },
        },
      });

      return res.status(200).send({});
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  },
);

managementRouter.post(
  '/roles',
  checkPermissions('write:roles'),
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      if (!body.hasOwnProperty('name')) {
        return res.status(400).send({ message: 'Nom manquant' });
      }

      const existingRoles = await prisma.role.findMany();
      const existingRole = existingRoles.find(
        (role) => role.name?.toLowerCase() === body.name.toLowerCase(),
      );
      if (existingRole) {
        return res
          .status(400)
          .send({ message: 'Un role avec ce nom existe déjà' });
      }

      const newRole = await prisma.role.create({
        data: {
          name: body.name,
          permissions: {
            connect: body.permissions.map((p: number) => ({
              id: p,
            })),
          },
        },
      });

      return res.status(201).send(newRole);
    } catch (err) {
      return res.status(500).send({ message: err });
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

      await prisma.role.delete({ where: { id: Number(roleId) } });
      return res.status(200).send({});
    } catch (err) {
      return res.status(500).send({ message: err });
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

      const role = await prisma.role.findFirst({
        include: { permissions: true },
        where: {
          id: Number(roleId),
        },
      });

      if (!role) return res.status(400).send({ message: 'Role introuvable' });

      return res.status(200).send(role.permissions);
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  },
);

managementRouter.get(
  '/permissions',
  checkPermissions('read:roles'),
  async (req: Request, res: Response) => {
    try {
      const permissions = await prisma.permission.findMany();

      return res.status(200).send(permissions);
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  },
);

export { managementRouter };
