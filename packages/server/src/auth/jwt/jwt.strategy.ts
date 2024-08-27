import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  Inject,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from 'src/user/user.repository';
import { UserTypeWithoutID } from '@depot/types/user';
import { UserType } from '@depot/types/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: UserRepository,
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

  async validate(payload: UserTypeWithoutID) {
    try {
      const user = await this.userRepository.getUser(payload.user_id);
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
