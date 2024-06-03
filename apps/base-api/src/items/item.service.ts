import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Item } from '@prisma/client';
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

@Injectable()
export class ItemService {
  private readonly logger = new Logger('ItemService');
  constructor(private readonly repository: ItemRepository) {}

  getAllItems(): Observable<Item[]> {
    return from(this.repository.all()).pipe(
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  getOneItem(id: string): Observable<Item> {
    return from(this.repository.getOne(id)).pipe(
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

  createItem(input: CreateItemDTO): Observable<Item> {
    const newInput: CreateInput = { ...input, id: randomUUID() };
    return from(this.repository.create(newInput)).pipe(
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  deleteItem(id: string): Observable<boolean> {
    return from(this.repository.delete(id)).pipe(
      map(() => true),
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }
}
