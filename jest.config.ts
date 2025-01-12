import { getJestProjectsAsync } from '@nx/jest';

export default async () => ({
  projects: [{ verbose: true, displaName: 'base-api' }], //await getJestProjectsAsync(),
});
