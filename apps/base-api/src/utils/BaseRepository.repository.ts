import { IBaseRepository } from './IBaseRespositoy';

export class BaseRepository<T> {
 
  async all(): Promise<T[]> {
    return undefined;
  }
  async create(input: Partial<T>): Promise<T> {
    return undefined;
  }
  async getOne(id: string): Promise<T> {
    return undefined;
  }
  async getMany(filters: Partial<T>): Promise<T[]> {
    return undefined;
  }
  async update(input: Partial<T>): Promise<T> {
    return undefined;
  }
  async delete(id: string): Promise<T> {
    return undefined;
  }
}
