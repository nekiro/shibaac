import { accounts, Prisma } from '@prisma/client';
import prisma from '../prisma';
import { sha1Encrypt } from '../lib/crypt';

type Account = Promise<accounts | null>;

export const getAccountByIdIncludeDefault: Prisma.accountsInclude = {
  players: { select: { name: true, level: true, vocation: true } },
};

export const getAccountById = async (
  accountId: number,
  include:
    | Prisma.accountsInclude
    | null
    | undefined = getAccountByIdIncludeDefault,
): Account => {
  try {
    const account = await prisma.accounts.findFirst({
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
  include?: Prisma.accountsInclude,
): Account => {
  try {
    const account = await prisma.accounts.findFirst({
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
  where?: Prisma.accountsWhereInput,
  select?: Prisma.accountsSelect,
): Account => {
  try {
    const account = (await prisma.accounts.findFirst({
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
  email: string,
): Account => {
  try {
    const account = await prisma.accounts.create({
      data: {
        name,
        password: await sha1Encrypt(password),
        email,
        twoFAEnabled: false,
      },
    });

    return account;
  } catch (err) {
    return null;
  }
};

export const updateAccount = async () => {};

export const createCharacter = async () => {};
