import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  Observable,
  catchError,
  from,
  map,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Prisma, User } from '@prisma/client';

import { CreateUserDTO } from './DTOs/createUser.dto';
import { UserRespository } from './user.repository';
import { GetUserOptions } from './types';
import { RoleRepository } from '../role/role.repository';
import { PermissionRepository } from '../permission/permission.repository';
import { getRoleId } from '../utils/roles';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');
  constructor(private readonly repository: UserRespository) {}

  getAllUsers(options: GetUserOptions = { permissions: false }) {
    return from(this.repository.all(options)).pipe(
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  getOneUser(findBy: Prisma.UserWhereUniqueInput, options?: GetUserOptions) {
    return from(this.repository.getOne(findBy, options)).pipe(
      switchMap((user) => {
        if (!user) {
          throw new NotFoundException('Could not find user with discriminator');
        } else {
          return of(user);
        }
      }),
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  createUser(input: CreateUserDTO) {
    const { email, firstName, lastName, role } = input;
    const newUser: Prisma.UserCreateInput = {
      email,
      firstName,
      lastName,
      id: uuidv4(),
      userRole: { create: { roleId: getRoleId(role) } },
    };
    return from(this.repository.create(newUser)).pipe(
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  deleteUser(id: string): Observable<boolean> {
    return from(this.repository.delete({ where: { id } })).pipe(
      map(() => true),
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }
}
