import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { ValidationError } from 'yup';
import { ObjectShape, OptionalObjectSchema } from 'yup/lib/object';

export const validate =
  (schema: OptionalObjectSchema<ObjectShape>, handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      if (req.body) {
        req.body = await schema
          .camelCase()
          .validate(req.body, { abortEarly: false });
      }
    } catch (yupError) {
      if (yupError instanceof ValidationError) {
        return res
          .status(400)
          .json({ success: false, message: yupError.errors.join(', ') });
      }
    }

    await handler(req, res);
  };
