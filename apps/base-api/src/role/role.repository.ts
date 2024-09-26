import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma-service/prisma.service';
import { GetRoleOptions } from './types';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async all(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  async create(input: Prisma.RoleCreateInput): Promise<Role> {
    return this.prisma.role.create({
      data: input,
    });
  }

  async getOne(findBy: Prisma.RoleWhereUniqueInput, options?: GetRoleOptions) {
    return this.prisma.role.findUnique({
      where: findBy,
      include: {
        permissions: {
          include: {
            permission: options?.permissions
              ? { select: { id: true, name: true } }
              : false,
          },
        },
      },
    });
  }

  async getMany(filters: Prisma.RoleFindManyArgs): Promise<Role[]> {
    return this.prisma.role.findMany(filters);
  }

  async update(input: Prisma.RoleUpdateArgs): Promise<Role> {
    return this.prisma.role.update(input);
  }

  async delete(input: Prisma.RoleDeleteArgs): Promise<Role> {
    return this.prisma.role.delete(input);
  }
}
