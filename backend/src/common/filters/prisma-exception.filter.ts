import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'PRISMA_ERROR';
    let message = 'An unexpected database error occurred';

    switch (exception.code) {
      case 'P2002': {
        status = HttpStatus.CONFLICT;
        code = 'DUPLICATE_ENTRY';
        const target = (exception.meta?.target as string[]) ?? [];
        message = `Duplicate value for: ${target.join(', ')}`;
        break;
      }
      case 'P2025': {
        status = HttpStatus.NOT_FOUND;
        code = 'RECORD_NOT_FOUND';
        message = (exception.meta?.cause as string) ?? 'Record not found';
        break;
      }
      case 'P2003': {
        status = HttpStatus.BAD_REQUEST;
        code = 'FOREIGN_KEY_CONSTRAINT';
        message = 'Related record does not exist';
        break;
      }
      case 'P2014': {
        status = HttpStatus.CONFLICT;
        code = 'REQUIRED_RELATION';
        message = 'Cannot perform operation due to required relation';
        break;
      }
    }

    response.status(status).json({ status, code, message });
  }
}
