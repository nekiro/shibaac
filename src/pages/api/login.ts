const { SERVER_NAME, SERVER_ADDRESS, SERVER_PORT, PVP_TYPE, FREE_PREMIUM } =
  process.env;

import { NextApiRequest, NextApiResponse } from 'next';
import { createHash } from 'crypto';
import parseDuration from 'parse-duration';
import { groupToName, vocationIdToName } from '../../lib';
import prisma from '../../prisma';
import * as accountService from '../../services/accountService';
import { sha1Encrypt } from '../../lib/crypt';
import speakeasy from 'speakeasy';

interface LoginParams {
  type: 'login';
  name: string;
  password: string;
  twoFAToken?: string;
}

const SESSION_DURATION =
  parseDuration(process.env.GAME_SESSION_EXPIRATION_TIME ?? '1d') ?? 3600 * 24;

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

async function handleCacheInfo() {
  const playersonline = await prisma.players_online.count({
    where: { players: { group_id: { lt: 4 } } },
  });
  return {
    playersonline,
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
  // const boostedBoss = await prisma.boostedBoss.findFirstOrThrow({
  //   select: { raceid: true },
  // });
  return {
    boostedcreature: true,
    creatureraceid: Number(boostedCreature.raceid),
    bossraceid: 0,
  };
}

async function handleLogin(params: LoginParams) {
  const { name, password, type, twoFAToken } = params;

  const account = await accountService.getAccountBy(
    { name, password: await sha1Encrypt(password) },
    { id: true, name: true, twoFAEnabled: true, twoFASecret: true },
  );

  if (!account) {
    return { success: false, message: 'Wrong credentials.' };
  }

  if (account.twoFAEnabled) {
    console.log('Secret:', account.twoFASecret);
    console.log('Token:', twoFAToken);
    const verified = speakeasy.totp.verify({
      secret: String(account.twoFASecret),
      encoding: 'base32',
      token: twoFAToken,
      window: 2,
    });

    if (!verified) {
      return { success: false, message: 'Wrong 2FA token.' };
    }
  }

  let sessionKey: string = crypto.randomUUID();
  const hashedSessionId = createHash('sha1').update(sessionKey).digest('hex');

  await prisma.accounts_sessions.create({
    data: {
      id: hashedSessionId,
      account_id: account.id,
      expires: Math.trunc((Date.now() + SESSION_DURATION) / 1000),
    },
  });

  const serverPort = parseInt(SERVER_PORT) ?? 7172;
  const pvptype = ['pvp', 'no-pvp', 'pvp-enforced'].indexOf(String(PVP_TYPE));
  const now = Math.trunc(Date.now() / 1000);

  return {
    session: {
      sessionkey: sessionKey,
      lastlogintime: '0', // TODO: implement last login
      ispremium: FREE_PREMIUM === 'true' ? true : account.lastday > now,
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
      // TODO: multiple worlds
      worlds: [
        {
          id: 0,
          name: SERVER_NAME,
          externaladdress: SERVER_ADDRESS,
          externalport: serverPort,
          externaladdressprotected: SERVER_ADDRESS,
          externalportprotected: serverPort,
          externaladdressunprotected: SERVER_ADDRESS,
          externalportunprotected: serverPort,
          previewstate: 0,
          location: 'USA',
          anticheatprotection: false,
          pvptype,
          restrictedstore: false,
        },
      ],
      characters: account.players.map((player): any => ({
        worldid: 0,
        name: player.name,
        ismale: player.sex,
        tutorial: player.istutorial,
        level: player.level,
        vocation: vocationString(player.vocation),
        outfitid: player.looktype,
        headcolor: player.lookhead,
        torsocolor: player.lookbody,
        legscolor: player.looklegs,
        detailcolor: player.lookfeet,
        addonsflags: player.lookaddons,
        ishidden: player.settings?.hidden ? 1 : 0,
        ismaincharacter: player.is_main,
        dailyrewardstate: player.isreward ? 1 : 0,
      })),
    },
  };
}
