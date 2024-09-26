import { Module } from '@nestjs/common';

import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import { PrismaModule } from '../prisma-service/prisma.module';
import { RoleController } from './role.controller';

@Module({
  imports: [PrismaModule],
  providers: [RoleService, RoleRepository],
  controllers: [RoleController],
  exports: [RoleRepository, PrismaModule],
})
export class RoleModule {}
