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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('result') result: string,
    @Body('state') state: string,
    @Res() res: Response,
  ): Promise<void> {
    console.log('login', { result, state });
    const loginRes = await this.authService.login(result, state, res);
    console.log('login res', loginRes);
    return loginRes;
  }

  @Get('verification')
  async verification(@Req() req: Request, @Res() res: Response): Promise<void> {
    console.log('verification', req.cookies);
    const verifyRes = await this.authService.verification(req.cookies, res);
    const response: IVerificationResponse = {
      isLogined: verifyRes !== null,
      userInfo: verifyRes,
    };
    console.log('verification res', verifyRes);
    console.log('verification return value', response);
    res
      .status(200)
      .header('Content-Type', 'application/json') // 🔥 명시적으로 설정
      .json({ isLogined: !!verifyRes, userInfo: verifyRes });
  }

  @Post('logout')
  async logout(@Res() res: Response): Promise<void> {
    console.log('logout');
    const logoutRes = this.authService.logout(res);
    console.log('logout res', logoutRes);
    return logoutRes;
  }

  @UseGuards(JwtAuthGuard)
  @Get('idJwt')
  getUserIdWithJWT(@Req() req) {
    Logger.log(req.user);

    return 1;
    //return this.userService.getUserNameWithToken();
  }
}
