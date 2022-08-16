import { account, Prisma } from '@prisma/client';
import prisma from '../prisma';
import { sha1Encrypt } from '../util/crypt';

type Account = Promise<account | null>;

export const getAccountById = async (
  accountId: number,
  include: Prisma.accountInclude = {
    players: { select: { name: true, level: true, vocation: true } },
  }
): Account => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
      },
      include,
    });

    return account;
  } catch (err) {
    return null;
  }
};

export const getAccountByName = async (
  accountName: string,
  include?: Prisma.accountInclude
): Account => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        name: accountName,
      },
      include,
    });

    return account;
  } catch (err) {
    return null;
  }
};

export const getAccountBy = async (
  where?: Prisma.accountWhereInput,
  select?: Prisma.accountSelect
): Account => {
  try {
    const account = (await prisma.account.findFirst({
      where,
      select,
    })) as Account;

    return account;
  } catch (err) {
    return null;
  }
};

export const createAccount = async (
  name: string,
  password: string,
  email: string
): Account => {
  try {
    const account = await prisma.account.create({
      data: {
        name,
        password: sha1Encrypt(password),
        email,
      },
    });

    return account;
  } catch (err) {
    return null;
  }
};

export const updateAccount = async () => {};

export const createCharacter = async () => {};
