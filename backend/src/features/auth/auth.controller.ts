import {
  Body,
  Controller,
  MessageEvent,
  Param,
  Patch,
  Post,
  Res,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AdminGuard } from './auth.guard';
import { CurrentAdmin } from '../../common/decorators/current-admin.decorator';
import { map, Observable } from 'rxjs';
import { RefreshTokenGuard } from './refreshToken.guard';
import { CurrentSession } from '../../common/decorators/current-session.decorator';
import { Sessions } from '../../generated/prisma/client';
import { cookieOptions } from './auth.constants';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService
  ) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.login(loginDto);
    const isProduction = this.config.get('app.nodeEnv') === 'production';
    const cookies = cookieOptions(isProduction);

    res.cookie('auth-token', result.data.access_token, cookies.access);
    res.cookie('refresh-token', result.data.refresh_token, cookies.refresh);

    return result;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(
    @CurrentSession() session: Sessions,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.refresh(session);
    const isProduction = this.config.get('app.nodeEnv') === 'production';
    const cookies = cookieOptions(isProduction);

    res.cookie('auth-token', result.data.access_token, cookies.access);
    res.cookie('refresh-token', result.data.refresh_token, cookies.refresh);

    return result;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  async logout(
    @CurrentSession() session: Sessions,
    @Res({ passthrough: true }) res: Response
  ) {
    if (session.refresh_token) {
      await this.authService.logout(session.refresh_token);
    }

    const isProduction = this.config.get('app.nodeEnv') === 'production';
    const cookies = cookieOptions(isProduction);

    res.clearCookie('auth-token', cookies.clear);
    res.clearCookie('refresh-token', cookies.clear);

    return {
      status: 200,
      data: {
        ok: true,
      },
    };
  }

  @UseGuards(AdminGuard)
  @Patch('is-business-open')
  updateIsBusinessOpen(
    @CurrentAdmin() admin: { sub: string },
    @Body('is_business_open') is_business_open: boolean
  ) {
    return this.authService.updateIsBusinessOpen(admin.sub, is_business_open);
  }

  @Sse('stream/:slug')
  streamBusinessStatus(@Param('slug') slug: string): Observable<MessageEvent> {
    return this.authService.getBusinessStatusStream(slug).pipe(
      map((user) => ({
        data: { is_business_open: user.is_business_open },
      }))
    );
  }
}
