import {
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function errorHandler(
  logger: Logger,
  error: Error,
  defaultMessage: string
): HttpException {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientInitializationError
  ) {
    logger.error(`ErrorCode ${error['code'] ?? 'No Error Code'}`);
    logger.error(error.message.replace(/(\r\n|\n|\r)/gm, ''));
    return new InternalServerErrorException(defaultMessage);
  }

  if (error instanceof HttpException) {
    return error;
  }

  logger.error(error);
  return new InternalServerErrorException(defaultMessage);
}
