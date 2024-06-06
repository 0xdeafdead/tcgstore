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

@Controller('/user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  @UseGuards(ControllerGuard(ACCESS_LEVEL.USER))
  getAllUsers(): Observable<User[]> {
    return this.service.getAllUsers();
  }

  @Get('/:id')
  @UseGuards(ControllerGuard(ACCESS_LEVEL.USER))
  getOne(@Param('id') id: string): Observable<User> {
    return this.service.getOneUser(id);
  }

  @Post()
  @UseGuards(ControllerGuard(ACCESS_LEVEL.USER))
  createUser(@Body('input') input: CreateUserDTO): Observable<User> {
    return this.service.createUser(input);
  }

  @Delete('/:id')
  @UseGuards(ControllerGuard(ACCESS_LEVEL.DEV))
  deleteUser(@Param('id') id: string): Observable<boolean> {
    return this.service.deleteUser(id);
  }
}
