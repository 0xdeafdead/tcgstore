import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from '@prisma/client';
import { of } from 'rxjs';
import { CreateRoleDTO } from './DTOs/createRole.dto';
import { BaseGuard } from '../guards';
import { CurrentUserPayload } from '../types';
import { UpdateRoleDTO } from './DTOs/updateRole.dto';

describe('RoleController', () => {
  let controller: RoleController;
  let service: RoleService;

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
      controller.getAllRoles().subscribe({
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
    };
    const user: CurrentUserPayload = {
      role: 'role_01',
      sub: 'testing@test.com',
    };
    it('should return the created roles', (done) => {
      mockService.createRole.mockReturnValueOnce(of(mockRoles[0]));
      controller.createRole(user, inputTemplate).subscribe({
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
    const data: UpdateRoleDTO = {
      name: 'newRoleName',
    };
    it('should return Role', (done) => {
      mockService.updateRole.mockReturnValueOnce(of(mockRoles[0]));
      controller.updateRole(id, data).subscribe({
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
