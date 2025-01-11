import { createParamDecorator, SetMetadata } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContextHost): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
