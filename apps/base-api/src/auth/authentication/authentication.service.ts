import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';
import { JWTService } from '@user-mgmt-engine/jwt';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';

import { SignInDTO } from '../DTOs/sigIn.dto';
import { SignUpDTO } from '../DTOs/signUp.dto';
import { genSalt, hash, compare } from 'bcryptjs';
import { PrismaTransactionClient } from '../../types';
import { UserService } from '../../user/user.service';
import { errorHandler } from '../../utils/errorHandler';
import { PrismaService } from '../../prisma-service/prisma.service';
import { envs } from '../../config';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger('AuthenticationService');
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JWTService
  ) {}

  async verifyPassword(email: string, passAtemp: string): Promise<boolean> {
    try {
      const { password } = await this.prisma.credential.findUniqueOrThrow({
        select: { password: true },
        where: { email },
      });

      return compare(passAtemp, password);
    } catch (err) {
      this.logger.error(`Could not validate password for email ${email}`);
      throw err;
    }
  }

  signIn(input: SignInDTO): Observable<string> {
    const { email, password } = input;
    return from(this.verifyPassword(email, password)).pipe(
      switchMap((isVerified) => {
        if (!isVerified) {
          throw new UnauthorizedException(`Wrong password or email`);
        }
        return this.userService.getOneUser({ email }, { permissions: true });
      }),
      switchMap((user) => {
        if (!user) {
          throw new NotFoundException(`User with email ${email} not found.`);
        }
        return this.jwtService.generateToken({
          sub: user.email,
          role: user.userRole.roleId,
        });
      }),
      catchError((err) => {
        const errMsg = `The user or password is wrong`;
        return throwError(() => errorHandler(this.logger, err, errMsg));
      })
    );
  }

  async storePassword(
    email: string,
    password: string,
    tx?: PrismaTransactionClient
  ): Promise<void> {
    try {
      const salt = await genSalt();
      const hashedPass = await hash(password, salt);
      const input: Prisma.CredentialCreateInput = {
        email,
        salt,
        password: hashedPass,
      };
      (await tx?.credential.create({ data: input })) ??
        (await this.prisma.credential.create({ data: input }));
      return;
    } catch (err) {
      const errMsg = `Could not hash password for email ${email}.`;
      throw new Error(errMsg);
    }
  }

  /*TODO: Create a dynamic transaction that starts here and pass it to storePassword
   * to make the singUp atomic
   */
  signUp(input: SignUpDTO): Observable<string> {
    const { password, email, firstName, lastName } = input;
    return from(
      this.prisma.$transaction(async (tx) => {
        const role = await tx.role.findUnique({
          where: {
            id: envs.user_role_id,
          },
        });
        if (!role) {
          throw new Error('Role not found');
        }

        const user = await tx.user.create({
          data: {
            id: uuidv4(),
            email,
            firstName,
            lastName,
            userRole: {
              create: {
                roleId: role.id,
              },
            },
          },
        });

        await this.storePassword(email, password, tx);
        const token = await this.jwtService.generateToken({
          sub: user.email,
          role: envs.user_role_id,
        });
        return token;
      })
    ).pipe(
      catchError((err) => {
        const errMsg = `Could not create user for email ${email}.`;
        return throwError(() => errorHandler(this.logger, err, errMsg));
      })
    );
  }
}
