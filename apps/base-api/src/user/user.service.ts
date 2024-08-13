import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserRespository } from './user.repository';
import {
  Observable,
  catchError,
  from,
  map,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { Prisma, User } from '@prisma/client';
import { CreateUserDTO } from './DTOs/createUser.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');
  constructor(private readonly repository: UserRespository) {}

  getAllUsers(): Observable<User[]> {
    return from(this.repository.all()).pipe(
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  getOneUser(id: string): Observable<User> {
    return from(this.repository.getOne({ where: { id } })).pipe(
      switchMap((user) => {
        if (!user) {
          throw new NotFoundException('Could not find user with specified id');
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

  createUser(input: CreateUserDTO): Observable<User> {
    const newUser: Prisma.UserCreateInput = {
      email: input.email,
      id: randomUUID(),
      firstName: input.firstName,
      lastName: input.lastName,
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
