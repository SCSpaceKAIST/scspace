import { Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { IUser, IUserCreate } from '@scspace-depot/types/user';
import { UserSSOType2022 } from '@scspace-depot/types/user/user.sso.type';
import { UserTypeEnum } from '@scspace-depot/enums/user.enum';
import { Response } from 'express';
import { UserPublicService } from '../user/user.public.service';
import { MUser } from '../user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userPublicService: UserPublicService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(result: string, state: string, res): Promise<void> {
    const secretKey = this.configService.get<string>('SECRETKEY') + state;
    const keySpec = Buffer.from(secretKey.substring(80, 96), 'utf8');
    const iv = Buffer.from(secretKey.substring(80, 96), 'utf8');
    const userInfo: UserSSOType2022 = this.decrypt(result, keySpec, iv);

    try {
      const data = userInfo;

      const payload = this.ssoToUser(data);
      Logger.log('PAYLOAD');
      Logger.log(JSON.stringify(payload));
      const user = await this.userPublicService.findUserByKaistUid(
        payload.kaistUID,
      );
      Logger.log('USER');
      Logger.log(JSON.stringify(user));

      const createdUser = this.muserToUser(
        !user ? await this.userPublicService.insertUser(payload) : user,
      );
      Logger.log('CREATED USER');
      Logger.log(JSON.stringify(createdUser));
      const token = this.jwtService.sign(createdUser, {
        expiresIn: '7d',
        issuer: 'scspace',
        subject: 'userInfo',
      });
      Logger.log('TOKEN');
      Logger.log(token);

      res.cookie('scspacetoken1', token, {
        maxAge: 60 * 60 * 1000 * 24 * 7,
        secure: true,
        sameSite: 'none',
        httpOnly: true,
        path: '/',
      });

      res.redirect(this.configService.get<string>('NEXT_PUBLIC_APP_URL') + '/');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  async verification(cookies: any, res: Response): Promise<IUser | null> {
    // Deprecated
    const cookie = cookies.scspacetoken1;
    if (!cookie) {
      return null;
    }

    try {
      //const token = Buffer.from(cookie, 'base64').toString('utf8');
      const token = cookie;
      const decoded = this.jwtService.verify(token);
      Logger.log(decoded);
      return decoded;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        res.clearCookie('scspacetoken1', { path: '/' });
      }
      return null;
    }
  }

  logout(res): void {
    res.clearCookie('scspacetoken1', { path: '/' });
    res.redirect(this.configService.get<string>('NEXT_PUBLIC_APP_URL'));
  }

  private decrypt = (
    encrypted: string,
    keySpec: Buffer,
    iv: Buffer,
  ): UserSSOType2022 => {
    const decipher = crypto.createDecipheriv('aes-128-cbc', keySpec, iv);
    const encryptedBuffer = Buffer.from(encrypted, 'base64');
    const decrypted = Buffer.concat([
      decipher.update(encryptedBuffer),
      decipher.final(),
    ]).toString();

    return JSON.parse(decrypted).dataMap.USER_INFO;
  };

  private ssoToUser = (ssoPayload: UserSSOType2022): IUserCreate => {
    // 첫 가입시 DB에 넣기 좋게 변경하는 함수
    return {
      kaistUID: ssoPayload.kaist_uid,
      nameKr: ssoPayload.ku_kname,
      nameEn: ssoPayload.displayname,
      email: ssoPayload.mail,
      type: UserTypeEnum.USER,
      userNumber: ssoPayload.ku_std_no
        ? ssoPayload.ku_std_no
        : (ssoPayload.ku_employee_number ?? '1'),
    };
  };

  private muserToUser = (muser: MUser): IUser => {
    // JS class 는 plain object 가 아님.
    // token 에 넣기 위해선 js plain object 로 변환해야 함.
    // 이를 해결하기 위해서 변환해주는 함수
    // userPublic 에 넣어야 할수도?
    return {
      id: muser.id,
      kaistUID: muser.kaistUID,
      nameKr: muser.nameKr,
      nameEn: muser.nameEn,
      userNumber: muser.userNumber,
      email: muser.email,
      type: muser.type,
    };
  };
}
