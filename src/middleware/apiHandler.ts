import { NextApiRequest, NextApiResponse } from 'next';

const apiHandler = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method?.toLowerCase();

    // check handler supports HTTP method
    //@ts-ignore
    if (!handler[method]) {
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    // route handler
    //@ts-ignore
    await handler[method](req, res);
  };
};

export default apiHandler;
