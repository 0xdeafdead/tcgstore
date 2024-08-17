import { Entity, Prisma } from '@prisma/client';
import {
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { EntityRepository } from './entity.repository';

@Injectable()
export class EntityService {
  private readonly logger = new Logger('EntityService');
  constructor(private readonly repository: EntityRepository) {}

  getAllEntities(): Observable<Entity[]> {
    return from(this.repository.all()).pipe(
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  getOneEntity(id: string): Observable<Entity> {
    return from(this.repository.getOne({ where: { id } })).pipe(
      switchMap((entity) => {
        if (!entity) {
          throw new NotFoundException(
            'Could not find entity with specified id'
          );
        } else {
          return of(entity);
        }
      }),
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  createEntity(): Observable<Entity> {
    const input: Prisma.EntityCreateInput = {
      id: uuidv4(),
    };
    return from(this.repository.create(input)).pipe(
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  updateEntity(id: string): Observable<Entity> {
    const input: Prisma.EntityUpdateInput = {
      //This is intentional
    };
    return from(this.repository.update({ data: input, where: { id } })).pipe(
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }

  deleteEntity(id: string): Observable<boolean> {
    return from(this.repository.delete({ where: { id } })).pipe(
      map(() => true),
      catchError((err) => {
        this.logger.error(err.message);
        return throwError(() => err);
      })
    );
  }
}
