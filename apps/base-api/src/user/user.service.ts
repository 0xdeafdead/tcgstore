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
import { Prisma, RoleName } from '@prisma/client';

import { CreateUserDTO } from './DTOs/createUser.dto';
import { UserRespository } from './user.repository';
import { GetUserOptions } from './types';
import { RoleRepository } from '../role/role.repository';
import { UpdateUserDTO } from './DTOs/updateUser.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');
  constructor(
    private readonly repository: UserRespository,
    private readonly roleRepository: RoleRepository
  ) {}

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
    return from(
      this.roleRepository.getOne({
        role: role || RoleName.USER,
      })
    ).pipe(
      switchMap((role) =>
        from(
          this.repository.create(
            {
              email,
              firstName,
              lastName,
              id: uuidv4(),
            },
            { roleId: role.id }
          )
        )
      ),
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  updateUser(email: string, input: UpdateUserDTO) {
    return from(this.repository.update({ where: { email }, data: input })).pipe(
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  //TODO: when Redis implemented call getOne before
  // modifiying the user
  disableUser(email: string) {
    return from(this.repository.disable(email)).pipe(
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }
}
