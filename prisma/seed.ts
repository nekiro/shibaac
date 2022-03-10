import { PrismaClient } from '@prisma/client';
import news from './seeds/news';
import accounts from './seeds/accounts';

const prisma = new PrismaClient();

async function main() {
  // TODO: automatically parse and execute files inside of seeds directory
  await prisma.aac_news.createMany({
    data: news,
  });

  await prisma.accounts.createMany({
    data: accounts,
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
