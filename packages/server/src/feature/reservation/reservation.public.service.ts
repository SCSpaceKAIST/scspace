import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ReservationStateEnum } from '@scspace-depot/enums/reservation.enum';
import { SpaceTypeEnum } from '@scspace-depot/enums/space.enum';
import { ReservationRepository } from './reservation.repository';
import {
  reservationMaxDate,
  reservationMaxDayTime,
  reservationMaxWeekTime,
  reservationMinDate,
  reservationTimeWeightOrg,
} from '@scspace-depot/consts/reservation.const';
import { UserPublicService } from '@scspace-server/feature/user/user.public.service';
import { SpacePublicService } from '@scspace-server/feature/space/space.public.service';
import {
  MReservationContent,
  MReservationSimple,
} from '@scspace-server/feature/reservation/reservation.model';
import {
  checkContainAllId,
  getDate,
  getDateDiffInMinute,
  getDateString,
  getNow,
  getString,
  getWeekPeriod,
  takeAll,
  timeRangeCheck,
} from '@scspace-server/common/utils';
import {
  IReservationAll,
  IReservationContent,
  IReservationCreate,
  IReservationCreateMultiple,
  IReservationMultipleCreateResurt,
  IReservationSimple,
} from '@scspace-depot/types/reservation';
import { ISpace } from '@scspace-depot/types/space';
import { LotterySeminarService } from '../lottery/seminar/lottery.seminar.service';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { OrganizationPublicService } from '../organization/organization.public.service';
import { MailService } from '@scspace-server/tools/mailer/mail.service';
import { IUser } from '@scspace-depot/types/user';
import { ReservationMeta } from '@scspace-depot/enums/mail.enum';
import { LotteryPerformanceService } from '../lottery/performance/lottery.performance.service';
import { IOrganization } from '@scspace-depot/types/organization/organization.type';
import { UserUtils } from '@scspace-depot/utils/user.utils';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

