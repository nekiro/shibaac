import { PrismaClient } from '@prisma/client';
import { dev } from '../util/config';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (dev) {
  global.prisma = prisma;
}

export default prisma;
