import { Body, Controller, Put } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { UpdateUserRolesDTO } from '../DTOs/updateUserRole.dto';
import { Observable } from 'rxjs';
import { UserRole } from '@prisma/client';
import { UpdateRolePermissionsDTO } from '../DTOs/updatePermissionFromRole.dto';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly service: AuthorizationService) {}

  @Put('/user')
  updateUserRole(@Body() input: UpdateUserRolesDTO): Promise<boolean> {
    return this.service.updateRoleToUser(input);
  }

  @Put('/role')
  updateRolePermissions(
    @Body() input: UpdateRolePermissionsDTO
  ): Promise<boolean> {
    return this.service.updatePermissionsToRole(input);
  }
}
