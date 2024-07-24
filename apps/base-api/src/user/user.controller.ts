import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { User } from '@prisma/client';
import { CreateUserDTO } from './DTOs/createUser.dto';
import { ACCESS_LEVEL } from '../types/shared';
import { ControllerGuard } from '../guards/controller.guard';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('/user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  @ApiOkResponse({
    description: 'Fetch all users.',
    status: '2XX',
    isArray: true,
  })
  @UseGuards(ControllerGuard(ACCESS_LEVEL.USER))
  getAllUsers(): Observable<User[]> {
    return this.service.getAllUsers();
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Fetch single user.',
    status: '2XX',
  })
  @ApiParam({
    type: String,
    name: 'id',
    example: 'abcd1234-56ef-g7h8-ij90-1234abcd56ef',
    description: 'The id of the user to fetch',
    required: true,
    allowEmptyValue: false,
  })
  @UseGuards(ControllerGuard(ACCESS_LEVEL.USER))
  getOne(@Param('id') id: string): Observable<User> {
    return this.service.getOneUser(id);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Create single user.',
    status: '2XX',
  })
  @ApiBody({
    type: CreateUserDTO,
    description: 'Input object for creating a user',
  })
  @UseGuards(ControllerGuard(ACCESS_LEVEL.USER))
  createUser(@Body() input: CreateUserDTO): Observable<User> {
    return this.service.createUser(input);
  }

  @Delete('/:id')
  @ApiOkResponse({
    description: 'Delete single user.',
    status: '2XX',
  })
  @ApiParam({
    type: String,
    name: 'id',
    example: 'abcd1234-56ef-g7h8-ij90-1234abcd56ef',
    description: 'The id of the user to delete',
    required: true,
    allowEmptyValue: false,
  })
  @UseGuards(ControllerGuard(ACCESS_LEVEL.DEV))
  deleteUser(@Param('id') id: string): Observable<boolean> {
    return this.service.deleteUser(id);
  }
}
