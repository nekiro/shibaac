import { player } from '@prisma/client';
import prisma from '../prisma';

type Player = Promise<player | null>;

export const findPlayerByName = async (name: string): Player => {
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
  sex: number
): Player => {
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

export const deletePlayer = async (characterId: number): Player => {
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
