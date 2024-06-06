import dayjs from 'dayjs';
import crypto from 'crypto';
import { Item } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { ItemService } from './item.service';
import { ItemRepository } from './item.repository';
import { CreateItemDTO } from './DTOs/createItem.dto';
import { UpdateItemDTO } from './DTOs/updateItem.dto';

describe('ItemService', () => {
  let service: ItemService;
  let itemRepository: ItemRepository;

  const now = dayjs().toDate();
  const mockItems: Item[] = [
    {
      id: 'item_01',
      name: 'testItem',
      ownerId: 'user_01',
      price: 1234.53,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'item_02',
      name: 'testItem2',
      ownerId: 'user_02',
      price: 5678.53,
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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: ItemRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    itemRepository = module.get<ItemRepository>(ItemRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(itemRepository).toBeDefined();
  });

  describe('getAllItems', () => {
    it('should return a InternalServerException when fail', (done) => {
      const testError = new InternalServerErrorException(
        'Could not create item'
      );
      mockRepository.all.mockRejectedValueOnce(testError);
      service.getAllItems().subscribe({
        error: (err) => {
          expect(mockRepository.all).toHaveBeenCalledTimes(1);
          expect(err).toMatchObject(testError);
          done();
        },
      });
    });

    it('should return an array of items', (done) => {
      mockRepository.all.mockResolvedValueOnce(mockItems);
      service.getAllItems().subscribe({
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
    const id = 'item_00';
    it('should return an InternalServerException if repository fails ', (done) => {
      const testError = new InternalServerErrorException(
        'Could not retrieve item'
      );
      mockRepository.getOne.mockRejectedValueOnce(testError);
      service.getOneItem(id).subscribe({
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
      service.getOneItem(id).subscribe({
        error: (err) => {
          expect(mockRepository.getOne).toHaveBeenCalledTimes(1);
          expect(mockRepository.getOne).toHaveBeenCalledWith({ where: { id } });
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });

    it('should return an item', (done) => {
      mockRepository.getOne.mockResolvedValueOnce(mockItems[0]);
      service.getOneItem(id).subscribe({
        next: (res) => {
          expect(mockRepository.getOne).toHaveBeenCalledTimes(1);
          expect(mockRepository.getOne).toHaveBeenCalledWith({ where: { id } });
          expect(res).toMatchObject(mockItems[0]);
          done();
        },
      });
    });
  });

  describe('createItem', () => {
    const inputTemplate: CreateItemDTO = {
      name: 'testName',
      ownerId: 'user_01',
      price: 1234.56,
    };
    const notRandomUUID = `a-b-c-d-e`;
    beforeEach(() => {
      jest.spyOn(crypto, 'randomUUID').mockReturnValue(notRandomUUID);
    });

    it('should return an InternalServerException if repository fails', (done) => {
      const testError = new InternalServerErrorException();
      mockRepository.create.mockRejectedValueOnce(testError);
      service.createItem(inputTemplate).subscribe({
        error: (err) => {
          expect(mockRepository.create).toHaveBeenCalledTimes(1);
          expect(mockRepository.create).toHaveBeenCalledWith({
            ...inputTemplate,
            id: notRandomUUID,
          });
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });

    it('should return an item ', (done) => {
      mockRepository.create.mockResolvedValueOnce(mockItems[0]);
      service.createItem(inputTemplate).subscribe({
        next: (res) => {
          expect(mockRepository.create).toHaveBeenCalledTimes(1);
          expect(mockRepository.create).toHaveBeenCalledWith({
            ...inputTemplate,
            id: notRandomUUID,
          });
          expect(res).toMatchObject(mockItems[0]);
          done();
        },
      });
    });
  });

  describe('updateItem', () => {
    const id = 'item_01';
    const inputTemplate: UpdateItemDTO = {
      name: 'newItemName',
      price: 999.99,
    };
    it('should return an error when updating fail', (done) => {
      mockRepository.update.mockRejectedValueOnce(
        new Error('Failed to update')
      );
      service.updateItem(id, inputTemplate).subscribe({
        error: (err) => {
          expect(mockRepository.update).toHaveBeenCalledTimes(1);
          expect(mockRepository.update).toHaveBeenCalledWith({
            data: inputTemplate,
            where: { id },
          });
          expect(err).toBeInstanceOf(Error);
          done();
        },
      });
    });
  });

  describe('deleteItem', () => {
    const id = 'item_01';
    it('should return an error when deletion fails', (done) => {
      mockRepository.delete.mockRejectedValueOnce(
        new InternalServerErrorException()
      );
      service.deleteItem(id).subscribe({
        error: (err) => {
          expect(mockRepository.delete).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });

    it('should return an error when deletion fails', (done) => {
      mockRepository.delete.mockResolvedValueOnce(mockItems[0]);
      service.deleteItem(id).subscribe({
        next: (res) => {
          expect(mockRepository.delete).toHaveBeenCalledTimes(1);
          expect(res).toBeTruthy();
          done();
        },
      });
    });
  });
});
