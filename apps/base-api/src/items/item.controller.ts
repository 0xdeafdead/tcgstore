import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Item } from '@prisma/client';
import { Observable } from 'rxjs';
import { ItemService } from './item.service';
import { CreateItemDTO } from './DTOs/createItem.dto';

@Controller('item')
export class ItemController {
  constructor(private readonly service: ItemService) {}
  @Get()
  getAllItems(): Observable<Item[]> {
    return this.service.getAllItems();
  }

  @Get('/:id')
  getItem(@Param('id') id: string): Observable<Item> {
    return this.service.getOneItem(id);
  }

  @Post()
  createItem(@Body('input') input: CreateItemDTO): Observable<Item> {
    return this.service.createItem(input);
  }

  @Delete('/:id')
  deleteItem(@Param('id') id: string): Observable<boolean> {
    return this.service.deleteItem(id);
  }
}
