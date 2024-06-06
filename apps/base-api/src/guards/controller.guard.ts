import {
  CanActivate,
  ExecutionContext,
  Type,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';
import { ACCESS_LEVEL } from '../types/shared';

export const ControllerGuard = (
  accessLevel: ACCESS_LEVEL
): Type<CanActivate> => {
  class ControllerGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();

      const apiKey = request.headers.authorization;

      if (!apiKey) {
        throw new UnauthorizedException('No authentication provided');
      }

      switch (accessLevel) {
        case ACCESS_LEVEL.USER:
          return (
            apiKey === process.env.DEV_AUTH_KEY ||
            apiKey === process.env.ADMIN_AUTH_KEY ||
            apiKey === process.env.USER_AUTH_KEY
          );
        case ACCESS_LEVEL.ADMIN:
          return (
            apiKey === process.env.DEV_AUTH_KEY ||
            apiKey === process.env.ADMIN_AUTH_KEY
          );
        case ACCESS_LEVEL.DEV:
          return apiKey === process.env.USER_AUTH_KEY;
        default:
          throw new UnauthorizedException();
      }
    }
  }

  return mixin(ControllerGuardMixin);
};
