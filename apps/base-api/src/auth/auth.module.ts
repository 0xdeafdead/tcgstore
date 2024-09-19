import { Module } from '@nestjs/common';
import { JWTModule } from '@tcg-market-core/jwt';

import { AuthenticationService } from './authentication/authentication.service';
import { UserModule } from '../user/user.module';
import { AuthenticationController } from './authentication/authentication.controller';

@Module({
  providers: [AuthenticationService],
  imports: [UserModule, JWTModule.forRoot({ secret: process.env.JWT_SECRET })],
  controllers: [AuthenticationController],
})
export class AuthModule {}
