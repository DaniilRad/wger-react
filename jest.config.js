export const preset = "ts-jest";
export const testEnvironment = "jsdom";
export const setupFilesAfterEnv = ["<rootDir>/src/setupTests.ts"];
export const moduleNameMapper = {
    "^components/(.*)$": "<rootDir>/src/components/$1",
    "^utils/(.*)$": "<rootDir>/src/utils/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
};
export const collectCoverageFrom = [
    "src/components/Dashboard/**/*.{ts,tsx}",
    "!src/components/Dashboard/**/*.test.{ts,tsx}",
    "!src/components/Dashboard/**/*.stories.{ts,tsx}",
];
export const coverageThresholds = {
    global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
    },
};
export const testMatch = ["**/__tests__/**/*.{ts,tsx}", "**/*.test.{ts,tsx}"];
