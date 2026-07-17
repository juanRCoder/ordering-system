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
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AdminGuard } from './auth.guard';
import appConfig from '../../config/app.config';
import { CurrentAdmin } from '../../common/decorators/current-admin.decorator';
import { map, Observable } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const configService = appConfig();

    const result = await this.authService.login(loginDto);
    const isProduction = configService.nodeEnv === 'production';

    res.cookie('auth-token', result.data.access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return result;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    const configService = appConfig();
    const isProduction = configService.nodeEnv === 'production';

    res.clearCookie('auth-token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
    });

    return {
      status: 200,
      data: {
        ok: true,
      },
    };
  }

  @UseGuards(AdminGuard)
  @Post('create-admin')
  createAdmin(@Body() registerDto: RegisterDto) {
    return this.authService.createAdmin(registerDto);
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
