import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";
import prisma from "./prisma";

//@ts-ignore
jest.mock("./prisma", () => ({
	__esModule: true,
	default: mockDeep<PrismaClient>(),
}));

//@ts-ignore
beforeEach(() => {
	mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
