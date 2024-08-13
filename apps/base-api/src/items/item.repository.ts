import { Entity, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma.service';
import { CreateItemDTO } from './DTOs/createItem.dto';

export interface CreateInput extends CreateItemDTO {
  id: string;
}
@Injectable()
export class ItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async all(): Promise<Entity[]> {
    return this.prisma.entity.findMany();
  }

  async create(input: Prisma.EntityUncheckedCreateInput): Promise<Entity> {
    return this.prisma.entity.create({
      data: input,
    });
  }

  async getOne(input: Prisma.EntityFindUniqueArgs): Promise<Entity> {
    return this.prisma.entity.findUnique(input);
  }

  async getMany(filters: Prisma.EntityFindManyArgs): Promise<Entity[]> {
    return this.prisma.entity.findMany(filters);
  }

  async update(input: Prisma.EntityUpdateArgs): Promise<Entity> {
    return this.prisma.entity.update(input);
  }

  async delete(input: Prisma.EntityDeleteArgs): Promise<Entity> {
    return this.prisma.entity.delete(input);
  }
}
