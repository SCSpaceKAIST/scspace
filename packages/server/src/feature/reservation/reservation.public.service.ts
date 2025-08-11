import { Logger, Injectable, BadRequestException } from '@nestjs/common';
import { ReservationStateEnum } from '@scspace-depot/enums/reservation.enum';
import { SpaceTypeEnum } from '@scspace-depot/enums/space.enum';
import { ReservationRepository } from './reservation.repository';
import {
  reservationMaxDate,
  reservationMaxDayTime,
  reservationMaxWeekTime,
  reservationMinDate,
  reservationTimeWeightOrg
} from '@scspace-depot/consts/reservation.const';
import { UserPublicService } from '@scspace-server/feature/user/user.public.service';
import { SpacePublicService } from '@scspace-server/feature/space/space.public.service';
import { MReservationContent, MReservationSimple } from '@scspace-server/feature/reservation/reservation.model';
import { getDate, getDateDiffInMinute, getDateString, getNow, getWeekPeriod, timeRangeCheck } from '@scspace-server/common/utils';
import { IReservationContent, IReservationSimple } from '@scspace-depot/types/reservation';
import { ISpace } from '@scspace-depot/types/space';
import { LotterySeminarService } from '../lottery/seminar/lottery.seminar.service';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

@Injectable()
export class ReservationPublicService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly spacePublicService: SpacePublicService,
    private readonly userPublicService: UserPublicService,
    private readonly lotterySeminarService: LotterySeminarService,
  ) { }

  async fetchById(id: number): Promise<IReservationSimple | null> {
    const { data: reservation } = await this.reservationRepository.fetch({ id: id });
    if (reservation.length === 0) {
      return null;
    }
    return MReservationSimple.fromDB(reservation[0]);
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

    const totalReservedTime = todayReservations.reduce((acc, reservation) => {
      return (
        acc +
        getDateDiffInMinute(
          reservation.timeFrom,
          reservation.timeTo,
        )
      );
    }, 0);
    return totalReservedTime;
  }

  // 주간 예약 시간을 계산하는 함수
  async getWeeklyReservationTimeByOrganization(
    organizationId: number,
    spaceId: number,
    timeFrom: number,
  ): Promise<number> {
    const { weekStart, weekEnd } = getWeekPeriod(timeFrom);

    const { data: weeklyReservations } = await this.reservationRepository.fetch({
      organizationId: organizationId,
      spaceId: spaceId,
      state: ReservationStateEnum.GRANT,
      timeRange: {
        timeFrom: weekStart,
        timeTo: weekEnd,
      },
    });

    console.log(getDateString(Number(weekStart)), getDateString(Number(weekEnd)));
    console.log(weeklyReservations);

    const totalReservedTime = weeklyReservations.reduce((acc, reservation) => {
      return (
        acc +
        getDateDiffInMinute(
          reservation.timeFrom,
          reservation.timeTo,
        )
      );
    }, 0);
    return totalReservedTime;
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

    const totalReservedTime = todayReservations.reduce((acc, reservation) => {
      return (
        acc +
        getDateDiffInMinute(
          reservation.timeFrom,
          reservation.timeTo,
        )
      );
    }, 0);
    return totalReservedTime;
  }

  // 주간 예약 시간을 계산하는 함수
  async getWeeklyReservationTime(
    userId: number,
    spaceId: number,
    timeFrom: number,
  ): Promise<number> {
    const startOfWeek = BigInt(~~(timeFrom / (60 * 24 * 7))) * BigInt(60 * 24 * 7);
    const endOfWeek = startOfWeek + BigInt(60 * 24 * 7) - BigInt(1);

    const { data: weeklyReservations } = await this.reservationRepository.fetch({
      userId: userId,
      spaceId: spaceId,
      state: ReservationStateEnum.GRANT,
      timeRange: {
        timeFrom: Number(startOfWeek),
        timeTo: Number(endOfWeek),
      },
    });

    const totalReservedTime = weeklyReservations.reduce((acc, reservation) => {
      return (
        acc +
        getDateDiffInMinute(
          reservation.timeFrom,
          reservation.timeTo,
        )
      );
    }, 0);
    return totalReservedTime;
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
    // if (await this.userPublicService.isManager(userId)) {
    //   return true;
    // }

    const dateFrom = getDate(timeFrom);
    const dateTo = getDate(timeTo - 1);
    if (dateFrom.getDate() !== dateTo.getDate()) {
      throw new BadRequestException('Cross-day reservations are not allowed. If you need to reserve across days, please create separate reservations for each day.');
    }

    const space = await this.spacePublicService.fetchById(spaceId);
    if (!space) {
      throw new BadRequestException('Space not found');
    }
    // check min / max time
    const nowDay = getNow();
    if (reservationMinDate[space.spaceType] * (24 * 60) > getDateDiffInMinute(nowDay, timeFrom)) {
      throw new BadRequestException(`Check the minimum reservation date. ${space.nameEn} can be reserved at least ${reservationMinDate[space.spaceType]} days in advance.`);
    }
    if (reservationMaxDate[space.spaceType] * (24 * 60) < getDateDiffInMinute(nowDay, timeFrom)) {
      throw new BadRequestException(`Check the maximum reservation date. ${space.nameEn} can be reserved at most ${reservationMaxDate[space.spaceType]} days in advance.`);
    }

    const newReservationTime = getDateDiffInMinute(timeFrom, timeTo);
    let maxDayTime = reservationMaxDayTime[space.spaceType];
    let maxWeekTime = reservationMaxWeekTime[space.spaceType];
    const orgWeight = reservationTimeWeightOrg[space.spaceType];

    // Check if the new reservation itself exceeds daily limit
    // if (newReservationTime > maxDayTime) {
    //   throw new BadRequestException(
    //     `Reservation duration exceeds daily limit : ${newReservationTime} / ${maxDayTime} minutes for ${space.nameEn}`
    //   );
    // }

    let isWithinDailyLimits = false;
    let isWithinWeeklyLimits = false;

    let daily = 0;
    let weekly = 0;

    if (organizationId === 1) {
      daily = await this.getDailyReservationTime(userId, spaceId, timeFrom);
      weekly = await this.getWeeklyReservationTime(userId, spaceId, timeFrom);
      isWithinDailyLimits = daily + newReservationTime <= maxDayTime;
      isWithinWeeklyLimits = weekly + newReservationTime <= maxWeekTime;
    } else {
      maxDayTime *= orgWeight;
      maxWeekTime *= orgWeight;
      daily = await this.getDailyReservationTimeByOrganization(organizationId, spaceId, timeFrom);
      weekly = await this.getWeeklyReservationTimeByOrganization(organizationId, spaceId, timeFrom);
      isWithinDailyLimits = daily + newReservationTime <= maxDayTime;
      isWithinWeeklyLimits = weekly + newReservationTime <= maxWeekTime;
    }

    if (!isWithinDailyLimits) {
      throw new BadRequestException(
        `Reservation duration exceeds limits\n(registered: ${daily + newReservationTime}min / limit: ${maxDayTime} min) for ${space.nameEn}`
      );
    }
    if (!isWithinWeeklyLimits) {
      throw new BadRequestException(
        `Reservation duration exceeds weekly limits\n(registered: ${weekly + newReservationTime}min / limit: ${maxWeekTime} min) for ${space.nameEn}`
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
    const { data: overlappingReservations } = await this.reservationRepository.fetch({
      spaceId: spaceId,
      timeRange: {
        timeFrom: timeFrom,
        timeTo: timeTo,
      },
    });

    if (overlappingReservations.length === 0)
      return true; // 겹치는 예약이 있으면 false
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

    if (!timeRangeCheck((timeFrom), (timeTo))) {
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

    const isOverlap = await this.checkTimeAvailability(
      spaceId,
      timeFrom,
      timeTo,
      reservationId
    );

    if (!isOverlap) {
      throw new BadRequestException('Time is already reserved');
    }
  }

  async getReservationContentById(id: number): Promise<IReservationContent> {
    return MReservationContent.fromDB(await this.reservationRepository.fetchContent(id));
  }

  async getReservationContentByIds(ids: number[]): Promise<IReservationContent[]> {
    const reservationContents = await Promise.all(ids.map(async (id) => await this.reservationRepository.fetchContent(id)));
    return reservationContents.map(MReservationContent.fromDB);
  }

  async backupReservations(): Promise<string> {
    try {
      // 모든 예약 데이터 가져오기
      const { data: reservations } = await this.reservationRepository.fetch({});
      const reservationContents = await Promise.all(reservations.map(reservation => this.reservationRepository.fetchContent(reservation.id)));

      // CSV 헤더와 데이터 생성
      const headers = ['id', 'userId', 'organizationId', 'spaceId', 'title',
        'timeFrom', 'timeTo', 'timePost', 'timeUpdate', 'state',
        'description', 'innerParticipantNumber', 'outerParticipantNumber', 'food', 'desk', 'chair', 'busking', 'workerNeed'
      ];

      const csvRows = reservations.map(reservation => {
        const content = reservationContents.find(content => content.id === reservation.id);
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
          content?.desk || false,
          content?.chair || false,
          content?.busking || false,
          content?.worker || false
        ];
      });

      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');

      // backup 디렉토리 생성
      const backupDir = path.join(__dirname, '../../../../../../../backup');
      const exists = fs.existsSync(backupDir);
      if (!exists) {
        await mkdir(backupDir, { recursive: true });
      }

      // 파일명 생성 (현재 시간 포함)
      const time = new Date()
      const timestamp_str = time.getFullYear() + '-' + time.getMonth() + '-' + time.getDate() + '-' + time.getHours() + '-' + time.getMinutes();
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
    timeTo: number
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
    const allLotteries = await this.lotterySeminarService.getAllSeminarLotteryInfo();

    for (const lottery of allLotteries) {
      // 추첨 시작 시간부터 행사 끝 시간까지의 기간
      const lotteryStartTime = BigInt(lottery.timeLotteryStart);
      const eventEndTime = BigInt(lottery.timeEnd);

      // 예약 시간과 추첨 기간이 겹치는지 확인
      // A: [timeFrom ---- timeTo] (예약)
      // B: [lotteryStartTime ---- eventEndTime] (추첨 기간)
      // 겹치지 않는 조건: timeTo <= lotteryStartTime OR timeFrom >= eventEndTime
      // 겹치는 조건: !(겹치지 않는 조건)
      const isOverlapping = !(timeTo <= lotteryStartTime || timeFrom >= eventEndTime);

      if (isOverlapping) {
        const startDate = getDateString(lottery.timeStart);
        const endDate = getDateString(lottery.timeEnd);
        throw new BadRequestException(
          `This period is reserved for seminar lottery from ${startDate} to ${endDate}. Reservation cannot be made until the lottery is completed.`
        );
      }
    }
  }
}
