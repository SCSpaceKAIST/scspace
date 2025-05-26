import { Logger, Injectable, BadRequestException } from '@nestjs/common';
import { ReservationStateEnum } from '@scspace-depot/enums/reservation.enum';
import { ReservationRepository } from './reservation.repository';
import { reservationMaxDayTime } from '@scspace-depot/consts/reservation.const';
import { UserPublicService } from '@scspace-server/feature/user/user.public.service';
import { SpacePublicService } from '@scspace-server/feature/space/space.public.service';
import { reservationMaxWeekTime } from '@scspace-depot/consts/reservation.const';
import { MReservationContent, MReservationSimple } from '@scspace-server/feature/reservation/reservation.model';
import { timeRangeCheck } from '@scspace-server/common/util';
import { IReservation, IReservationAll, IReservationContent, IReservationSimple } from '@scspace-depot/types/reservation';
import { getDate } from 'date-fns';
@Injectable()
export class ReservationPublicService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly spacePublicService: SpacePublicService,
    private readonly userPublicService: UserPublicService,
  ) {}

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

  // 일간 예약 시간을 계산하는 함수
  async getDailyReservationTime(
    userId: number,
    spaceId: number,
    timeFrom: number,
  ): Promise<number> {
    const today = new Date(timeFrom);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayReservations = await this.reservationRepository.fetch({
      userId: userId,
      spaceId: spaceId,
      state: ReservationStateEnum.GRANT,
      timeRange: {
        timeFrom: today.getTime(),
        timeTo: tomorrow.getTime(),
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
    const startOfWeek = new Date(timeFrom);
    startOfWeek.setDate(
      startOfWeek.getDate() - startOfWeek.getDay(),
    ); // 일요일로 설정
    startOfWeek.setHours(0, 0, 0, 0); // 시간 초기화

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(getDate(endOfWeek) + 7);

    const weeklyReservations = await this.reservationRepository.fetch({
      userId: userId,
      spaceId: spaceId,
      state: ReservationStateEnum.GRANT,
      timeRange: {
        timeFrom: startOfWeek.getTime(),
        timeTo: endOfWeek.getTime(),
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

    const newReservationTime = this.getDifferenceInMinutes(timeFrom, timeTo);
    const maxDayTime = reservationMaxDayTime[space.spaceType];
    const maxWeekTime = reservationMaxWeekTime[space.spaceType];

    // Check if the new reservation itself exceeds daily limit
    if (newReservationTime > maxDayTime) {
      throw new BadRequestException(
        `Reservation duration exceeds daily limit of ${maxDayTime} minutes for ${space.spaceType}`
      );
    }

    const daily = await this.getDailyReservationTime(userId, spaceId, timeFrom);
    const weekly = await this.getWeeklyReservationTime(userId, spaceId, timeFrom);
    const isWithinLimits = 
      daily + newReservationTime <= maxDayTime &&
      weekly + newReservationTime <= maxWeekTime;

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


  async checkReservationAvailability(
    userId: number,
    spaceId: number,
    timeFrom: number,
    timeTo: number,
  ): Promise<boolean> {
    return (
      (await this.checkTimeAvailability(spaceId, timeFrom, timeTo)) &&
      (await this.validateTimeConstraints(userId, spaceId, timeFrom, timeTo))
    );
  }

  async find(params: {
    userId?: number;
    spaceIds?: number[];
    timeRange?: { timeFrom: number; timeTo: number };
  }): Promise<MReservationSimple[]> {
    return this.reservationRepository.fetch(params);
  }

  async checkWholeTime(userId: number, spaceId: number, timeFrom: number, timeTo: number): Promise<void> {
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
}
