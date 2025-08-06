import {
  Controller,
  Get,
  Body,
  Post,
  Res,
  Req,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) { }

  // @Get('login')
  // async loginGet(
  //   @Res() res: Response,
  // ): Promise<void> {
  //   Logger.log('login page');
  //   await this.authService.tmp_login(res);
  // }

  @Get('verify')
  async verify(@Req() req: Request, @Res() res: Response): Promise<void> {
    const verifyRes = await this.authService.verify(req.cookies);

    // 토큰이 만료되었거나 유효하지 않은 경우 쿠키 제거
    if (!verifyRes) {
      res.clearCookie('scspacetoken', { path: '/' });
    }

    res.json({
      isLogined: !!verifyRes,
      userInfo: verifyRes,
    });
  }

  @Post('login')
  async login(
    @Body('state') state: number,
    @Body('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const token = await this.authService.login(state, code);

      // 쿠키 설정
      const cookieOptions = {
        maxAge: 60 * 60 * 1000 * 24 * 7, // 7 days
        secure: true,
        sameSite: 'none' as const,
        httpOnly: true,
        path: '/',
      };

      res.cookie('scspacetoken', Buffer.from(token).toString('base64'), cookieOptions);
      res.redirect(this.configService.get<string>('NEXT_PUBLIC_APP_URL'));
    } catch (error) {
      Logger.error('Login failed:', error);
      res.redirect('/login?error=auth_failed');
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get('logout')
  async logout(@Res() res: Response): Promise<void> {
    res.clearCookie('scspacetoken', {
      path: '/',
      secure: true,
      sameSite: 'none',
      httpOnly: true
    });

    res.redirect(this.configService.get<string>('NEXT_PUBLIC_APP_URL'));
  }
}
