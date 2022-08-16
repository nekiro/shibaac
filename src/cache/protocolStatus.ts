import PromiseSocket from 'promise-socket';
import net from 'net';
import { parseXml } from '../lib/crypt';

let lastUpdated = 0;

const cache = {
  onlineCount: 0,
  maxOnlineCount: 0,
  uptime: 0,
  online: false,
  name: '',
};

export const getCache = async () => {
  if (lastUpdated == 0 || Date.now() >= lastUpdated + 30000) {
    await updateCache();
  }

  return cache;
};

export const updateCache = async () => {
  //console.log(`[${Date.now()}] update cache called`);

  try {
    const socket = new PromiseSocket(new net.Socket());
    await socket.connect(
      parseInt(process.env.STATUS_PORT as string),
      process.env.STATUS_HOST as string
    );

    await socket.write(
      // ASCII characters
      // 0x06 -> ACK
      // 0x00 -> NULL
      // 0xFF -> protocol identifier (protocol status)
      // 0xFF -> status byte
      // 0x69 0x6E 0x66 0x6F (info) -> string
      Buffer.from([0x06, 0x00, 0xff, 0xff, 0x69, 0x6e, 0x66, 0x6f])
    );

    // wait 1s for response
    socket.setTimeout(1000);
    const data = (await socket.readAll()) as Buffer;
    const doc = parseXml(data.toString());

    // update cache
    cache.onlineCount = doc.tsqp.players.online;
    cache.maxOnlineCount = doc.tsqp.players.max;
    cache.uptime = doc.tsqp.serverinfo.uptime;
    cache.online = true;
    cache.name = doc.tsqp.serverinfo.servername;
  } catch ({ code }) {
    if (code === 'ECONNREFUSED') {
      cache.online = false;
    }
  }

  // set last updated
  lastUpdated = Date.now();
};
