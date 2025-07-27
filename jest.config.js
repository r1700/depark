module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/__tests__/**/*.test.ts'
  ],
  roots: [
    '<rootDir>/packages/backend',
    '<rootDir>/packages/frontend'
  ]
};