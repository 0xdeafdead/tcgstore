import { HttpException, InternalServerErrorException } from '@nestjs/common';

export function errorHandler(
  error: Error,
  defaultMessage: string
): HttpException {
  if (error instanceof HttpException) {
    return error;
  }
  return new InternalServerErrorException(defaultMessage);
}
