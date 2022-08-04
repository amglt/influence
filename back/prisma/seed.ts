import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
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
