import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.scale.upsert({
    create: {
      avaLoose: 0,
      avaWin: 0,
      bigPercoLoosePoints: 0,
      bigPercoNDPoints: 0,
      bigPercoWinPoints: 0,
      bigPrismLoosePoints: 0,
      bigPrismNDPoints: 0,
      bigPrismWinPoints: 0,
      percoLoosePoints: 0,
      percoNDPoints: 0,
      percoWinPoints: 0,
      prismLoosePoints: 0,
      prismNDPoints: 0,
      prismWinPoints: 0,
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
