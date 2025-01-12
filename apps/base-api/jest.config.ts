/* eslint-disable */
import { getJestProjectsAsync } from '@nx/jest';

// export default async ()=> ({
//   displayName: 'base-api',
//   preset: '../../jest.preset.js',
//   testEnvironment: 'node',
//   transform: {
//     '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
//   },
//   moduleFileExtensions: ['ts', 'js', 'html'],
//   collectCoverage: true,
//   collectCoverageFrom: ['<rootDir>/src/**/*.[tj]s'],
//   coverageDirectory: '../../coverage/apps/base-api',
//   coverageReporters: ['lcov'],
//   coveragePathIgnorePatterns: [
//     '<rootDir>/src/guards',
//     '<rootDir>/src/.*.repository.*',
//     '<rootDir>/node_modules/',
//     '<rootDir>/src/decorators',
//   ],
// });

export default async () => ({
  projects: [...(await getJestProjectsAsync())],
});
