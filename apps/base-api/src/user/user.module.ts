import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRespository } from './user.repository';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [RoleModule],
  providers: [UserService, UserRespository],
  controllers: [UserController],
  exports: [UserService, RoleModule],
})
export class UserModule {}
