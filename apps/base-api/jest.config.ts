/* eslint-disable */

export default {
  displayName: 'base-api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/base-api',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.[tj]s'],
  coverageReporters: ['lcov'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/guards',
    '<rootDir>/src/.*.repository.*',
    '<rootDir>/src/decorators',
    '<rootDir>/src/config',
  ],
};
