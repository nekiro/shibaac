import { createMocks } from 'node-mocks-http';
import login from '../../../pages/api/accounts/login';

describe('/api/accounts/login', () => {
  test('login endpoint', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: JSON.stringify({
        name: 'nekiro',
        password: 'nekiro',
      }),
    });

    await login(req, res);

    const result = JSON.parse(res._getData());

    expect(
      (() =>
        result.hasOwnProperty('args') || result.hasOwnProperty('message'))()
    ).toBe(true);
    expect(res._getStatusCode()).toBe(200);
  });
});
