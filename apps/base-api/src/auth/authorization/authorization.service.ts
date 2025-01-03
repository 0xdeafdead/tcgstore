import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma-service/prisma.service';
import { UpdateUserRolesDTO } from '../DTOs/updateUserRole.dto';
import { UpdateRolePermissionsDTO } from '../DTOs/updatePermissionFromRole.dto';
import { catchError, from, map, Observable, throwError } from 'rxjs';
import { errorHandler } from '../../utils/errorHandler';
import { PrismaTransactionClient } from '../../types';
import { Role } from '@prisma/client';

@Injectable()
export class AuthorizationService {
  private readonly logger = new Logger('AuthorizationService');
  constructor(private readonly prisma: PrismaService) {}

  updateRoleToUser(input: UpdateUserRolesDTO): Observable<boolean> {
    return from(
      this.prisma.userRole.update({
        where: { userId: input.userId },
        data: {
          roleId: input.roleId,
          assignedAt: new Date(),
        },
      })
    ).pipe(
      map(() => true),
      catchError((err) => {
        const errMsg = `Could not update user's role. Error:${err.message}`;
        return throwError(() => errorHandler(this.logger, err, errMsg));
      })
    );
  }

  updatePermissionsToRole(
    currentUser: string,
    input: UpdateRolePermissionsDTO
  ): Observable<Role> {
    const addPermissionsBatch = (roleId: string, tx: PrismaTransactionClient) =>
      tx.rolePermission.createMany({
        data: input.permissionsToAdd.map((id) => ({
          permissionId: id,
          assignedBy: currentUser,
          roleId,
          assignedAt: new Date(),
        })),
        skipDuplicates: true,
      });
    const removePermissionsBatch = (
      roleId: string,
      tx: PrismaTransactionClient
    ) =>
      tx.rolePermission.deleteMany({
        where: {
          permissionId: {
            in: input.permissionsToRemove,
          },
          roleId,
        },
      });
    return from(
      this.prisma.$transaction(async (tx) => {
        const role = await tx.role.findUniqueOrThrow({
          where: { id: input.roleId },
        });
        const addedRoles = await addPermissionsBatch(role.id, tx);
        if (addedRoles.count < input.permissionsToAdd.length) {
          throw new Error('Not all permissions were added');
        }
        const removedRoles = await removePermissionsBatch(role.id, tx);
        if (removedRoles.count < input.permissionsToRemove.length) {
          throw new Error('Not all permissions were removed');
        }
        return await tx.role.findUniqueOrThrow({
          where: { id: role.id },
          include: {
            permissions: {
              include: {
                permission: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        });
      })
    ).pipe(
      map((role) => role),
      catchError((err) => {
        const errMsg = `Could not update role's permissions. Error:${err.message}`;
        return throwError(() => errorHandler(this.logger, err, errMsg));
      })
    );
  }
}
