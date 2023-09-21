import { prismaMock } from '../../../singleton';
import * as playerService from '../../../services/playerService';

describe('findPlayerByName', () => {
  test('should call prisma.findFirst with supplied argument', async () => {
    const mockedPlayerName = 'foo';

    prismaMock.players.create.mockResolvedValue({} as any);

    await playerService.findPlayerByName(mockedPlayerName);

    expect(prismaMock.players.findFirst).toBeCalledWith({
      where: { name: mockedPlayerName },
    });
  });

  test('should return found player', async () => {
    const mockedPlayer = {
      name: 'foo',
    };

    prismaMock.players.findFirst.mockResolvedValue(mockedPlayer as any);

    const result = await playerService.findPlayerByName(mockedPlayer.name);

    expect(result).toBe(mockedPlayer);
  });

  test('should return null when exception is thrown', async () => {
    prismaMock.players.findFirst.mockRejectedValue(new Error());

    const result = await playerService.findPlayerByName('foo');

    expect(result).toBe(null);
  });
});
