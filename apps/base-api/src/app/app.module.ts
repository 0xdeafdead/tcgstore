import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { EntityModule } from '../entity/entity.module';
import { AuthModule } from '../auth/auth.module';
import { PermissionModule } from '../permission/permission.module';
import { RoleModule } from '../role/role.module';
import { JWTModule } from '@user-mgmt-engine/jwt';

@Module({
  imports: [
    UserModule,
    EntityModule,
    AuthModule,
    PermissionModule,
    RoleModule,
    JWTModule.forRootAsync({
      secret: process.env.JWT_SECRET,
      audience: [process.env.BASE_API_AUDIENCE],
      issuer: process.env.BASE_API_ISSUER,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
