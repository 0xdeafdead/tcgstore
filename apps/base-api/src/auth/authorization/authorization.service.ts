import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma-service/prisma.service';
import { RoleName, UserRole, RolePermission } from '@prisma/client';
import { getRoleId } from '../../utils/roles';
import { UpdateUserRoleDTO } from '../DTOs/updateUserRole.dto';

@Injectable()
export class AuthorizationService {
  constructor(private readonly prisma: PrismaService) {}

  assignRoleToUser(input: UpdateUserRoleDTO): Promise<UserRole> {
    return this.prisma.userRole.update({
      data: {
        roleId: getRoleId(input.roleName),
      },
      where: {
        userEmail: input.email,
      },
    });
  }

  addPermissionToRole(input: AddPermissionToRoleDTO): Promise<RolePermission> {
    return this.prisma.rolePermission.create({
      data: {
        permissionId: input.permissionId,
        roleId: input.roleId,
      },
    });
  }
}
