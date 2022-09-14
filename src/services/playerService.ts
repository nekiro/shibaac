import { player, Prisma } from '@prisma/client';
import prisma from '../prisma';

export type Player = player | null;

export const findPlayerByName = async (name: string): Promise<Player> => {
  try {
    const player = await prisma.player.findFirst({
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
    const player = await prisma.player.create({
      data: {
        name,
        account_id,
        vocation,
        sex,
      },
    });

    return player;
  } catch (err) {
    return null;
  }
};

export const deletePlayer = async (characterId: number): Promise<Player> => {
  try {
    const player = await prisma.player.delete({
      where: {
        id: characterId,
      },
    });

    return player;
  } catch (err) {
    return null;
  }
};

export const getPlayers = async (args: Prisma.playerFindManyArgs) => {
  try {
    const players = await prisma.player.findMany(args);
    return players;
  } catch (err) {
    return null;
  }
};
