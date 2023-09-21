import { prismaMock } from '../../../singleton';
import * as accountService from '../../../services/accountService';
import { sha1Encrypt } from '../../../lib/crypt';

describe('createAccount', () => {
  test('should call prisma.create with supplied data', async () => {
    const mockedAccount = {
      name: 'foo',
      password: 'email',
      email: 'foo@bar.com',
    };

    prismaMock.accounts.create.mockResolvedValue(mockedAccount as any);

    await accountService.createAccount(
      mockedAccount.name,
      mockedAccount.password,
      mockedAccount.email,
    );

    expect(prismaMock.accounts.create).toBeCalledWith({
      data: {
        name: mockedAccount.name,
        password: await sha1Encrypt(mockedAccount.password),
        email: mockedAccount.email,
      },
    });
  });

  test('should return created account', async () => {
    const mockedAccount = {
      name: 'foo',
    };

    prismaMock.accounts.create.mockResolvedValue(mockedAccount as any);

    const result = await accountService.createAccount(
      'foo',
      'bar',
      'foo@bar.com',
    );

    expect(result).toBe(mockedAccount);
  });

  test('should return null when exception is thrown', async () => {
    prismaMock.accounts.create.mockRejectedValue(new Error());

    const result = await accountService.createAccount(
      'foo',
      'bar',
      'foo@bar.com',
    );

    expect(result).toBe(null);
  });
});
