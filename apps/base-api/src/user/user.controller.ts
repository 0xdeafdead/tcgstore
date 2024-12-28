import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  Patch,
} from '@nestjs/common';
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
import { UpdateUserDTO } from './DTOs/updateUser.dto';

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

  @Patch('/:email')
  @ApiOkResponse({
    description: 'Update single user.',
    status: '2XX',
  })
  @ApiParam({
    type: String,
    name: 'email',
    example: 'username@domain.xxx',
    description: 'The email of the user to update',
    required: true,
    allowEmptyValue: false,
  })
  @ApiBody({
    type: UpdateUserDTO,
    description: 'Input object for updating a user',
  })
  updateUser(
    @Param('email') email: string,
    @Body() input: UpdateUserDTO
  ): Observable<User> {
    return this.service.updateUser(email, input);
  }

  @Patch('/disable/:email')
  @ApiOkResponse({
    description: 'Disables a single user.',
    status: '2XX',
  })
  @ApiParam({
    type: String,
    name: 'email',
    example: 'name@domain.xxx',
    description: 'The email of the user to disable',
    required: true,
    allowEmptyValue: false,
  })
  disableUser(@Param('email') email: string): Observable<User> {
    return this.service.disableUser(email);
  }
}
