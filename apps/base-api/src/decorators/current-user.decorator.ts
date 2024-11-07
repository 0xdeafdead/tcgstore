import { createParamDecorator, SetMetadata } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContextHost) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('request.user', request.user);
    return request.user.sub;
  }
);
