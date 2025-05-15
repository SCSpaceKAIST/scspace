import { Inject, Injectable } from '@nestjs/common';
import { schema } from './db/schema';
import { SemesterPublicService } from './feature/semester/semester.public.service';
import { SpacePublicService } from './feature/space/space.public.service';
import { UserPublicService } from './feature/user/user.public.service';
import { DBAsyncProvider } from './db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { UserTypeEnum } from '@scspace-depot/enums/user.enum';
import { IUserCreate } from '@scspace-depot/types/user';
import { ISpace } from '@scspace-depot/types/space';
@Injectable()
export class AppService {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
    private readonly userPublicService: UserPublicService,
    private readonly semesterPublicService: SemesterPublicService,
    private readonly spacePublicService: SpacePublicService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async fillContent(): Promise<boolean> {
    const spaceCount = await this.spacePublicService.getSpaceCount();
    const userCount = await this.userPublicService.getUserCount();

    if (spaceCount + userCount !== 0) {
      return false;
    }


    const spaces: Omit<ISpace, 'id'>[] = [
      {
        nameKr: '개인연습실 1',
        nameEn: 'Individual Practice Room 1',
      },
      {
        nameKr: '개인연습실 2',
        nameEn: 'Individual Practice Room 2',
      },
      {
        nameKr: '개인연습실 3',
        nameEn: 'Individual Practice Room 3',
      },
      {
        nameKr: '피아노실 1',
        nameEn: 'Piano Room 1',
      },
      {
        nameKr: '피아노실 2',
        nameEn: 'Piano Room 2',
      },
      {
        nameKr: '세미나실 1',
        nameEn: 'Seminar Room 1',
      },
      {
        nameKr: '세미나실 2',
        nameEn: 'Seminar Room 2',
      },
      {
        nameKr: '무예실',
        nameEn: 'Dance Studio',
      },
      {
        nameKr: '합주실',
        nameEn: 'Group Practice Room',
      },
      {
        nameKr: '미래홀',
        nameEn: 'Mirae Hall',
      },
      {
        nameKr: '조수미홀',
        nameEn: 'Sumi Jo Hall',
      },
      {
        nameKr: '창작공방',
        nameEn: 'Workshop',
      },
      {
        nameKr: '옥상',
        nameEn: 'Rooftop',
      },
      {
        nameKr: '커뮤니티 마당',
        nameEn: 'Community Yard',
      },
      {
        nameKr: '전시계단',
        nameEn: 'Exhibition Stairs',
      },
      {
        nameKr: '모임터',
        nameEn: 'Meeting Space',
      },
      {
        nameKr: '로비',
        nameEn: 'Lobby',
      },
    ];

    const users: IUserCreate[] = [
      {
        nameKr: process.env.ADMIN_NAME_KR,
        nameEn: process.env.ADMIN_NAME_EN,
        studentNumber: parseInt(process.env.ADMIN_USER_NUMBER),
        email: process.env.ADMIN_EMAIL,
        type: UserTypeEnum.ADMIN,
      },
    ];

    await this.db.transaction(async (tx) => {
      await tx.insert(schema.User).values(users);
      await tx.insert(schema.Space).values(spaces);
    });

    return true;
  }
}
