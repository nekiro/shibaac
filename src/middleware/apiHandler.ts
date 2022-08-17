import { NextApiRequest, NextApiResponse } from 'next';

const apiHandler = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method?.toLowerCase() as string;

    // check handler supports HTTP method
    if (!handler[method]) {
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
      await handler[method](req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: err.message });
    }
  };
};

export default apiHandler;
