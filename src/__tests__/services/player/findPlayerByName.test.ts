import { prismaMock } from '../../../singleton';
import * as playerService from '../../../services/playerService';

describe('findPlayerByName', () => {
  test('should call prisma.findFirst with supplied argument', async () => {
    const mockedPlayerName = 'foo';

    prismaMock.player.create.mockResolvedValue({} as any);

    await playerService.findPlayerByName(mockedPlayerName);

    expect(prismaMock.player.findFirst).toBeCalledWith({
      where: { name: mockedPlayerName },
    });
  });

  test('should return found player', async () => {
    const mockedPlayer = {
      name: 'foo',
    };

    prismaMock.player.findFirst.mockResolvedValue(mockedPlayer as any);

    const result = await playerService.findPlayerByName(mockedPlayer.name);

    expect(result).toBe(mockedPlayer);
  });

  test('should return null when exception is thrown', async () => {
    prismaMock.player.findFirst.mockRejectedValue(new Error());

    const result = await playerService.findPlayerByName('foo');

    expect(result).toBe(null);
  });
});
