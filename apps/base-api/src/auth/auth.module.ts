import { Module } from '@nestjs/common';

import { AuthenticationService } from './authentication/authentication.service';
import { UserModule } from '../user/user.module';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthorizationService } from './authorization/authorization.service';
import { AuthorizationController } from './authorization/authorization.controller';
import { PrismaModule } from '../prisma-service/prisma.module';
import { JWTModule } from '@user-mgmt-engine/jwt';
import { envs } from '../config';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    JWTModule.forRootAsync({
      secret: envs.jwtSecret,
      audience: [envs.audience],
      issuer: envs.audience,
    }),
  ],
  providers: [AuthenticationService, AuthorizationService],
  controllers: [AuthenticationController, AuthorizationController],
})
export class AuthModule {}
