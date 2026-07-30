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
import { Subject } from 'rxjs';
import { Sessions, Users } from '../../generated/prisma/client';
import { randomBytes } from 'node:crypto';

@Injectable()
export class AuthService {
  private channels = new Map<string, Subject<Users>>();

  private getChannel(slug: string): Subject<Users> {
    if (!this.channels.has(slug)) {
      this.channels.set(slug, new Subject<Users>());
    }
    return this.channels.get(slug)!;
  }

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async generateRefreshToken(userId: string) {
    const token = randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.sessions.create({
      data: { refresh_token: token, user_id: userId, expires_at: expiresAt },
    });

    return token;
  }

  async register(registerDto: RegisterDto) {
    const userExists = await this.prisma.users.findUnique({
      where: { email: registerDto.email },
    });

    if (userExists) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_IN_USE',
        message: 'Email already in use',
      });
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.users.create({
      data: {
        email: registerDto.email,
        name: registerDto.name || 'Unknown',
        password: hashedPassword,
        role: 'ADMIN',
        slug: registerDto.slug,
        business_name: registerDto.business_name,
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
      expiresIn: '15m',
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

    await this.prisma.sessions.delete({
      where: { id: session.id },
    });

    const payload = { sub: user.id, role: user.role };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    const refresh_token = await this.generateRefreshToken(user.id);

    return {
      status: HttpStatus.OK,
      data: { access_token, refresh_token },
    };
  }

  async logout(refreshToken: string) {
    await this.prisma.sessions.delete({
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

    this.getChannel(user.slug!).next(user); // seleccionar tenant para actualizar estado

    return {
      status: HttpStatus.OK,
      data: {
        ok: true,
      },
    };
  }

  getBusinessStatusStream(slug: string) {
    return this.getChannel(slug).asObservable();
  }
}
