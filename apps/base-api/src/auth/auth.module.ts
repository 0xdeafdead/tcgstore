import { Module } from '@nestjs/common';

import { AuthenticationService } from './authentication/authentication.service';
import { UserModule } from '../user/user.module';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthorizationService } from './authorization/authorization.service';
import { AuthorizationController } from './authorization/authorization.controller';
import { PrismaModule } from '../prisma-service/prisma.module';

@Module({
  imports: [UserModule, PrismaModule],
  providers: [AuthenticationService, AuthorizationService],
  controllers: [AuthenticationController, AuthorizationController],
})
export class AuthModule {}
