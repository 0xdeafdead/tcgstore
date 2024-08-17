import { Test, TestingModule } from '@nestjs/testing';
import { Entity } from '@prisma/client';
import { of } from 'rxjs';

import { EntityService } from './entity.service';
import { EntityController } from './entity.controller';

describe('EntityController', () => {
  let controller: EntityController;
  let service: EntityService;

  const now = new Date();
  const mockEntities: Entity[] = [
    {
      id: 'entity_01',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'entity_02',
      createdAt: now,
      updatedAt: now,
    },
  ];

  const mockService = {
    getAllEntities: jest.fn(),
    getOneEntity: jest.fn(),
    createEntity: jest.fn(),
    deleteEntity: jest.fn(),
    updateEntity: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntityController],
      providers: [
        {
          provide: EntityService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<EntityController>(EntityController);
    service = module.get<EntityService>(EntityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of entities', (done) => {
      mockService.getAllEntities.mockReturnValueOnce(of(mockEntities));
      controller.getAllEntities().subscribe({
        next: (res) => {
          expect(mockService.getAllEntities).toHaveBeenCalledTimes(1);
          expect(Array.isArray(res)).toBeTruthy();
          done();
        },
      });
    });
  });

  describe('getOne', () => {
    const id = 'entity_00';
    it('should return an entity', (done) => {
      mockService.getOneEntity.mockReturnValueOnce(of(mockEntities[0]));
      controller.getEntity(id).subscribe({
        next: (res) => {
          expect(mockService.getAllEntities).toHaveBeenCalledTimes(1);
          expect(res).toMatchObject(mockEntities[0]);
          done();
        },
      });
    });
  });

  describe('createEntity', () => {
    it('should return the created entities', (done) => {
      mockService.createEntity.mockReturnValueOnce(of(mockEntities[0]));
      controller.createEntity().subscribe({
        next: (res) => {
          expect(mockService.getAllEntities).toHaveBeenCalledTimes(1);
          expect(res).toMatchObject(mockEntities[0]);
          done();
        },
      });
    });
  });

  describe('updateEntity', () => {
    const id = 'entity_01';
    it('should return Entity', (done) => {
      mockService.updateEntity.mockReturnValueOnce(of(mockEntities[0]));
      controller.updateEntity(id).subscribe({
        next: (res) => {
          expect(mockService.updateEntity).toHaveBeenCalledTimes(1);
          expect(res).toMatchObject(mockEntities[0]);
          done();
        },
      });
    });
  });

  describe('deleteEntity', () => {
    const id = 'entity_00';
    it('should return an array of entities', (done) => {
      mockService.deleteEntity.mockReturnValueOnce(of(mockEntities[0]));
      controller.deleteEntity(id).subscribe({
        next: (res) => {
          expect(mockService.getAllEntities).toHaveBeenCalledTimes(1);
          expect(res).toMatchObject(mockEntities[0]);
          done();
        },
      });
    });
  });
});
