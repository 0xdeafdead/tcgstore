import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { UserService } from '../../user/user.service';
import { PrismaService } from '../../prisma-service/prisma.service';
import { JWTService } from '@user-mgmt-engine/jwt';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import * as bcrypt from 'bcryptjs';
import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDTO } from '../DTOs/sigIn.dto';
import { of, throwError } from 'rxjs';
import { SignUpDTO } from '../DTOs/signUp.dto';

//CANNOT REDIFINE COMPARE FROM BCRYPT
jest.mock('bcryptjs', () => ({
  ...jest.requireActual('bcryptjs'),
  compare: jest.fn(),
}));

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let prismaService: PrismaService;
  let userService: UserService;
  let jwtService: JWTService;

  let prismaMock: DeepMockProxy<PrismaClient>;

  const userServiceMock = {
    getOneUser: jest.fn(),
    createUser: jest.fn(),
  };

  const jwtServiceMock = {
    generateToken: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: JWTService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JWTService>(JWTService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('verifyPassword', () => {
    const email = 'testing@test.com';
    const password = 'notReallyStrongPassword';
    it('should return boolean if password is valid', (done) => {
      prismaMock.credential.findUniqueOrThrow.mockResolvedValueOnce({
        password,
        email,
        salt: '',
      });

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => true);

      service.verifyPassword(email, password).then((result) => {
        expect(prismaMock.credential.findUniqueOrThrow).toHaveBeenCalledTimes(
          1
        );
        expect(result).toBe(true);
        done();
      });
    });

    it('should return false if password is not valid', (done) => {
      prismaMock.credential.findUniqueOrThrow.mockResolvedValueOnce({
        password,
        email,
        salt: '',
      });

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);

      service.verifyPassword(email, password).then((result) => {
        expect(prismaMock.credential.findUniqueOrThrow).toHaveBeenCalledTimes(
          1
        );
        expect(result).toBe(false);
        done();
      });
    });

    it('should throw an error if an error ocurrs while verfying password', (done) => {
      prismaMock.credential.findUniqueOrThrow.mockRejectedValueOnce(
        new Error()
      );

      service.verifyPassword(email, password).catch((err) => {
        expect(prismaMock.credential.findUniqueOrThrow).toHaveBeenCalledTimes(
          1
        );
        expect(err).toBeInstanceOf(Error);
        done();
      });
    });
  });

  describe('signIn', () => {
    const input: SignInDTO = {
      email: 'testing@test.com',
      password: 'notReallyStrongPassword',
    };
    it('should return UnathorizedException if password is not valid', (done) => {
      const verifySpy = jest
        .spyOn(service, 'verifyPassword')
        .mockResolvedValue(false);
      service.signIn(input).subscribe({
        error: (err) => {
          expect(verifySpy).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(UnauthorizedException);
          done();
        },
      });
    });

    it('should return NotFoundException if user is not found', (done) => {
      const verifySpy = jest
        .spyOn(service, 'verifyPassword')
        .mockResolvedValue(true);
      userServiceMock.getOneUser.mockReturnValueOnce(of(null));
      service.signIn(input).subscribe({
        error: (err) => {
          expect(verifySpy).toHaveBeenCalledTimes(1);
          expect(userServiceMock.getOneUser).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });

    it('should return token', (done) => {
      const verifySpy = jest
        .spyOn(service, 'verifyPassword')
        .mockResolvedValue(true);
      const token = 'fakeToken';
      userServiceMock.getOneUser.mockReturnValueOnce(
        of({
          userRole: {
            role: {
              permissions: [
                { permission: { name: 'perm01' } },
                { permission: { name: 'perm02' } },
              ],
            },
          },
        })
      );
      jwtServiceMock.generateToken.mockResolvedValueOnce(token);
      service.signIn(input).subscribe({
        next: (res) => {
          expect(verifySpy).toHaveBeenCalledTimes(1);
          expect(userServiceMock.getOneUser).toHaveBeenCalledTimes(1);
          expect(jwtServiceMock.generateToken).toHaveBeenCalledTimes(1);
          expect(res).toMatch(token);
          done();
        },
      });
    });
  });

  describe('storePassword', () => {
    const email = 'testing@test.com';
    const password = 'notReallyStrongPassword';
    it('should return an error if unable to create credential', (done) => {
      prismaMock.credential.create.mockRejectedValueOnce(new Error());
      service.storePassword(email, password).catch((err) => {
        expect(prismaMock.credential.create).toHaveBeenCalledTimes(1);
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe(
          'Could not hash password for email testing@test.com.'
        );
        done();
      });
    });

    it('should return  if the credential was successfully stored', (done) => {
      prismaMock.credential.create.mockResolvedValueOnce({
        email,
        salt: '',
        password: '',
      });
      service.storePassword(email, password).then(() => {
        expect(prismaMock.credential.create).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });

  describe('signUp', () => {
    const input: SignUpDTO = {
      email: 'testing@test.com',
      password: 'notReallyStrongPassword',
      firstName: 'test',
      lastName: 'test',
    };

    it('should return an error if unable to find role', (done) => {
      const storeSpy = jest.spyOn(service, 'storePassword');
      prismaMock.$transaction.mockImplementationOnce((callback) =>
        callback(prismaMock)
      );
      prismaMock.role.findUnique.mockRejectedValueOnce(
        new Error('Role not found')
      );
      service.signUp(input).subscribe({
        error: (err) => {
          expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
          expect(prismaMock.role.findUnique).toHaveBeenCalledTimes(1);
          expect(prismaMock.user.create).toHaveBeenCalledTimes(0);
          expect(storeSpy).toHaveBeenCalledTimes(0);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          expect(err.message).toBe(
            'Could not create user for email testing@test.com.'
          );
          done();
        },
      });
    });

    it('should return an error if unable to create user', (done) => {
      const storeSpy = jest.spyOn(service, 'storePassword');
      prismaMock.$transaction.mockImplementationOnce((callback) =>
        callback(prismaMock)
      );
      prismaMock.role.findUnique.mockResolvedValueOnce({
        id: 'role_01',
        name: 'user',
      });
      prismaMock.user.create.mockRejectedValueOnce(
        new Error('Failed to create user')
      );
      prismaMock.credential.create.mockResolvedValueOnce({
        email: input.email,
        salt: '',
        password: '',
      });
      service.signUp(input).subscribe({
        error: (err) => {
          expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
          expect(prismaMock.role.findUnique).toHaveBeenCalledTimes(1);
          expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
          expect(storeSpy).toHaveBeenCalledTimes(0);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          expect(err.message).toBe(
            'Could not create user for email testing@test.com.'
          );
          done();
        },
      });
    });

    it('should return an error if unable to store password', (done) => {
      const storeSpy = jest.spyOn(service, 'storePassword');
      // .mockRejectedValueOnce(new Error('Could not store password'));
      prismaMock.$transaction.mockImplementationOnce((callback) =>
        callback(prismaMock)
      );
      prismaMock.role.findUnique.mockResolvedValueOnce({
        id: 'role_01',
        name: 'user',
      });
      prismaMock.user.create.mockResolvedValueOnce({
        id: '',
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
        disabled: false,
      });
      prismaMock.credential.create.mockRejectedValueOnce(
        new Error('Could not store password')
      );
      service.signUp(input).subscribe({
        error: (err) => {
          expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
          expect(prismaMock.role.findUnique).toHaveBeenCalledTimes(1);
          expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
          expect(storeSpy).toHaveBeenCalledTimes(1);
          expect(storeSpy).toHaveBeenCalledWith(
            input.email,
            input.password,
            prismaMock
          );
          expect(prismaMock.credential.create).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          expect(err.message).toBe(
            'Could not create user for email testing@test.com.'
          );
          done();
        },
      });
    });

    it('should return the token if the transaction was successfull', (done) => {
      prismaMock.$transaction.mockImplementationOnce((callback) =>
        callback(prismaMock)
      );
      prismaMock.role.findUnique.mockResolvedValueOnce({
        id: 'role_01',
        name: 'user',
      });
      prismaMock.user.create.mockResolvedValueOnce({
        id: '',
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
        disabled: false,
      });
      prismaMock.credential.create.mockResolvedValueOnce({
        email: input.email,
        salt: '',
        password: '',
      });
      const storeSpy = jest.spyOn(service, 'storePassword'); //.mockResolvedValue();
      jwtServiceMock.generateToken.mockResolvedValueOnce('token');
      service.signUp(input).subscribe({
        next: (res) => {
          expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
          expect(prismaMock.role.findUnique).toHaveBeenCalledTimes(1);
          expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
          expect(prismaMock.credential.create).toHaveBeenCalledTimes(1);
          expect(storeSpy).toHaveBeenCalledTimes(1);
          expect(storeSpy).toHaveBeenCalledWith(
            input.email,
            input.password,
            prismaMock
          );
          expect(jwtServiceMock.generateToken).toHaveBeenCalledTimes(1);
          expect(res).toMatch('token');
          done();
        },
      });
    });
  });
});
