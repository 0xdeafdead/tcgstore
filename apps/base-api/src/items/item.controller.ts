import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Item } from '@prisma/client';
import { Observable } from 'rxjs';
import { ItemService } from './item.service';
import { CreateItemDTO } from './DTOs/createItem.dto';
import { UpdateItemDTO } from './DTOs/updateItem.dto';
import { ControllerGuard } from '../guards/controller.guard';
import { ACCESS_LEVEL } from '../types/shared';

@Controller('item')
export class ItemController {
  constructor(private readonly service: ItemService) {}
  @Get()
  @UseGuards(ControllerGuard(ACCESS_LEVEL.USER))
  getAllItems(): Observable<Item[]> {
    return this.service.getAllItems();
  }

  @Get('/:id')
  @UseGuards(ControllerGuard(ACCESS_LEVEL.USER))
  getItem(@Param('id') id: string): Observable<Item> {
    return this.service.getOneItem(id);
  }

  @Post()
  @UseGuards(ControllerGuard(ACCESS_LEVEL.USER))
  createItem(@Body('input') input: CreateItemDTO): Observable<Item> {
    return this.service.createItem(input);
  }

  @Put(':id')
  @UseGuards(ControllerGuard(ACCESS_LEVEL.ADMIN))
  updateItem(
    @Param('id') id: string,
    @Body('input') input: UpdateItemDTO
  ): Observable<Item> {
    return this.service.updateItem(id, input);
  }

  @Delete('/:id')
  @UseGuards(ControllerGuard(ACCESS_LEVEL.DEV))
  deleteItem(@Param('id') id: string): Observable<boolean> {
    return this.service.deleteItem(id);
  }
}
