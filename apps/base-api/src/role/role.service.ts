import { v4 as uuidv4 } from 'uuid';
import { Prisma, Role } from '@prisma/client';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';

import { RoleRepository } from './role.repository';
import { CreateRoleDTO } from './DTOs/createRole.dto';
import { GetRoleOptions } from './types';

@Injectable()
export class RoleService {
  private readonly logger = new Logger('RoleService');
  constructor(private readonly repository: RoleRepository) {}

  getAllRoles(): Observable<Role[]> {
    return from(this.repository.all()).pipe(
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  getOneRole(
    findBy: Prisma.RoleWhereUniqueInput,
    options: GetRoleOptions = { permissions: false }
  ): Observable<Role> {
    return from(this.repository.getOne(findBy, options)).pipe(
      switchMap((role) => {
        if (!role) {
          throw new NotFoundException('Could not find role with specified id');
        } else {
          return of(role);
        }
      }),
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  createRole(input: CreateRoleDTO): Observable<Role> {
    const { permissionIds, ...restInput } = input;
    const newRoleId = uuidv4();
    const permissionsToAdd: Prisma.RolePermissionCreateManyRoleInput[] =
      permissionIds.map<Prisma.RolePermissionCreateManyRoleInput>((id) => ({
        permissionId: id,
        assignedBy: '',
      }));
    return from(
      this.repository.create({
        ...restInput,
        id: newRoleId,
        permissions: {
          createMany: { skipDuplicates: true, data: permissionsToAdd },
        },
      })
    ).pipe(
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  updateRole(id: string): Observable<Role> {
    const input: Prisma.RoleUpdateInput = {
      //This is intentional
    };
    return from(this.repository.update({ data: input, where: { id } })).pipe(
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  deleteRole(id: string): Observable<boolean> {
    return from(this.repository.delete({ where: { id } })).pipe(
      map(() => true),
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }
}
