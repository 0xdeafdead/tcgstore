/* eslint-disable */
export default {
  displayName: 'base-api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.[tj]s'],
  coverageDirectory: '../../coverage/apps/base-api',
  coverageReporters: ['lcov'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/guards',
    '<rootDir>/src/.*.repository.*',
    '<rootDir>/node_modules/',
  ],
};
