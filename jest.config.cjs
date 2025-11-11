/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  preset: "ts-jest/presets/default-esm",
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }],
  },
  extensionsToTreatAsEsm: [".ts"],
  testMatch: ["<rootDir>/src/tests/**/*.test.ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@prisma|supertest|dotenv|express|bcrypt|jsonwebtoken|joi|express-async-errors|@types|jest|ts-jest|typescript|source-map-support|ts-node|tsx|ts-node-dev|prisma|@prisma|uuid)/)",
  ],
};