@Injectable()
export class ReservationPublicService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly spacePublicService: SpacePublicService,
    private readonly userPublicService: UserPublicService,
    private readonly organizationPublicService: OrganizationPublicService,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => LotterySeminarService)) private readonly lotterySeminarService: LotterySeminarService,
    @Inject(forwardRef(() => LotteryPerformanceService)) private readonly lotteryPerformanceService: LotteryPerformanceService,
  ) { }

  async postMultipleReservation(
    reservationInput: IReservationCreateMultiple,
  ): Promise<IReservationMultipleCreateResurt> {
    const [user, organization, space] = await Promise.all([
      this.userPublicService.fetchById(reservationInput.userId),
      this.organizationPublicService.fetchById(reservationInput.organizationId),
      this.spacePublicService.fetchById(reservationInput.spaceId),
    ]);

    if (!user) throw new BadRequestException('User not found');
    if (!organization) throw new BadRequestException('Organization not found');
    if (!space) throw new BadRequestException('Space not found');
    if (!reservationInput.time)
      throw new BadRequestException('Time cannot be empty');

    if (!UserUtils.isManager(user.type)) {
      const userOrganizations =
        await this.organizationPublicService.fetchByUserId(
          reservationInput.userId,
        );
      if (
        !userOrganizations.some(
          (org) => org.id === reservationInput.organizationId,
        )
      ) {
        throw new BadRequestException(
          'User does not belong to the specified organization',
        );
      }
    }

    const result: {
      timeFrom: number;
      timeTo: number;
      success: boolean;
    }[] = [];

    for (const time of reservationInput.time) {
      try {
        await this.checkWholeTime(
          reservationInput.userId,
          reservationInput.organizationId,
          reservationInput.spaceId,
          time.timeFrom,
          time.timeTo,
        );

        const [reservation, _] = await this.reservationRepository.insert({
          ...reservationInput,
          timeFrom: time.timeFrom,
          timeTo: time.timeTo,
          content: reservationInput.content,
        } as IReservationCreate);

        if (!reservation) {
          result.push({
            timeFrom: time.timeFrom,
            timeTo: time.timeTo,
            success: false,
          });
          continue;
        }

        result.push({
          timeFrom: reservation.timeFrom,
          timeTo: reservation.timeTo,
          success: true,
        });
      } catch {
        result.push({
          timeFrom: time.timeFrom,
          timeTo: time.timeTo,
          success: false,
        });
      }
    }

    //result ~
    const resultItems = Object.values(result);

    const successCount = resultItems.filter((item) => item.success).length;
    const failCount = result.length - successCount;

    //main
    const conv = result.map((item) => ({
      timeFrom: getString(item.timeFrom),
      timeTo: getString(item.timeTo),
      success: item.success,
    }));

    const stats = {
      length: result.length,
      successCount: successCount,
      failCount: failCount,
    };

    const mailResult = {
      data: conv,
      ...stats
    }

    //for mailer Context
    const reservations: IReservationMultipleCreateResurt = {
      userId: reservationInput.userId,
      organizationId: reservationInput.organizationId,
      spaceId: reservationInput.spaceId,
      title: reservationInput.title,
      result,
      timePost: getNow(),
    } as IReservationMultipleCreateResurt;

    //Target Organization Delegator - Mail Sent to
    const delegator: IUser = await this.userPublicService.fetchById(
      organization.delegatorId,
    );
    const meta = { ...ReservationMeta.MultipleReservationCompleted };

    // Send Result Mail
    try {
      await this.mailService.sendMail({
        to: delegator.email,
        subject: `[SCSpace] Multi-Reservation Created - ${reservations.title}`,
        bcc: user.email,
        template: 'postMultipleReservation',
        replyTo: 'scspace@kaist.ac.kr',
        context: {
          reservations: {
            ...reservations,
            user,
            space,
            organization,
          },
          meta,
          result: mailResult,
        },
      });
    } catch (error) {
      console.log(error);
      await this.mailService.reportError(
        error instanceof Error ? error : new Error(String(error)),
        'Post Multiple Reservation - Mail Sector',
      );
    }

    return reservations;
  }

  async fetchById(id: number): Promise<IReservationSimple | null> {
    const { data: reservation } = await this.reservationRepository.fetch({
      id: id,
    });
    if (reservation.length === 0) {
      return null;
    }
    return MReservationSimple.fromDB(reservation[0]);
  }

  async getReservationBySpaceIDBetweenTime(
    spaceId: number,
    timeFrom?: number,
    timeTo?: number,
  ): Promise<IReservationAll[]> {

    if (timeFrom && timeTo) {
      if (timeFrom > timeTo) throw new BadRequestException('timeFrom must be before timeTo');
      const oneDayInMs = BigInt(60) * BigInt(24);
      timeTo = Number(BigInt(timeTo) + oneDayInMs - BigInt(1));
    }
    // If either timeFrom or timeTo is missing, fetch all reservations for the space
    const { data: reservations } = await this.reservationRepository.fetch({
      spaceId,
      ...(timeFrom && timeTo ? { timeRange: { timeFrom: timeFrom, timeTo: timeTo } } : {})
    });
    if (reservations.length === 0) {
      return [];
    }

    const userIds = reservations.map((reservation) => reservation.userId);
    const organizationIds = reservations.map((reservation) => reservation.organizationId);

    const [users, space, organizations, reservationContents] = await Promise.all([
      this.userPublicService.fetchAllByIds(userIds).then(takeAll(userIds, 'users')),
      this.spacePublicService.fetchById(spaceId),
      this.organizationPublicService.fetchByIds(organizationIds),
      this.getReservationContentByIds(reservations.map((reservation) => reservation.id)),
    ]) as [IUser[], ISpace, IOrganization[], IReservationContent[]];

    const workerIds = reservationContents.map(content => content.workerId).filter(id => id !== 0);
    const workers = await this.userPublicService.fetchAllByIds(workerIds)
      .then(takeAll(workerIds, 'workers'));

    checkContainAllId(userIds, users, 'users');
    checkContainAllId(organizationIds, organizations, 'organizations');
    checkContainAllId(workerIds, workers, 'workers');

    return reservations.map((reservation) => {
      const content = reservationContents.find(content => content.id === reservation.id)!;
      return {
        ...reservation,
        user: users.find(user => user.id === reservation.userId)!,
        organization: organizations.find(org => org.id === reservation.organizationId)!,
        space,
        worker: (content.workerId === 0) ? null : workers.find(worker => worker.id === content.workerId)!,
        content
      };
    });
  }

  async getDailyReservationTimeByOrganization(
    organizationId: number,
    spaceId: number,
    timeFrom: number,
  ): Promise<number> {
    if (!timeFrom) {
      throw new BadRequestException('timeFrom is required');
    }

    const startOfDay = BigInt(~~(timeFrom / (60 * 24))) * BigInt(60 * 24);
    const endOfDay = startOfDay + BigInt(60 * 24) - BigInt(1);

    const { data: todayReservations } = await this.reservationRepository.fetch({
      organizationId: organizationId,
      spaceId: spaceId,
      state: ReservationStateEnum.GRANT,
      timeRange: {
        timeFrom: Number(startOfDay),
        timeTo: Number(endOfDay),
      },
    });

    return todayReservations.reduce((acc, reservation) => {
      return (
        acc + getDateDiffInMinute(reservation.timeFrom, reservation.timeTo)
      );
    }, 0);
  }

  // 주간 예약 시간을 계산하는 함수
  async getWeeklyReservationTimeByOrganization(
    organizationId: number,
    spaceId: number,
    timeFrom: number,
  ): Promise<number> {
    const { weekStart, weekEnd } = getWeekPeriod(timeFrom);

    const { data: weeklyReservations } = await this.reservationRepository.fetch(
      {
        organizationId: organizationId,
        spaceId: spaceId,
        state: ReservationStateEnum.GRANT,
        timeRange: {
          timeFrom: weekStart,
          timeTo: weekEnd,
        },
      },
    );

    return weeklyReservations.reduce((acc, reservation) => {
      return (
        acc + getDateDiffInMinute(reservation.timeFrom, reservation.timeTo)
      );
    }, 0);
  }

  // 일간 예약 시간을 계산하는 함수
  async getDailyReservationTime(
    userId: number,
    spaceId: number,
    timeFrom: number,
  ): Promise<number> {
    if (!timeFrom) {
      throw new BadRequestException('timeFrom is required');
    }

    const startOfDay = BigInt(~~(timeFrom / (60 * 24))) * BigInt(60 * 24);
    const endOfDay = startOfDay + BigInt(60 * 24) - BigInt(1);

    const { data: todayReservations } = await this.reservationRepository.fetch({
      userId: userId,
      spaceId: spaceId,
      state: ReservationStateEnum.GRANT,
      timeRange: {
        timeFrom: Number(startOfDay),
        timeTo: Number(endOfDay),
      },
    });

    return todayReservations.reduce((acc, reservation) => {
      return (
        acc + getDateDiffInMinute(reservation.timeFrom, reservation.timeTo)
      );
    }, 0);
  }

  // 주간 예약 시간을 계산하는 함수
  async getWeeklyReservationTime(
    userId: number,
    spaceId: number,
    timeFrom: number,
  ): Promise<number> {
    const startOfWeek =
      BigInt(~~(timeFrom / (60 * 24 * 7))) * BigInt(60 * 24 * 7);
    const endOfWeek = startOfWeek + BigInt(60 * 24 * 7) - BigInt(1);

    const { data: weeklyReservations } = await this.reservationRepository.fetch(
      {
        userId: userId,
        spaceId: spaceId,
        state: ReservationStateEnum.GRANT,
        timeRange: {
          timeFrom: Number(startOfWeek),
          timeTo: Number(endOfWeek),
        },
      },
    );

    return weeklyReservations.reduce((acc, reservation) => {
      return (
        acc + getDateDiffInMinute(reservation.timeFrom, reservation.timeTo)
      );
    }, 0);
  }

  // 시간 제한을 넘어섰는지 검사 (일일, 주간)
  async validateTimeConstraints(
    userId: number,
    organizationId: number,
    spaceId: number,
    timeFrom: number,
    timeTo: number,
  ): Promise<boolean> {
    // 공간위원이면 최대 시간 제한 없음
    if (await this.userPublicService.isManager(userId)) {
      return true;
    }

    const dateFrom = getDate(timeFrom);
    const dateTo = getDate(timeTo - 1);
    if (dateFrom.getDate() !== dateTo.getDate()) {
      throw new BadRequestException(
        'Cross-day reservations are not allowed. If you need to reserve across days, please create separate reservations for each day.',
      );
    }

    const space = await this.spacePublicService.fetchById(spaceId);
    if (!space) {
      throw new BadRequestException('Space not found');
    }
    // check min / max time
    const nowDay = getNow();
    if (
      reservationMinDate[space.spaceType] * (24 * 60) >
      getDateDiffInMinute(nowDay, timeFrom)
    ) {
      throw new BadRequestException(
        `Check the minimum reservation date. ${space.nameEn} can be reserved at least ${reservationMinDate[space.spaceType]} days in advance. (Left days: ${reservationMinDate[space.spaceType] - Math.floor(getDateDiffInMinute(nowDay, timeFrom) / (24 * 60))})`,
      );
    }
    if (
      reservationMaxDate[space.spaceType] * (24 * 60) <
      getDateDiffInMinute(nowDay, timeFrom)
    ) {
      throw new BadRequestException(
        `Check the maximum reservation date. ${space.nameEn} can be reserved at most ${reservationMaxDate[space.spaceType]} days in advance. (Left days: ${reservationMaxDate[space.spaceType] - Math.floor(getDateDiffInMinute(nowDay, timeFrom) / (24 * 60))})`,
      );
    }

    const newReservationTime = getDateDiffInMinute(timeFrom, timeTo);
    let maxDayTime = reservationMaxDayTime[space.spaceType];
    let maxWeekTime = reservationMaxWeekTime[space.spaceType];
    const orgWeight = reservationTimeWeightOrg[space.spaceType];

    // Check if the new reservation itself exceeds the daily limit
    // if (newReservationTime > maxDayTime) {
    //   throw new BadRequestException(
    //     `Reservation duration exceeds daily limit: ${newReservationTime} / ${maxDayTime} minutes for ${space.nameEn}`
    //   );
    // }

    let isWithinDailyLimits: boolean;
    let isWithinWeeklyLimits: boolean;

    let daily: number;
    let weekly: number;

    if (organizationId === 1) {
      daily = await this.getDailyReservationTime(userId, spaceId, timeFrom);
      weekly = await this.getWeeklyReservationTime(userId, spaceId, timeFrom);
      isWithinDailyLimits = daily + newReservationTime <= maxDayTime;
      isWithinWeeklyLimits = weekly + newReservationTime <= maxWeekTime;
    } else {
      maxDayTime *= orgWeight;
      maxWeekTime *= orgWeight;
      daily = await this.getDailyReservationTimeByOrganization(
        organizationId,
        spaceId,
        timeFrom,
      );
      weekly = await this.getWeeklyReservationTimeByOrganization(
        organizationId,
        spaceId,
        timeFrom,
      );
      isWithinDailyLimits = daily + newReservationTime <= maxDayTime;
      isWithinWeeklyLimits = weekly + newReservationTime <= maxWeekTime;
    }

    if (!isWithinDailyLimits) {
      throw new BadRequestException(
        `Reservation duration exceeds limits\n(registered: ${daily + newReservationTime}min / limit: ${maxDayTime} min) for ${space.nameEn}`,
      );
    }
    if (!isWithinWeeklyLimits) {
      throw new BadRequestException(
        `Reservation duration exceeds weekly limits\n(registered: ${weekly + newReservationTime}min / limit: ${maxWeekTime} min) for ${space.nameEn}`,
      );
    }

    return isWithinWeeklyLimits && isWithinDailyLimits;
  }

  // 예약 시간 중복 검사
  async checkTimeAvailability(
    spaceId: number,
    timeFrom: number,
    timeTo: number,
    reservationId: number,
  ): Promise<boolean> {
    const { data: overlappingReservations } =
      await this.reservationRepository.fetch({
        spaceId: spaceId,
        timeRange: {
          timeFrom: timeFrom,
          timeTo: timeTo,
        },
      });

    if (overlappingReservations.length === 0) return true; // 겹치는 예약이 있으면 false
    if (
      overlappingReservations.length === 1 &&
      overlappingReservations[0].id === reservationId
    )
      return true; // 예약 ID가 일치하면 겹치지 않는 것으로 간주
    return false; // 겹치는 예약이 있으면 false
  }

  async find(params: {
    userId?: number;
    spaceIds?: number[];
    timeRange?: { timeFrom: number; timeTo: number };
  }): Promise<MReservationSimple[]> {
    return (await this.reservationRepository.fetch(params)).data;
  }

  async checkWholeTime(
    userId: number,
    organizationId: number,
    spaceId: number,
    timeFrom: number,
    timeTo: number,
    reservationId: number = 0,
  ): Promise<void> {
    if (!timeFrom || !timeTo) {
      throw new BadRequestException('timeFrom and timeTo are required');
    }

    if (!timeRangeCheck(timeFrom, timeTo)) {
      throw new BadRequestException('timeFrom must be before timeTo');
    }
    if (timeFrom === timeTo) {
      timeTo = Number(BigInt(timeFrom) + BigInt(60 * 24) - BigInt(1));
    }

    const isAvailable = await this.validateTimeConstraints(
      userId,
      organizationId,
      spaceId,
      timeFrom,
      timeTo,
    );

    if (!isAvailable) {
      throw new BadRequestException('Time is not available');
    }

    // 미래홀과 수미홀의 추가 시간 제약 검증
    const space = await this.spacePublicService.fetchById(spaceId);
    if (!space) {
      throw new BadRequestException('Space not found');
    }
    await this.validateSpaceTimeConstraints(
      userId,
      organizationId,
      space,
      timeFrom,
      timeTo,
    );

    const isOverlap = await this.checkTimeAvailability(
      spaceId,
      timeFrom,
      timeTo,
      reservationId,
    );

    if (!isOverlap) {
      throw new BadRequestException('Time is already reserved');
    }
  }

  async getReservationContentById(id: number): Promise<IReservationContent> {
    return MReservationContent.fromDB(
      await this.reservationRepository.fetchContent(id),
    );
  }

  async getReservationContentByIds(
    ids: number[],
  ): Promise<IReservationContent[]> {
    const reservationContents = await Promise.all(
      ids.map(async (id) => await this.reservationRepository.fetchContent(id)),
    );
    return reservationContents.map(MReservationContent.fromDB);
  }

  async backupReservations(): Promise<string> {
    try {
      // 모든 예약 데이터 가져오기
      const { data: reservations } = await this.reservationRepository.fetch({});
      const reservationContents = await Promise.all(
        reservations.map((reservation) =>
          this.reservationRepository.fetchContent(reservation.id),
        ),
      );

      // CSV 헤더와 데이터 생성
      const headers = [
        'id',
        'userId',
        'organizationId',
        'spaceId',
        'title',
        'timeFrom',
        'timeTo',
        'timePost',
        'timeUpdate',
        'state',
        'description',
        'innerParticipantNumber',
        'outerParticipantNumber',
        'food',
        'desk',
        'chair',
        'busking',
        'workerNeed',
      ];

      const csvRows = reservations.map((reservation) => {
        const content = reservationContents.find(
          (content) => content.id === reservation.id,
        );
        return [
          reservation.id,
          reservation.userId,
          reservation.organizationId,
          reservation.spaceId,
          reservation.title,
          reservation.timeFrom,
          reservation.timeTo,
          reservation.timePost,
          reservation.timeUpdate,
          reservation.state,
          content?.description || '',
          content?.innerParticipantNumber || 0,
          content?.outerParticipantNumber || 0,
          content?.food || false,
          content?.busking || false,
          content?.workerNeed || false,
          content?.workerId || 0,
        ];
      });

      const csvContent = [
        headers.join(','),
        ...csvRows.map((row) => row.join(',')),
      ].join('\n');

      // backup 디렉토리 생성
      const backupDir = path.join(__dirname, '../../../../../../../backup');
      const exists = fs.existsSync(backupDir);
      if (!exists) {
        await mkdir(backupDir, { recursive: true });
      }

      // 파일명 생성 (현재 시간 포함)
      const time = new Date();
      const timestamp_str =
        time.getFullYear() +
        '-' +
        time.getMonth() +
        '-' +
        time.getDate() +
        '-' +
        time.getHours() +
        '-' +
        time.getMinutes();
      const filename = `reservation_${timestamp_str}.csv`;
      const filepath = path.join(backupDir, filename);

      // CSV 파일 저장
      await writeFile(filepath, csvContent);
      return filepath;
    } catch (error) {
      Logger.error('Failed to backup reservations:', error);
      throw new BadRequestException('Failed to backup reservations');
    }
  }

  /**
   * 세미나실 예약 시 추첨 기간과 겹치는지 검증
   * @param userId 사용자 ID
   * @param space 예약하려는 공간 정보
   * @param timeFrom 예약 시작 시간 (timestamp)
   * @param timeTo 예약 종료 시간 (timestamp)
   */
  async validateSeminarLotteryConflict(
    userId: number,
    space: ISpace,
    timeFrom: number,
    timeTo: number,
  ): Promise<void> {
    // 세미나실이 아니면 검증하지 않음
    if (space.spaceType !== SpaceTypeEnum.SEMINAR) {
      return;
    }

    // 공간위원이면 추첨 기간과 겹쳐도 예약 가능
    if (await this.userPublicService.isManager(userId)) {
      return;
    }

    // 모든 추첨 정보 조회 (시간 순으로 정렬됨)
    const allLotteries =
      await this.lotterySeminarService.getAllSeminarLotteryInfo();

    for (const lottery of allLotteries) {
      // 추첨 시작 시간부터 행사 끝 시간까지의 기간
      const eventStartTime = BigInt(lottery.timeStart);
      const eventEndTime = BigInt(lottery.timeEnd);
      const applied = lottery.applied;

      // 예약 시간과 추첨 기간이 겹치는지 확인
      // A: [timeFrom ---- timeTo] (예약)
      // B: [lotteryStartTime ---- eventEndTime] (추첨 기간)
      // 겹치지 않는 조건: timeTo <= lotteryStartTime OR timeFrom >= eventEndTime
      // 겹치는 조건: !(겹치지 않는 조건)
      const isOverlapping = !(
        timeTo <= eventStartTime ||
        timeFrom >= eventEndTime ||
        applied
      );

      if (isOverlapping) {
        const startDate = getDateString(lottery.timeStart);
        const endDate = getDateString(lottery.timeEnd);
        throw new BadRequestException(
          `This period is reserved for seminar room regular reservation lottery (세미나실 정기예약 추첨) from ${startDate} to ${endDate}. Reservation cannot be made until the lottery is completed.`,
        );
      }
    }
  }

  /**
     * 조수미홀, 미래홀 예약 시 추첨 기간과 겹치는지 검증
     * @param userId 사용자 ID
     * @param space 예약하려는 공간 정보
     * @param timeFrom 예약 시작 시간 (timestamp)
     * @param timeTo 예약 종료 시간 (timestamp)
     */
  async validatePerformanceLotteryConflict(
    userId: number,
    space: ISpace,
    timeFrom: number,
    timeTo: number,
  ): Promise<void> {
    // 조수미홀, 미래홀 이 아니면 검증하지 않음
    if (space.spaceType !== SpaceTypeEnum.SUMI && space.spaceType !== SpaceTypeEnum.MIRAE) {
      return;
    }

    // 공간위원이면 추첨 기간과 겹쳐도 예약 가능
    if (await this.userPublicService.isManager(userId)) {
      return;
    }

    // 모든 추첨 정보 조회 (시간 순으로 정렬됨)
    const allLotteries =
      await this.lotteryPerformanceService.getAllPerformanceLotteryInfo();

    for (const lottery of allLotteries) {
      // 추첨 시작 시간부터 행사 끝 시간까지의 기간
      const eventStartTime = BigInt(lottery.timeStart);
      const eventEndTime = BigInt(lottery.timeEnd);
      const applied = lottery.applied;

      // 예약 시간과 추첨 기간이 겹치는지 확인
      // A: [timeFrom ---- timeTo] (예약)
      // B: [lotteryStartTime ---- eventEndTime] (추첨 기간)
      // 겹치지 않는 조건: timeTo <= lotteryStartTime OR timeFrom >= eventEndTime
      // 겹치는 조건: !(겹치지 않는 조건)
      const isOverlapping = !(
        timeTo <= eventStartTime ||
        timeFrom >= eventEndTime ||
        applied
      );

      if (isOverlapping) {
        const startDate = getDateString(lottery.timeStart);
        const endDate = getDateString(lottery.timeEnd);
        throw new BadRequestException(
          `This period is reserved for performance period lottery (공연집중기간 추첨) from ${startDate} to ${endDate}. Reservation cannot be made until the lottery is completed.`,
        );
      }
    }
  }

  async validateSpaceTimeConstraints(
    userId: number,
    organizationId: number,
    space: ISpace,
    timeFrom: number,
    timeTo: number,
  ): Promise<void> {
    if (space.spaceType !== SpaceTypeEnum.SUMI && space.spaceType !== SpaceTypeEnum.MIRAE) {
      return;
    }

    if (await this.userPublicService.isManager(userId)) {
      return;
    }

    if (organizationId === 1) {
      return;
    }

    const { weekStart, weekEnd } = getWeekPeriod(timeFrom);
    const reservations = await this.reservationRepository.fetch({
      spaceId: space.id,
      organizationId,
      timeRange: {
        timeFrom: weekStart,
        timeTo: weekEnd,
      },
    });

    let matchReservation: MReservationSimple[] | null = null;
    if (organizationId === 1) {
      matchReservation = reservations.data.filter((reservation) => (reservation.userId === userId && reservation.organizationId === 1));
    } else {
      matchReservation = reservations.data.filter((reservation) => reservation.organizationId === organizationId);
    }

    let checkArray: number[] = new Array(7).fill(0);

    if (matchReservation) {
      for (let i = 0; i < reservations.data.length; i++) {
        const reservationFromTime = Math.floor(reservations.data[i].timeFrom / (24 * 60));
        const reservationToTime = Math.floor(reservations.data[i].timeTo / (24 * 60));

        checkArray[reservationFromTime % 7] += 1;
        checkArray[reservationToTime % 7] += 1;
      }
      checkArray[Math.floor(timeFrom / (24 * 60)) % 7] += 1;
      checkArray[Math.floor(timeTo / (24 * 60)) % 7] += 1;

      let count: number = 0;
      for (let i = 0; i < 7; i++) {
        if (checkArray[i] > 1) {
          count += 1;
        }
      }

      if (count > 2) {
        throw new BadRequestException('Mirae Hall and Sumi Hall can only be reserved for up to 2 days per week.');
      }
    }
  }
}
