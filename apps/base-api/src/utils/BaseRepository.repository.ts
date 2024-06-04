export class BaseRepository<T> {
  async all(): Promise<T[]> {
    return undefined;
  }
  async create(input: Partial<T>): Promise<T> {
    return;
  }
  async getOne(id: string): Promise<T> {
    return;
  }
  async getMany(filters: unknown): Promise<T[]> {
    return;
  }
  async update(input: unknown): Promise<T> {
    return;
  }
  async delete(id: string): Promise<T> {
    return;
  }
}
