import {
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Permission, Prisma } from '@prisma/client';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PermissionRepository } from './permission.repository';
import { CreatePermissionDTO } from './DTOs/createPermission.dto';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger('PermissionService');
  constructor(private readonly repository: PermissionRepository) {}

  getAllPermissions(): Observable<Permission[]> {
    return from(this.repository.all()).pipe(
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  getOnePermission(id: string): Observable<Permission> {
    return from(this.repository.getOne({ where: { id } })).pipe(
      switchMap((entity) => {
        if (!entity) {
          throw new NotFoundException(
            'Could not find entity with specified id'
          );
        } else {
          return of(entity);
        }
      }),
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  createPermission(input: CreatePermissionDTO): Observable<Permission> {
    return from(this.repository.create({ ...input, id: uuidv4() })).pipe(
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  updatePermission(id: string): Observable<Permission> {
    const input: Prisma.PermissionUpdateInput = {
      //This is intentional
    };
    return from(this.repository.update({ data: input, where: { id } })).pipe(
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  deletePermission(id: string): Observable<boolean> {
    return from(this.repository.delete({ where: { id } })).pipe(
      map(() => true),
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }
}
