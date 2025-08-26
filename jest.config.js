module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // roots: ['<rootDir>/packages'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'packages/backend/src/**/*.ts',
    '!packages/backend/src/**/*.d.ts',
  ],
  testTimeout: 10000,
};
