import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { ItemRepository } from './item.repository';
import { PrismaModule } from '../prisma-service/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ItemService, ItemRepository],
  controllers: [ItemController],
  imports:[PrismaModule]
})
export class ItemModule {}
