import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Entity } from '@prisma/client';
import {
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { CreateInput, ItemRepository } from './item.repository';
import { CreateItemDTO } from './DTOs/createItem.dto';
import { randomUUID } from 'crypto';
import { UpdateItemDTO } from './DTOs/updateItem.dto';

@Injectable()
export class ItemService {
  private readonly logger = new Logger('ItemService');
  constructor(private readonly repository: ItemRepository) {}

  getAllItems(): Observable<Entity[]> {
    return from(this.repository.all()).pipe(
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  getOneItem(id: string): Observable<Entity> {
    return from(this.repository.getOne({ where: { id } })).pipe(
      switchMap((user) => {
        if (!user) {
          throw new NotFoundException('Could not find item with specified id');
        } else {
          return of(user);
        }
      }),
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  createItem(input: CreateItemDTO): Observable<Entity> {
    const newInput: CreateInput = { ...input, id: randomUUID() };
    return from(this.repository.create(newInput)).pipe(
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  updateItem(id: string, input: UpdateItemDTO): Observable<Entity> {
    return from(this.repository.update({ data: input, where: { id } }));
  }

  deleteItem(id: string): Observable<boolean> {
    return from(this.repository.delete({ where: { id } })).pipe(
      map(() => true),
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }
}
