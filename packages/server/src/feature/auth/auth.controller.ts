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

  @UseGuards(JwtAuthGuard)
  @Get('idJwt')
  getUserIdWithJWT(@Req() req) {
    Logger.log(req.user);

    return 1;
    return this.userService.getUserNameWithToken();
  }
}
