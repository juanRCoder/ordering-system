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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, name, password } = registerDto;

    const userExists = await this.prisma.users.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_IN_USE',
        message: 'Email already in use',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.users.create({
      data: {
        email,
        name: name || 'Unknown',
        password: hashedPassword,
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
        message: 'User not found',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        code: 'INVALID_PASSWORD',
        message: 'Invalid password',
      });
    }

    const payload = { sub: user.id, role: user.role };

    return {
      status: HttpStatus.OK,
      data: {
        sub: user.id,
        name: user.name,
        access_token: await this.jwtService.signAsync(payload),
      },
    };
  }

  async createAdmin(registerDto: RegisterDto) {
    const { email, name, password } = registerDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.users.create({
      data: {
        email,
        name: name || 'Unknown',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    const payload = { sub: user.id, role: user.role };

    return {
      status: HttpStatus.CREATED,
      data: {
        sub: user.id,
        name: user.name,
        access_token: await this.jwtService.signAsync(payload),
      },
    };
  }
}
