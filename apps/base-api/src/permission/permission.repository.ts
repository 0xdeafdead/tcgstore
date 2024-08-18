import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma.service';
import { Permission, Prisma } from '@prisma/client';

@Injectable()
export class PermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async all(): Promise<Permission[]> {
    return this.prisma.permission.findMany();
  }

  async create(input: Prisma.PermissionCreateInput): Promise<Permission> {
    return this.prisma.permission.create({
      data: input,
    });
  }

  async getOne(input: Prisma.PermissionFindUniqueArgs): Promise<Permission> {
    return this.prisma.permission.findUnique(input);
  }

  async getMany(filters: Prisma.PermissionFindManyArgs): Promise<Permission[]> {
    return this.prisma.permission.findMany(filters);
  }

  async update(input: Prisma.PermissionUpdateArgs): Promise<Permission> {
    return this.prisma.permission.update(input);
  }

  async delete(input: Prisma.PermissionDeleteArgs): Promise<Permission> {
    return this.prisma.permission.delete(input);
  }
}
