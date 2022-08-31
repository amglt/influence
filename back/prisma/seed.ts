import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedPermissionsAndConcilRole() {
  const permissions = [
    'read:users',
    'is:admin',
    'is:council',
    'is:member',
    'read:roles',
    'write:roles',
    'delete:roles',
    'is:recruitment',
    'write:users',
    'delete:users',
    'ban:users',
    'read:accounts',
    'delete:accounts',
    'write:accounts',
    'read:characters',
    'write:characters',
    'delete:characters',
    'is:pvp',
    'read:periods',
    'write:periods',
    'delete:periods',
    'is:logistic',
    'write:scale',
    'read:scale',
    'write:pvp-games',
    'read:pvp-games',
    'delete:pvp-games',
    'read:wallets',
    'write:wallets',
    'write:machines',
    'write:wallets',
    'read:wallets',
    'delete:wallets',
  ];
  for (const value of permissions) {
    const index = permissions.indexOf(value);
    await prisma.permission.upsert({
      where: { id: index + 1 },
      update: {
        name: value,
      },
      create: {
        name: value,
      },
    });
  }

  const addedPermissions = await prisma.permission.findMany();
  const permissionsIdsToConnect = addedPermissions.map((p) => ({ id: p.id }));

  await prisma.role.upsert({
    where: { id: 1 },
    update: {
      name: 'Conseil',
      permissions: {
        connect: permissionsIdsToConnect,
      },
    },
    create: {
      name: 'Conseil',
      permissions: {
        connect: permissionsIdsToConnect,
      },
    },
  });
}

async function main() {
  await seedPermissionsAndConcilRole();

  const baseUser = await prisma.user.upsert({
    where: { id: 135418272475643904 },
    create: {
      id: 135418272475643904,
      created_at: new Date(),
      roleId: 1,
      username: 'Ellin',
      nickname: 'Ellin',
      picture: '',
      updated_at: new Date(),
      guild: 'Influ',
    },
    update: {
      id: 135418272475643904,
      created_at: new Date(),
      roleId: 1,
      username: 'Ellin',
      nickname: 'Ellin',
      picture: '',
      updated_at: new Date(),
      guild: 'Influ',
    },
  });
  await prisma.wallet.upsert({
    where: {
      id: 1,
    },
    create: {
      balance: 0,
      userId: baseUser.id,
    },
    update: {
      balance: 0,
      userId: baseUser.id,
    },
  });

  await prisma.scale.upsert({
    create: {
      avaLoose: 0,
      avaWin: 0,
      prismDefLoosePoints: 0,
      bigPrismDefLoosePoints: 0,
      prismAttackWinPoints: 0,
      prismAttackLoosePoints: 0,
      bigPrismAttackLoosePoints: 0,
      prismDefWinPoints: 0,
      bigPrismDefWinPoints: 0,
      percoDefLoosePoints: 0,
      bigPrismAttackWinPoints: 0,
      bigPercoNDPoints: 0,
      bigPercoDefLoosePoints: 0,
      percoDefWinPoints: 0,
      bigPercoDefWinPoints: 0,
      percoAttackLoosePoints: 0,
      bigPercoAttackLoosePoints: 0,
      percoAttackWinPoints: 0,
      bigPercoAttackWinPoints: 0,
      bigPrismNDPoints: 0,
      percoNDPoints: 0,
      prismNDPoints: 0,
      percoNAPoints: 0,
      bigPercoNAPoints: 0,
      prismNAPoints: 0,
      bigPrismNAPoints: 0,
    },
    update: {},
    where: {
      id: 1,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
