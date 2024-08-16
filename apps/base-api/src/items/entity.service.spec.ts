import { Entity } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { EntityService } from './entity.service';
import { EntityRepository } from './entity.repository';

const fakeUUUID = 'abcd1234-abcd-1234-defg-56789-56789defg';
jest.mock('uuid', () => {
  return { v4: () => fakeUUUID };
});

describe('EntityService', () => {
  let service: EntityService;
  let entityRepository: EntityRepository;

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
        EntityService,
        {
          provide: EntityRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EntityService>(EntityService);
    entityRepository = module.get<EntityRepository>(EntityRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(entityRepository).toBeDefined();
  });

  describe('getAllEntities', () => {
    it('should return a InternalServerException when fail', (done) => {
      const testError = new InternalServerErrorException(
        'Could not create entity'
      );
      mockRepository.all.mockRejectedValueOnce(testError);
      service.getAllEntities().subscribe({
        error: (err) => {
          expect(mockRepository.all).toHaveBeenCalledTimes(1);
          expect(err).toMatchObject(testError);
          done();
        },
      });
    });

    it('should return an array of entities', (done) => {
      mockRepository.all.mockResolvedValueOnce(mockEntities);
      service.getAllEntities().subscribe({
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
    const id = 'entity_00';
    it('should return an InternalServerException if repository fails ', (done) => {
      const testError = new InternalServerErrorException(
        'Could not retrieve entity'
      );
      mockRepository.getOne.mockRejectedValueOnce(testError);
      service.getOneEntity(id).subscribe({
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
      service.getOneEntity(id).subscribe({
        error: (err) => {
          expect(mockRepository.getOne).toHaveBeenCalledTimes(1);
          expect(mockRepository.getOne).toHaveBeenCalledWith({ where: { id } });
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });

    it('should return an entity', (done) => {
      mockRepository.getOne.mockResolvedValueOnce(mockEntities[0]);
      service.getOneEntity(id).subscribe({
        next: (res) => {
          expect(mockRepository.getOne).toHaveBeenCalledTimes(1);
          expect(mockRepository.getOne).toHaveBeenCalledWith({ where: { id } });
          expect(res).toMatchObject(mockEntities[0]);
          done();
        },
      });
    });
  });

  describe('createEntity', () => {
    it('should return an InternalServerException if repository fails', (done) => {
      const testError = new InternalServerErrorException();
      mockRepository.create.mockRejectedValueOnce(testError);
      service.createEntity().subscribe({
        error: (err) => {
          expect(mockRepository.create).toHaveBeenCalledTimes(1);
          expect(mockRepository.create).toHaveBeenCalledWith({
            id: fakeUUUID,
          });
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });

    it('should return an entity ', (done) => {
      mockRepository.create.mockResolvedValueOnce(mockEntities[0]);
      service.createEntity().subscribe({
        next: (res) => {
          expect(mockRepository.create).toHaveBeenCalledTimes(1);
          expect(mockRepository.create).toHaveBeenCalledWith({
            id: fakeUUUID,
          });
          expect(res).toMatchObject(mockEntities[0]);
          done();
        },
      });
    });
  });

  describe('updateEntity', () => {
    const id = 'entity_01';
    it('should return an error when updating fail', (done) => {
      mockRepository.update.mockRejectedValueOnce(
        new Error('Failed to update')
      );
      service.updateEntity(id).subscribe({
        error: (err) => {
          expect(mockRepository.update).toHaveBeenCalledTimes(1);
          expect(mockRepository.update).toHaveBeenCalledWith({
            data: {},
            where: { id },
          });
          expect(err).toBeInstanceOf(Error);
          done();
        },
      });
    });
  });

  describe('deleteEntity', () => {
    const id = 'entity_01';
    it('should return an error when deletion fails', (done) => {
      mockRepository.delete.mockRejectedValueOnce(
        new InternalServerErrorException()
      );
      service.deleteEntity(id).subscribe({
        error: (err) => {
          expect(mockRepository.delete).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });

    it('should return an error when deletion fails', (done) => {
      mockRepository.delete.mockResolvedValueOnce(mockEntities[0]);
      service.deleteEntity(id).subscribe({
        next: (res) => {
          expect(mockRepository.delete).toHaveBeenCalledTimes(1);
          expect(res).toBeTruthy();
          done();
        },
      });
    });
  });
});
