import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUserCreate } from '@scspace-depot/types/user';
import { UserPublicService } from 'src/feature/user/user.public.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userPublicService: UserPublicService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get('JWT_KEY'), //for example. use ENV
      ignoreExpiration: false,
    });
  }

  async validate(payload: IUserCreate) {
    try {
      const user = await this.userPublicService.fetchByStudentNumber(
        payload.studentNumber,
      );

      if (user) {
        return user;
      } else {
        Logger.log('NO USER');
        throw new UnauthorizedException('No User');
      }
    } catch (e) {}
  }
  private static extractJWT(req): string | null {
    if (req.cookies && 'scspacetoken1' in req.cookies) {
      return req.cookies.scspacetoken1;
    }
    return null;
  }
}
