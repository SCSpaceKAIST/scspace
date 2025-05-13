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
import { SpaceTypeEnum } from '@scspace-depot/enums/space.enum';
import { SemesterSeasonEnum } from '@scspace-depot/enums/semester.enum';
import { ISemester } from '@scspace-depot/types/semester';
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
    const semesterCount = await this.semesterPublicService.getSemesterCount();
    const spaceCount = await this.spacePublicService.getSpaceCount();
    const userCount = await this.userPublicService.getUserCount();
    console.log(semesterCount, spaceCount);

    if (semesterCount + spaceCount + userCount !== 0) {
      return false;
    }


    const semesters: Omit<ISemester, 'id'>[] = [
      {
        year: 2023,
        season: SemesterSeasonEnum.SPRING,
        dateFrom: new Date('2023-02-27'),
        dateTo: new Date('2023-08-27'),
      },
      {
        year: 2023,
        season: SemesterSeasonEnum.FALL,
        dateFrom: new Date('2023-08-28'),
        dateTo: new Date('2024-02-25'),
      },
      {
        year: 2024,
        season: SemesterSeasonEnum.SPRING,
        dateFrom: new Date('2024-02-26'),
        dateTo: new Date('2024-09-01'),
      },
      {
        year: 2024,
        season: SemesterSeasonEnum.FALL,
        dateFrom: new Date('2024-09-02'),
        dateTo: new Date('2024-12-27'),
      },
      {
        year: 2025,
        season: SemesterSeasonEnum.SPRING,
        dateFrom: new Date('2025-02-24'),
        dateTo: new Date('2025-08-31'),
      },
      {
        year: 2025,
        season: SemesterSeasonEnum.FALL,
        dateFrom: new Date('2025-09-01'),
        dateTo: new Date('2026-03-01'),
      },
      {
        year: 2026,
        season: SemesterSeasonEnum.SPRING,
        dateFrom: new Date('2026-03-02'),
        dateTo: new Date('2026-08-31'),
      },
      {
        year: 2026,
        season: SemesterSeasonEnum.FALL,
        dateFrom: new Date('2026-09-01'),
        dateTo: new Date('2027-03-01'),
      },
      {
        year: 2027,
        season: SemesterSeasonEnum.SPRING,
        dateFrom: new Date('2027-03-02'),
        dateTo: new Date('2027-08-31'),
      },
      {
        year: 2027,
        season: SemesterSeasonEnum.FALL,
        dateFrom: new Date('2027-09-01'),
        dateTo: new Date('2028-03-01'),
      },
    ];

    const spaces: Omit<ISpace, 'id'>[] = [
      {
        name: '개인연습실 1',
        nameEng: 'Individual Practice Room 1',
        spaceType: SpaceTypeEnum.INDIVIDUAL,
      },
      {
        name: '개인연습실 2',
        nameEng: 'Individual Practice Room 2',
        spaceType: SpaceTypeEnum.INDIVIDUAL,
      },
      {
        name: '개인연습실 3',
        nameEng: 'Individual Practice Room 3',
        spaceType: SpaceTypeEnum.INDIVIDUAL,
      },
      {
        name: '피아노실 1',
        nameEng: 'Piano Room 1',
        spaceType: SpaceTypeEnum.PIANO,
      },
      {
        name: '피아노실 2',
        nameEng: 'Piano Room 2',
        spaceType: SpaceTypeEnum.PIANO,
      },
      {
        name: '세미나실 1',
        nameEng: 'Seminar Room 1',
        spaceType: SpaceTypeEnum.SEMINAR,
      },
      {
        name: '세미나실 2',
        nameEng: 'Seminar Room 2',
        spaceType: SpaceTypeEnum.SEMINAR,
      },
      {
        name: '무예실',
        nameEng: 'Dance Studio',
        spaceType: SpaceTypeEnum.DANCE,
      },
      {
        name: '합주실',
        nameEng: 'Group Practice Room',
        spaceType: SpaceTypeEnum.GROUP,
      },
      {
        name: '미래홀',
        nameEng: 'Mirae Hall',
        spaceType: SpaceTypeEnum.MIRAE,
      },
      {
        name: '조수미홀',
        nameEng: 'Sumi Jo Hall',
        spaceType: SpaceTypeEnum.SUMI,
      },
      {
        name: '창작공방',
        nameEng: 'Workshop',
        spaceType: SpaceTypeEnum.WORK,
      },
      {
        name: '옥상',
        nameEng: 'Rooftop',
        spaceType: SpaceTypeEnum.OPEN,
      },
      {
        name: '커뮤니티 마당',
        nameEng: 'Community Yard',
        spaceType: SpaceTypeEnum.OPEN,
      },
      {
        name: '전시계단',
        nameEng: 'Exhibition Stairs',
        spaceType: SpaceTypeEnum.OPEN,
      },
      {
        name: '모임터',
        nameEng: 'Meeting Space',
        spaceType: SpaceTypeEnum.OPEN,
      },
      {
        name: '로비',
        nameEng: 'Lobby',
        spaceType: SpaceTypeEnum.OPEN,
      },
    ];

    const users: IUserCreate[] = [
      {
        kaistUID: process.env.ADMIN_ID,
        nameKr: process.env.ADMIN_NAME_KR,
        nameEn: process.env.ADMIN_NAME_EN,
        userNumber: process.env.ADMIN_USER_NUMBER,
        email: process.env.ADMIN_EMAIL,
        type: UserTypeEnum.ADMIN,
      },
    ];

    await this.db.transaction(async (tx) => {
      await tx.insert(schema.User).values(users);
      await tx.insert(schema.Semester).values(semesters);
      await tx.insert(schema.Space).values(spaces);
    });

    return true;
  }
}
