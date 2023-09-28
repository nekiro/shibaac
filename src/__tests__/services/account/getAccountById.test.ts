import { prismaMock } from "../../../singleton";
import * as accountService from "../../../services/accountService";

describe("getAccountById", () => {
	test("should call prisma.findFirst with supplied arguments", async () => {
		const mockedAccount = {
			name: "foo",
			level: 0,
			vocation: 0,
		};
		const mockedAccountId = 1;

		prismaMock.account.findFirst.mockResolvedValue(mockedAccount as any);

		await accountService.getAccountById(mockedAccountId, null);

		expect(prismaMock.account.findFirst).toBeCalledWith({
			where: { id: mockedAccountId },
			include: null,
		});
	});

	test("should return found account", async () => {
		const mockedAccount = {
			name: "foo",
		};

		prismaMock.account.findFirst.mockResolvedValue(mockedAccount as any);

		const result = await accountService.getAccountById(1);

		expect(result).toBe(mockedAccount);
	});

	test("should call prisma.findFirst with default include value", async () => {
		prismaMock.account.findFirst.mockResolvedValue({} as any);

		await accountService.getAccountById(1);

		expect(prismaMock.account.findFirst).toBeCalledWith({
			where: {
				id: 1,
			},
			include: accountService.getAccountByIdIncludeDefault,
		});
	});

	test("should return null when exception is thrown", async () => {
		prismaMock.account.findFirst.mockRejectedValue(new Error());

		const result = await accountService.getAccountById(1);

		expect(result).toBe(null);
	});
});
