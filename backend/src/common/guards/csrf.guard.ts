import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

@Injectable()
export class CsrfGuard implements CanActivate {
  private readonly allowedOrigins: string[];

  constructor(private config: ConfigService) {
    this.allowedOrigins = config
      .get<string>('app.corsOrigins')!
      .split(',')
      .map((o) => o.trim());
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    if (SAFE_METHODS.includes(request.method)) {
      return true;
    }

    const origin = request.headers.origin || request.headers.referer;
    if (!origin) return false;

    try {
      const originUrl = new URL(origin);
      return this.allowedOrigins.includes(originUrl.origin);
    } catch {
      return false;
    }
  }
}
