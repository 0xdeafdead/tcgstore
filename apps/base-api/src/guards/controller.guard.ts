import {
  CanActivate,
  ExecutionContext,
  Type,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';

export const ControllerGuard = (permissions: string[]): Type<CanActivate> => {
  class ControllerGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();

      const apiKey = request.headers.authorization;

      if (!apiKey) {
        throw new UnauthorizedException('No authentication provided');
      }

      return true;
    }
  }
  return mixin(ControllerGuardMixin);
};
