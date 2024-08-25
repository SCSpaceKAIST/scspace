import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRequestDto } from './dto/login.request.dto';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/user/user.repository';
import { Logger } from '@nestjs/common';
interface UserInfo {
  ku_std_no: string | null;
  kaist_uid: string;
  mail: string;
  ku_employee_number: string | null;
  displayname: string;
  mobile: string;
  ku_kname: string;
}

// TypeScript 타입 정의
export interface UserTypeWithoutID {
  user_id: string;
  name: string;
  email: string;
  type: 'user' | 'manager' | 'admin' | 'chief'; // type은 지정된 문자열 중 하나
}

const FRONT_BASE_URL = 'https://localhost';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
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

      const payload = this.ssoToUser(data);
      Logger.log('PAYLOAD');
      const user = await this.userRepository.getUser(payload.user_id);
      Logger.log(user);
      if (user === null) {
        Logger.log('ADD TO DB');
        await this.userRepository.addUser(payload);
      }

      const token = this.jwtService.sign(payload, {
        expiresIn: '7d',
        issuer: 'scspace',
        subject: 'userInfo',
      });

      res.cookie('scspacetoken1', token, {
        maxAge: 60 * 60 * 1000 * 24 * 7,
        secure: true,
        sameSite: 'none',
        httpOnly: true,
        path: '/',
      });

      res.redirect(FRONT_BASE_URL + '/loginTest');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  verification(cookies: any, res): void {
    // Deprecated
    const cookie = cookies.scspacetoken1;
    if (!cookie) {
      res.send(false);
      return;
    }

    try {
      //const token = Buffer.from(cookie, 'base64').toString('utf8');
      const token = cookie;
      const decoded = this.jwtService.verify(token);
      Logger.log(decoded);
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

    // interface USERINFO {
    //   // decrypted 후의 결과
    //   dataMap: {
    //     USER_INFO: UserInfo;
    //   };
    // }
  };

  private ssoToUser = (ssoPayload: UserInfo): UserTypeWithoutID => {
    // 첫 가입시 DB에 넣기 좋게 변경하는 함수

    return {
      user_id: ssoPayload.ku_std_no
        ? ssoPayload.ku_std_no
        : ssoPayload.ku_employee_number,
      name: ssoPayload.ku_kname ? ssoPayload.ku_kname : ssoPayload.displayname,
      email: ssoPayload.mail,
      type: 'user',
    };
  };
}
