import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import { Role } from '@prisma/client';
import { CreateRoleDTO } from './DTOs/createRole.dto';

const fakeUUUID = 'abcd1234-abcd-1234-defg-56789-56789defg';
jest.mock('uuid', () => {
  return { v4: () => fakeUUUID };
});

describe('RoleService', () => {
  let service: RoleService;
  let repository: RoleRepository;

  const mockRoles: Role[] = [
    {
      id: 'role_01',
      name: 'roleOne',
    },
    {
      id: 'role_02',
      name: 'roleTwo',
    },
  ];

  const mockRepository = {
    all: jest.fn(),
    getOne: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.spyOn(Logger, 'error').mockReturnValue(null);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: RoleRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    repository = module.get<RoleRepository>(RoleRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('getAllRoles', () => {
    it('should return a InternalServerErrorException when fail', (done) => {
      const testError = new InternalServerErrorException();
      mockRepository.all.mockRejectedValueOnce(testError);
      service.getAllRoles().subscribe({
        error: (err) => {
          expect(mockRepository.all).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });

    it('should return an array of roles', (done) => {
      mockRepository.all.mockResolvedValueOnce(mockRoles);
      service.getAllRoles().subscribe({
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
    const id = 'role_00';
    it('should return an InternalServerException if repository fails ', (done) => {
      const testError = new InternalServerErrorException(
        'Could not retrieve role'
      );
      mockRepository.getOne.mockRejectedValueOnce(testError);
      service.getOneRole(id).subscribe({
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
      service.getOneRole(id).subscribe({
        error: (err) => {
          expect(mockRepository.getOne).toHaveBeenCalledTimes(1);
          expect(mockRepository.getOne).toHaveBeenCalledWith({ where: { id } });
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });

    it('should return an role', (done) => {
      mockRepository.getOne.mockResolvedValueOnce(mockRoles[0]);
      service.getOneRole(id).subscribe({
        next: (res) => {
          expect(mockRepository.getOne).toHaveBeenCalledTimes(1);
          expect(mockRepository.getOne).toHaveBeenCalledWith({ where: { id } });
          expect(res).toMatchObject(mockRoles[0]);
          done();
        },
      });
    });
  });

  describe('createRole', () => {
    const inputTemplate: CreateRoleDTO = {
      name: 'roleThree',
    };

    it('should return an InternalServerException if repository fails', (done) => {
      const testError = new InternalServerErrorException();
      mockRepository.create.mockRejectedValueOnce(testError);
      service.createRole(inputTemplate).subscribe({
        error: (err) => {
          expect(mockRepository.create).toHaveBeenCalledTimes(1);
          expect(mockRepository.create).toHaveBeenCalledWith({
            ...inputTemplate,
            id: fakeUUUID,
          });
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });

    it('should return an role ', (done) => {
      mockRepository.create.mockResolvedValueOnce(mockRoles[0]);
      service.createRole(inputTemplate).subscribe({
        next: (res) => {
          expect(mockRepository.create).toHaveBeenCalledTimes(1);
          expect(mockRepository.create).toHaveBeenCalledWith({
            ...inputTemplate,
            id: fakeUUUID,
          });
          expect(res).toMatchObject(mockRoles[0]);
          done();
        },
      });
    });
  });

  describe('updateRole', () => {
    const id = 'role_01';
    it('should return the updated role', (done) => {
      mockRepository.update.mockResolvedValueOnce(mockRoles[0]);
      service.updateRole(id).subscribe({
        next: (res) => {
          expect(mockRepository.update).toHaveBeenCalledTimes(1);
          expect(res).toMatchObject(mockRoles[0]);
          done();
        },
      });
    });

    it('should return an error when failed to update', (done) => {
      mockRepository.update.mockRejectedValueOnce(
        new InternalServerErrorException()
      );
      service.updateRole(id).subscribe({
        error: (err) => {
          expect(mockRepository.update).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });
  });

  describe('deleteRole', () => {
    const id = 'role_01';
    it('should return an error when deletion fails', (done) => {
      mockRepository.delete.mockRejectedValueOnce(
        new InternalServerErrorException()
      );
      service.deleteRole(id).subscribe({
        error: (err) => {
          expect(mockRepository.delete).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });

    it('should return an error when deletion fails', (done) => {
      mockRepository.delete.mockResolvedValueOnce(mockRoles[0]);
      service.deleteRole(id).subscribe({
        next: (res) => {
          expect(mockRepository.delete).toHaveBeenCalledTimes(1);
          expect(res).toBeTruthy();
          done();
        },
      });
    });
  });
});
