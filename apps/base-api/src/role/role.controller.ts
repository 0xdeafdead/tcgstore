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
import { RoleService } from './role.service';
import { Observable } from 'rxjs';
import { Role } from '@prisma/client';
import { CreateRoleDTO } from './DTOs/createRole.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { BaseGuard } from '@tcg-market-core/jwt';

@Controller('role')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @Get()
  @UseGuards(BaseGuard)
  getAllRoles(@CurrentUser() user: any): Observable<Role[]> {
    console.log('user', user);
    return null;
    return this.service.getAllRoles();
  }

  @Get('/:id')
  getRole(@Param('id') id: string): Observable<Role> {
    return this.service.getOneRole({ id });
  }

  @Post()
  createRole(@Body() input: CreateRoleDTO): Observable<Role> {
    return this.service.createRole(input);
  }

  @Put('/:id')
  updateRole(@Param('id') id: string): Observable<Role> {
    return this.service.updateRole(id);
  }

  @Delete('/:id')
  deleteRole(@Param('id') id: string): Observable<boolean> {
    return this.service.deleteRole(id);
  }
}
