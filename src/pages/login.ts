import http from 'http';
import notp from 'notp';
import { createPool } from 'mysql2/promise';
import base32 from 'thirty-two';
import crypto from 'crypto';

const LOGIN_PORT = 8000;

const queries = {
  casts:
    'SELECT name, level, sex, vocation, looktype, lookhead, lookbody, looklegs, lookfeet, lookaddons, lastlogin, isreward, cast_viewers FROM `players` WHERE `cast_status` > 0 order by cast_viewers asc',
  boosted: 'SELECT * FROM `boosted_creature`',
  online: 'SELECT COUNT(*) FROM `players_online`',
  account:
    'SELECT id, sessionkey FROM `accounts` WHERE `name` = ? AND `password` = ? LIMIT 1',
  players:
    'SELECT name, level, sex, vocation, lookbody, looktype, lookhead, looklegs, lookfeet, lookaddons FROM `players` WHERE `account_id` = ?',
  session:
    'UPDATE accounts SET sessionkey = ?, stayloggedinforsession = ? WHERE id = ? LIMIT 1',
};

const vocations = [
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

interface PoolConfig {
  socketPath: string;
  connectionLimit: number;
  host: string;
  user: string;
  database: string;
  password: string;
}

const poolConfig: PoolConfig = {
  socketPath: '/var/run/mysqld/mysqld.sock',
  connectionLimit: 50,
  host: 'localhost',
  user: 'root',
  database: 'otserv',
  password: 'Pedrorlx@#94',
};

const pool = createPool(poolConfig);

interface World {
  id: number;
  name: string;
  ip: string;
  port: number;
  location: string;
  pvptype: string;
}

const state = {
  boosted: 0,
  online: 0,
  worlds: [
    {
      id: 0,
      name: 'Thoria',
      ip: '132.226.243.148',
      port: 7172,
      location: 'ALL',
      pvptype: 'pvp',
    },
  ] as World[],
  castWorlds: [] as World[],
};

const request = async (req: http.IncomingMessage, res: http.ServerResponse) => {
  if (req.headers['user-agent'] !== 'Mozilla/5.0') return res.end();
  let body = '';
  req.on('data', (data) => {
    body += data;
    if (body.length > 1e6) req.connection.destroy();
  });
  req.on('end', async () => {
    try {
      const message = JSON.parse(body);
      await parseMessage(res, message);
    } catch (e) {
      return res.end();
    }
  });
};

const validate = (secret: string, token: string): boolean => {
  const key = base32.decode(secret).toString('ascii');
  const compare = notp.totp.gen(key);
  return compare === token && notp.totp.verify(token, key);
};

const queryDb = async (query: string, params?: any[]) => {
  const queryArgs = Array.prototype.slice.call(arguments);
  let sqlArgs = [];

  try {
    const conn = await pool.getConnection();

    if (queryArgs.length > 1) {
      sqlArgs = queryArgs[1];
    }

    const res = await conn.query(queryArgs[0], sqlArgs);

    conn.release();
    return res;
  } catch (err) {
    console.error('Login server crashed!', err);
    process.exit(1);
  }
};

const updateWorlds = async () => {
  const result = await queryDb(queries.worlds);
  state.worlds = result.map((world: any) => ({
    id: world.id,
    name: world.name,
    ip: world.ip,
    port: world.port,
    location: 'BR',
    pvptype: 3,
  }));
};

const updateCache = async () => {
  const boosted = await queryDb(queries.boosted);
  const online = await queryDb(queries.online);
  state.online = online ? Object.values(online[0])[0] : 0;
  state.boosted = boosted ? Number(boosted[0].raceid) : 10;
};

const parseLogin = async (res: http.ServerResponse, credentials: any) => {
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
        worlds: state.castWorlds.map((world) => ({
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
};

const parseMessage = async (res: http.ServerResponse, message: any) => {
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
};

const start = async () => {
  try {
    await updateCache();
    setInterval(() => updateCache(), 30 * 1000);
    http.createServer(request).listen(LOGIN_PORT);
    console.log(`Login server listening on "${LOGIN_PORT}"`);
  } catch (e) {
    console.error('Login server crashed!', e);
    process.exit(1);
  }
};

export default start;
