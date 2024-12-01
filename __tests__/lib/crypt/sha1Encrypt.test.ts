import { sha1Encrypt } from "@lib/crypt";
import crypto from "crypto";

describe("sha1Encrypt", () => {
	test("should return precomputed hash", async () => {
		const mockedInputs = [
			{ input: "foo", result: "0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33" },
			{ input: "bar", result: "62cdb7020ff920e5aa642c3d4066950dd1f01f4d" },
		];

		for (const input of mockedInputs) {
			const result = await sha1Encrypt(input.input);

			expect(result).toEqual(input.result);
		}
	});

	test("should call crypto methods", async () => {
		const mockedInput = "foobar";

		const hashMock = {
			update: jest.fn().mockReturnThis(),
			digest: jest.fn().mockReturnValueOnce("foo"),
		};

		const createHashSpy = jest.spyOn(crypto, "createHash").mockImplementationOnce(() => hashMock as unknown as crypto.Hash);

		const result = await sha1Encrypt(mockedInput);

		expect(createHashSpy).toBeCalledWith("sha1");
		expect(hashMock.update).toBeCalledWith(mockedInput, "utf-8");
		expect(hashMock.digest).toBeCalledWith("hex");

		expect(result).toEqual("foo");
	});
});
