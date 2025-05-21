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
import { JwtAuthGuard } from './jwt/jwt-guard';
import { IVerificationResponse } from '@scspace-depot/types/auth/auth.type';
import { ConfigService } from '@nestjs/config';
import { IUserCreate } from '@scspace-depot/types/user';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('login')
  async loginGet(
    @Res() res: Response,
  ): Promise<void> {
    Logger.log('login page');
    await this.authService.tmp_login(res);
  }

  @Get('verification')
  async verification(@Req() req: Request, @Res() res: Response): Promise<void> {
    // console.log('verification', req.cookies);
    const verifyRes = await this.authService.verification(req.cookies, res);
    const response: IVerificationResponse = {
      isLogined: verifyRes !== null,
      userInfo: verifyRes,
    };
    // console.log('verification res', verifyRes);
    // console.log('verification return value', response);
    res
      .status(200)
      .header('Content-Type', 'application/json') // 🔥 명시적으로 설정
      .json({ isLogined: !!verifyRes, userInfo: verifyRes });
  }

  @Post('login')
  async login(
    @Body('state') state: string,
    @Body('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    // Logger.log('login', { state, code });
    await this.authService.login(state, code, res);
    // Logger.log('login res:', loginRes);
    res.redirect(this.configService.get<string>('NEXT_PUBLIC_APP_URL'));
  }

  @Post('logout')
  async logout(@Res() res: Response): Promise<void> {
    console.log('logout');
    res.clearCookie('scspacetoken1', { path: '/' });

    return res.redirect(this.configService.get<string>('NEXT_PUBLIC_APP_URL'));
  }
}
