import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma-service/prisma.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRespository } from './user.repository';

@Module({
  imports: [PrismaModule],
  providers: [UserService,UserRespository],
  controllers: [UserController],
})
export class UserModule {}
