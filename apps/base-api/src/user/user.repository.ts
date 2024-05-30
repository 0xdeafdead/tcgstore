import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { BaseRepository } from '../utils/BaseRepository.repository';
import { PrismaService } from '../prisma-service/prisma.service';
import { CreateUserDTO } from './DTOs/createUser.dto';

@Injectable()
export class UserRespository implements BaseRepository<User> {
  constructor(private readonly prisma: PrismaService) {}

  async all(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async create(input: User): Promise<User> {
    const newUser = await this.prisma.user.create({ data: input });
    return newUser;
  }

  async getOne(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getMany(filters: Partial<User>): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        rank: { equals: filters.rank },
      },
    });
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
