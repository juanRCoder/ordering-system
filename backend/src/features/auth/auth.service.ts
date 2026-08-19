import {
  ConflictException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Sessions, Users } from '../../generated/prisma/client';
import { randomBytes } from 'node:crypto';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN_MS,
} from './auth.constants';
import { SseBroadcaster } from '../../common/sse-broadcaster';

@Injectable()
export class AuthService {
  private storeStatusChannel = new SseBroadcaster<Users>();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async generateRefreshToken(userId: string) {
    const token = randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_MS);

    await this.prisma.sessions.create({
      data: { refresh_token: token, user_id: userId, expires_at: expiresAt },
    });

    return token;
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_IN_USE',
        message: 'Email already in use',
      });
    }

    const existingSlug = await this.prisma.users.findUnique({
      where: { slug: registerDto.slug },
    });

    if (existingSlug) {
      throw new ConflictException({
        code: 'SLUG_ALREADY_IN_USE',
        message: 'Slug already in use',
      });
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.users.create({
      data: {
        email: registerDto.email,
        name: registerDto.name,
        password: hashedPassword,
        role: 'ADMIN',
        slug: registerDto.slug,
        business_name: registerDto.business_name,
        phone: registerDto.phone,
      },
    });

    return {
      status: HttpStatus.CREATED,
      data: { sub: user.id, name: user.name },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException({
        code: 'USER_NOT_FOUND',
        message: 'Invalid credentials',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        code: 'INVALID_PASSWORD',
        message: 'Invalid credentials',
      });
    }

    const payload = { sub: user.id, role: user.role };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    const refresh_token = await this.generateRefreshToken(user.id);

    return {
      status: HttpStatus.OK,
      data: {
        name: user.name,
        role: user.role,
        business_name: user.business_name,
        slug: user.slug,
        is_business_open: user.is_business_open,
        phone: user.phone,
        access_token,
        refresh_token,
      },
    };
  }

  async refresh(session: Sessions) {
    const user = await this.prisma.users.findUnique({
      where: { id: session.user_id },
    });
    if (!user) {
      throw new UnauthorizedException({
        code: 'USER_NOT_FOUND',
        message: 'Usuario no encontrado',
      });
    }

    const payload = { sub: user.id, role: user.role };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    const refresh_token = await this.prisma.$transaction(async (tx) => {
      await tx.sessions.delete({ where: { id: session.id } });
      const token = randomBytes(40).toString('hex');
      const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_MS);
      await tx.sessions.create({
        data: { refresh_token: token, user_id: user.id, expires_at: expiresAt },
      });
      return token;
    });

    return {
      status: HttpStatus.OK,
      data: { access_token, refresh_token },
    };
  }

  async logout(refreshToken: string) {
    await this.prisma.sessions.deleteMany({
      where: { refresh_token: refreshToken },
    });
  }

  async updateIsBusinessOpen(adminId: string, is_business_open: boolean) {
    const user = await this.prisma.users.update({
      where: { id: adminId },
      data: {
        is_business_open,
      },
    });

    this.storeStatusChannel.next(user.slug!, user);

    return {
      status: HttpStatus.OK,
      data: {
        ok: true,
      },
    };
  }

  getBusinessStatusStream(slug: string) {
    return this.storeStatusChannel.stream(slug);
  }
}
