import { prismaMock } from '../../../singleton';
import * as accountService from '../../../services/accountService';

describe('getAccountByName', () => {
  test('should call prisma.findFirst with supplied arguments', async () => {
    const mockedAccount = {
      name: 'foo',
      level: 0,
      vocation: 0,
    };
    const mockedAccountName = 'foo';
    const mockedInclude = {
      players: true,
    };

    prismaMock.accounts.findFirst.mockResolvedValue(mockedAccount as any);

    await accountService.getAccountByName(mockedAccountName, mockedInclude);

    expect(prismaMock.accounts.findFirst).toBeCalledWith({
      where: { name: mockedAccountName },
      include: { players: true },
    });
  });

  test('should return found account', async () => {
    const mockedAccount = {
      name: 'foo',
    };

    prismaMock.accounts.findFirst.mockResolvedValue(mockedAccount as any);

    const result = await accountService.getAccountByName('foo');

    expect(result).toBe(mockedAccount);
  });

  test('should return null when exception is thrown', async () => {
    prismaMock.accounts.findFirst.mockRejectedValue(new Error());

    const result = await accountService.getAccountByName('foo');

    expect(result).toBe(null);
  });
});
