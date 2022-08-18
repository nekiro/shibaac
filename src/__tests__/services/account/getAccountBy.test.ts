import { prismaMock } from '../../../singleton';
import * as accountService from '../../../services/accountService';

describe('getAccountBy', () => {
  test('should call prisma.findFirst with supplied arguments', async () => {
    const mockedSelect = {
      players: true,
    };
    const mockedWhere = {
      name: 'foo',
    };

    prismaMock.account.findFirst.mockResolvedValue({} as any);

    await accountService.getAccountBy(mockedWhere, mockedSelect);

    expect(prismaMock.account.findFirst).toBeCalledWith({
      where: mockedWhere,
      select: mockedSelect,
    });
  });

  test('should return found account', async () => {
    const mockedAccount = {
      name: 'foo',
    };

    prismaMock.account.findFirst.mockResolvedValue(mockedAccount as any);

    const result = await accountService.getAccountBy({}, {});

    expect(result).toBe(mockedAccount);
  });

  test('should return null when exception is thrown', async () => {
    const mockedSelect = {
      players: true,
    };
    const mockedWhere = {
      name: 'foo',
    };

    prismaMock.account.findFirst.mockRejectedValue(new Error());

    const result = await accountService.getAccountBy(mockedWhere, mockedSelect);

    expect(result).toBe(null);
  });
});
