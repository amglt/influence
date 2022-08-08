import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedPermissionsAndConcilRole() {
  await prisma.permission.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'read:users',
    },
  });
  await prisma.permission.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'is:admin',
    },
  });
  await prisma.permission.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'is:council',
    },
  });
  await prisma.permission.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'is:member',
    },
  });
  await prisma.permission.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: 'read:roles',
    },
  });
  await prisma.permission.upsert({
    where: { id: 6 },
    update: {},
    create: {
      name: 'write:roles',
    },
  });
  await prisma.permission.upsert({
    where: { id: 7 },
    update: {},
    create: {
      name: 'delete:roles',
    },
  });
  await prisma.permission.upsert({
    where: { id: 8 },
    update: {},
    create: {
      name: 'is:recruitment',
    },
  });
  await prisma.permission.upsert({
    where: { id: 9 },
    update: {},
    create: {
      name: 'write:users',
    },
  });
  await prisma.permission.upsert({
    where: { id: 10 },
    update: {},
    create: {
      name: 'delete:users',
    },
  });
  await prisma.permission.upsert({
    where: { id: 11 },
    update: {},
    create: {
      name: 'ban:users',
    },
  });
  await prisma.permission.upsert({
    where: { id: 12 },
    update: {},
    create: {
      name: 'read:accounts',
    },
  });
  await prisma.permission.upsert({
    where: { id: 13 },
    update: {},
    create: {
      name: 'delete:accounts',
    },
  });
  await prisma.permission.upsert({
    where: { id: 14 },
    update: {},
    create: {
      name: 'write:accounts',
    },
  });
  await prisma.permission.upsert({
    where: { id: 15 },
    update: {},
    create: {
      name: 'read:characters',
    },
  });
  await prisma.permission.upsert({
    where: { id: 16 },
    update: {},
    create: {
      name: 'write:characters',
    },
  });
  await prisma.permission.upsert({
    where: { id: 17 },
    update: {},
    create: {
      name: 'delete:characters',
    },
  });
  await prisma.permission.upsert({
    where: { id: 18 },
    update: {},
    create: {
      name: 'is:pvp',
    },
  });
  await prisma.permission.upsert({
    where: { id: 19 },
    update: {},
    create: {
      name: 'read:periods',
    },
  });
  await prisma.permission.upsert({
    where: { id: 20 },
    update: {},
    create: {
      name: 'write:periods',
    },
  });
  await prisma.permission.upsert({
    where: { id: 21 },
    update: {},
    create: {
      name: 'delete:periods',
    },
  });
  await prisma.permission.upsert({
    where: { id: 22 },
    update: {},
    create: {
      name: 'is:logistic',
    },
  });
  await prisma.permission.upsert({
    where: { id: 23 },
    update: {},
    create: {
      name: 'write:scale',
    },
  });
  await prisma.permission.upsert({
    where: { id: 24 },
    update: {},
    create: {
      name: 'read:scale',
    },
  });
  await prisma.permission.upsert({
    where: { id: 25 },
    update: {},
    create: {
      name: 'write:pvp-games',
    },
  });
  await prisma.permission.upsert({
    where: { id: 26 },
    update: {},
    create: {
      name: 'read:pvp-games',
    },
  });
  await prisma.permission.upsert({
    where: { id: 27 },
    update: {},
    create: {
      name: 'delete:pvp-games',
    },
  });
  await prisma.permission.upsert({
    where: { id: 28 },
    update: {},
    create: {
      name: 'read:wallets',
    },
  });
  await prisma.permission.upsert({
    where: { id: 29 },
    update: {},
    create: {
      name: 'write:wallets',
    },
  });
  await prisma.permission.upsert({
    where: { id: 30 },
    update: {},
    create: {
      name: 'write:machines',
    },
  });

  const permissionsIdsToConnect = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
    { id: 11 },
    { id: 12 },
    { id: 13 },
    { id: 14 },
    { id: 15 },
    { id: 16 },
    { id: 17 },
    { id: 18 },
    { id: 19 },
    { id: 20 },
    { id: 21 },
    { id: 22 },
    { id: 23 },
    { id: 24 },
    { id: 25 },
    { id: 26 },
    { id: 27 },
    { id: 28 },
    { id: 29 },
    { id: 30 },
  ];

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

  await prisma.user.upsert({
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
