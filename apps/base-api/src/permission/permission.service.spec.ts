import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PermissionService } from './permission.service';
import { PermissionRepository } from './permission.repository';
import { Permission } from '@prisma/client';
import { CreatePermissionDTO } from './DTOs/createPermission.dto';

const fakeUUUID = 'abcd1234-abcd-1234-defg-56789-56789defg';
jest.mock('uuid', () => {
  return { v4: () => fakeUUUID };
});

describe('PermissionService', () => {
  let service: PermissionService;
  let repository: PermissionRepository;

  const mockPermissions: Permission[] = [
    {
      id: 'permission_01',
      name: 'permissionOne',
    },
    {
      id: 'permission_02',
      name: 'permissionTwo',
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
        PermissionService,
        {
          provide: PermissionRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PermissionService>(PermissionService);
    repository = module.get<PermissionRepository>(PermissionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('getAllPermissions', () => {
    it('should return a InternalServerErrorException when fail', (done) => {
      const testError = new InternalServerErrorException();
      mockRepository.all.mockRejectedValueOnce(testError);
      service.getAllPermissions().subscribe({
        error: (err) => {
          expect(mockRepository.all).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });

    it('should return an array of permissions', (done) => {
      mockRepository.all.mockResolvedValueOnce(mockPermissions);
      service.getAllPermissions().subscribe({
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
    const id = 'permission_00';
    it('should return an InternalServerException if repository fails ', (done) => {
      const testError = new InternalServerErrorException(
        'Could not retrieve permission'
      );
      mockRepository.getOne.mockRejectedValueOnce(testError);
      service.getOnePermission(id).subscribe({
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
      service.getOnePermission(id).subscribe({
        error: (err) => {
          expect(mockRepository.getOne).toHaveBeenCalledTimes(1);
          expect(mockRepository.getOne).toHaveBeenCalledWith({ where: { id } });
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });

    it('should return an permission', (done) => {
      mockRepository.getOne.mockResolvedValueOnce(mockPermissions[0]);
      service.getOnePermission(id).subscribe({
        next: (res) => {
          expect(mockRepository.getOne).toHaveBeenCalledTimes(1);
          expect(mockRepository.getOne).toHaveBeenCalledWith({ where: { id } });
          expect(res).toMatchObject(mockPermissions[0]);
          done();
        },
      });
    });
  });

  describe('createPermission', () => {
    const inputTemplate: CreatePermissionDTO = {
      name: 'permissionThree',
    };

    it('should return an InternalServerException if repository fails', (done) => {
      const testError = new InternalServerErrorException();
      mockRepository.create.mockRejectedValueOnce(testError);
      service.createPermission(inputTemplate).subscribe({
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

    it('should return an permission ', (done) => {
      mockRepository.create.mockResolvedValueOnce(mockPermissions[0]);
      service.createPermission(inputTemplate).subscribe({
        next: (res) => {
          expect(mockRepository.create).toHaveBeenCalledTimes(1);
          expect(mockRepository.create).toHaveBeenCalledWith({
            ...inputTemplate,
            id: fakeUUUID,
          });
          expect(res).toMatchObject(mockPermissions[0]);
          done();
        },
      });
    });
  });

  describe('updatePermission', () => {
    const id = 'permission_01';
    it('should return the updated permission', (done) => {
      mockRepository.update.mockResolvedValueOnce(mockPermissions[0]);
      service.updatePermission(id).subscribe({
        next: (res) => {
          expect(mockRepository.update).toHaveBeenCalledTimes(1);
          expect(res).toMatchObject(mockPermissions[0]);
          done();
        },
      });
    });

    it('should return an error when failed to update', (done) => {
      mockRepository.update.mockRejectedValueOnce(
        new InternalServerErrorException()
      );
      service.updatePermission(id).subscribe({
        error: (err) => {
          expect(mockRepository.update).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });
  });

  describe('deletePermission', () => {
    const id = 'permission_01';
    it('should return an error when deletion fails', (done) => {
      mockRepository.delete.mockRejectedValueOnce(
        new InternalServerErrorException()
      );
      service.deletePermission(id).subscribe({
        error: (err) => {
          expect(mockRepository.delete).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });

    it('should return an error when deletion fails', (done) => {
      mockRepository.delete.mockResolvedValueOnce(mockPermissions[0]);
      service.deletePermission(id).subscribe({
        next: (res) => {
          expect(mockRepository.delete).toHaveBeenCalledTimes(1);
          expect(res).toBeTruthy();
          done();
        },
      });
    });
  });
});
