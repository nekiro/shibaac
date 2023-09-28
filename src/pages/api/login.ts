const {
  NEXT_PUBLIC_SERVER_NAME,
  NEXT_PUBLIC_SERVER_ADDRESS,
  NEXT_PUBLIC_SERVER_PORT,
  NEXT_PUBLIC_PVP_TYPE,
  NEXT_PUBLIC_FREE_PREMIUM,
  NEXT_PUBLIC_DEPRECATED_USE_SHA1_PASSWORDS,
} = process.env;

import { NextApiRequest, NextApiResponse } from 'next';
import crypto, { createHash } from 'crypto';
import parseDuration from 'parse-duration';
import { vocationIdToName } from '../../lib';
import prisma from '../../prisma';
import { sha1Encrypt } from '../../lib/crypt';
import speakeasy from 'speakeasy';

const SESSION_DURATION =
  parseDuration(process.env.NEXT_PUBLIC_GAME_SESSION_EXPIRATION_TIME ?? '1d') ??
  3600 * 24;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const params = req.body;

  try {
    switch (params.type) {
      case 'news':
        res.json({});
        break;

      case 'cacheinfo':
        const cacheInfo = await handleCacheInfo();
        res.json(cacheInfo);
        break;

      case 'boostedcreature':
        const boostedCreatureInfo = await handleBoostedCreature();
        res.json(boostedCreatureInfo);
        break;

      case 'eventschedule':
        res.json({});
        break;

      case 'login':
        const loginResponse = await handleLogin(params);
        res.json(loginResponse);
        break;

      default:
        throw new Error(`Unknown login type: ${params.type}`);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function isValidEmail(email: string) {
  var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

async function handleCacheInfo() {
  const playersOnline = await prisma.players_online.count();

  return {
    playersonline: playersOnline,
    twitchstreams: 0,
    twitchviewer: 0,
    gamingyoutubestreams: 0,
    gamingyoutubeviewer: 0,
  };
}

async function handleBoostedCreature() {
  const boostedCreature = await prisma.boosted_creature.findFirstOrThrow({
    select: { raceid: true },
  });
  const boostedBoss = await prisma.boosted_boss.findFirstOrThrow({
    select: { raceid: true },
  });

  return {
    boostedcreature: true,
    creatureraceid: Number(boostedCreature.raceid),
    bossraceid: Number(boostedBoss.raceid),
  };
}

async function handleLogin(params: any) {
  const { accountname, email, password, token } = params;

  const account = await prisma.accounts.findFirst({
    where: {
      name: accountname,
      password: await sha1Encrypt(password),
    },
    include: {
      players: true,
    },
  });

  if (!account) {
    return { success: false, message: 'Wrong credentials.' };
  }

  if (account.twoFASecret && !token) {
    return {
      success: false,
      message: 'Two-factor token required for authentication',
    };
  }

  if (
    account.twoFASecret &&
    token &&
    !speakeasy.totp.verify({
      secret: String(account.twoFASecret),
      encoding: 'base32',
      token: token,
      window: 2,
    })
  ) {
    return {
      errorCode: 6,
      errorMessage: 'Two-factor token is not correct.',
    };
  }

  let sessionKey: string = crypto.randomUUID();
  const hashedSessionId = createHash('sha1').update(sessionKey).digest('hex');

  const isEmailOrAccountName = isValidEmail(email);

  if (NEXT_PUBLIC_DEPRECATED_USE_SHA1_PASSWORDS) {
    sessionKey = `${isEmailOrAccountName ? email : accountname}\n${password}`;
  } else {
    await prisma.account_sessions.create({
      data: {
        id: hashedSessionId,
        account_id: account.id,
        expires: Math.trunc((Date.now() + SESSION_DURATION) / 1000),
      },
    });
  }

  const serverPort = parseInt(NEXT_PUBLIC_SERVER_PORT) ?? 7172;
  const pvptype = ['pvp', 'no-pvp', 'pvp-enforced'].indexOf(
    String(NEXT_PUBLIC_PVP_TYPE),
  );
  const now = Math.trunc(Date.now() / 1000);

  return {
    session: {
      sessionkey: sessionKey,
      lastlogintime: '0', // TODO: implement last login
      ispremium:
        NEXT_PUBLIC_FREE_PREMIUM === 'true' ? true : account.lastday > now,
      premiumuntil: account.lastday,
      status: 'active',
      returnernotification: false,
      showrewardnews: true,
      isreturner: true,
      fpstracking: false,
      optiontracking: false,
      emailcoderequest: false,
    },
    playdata: {
      worlds: [
        {
          id: 0,
          name: NEXT_PUBLIC_SERVER_NAME,
          externaladdress: NEXT_PUBLIC_SERVER_ADDRESS,
          externalport: serverPort,
          externaladdressprotected: NEXT_PUBLIC_SERVER_ADDRESS,
          externalportprotected: serverPort,
          externaladdressunprotected: NEXT_PUBLIC_SERVER_ADDRESS,
          externalportunprotected: serverPort,
          previewstate: 0,
          location: 'BRA',
          anticheatprotection: false,
          pvptype,
          restrictedstore: false,
        },
      ],
      characters: account.players.map((player: any) => ({
        worldid: 0,
        name: player.name,
        ismale: player.sex,
        tutorial: player.istutorial,
        level: player.level,
        vocation: vocationIdToName[player.vocation],
        outfitid: player.looktype,
        headcolor: player.lookhead,
        torsocolor: player.lookbody,
        legscolor: player.looklegs,
        detailcolor: player.lookfeet,
        addonsflags: player.lookaddons,
        ismaincharacter: player.is_main,
        dailyrewardstate: player.isreward ? 1 : 0,
      })),
    },
  };
}
