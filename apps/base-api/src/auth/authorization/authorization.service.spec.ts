import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationService } from './authorization.service';
import { PrismaClient, RoleName } from '@prisma/client';
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
      id: 'user_01',
      newRole: RoleName.ADMIN,
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
      role: RoleName.ADMIN,
      permissionsToAdd: ['permission_01'],
      permissionsToRemove: ['permission_02'],
    };
    it('should return true if the permissions were updated', (done) => {
      prismaMock.rolePermission.createMany.mockResolvedValue({
        count: 1,
      });
      prismaMock.rolePermission.deleteMany.mockResolvedValue({
        count: 1,
      });

      prismaMock.$transaction.mockResolvedValue([
        {
          count: 1,
        },
        {
          count: 1,
        },
      ]);
      service.updatePermissionsToRole('user_01', input).subscribe({
        next: (result) => {
          expect(prismaMock.rolePermission.createMany).toHaveBeenCalledTimes(1);
          expect(prismaMock.rolePermission.deleteMany).toHaveBeenCalledTimes(1);
          expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
          expect(result).toBe(true);
          done();
        },
      });
    });

    it('should return an error if not possible to add new permissions', (done) => {
      prismaMock.rolePermission.createMany.mockResolvedValueOnce({
        count: 0,
      });

      prismaMock.rolePermission.deleteMany.mockResolvedValueOnce({
        count: 0,
      });
      prismaMock.$transaction.mockRejectedValueOnce({
        message: 'Could not update permissions',
      });
      service.updatePermissionsToRole('user_01', input).subscribe({
        error: (err) => {
          expect(prismaMock.rolePermission.createMany).toHaveBeenCalledTimes(1);
          expect(prismaMock.rolePermission.deleteMany).toHaveBeenCalledTimes(1);
          expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });
  });
});
