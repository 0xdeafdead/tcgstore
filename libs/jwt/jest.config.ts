/* eslint-disable */
// import type { Config } from 'jest';

// export default async (): Promise<Config> => {
export default {
  displayName: 'auth',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/auth',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.[tj]s'],
  coverageReporters: ['lcov'],
};
// };
