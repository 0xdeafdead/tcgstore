import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma-service/prisma.service';

@Injectable()
export class UserRespository {
  constructor(private readonly prisma: PrismaService) {}

  async all(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async create(input: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data: input });
  }

  async getOne(input: Prisma.UserFindUniqueArgs): Promise<User> {
    return this.prisma.user.findUnique(input);
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
