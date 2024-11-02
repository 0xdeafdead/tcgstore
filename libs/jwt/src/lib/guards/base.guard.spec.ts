import { BaseGuard } from './base.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new BaseGuard()).toBeDefined();
  });
});
