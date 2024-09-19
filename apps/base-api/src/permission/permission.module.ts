import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma-service/prisma.module';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PermissionRepository } from './permission.repository';

@Module({
  imports: [PrismaModule],
  providers: [PermissionService, PermissionRepository],
  controllers: [PermissionController],
})
export class PermissionModule {}
