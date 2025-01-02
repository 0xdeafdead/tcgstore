import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JWTService } from '../../../libs/jwt/src/lib/jwt.service';
import { envs } from '../src/config';

@Injectable()
export class BaseGuard implements CanActivate {
  constructor(@Inject(JWTService) private readonly jwtService: JWTService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No authentication provided');
    }
    try {
      const payload = await this.jwtService.verifyToken(token, {
        algorithms: ['HS256'],
        issuer: [envs.issuer],
        audience: [envs.audience],
      });
      request['user'] = {
        sub: payload.sub,
        role: payload.role,
      };
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new ForbiddenException('Invalid token');
      }
    }
  }
}
