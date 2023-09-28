import { prismaMock } from "../../../singleton";
import * as playerService from "../../../services/playerService";

describe("createPlayer", () => {
	test("should call prisma.create with supplied data", async () => {
		const mockedPlayer = {
			name: "foo",
			account_id: 1,
			vocation: 0,
			sex: 1,
		};

		prismaMock.player.create.mockResolvedValue(mockedPlayer as any);

		await playerService.createPlayer(
			mockedPlayer.name,
			mockedPlayer.account_id,
			mockedPlayer.vocation,
			mockedPlayer.sex
		);

		expect(prismaMock.player.create).toBeCalledWith({
			data: {
				name: mockedPlayer.name,
				account_id: mockedPlayer.account_id,
				vocation: mockedPlayer.vocation,
				sex: mockedPlayer.sex,
			},
		});
	});

	test("should return created player", async () => {
		const mockedPlayer = {
			name: "foo",
		};

		prismaMock.player.create.mockResolvedValue(mockedPlayer as any);

		const result = await playerService.createPlayer("foo", 1, 0, 1);

		expect(result).toBe(mockedPlayer);
	});

	test("should return null when exception is thrown", async () => {
		prismaMock.player.create.mockRejectedValue(new Error());

		const result = await playerService.createPlayer("foo", 1, 1, 1);

		expect(result).toBe(null);
	});
});
