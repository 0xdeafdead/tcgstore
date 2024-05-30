export interface IBaseRepository<T> {
    all(): Promise<T[]>;
    create(input: Partial<T>): Promise<T>;
    getOne(filters:Partial<T>): Promise<T>;
    update(input: Partial<T>): Promise<T>;
    delete(id:string): Promise<boolean>;
}