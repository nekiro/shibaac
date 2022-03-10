import { createMocks } from 'node-mocks-http';
import register from '../src/pages/api/accounts/register';

describe('/api/accounts/register', () => {
  test('registers new account endpoint', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: JSON.stringify({
        name: 'awdoawdwad123owad',
        password: 'awdwad12312312312',
        email: 'nekiro@nekiro.pl',
      }),
    });

    await register(req, res);

    const result = JSON.parse(res._getData());

    expect(typeof result.message).toBe('string');
    expect(res._getStatusCode()).toBe(200);
  });
});
