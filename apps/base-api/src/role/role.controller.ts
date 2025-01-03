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
import { BaseGuard } from '../guards';
import { GetRoleOptions } from './types';
import { CurrentUserPayload } from '../types';
import { UpdateRoleDTO } from './DTOs/updateRole.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @Get()
  @UseGuards(BaseGuard)
  getAllRoles(): Observable<Role[]> {
    return this.service.getAllRoles();
  }

  @Get('/:id')
  @UseGuards(BaseGuard)
  getRole(
    @Param('id') id: string,
    @Body() options?: GetRoleOptions
  ): Observable<Role> {
    return this.service.getOneRole({ id }, options);
  }

  @Post()
  @UseGuards(BaseGuard)
  createRole(
    @CurrentUser() user: CurrentUserPayload,
    @Body() input: CreateRoleDTO
  ): Observable<Role> {
    return this.service.createRole(input, user.sub);
  }

  @Put('/:id')
  @UseGuards(BaseGuard)
  updateRole(
    @Param('id') id: string,
    @Body() input: UpdateRoleDTO
  ): Observable<Role> {
    return this.service.updateRole(id, input);
  }

  @Delete('/:id')
  @UseGuards(BaseGuard)
  deleteRole(@Param('id') id: string): Observable<boolean> {
    return this.service.deleteRole(id);
  }
}
