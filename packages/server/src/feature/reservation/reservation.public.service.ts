import { Logger, Injectable, BadRequestException } from '@nestjs/common';
import { ReservationStateEnum } from '@scspace-depot/enums/reservation.enum';
import { ReservationRepository } from './reservation.repository';
import { reservationMaxDayTime } from '@scspace-depot/consts/reservation.const';
import { UserPublicService } from '@scspace-server/feature/user/user.public.service';
import { SpacePublicService } from '@scspace-server/feature/space/space.public.service';
import { reservationMaxWeekTime } from '@scspace-depot/consts/reservation.const';
import { MReservation } from '@scspace-server/feature/reservation/reservation.model';
import { formatDateToSQL } from '@scspace-server/common/util';
@Injectable()
export class ReservationPublicService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly spacePublicService: SpacePublicService,
    private readonly userPublicService: UserPublicService,
  ) {}

  private getDifferenceInMinutes(timeFrom: string, timeTo: string): number {
    return (new Date(timeTo).getTime() - new Date(timeFrom).getTime()) / (60 * 1000);
  }

  async checkTimeAvailability(
    spaceId: number,
    timeFrom: string,
    timeTo: string,
  ): Promise<boolean> {
    const overlappingReservations = await this.reservationRepository.find({
      spaceId: spaceId,
      timeRange: {
        timeFrom: timeFrom,
        timeTo: timeTo,
      },
    });

    return overlappingReservations.length === 0; // 겹치는 예약이 있으면 false
  }

  // 일간 예약 시간을 계산하는 함수
  async getDailyReservationTime(
    userId: number,
    spaceId: number,
    timeFrom: string,
  ): Promise<number> {
    const today = new Date(timeFrom);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayReservations = await this.reservationRepository.find({
      userId: userId,
      spaceId: spaceId,
      state: ReservationStateEnum.GRANT,
      timeRange: {
        timeFrom: formatDateToSQL(today),
        timeTo: formatDateToSQL(tomorrow),
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
    Logger.log('Daily totalReservedTime', totalReservedTime);
    // 예약된 시간이 없을 경우 0을 반환
    return totalReservedTime / (60 * 1000); // 밀리초를 분으로 변환
  }

  // 주간 예약 시간을 계산하는 함수
  async getWeeklyReservationTime(
    userId: number,
    spaceId: number,
    timeFrom: string,
  ): Promise<number> {
    const startOfWeek = new Date(timeFrom);
    startOfWeek.setDate(
      startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7),
    ); // 주의 시작일 (월요일)
    startOfWeek.setHours(0, 0, 0, 0); // 시간 초기화

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7); // 주의 끝일 (다음 주 월요일 0시 0분 0초)

    const weeklyReservations = await this.reservationRepository.find({
      userId: userId,
      spaceId: spaceId,
      state: ReservationStateEnum.GRANT,
      timeRange: {
        timeFrom: formatDateToSQL(startOfWeek),
        timeTo: formatDateToSQL(endOfWeek),
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
    Logger.log('Weekly totalReservedTime', totalReservedTime);
    return totalReservedTime; // 밀리초를 분으로 변환
  }

  async validateTimeConstraints(
    userId: number,
    spaceId: number,
    timeFrom: string,
    timeTo: string,
    options: {
      throwError?: boolean;
      excludeReservationId?: number;
    } = {}
  ): Promise<boolean> {
    // 공간위원이면 최대 시간 제한 없음
    if (await this.userPublicService.isManager(userId)) {
      return true;
    }

    const space = await this.spacePublicService.fetchById(spaceId);
    if (!space) {
      if (options.throwError) {
        throw new BadRequestException('Space not found');
      }
      return false;
    }

    const newReservationTime = this.getDifferenceInMinutes(timeFrom, timeTo);
    const maxDayTime = reservationMaxDayTime[space.spaceType];
    const maxWeekTime = reservationMaxWeekTime[space.spaceType];

    // Check if the new reservation itself exceeds daily limit
    if (newReservationTime > maxDayTime) {
      if (options.throwError) {
        throw new BadRequestException(
          `Reservation duration exceeds daily limit of ${maxDayTime} minutes for ${space.spaceType}`
        );
      }
      return false;
    }

    const daily = await this.getDailyReservationTime(userId, spaceId, timeFrom);
    const weekly = await this.getWeeklyReservationTime(userId, spaceId, timeFrom);

    const isWithinLimits = 
      daily + newReservationTime <= maxDayTime &&
      weekly + newReservationTime <= maxWeekTime;

    if (!isWithinLimits && options.throwError) {
      throw new BadRequestException(
        `Total reservation time would exceed limits (daily: ${maxDayTime}, weekly: ${maxWeekTime}) for ${space.spaceType}`
      );
    }

    return isWithinLimits;
  }

  async checkUserReservationTime(
    userId: number,
    spaceId: number,
    timeFrom: string,
    timeTo: string,
  ): Promise<boolean> {
    return this.validateTimeConstraints(userId, spaceId, timeFrom, timeTo);
  }

  async checkReservationAvailability(
    userId: number,
    spaceId: number,
    timeFrom: string,
    timeTo: string,
  ): Promise<boolean> {
    return (
      (await this.checkTimeAvailability(spaceId, timeFrom, timeTo)) &&
      (await this.checkUserReservationTime(userId, spaceId, timeFrom, timeTo))
    );
  }

  async find(params: {
    userId?: number;
    spaceIds?: number[];
    timeRange?: { timeFrom: string; timeTo: string };
  }): Promise<MReservation[]> {
    return this.reservationRepository.find(params);
  }
}
