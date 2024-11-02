import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JWTService } from '../jwt.service';

@Injectable()
export class BaseGuard implements CanActivate {
  constructor(@Inject(JWTService) private readonly jwtService: JWTService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    console.log('token', token);
    if (!token) {
      return false;
    }
    try {
      const payload = await this.jwtService.verifyToken(token);
      request['user'] = payload;
      return true;
    } catch (error) {
      return false;
    }
  }

  // getGrapqhqlRequest(context: ExecutionContext) {
  //   const ctx = GqlExecutionContext.create(context);
  //   return ctx.getContext().req;
  // }
}
