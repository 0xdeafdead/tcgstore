import { Body, Controller, Delete, Get, Post, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Observable, of } from 'rxjs';
import { User } from '@prisma/client';
import { CreateUserDTO } from './DTOs/createUser.dto';

@Controller('/user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('/health')
  healtEndpoint(): Observable<string> {
    return of("I'm working!!");
  }

  @Get()
  getAllUsers(): Observable<User[]> {
    return this.service.getAllUsers();
  }

  @Get('/:id')
  getOne(@Param('id') id: string): Observable<User> {
    return this.service.getOneUser(id);
  }

  @Post()
  createUser(@Body('input') input: CreateUserDTO): Observable<User> {
    return this.service.createUser(input);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string): Observable<boolean> {
    return this.service.deleteUser(id);
  }
}
