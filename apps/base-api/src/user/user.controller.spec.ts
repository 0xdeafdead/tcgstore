import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { of } from 'rxjs';
import { CreateUserDTO } from './DTOs/createUser.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

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

  const serviceMock = {
    getAllUsers: jest.fn(),
    getOneUser: jest.fn(),
    createUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', (done) => {
      serviceMock.getAllUsers.mockReturnValueOnce(of(mockUsers));
      controller.getAllUsers().subscribe({
        next: (res) => {
          expect(serviceMock.getAllUsers).toHaveBeenCalled();
          expect(Array.isArray(res)).toBeTruthy();
          expect(res).toMatchObject(mockUsers);
          done();
        },
      });
    });
  });

  describe('getOne', () => {
    const id = 'user_01';
    it('should return a single user', (done) => {
      serviceMock.getOneUser.mockReturnValueOnce(of(mockUsers[0]));
      controller.getOne(id).subscribe({
        next: (res) => {
          expect(serviceMock.getOneUser).toHaveBeenCalled();
          expect(res).toMatchObject(mockUsers[0]);
          done();
        },
      });
    });
  });

  describe('createUser', () => {
    const input: CreateUserDTO = {
      email: 'user01@test.com',
      firstName: 'testName',
      lastName: 'testLastName',
    };
    it('should return the user created', (done) => {
      serviceMock.createUser.mockReturnValueOnce(of(mockUsers[0]));
      controller.createUser(input).subscribe({
        next: (res) => {
          expect(serviceMock.createUser).toHaveBeenCalled();
          expect(res).toMatchObject(mockUsers[0]);
          done();
        },
      });
    });
  });

  describe('deleteUser', () => {
    const id = 'user_01';
    it('should return a boolean when a user is deleted', (done) => {
      serviceMock.deleteUser.mockReturnValueOnce(of(false));
      controller.deleteUser(id).subscribe({
        next: (res) => {
          expect(serviceMock.deleteUser).toHaveBeenCalled();
          expect(res).toBeFalsy();
          done();
        },
      });
    });
  });
});
