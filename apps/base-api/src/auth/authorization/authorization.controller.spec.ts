import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { BaseGuard } from '@tcg-market-core/jwt';
import { UpdateUserRolesDTO } from '../DTOs/updateUserRole.dto';
import { RoleName } from '@prisma/client';
import { of, throwError } from 'rxjs';
import { UpdateRolePermissionsDTO } from '../DTOs/updatePermissionFromRole.dto';
import { HttpException } from '@nestjs/common';

describe('AuthorizationController', () => {
  let controller: AuthorizationController;
  let service: AuthorizationService;

  const mockService = {
    updateRoleToUser: jest.fn(),
    updatePermissionsToRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorizationController],
      providers: [
        {
          provide: AuthorizationService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(BaseGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthorizationController>(AuthorizationController);
    service = module.get<AuthorizationService>(AuthorizationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(AuthorizationController);
  });

  describe('updateUserRole', () => {
    it('should return boolean when update user role', (done) => {
      const input: UpdateUserRolesDTO = {
        id: 'user_01',
        newRole: RoleName.DEV,
      };
      mockService.updateRoleToUser.mockReturnValueOnce(of(true));
      controller.updateUserRole(input).subscribe({
        next: (res) => {
          expect(mockService.updateRoleToUser).toHaveBeenCalledWith(input);
          expect(res).toBe(true);
          done();
        },
      });
    });

    it('should return error when unable to update user role', (done) => {
      const input: UpdateUserRolesDTO = {
        id: 'user_01',
        newRole: RoleName.DEV,
      };
      mockService.updateRoleToUser.mockReturnValueOnce(
        throwError(() => new HttpException('error', 500))
      );
      controller.updateUserRole(input).subscribe({
        error: (err) => {
          expect(mockService.updateRoleToUser).toHaveBeenCalledWith(input);
          expect(err).toBeInstanceOf(HttpException);
          done();
        },
      });
    });
  });

  describe('updaeRolePermissions', () => {
    it('should return boolean when update role permissions', (done) => {
      const input: UpdateRolePermissionsDTO = {
        role: RoleName.DEV,
        permissionsToAdd: [],
        permissionsToRemove: [],
      };
      mockService.updatePermissionsToRole.mockReturnValueOnce(of(true));
      controller.updateRolePermissions('user_01', input).subscribe({
        next: (res) => {
          expect(mockService.updatePermissionsToRole).toHaveBeenCalledWith(
            'user_01',
            input
          );
          expect(res).toBe(true);
          done();
        },
      });
    });

    it('should return error when unable to update role permissions', (done) => {
      const input: UpdateRolePermissionsDTO = {
        role: RoleName.DEV,
        permissionsToAdd: [],
        permissionsToRemove: [],
      };
      mockService.updatePermissionsToRole.mockReturnValueOnce(
        throwError(() => new HttpException('error', 500))
      );
      controller.updateRolePermissions('user_01', input).subscribe({
        error: (err) => {
          expect(mockService.updatePermissionsToRole).toHaveBeenCalledWith(
            'user_01',
            input
          );
          expect(err).toBeInstanceOf(HttpException);
          done();
        },
      });
    });
  });
});
