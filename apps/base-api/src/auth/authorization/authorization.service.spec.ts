import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationService } from './authorization.service';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../../prisma-service/prisma.service';
import { UpdateUserRolesDTO } from '../DTOs/updateUserRole.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { UpdateRolePermissionsDTO } from '../DTOs/updatePermissionFromRole.dto';

describe('AuthorizationService', () => {
  let service: AuthorizationService;
  let prismaService: PrismaService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorizationService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<AuthorizationService>(AuthorizationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(AuthorizationService);
    expect(prismaService).toBeDefined();
  });

  describe('updateRoleToUser', () => {
    const input: UpdateUserRolesDTO = {
      userId: 'user_01',
      roleId: 'role_01',
    };
    it('should return true if the user role was updated', (done) => {
      prismaMock.userRole.update.mockResolvedValue({
        userId: 'role_01',
        roleId: 'role_01',
        assignedAt: new Date(),
      });
      service.updateRoleToUser(input).subscribe({
        next: (result) => {
          expect(prismaMock.userRole.update).toHaveBeenCalledTimes(1);
          expect(result).toBe(true);
          done();
        },
      });
    });

    it('should return an error if not possible to update the user role', (done) => {
      prismaMock.userRole.update.mockRejectedValue({
        message: 'Could not update user role',
      });

      service.updateRoleToUser(input).subscribe({
        error: (err) => {
          expect(prismaMock.userRole.update).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });
  });

  describe('updatePermissionsToRole', () => {
    const input: UpdateRolePermissionsDTO = {
      roleId: 'role_01',
      permissionsToAdd: ['permission_01'],
      permissionsToRemove: ['permission_02'],
    };
    it('should return the role if the permissions were updated', (done) => {
      const fakeRole = {
        id: 'role_01',
        name: 'user',
      };
      prismaMock.rolePermission.createMany.mockResolvedValueOnce({
        count: 1,
      });
      prismaMock.rolePermission.deleteMany.mockResolvedValueOnce({
        count: 1,
      });

      prismaMock.role.findUniqueOrThrow
        .mockResolvedValueOnce(fakeRole)
        .mockResolvedValueOnce(fakeRole);

      prismaMock.$transaction.mockImplementationOnce((callback) =>
        callback(prismaMock)
      );
      service.updatePermissionsToRole('user_01', input).subscribe({
        next: (result) => {
          expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
          expect(prismaMock.rolePermission.createMany).toHaveBeenCalledTimes(1);
          expect(prismaMock.rolePermission.deleteMany).toHaveBeenCalledTimes(1);
          expect(prismaMock.role.findUniqueOrThrow).toHaveBeenCalledTimes(2);
          expect(result).toBe(fakeRole);
          done();
        },
      });
    });

    it('should return an error if role was not found', (done) => {
      const fakeRole = {
        id: 'role_01',
        name: 'user',
      };
      prismaMock.rolePermission.createMany.mockResolvedValueOnce({
        count: 1,
      });
      prismaMock.rolePermission.deleteMany.mockResolvedValueOnce({
        count: 1,
      });

      prismaMock.role.findUniqueOrThrow.mockRejectedValueOnce(
        new Error('Could not find role')
      );

      prismaMock.$transaction.mockImplementationOnce((callback) =>
        callback(prismaMock)
      );
      service.updatePermissionsToRole('user_01', input).subscribe({
        error: (err) => {
          expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
          expect(prismaMock.rolePermission.createMany).toHaveBeenCalledTimes(0);
          expect(prismaMock.rolePermission.deleteMany).toHaveBeenCalledTimes(0);
          expect(prismaMock.role.findUniqueOrThrow).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });
    it('should return an error if not all permissions were added', (done) => {
      const fakeRole = {
        id: 'role_01',
        name: 'user',
      };
      prismaMock.rolePermission.createMany.mockResolvedValueOnce({
        count: 0,
      });
      prismaMock.rolePermission.deleteMany.mockResolvedValueOnce({
        count: 1,
      });

      prismaMock.role.findUniqueOrThrow
        .mockResolvedValueOnce(fakeRole)
        .mockResolvedValueOnce(fakeRole);

      prismaMock.$transaction.mockImplementationOnce((callback) =>
        callback(prismaMock)
      );
      service.updatePermissionsToRole('user_01', input).subscribe({
        error: (err) => {
          expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
          expect(prismaMock.rolePermission.createMany).toHaveBeenCalledTimes(1);
          expect(prismaMock.rolePermission.deleteMany).toHaveBeenCalledTimes(0);
          expect(prismaMock.role.findUniqueOrThrow).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });
    it('should return an error if there was an error addind permissions', (done) => {
      const fakeRole = {
        id: 'role_01',
        name: 'user',
      };
      prismaMock.rolePermission.createMany.mockRejectedValueOnce(
        new Error('Failed to add permissions')
      );
      prismaMock.rolePermission.deleteMany.mockResolvedValueOnce({
        count: 1,
      });

      prismaMock.role.findUniqueOrThrow
        .mockResolvedValueOnce(fakeRole)
        .mockResolvedValueOnce(fakeRole);

      prismaMock.$transaction.mockImplementationOnce((callback) =>
        callback(prismaMock)
      );
      service.updatePermissionsToRole('user_01', input).subscribe({
        error: (err) => {
          expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
          expect(prismaMock.rolePermission.createMany).toHaveBeenCalledTimes(1);
          expect(prismaMock.rolePermission.deleteMany).toHaveBeenCalledTimes(0);
          expect(prismaMock.role.findUniqueOrThrow).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });
    it('should return an error if not all permissions were removed', (done) => {
      const fakeRole = {
        id: 'role_01',
        name: 'user',
      };
      prismaMock.rolePermission.createMany.mockResolvedValueOnce({
        count: 1,
      });
      prismaMock.rolePermission.deleteMany.mockResolvedValueOnce({
        count: 0,
      });

      prismaMock.role.findUniqueOrThrow
        .mockResolvedValueOnce(fakeRole)
        .mockResolvedValueOnce(fakeRole);

      prismaMock.$transaction.mockImplementationOnce((callback) =>
        callback(prismaMock)
      );
      service.updatePermissionsToRole('user_01', input).subscribe({
        error: (err) => {
          expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
          expect(prismaMock.rolePermission.createMany).toHaveBeenCalledTimes(1);
          expect(prismaMock.rolePermission.deleteMany).toHaveBeenCalledTimes(1);
          expect(prismaMock.role.findUniqueOrThrow).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });

    it('should return an error if not all permissions were removed', (done) => {
      const fakeRole = {
        id: 'role_01',
        name: 'user',
      };
      prismaMock.rolePermission.createMany.mockResolvedValueOnce({
        count: 1,
      });
      prismaMock.rolePermission.deleteMany.mockRejectedValueOnce(
        new Error('Failed to remove permissions')
      );

      prismaMock.role.findUniqueOrThrow
        .mockResolvedValueOnce(fakeRole)
        .mockResolvedValueOnce(fakeRole);

      prismaMock.$transaction.mockImplementationOnce((callback) =>
        callback(prismaMock)
      );
      service.updatePermissionsToRole('user_01', input).subscribe({
        error: (err) => {
          expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
          expect(prismaMock.rolePermission.createMany).toHaveBeenCalledTimes(1);
          expect(prismaMock.rolePermission.deleteMany).toHaveBeenCalledTimes(1);
          expect(prismaMock.role.findUniqueOrThrow).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });
  });
});
