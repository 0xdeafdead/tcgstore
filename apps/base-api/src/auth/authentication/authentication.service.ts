import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { signInDTO } from '../DTOs/sigIn.dto';
import { UserService } from '../../user/user.service';
import { signUpDTO } from '../DTOs/signUp.dto';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';
import { genSalt, hash, compare } from 'bcryptjs';
import { PrismaService } from '../../prisma-service/prisma.service';
import { Prisma } from '@prisma/client';
import { JWTService } from '@tcg-market-core/jwt';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger('AuthenticationService');
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JWTService
  ) {}

  signUp(input: signUpDTO): Observable<string> {
    const { password, ...userCreationParams } = input;
    return from(this.storePassword(userCreationParams.email, password)).pipe(
      switchMap(() => this.userService.createUser(userCreationParams)),
      switchMap((user) =>
        this.jwtService.generateToken({
          permissions: user.userRole.role.permissions.map(
            (permission) => permission.permission.name
          ),
          sub: user.email,
        })
      ),
      catchError((err) => {
        const errMsg = `Could not create user for email ${userCreationParams.email}.`;
        this.logger.error(errMsg + ` Error: ${err.message}`);
        return throwError(() => new InternalServerErrorException(errMsg));
      })
    );
  }

  signIn(input: signInDTO): Observable<string> {
    const { email, password } = input;
    return from(this.verifyPassword(email, password)).pipe(
      switchMap((isVerified) => {
        if (!isVerified) {
          throw new UnauthorizedException(`Wrong password or email`);
        }
        return this.userService.getOneUser({ email }, { permissions: true });
      }),
      switchMap((user) => {
        console.log('user', user);
        if (!user) {
          throw new NotFoundException(`User with email ${email} not found.`);
        }
        return this.jwtService.generateToken({
          permissions: user.userRole.role.permissions.map(
            (permission) => permission.permission.name
          ),
          sub: user.email,
        });
      }),
      catchError((err) => {
        const errMsg = `The user or password is wrong.`;
        this.logger.error(errMsg + `Error: ${err.msg}`);
        return throwError(() => new UnauthorizedException(errMsg));
      })
    );
  }

  async verifyPassword(email: string, passAtemp: string): Promise<boolean> {
    try {
      return this.prisma.credential
        .findUniqueOrThrow({ select: { password: true }, where: { email } })
        .then(({ password }) => {
          return compare(passAtemp, password);
        });
    } catch (err) {
      console.log('err', err);
      this.logger.error(`Could not validate password for email ${email}`);
      throw err;
    }
  }

  async storePassword(email: string, password: string): Promise<void> {
    try {
      const salt = await genSalt();
      const hashedPass = await hash(password, salt);
      const input: Prisma.CredentialCreateInput = {
        email,
        salt,
        password: hashedPass,
      };
      await this.prisma.credential.create({ data: input });
      return;
    } catch (err) {
      console.log('err', err);
      const errMsg = `Could not hash password for email ${email}.`;
      this.logger.error(`${errMsg} Error: ${err.message}`);
      throw new Error(errMsg);
    }
  }
}