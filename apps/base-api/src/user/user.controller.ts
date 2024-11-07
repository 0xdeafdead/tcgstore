import { Body, Controller, Delete, Get, Post, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { User } from '@prisma/client';
import { CreateUserDTO } from './DTOs/createUser.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { GetUserOptions } from './types';

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
  getAllUsers(@Body() options?: GetUserOptions): Observable<User[]> {
    return this.service.getAllUsers(options);
  }

  @Get('/:email')
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
  getOne(
    @Param('email') email: string,
    @Body() options?: GetUserOptions
  ): Observable<User> {
    return this.service.getOneUser({ email }, options);
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
  deleteUser(@Param('id') id: string): Observable<boolean> {
    return this.service.deleteUser(id);
  }
}
