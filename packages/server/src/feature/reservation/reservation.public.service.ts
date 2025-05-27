import { Logger, Injectable, BadRequestException } from '@nestjs/common';
import { ReservationStateEnum } from '@scspace-depot/enums/reservation.enum';
import { ReservationRepository } from './reservation.repository';
import { reservationMaxDate, reservationMaxDayTime, reservationMaxWeekTime, reservationMinDate } from '@scspace-depot/consts/reservation.const';
import { UserPublicService } from '@scspace-server/feature/user/user.public.service';
import { SpacePublicService } from '@scspace-server/feature/space/space.public.service';
import { MReservationContent, MReservationSimple } from '@scspace-server/feature/reservation/reservation.model';
import { getNow, timeRangeCheck } from '@scspace-server/common/util';
import { IReservation, IReservationAll, IReservationContent, IReservationSimple } from '@scspace-depot/types/reservation';
import { getDate } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

@Injectable()
export class ReservationPublicService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly spacePublicService: SpacePublicService,
    private readonly userPublicService: UserPublicService,
  ) { }

  async fetchById(id: number): Promise<IReservationSimple | null> {
    const reservation = await this.reservationRepository.fetch({ id: id });
    if (reservation.length === 0) {
      return null;
    }
    return MReservationSimple.fromDB(reservation[0]);
  }

  private getDifferenceInMinutes(timeFrom: number, timeTo: number): number {
    return (timeTo - timeFrom);
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

    const todayReservations = await this.reservationRepository.fetch({
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
        this.getDifferenceInMinutes(
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
    const startOfWeek = BigInt(~~(timeFrom / (60 * 24 * 7))) * BigInt(60 * 24 * 7);
    const endOfWeek = startOfWeek + BigInt(60 * 24 * 7) - BigInt(1);

    const weeklyReservations = await this.reservationRepository.fetch({
      organizationId: organizationId,
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
        this.getDifferenceInMinutes(
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

    const todayReservations = await this.reservationRepository.fetch({
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
        this.getDifferenceInMinutes(
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

    const weeklyReservations = await this.reservationRepository.fetch({
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
        this.getDifferenceInMinutes(
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
    if (await this.userPublicService.isManager(userId)) {
      return true;
    }

    const space = await this.spacePublicService.fetchById(spaceId);
    if (!space) {
      throw new BadRequestException('Space not found');
    }

    // check min / max time
    const nowDay = (~~((getNow() / (60 * 24))))
    if (reservationMinDate[space.spaceType] > (~~(timeFrom / (60 * 24)) - nowDay)) {
      throw new BadRequestException('Date is too close');
    }
    if (reservationMaxDate[space.spaceType] < (~~(timeFrom / (60 * 24)) - nowDay)) {
      throw new BadRequestException('Date is too far');
    }

    const newReservationTime = this.getDifferenceInMinutes(timeFrom, timeTo);
    const maxDayTime = reservationMaxDayTime[space.spaceType];
    const maxWeekTime = reservationMaxWeekTime[space.spaceType];

    // Check if the new reservation itself exceeds daily limit
    if (newReservationTime > maxDayTime) {
      throw new BadRequestException(
        `Reservation duration exceeds daily limit of ${maxDayTime} minutes for ${space.spaceType}`
      );
    }

    let isWithinLimits = false;

    if (organizationId === 1) {
      const daily = await this.getDailyReservationTime(userId, spaceId, timeFrom);
      const weekly = await this.getWeeklyReservationTime(userId, spaceId, timeFrom);
      isWithinLimits =
        daily + newReservationTime <= maxDayTime &&
        weekly + newReservationTime <= maxWeekTime;
    } else {
      const daily = await this.getDailyReservationTimeByOrganization(organizationId, spaceId, timeFrom);
      const weekly = await this.getWeeklyReservationTimeByOrganization(organizationId, spaceId, timeFrom);
      isWithinLimits =
        daily + newReservationTime <= maxDayTime &&
        weekly + newReservationTime <= maxWeekTime;
    }

    if (!isWithinLimits) {
      throw new BadRequestException(
        `Total reservation time would exceed limits (daily: ${maxDayTime}, weekly: ${maxWeekTime}) for ${space.spaceType}`
      );
    }

    return isWithinLimits;
  }

  // 예약 시간 중복 검사
  async checkTimeAvailability(
    spaceId: number,
    timeFrom: number,
    timeTo: number,
  ): Promise<boolean> {
    const overlappingReservations = await this.reservationRepository.fetch({
      spaceId: spaceId,
      timeRange: {
        timeFrom: timeFrom,
        timeTo: timeTo,
      },
    });

    return overlappingReservations.length === 0; // 겹치는 예약이 있으면 false
  }


  async find(params: {
    userId?: number;
    spaceIds?: number[];
    timeRange?: { timeFrom: number; timeTo: number };
  }): Promise<MReservationSimple[]> {
    return this.reservationRepository.fetch(params);
  }

  async checkWholeTime(userId: number, organizationId: number, spaceId: number, timeFrom: number, timeTo: number): Promise<void> {
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
      const reservations = await this.reservationRepository.fetch({});
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
          content?.workerNeed || false
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
}
