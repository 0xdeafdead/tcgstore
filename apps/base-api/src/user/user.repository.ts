import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { BaseRepository } from '../utils/BaseRepository.repository';
import { PrismaService } from '../prisma-service/prisma.service';

@Injectable()
export class UserRespository implements BaseRepository<User> {
  constructor(private readonly prisma: PrismaService) {}

  async all(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async create(input: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data: input });
  }

  async getOne(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getMany(filters: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prisma.user.findMany(filters);
  }

  async update(input: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      data: input,
      where: { email: input.email },
    });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
