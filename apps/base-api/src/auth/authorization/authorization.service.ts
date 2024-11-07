import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma-service/prisma.service';
import { getRoleId } from '../../utils/roles';
import { UpdateUserRolesDTO } from '../DTOs/updateUserRole.dto';
import { UpdateRolePermissionsDTO } from '../DTOs/updatePermissionFromRole.dto';
import { catchError, from, map, Observable, throwError } from 'rxjs';

@Injectable()
export class AuthorizationService {
  constructor(private readonly prisma: PrismaService) {}

  updateRoleToUser(input: UpdateUserRolesDTO): Observable<boolean> {
    return from(
      this.prisma.userRole.update({
        where: { userId: input.id },
        data: {
          roleId: getRoleId(input.newRole),
          assignedAt: new Date(),
        },
      })
    ).pipe(
      map(() => true),
      catchError((err) =>
        throwError(
          () =>
            new InternalServerErrorException(
              "Could not update user's role. Error:",
              err.message
            )
        )
      )
    );
  }

  updatePermissionsToRole(
    currentUser: string,
    input: UpdateRolePermissionsDTO
  ): Observable<boolean> {
    const addPermissionsBatch = this.prisma.rolePermission.createMany({
      data: input.permissionsToAdd.map((id) => ({
        permissionId: id,
        assignedBy: currentUser,
        roleId: getRoleId(input.role),
        assignedAt: new Date(),
      })),
      skipDuplicates: true,
    });
    const removePermissionsBatch = this.prisma.rolePermission.deleteMany({
      where: {
        permissionId: {
          in: input.permissionsToRemove,
        },
        roleId: getRoleId(input.role),
      },
    });
    return from(
      this.prisma.$transaction([addPermissionsBatch, removePermissionsBatch])
    ).pipe(
      map(() => true),
      catchError((err) =>
        throwError(
          () =>
            new InternalServerErrorException(
              "Could not update role's permissions. Error:",
              err.message
            )
        )
      )
    );
  }
}
