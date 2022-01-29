import { getCache } from 'src/cache/protocolStatus';

export default async function handler(req, res) {
  if (req.method == 'GET') {
    res.status(200).json({ success: true, args: { status: await getCache() } });
  }
}
