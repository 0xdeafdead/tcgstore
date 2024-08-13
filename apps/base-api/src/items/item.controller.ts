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
import { Entity } from '@prisma/client';
import { Observable } from 'rxjs';
import { ItemService } from './item.service';
import { CreateItemDTO } from './DTOs/createItem.dto';
import { UpdateItemDTO } from './DTOs/updateItem.dto';
import { ControllerGuard } from '../guards/controller.guard';
import { ACCESS_LEVEL } from '../types/shared';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Entity')
@Controller('item')
export class ItemController {
  constructor(private readonly service: ItemService) {}

  @Get()
  @ApiOkResponse({
    description: 'Fetch all items.',
    status: '2XX',
    isArray: true,
  })
  @UseGuards(ControllerGuard(ACCESS_LEVEL.USER))
  getAllItems(): Observable<Entity[]> {
    return this.service.getAllItems();
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Fetch single item.',
    status: '2XX',
  })
  @ApiParam({
    type: String,
    name: 'id',
    example: 'abcd1234-56ef-g7h8-ij90-1234abcd56ef',
    description: 'The id of the item to fetch',
    required: true,
    allowEmptyValue: false,
  })
  @UseGuards(ControllerGuard(ACCESS_LEVEL.USER))
  getItem(@Param('id') id: string): Observable<Entity> {
    return this.service.getOneItem(id);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Create single user.',
    status: '2XX',
  })
  @ApiBody({
    type: CreateItemDTO,
    description: 'Input object for creating a new item',
    required: true,
  })
  @UseGuards(ControllerGuard(ACCESS_LEVEL.USER))
  createItem(@Body('input') input: CreateItemDTO): Observable<Entity> {
    return this.service.createItem(input);
  }

  @Put('/:id')
  @ApiOkResponse({
    description: 'Update single item.',
    status: '2XX',
  })
  @ApiParam({
    type: String,
    name: 'id',
    example: 'abcd1234-56ef-g7h8-ij90-1234abcd56ef',
    description: 'The id of the item to modify',
    required: true,
    allowEmptyValue: false,
  })
  @ApiBody({
    type: UpdateItemDTO,
    description: 'Input object for updating an existing item',
    required: true,
  })
  @UseGuards(ControllerGuard(ACCESS_LEVEL.ADMIN))
  updateItem(
    @Param('id') id: string,
    @Body('input') input: UpdateItemDTO
  ): Observable<Entity> {
    return this.service.updateItem(id, input);
  }

  @Delete('/:id')
  @ApiOkResponse({
    description: 'Delete single item.',
    status: '2XX',
  })
  @ApiParam({
    type: String,
    name: 'id',
    example: 'abcd1234-56ef-g7h8-ij90-1234abcd56ef',
    description: 'The id of the item to delete',
    required: true,
    allowEmptyValue: false,
  })
  @UseGuards(ControllerGuard(ACCESS_LEVEL.DEV))
  deleteItem(@Param('id') id: string): Observable<boolean> {
    return this.service.deleteItem(id);
  }
}
