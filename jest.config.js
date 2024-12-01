// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
	moduleDirectories: ["node_modules", "<rootDir>/"],
	testEnvironment: "jest-environment-jsdom",
	testMatch: ["<rootDir>/__tests__/**/*.(spec|test).(t|j)s?(x)"],
	clearMocks: true,
	setupFilesAfterEnv: ["<rootDir>/src/singleton.ts"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
