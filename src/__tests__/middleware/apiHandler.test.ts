import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import apiHandler from '../../middleware/apiHandler';

describe('apiHandler', () => {
  test('should return middleware method', () => {
    const method = apiHandler({});
    expect(typeof method).toEqual('function');
  });

  test('should return method not allowed if no handler is present', async () => {
    const method = apiHandler({});

    const { req, res } = createMocks({ method: 'POST' });

    await method(req as any, res as any);

    expect(res.statusCode).toBe(405);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'Method Not Allowed',
    });
  });

  test('should call handler if present', async () => {
    const mockedHandler = jest.fn(
      (req: NextApiRequest, res: NextApiResponse) => {
        res.status(200).json({ success: true });
      }
    );

    const method = apiHandler({
      post: mockedHandler,
    });

    const { req, res } = createMocks({
      method: 'POST',
    });

    await method(req as any, res as any);

    expect(res.statusCode).toBe(200);
    expect(mockedHandler).toBeCalledWith(req, res);
  });

  test('should respond with exception message if handler throws', async () => {
    const mockedHandler = jest.fn(
      (req: NextApiRequest, res: NextApiResponse) => {
        throw Error('foo');
      }
    );

    const method = apiHandler({
      post: mockedHandler,
    });

    const { req, res } = createMocks({
      method: 'POST',
    });

    await method(req as any, res as any);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'foo',
    });
  });
});
