import { Module } from '@nestjs/common';
import { EntityService } from './entity.service';
import { EntityController } from './entity.controller';
import { EntityRepository } from './entity.repository';
import { PrismaModule } from '../prisma-service/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EntityService, EntityRepository],
  controllers: [EntityController],
})
export class EntityModule {}
