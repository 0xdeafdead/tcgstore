import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { ItemRepository } from './item.repository';

@Module({
  providers: [ItemService, ItemRepository],
  controllers: [ItemController],
})
export class ItemModule {}
