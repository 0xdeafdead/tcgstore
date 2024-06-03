import { Item } from '@prisma/client';
import { BaseRepository } from '../utils/BaseRepository.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma.service';
import { CreateItemDTO } from './DTOs/createItem.dto';

export interface CreateInput extends CreateItemDTO {
  id: string;
}
@Injectable()
export class ItemRepository implements BaseRepository<Item> {
  constructor(private readonly prisma: PrismaService) {}

  async all(): Promise<Item[]> {
    return await this.prisma.item.findMany();
  }

  async create(input: CreateInput): Promise<Item> {
    return await this.prisma.item.create({
      data: {
        id: input.id,
        name: input.name,
        price: input.price,
        ownerId: input.ownerId,
      },
    });
  }

  async getOne(id: string): Promise<Item> {
    return this.prisma.item.findUnique({
      where: {
        id,
      },
    });
  }

  async getMany(filters: Partial<Item>): Promise<Item[]> {
    return this.prisma.item.findMany({
      where: {
        name: { equals: filters.name },
      },
    });
  }

  async update(input: Partial<Item>): Promise<Item> {
    return this.prisma.item.update({
      data: input,
      where: { id: input.id },
    });
  }

  async delete(id: string): Promise<Item> {
    return this.prisma.item.delete({
      where: {
        id,
      },
    });
  }
}
