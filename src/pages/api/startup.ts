import type { NextApiRequest, NextApiResponse } from 'next';

let called = false;

// fixes error - TypeError: Do not know how to serialize a BigInt
// @ts-ignore
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

const handler = (_: NextApiRequest, res: NextApiResponse) => {
  if (called) {
    res.status(304);
  } else {
    res.json({ success: true });
    called = true;
  }
};

export default handler;
