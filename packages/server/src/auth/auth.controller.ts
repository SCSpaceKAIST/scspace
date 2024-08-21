import { Controller, Get, Body, Post, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('result') result: string,
    @Body('state') state: string,
    @Res() res: Response,
  ): Promise<void> {
    return this.authService.login(result, state, res);
  }

  @Post('verification')
  verification(@Req() req: Request, @Res() res: Response): void {
    const cookie = req.cookies;
    return this.authService.verification(cookie, res);
  }

  @Post('logout')
  logout(@Res() res: Response): void {
    return this.authService.logout(res);
  }
}
