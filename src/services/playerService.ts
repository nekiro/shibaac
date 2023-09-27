import { players, Prisma } from '@prisma/client';
import prisma from '../prisma';

export type Player = players | null;

export const findPlayerByName = async (name: string): Promise<Player> => {
  try {
    const player = await prisma.players.findFirst({
      where: { name },
    });

    return player;
  } catch (err) {
    return null;
  }
};

export const createPlayer = async (
  name: string,
  account_id: number,
  vocation: number,
  sex: number,
): Promise<Player> => {
  try {
    const player = await prisma.players.create({
      data: {
        name,
        account_id,
        vocation,
        sex,
        conditions: Buffer.from(''),
        health: 150,
        healthmax: 150,
        mana: 0,
        manamax: 0,
        cap: 400,
        soul: 100,
      },
    });

    return player;
  } catch (err) {
    return null;
  }
};

export const deletePlayer = async (characterId: number): Promise<Player> => {
  try {
    const player = await prisma.players.delete({
      where: {
        id: characterId,
      },
    });

    return player;
  } catch (err) {
    return null;
  }
};

export const getPlayers = async (args: Prisma.playersFindManyArgs) => {
  try {
    const players = await prisma.players.findMany(args);
    return players;
  } catch (err) {
    return null;
  }
};
