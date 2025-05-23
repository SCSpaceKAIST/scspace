import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUserCreate } from '@scspace-depot/types/user';
import { UserPublicService } from 'src/feature/user/user.public.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly userPublicService: UserPublicService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get('JWT_KEY'),
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
        throw new UnauthorizedException('No User');
      }
    } catch (e) {
      this.logger.error(`Error validating JWT: ${e}`);
      throw e;
    }
  }

  private static extractJWT(req): string | null {
    if (req.cookies && 'scspacetoken' in req.cookies) {
      const encodedToken = req.cookies.scspacetoken;
      try {
        // Try to decode the base64 token
        const token = Buffer.from(encodedToken, 'base64').toString('utf8');
        return token;
      } catch (e) {
        Logger.error(`Failed to decode base64 token: ${e}`);
        // If decoding fails, return the original token
        return encodedToken;
      }
    }
    return null;
  }
}
