import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '../prisma-service/prisma.service';
import { GetUserOptions } from './types';

@Injectable()
export class UserRespository {
  constructor(private readonly prisma: PrismaService) {}

  async all(options?: GetUserOptions) {
    const users = await this.prisma.user.findMany({
      include: {
        userRole: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: options.permissions
                      ? { select: { id: true, name: true } }
                      : false,
                  },
                },
              },
            },
          },
        },
      },
    });
    return users;
  }

  async create(input: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data: input });
  }

  async getOne(findBy: Prisma.UserWhereUniqueInput, options?: GetUserOptions) {
    const x = await this.prisma.user.findUnique({
      where: findBy,
      include: {
        userRole: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: options.permissions
                      ? { select: { id: true, name: true } }
                      : false,
                  },
                },
              },
            },
          },
        },
      },
    });
    return x;
  }

  async getMany(filters: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prisma.user.findMany(filters);
  }

  async update(input: Prisma.UserUpdateArgs): Promise<User> {
    return this.prisma.user.update(input);
  }

  async delete(input: Prisma.UserDeleteArgs): Promise<User> {
    return this.prisma.user.delete(input);
  }
}
