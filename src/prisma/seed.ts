import { PrismaClient } from '@prisma/client';
import { readdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const seedsPath = path.join(__dirname, '/seeds');

  const files = await readdir(seedsPath);
  for (const file of files) {
    const seed = require(path.join(seedsPath, file)).default;
    // @ts-ignore
    await prisma[seed.table].createMany({
      data: seed.data,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
