import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { Item } from '@prisma/client';
import dayjs from 'dayjs';
import { of } from 'rxjs';
import { CreateItemDTO } from './DTOs/createItem.dto';
import { UpdateItemDTO } from './DTOs/updateItem.dto';

describe('ItemController', () => {
  let controller: ItemController;
  let service: ItemService;

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

  const mockService = {
    getAllItems: jest.fn(),
    getOneItem: jest.fn(),
    createItem: jest.fn(),
    deleteItem: jest.fn(),
    updateItem: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        {
          provide: ItemService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
    service = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of items', (done) => {
      mockService.getAllItems.mockReturnValueOnce(of(mockItems));
      controller.getAllItems().subscribe({
        next: (res) => {
          expect(mockService.getAllItems).toHaveBeenCalledTimes(1);
          expect(Array.isArray(res)).toBeTruthy();
          done();
        },
      });
    });
  });

  describe('getOne', () => {
    const id = 'item_00';
    it('should return an item', (done) => {
      mockService.getOneItem.mockReturnValueOnce(of(mockItems[0]));
      controller.getItem(id).subscribe({
        next: (res) => {
          expect(mockService.getAllItems).toHaveBeenCalledTimes(1);
          expect(res).toMatchObject(mockItems[0]);
          done();
        },
      });
    });
  });

  describe('createItem', () => {
    const inputTemplate: CreateItemDTO = {
      name: 'itemName',
      ownerId: 'user_00',
      price: 1234.56,
    };
    it('should return the created items', (done) => {
      mockService.createItem.mockReturnValueOnce(of(mockItems[0]));
      controller.createItem(inputTemplate).subscribe({
        next: (res) => {
          expect(mockService.getAllItems).toHaveBeenCalledTimes(1);
          expect(res).toMatchObject(mockItems[0]);
          done();
        },
      });
    });
  });

  describe('updateItem', () => {
    const id = 'item_01';
    const inputTemplace: UpdateItemDTO = {
      name: 'newItemName',
      price: 99.12,
    };
    it('should return Item', (done) => {
      mockService.updateItem.mockReturnValueOnce(of(mockItems[0]));
      controller.updateItem(id, inputTemplace).subscribe({
        next: (res) => {
          expect(mockService.updateItem).toHaveBeenCalledTimes(1);
          expect(res).toMatchObject(mockItems[0]);
          done();
        },
      });
    });
  });

  describe('deleteItem', () => {
    const id = 'item_00';
    it('should return an array of items', (done) => {
      mockService.deleteItem.mockReturnValueOnce(of(mockItems[0]));
      controller.deleteItem(id).subscribe({
        next: (res) => {
          expect(mockService.getAllItems).toHaveBeenCalledTimes(1);
          expect(res).toMatchObject(mockItems[0]);
          done();
        },
      });
    });
  });
});
