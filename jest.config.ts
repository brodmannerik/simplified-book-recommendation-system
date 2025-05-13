import type { Config } from "jest";

const config: Config = {
  rootDir: "./",
  testEnvironment: "jsdom",
  preset: "ts-jest",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "react-router": "react-router",
  },
  setupFilesAfterEnv: ["./jest.setup.ts"],
};

export default config;
