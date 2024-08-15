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
import { EntityService } from './entity.service';
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
@Controller('entity')
export class EntityController {
  constructor(private readonly service: EntityService) {}

  @Get()
  @ApiOkResponse({
    description: 'Fetch all entities.',
    status: '2XX',
    isArray: true,
  })
  getAllEntities(): Observable<Entity[]> {
    return this.service.getAllEntities();
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Fetch single entity.',
    status: '2XX',
  })
  @ApiParam({
    type: String,
    name: 'id',
    example: 'abcd1234-56ef-g7h8-ij90-1234abcd56ef',
    description: 'The id of the entity to fetch',
    required: true,
    allowEmptyValue: false,
  })
  getEntity(@Param('id') id: string): Observable<Entity> {
    return this.service.getOneEntity(id);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Create single user.',
    status: '2XX',
  })
  @UseGuards(ControllerGuard(ACCESS_LEVEL.USER))
  createEntity(): Observable<Entity> {
    return this.service.createEntity();
  }

  @Put('/:id')
  @ApiOkResponse({
    description: 'Update single entity.',
    status: '2XX',
  })
  @ApiParam({
    type: String,
    name: 'id',
    example: 'abcd1234-56ef-g7h8-ij90-1234abcd56ef',
    description: 'The id of the entity to modify',
    required: true,
    allowEmptyValue: false,
  })
  @UseGuards(ControllerGuard(ACCESS_LEVEL.ADMIN))
  updateEntity(@Param('id') id: string): Observable<Entity> {
    return this.service.updateEntity(id);
  }

  @Delete('/:id')
  @ApiOkResponse({
    description: 'Delete single entity.',
    status: '2XX',
  })
  @ApiParam({
    type: String,
    name: 'id',
    example: 'abcd1234-56ef-g7h8-ij90-1234abcd56ef',
    description: 'The id of the entity to delete',
    required: true,
    allowEmptyValue: false,
  })
  @UseGuards(ControllerGuard(ACCESS_LEVEL.DEV))
  deleteEntity(@Param('id') id: string): Observable<boolean> {
    return this.service.deleteEntity(id);
  }
}
