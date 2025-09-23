import { Inject, Injectable, Logger } from '@nestjs/common';
import { schema } from './db/schema';
import { SpacePublicService } from './feature/space/space.public.service';
import { UserPublicService } from './feature/user/user.public.service';
import { DBAsyncProvider } from './db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { UserAuthBinaryEnum } from '@scspace-depot/enums/user.enum';
import { IUserCreate } from '@scspace-depot/types/user';
import { ISpace } from '@scspace-depot/types/space';
import { SpaceTypeEnum } from '@scspace-depot/enums/space.enum';
import { IOrganization, IOrganizationCreate } from '@scspace-depot/types/organization';
import { OrganizationPublicService } from './feature/organization/organization.public.service';
import { getNow } from '@scspace-server/common/utils';
import { ReservationPublicService } from './feature/reservation/reservation.public.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppService {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
    private readonly userPublicService: UserPublicService,
    private readonly spacePublicService: SpacePublicService,
    private readonly organizationPublicService: OrganizationPublicService,
    private readonly reservationPublicService: ReservationPublicService,
  ) { }

  getHello(): string {
    return 'Welcome to SCSpace Backend!';
  }

  async fillContent(): Promise<void> {
    const spaceCount = await this.spacePublicService.count();
    const userCount = await this.userPublicService.count();
    const organizationCount = await this.organizationPublicService.count();

    if (spaceCount == 0) {
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
          nameKr: '오픈스페이스',
          nameEn: 'Open Space',
          spaceType: SpaceTypeEnum.OPEN,
        },
        {
          nameKr: '전시계단',
          nameEn: 'Exhibition Stairs',
          spaceType: SpaceTypeEnum.OPEN,
        },
        {
          nameKr: '1층 로비',
          nameEn: '1st Floor Lobby',
          spaceType: SpaceTypeEnum.OPEN,
        },
        {
          nameKr: '2층 로비',
          nameEn: '2nd Floor Lobby',
          spaceType: SpaceTypeEnum.OPEN,
        },
      ];

      await this.db.transaction(async (tx) => {
        await tx.insert(schema.Space).values(spaces);
      });
    }


    if (userCount == 0) {
      const users: IUserCreate[] = [
        {
          nameKr: process.env.ADMIN_NAME_KR,
          nameEn: process.env.ADMIN_NAME_EN,
          studentNumber: parseInt(process.env.ADMIN_USER_NUMBER),
          email: process.env.ADMIN_EMAIL,
          type: UserAuthBinaryEnum.USER + UserAuthBinaryEnum.MANAGER + UserAuthBinaryEnum.ADMIN,
        },
      ];

      await this.db.transaction(async (tx) => {
        await tx.insert(schema.User).values(users);
      });
    }

    if (organizationCount == 0) {
      const organizations: IOrganization = {
        id: 1,
        name: 'individual',
        status: 1,
        hasRoom: false,
        delegatorId: 1,
        timeRegister: getNow(),
        timeUpdate: getNow(),
      }

      await this.db.transaction(async (tx) => {
        await tx.insert(schema.Organization).values(organizations);
      });

      await this.organizationPublicService.insertMember(1, 1);
    }
  }

  @Cron(CronExpression.EVERY_WEEK, { name: 'backupReservations' })
  async save(): Promise<string> {
    const filename = await this.reservationPublicService.backupReservations();
    Logger.log(filename);
    return filename;
  }
}