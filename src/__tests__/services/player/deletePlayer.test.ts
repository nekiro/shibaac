import { prismaMock } from "../../../singleton";
import * as playerService from "../../../services/playerService";

describe("deletePlayer", () => {
	test("should call prisma.delete with supplied argument", async () => {
		const mockedPlayer = {
			id: 1,
		};

		prismaMock.player.delete.mockResolvedValue(mockedPlayer as any);

		await playerService.deletePlayer(mockedPlayer.id);

		expect(prismaMock.player.delete).toBeCalledWith({
			where: {
				id: mockedPlayer.id,
			},
		});
	});

	test("should return deleted player", async () => {
		const mockedPlayer = {
			id: 1,
		};

		prismaMock.player.delete.mockResolvedValue(mockedPlayer as any);

		const result = await playerService.deletePlayer(mockedPlayer.id);

		expect(result).toBe(mockedPlayer);
	});

	test("should return null when exception is thrown", async () => {
		prismaMock.player.delete.mockRejectedValue(new Error());

		const result = await playerService.deletePlayer(1);

		expect(result).toBe(null);
	});
});
