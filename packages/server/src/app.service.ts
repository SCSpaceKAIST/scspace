import { Inject, Injectable } from '@nestjs/common';
import { AskPublicService } from './feature/ask/ask.public.service';
import { schema } from './db/schema';
import { SemesterPublicService } from './feature/semester/semester.public.service';
import { SpacePublicService } from './feature/space/space.public.service';
import { FaqPublicService } from './feature/faq/faq.public.service';
import { NoticePublicService } from './feature/notice/notice.public.service';
import { UserPublicService } from './feature/user/user.public.service';
import { DBAsyncProvider } from './db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { UserTypeEnum } from '@scspace-depot/enums/user.enum';
import { IUserCreate } from '@scspace-depot/types/user';
import { INoticeCreate } from '@scspace-depot/types/notice';
import { ISpace } from '@scspace-depot/types/space';
import { IFaq } from '@scspace-depot/types/faq';
import { SpaceTypeEnum } from '@scspace-depot/enums/space.enum';
import { SemesterSeasonEnum } from '@scspace-depot/enums/semester.enum';
import { ISemester } from '@scspace-depot/types/semester';
import { IAsk } from '@scspace-depot/types/ask';
import { AskStateEnum } from '@scspace-depot/enums/ask.enum';
@Injectable()
export class AppService {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
    private readonly userPublicService: UserPublicService,
    private readonly askPublicService: AskPublicService,
    private readonly semesterPublicService: SemesterPublicService,
    private readonly spacePublicService: SpacePublicService,
    private readonly faqPublicService: FaqPublicService,
    private readonly noticePublicService: NoticePublicService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async fillContent(): Promise<boolean> {
    const askCount = await this.askPublicService.getAskCount();
    const semesterCount = await this.semesterPublicService.getSemesterCount();
    const spaceCount = await this.spacePublicService.getSpaceCount();
    const faqCount = await this.faqPublicService.getFaqCount();
    const noticeCount = await this.noticePublicService.getNoticeCount();
    const userCount = await this.userPublicService.getUserCount();
    console.log(askCount, semesterCount, spaceCount, faqCount, noticeCount);

    if (
      askCount +
        semesterCount +
        spaceCount +
        faqCount +
        noticeCount +
        userCount !==
      0
    ) {
      return false;
    }

    const asks: Omit<IAsk, 'id'>[] = [
      {
        userId: 1,
        timePost: new Date(),
        title: '언제 열리나요?',
        content: '언제 열렸나요?',
        views: 0,
        state: AskStateEnum.SOLVE,
        comment: '지금부터 입니다.',
        commenterId: 1,
      },
    ];

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

    const faqs: Omit<IFaq, 'id'>[] = [
      {
        question: '사이트에서는 어떤 것들이 가능한가요?',
        answer: '현재 예약이 가능한 상태입니다',
        timePost: new Date(),
      },
      {
        question: '공간위실은 어디에 있나요?',
        answer: '장영신 학생회관 3층 끝에 있습니다!',
        timePost: new Date(),
      },
      {
        question: '공간위 상근 시간은 언제인가요?',
        answer:
          '월요일 ~ 수요일 오후 7시 ~ 오후 9시이며, 목요일은 즐대생/신대생으로 인해 오후 9시 ~ 오후 11시까지 상근을 진행합니다.',
        timePost: new Date(),
      },
      {
        question:
          '사이트에서 원하는 날짜에 예약이 되지 않는데, 따로 예약 요청을 드리면 되나요?',
        answer:
          '각 공간의 예약 가능 기간을 확인하시고 날짜에 맞춰 예약 부탁드립니다. 원칙적으로 모든 예약 요청은 사이트를 통해서만 가능합니다.',
        timePost: new Date(),
      },
      {
        question: '상근 시간이 아닐 경우 어떻게 연락을 해야 하나요?',
        answer:
          '잠긴 문, 장비 사용법 등 이용자의 점검 소홀로 인한 문제의 경우 긴급 지원 대상이 아니므로, 이메일을 남겨 주시면 나중에 처리해 드리겠습니다. 유선 연락은 긴급한 경우에만 부탁드립니다.',
        timePost: new Date(),
      },
      {
        question: '울림홀 프로젝터가 이상한 거 같아요!',
        answer:
          '울림홀 프로젝터와 일부 노트북 간 호환성 문제가 자주 보고되오니 사전에 점검 부탁드립니다.',
        timePost: new Date(),
      },
      {
        question: '고장 난 설비가 있어요!',
        answer:
          '고장의 경우, 저희 측에 이메일 보내주시면 처리하겠습니다. 다만, 장영신학생회관 보수 예산이 소진될 경우 실제 수리까지 시간이 소요되는 점 양해 부탁드립니다.',
        timePost: new Date(),
      },
      {
        question: 'How can foreigners use SCSPACE services?',
        answer:
          "We provide English translations for our official notices, and we try our best to provide a non-discriminatory service to everyone. Stop by our office in our office hours, and we'll try our best to aid you.",
        timePost: new Date(),
      },
      {
        question: '제가 붙인 포스터가 사라졌어요!',
        answer:
          '주체와 철거일자가 없거나 부착 허가 구역(게시판, 노출콘크리트, 난간)이 아닌 경우 사전 통보 없이 즉시 철거됩니다. 영리단체의 경우 공간위와의 사전 협의가 없이 부착된 경우 철거됩니다. 반드시 확인해주세요!',
        timePost: new Date(),
      },
    ];

    const notices: INoticeCreate[] = [
      {
        userId: 1,
        title: '공간위 사이트가 다시 개장했습니다!',
        content:
          '확장성을 위해 많은 코드 개편을 마치고, 다시 열렸습니다. 기존에 됐던 기능은 빠르게 수복하고, 새로운 기능은 더 빠르게 만들어가는 공간위 되겠습니다. 감사합니다.\n또한 SPARCS의 KWS 프로젝트로 해당 URL을 사용하여 개장할 수 있게 되었으니, URL 변경에 놀라지 마세요.',
        important: true,
      },
      {
        userId: 1,
        title: '많은 의견 보내주세요!',
        content:
          '열심히 만들었지만 아직 버그가 많습니다. 불편을 끼쳐 드려 죄송합니다. 버그가 발생하거나 원하시는 기능이 있으시다면 메일 보내주세요!',
        important: true,
      },
    ];

    const users: IUserCreate[] = [
      {
        kaistUID: 'khw3090',
        nameKr: '권혁원',
        nameEn: 'Kwon Hyukwon',
        userNumber: '20210044',
        email: 'gerbera3090@kaist.ac.kr',
        type: UserTypeEnum.ADMIN,
      },
    ];

    await this.db.transaction(async (tx) => {
      await tx.insert(schema.User).values(users);
      await tx.insert(schema.Semester).values(semesters);
      await tx.insert(schema.Space).values(spaces);
      await tx.insert(schema.Faq).values(faqs);
      await tx.insert(schema.Notice).values(notices);
      await tx.insert(schema.Ask).values(asks);
    });

    return true;
  }
}
