import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['refresh-token'];

    if (!token) {
      throw new UnauthorizedException({
        code: 'REFRESH_TOKEN_NOT_FOUND',
        message: 'Refresh token not found',
      });
    }

    const session = await this.prisma.sessions.findUnique({
      where: { refresh_token: token },
    });

    if (!session || session.expires_at < new Date()) {
      throw new UnauthorizedException({
        code: 'INVALID_REFRESH_TOKEN',
        message: 'Refresh token inválido o expirado',
      });
    }

    request.session = session;
    return true;
  }
}
