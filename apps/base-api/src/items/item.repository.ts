import { Item, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma.service';
import { CreateItemDTO } from './DTOs/createItem.dto';

export interface CreateInput extends CreateItemDTO {
  id: string;
}
@Injectable()
export class ItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async all(): Promise<Item[]> {
    return this.prisma.item.findMany();
  }

  async create(input: Prisma.ItemUncheckedCreateInput): Promise<Item> {
    return this.prisma.item.create({
      data: input,
    });
  }

  async getOne(input: Prisma.ItemFindUniqueArgs): Promise<Item> {
    return this.prisma.item.findUnique(input);
  }

  async getMany(filters: Prisma.ItemFindManyArgs): Promise<Item[]> {
    return this.prisma.item.findMany(filters);
  }

  async update(input: Prisma.ItemUpdateArgs): Promise<Item> {
    return this.prisma.item.update(input);
  }

  async delete(input: Prisma.ItemDeleteArgs): Promise<Item> {
    return this.prisma.item.delete(input);
  }
}
