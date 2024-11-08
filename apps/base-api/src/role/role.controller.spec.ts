import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role, RoleName } from '@prisma/client';
import { of } from 'rxjs';
import { CreateRoleDTO } from './DTOs/createRole.dto';
import { BaseGuard } from '@tcg-market-core/jwt';

describe('RoleController', () => {
  let controller: RoleController;
  let service: RoleService;

  const mockRoles: Role[] = [
    {
      id: 'role_01',
      name: 'roleOne',
      role: 'USER',
    },
    {
      id: 'role_02',
      name: 'roleTwo',
      role: 'USER',
    },
  ];

  const mockService = {
    getAllRoles: jest.fn(),
    getOneRole: jest.fn(),
    createRole: jest.fn(),
    deleteRole: jest.fn(),
    updateRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(BaseGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RoleController>(RoleController);
    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getAllRoles', () => {
    it('should return an array of roles', (done) => {
      mockService.getAllRoles.mockReturnValueOnce(of(mockRoles));
      controller.getAllRoles('testing@test.com').subscribe({
        next: (res) => {
          expect(mockService.getAllRoles).toHaveBeenCalledTimes(1);
          expect(Array.isArray(res)).toBeTruthy();
          done();
        },
      });
    });
  });

  describe('getOne', () => {
    const id = 'role_00';
    it('should return an role', (done) => {
      mockService.getOneRole.mockReturnValueOnce(of(mockRoles[0]));
      controller.getRole(id).subscribe({
        next: (res) => {
          expect(mockService.getAllRoles).toHaveBeenCalledTimes(1);
          expect(res).toMatchObject(mockRoles[0]);
          done();
        },
      });
    });
  });

  describe('createRole', () => {
    const inputTemplate: CreateRoleDTO = {
      name: 'roleThree',
      permissionIds: ['permission_01', 'permission_02'],
      role: RoleName.ADMIN,
    };
    it('should return the created roles', (done) => {
      mockService.createRole.mockReturnValueOnce(of(mockRoles[0]));
      controller.createRole(inputTemplate).subscribe({
        next: (res) => {
          expect(mockService.getAllRoles).toHaveBeenCalledTimes(1);
          expect(res).toMatchObject(mockRoles[0]);
          done();
        },
      });
    });
  });

  describe('updateRole', () => {
    const id = 'role_01';
    it('should return Role', (done) => {
      mockService.updateRole.mockReturnValueOnce(of(mockRoles[0]));
      controller.updateRole(id).subscribe({
        next: (res) => {
          expect(mockService.updateRole).toHaveBeenCalledTimes(1);
          expect(res).toMatchObject(mockRoles[0]);
          done();
        },
      });
    });
  });

  describe('deleteRole', () => {
    const id = 'role_00';
    it('should return an array of roles', (done) => {
      mockService.deleteRole.mockReturnValueOnce(of(mockRoles[0]));
      controller.deleteRole(id).subscribe({
        next: (res) => {
          expect(mockService.getAllRoles).toHaveBeenCalledTimes(1);
          expect(res).toMatchObject(mockRoles[0]);
          done();
        },
      });
    });
  });
});
