import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

type Handler = {
  get?: NextApiHandler;
  post?: NextApiHandler;
};

const apiHandler =
  (handler: Handler) => async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method?.toLowerCase() as string;

    // check handler supports HTTP method
    const callback = handler[method] as NextApiHandler;
    if (!callback) {
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
      await callback(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: err.message });
    }
  };
export default apiHandler;
