module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: ['**/tests/**/*.test.{js,ts}'],
  collectCoverageFrom: ['src/**/*.{js,ts}', '!src/index.{js,ts}', '!src/server.{js,ts}'],
  coverageThreshold: {
    // Objetivo 80% progresivo — durante migración JS+TS duplican archivos (TS 0% hasta migrar tests); umbral CI 25%
    global: { branches: 25, functions: 25, lines: 25, statements: 25 },
  },
  modulePathIgnorePatterns: ['<rootDir>/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000,
  verbose: true,
  moduleFileExtensions: ['js', 'ts', 'json'],
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json', diagnostics: false }] },
};
