import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import base32 from 'base32';
import notp from 'notp';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const message = JSON.parse(req.body);
    await parseMessage(res, message);
  } catch (e) {
    return res.status(500).end();
  }
};

interface Player {
  name: string;
  level: number;
  sex: number;
  vocation: number;
  looktype: number;
  lookhead: number;
  lookbody: number;
  looklegs: number;
  lookfeet: number;
  lookaddons: number;
  lastlogin?: Date;
  isreward?: number;
  cast_viewers?: number;
  hidden?: number;
}

interface World {
  id: number;
  name: string;
}

type Vocation =
  | 'None'
  | 'Sorcerer'
  | 'Druid'
  | 'Paladin'
  | 'Knight'
  | 'Master Sorcerer'
  | 'Elder Druid'
  | 'Royal Paladin'
  | 'Elite Knight';

const vocations: Vocation[] = [
  'None',
  'Sorcerer',
  'Druid',
  'Paladin',
  'Knight',
  'Master Sorcerer',
  'Elder Druid',
  'Royal Paladin',
  'Elite Knight',
];

const state = {
  boosted: 0,
  online: 0,
  worlds: [
    {
      id: 0,
      name: 'Rekteria',
      ip: '51.75.55.7',
      port: 7172,
      location: 'ALL',
      pvptype: 'pvp',
    },
  ],
  castWorlds: [],
} as any;

const queries = {
  casts: async () => {
    return [];
  },

  boosted: async () => {
    return await prisma.boosted_creature.findMany();
  },

  online: async () => {
    const onlinePlayers = await prisma.players_online.count();
    return onlinePlayers;
  },

  account: async (name, password) => {
    return [];
  },

  players: async (account_id) => {
    return await prisma.players.findMany({
      where: { account_id: account_id },
      select: {
        name: true,
        level: true,
        sex: true,
        vocation: true,
        looktype: true,
        lookhead: true,
        lookbody: true,
        looklegs: true,
        lookfeet: true,
        lookaddons: true,
      },
    });
  },

  session: async () => {
    return [];
  },
};

const validate = (secret, token) => {
  const key = base32.decode(secret).toString('ascii');
  const compare = notp.totp.gen(key);
  return compare === token && notp.totp.verify(token, key);
};

async function queryDb(query: string, args?: any[]): Promise<any> {}

async function parseMessage(res, message) {
  const { type } = message;
  const sendResponse = (data) => res.end(JSON.stringify(data));

  switch (type) {
    case 'boostedcreature':
      return sendResponse({
        raceid: state.boosted,
      });
    case 'cacheinfo':
      return sendResponse({
        playersonline: state.online,
        twitchstreams: 0,
        twitchviewer: 130,
        gamingyoutubestreams: 0,
        gamingyoutubeviewer: 0,
      });
    case 'login':
      const hash = crypto.createHash('sha1');
      hash.update(message.password);
      return parseLogin(res, {
        accountname: message.email,
        token: message.token,
        sessionarg: message.password,
        password: hash.digest('hex'),
        stayloggedin: message.stayloggedin,
      });

    default:
      return res.end();
  }
}

async function parseLogin(res, credentials) {
  const { accountname, password, token, stayloggedin, sessionarg } =
    credentials;
  let castPassword = '';
  const castsessionkey = `${accountname}\n${sessionarg}`;
  const casts = await queryDb(queries.casts);

  const sendError = (code, data) =>
    res.end(
      JSON.stringify({
        errorCode: code,
        errorMessage: data,
      }),
    );

  // Missing credentials
  if (!accountname || !password) {
    return sendError(3, 'Account name or password is incorrect.');
  }

  // Cast Login
  if (accountname === 'cast') {
    if (casts.length < 1) {
      return sendError(3, 'Currently there are no active casts on Rekteria.');
    }
    if (password !== 'cast') {
      castPassword == password;
    }

    const response = JSON.stringify({
      session: {
        sessionkey: castsessionkey,
        lastlogintime: 0,
        ispremium: true,
        premiumuntil: 0,
        status: 'active',
        returnernotification: false,
        showrewardnews: false,
        isreturner: true,
        fpstracking: false,
        optiontracking: false,
      },
      playdata: {
        characters: await casts.map((player, index) => {
          let obj = {
            id: index,
            name: `Viewers: ${player.cast_viewers}`,
            ip: '51.75.55.7',
            port: 7172,
            location: 'ALL',
            pvptype: 'pvp',
          };
          state.castWorlds.push(obj);
          return {
            worldid: index,
            name: player.name,
            level: player.level,
            vocation: vocations[player.vocation],
            ismale: player.sex === 1,
            ishidden: player.hidden === 1,
            tutorial: false,
            outfitid: player.looktype,
            headcolor: player.lookhead,
            torsocolor: player.lookbody,
            legscolor: player.looklegs,
            detailcolor: player.lookfeet,
            addonsflags: player.lookaddons,
          };
        }),
        worlds: state.castWorlds.map((world: any) => ({
          id: world.id,
          name: world.name,
          externaladdress: world.ip,
          externalport: world.port,
          externaladdressprotected: world.ip,
          externaladdressunprotected: world.ip,
          externalportprotected: world.port,
          externalportunprotected: world.port,
          previewstate: 0,
          location: world.location,
          anticheatprotection: false,
          pvptype: world.pvptype,
          istournamentworld: false,
          restrictedstore: false,
          currenttournamentphase: 2,
        })),
      },
    });

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(response),
    });

    res.end(response);
  } else {
    try {
      // Lookup account with credentials
      const account = await queryDb(queries.account, [accountname, password]);
      if (!account || account.length === 0) {
        return sendError(3, 'Account name or password is incorrect.');
      }

      // Two-factor authentication
      const { id, authsecret } = account[0];
      if (authsecret && (!token || !validate(authsecret, token))) {
        return sendError(6, 'Two-factor token required for authentication.');
      }

      const d = new Date();
      const sessionkey = `${accountname}\n${sessionarg}\n123123123\n${Math.floor(
        d.getTime() / 30,
      )}`;
      const players = await queryDb(queries.players, [id]);

      // Login response
      const response = JSON.stringify({
        session: {
          sessionkey: sessionkey,
          lastlogintime: 0,
          ispremium: true,
          premiumuntil: 0,
          status: 'active',
          returnernotification: false,
          showrewardnews: false,
          isreturner: true,
          fpstracking: false,
          optiontracking: false,
        },
        playdata: {
          worlds: state.worlds.map((world) => ({
            id: 0,
            name: world.name,
            externaladdress: world.ip,
            externalport: world.port,
            externaladdressprotected: world.ip,
            externaladdressunprotected: world.ip,
            externalportprotected: world.port,
            externalportunprotected: world.port,
            previewstate: 0,
            location: world.location,
            anticheatprotection: false,
            pvptype: world.pvptype,
            istournamentworld: false,
            restrictedstore: false,
            currenttournamentphase: 2,
          })),
          characters: players.map((player) => ({
            worldid: 0,
            name: player.name,
            level: player.level,
            vocation: vocations[player.vocation],
            ismale: player.sex === 1,
            ishidden: player.hidden === 1,
            tutorial: false,
            outfitid: player.looktype,
            headcolor: player.lookhead,
            torsocolor: player.lookbody,
            legscolor: player.looklegs,
            detailcolor: player.lookfeet,
            addonsflags: player.lookaddons,
          })),
        },
      });

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(response),
      });

      res.end(response);
    } catch (error) {
      return res.end();
    }
  }
}
