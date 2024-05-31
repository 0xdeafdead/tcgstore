import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Item } from '@prisma/client';
import { Observable } from 'rxjs';
import { ItemService } from './item.service';
import { CreateItemDTO } from './DTOs/createItem.dto';

@Controller('item')
export class ItemController {
  constructor(private readonly service: ItemService) {}
  @Get()
  getAllUsers(): Observable<Item[]> {
    return this.service.getAllItems();
  }

  @Get('/:id')
  getOne(@Param('id') id: string): Observable<Item> {
    return this.service.getOneItem(id);
  }

  @Post()
  createUser(@Body('input') input: CreateItemDTO): Observable<Item> {
    return this.service.createItem(input);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string): Observable<boolean> {
    return this.service.deleteItem(id);
  }
}
