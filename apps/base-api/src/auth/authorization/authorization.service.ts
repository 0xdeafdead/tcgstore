import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma-service/prisma.service';
import { getRoleId } from '../../utils/roles';
import { UpdateUserRolesDTO } from '../DTOs/updateUserRole.dto';
import { UpdateRolePermissionsDTO } from '../DTOs/updatePermissionFromRole.dto';

@Injectable()
export class AuthorizationService {
  constructor(private readonly prisma: PrismaService) {}

  async updateRoleToUser(input: UpdateUserRolesDTO): Promise<boolean> {
    return this.prisma.userRole
      .update({
        where: { userId: input.id },
        data: {
          roleId: getRoleId(input.newRole),
          assignedAt: new Date(),
        },
      })
      .then(() => true)
      .catch((err) => {
        throw new InternalServerErrorException(
          "Could not update user's role. Error:",
          err.message
        );
      });
  }

  async updatePermissionsToRole(
    currentUser: string,
    input: UpdateRolePermissionsDTO
  ): Promise<boolean> {
    const $addPermissions = this.prisma.rolePermission.createMany({
      data: input.permissionsToAdd.map((id) => ({
        permissionId: id,
        assignedBy: currentUser,
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
