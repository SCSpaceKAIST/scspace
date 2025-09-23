import { Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { IUser, IUserCreate } from '@scspace-depot/types/user';
import { UserSSOType2025 } from '@scspace-depot/types/user/user.sso.type';
import { UserAuthBinaryEnum } from '@scspace-depot/enums/user.enum';
import { UserPublicService } from '../user/user.public.service';
import { OrganizationPublicService } from '../organization/organization.public.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userPublicService: UserPublicService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly organizationPublicService: OrganizationPublicService,
  ) { }

  verifyState(state: number) {
    const v1 = parseInt(this.configService.get<string>("SSO_STATE1"));
    const v2 = parseInt(this.configService.get<string>("SSO_STATE2"));

    if ((state ^ v1) === v2) {
      return true;
    }
    return false;
  }

  async login(state: number, code: string): Promise<string> {
    if (!code) {
      throw new Error('No code provided');
    }
    if (!this.verifyState(state)) {
      throw new Error('Fucking STATE different detected');
    }

    try {
      const clientId = process.env.CLIENT_ID;
      const clientSecret = process.env.CLIENT_SECRET;
      const redirectUri = process.env.REDIRECT_URI;
      const serverApiUrl = process.env.USER_INFO;

      const body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      });

      const response = await fetch(serverApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        body: body.toString(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const result = await response.json();
      const userInfo = result?.userInfo;
      if (!userInfo) {
        throw new Error('No user info in response');
      }

      const payload = this.ssoToUser(userInfo);

      const user = await this.userPublicService.fetchByStudentNumber(
        payload.studentNumber,
      );
      const createdUser = !user ? await this.userPublicService.insert(payload) : user;

      const memberExist = await this.organizationPublicService.fetchMembersById(1);
      if (!memberExist.some(member => member.userId === createdUser.id)) {
        await this.organizationPublicService.insertMember(1, createdUser.id);
      }

      const token = this.jwtService.sign(createdUser, {
        expiresIn: '7d',
        issuer: 'scspace',
        subject: 'userInfo',
      });

      return token;
    } catch (error) {
      Logger.error('Login error:', error);
      throw error;
    }
  }

  async tmp_login(res: any): Promise<void> {
    try {

      const payload = {
        studentNumber: parseInt(process.env.ADMIN_USER_NUMBER),
        nameKr: process.env.ADMIN_NAME_KR,
        nameEn: process.env.ADMIN_NAME_EN,
        email: process.env.ADMIN_EMAIL,
        type: UserAuthBinaryEnum.USER + UserAuthBinaryEnum.MANAGER + UserAuthBinaryEnum.ADMIN,
      };
      Logger.log('PAYLOAD ' + JSON.stringify(payload));
      const user = await this.userPublicService.fetchByStudentNumber(
        payload.studentNumber,
      );

      const createdUser = !user ? await this.userPublicService.insert(payload) : user;
      Logger.log('CREATED USER ' + JSON.stringify(user));
      const token = this.jwtService.sign(createdUser, {
        expiresIn: '7d',
        issuer: 'scspace',
        subject: 'userInfo',
      });
      Logger.log('TOKEN ' + token);

      res.cookie('scspacetoken', Buffer.from(token).toString('base64'), {
        maxAge: 60 * 60 * 1000 * 24 * 7,
        secure: true,
        sameSite: 'none',
        httpOnly: true,
        path: '/',
      });

      res.redirect(
        this.configService.get<string>('NEXT_PUBLIC_APP_URL') + '/',
      );

    } catch (error) {
      console.error('API 통신 오류:', error);
      res.status(500).send("Internal Server Error");
    };
  }

  async verify(cookies: any): Promise<IUser | null> {
    const cookie = cookies.scspacetoken;
    if (!cookie) {
      return null;
    }

    try {
      const token = Buffer.from(cookie, 'base64').toString('utf8');
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        // 토큰이 만료된 경우 쿠키는 컨트롤러에서 처리
        return null;
      }
      return null;
    }
  }

  private ssoToUser = (ssoPayload: UserSSOType2025): IUserCreate => {
    // 첫 가입시 DB에 넣기 좋게 변경하는 함수
    return {
      nameKr: ssoPayload.user_nm,
      nameEn: ssoPayload.user_eng_nm,
      email: ssoPayload.email,
      type: UserAuthBinaryEnum.USER,
      studentNumber: parseInt(ssoPayload.std_no)
        ? parseInt(ssoPayload.std_no)
        : (parseInt(ssoPayload.emp_no) ?? 1),
    };
  };
}