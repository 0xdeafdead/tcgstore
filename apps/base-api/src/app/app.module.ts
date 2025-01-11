import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { EntityModule } from '../entity/entity.module';
import { AuthModule } from '../auth/auth.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [UserModule, EntityModule, AuthModule, PermissionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
