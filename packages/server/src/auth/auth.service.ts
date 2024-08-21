import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRequestDto } from './dto/login.request.dto';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

interface UserInfo {
  ku_std_no: string | null;
  kaist_uid: string;
  mail: string;
  ku_employee_number: string | null;
  displayname: string;
  mobile: string;
  ku_kname: string;
}

const FRONT_BASE_URL = 'https://localhost';
@Injectable()
export class AuthService {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(result: string, state: string, res): Promise<void> {
    const secretKey = this.configService.get<string>('SECRETKEY') + state;
    const keySpec = Buffer.from(secretKey.substring(80, 96), 'utf8');
    const iv = Buffer.from(secretKey.substring(80, 96), 'utf8');
    const userInfo: UserInfo = this.decrypt(result, keySpec, iv);

    try {
      const data = userInfo;
      console.log(data);
      const payload = { ...data };
      const token = this.jwtService.sign(payload, {
        expiresIn: '5d',
        issuer: 'scspace',
        subject: 'userInfo',
      });

      res.cookie('scspacetoken1', Buffer.from(token).toString('base64'), {
        maxAge: 60 * 60 * 1000,
        secure: true,
        sameSite: 'none',
        httpOnly: true,
        path: '/',
      });

      res.redirect(FRONT_BASE_URL);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  verification(cookies: any, res): void {
    const cookie = cookies.scspacetoken1;
    if (!cookie) {
      res.send(false);
      return;
    }

    try {
      const token = Buffer.from(cookie, 'base64').toString('utf8');
      const decoded = this.jwtService.verify(token);
      console.log(decoded);
      res.send(decoded);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        res.clearCookie('scspacetoken1', { path: '/' });
      }
      res.send(false);
    }
  }

  logout(res): void {
    res.clearCookie('scspacetoken1', { path: '/' });
    res.redirect(FRONT_BASE_URL);
  }

  private decrypt = (
    encrypted: string,
    keySpec: Buffer,
    iv: Buffer,
  ): UserInfo => {
    const decipher = crypto.createDecipheriv('aes-128-cbc', keySpec, iv);
    const encryptedBuffer = Buffer.from(encrypted, 'base64');
    const decrypted = Buffer.concat([
      decipher.update(encryptedBuffer),
      decipher.final(),
    ]).toString();

    return JSON.parse(decrypted).dataMap.USER_INFO;

    interface USERINFO {
      // decrypted 후의 결과
      dataMap: {
        USER_INFO: UserInfo;
      };
    }
  };
}
