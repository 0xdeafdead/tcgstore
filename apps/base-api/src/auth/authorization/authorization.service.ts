import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma-service/prisma.service';
import { UserRole } from '@prisma/client';
import { getRoleId } from '../../utils/roles';
import { UpdateUserRoleDTO } from '../DTOs/updateUserRole.dto';
import { UpdatePermissionFromRoleDTO } from '../DTOs/updatePermissionFromRole.dto';

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

  updatePermissionsToRole(
    input: UpdatePermissionFromRoleDTO
  ): Promise<boolean> {
    const $addPermissions = this.prisma.rolePermission.createMany({
      data: input.permissionsToAdd.map((id) => ({
        permissionId: id,
        assignedBy: '',
        roleId: getRoleId(input.role),
        assignedAt: new Date(),
      })),
      skipDuplicates: true,
    });
    const $removePermissions = this.prisma.rolePermission.deleteMany({
      where: {
        permissionId: {
          in: input.permissionsToRemove,
        },
        roleId: getRoleId(input.role),
      },
    });
    return this.prisma
      .$transaction([$addPermissions, $removePermissions])
      .then(() => true)
      .catch((err) => {
        throw new InternalServerErrorException(
          'Could not update role. Error:',
          err.message
        );
      });
  }
}
