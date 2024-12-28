import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '../prisma-service/prisma.service';
import { GetUserOptions } from './types';

@Injectable()
export class UserRespository {
  constructor(private readonly prisma: PrismaService) {}

  async all(options?: GetUserOptions) {
    const users = await this.prisma.user.findMany({
      where: { disabled: false },
      include: !options.permissions
        ? {}
        : {
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

  async create(
    input: Prisma.UserCreateWithoutUserRoleInput,
    options?: { roleId?: string }
  ) {
    const { email, firstName, id, lastName } = input;
    return this.prisma.user.create({
      data: {
        email,
        firstName,
        id,
        lastName,
        userRole: { create: { roleId: options.roleId } },
      },
      include: {
        userRole: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: {
                      select: { id: true, name: true },
                    },
                  },
                },
              },
            },
          },
          select: { role: true, roleId: true },
        },
      },
    });
  }

  async getOne(findBy: Prisma.UserWhereUniqueInput, options?: GetUserOptions) {
    const x = await this.prisma.user.findUnique({
      where: { ...findBy, disabled: false },
      include: options.permissions
        ? {
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
          }
        : {},
    });
    return x;
  }

  async getMany(filters: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prisma.user.findMany(filters);
  }

  async update(input: Prisma.UserUpdateArgs): Promise<User> {
    return this.prisma.user.update(input);
  }

  async disable(email: string): Promise<User> {
    return this.prisma.user.update({
      where: { email, disabled: false },
      data: { disabled: true },
    });
  }
}
