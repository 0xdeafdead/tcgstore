import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRespository } from './user.repository';
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDTO } from './DTOs/createUser.dto';
import crypto from 'crypto';

describe('UserService', () => {
  let service: UserService;
  let repostitory: UserRespository;

  const now = new Date();
  const mockUsers: User[] = [
    {
      id: 'user_01',
      email: 'user_01@test.com',
      createdAt: now,
      updatedAt: now,
      firstName: 'testName',
      lastName: 'testLastName',
    },
    {
      id: 'user_02',
      email: 'user_02@test.com',
      createdAt: now,
      updatedAt: now,
      firstName: 'testName2',
      lastName: 'testLastName2',
    },
  ];

  const mockRepository = {
    all: jest.fn(),
    getOne: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.spyOn(Logger, 'error').mockReturnValue(null);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRespository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repostitory = module.get<UserRespository>(UserRespository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repostitory).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return a InternalServerErrorException when fail', (done) => {
      const testError = new InternalServerErrorException();
      mockRepository.all.mockRejectedValueOnce(testError);
      service.getAllUsers().subscribe({
        error: (err) => {
          expect(mockRepository.all).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });

    it('should return an array of users', (done) => {
      mockRepository.all.mockResolvedValueOnce(mockUsers);
      service.getAllUsers().subscribe({
        next: (res) => {
          expect(mockRepository.all).toHaveBeenCalledTimes(1);
          expect(Array.isArray(res)).toBeTruthy();
          expect(res).toMatchObject(res);
          done();
        },
      });
    });
  });

  describe('getOne', () => {
    const id = 'user_00';
    it('should return an InternalServerException if repository fails ', (done) => {
      const testError = new InternalServerErrorException(
        'Could not retrieve user'
      );
      mockRepository.getOne.mockRejectedValueOnce(testError);
      service.getOneUser(id).subscribe({
        error: (err) => {
          expect(mockRepository.getOne).toHaveBeenCalledTimes(1);
          expect(mockRepository.getOne).toHaveBeenCalledWith({ where: { id } });
          expect(err).toMatchObject(testError);
          done();
        },
      });
    });

    it('should return an NotFoundException if repository fails ', (done) => {
      mockRepository.getOne.mockResolvedValueOnce(null);
      service.getOneUser(id).subscribe({
        error: (err) => {
          expect(mockRepository.getOne).toHaveBeenCalledTimes(1);
          expect(mockRepository.getOne).toHaveBeenCalledWith({ where: { id } });
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });

    it('should return an user', (done) => {
      mockRepository.getOne.mockResolvedValueOnce(mockUsers[0]);
      service.getOneUser(id).subscribe({
        next: (res) => {
          expect(mockRepository.getOne).toHaveBeenCalledTimes(1);
          expect(mockRepository.getOne).toHaveBeenCalledWith({ where: { id } });
          expect(res).toMatchObject(mockUsers[0]);
          done();
        },
      });
    });
  });

  describe('createUser', () => {
    const inputTemplate: CreateUserDTO = {
      firstName: 'testName',
      lastName: 'testLastName',
      email: 'user01@test.com',
    };
    const notRandomUUID = `a-b-c-d-e`;
    beforeEach(() => {
      jest.spyOn(crypto, 'randomUUID').mockReturnValue(notRandomUUID);
    });

    it('should return an InternalServerException if repository fails', (done) => {
      const testError = new InternalServerErrorException();
      mockRepository.create.mockRejectedValueOnce(testError);
      service.createUser(inputTemplate).subscribe({
        error: (err) => {
          expect(mockRepository.create).toHaveBeenCalledTimes(1);
          expect(mockRepository.create).toHaveBeenCalledWith({
            ...inputTemplate,
            id: notRandomUUID,
          });
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });

    it('should return an user ', (done) => {
      mockRepository.create.mockResolvedValueOnce(mockUsers[0]);
      service.createUser(inputTemplate).subscribe({
        next: (res) => {
          expect(mockRepository.create).toHaveBeenCalledTimes(1);
          expect(mockRepository.create).toHaveBeenCalledWith({
            ...inputTemplate,
            id: notRandomUUID,
          });
          expect(res).toMatchObject(mockUsers[0]);
          done();
        },
      });
    });
  });

  describe('deleteUser', () => {
    const id = 'user_01';
    it('should return an error when deletion fails', (done) => {
      mockRepository.delete.mockRejectedValueOnce(
        new InternalServerErrorException()
      );
      service.deleteUser(id).subscribe({
        error: (err) => {
          expect(mockRepository.delete).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });

    it('should return an error when deletion fails', (done) => {
      mockRepository.delete.mockResolvedValueOnce(mockUsers[0]);
      service.deleteUser(id).subscribe({
        next: (res) => {
          expect(mockRepository.delete).toHaveBeenCalledTimes(1);
          expect(res).toBeTruthy();
          done();
        },
      });
    });
  });
});
