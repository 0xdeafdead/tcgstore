import { Observable } from 'rxjs';
import { Permission } from '@prisma/client';
import { Delete, Param, Controller, Post, Put, Get } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDTO } from './DTOs/createPermission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly service: PermissionService) {}

  @Get()
  getAllPermissions(): Observable<Permission[]> {
    return this.service.getAllPermissions();
  }

  @Get('/:id')
  getPermission(@Param('id') id: string): Observable<Permission> {
    return this.service.getOnePermission(id);
  }

  @Post()
  createPermission(input: CreatePermissionDTO): Observable<Permission> {
    return this.service.createPermission(input);
  }

  @Put('/:id')
  updatePermission(@Param('id') id: string): Observable<Permission> {
    return this.service.updatePermission(id);
  }

  @Delete('/:id')
  deletePermission(@Param('id') id: string): Observable<boolean> {
    return this.service.deletePermission(id);
  }
}
