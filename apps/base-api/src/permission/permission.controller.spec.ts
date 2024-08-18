import { Test, TestingModule } from '@nestjs/testing';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { Permission } from '@prisma/client';
import { of } from 'rxjs';
import { CreatePermissionDTO } from './DTOs/createPermission.dto';

describe('PermissionController', () => {
  let controller: PermissionController;
  let service: PermissionService;

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

  const mockService = {
    getAllPermissions: jest.fn(),
    getOnePermission: jest.fn(),
    createPermission: jest.fn(),
    deletePermission: jest.fn(),
    updatePermission: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionController],
      providers: [
        {
          provide: PermissionService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PermissionController>(PermissionController);
    service = module.get<PermissionService>(PermissionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getAllPermissions', () => {
    it('should return an array of permissions', (done) => {
      mockService.getAllPermissions.mockReturnValueOnce(of(mockPermissions));
      controller.getAllPermissions().subscribe({
        next: (res) => {
          expect(mockService.getAllPermissions).toHaveBeenCalledTimes(1);
          expect(Array.isArray(res)).toBeTruthy();
          done();
        },
      });
    });
  });

  describe('getOne', () => {
    const id = 'permission_00';
    it('should return an permission', (done) => {
      mockService.getOnePermission.mockReturnValueOnce(of(mockPermissions[0]));
      controller.getPermission(id).subscribe({
        next: (res) => {
          expect(mockService.getAllPermissions).toHaveBeenCalledTimes(1);
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
    it('should return the created permissions', (done) => {
      mockService.createPermission.mockReturnValueOnce(of(mockPermissions[0]));
      controller.createPermission(inputTemplate).subscribe({
        next: (res) => {
          expect(mockService.getAllPermissions).toHaveBeenCalledTimes(1);
          expect(res).toMatchObject(mockPermissions[0]);
          done();
        },
      });
    });
  });

  describe('updatePermission', () => {
    const id = 'permission_01';
    it('should return Permission', (done) => {
      mockService.updatePermission.mockReturnValueOnce(of(mockPermissions[0]));
      controller.updatePermission(id).subscribe({
        next: (res) => {
          expect(mockService.updatePermission).toHaveBeenCalledTimes(1);
          expect(res).toMatchObject(mockPermissions[0]);
          done();
        },
      });
    });
  });

  describe('deletePermission', () => {
    const id = 'permission_00';
    it('should return an array of permissions', (done) => {
      mockService.deletePermission.mockReturnValueOnce(of(mockPermissions[0]));
      controller.deletePermission(id).subscribe({
        next: (res) => {
          expect(mockService.getAllPermissions).toHaveBeenCalledTimes(1);
          expect(res).toMatchObject(mockPermissions[0]);
          done();
        },
      });
    });
  });
});
