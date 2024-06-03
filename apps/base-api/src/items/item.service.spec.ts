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

  const mockItemRepo = {
    all: jest.fn(),
    getOne: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: ItemRepository,
          useValue: mockItemRepo,
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
    it('should return a ConflictException when fail', (done) => {
      const testError = new ConflictException('Could not create item');
      mockItemRepo.all.mockRejectedValueOnce(testError);
      service.getAllItems().subscribe({
        error: (err) => {
          expect(mockItemRepo.all).toHaveBeenCalledTimes(1);
          expect(err).toMatchObject(testError);
          done();
        },
      });
    });

    it('should return an array of items', (done) => {
      mockItemRepo.all.mockResolvedValueOnce(mockItems);
      service.getAllItems().subscribe({
        next: (res) => {
          expect(mockItemRepo.all).toHaveBeenCalledTimes(1);
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
      mockItemRepo.getOne.mockRejectedValueOnce(testError);
      service.getOneItem(id).subscribe({
        error: (err) => {
          expect(mockItemRepo.getOne).toHaveBeenCalledTimes(1);
          expect(mockItemRepo.getOne).toHaveBeenCalledWith(id);
          expect(err).toMatchObject(testError);
          done();
        },
      });
    });

    it('should return an NotFoundException if repository fails ', (done) => {
      mockItemRepo.getOne.mockResolvedValueOnce(null);
      service.getOneItem(id).subscribe({
        error: (err) => {
          expect(mockItemRepo.getOne).toHaveBeenCalledTimes(1);
          expect(mockItemRepo.getOne).toHaveBeenCalledWith(id);
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });

    it('should return an item', (done) => {
      mockItemRepo.getOne.mockResolvedValueOnce(mockItems[0]);
      service.getOneItem(id).subscribe({
        next: (res) => {
          expect(mockItemRepo.getOne).toHaveBeenCalledTimes(1);
          expect(mockItemRepo.getOne).toHaveBeenCalledWith(id);
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
      mockItemRepo.create.mockRejectedValueOnce(testError);
      service.createItem(inputTemplate).subscribe({
        error: (err) => {
          expect(mockItemRepo.create).toHaveBeenCalledTimes(1);
          expect(mockItemRepo.create).toHaveBeenCalledWith({
            ...inputTemplate,
            id: notRandomUUID,
          });
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });

    it('should return an item ', (done) => {
      mockItemRepo.create.mockResolvedValueOnce(mockItems[0]);
      service.createItem(inputTemplate).subscribe({
        next: (res) => {
          expect(mockItemRepo.create).toHaveBeenCalledTimes(1);
          expect(mockItemRepo.create).toHaveBeenCalledWith({
            ...inputTemplate,
            id: notRandomUUID,
          });
          expect(res).toMatchObject(mockItems[0]);
          done();
        },
      });
    });
  });

  describe('deleteItem', () => {
    const id = 'item_01';
    it('should return an error when deletion fails', (done) => {
      mockItemRepo.delete.mockRejectedValueOnce(
        new InternalServerErrorException()
      );
      service.deleteItem(id).subscribe({
        error: (err) => {
          expect(mockItemRepo.delete).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });

    it('should return an error when deletion fails', (done) => {
      mockItemRepo.delete.mockResolvedValueOnce(mockItems[0]);
      service.deleteItem(id).subscribe({
        next: (res) => {
          expect(mockItemRepo.delete).toHaveBeenCalledTimes(1);
          expect(res).toBeTruthy();
          done();
        },
      });
    });
  });
});
