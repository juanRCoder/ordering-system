import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const error = exception.getResponse() as {
      code: string;
      message: string;
    };

    response.status(status).json({
      status,
      code: error.code || 'ERROR',
      message: error.message || exception.message,
    });
  }
}
