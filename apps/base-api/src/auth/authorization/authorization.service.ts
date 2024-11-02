import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma-service/prisma.service';
import { getRoleId } from '../../utils/roles';
import { UpdateUserRolesDTO } from '../DTOs/updateUserRole.dto';
import { UpdateRolePermissionsDTO } from '../DTOs/updatePermissionFromRole.dto';

@Injectable()
export class AuthorizationService {
  constructor(private readonly prisma: PrismaService) {}

  async updateRoleToUser(input: UpdateUserRolesDTO): Promise<boolean> {
    const $addRoles = this.prisma.userRole.createMany({
      data: input.rolesToAdd.map((id) => ({
        userEmail: '',
        roleId: getRoleId(id),
        assignedAt: new Date(),
      })),
      skipDuplicates: true,
    });
    const roleIds = input.rolesToRemove.map((name) => getRoleId(name));
    const $removeRoles = this.prisma.userRole.deleteMany({
      where: {
        roleId: {
          in: roleIds,
        },
      },
    });
    return this.prisma
      .$transaction([$addRoles, $removeRoles])
      .then(() => true)
      .catch((err) => {
        throw new InternalServerErrorException(
          "Could not update user's role. Error:",
          err.message
        );
      });
  }

  async updatePermissionsToRole(
    input: UpdateRolePermissionsDTO
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
          "Could not update role's permissions. Error:",
          err.message
        );
      });
  }
}
