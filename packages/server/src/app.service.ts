import { Inject, Injectable } from '@nestjs/common';
import { schema } from './db/schema';
import { SpacePublicService } from './feature/space/space.public.service';
import { UserPublicService } from './feature/user/user.public.service';
import { DBAsyncProvider } from './db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { UserTypeEnum } from '@scspace-depot/enums/user.enum';
import { IUserCreate } from '@scspace-depot/types/user';
import { ISpace } from '@scspace-depot/types/space';
import { SpaceTypeEnum } from '@scspace-depot/enums/space.enum';
@Injectable()
export class AppService {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
    private readonly userPublicService: UserPublicService,
    private readonly spacePublicService: SpacePublicService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async fillContent(): Promise<boolean> {
    const spaceCount = await this.spacePublicService.count();
    const userCount = await this.userPublicService.getUserCount();

    if (spaceCount + userCount !== 0) {
      return false;
    }


    const spaces: Omit<ISpace, 'id'>[] = [
      {
        nameKr: '개인연습실 1',
        nameEn: 'Individual Practice Room 1',
        spaceType: SpaceTypeEnum.INDIVIDUAL,
      },
      {
        nameKr: '개인연습실 2',
        nameEn: 'Individual Practice Room 2',
        spaceType: SpaceTypeEnum.INDIVIDUAL,
      },
      {
        nameKr: '개인연습실 3',
        nameEn: 'Individual Practice Room 3',
        spaceType: SpaceTypeEnum.INDIVIDUAL,
      },
      {
        nameKr: '피아노실 1',
        nameEn: 'Piano Room 1',
        spaceType: SpaceTypeEnum.PIANO,
      },
      {
        nameKr: '피아노실 2',
        nameEn: 'Piano Room 2',
        spaceType: SpaceTypeEnum.PIANO,
      },
      {
        nameKr: '세미나실 1',
        nameEn: 'Seminar Room 1',
        spaceType: SpaceTypeEnum.SEMINAR,
      },
      {
        nameKr: '세미나실 2',
        nameEn: 'Seminar Room 2',
        spaceType: SpaceTypeEnum.SEMINAR,
      },
      {
        nameKr: '무예실',
        nameEn: 'Dance Studio',
        spaceType: SpaceTypeEnum.DANCE,
      },
      {
        nameKr: '합주실',
        nameEn: 'Group Practice Room',
        spaceType: SpaceTypeEnum.GROUP,
      },
      {
        nameKr: '미래홀',
        nameEn: 'Mirae Hall',
        spaceType: SpaceTypeEnum.MIRAE,
      },
      {
        nameKr: '조수미홀',
        nameEn: 'Sumi Jo Hall',
        spaceType: SpaceTypeEnum.SUMI,
      },
      {
        nameKr: '창작공방',
        nameEn: 'Workshop',
        spaceType: SpaceTypeEnum.WORK,
      },
      {
        nameKr: '옥상',
        nameEn: 'Rooftop',
        spaceType: SpaceTypeEnum.OPEN,
      },
      {
        nameKr: '커뮤니티 마당',
        nameEn: 'Community Yard',
        spaceType: SpaceTypeEnum.OPEN,
      },
      {
        nameKr: '전시계단',
        nameEn: 'Exhibition Stairs',
        spaceType: SpaceTypeEnum.OPEN,
      },
      {
        nameKr: '모임터',
        nameEn: 'Meeting Space',
        spaceType: SpaceTypeEnum.OPEN,
      },
      {
        nameKr: '로비',
        nameEn: 'Lobby',
        spaceType: SpaceTypeEnum.OPEN,
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
