import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['auth-token'];

    if (!token) {
      throw new UnauthorizedException({
        code: 'TOKEN_NOT_FOUND',
        message: 'Token not found',
      });
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      if (payload.role !== 'ADMIN' && payload.role !== 'SUPER_ADMIN') {
        throw new ForbiddenException({
          code: 'ACCESS_DENIED',
          message: 'Access denied',
        });
      }

      request.user = payload;
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;

      throw new UnauthorizedException({
        code: 'INVALID_TOKEN',
        message: 'Invalid token',
      });
    }
  }
}
