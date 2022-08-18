import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import { ValidationError } from 'yup';
import { validate } from '../../middleware/validation';

describe('validation', () => {
  test('should call schema validate', async () => {
    const mockedSchema = {
      camelCase: jest.fn().mockReturnThis(),
      validate: jest.fn(),
    };
    const mockedHandler = jest.fn(
      (req: NextApiRequest, res: NextApiResponse) => {
        res.json({ success: true });
      }
    );
    const mockedBody = { name: 'foo' };

    const validator = validate(mockedSchema as any, mockedHandler);

    const { req, res } = createMocks({ method: 'POST', body: mockedBody });

    await validator(req as any, res as any);

    expect(mockedSchema.camelCase).toBeCalled();
    expect(mockedSchema.validate).toBeCalledWith(mockedBody, {
      abortEarly: false,
    });
    expect(mockedHandler).toBeCalledWith(req, res);
  });

  test('if validation throws ValidationError should return with http code 400 Bad Request', async () => {
    const mockedSchema = {
      camelCase: jest.fn().mockReturnThis(),
      validate: jest.fn().mockRejectedValue(new ValidationError('foo')),
    };
    const mockedHandler = jest.fn(
      (req: NextApiRequest, res: NextApiResponse) => {
        res.json({ success: true });
      }
    );

    const validator = validate(mockedSchema as any, mockedHandler);

    const { req, res } = createMocks({ method: 'POST' });

    await validator(req as any, res as any);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'foo',
    });
  });

  test('if validation throws any error should return with internal server error code', async () => {
    const mockedSchema = {
      camelCase: jest.fn().mockReturnThis(),
      validate: jest.fn().mockRejectedValue(new Error('foo')),
    };
    const mockedHandler = jest.fn(
      (req: NextApiRequest, res: NextApiResponse) => {
        res.json({ success: true });
      }
    );

    const validator = validate(mockedSchema as any, mockedHandler);

    const { req, res } = createMocks({ method: 'POST' });

    await validator(req as any, res as any);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      success: false,
    });
  });
});
