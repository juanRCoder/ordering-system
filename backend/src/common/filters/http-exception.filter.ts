import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const error = exception.getResponse() as {
        code?: string;
        message: string | string[];
      };

      response.status(status).json({
        status,
        code: error.code || 'ERROR',
        message: error.message || exception.message,
      });
      return;
    }

    if (exception instanceof Error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        code: 'INTERNAL_ERROR',
        message:
          process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : exception.message,
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    });
  }
}
